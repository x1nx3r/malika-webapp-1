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
  console.log("Query Params:", req.query);

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
    // const isAdmin = decodedToken.admin === true;

    const userDoc = await db.collection("users").doc(userId).get();
    const userRole = userDoc.exists ? userDoc.data().role : "user";
    const isAdmin = userRole === "admin";

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

    // Handle special case for checking payment status
    if (req.method === "GET" && req.query.checkStatus === "true") {
      console.log("Handling payment status check request");
      return res.status(200).json({
        statusDownPayment: orderData.paymentInfo?.statusDownPayment || 'pending',
        statusRemainingPayment: orderData.paymentInfo?.statusRemainingPayment || 'pending'
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

      console.log("Update data received:", updateData);

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
        const { userId: bodyUserId, createdAt, ...rest } = updateData;
        
        // Handle nested updates for paymentInfo
        if (rest.paymentInfo) {
          // Merge dengan paymentInfo yang sudah ada
          allowedUpdates.paymentInfo = {
            ...orderData.paymentInfo,
            ...rest.paymentInfo
          };
          
          // Update total jika ada perubahan shipping cost
          if (rest.paymentInfo.shipingCost !== undefined) {
            allowedUpdates.paymentInfo.total = 
              (orderData.paymentInfo.subtotal || 0) + 
              (rest.paymentInfo.shipingCost || 0);
          }
        }
        
        // Handle status update
        if (rest.status && rest.status !== orderData.status) {
          // Validasi transisi status
          const validTransitions = {
            pending: ['processed', 'cancelled'],
            processed: ['delivery', 'paid', 'cancelled'],
            delivery: ['arrived', 'cancelled'],
            arrived: ['paid', 'completed'],
            paid: ['completed', 'delivery', 'arrived'],
            completed: [],
            cancelled: []
          };

          if (!validTransitions[orderData.status]?.includes(rest.status)) {
            return res.status(400).json({
              error: `Transisi status tidak valid: dari ${orderData.status} ke ${rest.status}`
            });
          }

          allowedUpdates.status = rest.status;
          
          // Create a new status history entry
          const newStatusEntry = {
            from: orderData.status,
            to: rest.status,
            timestamp: admin.firestore.Timestamp.now(),
            updatedBy: userId
          };
          
          const currentStatusHistory = orderData.statusHistory || [];
          allowedUpdates.statusHistory = [...currentStatusHistory, newStatusEntry];
        }
      }

      // Add updated timestamp
      allowedUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

      console.log("Final allowed updates:", allowedUpdates);

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