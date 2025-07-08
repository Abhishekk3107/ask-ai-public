import { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message } from '../types';
import { DatabaseService } from '../services/database';
import { v4 as uuidv4 } from 'uuid';

export const useChatSessions = (userId: string | null) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const databaseService = DatabaseService.getInstance();

  // Load sessions from database
  const loadSessions = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const loadedSessions = await databaseService.getChatSessions(userId);
      setSessions(loadedSessions);
      
      // Load current session
      const savedCurrentSession = localStorage.getItem(`askAI_currentSession_${userId}`);
      if (savedCurrentSession) {
        const currentSessionId = JSON.parse(savedCurrentSession);
        const current = loadedSessions.find((s: ChatSession) => s.id === currentSessionId);
        if (current) {
          setCurrentSession(current);
        }
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      // Fallback to localStorage
      const savedSessions = localStorage.getItem(`askAI_chatSessions_${userId}`);
      if (savedSessions) {
        try {
          const parsed = JSON.parse(savedSessions).map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setSessions(parsed);
        } catch (parseError) {
          console.error('Failed to parse local sessions:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, databaseService]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Save sessions to localStorage as backup
  useEffect(() => {
    if (userId && sessions.length > 0) {
      localStorage.setItem(`askAI_chatSessions_${userId}`, JSON.stringify(sessions));
    }
  }, [sessions, userId]);

  // Save current session to localStorage
  useEffect(() => {
    if (userId && currentSession) {
      localStorage.setItem(`askAI_currentSession_${userId}`, JSON.stringify(currentSession.id));
    }
  }, [currentSession, userId]);

  const createNewSession = useCallback((title?: string): ChatSession => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: title || 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: 'gemini-1.5-flash',
      temperature: 0.7
    };

    setSessions(prev => [newSession, ...prev]);
    
    // Save to database
    if (userId) {
      databaseService.saveChatSession(newSession, userId).catch(console.error);
    }
    
    return newSession;
  }, [userId, databaseService]);

  const updateSession = useCallback(async (sessionId: string, updates: Partial<ChatSession>) => {
    const updatedSession = { ...updates, updatedAt: new Date() };
    
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, ...updatedSession }
        : session
    ));

    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, ...updatedSession } : null);
    }

    // Save to database
    try {
      await databaseService.updateChatSession(sessionId, updatedSession);
    } catch (error) {
      console.error('Failed to update session in database:', error);
    }
  }, [currentSession, databaseService]);

  const deleteSession = useCallback(async (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }

    // Delete from database
    try {
      await databaseService.deleteChatSession(sessionId);
    } catch (error) {
      console.error('Failed to delete session from database:', error);
    }
  }, [currentSession, databaseService]);

  const addMessage = useCallback(async (sessionId: string, message: Message) => {
    // Update sessions state
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages: [...session.messages, message], updatedAt: new Date() }
        : session
    ));

    // Update current session if it matches
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        updatedAt: new Date()
      } : null);
    }

    // Save to database
    try {
      const session = sessions.find(s => s.id === sessionId) || currentSession;
      if (session) {
        const updatedMessages = [...session.messages, message];
        await databaseService.updateChatSession(sessionId, { messages: updatedMessages });
      }
    } catch (error) {
      console.error('Failed to save message to database:', error);
    }
  }, [sessions, currentSession, databaseService]);

  const updateMessage = useCallback(async (sessionId: string, messageId: string, updates: Partial<Message>) => {
    // Update sessions state
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? {
            ...session,
            messages: session.messages.map(msg =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            updatedAt: new Date()
          }
        : session
    ));

    // Update current session if it matches
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
        updatedAt: new Date()
      } : null);
    }

    // Save to database
    try {
      const session = sessions.find(s => s.id === sessionId) || currentSession;
      if (session) {
        const updatedMessages = session.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
        await databaseService.updateChatSession(sessionId, { messages: updatedMessages });
      }
    } catch (error) {
      console.error('Failed to update message in database:', error);
    }
  }, [sessions, currentSession, databaseService]);

  const archiveSession = useCallback(async (sessionId: string) => {
    await updateSession(sessionId, { isArchived: true });
  }, [updateSession]);

  const duplicateSession = useCallback((sessionId: string): ChatSession => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const duplicated: ChatSession = {
      ...session,
      id: uuidv4(),
      title: `${session.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSessions(prev => [duplicated, ...prev]);
    
    // Save to database
    if (userId) {
      databaseService.saveChatSession(duplicated, userId).catch(console.error);
    }
    
    return duplicated;
  }, [sessions, userId, databaseService]);

  return {
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
    isLoading,
    refreshSessions: loadSessions
  };
};