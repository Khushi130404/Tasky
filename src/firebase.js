// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE7S6AyqYRuk3ACgQDlBdZOqzVFhGLGEs",
  authDomain: "taskchamp-82e3d.firebaseapp.com",
  projectId: "taskchamp-82e3d",
  storageBucket: "taskchamp-82e3d.appspot.com",
  messagingSenderId: "579272575280",
  appId: "1:579272575280:web:faa504b3ca7265cdf4a0f5",
  measurementId: "G-MZYN075T1V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const realDb = getDatabase(app);
const auth = getAuth();
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, analytics, realDb, auth, storage, firestore };
