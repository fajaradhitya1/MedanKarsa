"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeritageImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#e8e2d6] flex flex-col">
      {/* AREA GAMBAR UTAMA */}
      <div className="relative h-[400px] w-full">
        {images && images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt={`${name} - Foto ${currentIndex + 1}`}
            className="h-full w-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#697067]">
            Tidak ada gambar yang tersedia.
          </div>
        )}

        {/* TOMBOL PANAH NAVIGASI */}
        {images && images.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white shadow hover:bg-black/80 cursor-pointer z-20"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white shadow hover:bg-black/80 cursor-pointer z-20"
            >
              <ChevronRight size={22} />
            </button>

            {/* DOTS / TITIK INDIKATOR */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20 bg-black/30 px-3 py-1 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === index ? "w-6 bg-white" : "w-2.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}