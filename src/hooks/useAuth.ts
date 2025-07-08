import { useState, useEffect } from 'react';
import { User } from '../types';
import { GoogleAuthService } from '../services/googleAuth';
import { DatabaseService } from '../services/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const databaseService = DatabaseService.getInstance();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize Google Auth (optional)
        try {
          await GoogleAuthService.getInstance().initialize();
        } catch (error) {
          console.warn('Google Auth not available:', error);
        }
        
        setIsInitialized(true);
        
        // Check for saved user and token
        const savedUser = localStorage.getItem('askAI_user');
        const token = localStorage.getItem('askAI_token');
        
        if (savedUser && token) {
          const userData = JSON.parse(savedUser);
          // Verify user still exists in database
          try {
            const dbUser = await databaseService.getUserById(userData.id);
            if (dbUser) {
              setUser(dbUser);
            } else {
              // User not found in database, clear local storage
              localStorage.removeItem('askAI_user');
              localStorage.removeItem('askAI_token');
            }
          } catch (error) {
            // Database not available, use local user
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginWithGoogle = async (): Promise<User> => {
    try {
      setIsLoading(true);
      const googleUser = await GoogleAuthService.getInstance().signIn();
      
      // Try to create or get user from database
      try {
        const dbUser = await databaseService.createUser(googleUser);
        setUser(dbUser);
        localStorage.setItem('askAI_user', JSON.stringify(dbUser));
        return dbUser;
      } catch (error) {
        // If user already exists, try to get them
        try {
          const existingUser = await databaseService.getUserById(googleUser.id);
          if (existingUser) {
            setUser(existingUser);
            localStorage.setItem('askAI_user', JSON.stringify(existingUser));
            return existingUser;
          }
        } catch (getError) {
          console.warn('Database not available, using local storage');
        }
        
        // Fallback to local storage
        setUser(googleUser);
        localStorage.setItem('askAI_user', JSON.stringify(googleUser));
        return googleUser;
      }
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      const { user: dbUser, token } = await databaseService.authenticateUser(email, password);
      
      setUser(dbUser);
      localStorage.setItem('askAI_user', JSON.stringify(dbUser));
      localStorage.setItem('askAI_token', token);
      
      return dbUser;
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> => {
    try {
      setIsLoading(true);
      const dbUser = await databaseService.createUser({
        ...userData,
        given_name: userData.name.split(' ')[0],
        family_name: userData.name.split(' ').slice(1).join(' ') || ''
      });
      
      // Auto-login after registration
      const { user: loggedInUser, token } = await databaseService.authenticateUser(userData.email, userData.password);
      
      setUser(loggedInUser);
      localStorage.setItem('askAI_user', JSON.stringify(loggedInUser));
      localStorage.setItem('askAI_token', token);
      
      return loggedInUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      GoogleAuthService.getInstance().signOut();
    } catch (error) {
      console.warn('Google sign out failed:', error);
    }
    
    setUser(null);
    localStorage.removeItem('askAI_user');
    localStorage.removeItem('askAI_token');
    localStorage.removeItem('askAI_chatSessions');
    localStorage.removeItem('askAI_currentSession');
    localStorage.removeItem('askAI_settings');
  };

  return { 
    user, 
    isLoading, 
    isInitialized, 
    loginWithGoogle, 
    loginWithEmail,
    registerWithEmail,
    logout 
  };
};