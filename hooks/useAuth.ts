import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ADMIN_EMAIL = 'admin@printvision.cloud';
const ADMIN_PASSWORD = 'admin123'; // In a real app, never hardcode passwords

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('auth_token');
      const expiry = localStorage.getItem('session_expiry');
      const rememberMe = localStorage.getItem('remember_me') === 'true';

      if (!token || !expiry) return;

      if (!rememberMe && Date.now() > parseInt(expiry)) {
        logout();
        return;
      }

      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        logout();
      }
    };

    const interval = setInterval(checkSession, 1000);
    const activityHandler = () => setLastActivity(Date.now());

    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keypress', activityHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keypress', activityHandler);
    };
  }, [lastActivity]);

  const login = async (credentials: { email: string; password: string }, rememberMe = false) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      const user = { 
        email: ADMIN_EMAIL, 
        role: 'admin',
        name: 'Admin User',
        avatar: 'https://avatars.githubusercontent.com/u/1',
        preferences: {
          notifications: true,
          theme: 'light'
        }
      };
      const fakeToken = btoa(JSON.stringify(user));
      localStorage.setItem('auth_token', fakeToken);
      localStorage.setItem('session_expiry', (Date.now() + SESSION_TIMEOUT).toString());
      localStorage.setItem('remember_me', rememberMe.toString());
      setIsAuthenticated(true);
      router.push('/dashboard');
      return { success: true };
    }

    throw new Error('Invalid credentials');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session_expiry');
    localStorage.removeItem('remember_me');
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const getUser = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getUser,
  };
}
