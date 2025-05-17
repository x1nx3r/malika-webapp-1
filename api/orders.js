// /api/orders.js
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
const ordersCollection = db.collection("orders");
const cartsCollection = db.collection("carts");

export default async function handler(req, res) {
  console.log("\n--- Orders API Request ---");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Query:", req.query);

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return res.status(200).end();
  }

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
    // Verify authentication
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;
    console.log("Authenticated userId:", userId, "isAdmin:", isAdmin);

    // Extract orderId from both path and query parameters
    let orderId = req.query.orderId;

    // Check if the URL has an order ID in the path
    // This handles routes like /api/orders/123456
    const urlPath = req.url.split("?")[0];
    const pathParts = urlPath.split("/");

    // If URL has a path parameter that looks like an order ID
    if (pathParts.length > 2 && !orderId) {
      const possibleOrderId = pathParts[pathParts.length - 1];
      // If it's not empty and not "orders" itself
      if (possibleOrderId && possibleOrderId !== "orders") {
        orderId = possibleOrderId;
      }
    }

    console.log("Resolved orderId:", orderId);

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        return await handleGetOrders(req, res, userId, isAdmin, orderId);
      case "POST":
        return await handleCreateOrder(req, res, userId);
      case "PUT":
        return await handleUpdateOrder(req, res, userId, isAdmin, orderId);
      case "DELETE":
        return await handleDeleteOrder(req, res, userId, isAdmin, orderId);
      default:
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error in orders API:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}

// CREATE - Handler for creating new orders
async function handleCreateOrder(req, res, userId) {
  // Get the request body
  const orderData =
    typeof req.body === "object" ? req.body : JSON.parse(req.body);

  // Validate order data
  if (
    !orderData.items ||
    !Array.isArray(orderData.items) ||
    orderData.items.length === 0
  ) {
    return res.status(400).json({ error: "Order must contain items" });
  }

  if (
    !orderData.receiverInfo ||
    !orderData.receiverInfo.name ||
    !orderData.receiverInfo.phone ||
    !orderData.receiverInfo.address
  ) {
    return res
      .status(400)
      .json({ error: "Receiver information is incomplete" });
  }

  // Calculate order totals to ensure accuracy
  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const downPaymentAmount = Math.round(
    subtotal * (orderData.paymentInfo.downPaymentPercent / 100),
  );
  const remainingPayment = subtotal - downPaymentAmount;

  // Create a new order
  const orderRef = await ordersCollection.add({
    userId,
    items: orderData.items,
    receiverInfo: orderData.receiverInfo,
    deliveryInfo: orderData.deliveryInfo,
    paymentInfo: {
      downPaymentPercent: orderData.paymentInfo.downPaymentPercent,
      downPaymentAmount: downPaymentAmount,
      subtotal: subtotal,
      remainingPayment: remainingPayment,
    },
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("Created order with ID:", orderRef.id);

  // Clear the user's cart after successful order creation
  const cartRef = cartsCollection.doc(userId);
  await cartRef.set({ items: [] });
  console.log("Cleared cart for user:", userId);

  // Return the order details
  return res.status(201).json({
    orderId: orderRef.id,
    status: "pending",
    subtotal: subtotal,
    downPaymentAmount: downPaymentAmount,
    remainingPayment: remainingPayment,
  });
}

// READ - Handler for getting orders
async function handleGetOrders(req, res, userId, isAdmin, orderId) {
  try {
    console.log("GET handler - orderId:", orderId);

    // If orderId is provided, get a specific order
    if (orderId) {
      console.log("Fetching specific order:", orderId);
      const orderDoc = await ordersCollection.doc(orderId).get();

      if (!orderDoc.exists) {
        console.log("Order not found in database:", orderId);
        return res.status(404).json({ error: "Order not found" });
      }

      const orderData = orderDoc.data();
      console.log("Order found, belongs to:", orderData.userId);

      // Security check: ensure users can only access their own orders (unless admin)
      if (orderData.userId !== userId && !isAdmin) {
        console.log("Access denied - user doesn't own this order");
        return res
          .status(403)
          .json({ error: "Forbidden: You can only access your own orders" });
      }

      // Return the full order data
      const responseData = {
        id: orderDoc.id,
        ...orderData,
        // Ensure timestamps are serializable
        createdAt: orderData.createdAt
          ? orderData.createdAt.toDate().toISOString()
          : null,
        updatedAt: orderData.updatedAt
          ? orderData.updatedAt.toDate().toISOString()
          : null,
      };

      console.log("Returning order data");
      return res.status(200).json(responseData);
    }

    // Otherwise, list orders for the user
    console.log("Fetching order list");
    let query = ordersCollection;

    // If not admin, filter by userId
    if (!isAdmin) {
      query = query.where("userId", "==", userId);
    }

    // Add optional filters from query params
    const { status, limit, startAfter } = req.query;

    if (status) {
      query = query.where("status", "==", status);
    }

    // Sort by creation date (newest first)
    query = query.orderBy("createdAt", "desc");

    // Pagination
    if (startAfter) {
      const lastDoc = await ordersCollection.doc(startAfter).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    // Limit the number of returned orders
    const docLimit = limit ? parseInt(limit) : 10;
    query = query.limit(docLimit);

    const snapshot = await query.get();

    const orders = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        // Ensure timestamps are serializable
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : null,
        updatedAt: data.updatedAt
          ? data.updatedAt.toDate().toISOString()
          : null,
      });
    });

    console.log(`Returning ${orders.length} orders`);
    return res.status(200).json({
      orders,
      hasMore: orders.length === docLimit,
      lastVisible: orders.length > 0 ? orders[orders.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve orders", details: error.message });
  }
}

// UPDATE - Handler for updating orders
async function handleUpdateOrder(req, res, userId, isAdmin, orderId) {
  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    console.log("Updating order:", orderId);
    // Verify the order exists and user has permission
    const orderDoc = await ordersCollection.doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderData = orderDoc.data();

    // Only allow users to update their own orders (unless admin)
    if (orderData.userId !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You can only update your own orders" });
    }

    // Get update data from request
    const updateData =
      typeof req.body === "object" ? req.body : JSON.parse(req.body);

    // Create sanitized update object (prevent changing critical fields)
    const allowedUpdates = {};

    // For regular users, limit what they can update
    if (!isAdmin) {
      // Regular users can only update specific fields (e.g., cancel their order)
      if (updateData.status === "cancelled") {
        allowedUpdates.status = "cancelled";
      }

      // Maybe allow updating delivery address if order is still pending
      if (orderData.status === "pending" && updateData.receiverInfo) {
        allowedUpdates.receiverInfo = updateData.receiverInfo;
      }
    } else {
      // Admins can update any fields except userId
      const { userId, createdAt, ...rest } = updateData;
      Object.assign(allowedUpdates, rest);

      // If status is changing, add a status history
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

    // Add last updated timestamp
    allowedUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Update the order
    await ordersCollection.doc(orderId).update(allowedUpdates);
    console.log("Order updated successfully");

    return res.status(200).json({
      message: "Order updated successfully",
      orderId,
      updates: allowedUpdates,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res
      .status(500)
      .json({ error: "Failed to update order", details: error.message });
  }
}

// DELETE - Handler for deleting orders
async function handleDeleteOrder(req, res, userId, isAdmin, orderId) {
  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    console.log("Deleting order:", orderId);
    // Verify the order exists and user has permission
    const orderDoc = await ordersCollection.doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderData = orderDoc.data();

    // Only allow users to delete their own orders (unless admin)
    if (orderData.userId !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You can only delete your own orders" });
    }

    // For safety, regular users can only delete pending orders
    if (!isAdmin && orderData.status !== "pending") {
      return res.status(403).json({
        error:
          "Can only delete pending orders. Please contact support to cancel processed orders.",
      });
    }

    // Delete or soft delete based on requirements
    if (isAdmin || orderData.status === "pending") {
      // Option 1: Hard delete (removes from database)
      await ordersCollection.doc(orderId).delete();
      console.log("Order deleted from database");

      // Option 2: Soft delete (keeps in database but marks as deleted)
      // await ordersCollection.doc(orderId).update({
      //   status: "deleted",
      //   deleted: true,
      //   deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      //   deletedBy: userId
      // });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete order", details: error.message });
  }
}
