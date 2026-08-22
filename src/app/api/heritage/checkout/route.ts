import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Midtrans from "midtrans-client";

// Inisialisasi Midtrans Snap API
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, name, phone, identityNumber, quantity, totalPrice } = body;

    if (!slug || !name || !phone) {
      return NextResponse.json(
        { success: false, message: "Data pesanan tidak lengkap." },
        { status: 400 }
      );
    }

    // Buat Order ID unik
    const orderId = `HERITAGE-${slug.toUpperCase()}-${Date.now()}`;

    // Parameter transaksi untuk Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPrice || 15000,
      },
      customer_details: {
        first_name: name,
        phone: phone,
      },
      item_details: [
        {
          id: slug,
          price: totalPrice / (quantity || 1),
          quantity: quantity || 1,
          name: `Tiket Masuk Heritage (${slug})`,
        },
      ],
    };

    // Buat Snap Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId: orderId,
    });
  } catch (error: any) {
    console.error("Midtrans Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuat sesi pembayaran." },
      { status: 500 }
    );
  }
}