import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { Message, ChatSession } from '../types';
import { 
  MessageSquare, 
  Sparkles, 
  Zap, 
  Brain,
  Download,
  Share2,
  Bookmark,
  ArrowDown,
  Globe,
  Shield,
  Users
} from 'lucide-react';

interface ChatWindowProps {
  session: ChatSession | null;
  onUpdateMessage: (messageId: string, updates: Partial<Message>) => void;
  onRegenerateResponse: (messageId: string) => void;
  onExportChat: () => void;
  onShareChat: () => void;
  onBookmarkMessage: (messageId: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  session,
  onUpdateMessage,
  onRegenerateResponse,
  onExportChat,
  onShareChat,
  onBookmarkMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAutoScrollEnabled) {
      scrollToBottom();
    }
  }, [session?.messages, isAutoScrollEnabled]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsAutoScrollEnabled(isNearBottom);
    setShowScrollButton(!isNearBottom && session?.messages && session.messages.length > 0);
  };

  const welcomeFeatures = [
    {
      icon: Brain,
      title: 'Advanced AI',
      description: 'Powered by Google Gemini for intelligent conversations',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses with optimized performance',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Sparkles,
      title: 'Rich Features',
      description: 'Code highlighting, markdown support, and more',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and protected',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Communicate in multiple languages seamlessly',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Collaborative',
      description: 'Share and export conversations easily',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-2xl"></div>
      </div>

      {/* Chat Header */}
      {session && session.messages.length > 0 && (
        <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-2 sm:p-2.5 rounded-xl flex-shrink-0 shadow-lg">
              <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg truncate">
                {session.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {session.messages.filter(m => !m.isLoading).length} messages • {session.model}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBookmarkMessage('')}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bookmark className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShareChat}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportChat}
              className="hidden sm:block p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide relative z-10"
        onScroll={handleScroll}
      >
        {!session || session.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl w-full"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, duration: 0.8 }}
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 sm:p-8 rounded-3xl w-fit mx-auto mb-6 sm:mb-8 shadow-2xl"
              >
                <MessageSquare className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 text-white" />
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 sm:mb-6"
              >
                How can I help you today?
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8 sm:mb-12 px-4"
              >
                I'm Ask AI, your advanced intelligent assistant. I can help with coding, 
                creative writing, analysis, problem-solving, and much more. Let's start an amazing conversation!
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {welcomeFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="group p-4 sm:p-6 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Start Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="mt-8 sm:mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                  💡 Quick Start Tips
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>• Ask me to explain complex topics</div>
                  <div>• Request code examples and debugging help</div>
                  <div>• Get creative writing assistance</div>
                  <div>• Analyze data and solve problems</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto w-full">
            <AnimatePresence mode="popLayout">
              {session.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <MessageBubble 
                    message={message}
                    onUpdate={(updates) => onUpdateMessage(message.id, updates)}
                    onRegenerate={() => onRegenerateResponse(message.id)}
                    onBookmark={() => onBookmarkMessage(message.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-3.5 rounded-full shadow-2xl hover:shadow-3xl transition-all z-20 hover:scale-110"
          >
            <ArrowDown className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};