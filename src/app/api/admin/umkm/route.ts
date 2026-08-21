import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // (Opsional) Tambahkan pengecekan role admin jika diperlukan
    const body = await req.json();
    const { id, status } = body; // status bisa "APPROVED" atau "REJECTED"

    if (!id || !status) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const updatedUmkm = await prisma.umkm.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    // Kirim notifikasi ke pembuat UMKM jika disetujui/ditolak
    if (updatedUmkm.userId) {
      const isApproved = status === "APPROVED";
      await prisma.notification.create({
        data: {
          userId: updatedUmkm.userId,
          title: isApproved ? "UMKM Disetujui! 🎉" : "Pengajuan UMKM Ditolak",
          message: isApproved 
            ? `Usaha "${updatedUmkm.name}" Anda telah disetujui dan kini tampil di peta UMKM.` 
            : `Mohon maaf, pengajuan usaha "${updatedUmkm.name}" belum dapat disetujui.`,
        },
      });
    }

    return NextResponse.json({ success: true, data: updatedUmkm });
  } catch (error) {
    console.error("Error updating UMKM status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}