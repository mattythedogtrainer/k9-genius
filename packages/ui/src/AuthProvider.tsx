'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { clientAuth, clientDb } from '@k9-genius/db/client';

interface AuthContextType {
  user: User | null;
  role: string | null;
  idToken: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(clientDb, 'users', uid));
      if (userDoc.exists()) {
        setRole(userDoc.data().role || null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setRole(null);
    }
  };

  const fetchIdToken = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      setIdToken(token);
      return token;
    } catch (error) {
      console.error('Error fetching ID token:', error);
      setIdToken(null);
      return null;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    if (!user) return null;
    return fetchIdToken(user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(clientAuth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
        await fetchIdToken(currentUser);
      } else {
        setRole(null);
        setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await firebaseSignOut(clientAuth);
  };

  return (
    <AuthContext.Provider value={{ user, role, idToken, loading, signOut: handleSignOut, refreshToken }}>
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
