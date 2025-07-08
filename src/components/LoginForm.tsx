import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Shield, Zap, Brain, Sparkles, Globe, Users } from 'lucide-react';
import { EmailLoginForm } from './EmailLoginForm';

interface LoginFormProps {
  onEmailLogin: (email: string, password: string) => Promise<void>;
  onEmailRegister: (userData: { name: string; email: string; password: string }) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  isGoogleLoading: boolean;
  isInitialized: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onEmailLogin,
  onEmailRegister,
  onGoogleLogin, 
  isGoogleLoading,
  isInitialized 
}) => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI',
      description: 'Powered by Google Gemini for intelligent conversations',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and private',
      color: 'from-green-500 to-emerald-500'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl w-full grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        {/* Left side - Branding and Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left order-2 lg:order-1 px-4 lg:px-0"
        >
          {/* Logo and Title */}
          <div className="flex items-center justify-center lg:justify-start mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, duration: 0.8 }}
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4 shadow-2xl"
            >
              <MessageSquare className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                Ask AI
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium"
              >
                Advanced Intelligent Assistant
              </motion.p>
            </div>
          </div>

          {/* Hero Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Experience the Future of AI Conversation
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Unlock the power of advanced AI with intelligent responses, seamless integration, 
              and cutting-edge features designed for the modern world.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="group relative p-4 sm:p-6 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl w-fit mx-auto lg:mx-0 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                Conversations
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                Uptime
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center order-1 lg:order-2 px-4 lg:px-0"
        >
          <div className="w-full max-w-md">
            <EmailLoginForm
              onEmailLogin={onEmailLogin}
              onEmailRegister={onEmailRegister}
              onGoogleLogin={onGoogleLogin}
              isGoogleLoading={isGoogleLoading}
              isInitialized={isInitialized}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};