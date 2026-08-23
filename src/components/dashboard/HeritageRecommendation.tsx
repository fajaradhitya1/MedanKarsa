"use client";

import { useState } from "react";
import { ChevronRight, Heart, MapPin, Landmark, Utensils } from "lucide-react";

// Data Destinasi Heritage
const heritageItems = [
  {
    name: "Istana Maimun",
    location: "Jl. Brigjen Katamso",
    rating: "4.8",
    image: "/assets/istanamaimun/cover.jpeg",
    link: "/heritage",
  },
  {
    name: "Tjong A Fie Mansion",
    location: "Jl. Jend. Ahmad Yani No.105, Kesawan",
    rating: "4.9",
    image: "/assets/tjongafi/halaman.jpeg",
    link: "/heritage",
  },
  {
    name: "Masjid Raya",
    location: "Jl. Sisingamangaraja No.74c, Mesjid",
    rating: "4.8",
    image: "/assets/masjidraya/masjid.jpeg",
    link: "/heritage",
  },
];

// Data Kuliner Khas Medan
const culinaryItems = [
  {
    name: "Bika Ambon Zulaikha",
    location: "Jl. Mojopahit No.62 A, Petisah Hulu",
    rating: "4.9",
    image: "/assets/kuliner/bikaambon.jpg",
    link: "/umkm",
  },
  {
    name: "Soto Kesawan",
    location: "Jl. Jend. Ahmad Yani (Kawasan Kesawan)",
    rating: "4.8",
    image: "/assets/kuliner/soto.jpeg",
    link: "/umkm",
  },
  {
    name: "Merdeka Walk Culinary",
    location: "Jl. Balai Kota (Pusat Kota Medan)",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
    link: "/umkm",
  },
  {
    name: "Bihun Bebek Asie",
    location: "Jl. Kumango No.15, Kesawan",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    link: "/umkm",
  },
];

export default function HeritageRecommendation() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const toggleLike = (name: string) => {
    setLikes((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section className="mt-20 space-y-16">
      
      {/* ================= BAGIAN 1: TEKS DI ATAS (HEADER) ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e2d8c5]/60 pb-8">
        <div className="space-y-2 text-left max-w-2xl">
          <p className="text-xs font-bold tracking-[.25em] text-[#a27731]">
            KENALI LEBIH DEKAT
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#173d2b] sm:text-4xl leading-tight">
            Warisan Sejarah & Surga Kuliner Medan
          </h2>
          <p className="text-sm leading-relaxed text-[#697067] font-sans">
            Jelajahi keindahan arsitektur cagar budaya tempo dulu serta nikmati kelezatan kuliner legendaris yang menggugah selera di Kota Medan.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/heritage"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#173d2b] px-5 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#0f291d]"
          >
            <Landmark size={15} /> Jelajahi Heritage
          </a>
          <a
            href="/umkm"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#dcae59] px-5 py-3 text-xs font-bold text-[#173d2b] shadow-xs transition hover:bg-[#cca04b]"
          >
            <Utensils size={15} /> Jelajahi Kuliner
          </a>
        </div>
      </div>

      {/* ================= BARIS 1: HERITAGE (BISA DI-SCROLL KIRI KANAN) ================= */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#173d2b] flex items-center gap-2">
            <Landmark size={18} className="text-[#a27731]" /> Destinasi Heritage Pilihan
          </h3>
          <span className="text-xs text-gray-400 font-medium">Geser untuk melihat lainnya &rarr;</span>
        </div>

        {/* Kontainer Slider Horizontal */}
        <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-200">
          {heritageItems.map((item) => {
            const isLiked = likes[item.name] || false;

            return (
              <article
                key={item.name}
                className="group shrink-0 w-[280px] sm:w-[320px] overflow-hidden rounded-[28px] border border-[#e2d8c5] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between snap-start"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-[#f0eae1]">
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
                    <h4 className="font-serif text-lg font-bold tracking-tight text-[#173d2b]">
                      {item.name}
                    </h4>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#697067] font-sans">
                      <MapPin size={14} className="text-[#a27731] shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <a
                    href={item.link}
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

      {/* ================= BARIS 2: KULINER (BISA DI-SCROLL KIRI KANAN) ================= */}
      <div className="space-y-4 text-left pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#173d2b] flex items-center gap-2">
            <Utensils size={18} className="text-[#a27731]" /> Kuliner & Oleh-Oleh Legendaris
          </h3>
          <span className="text-xs text-gray-400 font-medium">Geser untuk melihat lainnya &rarr;</span>
        </div>

        {/* Kontainer Slider Horizontal */}
        <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-200">
          {culinaryItems.map((item) => {
            const isLiked = likes[item.name] || false;

            return (
              <article
                key={item.name}
                className="group shrink-0 w-[280px] sm:w-[320px] overflow-hidden rounded-[28px] border border-[#e2b45e]/40 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between snap-start"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-[#f0eae1]">
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
                    <h4 className="font-serif text-lg font-bold tracking-tight text-[#173d2b]">
                      {item.name}
                    </h4>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#697067] font-sans">
                      <MapPin size={14} className="text-[#a27731] shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <a
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#21633f] transition hover:gap-2.5"
                  >
                    Cicipi Kuliner <ChevronRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

    </section>
  );
}