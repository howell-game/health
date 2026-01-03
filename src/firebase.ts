// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAV6OGSKQIHscuL_UkZUpM3A9TM1c_JJ1I",
  authDomain: "homecare-5c3cd.firebaseapp.com",
  projectId: "homecare-5c3cd",
  storageBucket: "homecare-5c3cd.firebasestorage.app",
  messagingSenderId: "993481019000",
  appId: "1:993481019000:web:ee837224c67ee38532e78d",
  measurementId: "G-7JSNHDK19K"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)