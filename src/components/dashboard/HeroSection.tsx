import Link from "next/link";
import { ArrowRight, Play, MapPin } from "lucide-react";

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden bg-[#ffff] pt-6 pb-20">
      {/* Kontainer Full Width dengan padding horizontal agar melebar ke kiri dan kanan */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        
        {/* HERO CARD UTAMA - FULL KIRI KANAN */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#eaf2ed] via-[#d6e5dd] to-[#eaf2ed] p-8 sm:p-14 lg:p-20 border border-[#cbe0d4] shadow-xs">
          
          {/* Latar Belakang Landmark Medan */}
          <div className="absolute inset-0 opacity-20 bg-[url('/assets/Pitchdeck/breadcrumb-bg.jpg')] bg-cover bg-center pointer-events-none" />


          
          <div className="relative z-10 max-w-4xl">
            
            {/* Badge Lokasi */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#173d2b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
              <MapPin size={13} className="text-[#dcae59]" /> Medan, Sumatera Utara
            </div>

            {/* Judul Utama */}
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#173d2b] sm:text-6xl lg:text-7xl tracking-tight">
              Jelajahi warisan, <br />
              hidupkan Medan.
            </h1>
            

            {/* Deskripsi */}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#435249] sm:text-lg font-sans">
              Terwujudnya Medan yang lebih maju, inklusif dan berdaya saing melalui kolaborasi seluruh elemen masyarakat.
            </p>

            {/* Tombol Aksi */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/heritage"
                className="flex items-center gap-2 rounded-2xl bg-[#dcae59] px-7 py-3.5 text-sm font-bold text-[#173d2b] shadow-md transition hover:bg-[#cca04b]"
              >
                Mulai Jelajah <ArrowRight size={16} />
              </Link>
             
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}