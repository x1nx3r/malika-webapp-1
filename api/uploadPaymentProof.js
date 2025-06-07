import admin from "firebase-admin";
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Handle array values dari formidable v3
    const paymentProof = Array.isArray(files.paymentProof) ? files.paymentProof[0] : files.paymentProof;
    const orderId = Array.isArray(fields.orderId) ? fields.orderId[0] : fields.orderId;
    const paymentType = Array.isArray(fields.paymentType) ? fields.paymentType[0] : fields.paymentType;
    
    console.log('Files received:', files);
    console.log('Payment proof:', paymentProof);
    console.log('Order ID:', orderId);
    console.log('Payment Type:', paymentType);
    
    if (!paymentProof) {
      return res.status(400).json({ error: 'No payment proof file provided' });
    }

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (!paymentType || !['downPayment', 'remainingPayment'].includes(paymentType)) {
      return res.status(400).json({ error: 'Invalid payment type' });
    }

    // Baca file yang diupload
    const fileBuffer = fs.readFileSync(paymentProof.filepath);

    // Upload ke server hosting Anda menggunakan form-data yang kompatibel dengan Node.js
    const { default: FormData } = await import('form-data');
    const formData = new FormData();
    
    // PERBAIKAN: Gunakan nama field yang sesuai dengan server
    formData.append('image', fileBuffer, {
      filename: paymentProof.originalFilename || paymentProof.newFilename || 'payment-proof.jpg',
      contentType: paymentProof.mimetype || 'image/jpeg'
    });

    const uploadResponse = await axios.post('https://gevannoyoh.com/api/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('Upload response:', uploadResponse.data);

    if (!uploadResponse.data.success) {
      throw new Error('Upload to hosting server failed');
    }

    const imageUrl = uploadResponse.data.url;

    // Update order di Firestore dengan bukti pembayaran
    const orderRef = db.collection('orders').doc(orderId);
    
    const updateData = {
      [`paymentInfo.proof${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}`]: imageUrl,
      [`paymentInfo.status${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}`]: 'pending_verification',
      'paymentInfo.updatedAt': admin.firestore.FieldValue.serverTimestamp()
    };

    await orderRef.update(updateData);

    console.log('Order updated successfully with payment proof:', updateData);

    // Cleanup - hapus file temporary
    try {
      fs.unlinkSync(paymentProof.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError);
    }

    return res.status(200).json({ 
      success: true, 
      imageUrl
    });

  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to upload payment proof',
      details: error.message 
    });
  }
}