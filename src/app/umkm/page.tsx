import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Store, Plus, MapPin, Tag, ExternalLink } from "lucide-react";
import UmkmMapWrapper from "@/components/umkm/UmkmMapWrapper";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function UmkmPage() {
  const umkms = await prisma.umkm.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#ffff]">
      <main className="flex-grow">
        {/* Hero Section dengan Background Foto & Skema Warna Cokelat Elegan */}
        <section className="relative bg-[#4a2e24] py-24 px-5 lg:px-8 overflow-hidden shadow-sm">
          {/* Kolase Foto Latar Belakang */}
          <div className="absolute inset-0 z-0 grid grid-cols-3 gap-2 opacity-110 filter blur-[1px] scale-105 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" alt="Kuliner" className="w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8" alt="Kopi" className="w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176" alt="Makanan" className="w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" alt="Pizza" className="w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" alt="Restoran" className="w-full h-full object-cover" />
            <img src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9" alt="Cafe" className="w-full h-full object-cover" />
          </div>

          {/* Gradasi Overlay Cokelat Gelap */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a2e24] via-[#4a2e24]/90 to-[#4a2e24]/70 z-0"></div>

          <div className="relative z-10 mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <MapPin size={14} />
                Peta & Direktori Lokal
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight">
                UMKM <span className="text-[#d4a373]">Medan Karsa</span>
              </h1>
              <p className="text-[#e0c8b0] text-lg mt-4 max-w-xl leading-relaxed">
                Jelajahi produk unggulan, kuliner khas, dan kerajinan lokal dari pelaku usaha terbaik di Kota Medan langsung dari peta interaktif.
              </p>
              
              {/* Tombol Ajukan (Desktop) */}
              <div className="mt-8 hidden md:flex gap-4">
                <Link
                  href="/umkm/ajukan"
                  className="flex items-center gap-2 rounded-2xl bg-[#d4a373] px-8 py-4 font-bold text-[#4a2e24] transition-all hover:bg-[#c68f5c] hover:scale-105 shadow-xl"
                >
                  <Plus size={20} className="stroke-[3]" />
                  Ajukan UMKM Saya
                </Link>
              </div>
            </div>

            {/* Tombol Ajukan (Mobile) */}
            <div className="md:hidden w-full">
              <Link
                href="/umkm/ajukan"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#d4a373] px-6 py-4 font-bold text-[#4a2e24] shadow-lg"
              >
                <Plus size={20} className="stroke-[3]" />
                Ajukan UMKM Saya
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 my-12 lg:px-8 space-y-12">
          
          {/* SECTION 1: PETA MULTI-MARKER INTERAKTIF */}
          <section className="bg-white p-6 rounded-3xl border border-[#e8dfcf] shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#173d2b]">Peta Persebaran UMKM</h2>
                <p className="text-xs text-[#697067] mt-0.5">Semua titik usaha yang disetujui akan otomatis muncul di peta</p>
              </div>
              <span className="bg-[#f2eadb] text-[#173d2b] text-xs font-bold px-3 py-1.5 rounded-full">
                {umkms.length} Lokasi Aktif
              </span>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden border border-[#e8dfcf]">
              {umkms.length === 0 ? (
                <div className="h-[420px] bg-[#eee8dc] flex flex-col items-center justify-center text-center p-6">
                  <MapPin size={40} className="mx-auto text-[#a27731] mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-[#173d2b]">Belum ada titik peta UMKM.</p>
                  <p className="text-xs text-[#697067] mt-1">Titik lokasi akan muncul otomatis di sini setelah disetujui admin.</p>
                </div>
              ) : (
                <UmkmMapWrapper umkms={umkms} />
              )}
            </div>
          </section>

          {/* SECTION 2: REKOMENDASI TEMPAT UMKM */}
          <section className="pb-8 text-left">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#173d2b]">Rekomendasi Tempat UMKM</h2>
              <p className="text-xs text-[#697067] mt-0.5">Pilihan tempat usaha lokal terbaik yang wajib dikunjungi</p>
            </div>

            {umkms.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d8cfbe] bg-white py-16 text-center">
                <Store size={48} className="mx-auto text-[#a27731] mb-3 opacity-50" />
                <p className="text-[#697067] font-medium">Belum ada rekomendasi UMKM saat ini.</p>
                <p className="text-xs text-[#8b9189] mt-1">Jadilah yang pertama mendaftarkan usaha Anda melalui tombol di atas!</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {umkms.map((umkm) => (
                  <div key={umkm.id} className="rounded-3xl bg-white border border-[#e8dfcf] overflow-hidden shadow-sm flex flex-col justify-between transition hover:shadow-md">
                    <div>
                      {umkm.image ? (
                        <img src={umkm.image} alt={umkm.name} className="h-48 w-full object-cover" />
                      ) : (
                        <div className="h-48 w-full bg-[#f2eadb] flex items-center justify-center text-[#a27731]">
                          <Store size={40} />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-serif text-xl font-bold text-[#173d2b]">{umkm.name}</h3>
                          <span className="bg-[#f2eadb] text-[#a27731] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Tag size={12} /> {umkm.category}
                          </span>
                        </div>
                        <p className="text-sm text-[#697067] line-clamp-3 mb-4">{umkm.description}</p>
                        <div className="flex items-start gap-2 text-xs text-[#8b9189]">
                          <MapPin size={15} className="text-[#a27731] shrink-0 mt-0.5" />
                          <span>{umkm.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(umkm.address + ", Medan")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full text-center rounded-xl bg-[#f8f3e8] border border-[#e8dfcf] py-2.5 text-xs font-bold text-[#173d2b] transition hover:bg-[#173d2b] hover:text-white"
                      >
                        Buka di Google Maps <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}