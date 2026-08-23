import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, phone, name, email, eventId, paymentType } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID (ticketCode) tidak ditemukan." },
        { status: 400 }
      );
    }

    // 1. Cek apakah tiket dengan ticketCode tersebut sudah ada
    let existingTicket = await prisma.ticket.findUnique({
      where: { ticketCode: orderId },
    });

    let targetTicket;

    if (existingTicket) {
      if (existingTicket.status === "PENDING") {
        targetTicket = await prisma.ticket.update({
          where: { ticketCode: orderId },
          data: {
            status: "SUCCESS",
            paymentType: paymentType || "qris",
            buyerName: name || existingTicket.buyerName,
            buyerPhone: phone || existingTicket.buyerPhone,
          },
        });
      } else {
        targetTicket = existingTicket;
      }
    } else {
      // 2. Ambil event pertama dari database jika eventId tidak disertakan
      let targetEventId = eventId;
      if (!targetEventId) {
        const firstEvent = await prisma.event.findFirst();
        if (!firstEvent) {
          return NextResponse.json(
            { success: false, message: "Tidak ada data Event/Heritage yang tersedia di database." },
            { status: 400 }
          );
        }
        targetEventId = firstEvent.id;
      }

      // 3. Buat data tiket baru ke database
      targetTicket = await prisma.ticket.create({
        data: {
          ticketCode: orderId,
          buyerName: name || "Pengunjung Medan Karsa",
          buyerEmail: email || "visitor@medankarsa.com",
          buyerPhone: phone || "-",
          status: "SUCCESS",
          paymentType: paymentType || "qris",
          eventId: targetEventId,
        },
      });
    }

    // ==========================================
    // LOGIKA OTOMATIS PENAMBAHAN KARSA POIN
    // ==========================================
    const buyerEmailTarget = email || targetTicket.buyerEmail;
    let pointsEarned = 50; // Jumlah bonus poin cashback per transaksi tiket berhasil

    if (buyerEmailTarget) {
      const user = await prisma.user.findUnique({
        where: { email: buyerEmailTarget },
      });

      if (user) {
        // Catat transaksi masuk ke PointTransaction (tampil real-time di Dompet Karsa)
        await prisma.pointTransaction.create({
          data: {
            userId: user.id,
            amount: pointsEarned,
            type: "EARN",
            description: `Cashback Poin dari Pembelian Tiket (${targetTicket.ticketCode})`,
          },
        });

        // Kirimkan notifikasi sukses mendapatkan poin baru ke akun user
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: "🎉 Selamat, Anda Mendapat Karsa Poin!",
            message: `Pembayaran tiket berhasil diverifikasi. Anda mendapatkan +${pointsEarned} Karsa Points!`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil diverifikasi dan tiket diterbitkan.",
      ticket: targetTicket,
      pointsEarned,
    });
  } catch (error: any) {
    console.error("Error verify payment:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}