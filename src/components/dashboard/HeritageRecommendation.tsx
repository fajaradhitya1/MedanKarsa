"use client";

import { useState } from "react";
import { ChevronRight, Heart, MapPin } from "lucide-react";

const heritage = [
  {
    name: "Istana Maimun",
    location: "Jl. Brigjen Katamso",
    rating: "4.8",
    image:
      "/assets/istanamaimun/cover.jpeg",
  },
  {
    name: "Tjong A Fie Mansion",
    location: "Jl. Jend. Ahmad Yani No.105, Kesawan, Kec. Medan Bar., Kota Medan,",
    rating: "4.9",
    image:
      "/assets/tjongafi/halaman.jpeg",
  },
  {
    name: "Masjid Agung",
    location: "Jl. Sisingamangaraja No.74c, Mesjid, Kec. Medan Kota, Kota Medan, ",
    rating: "4.8",
    image:
      "/assets/masjidraya/masjid.jpeg",
  },
];

export default function HeritageRecommendation() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const toggleLike = (name: string) => {
    setLikes((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section className="mt-20 ">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr] items-center ">
        
        {/* SISI KIRI: Judul & Deskripsi "Kenali Lebih Dekat" */}
        <div>
          <p className="text-xs font-bold tracking-[.25em] text-[#a27731]">
            KENALI LEBIH DEKAT
          </p>

          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#173d2b] sm:text-4xl leading-tight">
            Medan & <br />
            Sumatera Utara
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#697067] font-sans">
            Dari keramahan warganya, kekayaan kuliner, warisan sejarah, hingga potensi alam yang mempesona — semua ada di sini.
          </p>

          <a
            href="/heritage"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#dcae59] px-6 py-3.5 text-sm font-bold text-[#173d2b] shadow-xs transition hover:bg-[#cca04b]"
          >
            Jelajahi Sekarang <ChevronRight size={16} />
          </a>
        </div>

        {/* SISI KANAN: 3 Kartu Destinasi dengan Rating, Lokasi, Like, dan Jelajah */}
        <div className="grid gap-5 sm:grid-cols-3">
          {heritage.map((item) => {
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

                    {/* Tombol Like Interaktif */}
                    <button
                      onClick={() => toggleLike(item.name)}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xs transition hover:scale-110"
                    >
                      <Heart
                        size={17}
                        className={isLiked ? "fill-red-500 text-red-500" : "text-[#173d2b]"}
                      />
                    </button>

                    {/* Badge Rating */}
                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#173d2b] backdrop-blur-md shadow-xs">
                      ★ {item.rating}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold tracking-tight text-[#173d2b]">
                      {item.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#697067] font-sans">
                      <MapPin size={14} className="text-[#a27731]" />
                      {item.location}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <a
                    href="/heritage"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#21633f] transition hover:gap-2.5"
                  >
                    Jelajahi
                    <ChevronRight size={15} />
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