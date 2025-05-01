import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env": {
        VITE_FIREBASE_API_KEY: JSON.stringify(env.VITE_FIREBASE_API_KEY),
        VITE_FIREBASE_AUTH_DOMAIN: JSON.stringify(
          env.VITE_FIREBASE_AUTH_DOMAIN,
        ),
        VITE_FIREBASE_PROJECT_ID: JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
        VITE_FIREBASE_STORAGE_BUCKET: JSON.stringify(
          env.VITE_FIREBASE_STORAGE_BUCKET,
        ),
        VITE_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(
          env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        ),
        VITE_FIREBASE_APP_ID: JSON.stringify(env.VITE_FIREBASE_APP_ID),
      },
    },
    server: {
      allowedHosts: [
        "localhost",
        "dev.x1nx3r.uk",
        // Add any other domains you want to allow
      ],
    },
  };
});
