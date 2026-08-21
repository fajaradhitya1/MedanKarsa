"use server";

import { prisma } from "@/lib/prisma";
import { sendEventApprovedEmail } from "@/lib/mail";

export async function handleApproveEvent(eventId: string) {
  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: "PUBLISHED" },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event.submittedBy) {
      return { success: false, message: "Pembuat event tidak ditemukan." };
    }

    await prisma.notification.create({
      data: {
        userId: event.submittedBy.id,
        title: "Event Disetujui! 🎉",
        message: `Selamat! Event "${event.title}" Anda telah disetujui dan kini tayang.`,
      },
    });

    if (event.submittedBy.email) {
      await sendEventApprovedEmail(
        event.submittedBy.email,
        event.submittedBy.name ?? "Warga Medan",
        event.title
      );
    }

    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: event.submittedBy.id },
      },
      select: { id: true },
    });

    if (otherUsers.length > 0) {
      await prisma.notification.createMany({
        data: otherUsers.map((u) => ({
          userId: u.id,
          type: "INFO", // <--- Tambahkan ini juga
          title: "Event Baru di Medan! 🎪",
          message: `Ada event seru baru: "${event.title}". Yuk cek sekarang!`,
        })),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error saat menyetujui event:", error);
    return { success: false, message: "Terjadi kesalahan saat memproses event." };
  }
}