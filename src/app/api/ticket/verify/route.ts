import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId, paymentType } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID tidak ditemukan" }, { status: 400 });
    }

    // 1. Update status tiket menjadi SUCCESS
    const updatedTicket = await prisma.ticket.update({
      where: { ticketCode: orderId },
      data: {
        status: "SUCCESS",
        paymentType: paymentType || "QRIS",
      },
      include: {
        event: true,
      },
    });

    if (!updatedTicket) {
      return NextResponse.json({ success: false, message: "Tiket tidak ditemukan" }, { status: 404 });
    }

    // 2. Berikan Cashback Karsa Poin secara otomatis ke User
    const buyerEmail = updatedTicket.buyerEmail;
    const earnedPoints = 50; // Bonus poin cashback per transaksi berhasil

    if (buyerEmail) {
      const user = await prisma.user.findUnique({
        where: { email: buyerEmail },
      });

      if (user) {
        // Cek agar tidak terjadi duplikasi pencatatan poin untuk orderId yang sama
        const existingTx = await prisma.pointTransaction.findFirst({
          where: { description: { contains: updatedTicket.ticketCode } },
        });

        if (!existingTx) {
          // A. Catat ke PointTransaction (tampil real-time di Dompet Karsa)
          await prisma.pointTransaction.create({
            data: {
              userId: user.id,
              amount: earnedPoints,
              type: "EARN",
              description: `Cashback Poin dari Pembelian Tiket (${updatedTicket.event?.title || "Event"})`,
            },
          });

          // B. Kirim Notifikasi ke user
          await prisma.notification.create({
            data: {
              userId: user.id,
              title: "🎉 Selamat, Anda Mendapat Karsa Poin!",
              message: `Pembayaran tiket berhasil. Anda mendapatkan +${earnedPoints} Karsa Points!`,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Verifikasi berhasil dan poin ditambahkan",
      earnedPoints,
    });
  } catch (error: any) {
    console.error("Verify Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}