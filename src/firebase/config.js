import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration for HanziGo
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBg_p7KviXi2ZIpLnf5fUopszjJr_tHDOI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hanzigo-92017.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hanzigo-92017",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hanzigo-92017.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "416188874879",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:416188874879:web:2424138e91b4bb562eff4a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5BZ1J794QG"
};

// Check if Firebase is properly configured with real credentials
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  console.log('Firebase HanziGo initialized successfully: Project', firebaseConfig.projectId);
} catch (err) {
  console.warn('Firebase initialization error:', err);
}

export { app, auth, db, googleProvider };
