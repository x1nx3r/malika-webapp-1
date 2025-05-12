import admin from "firebase-admin";

// Initialize Firebase Admin (similar to other APIs)
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString(
    "utf8",
  ),
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// In-memory cart storage (or use Redis in production)
const carts = new Map();

export default async function handler(req, res) {
  // Authenticate request
  const cookie = req.headers.cookie || "";
  const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);

  if (!tokenMatch) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(tokenMatch[1]);
    const userId = decodedToken.uid;

    switch (req.method) {
      case "GET":
        // Get user's cart
        return res.status(200).json(carts.get(userId) || []);

      case "POST":
        // Add/Update cart item
        const newItem = JSON.parse(req.body);
        const currentCart = carts.get(userId) || [];

        // Check if item exists
        const existingItemIndex = currentCart.findIndex(
          (item) => item.id === newItem.id,
        );

        if (existingItemIndex >= 0) {
          // Update quantity
          currentCart[existingItemIndex].quantity += 1;
        } else {
          // Add new item
          currentCart.push({ ...newItem, quantity: 1 });
        }

        carts.set(userId, currentCart);
        return res.status(200).json(currentCart);

      case "PUT":
        // Update item quantity
        const { id, quantity } = JSON.parse(req.body);
        const updatedCart = (carts.get(userId) || [])
          .map((item) => (item.id === id ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0);

        carts.set(userId, updatedCart);
        return res.status(200).json(updatedCart);

      case "DELETE":
        // Clear cart or remove item
        const { itemId } = req.query;
        if (itemId) {
          // Remove specific item
          const filteredCart = (carts.get(userId) || []).filter(
            (item) => item.id !== itemId,
          );
          carts.set(userId, filteredCart);
          return res.status(200).json(filteredCart);
        } else {
          // Clear entire cart
          carts.delete(userId);
          return res.status(200).json([]);
        }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Cart operation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
