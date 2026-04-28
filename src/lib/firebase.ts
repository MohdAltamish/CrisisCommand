import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ─── Config ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Only spread databaseURL when it is actually set, otherwise Realtime
  // Database will throw a fatal error at module-load time.
  ...(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL && {
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  }),
};

// ─── App ───────────────────────────────────────────────────────────────────
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ─── Firestore (always needed) ─────────────────────────────────────────────
export const db = getFirestore(app);

// ─── Optional services (lazy — only init when env vars are present) ────────
// Realtime Database is not used by core features; skip when no databaseURL.
export const getRtdb = () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) return null;
  const { getDatabase } = require('firebase/database');
  return getDatabase(app);
};

// Auth is not used by core features; skip when no valid apiKey to avoid
// the "auth/invalid-api-key" crash during development without .env.local.
export const getFirebaseAuth = () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return null;
  const { getAuth } = require('firebase/auth');
  return getAuth(app);
};

export default app;
