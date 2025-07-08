import { GeminiResponse, ChatSettings } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiService {
  private static async makeRequest(
    prompt: string, 
    settings: ChatSettings,
    conversationHistory: Array<{role: string, content: string}> = [],
    retries = 3
  ): Promise<{ response: string; tokens?: number }> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    const model = settings.model || 'gemini-1.5-flash';
    const apiUrl = `${GEMINI_API_URL}/${model}:generateContent`;

    // Build conversation context
    const contents = [];
    
    // Add system prompt if provided
    if (settings.systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: `System: ${settings.systemPrompt}` }]
      });
    }

    // Add conversation history (limit to last 10 exchanges to prevent token overflow)
    const recentHistory = conversationHistory.slice(-20);
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const requestBody = {
      contents,
      generationConfig: {
        temperature: Math.max(0, Math.min(1, settings.temperature || 0.7)),
        topK: 40,
        topP: 0.95,
        maxOutputTokens: Math.max(100, Math.min(4000, settings.maxTokens || 2048)),
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
          
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
          }
          if (response.status === 403) {
            throw new Error('API access denied. Please check your API key.');
          }
          
          throw new Error(`API request failed: ${errorMessage}`);
        }

        const data: GeminiResponse = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
          throw new Error('No response generated from Gemini API');
        }

        const candidate = data.candidates[0];
        
        if (candidate.finishReason === 'SAFETY') {
          return {
            response: "I apologize, but I can't provide a response to that request due to safety guidelines. Please try rephrasing your question.",
            tokens: data.usageMetadata?.totalTokenCount
          };
        }

        if (candidate.finishReason === 'RECITATION') {
          return {
            response: "I can't provide that response as it may contain copyrighted content. Please try asking in a different way.",
            tokens: data.usageMetadata?.totalTokenCount
          };
        }

        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          throw new Error('Invalid response structure from Gemini API');
        }

        const responseText = candidate.content.parts[0].text || "I apologize, but I couldn't generate a proper response. Please try again.";
        
        return {
          response: responseText.trim(),
          tokens: data.usageMetadata?.totalTokenCount
        };
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        
        if (attempt === retries - 1) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Failed to get response from AI service');
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Max retries exceeded');
  }

  static async generateResponse(
    prompt: string, 
    settings: ChatSettings,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<{ response: string; tokens?: number }> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Please enter a message');
    }

    return this.makeRequest(prompt.trim(), settings, conversationHistory);
  }

  static getAvailableModels(): string[] {
    return [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
  }

  static validateSettings(settings: ChatSettings): ChatSettings {
    return {
      ...settings,
      temperature: Math.max(0, Math.min(1, settings.temperature || 0.7)),
      maxTokens: Math.max(100, Math.min(4000, settings.maxTokens || 2048)),
      model: this.getAvailableModels().includes(settings.model) ? settings.model : 'gemini-1.5-flash'
    };
  }
}