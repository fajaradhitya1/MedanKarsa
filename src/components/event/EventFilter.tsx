"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Search } from "lucide-react";
import EventCard from "./EventCard";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  description: string;
  startAt: string;
  endAt: string;
  coverImage: string | null;
  price?: number;
}

interface EventFilterProps {
  events: EventItem[];
}

const categories = ["Semua", "Budaya", "Kuliner", "Kreatif", "Seni", "Musik", "Komunitas"];

export default function EventFilter({ events = [] }: EventFilterProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = activeCategory === "Semua" || event.category === activeCategory;
      const searchText = search.toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(searchText) ||
        event.category.toLowerCase().includes(searchText) ||
        event.location.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, events]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-[#a27731]">TEMUKAN EVENT</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#173d2b]">Apa yang sedang terjadi?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#777d75]">
            Cari event berdasarkan kategori atau nama kegiatan yang ingin kamu kunjungi.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9189]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari event..."
            className="w-full rounded-2xl border border-[#e2d8c5] bg-white py-3.5 pl-11 pr-4 text-sm text-[#173d2b] outline-none transition focus:border-[#21633f] focus:ring-2 focus:ring-[#21633f]/10"
          />
        </div>
      </div>

      {/* CATEGORY: Diubah menjadi flex-wrap agar menumpuk ke bawah di mobile, dan berderet rapi di layar besar */}
      <div className="mt-7 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              category === activeCategory
                ? "bg-[#173d2b] text-white shadow-sm"
                : "border border-[#e2d8c5] bg-white text-[#697067] hover:bg-[#eee8dc]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#777d75]">
          <CalendarDays size= {16} className="text-[#a27731]" />
          <span>{filteredEvents.length} event ditemukan</span>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-[#d8cfbe] bg-white px-6 py-16 text-center">
          <MapPin size={24} className="mx-auto text-[#a27731]" />
          <h3 className="mt-4 font-serif text-xl font-bold text-[#173d2b]">Event tidak ditemukan</h3>
          <button onClick={() => { setSearch(""); setActiveCategory("Semua"); }} className="mt-5 rounded-xl bg-[#173d2b] px-5 py-2.5 text-xs font-bold text-white">
            Reset Filter
          </button>
        </div>
      )}
    </section>
  );
}