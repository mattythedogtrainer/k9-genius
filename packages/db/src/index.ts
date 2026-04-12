// Server-side Firebase (use in API routes and server components)
export { db, auth, storage } from './firebase';

// Client-side Firebase (use in client components)
export { clientDb, clientAuth, clientStorage } from './firebase-client';
export { default as firebaseApp } from './firebase-client';

// Collection references
export { collections, subcollection } from './collections';

// Types
export * from './types';

// Authentication helpers
export * from './auth-helpers';
