import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAPTZBAES3nKZyLtnjhPOBlI96GUQ_up8M",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "k9-genius-bd0cb.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "k9-genius-bd0cb",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "k9-genius-bd0cb.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "708852915535",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:708852915535:web:b16d199814b41e21a7f93a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5NWKL056NP",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const clientDb = getFirestore(app);
export const clientAuth = getAuth(app);
export const clientStorage = getStorage(app);

export default app;
