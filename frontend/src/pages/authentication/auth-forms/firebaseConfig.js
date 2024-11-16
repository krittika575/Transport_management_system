import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnXtUZXvw1co0hYc6o41V4ph3or9Diko4",
  authDomain: "transport-4943d.firebaseapp.com",
  projectId: "transport-4943d",
  storageBucket: "transport-4943d.appspot.com",
  messagingSenderId: "497960409961",
  appId: "1:497960409961:web:97720ec762ad0e9957fbf8",
  measurementId: "G-C5XDN856GH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and set up providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();  // Instantiate GoogleAuthProvider

// Export necessary functions
export { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword };
