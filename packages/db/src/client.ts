// Client-side Firebase only — safe for browser/client components
// Use '@k9-genius/db/client' in 'use client' components
// Use '@k9-genius/db' in server-side code (API routes, server components)

export { clientDb, clientAuth, clientStorage } from './firebase-client';
export { default as firebaseApp } from './firebase-client';

// Auth helpers (client-side only)
export * from './auth-helpers';

// Types (safe for both client and server)
export * from './types';

// Re-export commonly used Firestore client functions
export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  Timestamp,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
