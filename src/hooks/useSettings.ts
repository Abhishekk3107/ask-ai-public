import { useState, useEffect } from 'react';
import { ChatSettings } from '../types';

const defaultSettings: ChatSettings = {
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: '',
  autoSave: true,
  soundEnabled: true,
  compactMode: false,
  showTimestamps: true,
  showTokenCount: false
};

export const useSettings = (userId: string | null) => {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);

  useEffect(() => {
    if (userId) {
      const savedSettings = localStorage.getItem(`askAI_settings_${userId}`);
      if (savedSettings) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        } catch (error) {
          console.error('Failed to parse settings:', error);
        }
      }
    }
  }, [userId]);

  const updateSettings = (updates: Partial<ChatSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    if (userId) {
      localStorage.setItem(`askAI_settings_${userId}`, JSON.stringify(newSettings));
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    if (userId) {
      localStorage.removeItem(`askAI_settings_${userId}`);
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
};