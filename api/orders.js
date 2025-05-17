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

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return res.status(200).end();
  }

  // Only allow POST for order creation
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
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
    console.log("Authenticated userId:", userId);

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
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  }
}
