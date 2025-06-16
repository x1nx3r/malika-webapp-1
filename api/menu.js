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
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET - Fetch all menu items (PUBLIC ACCESS - tidak perlu login)
  if (req.method === "GET") {
    try {
      console.log("Fetching menu items (public access)...");

      // Check if request wants to show archived items (only for authenticated requests)
      const showAll = req.query.showAll === "true";
      
      // Check if user is authenticated (optional for GET)
      const cookie = req.headers.cookie || "";
      const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);
      let isAuthenticated = false;
      
      if (tokenMatch) {
        try {
          await admin.auth().verifyIdToken(tokenMatch[1]);
          isAuthenticated = true;
          console.log("GET request with authentication");
        } catch (error) {
          console.log("GET request without valid authentication, proceeding as public");
        }
      }

      let query = menuCollection;
      
      // Only show archived items if user is authenticated AND specifically requests it
      if (!showAll || !isAuthenticated) {
        query = query.where("isArchived", "!=", true);
      }

      const snapshot = await query.get();
      const menus = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        menus.push({
          id: doc.id,
          name: data.name,
          category: data.category,
          price: data.price,
          kemasan: data.kemasan || "-",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
          isArchived: data.isArchived || false,
          amount: data.amount || "-",
        });
      });

      console.log(`Successfully retrieved ${menus.length} menu items (${isAuthenticated ? 'authenticated' : 'public'} access)`);
      return res.status(200).json(menus);
    } catch (error) {
      console.error("Error getting menus:", error);
      return res.status(500).json({
        error: "Failed to get menus",
        details: error.message,
      });
    }
  }

  // Untuk method selain GET, tetap perlu autentikasi
  const cookie = req.headers.cookie || "";
  const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);

  if (!tokenMatch) {
    console.log("No token found in cookie for protected endpoint");
    return res.status(401).json({ error: "Unauthorized - Authentication required" });
  }

  try {
    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(tokenMatch[1]);
    const userId = decodedToken.uid;
    console.log(`Authenticated user: ${userId}`);

    // POST - Add new menu item
    if (req.method === "POST") {
      console.log("Creating new menu item...");
      const { name, category, price, kemasan, description, amount, imageUrl, isArchived } =
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
          kemasan: kemasan || "",
          description: description || "",
          amount: Number(amount),
          imageUrl: imageUrl || "",
          isArchived: isArchived || false,
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
      const { id, name, category, price, kemasan, description, amount, imageUrl } =
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
          ...(amount !== undefined && { amount }),
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

    // PATCH - Update status Archive Items
    else if (req.method === "PATCH") {
      console.log("Updating archive status...");
      const { id, isArchived } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Menu ID is required" });
      }

      try {
        const menuRef = menuCollection.doc(id);
        const doc = await menuRef.get();

        if (!doc.exists) {
          return res.status(404).json({ error: "Menu not found" });
        }

        // Pastikan nilai isArchived yang diterima adalah boolean
        const newArchiveStatus = typeof isArchived === 'boolean' ? isArchived : true;
        
        await menuRef.update({
          isArchived: newArchiveStatus,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Menu item ${id} archive status updated to ${newArchiveStatus}`);
        return res.status(200).json({ 
          message: `Menu ${newArchiveStatus ? 'archived' : 'unarchived'} successfully`,
          isArchived: newArchiveStatus 
        });
      } catch (error) {
        console.error("Error updating archive status:", error);
        return res.status(500).json({
          error: "Failed to update archive status",
          details: error.message,
        });
      }
    }

    // Unsupported HTTP method
    else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
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