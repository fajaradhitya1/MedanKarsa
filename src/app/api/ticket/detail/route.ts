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
        event: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, message: "Tiket tidak ditemukan di database" }, { status: 404 });
    }

    // Jika ini adalah tiket Heritage (berdasarkan orderId atau formatnya)
    if (orderId.includes("HERITAGE") || orderId.includes("TJONG-A-FIE") || orderId.includes("MAIMOON")) {
      const isMaimoon = orderId.includes("MAIMOON");
      
      // Berikan data objek event buatan khusus untuk heritage agar tidak nyasar ke Fun Run
      const heritageEventOverride = {
        title: isMaimoon ? "Tiket Masuk Istana Maimoon" : "Tiket Masuk Rumah Tjong A Fie",
        location: isMaimoon 
          ? "Jl. Brigjend Katamso, Sukaraja, Kec. Medan Maimun, Kota Medan" 
          : "Jl. Jend. Ahmad Yani No.134, Kesawan, Kec. Medan Bar., Kota Medan",
        description: isMaimoon 
          ? "Istana Kesultanan Deli yang megah dengan arsitektur perpaduan Melayu, Timur Tengah, dan Eropa." 
          : "Mansion bersejarah bergaya Tionghoa-Art Deco milik saudagar kaya Tjong A Fie di Medan.",
        startAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        ticket: {
          ...ticket,
          paymentType: ticket.paymentType || "QRIS / Payment Gateway",
          event: heritageEventOverride,
        },
      });
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