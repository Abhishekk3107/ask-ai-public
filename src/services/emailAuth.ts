import { User } from '../types';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export class EmailAuthService {
  private static instance: EmailAuthService;
  private users: Map<string, any> = new Map();

  static getInstance(): EmailAuthService {
    if (!EmailAuthService.instance) {
      EmailAuthService.instance = new EmailAuthService();
    }
    return EmailAuthService.instance;
  }

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    const savedUsers = localStorage.getItem('askAI_users');
    if (savedUsers) {
      try {
        const usersArray = JSON.parse(savedUsers);
        this.users = new Map(usersArray);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    }
  }

  private saveUsers() {
    const usersArray = Array.from(this.users.entries());
    localStorage.setItem('askAI_users', JSON.stringify(usersArray));
  }

  private hashPassword(password: string): string {
    // Simple hash function for demo purposes
    // In production, use proper password hashing like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async register(data: RegisterData): Promise<User> {
    const { email, password, confirmPassword, name } = data;

    // Validate input
    if (!this.validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    if (!name.trim()) {
      throw new Error('Name is required');
    }

    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('An account with this email already exists');
    }

    // Create user
    const userId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = this.hashPassword(password);
    
    const userData = {
      id: userId,
      email,
      name: name.trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isEmailVerified: false,
      authProvider: 'email'
    };

    this.users.set(email, userData);
    this.saveUsers();

    // Return user without password
    const user: User = {
      id: userId,
      email,
      name: name.trim(),
      given_name: name.trim().split(' ')[0],
      family_name: name.trim().split(' ').slice(1).join(' ') || ''
    };

    return user;
  }

  async signIn(credentials: AuthCredentials): Promise<User> {
    const { email, password } = credentials;

    if (!this.validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    const userData = this.users.get(email);
    if (!userData) {
      throw new Error('Invalid email or password');
    }

    const hashedPassword = this.hashPassword(password);
    if (userData.password !== hashedPassword) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      given_name: userData.name.split(' ')[0],
      family_name: userData.name.split(' ').slice(1).join(' ') || ''
    };

    return user;
  }

  async resetPassword(email: string): Promise<void> {
    if (!this.validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    const userData = this.users.get(email);
    if (!userData) {
      // Don't reveal if email exists for security
      return;
    }

    // In a real app, you would send an email with a reset link
    // For demo purposes, we'll just log it
    console.log(`Password reset requested for ${email}`);
    
    // Generate a temporary reset token (in real app, this would be sent via email)
    const resetToken = Math.random().toString(36).substr(2, 15);
    userData.resetToken = resetToken;
    userData.resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour
    
    this.users.set(email, userData);
    this.saveUsers();
  }

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    const userData = this.users.get(email);
    if (!userData) {
      throw new Error('User not found');
    }

    const hashedCurrentPassword = this.hashPassword(currentPassword);
    if (userData.password !== hashedCurrentPassword) {
      throw new Error('Current password is incorrect');
    }

    const passwordValidation = this.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    userData.password = this.hashPassword(newPassword);
    this.users.set(email, userData);
    this.saveUsers();
  }

  async deleteAccount(email: string, password: string): Promise<void> {
    const userData = this.users.get(email);
    if (!userData) {
      throw new Error('User not found');
    }

    const hashedPassword = this.hashPassword(password);
    if (userData.password !== hashedPassword) {
      throw new Error('Password is incorrect');
    }

    this.users.delete(email);
    this.saveUsers();
  }
}