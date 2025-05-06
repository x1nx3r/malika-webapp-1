/**
 * Vercel Serverless Function for Authentication
 *
 * Handles authentication operations via a single endpoint with different actions:
 * - Login with email/password
 * - Register new users
 * - Google OAuth authentication
 * - Session verification
 * - Logout
 *
 * Usage:
 * - POST /api/auth with action="login" - Login with email/password
 * - POST /api/auth with action="register" - Register a new user
 * - POST /api/auth with action="google" - Complete Google OAuth flow
 * - POST /api/auth with action="logout" - Logout user
 * - GET /api/auth - Check authentication status
 */

import axios from "axios";
import admin from "firebase-admin";

// Decode the Firebase service account JSON string
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString(
    "utf8",
  ),
);

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Firebase API key for client-side operations
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

export default async function handler(req, res) {
  // Handle POST requests for authentication operations
  if (req.method === "POST") {
    const { email, password, action, idToken } = req.body;

    // LOGOUT operation
    if (action === "logout") {
      res.setHeader(
        "Set-Cookie",
        "firebaseToken=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Lax",
      );
      return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    }

    // GOOGLE SIGN-IN operation
    if (action === "google") {
      try {
        // Verify the Google ID token
        const decoded = await admin.auth().verifyIdToken(idToken);

        // Set secure HTTP-only cookie
        res.setHeader(
          "Set-Cookie",
          `firebaseToken=${idToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
        );

        return res.status(200).json({
          success: true,
          message: "Google sign-in successful",
          user: {
            uid: decoded.uid,
            email: decoded.email,
            displayName: decoded.name,
            photoURL: decoded.picture,
          },
        });
      } catch (error) {
        console.error("Google sign-in error:", error);
        return res.status(401).json({ error: "Invalid Google token" });
      }
    }

    // LOGIN operation
    if (action === "login") {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
          {
            email,
            password,
            returnSecureToken: true,
          },
        );

        const { idToken } = response.data;

        // Set secure HTTP-only cookie
        res.setHeader(
          "Set-Cookie",
          `firebaseToken=${idToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
        );

        return res
          .status(200)
          .json({ success: true, message: "Login successful" });
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        return res.status(401).json({
          error:
            formatAuthErrorMessage(error.response?.data?.error?.message) ||
            "Invalid credentials",
        });
      }
    }

    // REGISTER operation
    else if (action === "register") {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
          {
            email,
            password,
            returnSecureToken: true,
          },
        );

        const { idToken } = response.data;

        // Set secure HTTP-only cookie
        res.setHeader(
          "Set-Cookie",
          `firebaseToken=${idToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
        );

        return res
          .status(200)
          .json({ success: true, message: "Registration successful" });
      } catch (error) {
        console.error(
          "Registration error:",
          error.response?.data || error.message,
        );
        return res.status(400).json({
          error:
            formatAuthErrorMessage(error.response?.data?.error?.message) ||
            "Registration failed",
        });
      }
    }

    // Invalid action
    else {
      return res.status(400).json({ error: "Invalid action" });
    }
  }

  // Handle GET requests for session verification
  else if (req.method === "GET") {
    const cookie = req.headers.cookie || "";
    const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);

    if (!tokenMatch) {
      return res.status(401).json({ isAuthenticated: false });
    }

    const idToken = tokenMatch[1];

    try {
      const decoded = await admin.auth().verifyIdToken(idToken);

      return res.status(200).json({
        isAuthenticated: true,
        user: {
          uid: decoded.uid,
          email: decoded.email,
          displayName: decoded.name || decoded.email.split("@")[0],
          photoURL: decoded.picture || null,
        },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ isAuthenticated: false });
    }
  }

  // Method not allowed
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}

// Helper function to format Firebase authentication errors
function formatAuthErrorMessage(errorCode) {
  const errorMessages = {
    EMAIL_NOT_FOUND: "Email tidak terdaftar",
    INVALID_PASSWORD: "Password salah",
    USER_DISABLED: "Akun telah dinonaktifkan",
    EMAIL_EXISTS: "Email sudah terdaftar",
    OPERATION_NOT_ALLOWED: "Autentikasi dengan password dinonaktifkan",
    TOO_MANY_ATTEMPTS_TRY_LATER:
      "Terlalu banyak percobaan gagal, coba lagi nanti",
    WEAK_PASSWORD: "Password terlalu lemah (min 6 karakter)",
  };

  return errorMessages[errorCode] || null;
}
