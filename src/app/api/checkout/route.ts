import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, firstName, lastName, email, phone, idNumber } = body;

    // 1. Cari event berdasarkan slug
    let event = await prisma.event.findUnique({
      where: { slug },
    });

    if (!event) {
      event = await prisma.event.findFirst();
    }

    if (!event) {
      return NextResponse.json({ error: "Event tidak ditemukan." }, { status: 404 });
    }

    const orderId = `MDK-${Date.now()}`;
    const buyerName = `${firstName} ${lastName || ""}`.trim();
    const amount = event.price > 0 ? event.price : 50000; // Harga default 50rb jika 0

    // 2. Parameter transaksi untuk Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
      },
      item_details: [
        {
          id: event.id,
          price: amount,
          quantity: 1,
          name: event.title,
        },
      ],
      callbacks: {
        finish: `http://localhost:3000/event/${slug}`,
        unfinish: `http://localhost:3000/event/${slug}`,
        error: `http://localhost:3000/event/${slug}`,
        },
    };

    // 3. Request Snap Token dari Midtrans
    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({ 
      token: transaction.token, 
      orderId,
      eventId: event.id,
      buyerName,
      email,
      phone 
    });
  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: "Gagal membuat transaksi pembayaran" }, { status: 500 });
  }
}