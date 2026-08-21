import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, category, description, address, latitude, longitude, image } = body;

    // Simpan ke database
    const newUmkm = await prisma.umkm.create({
      data: {
        name,
        category,
        description,
        address,
        latitude,
        longitude,
        image: image || null,
        status: "PENDING", 
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: newUmkm });
  } catch (error) {
    console.error("Error submitting UMKM:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}