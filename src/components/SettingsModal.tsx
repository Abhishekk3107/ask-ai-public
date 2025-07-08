import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  User, 
  Palette, 
  Volume2, 
  Shield, 
  Download,
  Trash2,
  RefreshCw,
  Sliders,
  Brain,
  Zap
} from 'lucide-react';
import { ChatSettings } from '../types';
import { GeminiService } from '../services/gemini';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onUpdateSettings: (updates: Partial<ChatSettings>) => void;
  onResetSettings: () => void;
  onExportData: () => void;
  onClearAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onExportData,
  onClearAllData
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'privacy' | 'data'>('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'ai', label: 'AI Settings', icon: Brain },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Download }
  ];

  const models = GeminiService.getAvailableModels();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-900 dark:bg-white p-2 rounded-lg">
                  <Settings className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex h-[600px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        General Settings
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Auto-save conversations
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Automatically save your chat history
                            </p>
                          </div>
                          <button
                            onClick={() => onUpdateSettings({ autoSave: !settings.autoSave })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.autoSave ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                                settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Sound effects
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Play sounds for notifications
                            </p>
                          </div>
                          <button
                            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.soundEnabled ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Compact mode
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Use a more compact interface
                            </p>
                          </div>
                          <button
                            onClick={() => onUpdateSettings({ compactMode: !settings.compactMode })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.compactMode ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                                settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Show timestamps
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Display message timestamps
                            </p>
                          </div>
                          <button
                            onClick={() => onUpdateSettings({ showTimestamps: !settings.showTimestamps })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.showTimestamps ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                                settings.showTimestamps ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Show token count
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Display token usage information
                            </p>
                          </div>
                          <button
                            onClick={() => onUpdateSettings({ showTokenCount: !settings.showTokenCount })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.showTokenCount ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                                settings.showTokenCount ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        AI Model Settings
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Model
                          </label>
                          <select
                            value={settings.model}
                            onChange={(e) => onUpdateSettings({ model: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            {models.map((model) => (
                              <option key={model} value={model}>
                                {model}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Temperature: {settings.temperature}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.temperature}
                            onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>More focused</span>
                            <span>More creative</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max tokens
                          </label>
                          <input
                            type="number"
                            min="100"
                            max="4000"
                            value={settings.maxTokens}
                            onChange={(e) => onUpdateSettings({ maxTokens: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            System prompt
                          </label>
                          <textarea
                            value={settings.systemPrompt}
                            onChange={(e) => onUpdateSettings({ systemPrompt: e.target.value })}
                            placeholder="Enter a system prompt to customize the AI's behavior..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Privacy & Security
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Data Protection
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your conversations are stored locally in your browser and are not sent to any third-party servers except for AI processing.
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              API Usage
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Messages are sent to Google's Gemini API for processing. Please review Google's privacy policy for more information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Data Management
                      </h3>
                      
                      <div className="space-y-4">
                        <button
                          onClick={onExportData}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export All Data</span>
                        </button>

                        <button
                          onClick={onResetSettings}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reset Settings</span>
                        </button>

                        <button
                          onClick={onClearAllData}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Clear All Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};