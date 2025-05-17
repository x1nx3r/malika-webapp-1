// /api/orders/[orderId].js
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
const ordersCollection = db.collection("orders");

export default async function handler(req, res) {
  console.log("\n--- Order Detail API Request ---");
  console.log("Method:", req.method);
  console.log("Order ID:", req.query.orderId);

  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Authentication check
  const cookie = req.headers.cookie || "";
  const tokenMatch = cookie.match(/firebaseToken=([^;]+)/);
  const authHeader = req.headers.authorization;
  const token = tokenMatch ? tokenMatch[1] : authHeader?.split("Bearer ")[1];

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;
    console.log(`Authenticated user: ${userId}, isAdmin: ${isAdmin}`);

    // Get the order ID from the URL
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Get the order document
    const orderDoc = await ordersCollection.doc(orderId).get();

    if (!orderDoc.exists) {
      console.log(`Order not found: ${orderId}`);
      return res.status(404).json({ error: "Order not found" });
    }

    const orderData = orderDoc.data();

    // Security check: users can only access their own orders
    if (orderData.userId !== userId && !isAdmin) {
      console.log(`Access denied for user ${userId} to order ${orderId}`);
      return res.status(403).json({
        error: "Forbidden: You can only access your own orders",
      });
    }

    // Handle different HTTP methods
    if (req.method === "GET") {
      // Format timestamp fields for JSON serialization
      const responseData = {
        id: orderDoc.id,
        ...orderData,
        createdAt: orderData.createdAt
          ? orderData.createdAt.toDate().toISOString()
          : null,
        updatedAt: orderData.updatedAt
          ? orderData.updatedAt.toDate().toISOString()
          : null,
      };

      console.log(`Successfully retrieved order ${orderId}`);
      return res.status(200).json(responseData);
    } else if (req.method === "PUT") {
      // Implementation for updating an order
      const updateData =
        typeof req.body === "object" ? req.body : JSON.parse(req.body);

      // Create sanitized update object
      const allowedUpdates = {};

      if (!isAdmin) {
        // Regular users can only update specific fields
        if (updateData.status === "cancelled") {
          allowedUpdates.status = "cancelled";
        }

        if (orderData.status === "pending" && updateData.receiverInfo) {
          allowedUpdates.receiverInfo = updateData.receiverInfo;
        }
      } else {
        // Admins can update most fields
        const { userId, createdAt, ...rest } = updateData;
        Object.assign(allowedUpdates, rest);

        if (updateData.status && updateData.status !== orderData.status) {
          allowedUpdates.statusHistory = orderData.statusHistory || [];
          allowedUpdates.statusHistory.push({
            from: orderData.status,
            to: updateData.status,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: userId,
          });
        }
      }

      // Add updated timestamp
      allowedUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

      await ordersCollection.doc(orderId).update(allowedUpdates);

      console.log(`Order ${orderId} updated successfully`);
      return res.status(200).json({
        message: "Order updated successfully",
        updates: allowedUpdates,
      });
    } else if (req.method === "DELETE") {
      // Implementation for deleting an order
      if (!isAdmin && orderData.status !== "pending") {
        return res.status(403).json({
          error:
            "Can only delete pending orders. Please contact support to cancel processed orders.",
        });
      }

      await ordersCollection.doc(orderId).delete();

      console.log(`Order ${orderId} deleted successfully`);
      return res.status(200).json({
        message: "Order deleted successfully",
      });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
