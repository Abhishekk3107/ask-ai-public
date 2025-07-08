import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useChatSessions } from './hooks/useChatSessions';
import { useSettings } from './hooks/useSettings';
import { GeminiService } from './services/gemini';
import { Message } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const { user, isLoading: authLoading, isInitialized, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();
  const { theme } = useTheme();
  const { 
    sessions, 
    currentSession, 
    setCurrentSession,
    createNewSession, 
    updateSession, 
    deleteSession,
    addMessage,
    updateMessage,
    archiveSession,
    duplicateSession,
    isLoading: sessionsLoading
  } = useChatSessions(user?.id || null);
  const { settings, updateSettings, resetSettings } = useSettings(user?.id || null);

  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoginLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  };

  const handleEmailRegister = async (userData: { name: string; email: string; password: string }) => {
    try {
      await registerWithEmail(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleSendMessage = async (content: string, attachments?: any[]) => {
    if (!content.trim()) return;

    let sessionToUse = currentSession;
    
    // Create new session if none exists
    if (!sessionToUse) {
      sessionToUse = createNewSession();
      setCurrentSession(sessionToUse);
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
      attachments
    };

    const loadingMessage: Message = {
      id: uuidv4(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    try {
      // Add user message first
      await addMessage(sessionToUse.id, userMessage);
      
      // Add loading message
      await addMessage(sessionToUse.id, loadingMessage);
      
      setIsLoadingResponse(true);

      // Build conversation history from the current session
      const updatedSession = sessions.find(s => s.id === sessionToUse.id) || sessionToUse;
      const conversationHistory = updatedSession.messages
        .filter(msg => !msg.isLoading) // Exclude loading messages
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        }));

      // Add the new user message to history
      conversationHistory.push({
        role: 'user',
        content: content.trim()
      });

      // Validate settings before making request
      const validatedSettings = GeminiService.validateSettings(settings);

      const { response, tokens } = await GeminiService.generateResponse(
        content.trim(), 
        validatedSettings,
        conversationHistory.slice(-20) // Keep last 20 messages for context
      );
      
      // Update loading message with response
      await updateMessage(sessionToUse.id, loadingMessage.id, { 
        content: response, 
        isLoading: false,
        tokens,
        model: validatedSettings.model
      });

      // Auto-generate session title if it's the first exchange
      const finalSession = sessions.find(s => s.id === sessionToUse.id) || sessionToUse;
      if (finalSession.messages.filter(m => !m.isLoading).length <= 2) {
        const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
        await updateSession(sessionToUse.id, { title });
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      let errorMessage = 'I apologize, but I encountered an error while processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'API key is not configured properly. Please check your environment variables and ensure VITE_GEMINI_API_KEY is set correctly.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error occurred. Please check your internet connection and try again.';
        } else if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('Rate limit')) {
          errorMessage = 'API quota exceeded. Please try again later or check your API usage limits.';
        } else if (error.message.includes('safety')) {
          errorMessage = 'I cannot provide a response to that request due to safety guidelines. Please try rephrasing your question.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again with a shorter message.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Update loading message with error
      await updateMessage(sessionToUse.id, loadingMessage.id, { 
        content: errorMessage, 
        isLoading: false 
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleUpdateMessage = async (messageId: string, updates: Partial<Message>) => {
    if (currentSession) {
      await updateMessage(currentSession.id, messageId, updates);
    }
  };

  const handleRegenerateResponse = async (messageId: string) => {
    if (!currentSession) return;

    const messageIndex = currentSession.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const previousUserMessage = currentSession.messages[messageIndex - 1];
    if (!previousUserMessage || !previousUserMessage.isUser) return;

    // Set the message to loading state
    await updateMessage(currentSession.id, messageId, { isLoading: true, content: '' });
    setIsLoadingResponse(true);

    try {
      const conversationHistory = currentSession.messages.slice(0, messageIndex - 1).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      const validatedSettings = GeminiService.validateSettings(settings);

      const { response, tokens } = await GeminiService.generateResponse(
        previousUserMessage.content,
        validatedSettings,
        conversationHistory
      );

      await updateMessage(currentSession.id, messageId, {
        content: response,
        isLoading: false,
        tokens,
        model: validatedSettings.model
      });
    } catch (error) {
      console.error('Error regenerating response:', error);
      await updateMessage(currentSession.id, messageId, {
        content: 'Failed to regenerate response. Please try again.',
        isLoading: false
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleExportChat = () => {
    if (!currentSession) return;

    const exportData = {
      title: currentSession.title,
      messages: currentSession.messages,
      createdAt: currentSession.createdAt,
      updatedAt: currentSession.updatedAt
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareChat = async () => {
    if (!currentSession) return;

    const shareText = `Check out this conversation with Ask AI:\n\n${currentSession.title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ask AI Conversation',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        // Show toast notification
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleBookmarkMessage = (messageId: string) => {
    // Implementation for bookmarking messages
    console.log('Bookmark message:', messageId);
  };

  const handleExportData = () => {
    const exportData = {
      sessions,
      settings,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ask_ai_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      sessions.forEach(session => deleteSession(session.id));
      resetSettings();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white rounded-full"
        />
      </div>
    );
  }

  if (!user || !isInitialized) {
    return (
      <ErrorBoundary>
        <LoginForm 
          onEmailLogin={handleEmailLogin}
          onEmailRegister={handleEmailRegister}
          onGoogleLogin={handleGoogleLogin} 
          isGoogleLoading={googleLoginLoading}
          isInitialized={isInitialized}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto"
            >
              <Sidebar
                sessions={sessions}
                currentSession={currentSession}
                onSessionSelect={(session) => {
                  setCurrentSession(session);
                  setIsSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                onNewSession={() => {
                  const newSession = createNewSession();
                  setCurrentSession(newSession);
                  setIsSidebarOpen(false); // Close sidebar on mobile after creating new session
                }}
                onDeleteSession={deleteSession}
                onArchiveSession={archiveSession}
                onDuplicateSession={duplicateSession}
                onUpdateSession={updateSession}
                isCollapsed={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <Header 
            user={user} 
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onOpenSettings={() => setShowSettings(true)}
          />
          
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ChatWindow 
              session={currentSession}
              onUpdateMessage={handleUpdateMessage}
              onRegenerateResponse={handleRegenerateResponse}
              onExportChat={handleExportChat}
              onShareChat={handleShareChat}
              onBookmarkMessage={handleBookmarkMessage}
            />
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoadingResponse}
            />
          </main>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetSettings={resetSettings}
          onExportData={handleExportData}
          onClearAllData={handleClearAllData}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;