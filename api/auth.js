// Excerpt from:
/**
 * This file handles authentication for the web application using Firebase.
 * It supports three main operations:
 * 1. Logging in with email and password (POST request to /login).
 * 2. Registering a new user (POST request to /register).
 * 3. Checking the session to verify if the user is authenticated (GET request).
 *
 * The Firebase Admin SDK is used to verify ID tokens, and the Firebase Authentication REST API is used to sign in and register users.
 * The ID token is stored as an HTTP-only cookie to maintain the session securely.
 *
 * Environment variables required:
 * - FIREBASE_SERVICE_ACCOUNT_BASE64: Base64-encoded JSON string of the Firebase service account credentials.
 * - FIREBASE_API_KEY: API key for Firebase Authentication.
 */

import axios from "axios";
import admin from "firebase-admin";

// Decode the Firebase service account JSON string from the environment variable
// The service account credentials are stored in an environment variable as a base64-encoded string
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString(
    "utf8",
  ),
);

// Initialize the Firebase Admin SDK only once to avoid re-initialization errors
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Use the decoded service account credentials
  });
}

// Retrieve the Firebase API key from the environment variables
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

// Export the handler function to handle incoming HTTP requests
export default async function handler(req, res) {
  // Check if the request method is POST (used for login or registration)
  if (req.method === "POST") {
    const { email, password, action } = req.body;

    if (action === "login") {
      // Handle login
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
          {
            email,
            password,
            returnSecureToken: true, // Request a secure token in the response
          },
        );
        const { idToken } = response.data;
        // Set the ID token as an HTTP-only cookie to maintain the session
        res.setHeader(
          "Set-Cookie",
          `firebaseToken=${idToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
        );
        return res.status(200).json({ message: "Login successful" });
      } catch (error) {
        console.error(
          "Firebase sign-in error:",
          error.response?.data || error.message,
        );
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } else if (action === "register") {
      // Handle registration
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
          {
            email,
            password,
            returnSecureToken: true, // Request a secure token in the response
          },
        );
        const { idToken } = response.data;
        // Set the ID token as an HTTP-only cookie to maintain the session
        res.setHeader(
          "Set-Cookie",
          `firebaseToken=${idToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
        );
        return res.status(200).json({ message: "Registration successful" });
      } catch (error) {
        console.error(
          "Firebase registration error:",
          error.response?.data || error.message,
        );
        return res.status(400).json({ error: "Registration failed" });
      }
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  }
  // Check if the request method is GET (used for session check)
  else if (req.method === "GET") {
    // Extract the cookie from the request headers
    const cookie = req.headers.cookie || "";
    // Use a regular expression to find the firebaseToken in the cookie
    const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);
    if (!tokenMatch) {
      // If the token is not found, respond with an unauthorized status
      return res.status(401).json({ isAuthenticated: false });
    }
    // Extract the ID token from the matched group
    const idToken = tokenMatch[1];
    try {
      // Verify the ID token using Firebase Admin SDK
      const decoded = await admin.auth().verifyIdToken(idToken);
      // Respond with the authenticated status and user information
      return res.status(200).json({ isAuthenticated: true, user: decoded });
    } catch (error) {
      // Log the error and respond with an unauthorized status if token verification fails
      console.error("Token verification error:", error);
      return res.status(401).json({ isAuthenticated: false });
    }
  }
  // If the request method is neither POST nor GET, respond with a method not allowed status
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
