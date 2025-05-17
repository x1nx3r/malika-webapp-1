// src/services/authService.js
import { auth } from "../firebase";

// Cache the promise to prevent multiple concurrent refresh attempts
let refreshTokenPromise = null;

/**
 * Gets a fresh token, refreshing if necessary
 */
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user logged in");
  }

  // Force token refresh if it's close to expiring
  // Firebase tokens are valid for 1 hour
  const tokenResult = await user.getIdTokenResult();
  const expirationTime = new Date(tokenResult.expirationTime).getTime();
  const fiveMinutesFromNow = new Date().getTime() + 5 * 60 * 1000;

  if (expirationTime < fiveMinutesFromNow) {
    console.log("Token close to expiration, refreshing...");
    return await refreshToken();
  }

  return tokenResult.token;
};

/**
 * Forces a token refresh
 */
export const refreshToken = async () => {
  // If there's already a refresh in progress, return that promise
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  try {
    // Create a new refresh promise
    refreshTokenPromise = auth.currentUser.getIdToken(true);
    const token = await refreshTokenPromise;
    return token;
  } finally {
    // Clear the promise so future calls will create a new one
    refreshTokenPromise = null;
  }
};

/**
 * Make an authenticated API request with automatic token refresh
 */
export const authFetch = async (url, options = {}) => {
  try {
    // Get a fresh token
    const token = await getAuthToken();

    // Add token to headers
    const authOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    };

    // Make the API request
    const response = await fetch(url, authOptions);

    // If token expired (which shouldn't happen with our prevention above,
    // but just in case), refresh token and retry once
    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.error && errorData.error.includes("expired")) {
        console.log("Token expired, refreshing and retrying request");
        const newToken = await refreshToken();

        authOptions.headers.Authorization = `Bearer ${newToken}`;
        return fetch(url, authOptions);
      }
    }

    return response;
  } catch (error) {
    console.error("Auth fetch error:", error);
    throw error;
  }
};
