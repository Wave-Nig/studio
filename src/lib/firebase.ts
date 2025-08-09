
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "wave-uy47e",
  appId: "1:476248459862:web:5e27ed142fe7d1b8c8c9f7",
  storageBucket: "wave-uy47e.firebasestorage.app",
  apiKey: "AIzaSyCRGP7hrppWoip5_g5WGr-8KvV2Xa1G8VQ",
  authDomain: "wave-uy47e.firebaseapp.com",
  messagingSenderId: "476248459862"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
