import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWChOAPblo92QjLK7dQUaOfVxzlAKLLrQ",
  authDomain: "novo-finaceiro-versa.firebaseapp.com",
  projectId: "novo-finaceiro-versa",
  storageBucket: "novo-finaceiro-versa.firebasestorage.app",
  messagingSenderId: "276914720870",
  appId: "1:276914720870:web:f5f8f16bd5a15328a35da7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
