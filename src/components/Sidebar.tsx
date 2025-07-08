import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Archive, 
  Settings, 
  Trash2, 
  Edit3, 
  Copy,
  MoreHorizontal,
  Calendar,
  Tag,
  Filter
} from 'lucide-react';
import { ChatSession } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onSessionSelect: (session: ChatSession) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onArchiveSession: (sessionId: string) => void;
  onDuplicateSession: (sessionId: string) => void;
  onUpdateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSession,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onArchiveSession,
  onDuplicateSession,
  onUpdateSession,
  isCollapsed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredSessions = sessions.filter(session => {
    if (!showArchived && session.isArchived) return false;
    if (showArchived && !session.isArchived) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return session.title.toLowerCase().includes(query) ||
             session.messages.some(msg => msg.content.toLowerCase().includes(query));
    }

    const now = new Date();
    const sessionDate = session.updatedAt;
    
    switch (selectedFilter) {
      case 'today':
        return sessionDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return sessionDate >= monthAgo;
      default:
        return true;
    }
  });

  const handleEditStart = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSession(session.id);
    setEditTitle(session.title);
  };

  const handleEditSave = () => {
    if (editingSession && editTitle.trim()) {
      onUpdateSession(editingSession, { title: editTitle.trim() });
    }
    setEditingSession(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingSession(null);
    setEditTitle('');
  };

  const handleSessionClick = (session: ChatSession) => {
    if (editingSession === session.id) return;
    onSessionSelect(session);
  };

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: 64 }}
        className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full"
      >
        <div className="p-4">
          <button
            onClick={onNewSession}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
          {filteredSessions.slice(0, 10).map((session) => (
            <button
              key={session.id}
              onClick={() => onSessionSelect(session)}
              className={`w-full p-3 rounded-lg mb-2 transition-colors flex items-center justify-center ${
                currentSession?.id === session.id
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 64 }}
      animate={{ width: 280 }}
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full w-80"
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onNewSession}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 group text-sm sm:text-base"
        >
          <Plus className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-xs sm:text-sm"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
          
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              showArchived 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Archive className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-3 sm:pb-4 scrollbar-hide">
        <AnimatePresence>
          {filteredSessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`group relative mb-2 p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                currentSession?.id === session.id
                  ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleSessionClick(session)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {editingSession === session.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={handleEditSave}
                      onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                      onKeyDown={(e) => e.key === 'Escape' && handleEditCancel()}
                      className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.title}
                    </h3>
                  )}
                  
                  <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {session.messages.length} messages
                    </span>
                  </div>
                  
                  {session.tags && session.tags.length > 0 && (
                    <div className="flex items-center space-x-1 mt-1.5 sm:mt-2">
                      {session.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <Tag className="w-2.5 sm:w-3 h-2.5 sm:h-3 mr-0.5 sm:mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    <button
                      onClick={(e) => handleEditStart(session, e)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit3 className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-gray-500" />
                    </button>
                    
                    <div className="relative group/menu">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreHorizontal className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-gray-500" />
                      </button>
                      
                      <div className="absolute right-0 top-6 w-40 sm:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateSession(session.id);
                          }}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-1.5 sm:space-x-2 rounded-t-lg"
                        >
                          <Copy className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span>Duplicate</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onArchiveSession(session.id);
                          }}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-1.5 sm:space-x-2"
                        >
                          <Archive className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span>{session.isArchived ? 'Unarchive' : 'Archive'}</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this conversation?')) {
                              onDeleteSession(session.id);
                            }
                          }}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-1.5 sm:space-x-2 rounded-b-lg"
                        >
                          <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSessions.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <MessageSquare className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};