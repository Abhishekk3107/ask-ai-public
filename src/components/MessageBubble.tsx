import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  User, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  Edit3,
  Bookmark,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../types';
import { useTheme } from '../hooks/useTheme';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  onUpdate: (updates: Partial<Message>) => void;
  onRegenerate: () => void;
  onBookmark: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onUpdate, 
  onRegenerate,
  onBookmark 
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const { theme } = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      onUpdate({ 
        content: editContent, 
        isEdited: true,
        originalContent: message.originalContent || message.content 
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleReaction = (type: 'like' | 'dislike') => {
    // Implementation for reactions
    console.log(`${type} reaction for message ${message.id}`);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-8 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[85%] sm:max-w-4xl w-full ${message.isUser ? 'pl-4 sm:pl-12' : 'pr-4 sm:pr-12'}`}>
        <div className="flex items-start space-x-2 sm:space-x-4">
          {!message.isUser && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 p-2 sm:p-2.5 rounded-xl flex-shrink-0"
            >
              <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 text-white dark:text-gray-900" />
            </motion.div>
          )}
          
          <div className={`flex-1 min-w-0 ${message.isUser ? 'text-right' : 'text-left'}`}>
            {/* Message Header */}
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className={`flex items-center space-x-1 sm:space-x-2 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  {message.isUser ? 'You' : 'Ask AI'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(message.timestamp)}
                </span>
                {message.isEdited && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                    edited
                  </span>
                )}
                {message.tokens && (
                  <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {message.tokens} tokens
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showActions ? 1 : 0 }}
                className="flex items-center space-x-1"
              >
                {!message.isUser && !message.isLoading && (
                  <>
                    <button
                      onClick={() => handleReaction('like')}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ThumbsUp className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-400 hover:text-green-500" />
                    </button>
                    <button
                      onClick={() => handleReaction('dislike')}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ThumbsDown className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                    <button
                      onClick={onRegenerate}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <RotateCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-400 hover:text-blue-500" />
                    </button>
                  </>
                )}
              </motion.div>
            </div>
            
            {/* Message Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-block p-3 sm:p-4 rounded-2xl max-w-full relative ${
                message.isUser
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-current rounded-full opacity-60"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-current rounded-full opacity-60"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-current rounded-full opacity-60"
                    />
                  </div>
                  <span className="text-xs sm:text-sm opacity-70">Thinking...</span>
                </div>
              ) : isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none text-sm sm:text-base"
                    rows={3}
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-2 sm:px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-xs sm:text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(message.content);
                      }}
                      className="px-2 sm:px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : message.isUser ? (
                <div className="whitespace-pre-wrap text-left text-sm sm:text-base">{message.content}</div>
              ) : (
                <div className="prose prose-sm sm:prose max-w-none dark:prose-invert prose-gray">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="relative">
                            <SyntaxHighlighter
                              style={theme === 'dark' ? oneDark : oneLight}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl !bg-gray-100 dark:!bg-gray-900 !p-3 sm:!p-4 text-xs sm:text-sm"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                            <button
                              onClick={() => navigator.clipboard.writeText(String(children))}
                              className="absolute top-2 right-2 p-1.5 sm:p-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <code className={`${className} bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono`} {...props}>
                            {children}
                          </code>
                        );
                      },
                      p: ({ children }) => <p className="mb-2 sm:mb-3 last:mb-0 leading-relaxed text-sm sm:text-base">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 sm:mb-3 space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">{children}</ol>,
                      h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-white">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 dark:text-white">{children}</h3>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 sm:pl-4 italic my-2 sm:my-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-2 sm:my-3">
                          <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left text-xs sm:text-sm">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 dark:border-gray-600 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </motion.div>
            
            {/* Message Actions */}
            {!message.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showActions ? 1 : 0 }}
                className={`flex items-center mt-2 sm:mt-3 space-x-1 sm:space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <button
                  onClick={handleCopy}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group/copy"
                  aria-label="Copy message"
                >
                  {copied ? (
                    <Check className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                  ) : (
                    <Copy className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 group-hover/copy:text-gray-600 dark:group-hover/copy:text-gray-300" />
                  )}
                </button>

                {message.isUser && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Edit3 className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                )}

                <button
                  onClick={onBookmark}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bookmark className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 hover:text-yellow-500" />
                </button>

                <button
                  onClick={() => navigator.share?.({ text: message.content })}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Share2 className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              </motion.div>
            )}
          </div>
          
          {message.isUser && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 p-2 sm:p-2.5 rounded-xl flex-shrink-0"
            >
              <User className="w-4 sm:w-5 h-4 sm:h-5 text-white dark:text-gray-900" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};