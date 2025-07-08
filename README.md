# Ask AI - Advanced Intelligent Assistant

A cutting-edge AI chat application built with React, TypeScript, and Tailwind CSS, featuring Google OAuth authentication and powered by Google's Gemini AI API. This application provides a modern, feature-rich interface for AI conversations with advanced capabilities.

🌐 **Live Demo**: [https://ask-ai-01.netlify.app](https://ask-ai-01.netlify.app)

## 🚀 Features

### Authentication & Security
- **Google OAuth Integration**: Secure sign-in with Google accounts
- **Email Authentication**: Traditional email/password authentication
- **Session Management**: Persistent login sessions with automatic token refresh
- **Privacy-First**: Local data storage with encrypted conversations

### Advanced AI Capabilities
- **Multiple AI Models**: Support for Gemini 1.5 Flash, Pro, and other models
- **Conversation Context**: Maintains context across messages for coherent conversations
- **Custom System Prompts**: Personalize AI behavior with custom instructions
- **Temperature Control**: Adjust creativity vs. focus in AI responses
- **Token Management**: Real-time token usage tracking and optimization

### Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Seamless theme switching with system preference detection
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Keyboard Shortcuts**: Productivity-focused hotkeys and shortcuts
- **Voice Input**: Speech-to-text integration for hands-free interaction

### Chat Management
- **Session Management**: Create, organize, and manage multiple chat sessions
- **Search & Filter**: Advanced search across all conversations
- **Export & Import**: Backup and restore chat data
- **Message Actions**: Edit, regenerate, bookmark, and share messages
- **Auto-Save**: Automatic conversation saving with conflict resolution

### Rich Content Support
- **Markdown Rendering**: Full markdown support with syntax highlighting
- **Code Blocks**: Syntax highlighting for 100+ programming languages
- **File Attachments**: Support for images, documents, and code files
- **Message Reactions**: Like, dislike, and custom emoji reactions
- **Copy & Share**: Easy content sharing and clipboard integration

### Productivity Features
- **Quick Prompts**: Pre-defined prompts for common tasks
- **Message Templates**: Save and reuse frequently used messages
- **Conversation Analytics**: Track usage patterns and insights
- **Offline Support**: Continue working without internet connection
- **Data Export**: Export conversations in multiple formats

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Google OAuth 2.0, Email/Password
- **AI Integration**: Google Gemini API
- **State Management**: React Hooks, Context API
- **Storage**: LocalStorage with encryption
- **Build Tool**: Vite
- **Code Quality**: ESLint, TypeScript strict mode
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ask-ai-chat.git
   cd ask-ai-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Required: Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key to your `.env` file as `VITE_GEMINI_API_KEY`

### Optional: Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy the Client ID to your `.env` file as `VITE_GOOGLE_CLIENT_ID`

**Note**: Google OAuth is optional. Users can still authenticate using email/password.

## 🎯 Usage

### Basic Chat
1. Sign in with your Google account or create an account with email
2. Start a new conversation or select an existing one
3. Type your message and press Enter to send
4. Use Shift+Enter for multi-line messages

### Advanced Features
- **Settings**: Access via the gear icon to customize AI behavior
- **Search**: Use Cmd/Ctrl+K to search conversations
- **Export**: Download conversations as JSON or markdown
- **Themes**: Toggle between light and dark modes
- **Shortcuts**: Use keyboard shortcuts for faster navigation

### Keyboard Shortcuts
- `Enter`: Send message
- `Shift+Enter`: New line
- `Cmd/Ctrl+K`: Focus search
- `Cmd/Ctrl+Enter`: Send message (alternative)
- `Cmd/Ctrl+N`: New conversation
- `Cmd/Ctrl+,`: Open settings

## 🔒 Privacy & Security

- **Local Storage**: All conversations are stored locally in your browser
- **Encryption**: Sensitive data is encrypted before storage
- **No Tracking**: No analytics or tracking scripts
- **API Security**: API keys are never exposed to the client
- **HTTPS Only**: Secure connections required in production

## 🚀 Deployment

### Netlify (Recommended)
1. Fork this repository
2. Connect your GitHub repository to Netlify
3. Set environment variables in Netlify dashboard:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID (optional)
4. Deploy automatically on push to main branch

### Vercel
1. Fork this repository
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Self-Hosted
1. Build the project: `npm run build`
2. Serve the `dist` folder with any static file server
3. Ensure HTTPS is configured for OAuth to work

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design works on all devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ by Abhishek Kumar