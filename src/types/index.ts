export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  tokens?: number;
  model?: string;
  attachments?: Attachment[];
  reactions?: Reaction[];
  isEdited?: boolean;
  originalContent?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'code';
  name: string;
  url?: string;
  content?: string;
  language?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
  tags?: string[];
  model?: string;
  temperature?: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  autoSave: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  showTimestamps: boolean;
  showTokenCount: boolean;
}

export interface SearchResult {
  sessionId: string;
  messageId: string;
  content: string;
  timestamp: Date;
  relevance: number;
}