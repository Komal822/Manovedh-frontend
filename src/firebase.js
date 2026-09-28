import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "PASTE_YOUR_ACTUAL_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_ACTUAL_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_ACTUAL_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_ACTUAL_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_ACTUAL_APP_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication only
export const auth = getAuth(app);

export default app;