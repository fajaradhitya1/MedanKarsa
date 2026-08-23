import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Compass, Ticket, Building2, History, Sparkles, Clock, Share2, Camera, Users, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HeritagePanorama, { PanoramaScene } from "@/components/heritage/HeritagePanorama";
import HeritageImageCarousel from "@/components/heritage/HeritageImageCarousel";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HeritageDetailPage({ params }: Props) {
  const { slug } = await params;

  // Data statis pendukung untuk destinasi yang baru ditambahkan (London Sumatra & Masjid Raya)
  // jika belum tersimpan secara permanen di database tabel Prisma.
  const staticHeritageData: Record<string, any> = {
    "gedung-london-sumatra": {
      id: "4",
      name: "Gedung London Sumatra (Lonsum)",
      slug: "gedung-london-sumatra",
      description: "Gedung bergaya kolonial Inggris abad ke-19 yang terkenal dengan lift kuno pertama di Medan.",
      history: "Gedung Kantor PT London Sumatra Indonesia Tbk ini dibangun pada tahun 1906 dan menjadi pusat perdagangan penting di era kolonial.",
      coverImage: "/assets/heritage/londonsumatra_cover.jpeg",
      address: "Jl. Jend. Ahmad Yani No.2, Kesawan, Medan",
      images: ["/assets/heritage/londonsumatra_cover.jpeg", "/assets/heritage/londonsumatra_cover.jpeg"],
      category: "ARSITEKTUR",
    },
    "masjid-raya-al-mashun": {
      id: "5",
      name: "Masjid Raya Al-Mashun",
      slug: "masjid-raya-al-mashun",
      description: "Masjid Raya Medan yang megah dengan arsitektur perpaduan gaya Maroko, Eropa, dan Melayu.",
      history: "Dibangun pada tahun 1906 oleh Sultan Ma'mun Al Rashid Perkasa Alam, masjid ini menjadi lambang keagungan Kesultanan Deli.",
      coverImage: "/assets/masjidraya/masjid.jpeg",
      address: "Jl. Sisingamangaraja No.74c, Mesjid, Medan",
      images: ["/assets/masjidraya/masjid.jpeg", "/assets/masjidraya/masjid.jpeg"],
      category: "ARSITEKTUR",
    },
  };

  // Cari di database Prisma terlebih dahulu, jika tidak ada cek data statis lokal
  let heritage = await prisma.heritage.findUnique({
    where: { slug },
  });

  if (!heritage && staticHeritageData[slug]) {
    heritage = staticHeritageData[slug];
  }

  if (!heritage) {
    notFound();
  }

  const panoramaScenes = ((heritage as any).panoramaScenes as PanoramaScene[]) || [];
  
  const cover = heritage.coverImage ? [heritage.coverImage] : [];
  const dbImages = (heritage as any).images || [];
  const allImages = [...cover, ...dbImages].filter(Boolean);
  const mainImage = allImages[0] || "/images/placeholder.jpg";

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] pb-20">
      
      {/* 1. HERO BANNER FULL LEBAR (Kiri ke Kanan) */}
      <div className="relative w-full bg-[#173d2b] text-white overflow-hidden shadow-md">
        <div className="absolute inset-0 z-0">
          <img 
            src={mainImage} 
            alt={heritage.name} 
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#173d2b] via-[#173d2b]/60 to-transparent" />
        </div>

        {/* Konten di dalam Hero Banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10">
          {/* Navigasi Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 mb-8">
            <Link href="/" className="hover:text-white">🏠 Beranda</Link>
            <span>/</span>
            <Link href="/heritage" className="hover:text-white">Heritage</Link>
            <span>/</span>
            <span className="text-[#f1c76e]">{heritage.name}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#173d2b] border border-[#e2b45e]/60 px-4 py-1.5 text-xs font-bold text-[#f1c76e] shadow-sm">
              <Sparkles size={13} /> {heritage.category || "SEJARAH"}
            </span>
          </div>

          <div className="max-w-3xl space-y-4 pt-4 pb-6">
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-md">
              {heritage.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 line-clamp-2 leading-relaxed">
              {heritage.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href={`/heritage/${heritage.slug}/tour`}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#173d2b] border border-[#f1c76e]/60 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0f291d]"
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

      {/* 2. KONTEN UTAMA & SECTION BAWAH DENGAN CONTAINER LEBAR YANG RAPI */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 mt-10">
        
        {/* PRATINJAU PANORAMA / CAROUSEL (PENUH KIRI KANAN) */}
        <section className="mb-12">
          {panoramaScenes.length > 0 ? (
            <div className="rounded-[32px] bg-white p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173d2b]">
                  ✨ Pratinjau Tur Virtual {heritage.name}
                </h3>
                <span className="text-xs text-[#697067]">Geser foto atau klik hotspot untuk navigasi</span>
              </div>
              <HeritagePanorama scenes={panoramaScenes} defaultSceneId={panoramaScenes[0].id} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-[32px] bg-white shadow-sm border border-gray-100">
              <div className="p-6 sm:px-10 sm:pt-8 pb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173d2b]">
                  📸 Galeri Foto {heritage.name}
                </h3>
                <span className="text-xs text-[#697067]">Geser untuk melihat lainnya</span>
              </div>
              {/* Carousel memenuhi lebar tanpa padding putih di pinggir gambar */}
              <div className="w-full">
                <HeritageImageCarousel images={allImages} name={heritage.name} />
              </div>
            </div>
          )}
        </section>
        
        {/* GRID KONTEN & SIDEBAR */}
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          
          {/* Kolom Kiri */}
          <article className="space-y-8">
            
            {/* Tentang Tempat Ini */}
            <div className="rounded-[32px] bg-white p-8 sm:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#b8860b] font-bold text-xs uppercase tracking-wider mb-2">
                <Building2 size={16} /> Mengenal Lebih Dekat
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173d2b]">Tentang Tempat Ini</h2>
              <p className="mt-4 text-sm sm:text-base leading-8 text-[#697067]">{heritage.description}</p>
            </div>

            {/* Sejarah */}
            {heritage.history && (
              <div className="rounded-[32px] bg-white p-8 sm:p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-[#b8860b] font-bold text-xs uppercase tracking-wider mb-2">
                  <History size={16} /> Latar Belakang Waktu
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173d2b]">Sejarah</h2>
                <p className="mt-4 text-sm sm:text-base leading-8 text-[#697067]">{heritage.history}</p>
                
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3e8] border border-[#173d2b]/10 px-4 py-2 text-xs font-semibold text-[#173d2b]">
                    <CheckCircle2 size={14} className="text-[#b8860b]" /> Warisan Budaya
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3e8] border border-[#173d2b]/10 px-4 py-2 text-xs font-semibold text-[#173d2b]">
                    <CheckCircle2 size={14} className="text-[#b8860b]" /> Nilai Sejarah Tinggi
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3e8] border border-[#173d2b]/10 px-4 py-2 text-xs font-semibold text-[#173d2b]">
                    <CheckCircle2 size={14} className="text-[#b8860b]" /> Ikon Kota Medan
                  </span>
                </div>
              </div>
            )}

            {/* Fasilitas & Sorotan */}
            <div className="rounded-[32px] bg-white p-8 sm:p-10 shadow-sm border border-gray-100">
              <h3 className="font-serif text-2xl font-bold text-[#173d2b] mb-6">Fasilitas & Sorotan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#f8f3e8]/60 border border-gray-100 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#173d2b] shadow-sm">
                    <Building2 size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Arsitektur Terawat</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Struktur bangunan asli era kolonial dan kesultanan yang megah.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8f3e8]/60 border border-gray-100 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#173d2b] shadow-sm">
                    <History size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Edukasi Sejarah</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Pusat informasi peradaban dan sejarah perkembangan Kota Medan.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8f3e8]/60 border border-gray-100 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#173d2b] shadow-sm">
                    <Camera size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Spot Foto Estetik</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Sudut pandang klasik yang sangat menarik untuk fotografi.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8f3e8]/60 border border-gray-100 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#173d2b] shadow-sm">
                    <Users size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Wisata Keluarga</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Destinasi edukatif yang sangat nyaman dikunjungi semua kalangan.</p>
                </div>
              </div>
            </div>

          </article>

          {/* Kolom Kanan (Sidebar) */}
          <aside className="space-y-6">
            
            {/* Informasi Praktis */}
            <div className="rounded-[32px] bg-white p-8 shadow-sm border border-gray-100 space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#173d2b]">Informasi Praktis</h3>
              
              <div className="space-y-4 pt-2 border-t border-gray-100 text-sm">
                {heritage.address && (
                  <div className="flex gap-3 items-start">
                    <div className="p-2.5 rounded-xl bg-[#f8f3e8] text-[#173d2b] shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Lokasi</p>
                      <p className="mt-0.5 font-semibold text-[#173d2b] leading-snug">{heritage.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-[#f8f3e8] text-[#173d2b] shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Jam Operasional</p>
                    <p className="mt-0.5 font-semibold text-[#173d2b]">Setiap Hari<br />08.00 – 17.00 WIB</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-[#f8f3e8] text-[#173d2b] shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Kategori</p>
                    <p className="mt-0.5 font-semibold text-[#173d2b]">{heritage.category || "Heritage • Sejarah"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget Tiket Masuk */}
            <div className="rounded-[32px] bg-[#173d2b] text-white p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                <Ticket size={140} />
              </div>
              <div className="relative z-10">
                <span className="bg-[#b8860b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Tiket Masuk Resmi
                </span>
                <p className="mt-3 text-2xl font-serif font-bold">Rp 15.000 <span className="text-xs font-sans font-normal text-gray-300">/ orang</span></p>
                <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                  Tiket berlaku untuk 1 hari kunjungan dengan sistem verifikasi QR Code instan.
                </p>
                
                <Link
                  href={`/heritage/${heritage.slug}/book`}
                  className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-[#b8860b] py-3.5 text-xs font-bold text-white transition hover:bg-[#996f08] shadow-md"
                >
                  <Ticket size={16} /> Pesan Tiket Sekarang
                </Link>
                
                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-300 border-t border-white/10 pt-3">
                  <span>✨ Aman</span>
                  <span>⚡ Cepat</span>
                  <span>🛡️ Resmi</span>
                </div>
              </div>
            </div>

            {/* Bagikan Halaman Ini */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm border border-gray-100 text-center space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bagikan Halaman Ini</p>
              <div className="flex justify-center gap-3">
                <div className="p-3 rounded-full bg-[#f8f3e8] text-[#173d2b]">
                  <Share2 size={16} />
                </div>
              </div>
            </div>

          </aside>
        </div>

      </div>
    </main>
  );
}