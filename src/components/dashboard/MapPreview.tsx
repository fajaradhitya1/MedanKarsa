import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPlace } from "./MedanMap";
import ClientMapPreview from "./ClientMapPreview";

export default async function MapPreview() {
  // Ambil data Event yang berstatus PUBLISHED dari database
  const publishedEvents = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true, latitude: true, longitude: true },
  });

  const eventPlaces: MapPlace[] = publishedEvents.map((e) => ({
    id: `event-${e.id}`,
    name: e.title,
    category: "Event",
    position: [e.latitude, e.longitude] as [number, number],
    href: `/event/${e.slug}`,
  }));

  const staticPlaces: MapPlace[] = [
    { id: "h-1", name: "Istana Maimun", category: "Heritage", position: [3.5752, 98.6839], href: "/heritage" },
    { id: "h-2", name: "Masjid Raya Al-Mashun", category: "Heritage", position: [3.5751, 98.6873], href: "/heritage" },
    { id: "u-1", name: "7 Sumatra Beans (Kedai Kopi)", category: "UMKM", position: [3.5900, 98.6750], href: "/umkm" },
  ];

  const allPlaces = [...staticPlaces, ...eventPlaces];

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-[#a27731]">MEDAN LIVE MAP</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#173d2b]">Jelajahi Medan dalam satu peta</h2>
          <p className="mt-2 text-sm text-[#777d75]">Temukan lokasi heritage, event, dan UMKM di sekitar Medan.</p>
        </div>
        <Link href="/map" className="hidden text-sm font-bold text-[#21633f] sm:block">
          Buka Peta →
        </Link>
      </div>

      {/* Render Client Component */}
      <ClientMapPreview places={allPlaces} />
    </section>
  );
}