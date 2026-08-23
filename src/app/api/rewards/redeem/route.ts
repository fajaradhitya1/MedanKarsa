import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { itemId, title, pointsRequired, type } = await req.json(); // type: "HERITAGE" atau "EVENT"

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { pointTransactions: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    // Hitung total poin saat ini secara real-time
    const currentPoints = user.pointTransactions.reduce((acc, tx) => acc + tx.amount, 0);

    if (currentPoints < pointsRequired) {
      return NextResponse.json({ success: false, message: "Poin Anda tidak mencukupi untuk penukaran ini!" }, { status: 400 });
    }

    // Tentukan eventId yang sesuai berdasarkan tipe penukaran
    let targetEventId = "";

    if (type === "EVENT") {
      // Pastikan event yang dipilih benar-benar ada di database berdasarkan itemId
      const selectedEvent = await prisma.event.findUnique({
        where: { id: itemId },
      });
      if (!selectedEvent) {
        return NextResponse.json({ success: false, message: "Event yang dipilih tidak ditemukan." }, { status: 404 });
      }
      targetEventId = selectedEvent.id;
    } else {
      // Untuk kategori Heritage, ambil event referensi pertama atau buat event khusus heritage jika ada
      let defaultEvent = await prisma.event.findFirst();
      if (!defaultEvent) {
        return NextResponse.json({ success: false, message: "Belum ada referensi event/heritage di database." }, { status: 400 });
      }
      targetEventId = defaultEvent.id;
    }

    // Generate kode unik tiket penukaran reward
    const redeemOrderCode = `REDEEM-${type}-${Date.now()}`;

    // 1. Kurangi poin melalui tabel PointTransaction (nilai negatif)
    await prisma.pointTransaction.create({
      data: {
        userId: user.id,
        amount: -pointsRequired,
        type: "REDEEM",
        description: `Penukaran Poin untuk ${title}`,
      },
    });

    // 2. Terbitkan E-Tiket otomatis dengan menghubungkannya ke eventId yang tepat
    const newTicket = await prisma.ticket.create({
      data: {
        ticketCode: redeemOrderCode,
        buyerName: user.name || "Member Karsa",
        buyerEmail: user.email,
        buyerPhone: "-",
        status: "SUCCESS",
        paymentType: "KARSA_POINTS",
        eventId: targetEventId,
      },
    });

    // 3. Kirim notifikasi sukses penukaran
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "🎁 Penukaran Reward Berhasil!",
        message: `Anda berhasil menukar ${pointsRequired} Poin untuk ${title}. E-tiket Anda telah diterbitkan!`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berhasil menukar poin!",
      orderId: redeemOrderCode,
    });
  } catch (error: any) {
    console.error("Redeem Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Terjadi kesalahan server" }, { status: 500 });
  }
}