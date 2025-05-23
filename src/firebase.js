// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr5QrxKKyJZ4zS286EPrWdlLCrCxDPR_w",
  authDomain: "kedai-malika.firebaseapp.com",
  projectId: "kedai-malika",
  storageBucket: "kedai-malika.firebasestorage.app",
  messagingSenderId: "995222008067",
  appId: "1:995222008067:web:8937c35c4fc50af8c0f936"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };