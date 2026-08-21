"use client";

import Link from "next/link";
import { Send, MapPin, Share2, MessageCircle, Video, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-[#173d2b] text-white pt-24 pb-12 px-6 sm:px-12 lg:px-16">
      
      {/* 1. SVG Shape Divider (Wave di paling atas Footer, warna mengikuti background halaman) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-20">
        <svg 
          className="relative block w-[calc(123%+1.3px)] h-[80px] sm:h-[123px]" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>

      {/* 2. Background Siluet Kota Medan Penuh di Area Hijau Footer */}
      <div className="absolute inset-0 z-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1584646098378-0874589d76b1?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-bottom pointer-events-none mix-blend-luminosity" />

      {/* 3. Konten Utama Footer */}
      <div className="relative z-10 max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr]">
        
        {/* Kolom 1: Logo & Deskripsi */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dcae59] text-[#173d2b] font-bold text-xl">
              M
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
              MedanKarsa
            </h2>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-white/75 font-sans">
            Platform kolaboratif untuk kemajuan Medan dan Sumatera Utara yang lebih baik, inklusif dan berkelanjutan.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dcae59] hover:text-[#173d2b] transition"><Share2 size={16} /></a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dcae59] hover:text-[#173d2b] transition"><MessageCircle size={16} /></a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dcae59] hover:text-[#173d2b] transition"><Video size={16} /></a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dcae59] hover:text-[#173d2b] transition"><Globe size={16} /></a>
          </div>
        </div>

        {/* Kolom 2: Navigasi */}
        <div>
          <h3 className="font-serif text-sm font-bold tracking-wider text-[#dcae59] uppercase">
            Navigasi
          </h3>
          <ul className="mt-4 space-y-2.5 text-xs text-white/80 font-sans">
            <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
            <li><Link href="/about" className="hover:text-white transition">Tentang</Link></li>
            <li><Link href="/event" className="hover:text-white transition">Event</Link></li>
            <li><Link href="/umkm" className="hover:text-white transition">UMKM</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Kontak</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Layanan */}
        <div>
          <h3 className="font-serif text-sm font-bold tracking-wider text-[#dcae59] uppercase">
            Layanan
          </h3>
          <ul className="mt-4 space-y-2.5 text-xs text-white/80 font-sans">
            <li><Link href="/heritage" className="hover:text-white transition">Wisata & Budaya</Link></li>
            <li><Link href="/umkm" className="hover:text-white transition">UMKM Lokal</Link></li>
            <li><Link href="/environment" className="hover:text-white transition">Lingkungan</Link></li>
            <li><Link href="/education" className="hover:text-white transition">Edukasi</Link></li>
            <li><Link href="/innovation" className="hover:text-white transition">Inovasi</Link></li>
          </ul>
        </div>

        {/* Kolom 4: Berlangganan Info Terbaru */}
        <div>
          <h3 className="font-serif text-sm font-bold tracking-wider text-[#dcae59] uppercase">
            Berlangganan info terbaru
          </h3>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex items-center rounded-2xl bg-white/10 p-1.5 border border-white/15 backdrop-blur-md">
            <input
              type="email"
              placeholder="Email Anda"
              className="w-full bg-transparent px-3 text-xs text-white placeholder-white/50 outline-none font-sans"
            />
            <button
              type="submit"
              className="flex h-9 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcae59] text-[#173d2b] transition hover:bg-[#cca04b]"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>

      {/* Bagian Bawah: Copyright & Lokasi */}
      <div className="mt-16 pt-8 border-t border-white/10 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-white/60 font-sans gap-4">
        <p>© 2026 MedanKarsa. All Rights Reserved.</p>
        <p className="flex items-center gap-1.5 text-white/80">
          <MapPin size={14} className="text-[#dcae59]" /> Medan, Sumatera Utara
        </p>
      </div>
    </footer>
  );
}