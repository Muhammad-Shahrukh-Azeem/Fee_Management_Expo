import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2VMrWqCitHrQA_fJSCykWOcaWBRRPZEc",
  authDomain: "expert-academy-dac78.firebaseapp.com",
  projectId: "expert-academy-dac78",
  storageBucket: "expert-academy-dac78.appspot.com",
  messagingSenderId: "995149836808",
  appId: "1:995149836808:web:c068a1532bbd3a755197bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
