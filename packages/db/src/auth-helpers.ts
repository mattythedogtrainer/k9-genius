'use client';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { clientAuth, clientDb } from './firebase-client';

interface FirestoreUser {
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  role: 'CONSUMER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates or updates a Firestore user document
 */
async function ensureUserDocument(
  firebaseUid: string,
  email: string | null,
  displayName: string | null
): Promise<void> {
  const userDocRef = doc(clientDb, 'users', firebaseUid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    const now = new Date().toISOString();
    const newUser: FirestoreUser = {
      firebaseUid,
      email,
      displayName,
      role: 'CONSUMER',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(userDocRef, newUser);
  }
}

/**
 * Signs in user with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<void> {
  await signInWithEmailAndPassword(clientAuth, email, password);
}

/**
 * Signs up a new user with email and password
 * Creates a Firestore user document with CONSUMER role
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(
    clientAuth,
    email,
    password
  );

  // Update profile with display name
  await updateProfile(userCredential.user, {
    displayName,
  });

  // Create Firestore user document
  await ensureUserDocument(
    userCredential.user.uid,
    userCredential.user.email,
    displayName
  );
}

/**
 * Signs in user with Google OAuth
 * Creates Firestore user document if user is new
 */
export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(clientAuth, provider);

  // Ensure user document exists in Firestore
  await ensureUserDocument(
    result.user.uid,
    result.user.email,
    result.user.displayName
  );
}

/**
 * Signs in user with Apple OAuth
 * Creates Firestore user document if user is new
 */
export async function signInWithApple(): Promise<void> {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');

  const result = await signInWithPopup(clientAuth, provider);

  // Ensure user document exists in Firestore
  await ensureUserDocument(
    result.user.uid,
    result.user.email,
    result.user.displayName
  );
}

/**
 * Signs out the current user
 */
export async function signOutUser(): Promise<void> {
  await signOut(clientAuth);
}

/**
 * Gets the current user's ID token for use in TRPC auth headers
 */
export async function getIdToken(): Promise<string | null> {
  const user = clientAuth.currentUser;
  if (!user) {
    return null;
  }
  return await user.getIdToken();
}
