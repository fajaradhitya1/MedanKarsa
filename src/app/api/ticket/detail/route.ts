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

    const upperOrderId = orderId.toUpperCase();
    const isHeritage = upperOrderId.includes("HERITAGE") || upperOrderId.includes("TJONG") || upperOrderId.includes("MAIMUN") || upperOrderId.includes("MAIMOON") || upperOrderId.includes("MASJID") || upperOrderId.includes("AL-MASHUN");

    if (isHeritage) {
      // Deteksi destinasi secara spesifik
      const isMasjidRaya = upperOrderId.includes("MASJID") || upperOrderId.includes("MASHUN") || upperOrderId.includes("RW-3");
      const isMaimoon = upperOrderId.includes("MAIMUN") || upperOrderId.includes("MAIMOON") || upperOrderId.includes("RW-2");
      
      let heritageTitle = "Tiket Masuk Rumah Tjong A Fie";
      let heritageLocation = "Jl. Jend. Ahmad Yani No.134, Kesawan, Kec. Medan Bar., Kota Medan";
      let heritageDesc = "Mansion bersejarah bergaya Tionghoa-Art Deco milik saudagar kaya Tjong A Fie di Medan.";

      if (isMasjidRaya) {
        heritageTitle = "Tiket Kunjungan Wisata Masjid Raya Al-Mashun";
        heritageLocation = "Jl. Sisingamangaraja, Masjid, Kec. Medan Kota, Kota Medan";
        heritageDesc = "Masjid Raya Medan yang dibangun pada tahun 1906 dengan arsitektur megah bergaya Maroko, Eropa, dan Melayu.";
      } else if (isMaimoon) {
        heritageTitle = "Tiket Masuk Istana Maimoon";
        heritageLocation = "Jl. Brigjend Katamso, Sukaraja, Kec. Medan Maimun, Kota Medan";
        heritageDesc = "Istana Kesultanan Deli yang megah dengan arsitektur perpaduan Melayu, Timur Tengah, dan Eropa.";
      }

      const heritageEventOverride = {
        title: heritageTitle,
        location: heritageLocation,
        description: heritageDesc,
        startAt: new Date().toISOString(),
      };

      const isPoints = ticket.paymentType === "KARSA_POINTS" || upperOrderId.startsWith("REDEEM");
      const paymentLabel = isPoints ? "⭐ Penukaran Karsa Poin" : (ticket.paymentType || "QRIS / Payment Gateway");

      return NextResponse.json({
        success: true,
        ticket: {
          ...ticket,
          paymentType: paymentLabel,
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