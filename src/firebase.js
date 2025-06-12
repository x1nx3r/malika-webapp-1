import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr5QrxKKyJZ4zS286EPrWdlLCrCxDPR_w",
  authDomain: "kedai-malika.firebaseapp.com",
  projectId: "kedai-malika",
  storageBucket: "kedai-malika.firebasestorage.app",
  messagingSenderId: "995222008067",
  appId: "1:995222008067:web:8937c35c4fc50af8c0f936",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to get user role from Firestore
const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().role || "user"; // Default to "user" if no role specified
    }
    return "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "user";
  }
};

export { app, auth, db, getUserRole };
