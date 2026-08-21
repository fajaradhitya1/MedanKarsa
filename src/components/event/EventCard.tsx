import Link from "next/link";
import {
  CalendarDays,
  MapPin,
} from "lucide-react";

export type EventCardData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  startAt: string;
  endAt: string;
  coverImage: string | null;
  price?: number;
};

interface EventCardProps {
  event: EventCardData;
}

export default function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startAt);

  const date = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e5ddcd] bg-white shadow-sm transition hover:shadow-lg">
      <div>
        {/* IMAGE */}
        <div className="relative h-56 overflow-hidden bg-[#eee8dc]">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#173d2b]">
              <span className="font-serif text-3xl text-[#e2b45e]">
                MedanKarsa
              </span>
            </div>
          )}

          {/* BADGE "EVENT" (SESUAI REQUEST) */}
          <div className="absolute left-4 top-4 rounded-full bg-[#173d2b] px-3.5 py-1 text-xs font-bold text-white shadow-sm">
            EVENT
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <h3 className="font-serif text-2xl font-bold text-[#173d2b] leading-tight">
            {event.title}
          </h3>

          <div className="mt-4 space-y-2.5 text-sm text-[#697067]">
            <div className="flex items-center gap-2.5">
              <CalendarDays
                size={17}
                className="shrink-0 text-[#8b9189]"
              />
              <span>{date}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin
                size={17}
                className="shrink-0 text-[#8b9189]"
              />
              <span className="line-clamp-1">
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER (HARGA & TOMBOL HIJAU MUDA "LIHAT EVENT") */}
      <div className="flex items-center justify-between border-t border-[#f2eadb] px-6 py-4 bg-[#fdfbf7]">
        <span className="font-bold text-lg text-[#173d2b]">
          {event.price && event.price > 0 
            ? `Rp ${event.price.toLocaleString("id-ID")}` 
            : "Gratis"}
        </span>

        <Link
          href={`/event/${event.slug}`}
          className="rounded-xl bg-[#e5f1e3] px-4 py-2.5 text-xs font-bold text-[#173d2b] transition hover:bg-[#d4e8d1]"
        >
          Lihat Event
        </Link>
      </div>
    </div>
  );
}