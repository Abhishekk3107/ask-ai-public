import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Sun, 
  Moon, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  Search,
  Bell,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  onToggleSidebar, 
  isSidebarOpen,
  onOpenSettings 
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between max-w-full">
        {/* Left side */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>

          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-2 sm:p-2.5 rounded-xl shadow-lg flex-shrink-0"
            >
              <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center space-x-1">
                <span>Ask AI</span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Advanced Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm bg-gray-50 dark:bg-gray-800 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" />
            )}
          </motion.button>

          {/* Notifications - hidden on small mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden xs:block p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all relative shadow-sm"
          >
            <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
          </motion.button>

          {/* Help - hidden on small mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden xs:block p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <HelpCircle className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <Settings className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>

          {/* User menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 sm:space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 border-gradient-to-r from-blue-500 to-purple-500 shadow-sm"
                />
              ) : (
                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-24 lg:max-w-32 truncate">
                {user.name}
              </span>
            </motion.button>

            {/* User dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-12 w-56 sm:w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-base sm:text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {user.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};