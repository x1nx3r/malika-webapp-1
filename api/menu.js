import admin from "firebase-admin";

// Inisialisasi Firebase Admin SDK (sama seperti di auth.js)
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

// Validasi kategori
const validCategories = [
  "Paket Porsian",
  "Paket Family",
  "Paket Hampers",
  "Frozen Food & Sambal",
];

export default async function handler(req, res) {
  // Middleware untuk memeriksa autentikasi
  const cookie = req.headers.cookie || "";
  const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);
  
  if (!tokenMatch) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await admin.auth().verifyIdToken(tokenMatch[1]);
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }

  // GET - Mendapatkan semua menu
  if (req.method === "GET") {
    try {
      const snapshot = await menuCollection.get();
      const menus = [];
      snapshot.forEach(doc => {
        menus.push({ 
            id: doc.id,
            name: doc.data().name,
            category: doc.data().category,
            price: doc.data().price,
            kemasan: doc.data().kemasan || "",
            description: doc.data().description || "",
            imageUrl: doc.data().imageUrl || "",
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate()
        });
      });
      return res.status(200).json(menus);
    } catch (error) {
      console.error("Error getting menus:", error);
      return res.status(500).json({ error: "Failed to get menus" });
    }
  }

  // POST - Menambahkan menu baru
  else if (req.method === "POST") {
    const { name, category, price, kemasan, description } = req.body;

    // Validasi input
    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, category, and price are required" });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    try {
      const docRef = await menuCollection.add({
        name,
        category,
        price: Number(price),
        kemasan: kemasan || "",
        description: description || "",
        imageUrl: imageUrl || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return res.status(201).json({ id: docRef.id, message: "Menu created successfully" });
    } catch (error) {
      console.error("Error creating menu:", error);
      return res.status(500).json({ error: "Failed to create menu" });
    }
  }

  // PUT - Mengupdate menu
  else if (req.method === "PUT") {
    const { id, name, category, price, kemasan, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Menu ID is required" });
    }

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
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
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await menuRef.update(updateData);
      return res.status(200).json({ message: "Menu updated successfully" });
    } catch (error) {
      console.error("Error updating menu:", error);
      return res.status(500).json({ error: "Failed to update menu" });
    }
  }

  // DELETE - Menghapus menu
  else if (req.method === "DELETE") {
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
      return res.status(200).json({ message: "Menu deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu:", error);
      return res.status(500).json({ error: "Failed to delete menu" });
    }
  }

  // Method tidak didukung
  else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}