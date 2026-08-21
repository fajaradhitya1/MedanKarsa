import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Params
) {
  try {
    const { slug } = await params;

    const event = await prisma.event.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        endAt: {
          gte: new Date(),
        },
      },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: "Event tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("GET EVENT DETAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail event",
      },
      {
        status: 500,
      }
    );
  }
}