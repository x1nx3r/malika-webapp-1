// api/testFirebase.js
export default async function handler(req, res) {
  const apiKey = process.env.FIREBASE_API_KEY; // Replace with your Firebase API key from Firebase Console
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  if (req.method === "GET") {
    // Test Firebase connection by attempting to create a user
    const email = "testuser12@example.com"; // Change this to a test email
    const password = "testPassword123"; // Change this to a test password

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();
      if (data.error) {
        console.error("Error creating user:", data.error.message);
        return res.status(500).json({ error: "Failed to connect to Firebase" });
      }

      return res
        .status(200)
        .json({ message: "Firebase connected successfully", data });
    } catch (error) {
      console.error("Error with Firebase request:", error);
      return res.status(500).json({ error: "Failed to connect to Firebase" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
