import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
export const auth = hasFirebaseConfig ? getAuth(initializeApp(firebaseConfig)) : null;

export const setupRecaptcha = () => {
  if (!auth) throw new Error('Firebase environment variables are missing.');
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
  }
  return window.recaptchaVerifier;
};

export const sendOtpCode = async (phoneNumber) => {
  const verifier = setupRecaptcha();
  const result = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, verifier);
  window.confirmationResult = result;
};
