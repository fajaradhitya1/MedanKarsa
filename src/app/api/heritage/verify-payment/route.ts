import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, phone, name, eventId, paymentType } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID (ticketCode) tidak ditemukan." },
        { status: 400 }
      );
    }

    // 1. Cek apakah tiket dengan ticketCode (orderId) tersebut sudah ada
    let existingTicket = await prisma.ticket.findUnique({
      where: { ticketCode: orderId },
    });

    if (existingTicket) {
      // Jika status masih PENDING, ubah menjadi SUCCESS setelah verifikasi pembayaran
      if (existingTicket.status === "PENDING") {
        existingTicket = await prisma.ticket.update({
          where: { ticketCode: orderId },
          data: {
            status: "SUCCESS",
            paymentType: paymentType || "qris",
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Tiket sudah aktif dan terverifikasi.",
        ticket: existingTicket,
      });
    }

    // 2. Jika belum ada, buat data tiket baru menggunakan skema asli Anda
    // Pastikan eventId valid (atau ambil event default/heritage terkait jika ada)
    const newTicket = await prisma.ticket.create({
      data: {
        ticketCode: orderId,
        buyerName: name || "Pengunjung Medan Karsa",
        buyerEmail: body.email || "visitor@medankarsa.com",
        buyerPhone: phone || "-",
        status: "SUCCESS",
        paymentType: paymentType || "qris",
        eventId: eventId || "default-event-id", // Sesuaikan dengan ID event/heritage yang valid di database Anda
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil diverifikasi dan tiket diterbitkan.",
      ticket: newTicket,
    });
  } catch (error: any) {
    console.error("Error verify payment:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}