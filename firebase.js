import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBN1PbVChLqxGe8Bwy4Bbi3_EarKIBAHJQ",
  authDomain: "expert-7daa6.firebaseapp.com",
  projectId: "expert-7daa6",
  storageBucket: "expert-7daa6.appspot.com",
  messagingSenderId: "39845284035",
  appId: "1:39845284035:web:c525164484838bfc35ba76",
  measurementId: "G-G6ZBG0FG67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
