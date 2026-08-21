import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    const heritage = await prisma.heritage.findUnique({
      where: { slug },
    });

    if (!heritage) {
      return NextResponse.json({ error: "Heritage tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(heritage);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}