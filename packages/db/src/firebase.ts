import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'k9-genius-bd0cb',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
} as ServiceAccount;

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Without a full service account (missing clientEmail or privateKey),
  // fall back to project-ID-only init. This allows builds and client-side
  // usage to succeed even without a service account private key.
  if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
    return initializeApp({ projectId: 'k9-genius-bd0cb' });
  }

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'k9-genius-bd0cb.firebasestorage.app',
  });
}

const app = getAdminApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
