import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Compass, Ticket, Building2, History, Sparkles, Share2, Clock, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HeritagePanorama, { PanoramaScene } from "@/components/heritage/HeritagePanorama";
import HeritageImageCarousel from "@/components/heritage/HeritageImageCarousel";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HeritageDetailPage({ params }: Props) {
  const { slug } = await params;

  const heritage = await prisma.heritage.findUnique({
    where: { slug },
  });

  if (!heritage) {
    notFound();
  }

  const panoramaScenes = ((heritage as any).panoramaScenes as PanoramaScene[]) || [];
  
  const cover = heritage.coverImage ? [heritage.coverImage] : [];
  const dbImages = (heritage as any).images || [];
  const allImages = [...cover, ...dbImages].filter(Boolean);
  const mainImage = allImages[0] || "/images/placeholder.jpg";

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b]">
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        
        {/* Navigasi Kembali */}
        <Link href="/heritage" className="inline-flex items-center gap-2 text-sm font-semibold text-[#667068] hover:text-[#173d2b] mb-6">
          <ArrowLeft size={17} /> Kembali ke Heritage
        </Link>

        {/* HERO BANNER SECTION */}
        <div className="relative mb-10 overflow-hidden rounded-[32px] bg-[#173d2b] text-white shadow-md">
          {/* Background Image dengan overlay gelap */}
          <div className="absolute inset-0 z-0">
            <img 
              src={mainImage} 
              alt={heritage.name} 
              className="h-full w-full object-cover opacity-35 transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173d2b] via-[#173d2b]/60 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-12 flex flex-col justify-between min-h-[420px]">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#173d2b] border border-[#e2b45e]/40 px-3 py-1 text-xs font-bold text-[#f1c76e]">
                <Sparkles size={13} /> {heritage.category || "Sejarah"}
              </span>
            </div>

            <div className="mt-20">
              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                {heritage.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-200 line-clamp-2">
                {heritage.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/heritage/${heritage.slug}/tour`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#173d2b] border border-[#f1c76e]/50 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0f291d]"
                >
                  <Compass size={18} className="text-[#f1c76e]" /> Tur 360°
                </Link>

                <Link
                  href={`/heritage/${heritage.slug}/book`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#b8860b] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#996f08]"
                >
                  <Ticket size={18} /> Beli Tiket Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* PRATINJAU PANORAMA / CAROUSEL */}
        <section className="mb-12">
          {panoramaScenes.length > 0 ? (
            <div className="rounded-[30px] bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#173d2b]">
                  ✨ Pratinjau Tur Virtual {heritage.name}
                </h3>
                <span className="text-xs text-[#697067]">Geser foto atau klik hotspot untuk navigasi</span>
              </div>
              <HeritagePanorama scenes={panoramaScenes} defaultSceneId={panoramaScenes[0].id} />
            </div>
          ) : (
            <div className="rounded-[30px] bg-white p-6 sm:p-8 shadow-sm">
              <HeritageImageCarousel images={allImages} name={heritage.name} />
            </div>
          )}
        </section>

        {/* KONTEN UTAMA: ARTIKEL & SIDEBAR INFORMASI */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          
          {/* Kolom Kiri: Deskripsi & Sejarah */}
          <article className="space-y-8">
            <div className="rounded-[30px] bg-white p-6 sm:p-10 shadow-sm">
              <div className="flex items-center gap-2 text-[#b8860b] font-bold text-xs uppercase tracking-wider mb-2">
                <Building2 size={16} /> Mengenal Lebih Dekat
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173d2b]">Tentang Tempat Ini</h2>
              <p className="mt-4 text-sm sm:text-base leading-8 text-[#697067]">{heritage.description}</p>
            </div>

            {heritage.history && (
              <div className="rounded-[30px] bg-white p-6 sm:p-10 shadow-sm">
                <div className="flex items-center gap-2 text-[#b8860b] font-bold text-xs uppercase tracking-wider mb-2">
                  <History size={16} /> Latar Belakang Waktu
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173d2b]">Sejarah</h2>
                <p className="mt-4 text-sm sm:text-base leading-8 text-[#697067]">{heritage.history}</p>
              </div>
            )}
          </article>

          {/* Kolom Kanan: Informasi Praktis & Widget Tiket */}
          <aside className="space-y-6">
            
            {/* Card Informasi Praktis */}
            <div className="rounded-[30px] bg-white p-6 shadow-sm border border-gray-100 space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#173d2b]">Informasi Praktis</h3>
              
              <div className="space-y-4 pt-2 border-t border-gray-100 text-sm">
                {heritage.address && (
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-xl bg-[#f8f3e8] text-[#173d2b] shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Lokasi</p>
                      <p className="mt-0.5 font-semibold text-[#173d2b]">{heritage.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-xl bg-[#f8f3e8] text-[#173d2b] shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Jam Operasional</p>
                    <p className="mt-0.5 font-semibold text-[#173d2b]">Setiap Hari (08.00 - 17.00 WIB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Ringkasan Tiket Masuk di Sidebar */}
            <div className="rounded-[30px] bg-[#173d2b] text-white p-6 shadow-lg relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Ticket size={140} />
              </div>
              <div className="relative z-10">
                <span className="bg-[#b8860b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Tiket Resmi
                </span>
                <p className="mt-3 text-2xl font-serif font-bold">Rp 15.000 <span className="text-xs font-sans font-normal text-gray-300">/ orang</span></p>
                <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                  Akses masuk cagar budaya berlaku untuk 1 hari kunjungan dengan sistem verifikasi QR Code instan.
                </p>
                
                <Link
                  href={`/heritage/${heritage.slug}/book`}
                  className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-[#b8860b] py-3.5 text-xs font-bold text-white transition hover:bg-[#996f08] shadow-md"
                >
                  <Ticket size={16} /> Pesan Tiket Sekarang
                </Link>
                
                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-300">
                  <span>✨ Aman</span>
                  <span>⚡ Cepat</span>
                  <span>🛡️ Resmi</span>
                </div>
              </div>
            </div>

          </aside>
        </div>

      </div>
    </main>
  );
}