import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    
    // Keamanan: Pastikan yang mengakses adalah admin
    const admin = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // Update status event di database
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, event: updatedEvent }, { status: 200 });

  } catch (error) {
    console.error("ADMIN EVENT UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}