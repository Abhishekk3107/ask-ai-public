import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  Paperclip, 
  Mic, 
  Square,
  Image,
  Code,
  Smile,
  Sparkles,
  Zap
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { useHotkeys } from 'react-hotkeys-hook';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: any[]) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  placeholder = "Message Ask AI..."
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useHotkeys('cmd+enter,ctrl+enter', () => handleSubmit(), {
    enableOnFormTags: true,
  });

  useHotkeys('cmd+k,ctrl+k', (e) => {
    e.preventDefault();
    textareaRef.current?.focus();
  });

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage, attachments);
      setMessage('');
      setAttachments([]);
      setShowAttachments(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      file
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    setShowAttachments(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const insertCodeBlock = () => {
    const codeBlock = '\n```\n\n```\n';
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = message.slice(0, start) + codeBlock + message.slice(end);
      setMessage(newValue);
      
      // Set cursor position inside code block
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 4, start + 4);
      }, 0);
    }
    setShowAttachments(false);
  };

  const quickPrompts = [
    { text: "Explain this concept", icon: Sparkles },
    { text: "Write code for", icon: Code },
    { text: "Help me debug", icon: Zap },
    { text: "Create a plan", icon: Smile },
    { text: "Summarize this", icon: Paperclip }
  ];

  // Close attachments menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAttachments && !(event.target as Element).closest('.attachment-menu')) {
        setShowAttachments(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachments]);

  return (
    <div className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      {/* Quick Prompts */}
      {message === '' && !attachments.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 sm:px-6 pt-4 sm:pt-6"
        >
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickPrompts.map((prompt) => (
              <motion.button
                key={prompt.text}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessage(prompt.text + ' ')}
                className="flex-shrink-0 flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-gray-700 dark:text-gray-300 rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all whitespace-nowrap border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
              >
                <prompt.icon className="w-3.5 h-3.5" />
                <span>{prompt.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-3 flex items-center space-x-2 border border-blue-200/50 dark:border-blue-700/50"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 max-w-32 truncate">
                  {attachment.name}
                </span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl border-2 border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all shadow-lg hover:shadow-xl">
            {/* Textarea */}
            <TextareaAutosize
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[60px] max-h-40 text-sm sm:text-base"
              disabled={isLoading}
              minRows={1}
              maxRows={8}
            />

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 pb-4 sm:pb-5">
              <div className="flex items-center space-x-2">
                {/* Attachment Button */}
                <div className="relative attachment-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAttachments(!showAttachments)}
                    className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    <Paperclip className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>

                  {/* Attachment Menu */}
                  {showAttachments && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-2 z-50 min-w-48"
                    >
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Image className="w-4 h-4" />
                        <span>Upload Image</span>
                      </button>
                      <button
                        onClick={insertCodeBlock}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        <span>Code Block</span>
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Voice Recording */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRecording}
                  className={`p-2 sm:p-2.5 rounded-xl transition-colors ${
                    isRecording 
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <Square className="w-4 sm:w-5 h-4 sm:h-5" />
                  ) : (
                    <Mic className="w-4 sm:w-5 h-4 sm:h-5" />
                  )}
                </motion.button>

                {/* Character Count */}
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                  {message.length}/4000
                </span>
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: message.trim() ? 1.05 : 1 }}
                whileTap={{ scale: message.trim() ? 0.95 : 1 }}
                onClick={handleSubmit}
                disabled={!message.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 sm:p-3.5 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 animate-spin" />
                ) : (
                  <Send className="w-5 sm:w-6 h-5 sm:h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 sm:mt-4">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd> to send, 
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs ml-1">Shift+Enter</kbd> for new line,
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs ml-1">Cmd+K</kbd> to focus
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};