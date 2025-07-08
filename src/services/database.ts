import { User, ChatSession, Message } from '../types';

// MongoDB-like interface for browser storage with sync capabilities
export class DatabaseService {
  private static instance: DatabaseService;
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // User Management
  async createUser(userData: Omit<User, 'id'> & { password?: string }): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      return await response.json();
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      return this.createUserLocal(userData);
    }
  }

  async authenticateUser(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }

      return await response.json();
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      return this.authenticateUserLocal(email, password);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const token = localStorage.getItem('askAI_token');
      const response = await fetch(`${this.apiUrl}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      return this.getUserByIdLocal(userId);
    }
  }

  // Chat Session Management
  async saveChatSession(session: ChatSession, userId: string): Promise<ChatSession> {
    try {
      const token = localStorage.getItem('askAI_token');
      const response = await fetch(`${this.apiUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...session, userId }),
      });

      if (!response.ok) throw new Error('Failed to save session');
      return await response.json();
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      return this.saveChatSessionLocal(session, userId);
    }
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const token = localStorage.getItem('askAI_token');
      const response = await fetch(`${this.apiUrl}/sessions?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to get sessions');
      return await response.json();
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      return this.getChatSessionsLocal(userId);
    }
  }

  async updateChatSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    try {
      const token = localStorage.getItem('askAI_token');
      const response = await fetch(`${this.apiUrl}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update session');
      return await response.json();
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      return this.updateChatSessionLocal(sessionId, updates);
    }
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      const token = localStorage.getItem('askAI_token');
      const response = await fetch(`${this.apiUrl}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete session');
    } catch (error) {
      console.warn('API not available, using local storage:', error);
      this.deleteChatSessionLocal(sessionId);
    }
  }

  // Local Storage Fallback Methods
  private createUserLocal(userData: Omit<User, 'id'> & { password?: string }): User {
    const users = this.getLocalUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      name: userData.name,
      given_name: userData.given_name,
      family_name: userData.family_name,
      picture: userData.picture,
    };

    if (userData.password) {
      (user as any).password = this.hashPassword(userData.password);
    }

    users.push(user);
    localStorage.setItem('askAI_users', JSON.stringify(users));
    return user;
  }

  private authenticateUserLocal(email: string, password: string): { user: User; token: string } {
    const users = this.getLocalUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || !(user as any).password) {
      throw new Error('Invalid credentials');
    }

    const hashedPassword = this.hashPassword(password);
    if ((user as any).password !== hashedPassword) {
      throw new Error('Invalid credentials');
    }

    const token = `local_token_${user.id}_${Date.now()}`;
    localStorage.setItem('askAI_token', token);
    
    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, token };
  }

  private getUserByIdLocal(userId: string): User | null {
    const users = this.getLocalUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  private saveChatSessionLocal(session: ChatSession, userId: string): ChatSession {
    const sessions = this.getLocalSessions(userId);
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    
    localStorage.setItem(`askAI_sessions_${userId}`, JSON.stringify(sessions));
    return session;
  }

  private getChatSessionsLocal(userId: string): ChatSession[] {
    return this.getLocalSessions(userId);
  }

  private updateChatSessionLocal(sessionId: string, updates: Partial<ChatSession>): ChatSession {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('No user logged in');
    
    const sessions = this.getLocalSessions(userId);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) throw new Error('Session not found');
    
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates, updatedAt: new Date() };
    localStorage.setItem(`askAI_sessions_${userId}`, JSON.stringify(sessions));
    
    return sessions[sessionIndex];
  }

  private deleteChatSessionLocal(sessionId: string): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;
    
    const sessions = this.getLocalSessions(userId);
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(`askAI_sessions_${userId}`, JSON.stringify(filteredSessions));
  }

  private getLocalUsers(): User[] {
    const users = localStorage.getItem('askAI_users');
    return users ? JSON.parse(users) : [];
  }

  private getLocalSessions(userId: string): ChatSession[] {
    const sessions = localStorage.getItem(`askAI_sessions_${userId}`);
    if (!sessions) return [];
    
    return JSON.parse(sessions).map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  }

  private getCurrentUserId(): string | null {
    const user = localStorage.getItem('askAI_user');
    return user ? JSON.parse(user).id : null;
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - in production use proper hashing
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}