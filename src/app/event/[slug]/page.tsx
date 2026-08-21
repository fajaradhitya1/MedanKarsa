import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, MapPin, Tag, Share2, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.startAt);
  const formattedDate = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedPrice = event.price && event.price > 0 
    ? `Rp ${event.price.toLocaleString("id-ID")}` 
    : "Gratis";

  return (
    <div className="min-h-screen bg-[#ffff] text-[#173d2b] pb-24">
      
      {/* 1. HEADER HERO BANNER: Background Gambar Event Asli yang Dibuat Blur */}
      <div className="relative bg-[#0d2218] text-white pt-10 pb-16 px-6 sm:px-12 lg:px-16 border-b border-[#0f291d] overflow-hidden">
        
        {/* Latar Belakang Gambar Event Asli dengan Efek Blur & Opacity Lembut */}
        {event.coverImage ? (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover filter blur-xl opacity-30 scale-110"
            />
            {/* Overlay gelap tipis agar teks tetap terbaca kontras namun gambar tetap terlihat */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-[#173d2b]" />
        )}

        {/* Konten Hero Banner */}
        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Tombol Kembali */}
          <Link href="/event" className="inline-flex items-center gap-2 text-xs font-bold text-[#dcae59] hover:underline mb-8">
            <ArrowLeft size={16} /> Kembali ke Daftar Event
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-center">
            {/* Sisi Kiri: Judul & Detail Singkat */}
            <div>
              <span className="inline-block rounded-full bg-[#dcae59]/20 px-3 py-1 text-xs font-bold text-[#dcae59] mb-4 border border-[#dcae59]/30 backdrop-blur-md">
                Event Pilihan MedanKarsa
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                {event.title}
              </h1>

              <div className="mt-6 space-y-3 text-xs sm:text-sm text-white/90 font-sans">
                <div className="flex items-center gap-2.5">
                  <MapPin size={18} className="text-[#dcae59] shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={18} className="text-[#dcae59] shrink-0" />
                  <span>{formattedDate} WIB</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Tag size={18} className="text-[#dcae59] shrink-0" />
                  <span>Konser • Hiburan • Budaya</span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Poster Banner Asli Sesuai Event */}
            <div className="relative aspect-video sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-[#173d2b]">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-serif text-xl text-[#dcae59]">
                  MedanKarsa
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. MENU TAB NAVIGASI (Deskripsi, Tiket, S&K) */}
      <div className="bg-white border-b border-[#e2d8c5] shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex gap-8 text-sm font-bold">
          <button className="py-4 text-[#173d2b] border-b-2 border-[#173d2b]">Deskripsi</button>
          <button className="py-4 text-[#777d75] hover:text-[#173d2b] transition">Tiket</button>
          <button className="py-4 text-[#777d75] hover:text-[#173d2b] transition">Syarat dan Ketentuan</button>
        </div>
      </div>

      {/* 3. KONTEN UTAMA DENGAN SIDEBAR KANAN */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-12 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 items-start">
        
        {/* Sisi Kiri: Detail Informasi & Deskripsi Event */}
        <div className="bg-white rounded-[28px] border border-[#e2d8c5] p-8 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#173d2b] mb-4">
            Tentang Acara Ini
          </h3>
          <div className="prose prose-sm max-w-none text-[#697067] leading-relaxed whitespace-pre-line font-sans">
            {event.description || "Tidak ada deskripsi lengkap yang disediakan untuk event ini."}
          </div>
        </div>

        {/* Sisi Kanan: Card Harga & Aksi Beli Tiket (Sticky Sidebar) */}
        <div className="sticky top-24 bg-white rounded-[28px] border border-[#e2d8c5] p-6 shadow-md flex flex-col gap-6">
          
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#a27731] uppercase">Harga Mulai Dari</span>
            <div className="font-serif text-2xl font-bold text-[#173d2b] mt-1">
              {formattedPrice}
            </div>
          </div>

          {/* Tombol Aksi Beli Tiket */}
          <Link 
  href={`/event/${slug}/checkout`}
  className="w-full rounded-xl bg-[#173d2b] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#21633f] text-center block"
>
  Lihat Tiket
</Link>

          {/* Ringkasan Singkat Event di Card */}
          <div className="border-t border-[#f2eadb] pt-4 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#173d2b]">
              {event.title}
            </h4>
            <div className="space-y-2 text-xs text-[#697067]">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-[#a27731] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-[#a27731] shrink-0" />
                <span>{formattedDate} WIB</span>
              </div>
            </div>
          </div>

          {/* Bagian Bagikan Event */}
          <div className="border-t border-[#f2eadb] pt-4">
            <span className="text-xs font-bold text-[#173d2b] block mb-3">Bagikan Event</span>
            <div className="flex items-center gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f0e6] text-[#173d2b] hover:bg-[#dcae59] transition"><Share2 size={16} /></button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f0e6] text-[#173d2b] hover:bg-[#dcae59] transition"><Bookmark size={16} /></button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}