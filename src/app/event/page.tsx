import { prisma } from "@/lib/prisma";
import EventHero from "@/components/event/EventHero";
import EventFilter from "@/components/event/EventFilter";
import { CheckCircle2 } from "lucide-react";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

async function getEvents() {
  await prisma.event.deleteMany({
    where: {
      endAt: {
        lt: new Date(),
      },
    },
  });

  return prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      endAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });
}

export default async function EventPage({
  searchParams,
}: {
  searchParams: Promise<{
    submitted?: string;
  }>;
}) {
  const events = await getEvents();
  const params = await searchParams;

  const formattedEvents = events.map((event) => ({
    ...event,
    startAt: event.startAt.toISOString(),
    endAt: event.endAt.toISOString(),
    coverImage: event.coverImage,
    price: event.price || 0,
  }));

  return (
    <main className="min-h-screen bg-[#ffff]">
      {/* Banner Hero yang sudah memiliki tombol Ajukan Event di dalamnya */}
      <EventHero />

      {/* Notifikasi Pengajuan Berhasil (jika ada) */}
      {params.submitted === "true" && (
        <section className="mx-auto max-w-7xl px-5 mt-8">
          <div className="flex items-start gap-3 rounded-2xl border border-[#cbdcc9] bg-[#edf5ec] p-4 text-[#173d2b]">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Pengajuan event berhasil!</p>
              <p className="mt-1 text-sm text-[#697067]">Event kamu sedang menunggu persetujuan admin.</p>
            </div>
          </div>
        </section>
      )}

      {/* Komponen Filter & Daftar Event (Tombol duplikat di luar banner sudah dihapus) */}
      <EventFilter events={formattedEvents} />
      <Footer />
    </main>
  );
}