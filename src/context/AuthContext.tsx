import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';
import { signInWithGoogle, getFirebaseConfigStatus } from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isFirebaseConfigured: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ascend_auth_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Purge old v1 auth key
    try {
      localStorage.removeItem('ascend_auth_user');
    } catch {
      // ignore
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    // Default to clean Level 1 Initiate
    return INITIAL_USER;
  });

  const firebaseStatus = getFirebaseConfigStatus();

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginWithGoogle = async () => {
    try {
      const authUser = await signInWithGoogle();
      const profile: UserProfile = {
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || 'Alex Thorne',
        photoURL: authUser.photoURL || INITIAL_USER.photoURL,
        role: 'Life OS Initiate',
        joinedDate: 'September 2026',
        level: 1,
        xp: 0,
        streakRecord: 0,
      };
      setUser(profile);
    } catch (err) {
      console.error('Sign in error', err);
      // Fallback to initial clean user
      setUser(INITIAL_USER);
    }
  };

  const loginAsGuest = () => {
    setUser({
      ...INITIAL_USER,
      displayName: 'Guest Architect',
      email: 'guest@ascend.io',
      role: 'Guest Initiate',
      level: 1,
      xp: 0,
      streakRecord: 0,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isFirebaseConfigured: firebaseStatus.isConfigured,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
