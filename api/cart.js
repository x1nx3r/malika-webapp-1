import admin from "firebase-admin";

// Initialize Firebase Admin
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

const db = admin.firestore();
const cartsCollection = db.collection("carts");

export default async function handler(req, res) {
  console.log("\n--- Cart API Request ---");
  console.log("Method:", req.method);

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Auth check
  const cookie = req.headers.cookie || "";
  const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);
  const authHeader = req.headers.authorization;

  const token = tokenMatch ? tokenMatch[1] : authHeader?.split("Bearer ")[1];

  if (!token) {
    console.log("No token found in either cookie or auth header");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log("Authenticated userId:", userId);

    const cartRef = cartsCollection.doc(userId);

    switch (req.method) {
      case "GET":
        const doc = await cartRef.get();
        const cartItems = doc.exists ? doc.data().items || [] : [];
        console.log("Returning cart items:", cartItems);
        return res.status(200).json(cartItems);

      case "POST":
        console.log("\n--- Processing POST Request ---");
        let newItem =
          typeof req.body === "object" ? req.body : JSON.parse(req.body);
        console.log("New item:", newItem);

        const cartDoc = await cartRef.get();
        let currentItems = cartDoc.exists ? cartDoc.data().items || [] : [];

        const existingItemIndex = currentItems.findIndex(
          (item) => item.id === newItem.id,
        );

        if (existingItemIndex >= 0) {
          currentItems[existingItemIndex].quantity += 1;
        } else {
          currentItems.push({ ...newItem, quantity: 1 });
        }

        await cartRef.set({ items: currentItems }, { merge: true });
        console.log("Updated cart:", currentItems);
        return res.status(200).json(currentItems);

      case "PUT":
        const updateData =
          typeof req.body === "object" ? req.body : JSON.parse(req.body);
        const { id, quantity } = updateData;

        const currentDoc = await cartRef.get();
        let items = currentDoc.exists ? currentDoc.data().items || [] : [];

        items = items
          .map((item) => (item.id === id ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0);

        await cartRef.set({ items }, { merge: true });
        return res.status(200).json(items);

      case "DELETE":
        const { itemId } = req.query;
        if (itemId) {
          const doc = await cartRef.get();
          let items = doc.exists ? doc.data().items || [] : [];
          items = items.filter((item) => item.id !== itemId);
          await cartRef.set({ items }, { merge: true });
          return res.status(200).json(items);
        } else {
          await cartRef.delete();
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
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
