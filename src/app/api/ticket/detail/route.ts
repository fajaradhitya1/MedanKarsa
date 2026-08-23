import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID tidak ditemukan" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { ticketCode: orderId },
      include: {
        event: true, // Pastikan relasi event ikut diambil
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, message: "Tiket tidak ditemukan di database" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    console.error("Error get ticket detail:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}