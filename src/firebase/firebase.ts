// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlaa_vjhXk8NnUDdntoEOMk68B6lwoqsI",
  authDomain: "patchup-9e6b1.firebaseapp.com",
  projectId: "patchup-9e6b1",
  storageBucket: "patchup-9e6b1.firebasestorage.app",
  messagingSenderId: "254614774058",
  appId: "1:254614774058:web:3b23d39940be156f643e53",
  measurementId: "G-R4JYYHQZGQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);