import admin from "firebase-admin";

// Initialize Firebase Admin SDK
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
const menuCollection = db.collection("menu");

const validCategories = [
  "Paket Porsian",
  "Paket Family",
  "Paket Hampers",
  "Frozen Food & Sambal",
];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Authentication check
  const cookie = req.headers.cookie || "";
  const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);

  if (!tokenMatch) {
    console.log("No token found in cookie");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(tokenMatch[1]);
    const userId = decodedToken.uid;
    console.log(`Authenticated user: ${userId}`);

    // GET - Fetch all menu items
    if (req.method === "GET") {
      try {
        console.log("Fetching menu items...");
        const snapshot = await menuCollection.get();
        const menus = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          menus.push({
            id: doc.id,
            name: data.name,
            category: data.category,
            price: data.price,
            kemasan: data.kemasan || "Styrofoam",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
          });
        });

        console.log(`Successfully retrieved ${menus.length} menu items`);
        return res.status(200).json(menus);
      } catch (error) {
        console.error("Error getting menus:", error);
        return res.status(500).json({
          error: "Failed to get menus",
          details: error.message,
        });
      }
    }

    // POST - Add new menu item
    else if (req.method === "POST") {
      console.log("Creating new menu item...");
      const { name, category, price, kemasan, description, imageUrl } =
        req.body;

      // Validation
      if (!name || !category || !price) {
        return res.status(400).json({
          error: "Name, category, and price are required",
        });
      }

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          error: "Invalid category",
          validCategories,
        });
      }

      try {
        const docRef = await menuCollection.add({
          name,
          category,
          price: Number(price),
          kemasan: kemasan || "Styrofoam",
          description: description || "",
          imageUrl: imageUrl || "",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Menu item created with ID: ${docRef.id}`);
        return res.status(201).json({
          id: docRef.id,
          message: "Menu created successfully",
        });
      } catch (error) {
        console.error("Error creating menu:", error);
        return res.status(500).json({
          error: "Failed to create menu",
          details: error.message,
        });
      }
    }

    // PUT - Update menu item
    else if (req.method === "PUT") {
      console.log("Updating menu item...");
      const { id, name, category, price, kemasan, description, imageUrl } =
        req.body;

      if (!id) {
        return res.status(400).json({ error: "Menu ID is required" });
      }

      if (category && !validCategories.includes(category)) {
        return res.status(400).json({
          error: "Invalid category",
          validCategories,
        });
      }

      try {
        const menuRef = menuCollection.doc(id);
        const doc = await menuRef.get();

        if (!doc.exists) {
          return res.status(404).json({ error: "Menu not found" });
        }

        const updateData = {
          ...doc.data(),
          ...(name && { name }),
          ...(category && { category }),
          ...(price && { price: Number(price) }),
          ...(kemasan !== undefined && { kemasan }),
          ...(description !== undefined && { description }),
          ...(imageUrl !== undefined && { imageUrl }),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await menuRef.update(updateData);
        console.log(`Menu item ${id} updated successfully`);
        return res.status(200).json({ message: "Menu updated successfully" });
      } catch (error) {
        console.error("Error updating menu:", error);
        return res.status(500).json({
          error: "Failed to update menu",
          details: error.message,
        });
      }
    }

    // DELETE - Remove menu item
    else if (req.method === "DELETE") {
      console.log("Deleting menu item...");
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Menu ID is required" });
      }

      try {
        const menuRef = menuCollection.doc(id);
        const doc = await menuRef.get();

        if (!doc.exists) {
          return res.status(404).json({ error: "Menu not found" });
        }

        await menuRef.delete();
        console.log(`Menu item ${id} deleted successfully`);
        return res.status(200).json({ message: "Menu deleted successfully" });
      } catch (error) {
        console.error("Error deleting menu:", error);
        return res.status(500).json({
          error: "Failed to delete menu",
          details: error.message,
        });
      }
    }

    // Unsupported HTTP method
    else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      error: "Unauthorized",
      details: error.message,
    });
  }
}
