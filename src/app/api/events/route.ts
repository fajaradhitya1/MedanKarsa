import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Kamu harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      detailDescription,
      category,
      location,
      latitude,
      longitude,
      date,
      startTime,
      endTime,
      coverImage,
      price,          
      paymentQrCode,  
    } = body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !detailDescription?.trim() ||
      !category ||
      !location?.trim() ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const startAt = new Date(`${date}T${startTime}:00`);
    const endAt = new Date(`${date}T${endTime}:00`);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      return NextResponse.json(
        { message: "Tanggal atau waktu tidak valid." },
        { status: 400 }
      );
    }

    let slug = createSlug(title);
    const existingSlug = await prisma.event.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        detailDescription: detailDescription.trim(),
        category,
        location: location.trim(),
        latitude: Number(latitude) || 3.5952,
        longitude: Number(longitude) || 98.6722,
        startAt,
        endAt,
        coverImage: coverImage || null,
        price: Number(price) || 0,                 // Menyimpan harga event
        paymentQrCode: paymentQrCode || null,      // Menyimpan QR code pembayaran unik
        status: "PENDING",
        submittedById: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event berhasil diajukan. Menunggu persetujuan admin.",
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengajukan event." },
      { status: 500 }
    );
  }
}