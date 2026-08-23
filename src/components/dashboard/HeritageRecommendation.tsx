"use client";

import { useState } from "react";
import { ChevronRight, Heart, MapPin, Utensils, Landmark } from "lucide-react";

// Data Destinasi Heritage
const heritageItems = [
  {
    name: "Istana Maimun",
    location: "Jl. Brigjen Katamso",
    rating: "4.8",
    image: "/assets/istanamaimun/cover.jpeg",
  },
  {
    name: "Tjong A Fie Mansion",
    location: "Jl. Jend. Ahmad Yani No.105, Kesawan",
    rating: "4.9",
    image: "/assets/tjongafi/halaman.jpeg",
  },
  {
    name: "Masjid Raya",
    location: "Jl. Sisingamangaraja No.74c, Mesjid",
    rating: "4.8",
    image: "/assets/masjidraya/masjid.jpeg",
  },
];

// Data Kuliner Khas Medan
const culinaryItems = [
  {
    name: "Bika Ambon Zulaikha",
    location: "Jl. Mojopahit No.62 A, Petisah Hulu",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Soto Kesawan",
    location: "Jl. Jend. Ahmad Yani (Kawasan Kesawan)",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Merdeka Walk Culinary",
    location: "Jl. Balai Kota (Pusat Kota Medan)",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
  },
];

export default function HeritageRecommendation() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const toggleLike = (name: string) => {
    setLikes((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section className="mt-20 space-y-24">
      
      {/* ================= SECTION 1: HERITAGE ================= */}
      <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr] items-center">
        
        {/* SISI KIRI: Judul Heritage */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-[.25em] text-[#a27731]">
            <Landmark size={14} /> WARISAN SEJARAH
          </div>

          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#173d2b] sm:text-4xl leading-tight">
            Jelajahi Pesona <br />
            Heritage Medan
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#697067] font-sans">
            Saksikan kemegahan arsitektur masa lampau, mulai dari istana kesultanan, mansion saudagar legendaris, hingga masjid bersejarah.
          </p>

          <a
            href="/heritage"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#dcae59] px-6 py-3.5 text-sm font-bold text-[#173d2b] shadow-xs transition hover:bg-[#cca04b]"
          >
            Lihat Semua Heritage <ChevronRight size={16} />
          </a>
        </div>

        {/* SISI KANAN: Slider / Grid Kartu Heritage */}
        <div className="grid gap-5 sm:grid-cols-3">
          {heritageItems.map((item) => {
            const isLiked = likes[item.name] || false;

            return (
              <article
                key={item.name}
                className="group overflow-hidden rounded-[28px] border border-[#e2d8c5] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-[#f0eae1]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <button
                      onClick={() => toggleLike(item.name)}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xs transition hover:scale-110"
                    >
                      <Heart
                        size={17}
                        className={isLiked ? "fill-red-500 text-red-500" : "text-[#173d2b]"}
                      />
                    </button>

                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#173d2b] backdrop-blur-md shadow-xs">
                      ★ {item.rating}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold tracking-tight text-[#173d2b]">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#697067] font-sans">
                      <MapPin size={14} className="text-[#a27731] shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <a
                    href="/heritage"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#21633f] transition hover:gap-2.5"
                  >
                    Jelajahi Destinasi <ChevronRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* ================= SECTION 2: KULINER ================= */}
      <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr] items-center">
        
        {/* SISI KIRI: Kartu Kuliner (Dipindah ke Kiri agar Layout Selang-seling / Zig-Zag Menarik) */}
        <div className="grid gap-5 sm:grid-cols-3 order-2 lg:order-1">
          {culinaryItems.map((item) => {
            const isLiked = likes[item.name] || false;

            return (
              <article
                key={item.name}
                className="group overflow-hidden rounded-[28px] border border-[#e2d8c5] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-[#f0eae1]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <button
                      onClick={() => toggleLike(item.name)}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xs transition hover:scale-110"
                    >
                      <Heart
                        size={17}
                        className={isLiked ? "fill-red-500 text-red-500" : "text-[#173d2b]"}
                      />
                    </button>

                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#173d2b] backdrop-blur-md shadow-xs">
                      ★ {item.rating}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold tracking-tight text-[#173d2b]">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#697067] font-sans">
                      <MapPin size={14} className="text-[#a27731] shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <a
                    href="/umkm"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#21633f] transition hover:gap-2.5"
                  >
                    Cicipi Kuliner <ChevronRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* SISI KANAN: Deskripsi Kuliner */}
        <div className="order-1 lg:order-2">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[.25em] text-[#a27731]">
            <Utensils size={14} /> KULINER LEGENDARIS
          </div>

          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#173d2b] sm:text-4xl leading-tight">
            Surga Rasa <br />
            Kota Medan
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#697067] font-sans">
            Dari kelezatan Bika Ambon yang ikonik, kehangatan Soto Kesawan, hingga jajanan malam legendaris — manjakan lidah Anda dengan cita rasa khas Medan.
          </p>

          <a
            href="/umkm"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#173d2b] px-6 py-3.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#0f291d]"
          >
            Jelajahi Kuliner & UMKM <ChevronRight size={15} />
          </a>
        </div>

      </div>

    </section>
  );
}