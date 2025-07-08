# Contributing to Ask AI

Thank you for your interest in contributing to Ask AI! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/ask-ai-chat.git
   cd ask-ai-chat
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier configuration)
- Use ESLint rules defined in the project
- Write meaningful commit messages

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript types
- Follow the existing component structure
- Use Tailwind CSS for styling
- Ensure components are responsive

### State Management

- Use React hooks for local state
- Use Context API for global state
- Keep state as close to where it's used as possible

### Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use lazy loading where appropriate

## 🧪 Testing

- Test your changes thoroughly on different devices
- Ensure responsive design works properly
- Test both light and dark themes
- Verify accessibility features

## 📝 Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "Add: your feature description"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

### Pull Request Guidelines

- Provide a clear description of the changes
- Include screenshots for UI changes
- Reference any related issues
- Ensure all checks pass
- Request review from maintainers

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:

- Check if the feature already exists
- Provide a clear use case
- Explain the expected behavior
- Consider the impact on existing users

## 🎨 Design Contributions

- Follow the existing design system
- Ensure accessibility compliance
- Test on multiple screen sizes
- Maintain consistency with the current UI

## 📚 Documentation

- Update README.md for new features
- Add inline code comments for complex logic
- Update TypeScript types and interfaces
- Include examples for new APIs

## 🔒 Security

- Never commit API keys or sensitive data
- Report security issues privately
- Follow secure coding practices
- Validate all user inputs

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Maintain a positive environment

## 📞 Getting Help

- Open an issue for questions
- Join discussions on GitHub
- Check existing documentation first

Thank you for contributing to Ask AI! 🎉