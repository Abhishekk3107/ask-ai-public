import { User } from '../types';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private isInitialized = false;
  private resolveCallback: ((user: User) => void) | null = null;
  private rejectCallback: ((error: Error) => void) | null = null;

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to your environment variables.');
    }

    return new Promise((resolve, reject) => {
      // Check if Google script is already loaded
      if (typeof window.google !== 'undefined' && window.google.accounts) {
        this.initializeGoogleSignIn().then(resolve).catch(reject);
        return;
      }

      // Load Google script
      const existingScript = document.querySelector('script[src*="accounts.google.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.initializeGoogleSignIn().then(resolve).catch(reject);
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait a bit for Google to fully initialize
        setTimeout(() => {
          this.initializeGoogleSignIn().then(resolve).catch(reject);
        }, 100);
      };
      script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
      document.head.appendChild(script);
    });
  }

  private async initializeGoogleSignIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!window.google || !window.google.accounts) {
          reject(new Error('Google accounts not available'));
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false
        });
        
        this.isInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleCredentialResponse(response: any) {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      const user = this.parseJwtResponse(response.credential);
      if (this.resolveCallback) {
        this.resolveCallback(user);
        this.resolveCallback = null;
        this.rejectCallback = null;
      }
    } catch (error) {
      console.error('Error handling credential response:', error);
      if (this.rejectCallback) {
        this.rejectCallback(error instanceof Error ? error : new Error('Failed to process Google credential'));
        this.resolveCallback = null;
        this.rejectCallback = null;
      }
    }
  }

  async signIn(): Promise<User> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;

      try {
        // Try the One Tap prompt first
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If One Tap doesn't work, fall back to popup
            this.signInWithPopup().then(resolve).catch(reject);
          }
        });

        // Set a timeout to fallback to popup if One Tap takes too long
        setTimeout(() => {
          if (this.resolveCallback) {
            this.signInWithPopup().then(resolve).catch(reject);
          }
        }, 3000);
      } catch (error) {
        console.error('Error during sign in:', error);
        this.signInWithPopup().then(resolve).catch(reject);
      }
    });
  }

  private async signInWithPopup(): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (response: any) => {
            if (response.error) {
              reject(new Error(response.error_description || response.error));
              return;
            }

            try {
              // Get user info using the access token
              const userInfoResponse = await fetch(
                `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`
              );
              
              if (!userInfoResponse.ok) {
                throw new Error('Failed to fetch user information');
              }
              
              const userInfo = await userInfoResponse.json();
              
              const user: User = {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                given_name: userInfo.given_name,
                family_name: userInfo.family_name,
              };
              
              resolve(user);
            } catch (error) {
              console.error('Error fetching user info:', error);
              reject(error);
            }
          },
        });

        client.requestAccessToken();
      } catch (error) {
        console.error('Error initializing popup:', error);
        reject(error);
      }
    });
  }

  private parseJwtResponse(credential: string): User {
    try {
      const payload = JSON.parse(atob(credential.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    } catch (error) {
      throw new Error('Failed to parse Google credential');
    }
  }

  signOut(): void {
    try {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.warn('Error during sign out:', error);
    }
  }
}

// Extend the Window interface to include Google APIs
declare global {
  interface Window {
    google: any;
  }
}