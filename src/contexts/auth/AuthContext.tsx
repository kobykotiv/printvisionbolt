import React, { createContext, useContext, useState } from 'react';

type UserRole = 'demo_free' | 'demo_enterprise' | 'user' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  permissions: string[];
}

interface DemoUser extends User {
  expiresAt: Date;
}

interface AuthContextType {
  user: User | DemoUser | null;
  isDemo: boolean;
  isDemoFree: boolean;
  isDemoEnterprise: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginAsDemo: (type: 'free' | 'enterprise') => Promise<void>;
  logout: () => Promise<void>;
}

const demoUsers = {
  free: {
    id: 'demo-free-user',
    email: 'demo.free@printvision.cloud',
    role: 'demo_free' as UserRole,
    name: 'Demo Free User',
    permissions: ['view:analytics', 'view:designs', 'view:collections'],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  enterprise: {
    id: 'demo-enterprise-user',
    email: 'demo.enterprise@printvision.cloud',
    role: 'demo_enterprise' as UserRole,
    name: 'Demo Enterprise User',
    permissions: [
      'view:analytics',
      'view:designs',
      'view:collections',
      'create:designs',
      'edit:designs',
      'delete:designs',
      'create:collections',
      'edit:collections',
      'delete:collections',
      'view:team',
      'invite:team',
      'view:reports',
      'export:reports',
      'view:audit-logs',
    ],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null);

  const loginAsDemo = async (type: 'free' | 'enterprise') => {
    const demoUser = demoUsers[type];
    setUser(demoUser);

    // Start a timer to auto-logout when demo expires
    const timeUntilExpiry = demoUser.expiresAt.getTime() - Date.now();
    setTimeout(() => {
      logout();
    }, timeUntilExpiry);
  };

  const login = async (credentials: { email: string; password: string }) => {
    // TODO: Implement real authentication
    console.log('Attempting login with:', credentials.email);
    throw new Error('Not implemented');
  };

  const logout = async () => {
    setUser(null);
  };

  const isDemo = user?.role.startsWith('demo_') ?? false;
  const isDemoFree = user?.role === 'demo_free';
  const isDemoEnterprise = user?.role === 'demo_enterprise';
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isDemo,
        isDemoFree,
        isDemoEnterprise,
        isAuthenticated,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
