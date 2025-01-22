import { processPayment } from '@/server/services/pizza/process-payment';
import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { order, paymentDetails, amount, orderState } = await req.json();

    // Decrypt sensitive data
    const decryptionKey = process.env.ENCRYPTION_KEY!; // Replace with the same key as the client
    const decryptedData = CryptoJS.AES.decrypt(paymentDetails, decryptionKey).toString(CryptoJS.enc.Utf8);

    const parsedPaymentDetails = JSON.parse(decryptedData);

    // Process payment
    const result = await processPayment(order, { ...parsedPaymentDetails, amount }, orderState);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Decryption or payment processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Payment processing failed',
      },
      { status: 500 },
    );
  }
}
