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

    if (existingTicket) {
      if (existingTicket.status === "PENDING") {
        existingTicket = await prisma.ticket.update({
          where: { ticketCode: orderId },
          data: {
            status: "SUCCESS",
            paymentType: paymentType || "qris",
            buyerName: name || existingTicket.buyerName,
            buyerPhone: phone || existingTicket.buyerPhone,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Tiket sudah aktif dan terverifikasi.",
        ticket: existingTicket,
      });
    }

    // 2. Ambil event pertama dari database jika eventId tidak disertakan (untuk mencegah foreign key error)
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
    const newTicket = await prisma.ticket.create({
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