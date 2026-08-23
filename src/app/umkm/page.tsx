import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Store, Plus, MapPin, Tag, ExternalLink, Utensils, Star } from "lucide-react";
import UmkmMapWrapper from "@/components/umkm/UmkmMapWrapper";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

// Data Kuliner & Oleh-Oleh Legendaris Terkenal di Medan
const legendaryCulinaryList = [
  {
    id: "kul-1",
    name: "Bika Ambon Zulaikha",
    category: "Oleh-Oleh Legendaris",
    description: "Pusat oleh-oleh bika ambon paling tersohor di Medan dengan tekstur bersarang yang kenyal dan harum.",
    address: "Jl. Mojopahit No.62 A, Petisah Hulu, Kec. Medan Baru",
    rating: "4.9",
    image: "/assets/kuliner/bikaambon.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bika+Ambon+Zulaikha+Jl+Mojopahit+Medan",
  },
  {
    id: "kul-2",
    name: "Soto Kesawan",
    category: "Kuliner Legendaris",
    description: "Soto udang galah dan daging sapi dengan kuah santan gurih legendaris sejak era kolonial di Kesawan.",
    address: "Jl. Jend. Ahmad Yani (Kawasan Kesawan)",
    rating: "4.8",
    image: "/assets/kuliner/soto.jpeg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Soto+Kesawan+Medan",
  },
  {
    id: "kul-3",
    name: "Merdeka Walk Culinary",
    category: "Pusat Kuliner",
    description: "Kawasan kuliner outdoor legendaris di pusat kota Medan dengan bangunan bersejarah di sekelilingnya.",
    address: "Jl. Balai Kota (Pusat Kota Medan)",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Merdeka+Walk+Medan",
  },
  {
    id: "kul-4",
    name: "Bihun Bebek Asie",
    category: "Kuliner Legendaris",
    description: "Bihun bebek dengan limpahan daging bebek empuk dan kuah kaldu herbal yang kental dan harum.",
    address: "Jl. Kumango No.15, Kesawan",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bihun+Bebek+Asie+Jl+Kumango+Medan",
  },
  {
    id: "kul-5",
    name: "Soto Sinar Pagi",
    category: "Kuliner Legendaris",
    description: "Salah satu soto medan paling legendaris dengan rempah kaya rasa, perkedel gurih, dan taburan bawang goreng.",
    address: "Jl. Sei Deli No.2D, Silalas, Medan",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Soto+Sinar+Pagi+Medan",
  },
  {
    id: "kul-6",
    name: "Ucok Durian Medan",
    category: "Kuliner Ikonik",
    description: "Sentra durian paling populer di Kota Medan dengan garansi rasa manis legit beralkohol khas durian lokal.",
    address: "Jl. K.H. Wahid Hasyim No.30-32, Babura",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ucok+Durian+Medan",
  },
  {
    id: "kul-7",
    name: "Mie Gomak Bu Darmi",
    category: "Kuliner Tradisional",
    description: "Spageti khas tanah Batak dengan kuah santan andaliman yang pedas menggigit dan kaya aroma rempah.",
    address: "Pasar Tradisional Pusat Kota Medan",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mie+Gomak+Medan",
  },
  {
    id: "kul-8",
    name: "Rumah Makan Tabona",
    category: "Kuliner Legendaris",
    description: "Kari bihun dan kari daging sapi/ayam legendaris yang kaya rempah dan sudah menjadi favorit warga sejak lama.",
    address: "Jl. Mangkubumi No.17, Aur, Medan",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rumah+Makan+Tabona+Medan",
  }
];

export default async function UmkmPage() {
  const umkms = await prisma.umkm.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#ffff]">
      <main className="flex-grow">
        
        {/* HERO SECTION */}
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
                UMKM & Kuliner <span className="text-[#d4a373]">Medan</span>
              </h1>
              <p className="text-[#e0c8b0] text-lg mt-4 max-w-xl leading-relaxed font-sans">
                Jelajahi surga kuliner legendaris yang sudah tersohor serta dukung produk dan usaha lokal komunitas di Kota Medan.
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

        <div className="mx-auto max-w-7xl px-5 my-12 lg:px-8 space-y-16">
          
          {/* SECTION 1: PETA MULTI-MARKER INTERAKTIF */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8dfcf] shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#173d2b]">Peta Persebaran Usaha</h2>
                <p className="text-xs text-[#697067] mt-0.5">Semua titik usaha yang disetujui akan otomatis muncul di peta interaktif</p>
              </div>
              <span className="bg-[#f2eadb] text-[#173d2b] text-xs font-bold px-3 py-1.5 rounded-full">
                {umkms.length} Titik Lokasi
              </span>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden border border-[#e8dfcf]">
              {umkms.length === 0 ? (
                <div className="h-[420px] bg-[#eee8dc] flex flex-col items-center justify-center text-center p-6">
                  <MapPin size={40} className="mx-auto text-[#a27731] mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-[#173d2b]">Belum ada titik peta UMKM.</p>
                  <p className="text-xs text-[#697067] mt-1">Titik lokasi usaha Anda akan muncul otomatis di sini setelah disetujui admin.</p>
                </div>
              ) : (
                <UmkmMapWrapper umkms={umkms} />
              )}
            </div>
          </section>

          {/* SECTION 2: REKOMENDASI KULINER & OLEH-OLEH LEGENDARIS (TEMPAT TERKENAL) */}
          <section className="text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e2d8c5]/70 pb-4 gap-2">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#b8860b] uppercase flex items-center gap-1.5">
                  <Utensils size={15} /> Tempat Ikonik Terkenal
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#173d2b] mt-1">
                  Kuliner & Oleh-Oleh Legendaris Medan
                </h2>
                <p className="text-xs sm:text-sm text-[#697067] mt-1">
                  Destinasi kuliner wajib yang sudah sangat terkenal bagi wisatawan maupun warga lokal dengan petunjuk rute Google Maps.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {legendaryCulinaryList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white border border-[#e8dfcf] overflow-hidden shadow-xs flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-lg group"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-[#f2eadb]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-[#173d2b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#173d2b] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Star size={12} className="fill-[#b8860b] text-[#b8860b]" /> {item.rating}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-serif text-lg font-bold text-[#173d2b]">{item.name}</h3>
                      <p className="text-xs text-[#697067] line-clamp-2 leading-relaxed">{item.description}</p>
                      <div className="flex items-start gap-1.5 text-xs text-gray-500 pt-1">
                        <MapPin size={14} className="text-[#a27731] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a
                      href={item.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full text-center rounded-xl bg-[#f8f3e8] border border-[#dcae59]/40 py-2.5 text-xs font-bold text-[#173d2b] transition hover:bg-[#173d2b] hover:text-white"
                    >
                      <MapPin size={14} className="text-[#b8860b]" /> Buka di Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: REKOMENDASI TEMPAT UMKM (KOMUNITAS & SUBMISSION USER) */}
          <section className="text-left space-y-6 pt-4 border-t border-[#e2d8c5]/70">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e2d8c5]/70 pb-4 gap-2">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#a27731] uppercase flex items-center gap-1.5">
                  <Store size={15} /> Direktori Usaha Lokal
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#173d2b] mt-1">
                  Rekomendasi Tempat UMKM Komunitas
                </h2>
                <p className="text-xs sm:text-sm text-[#697067] mt-1">
                  Pilihan produk dan tempat usaha lokal binaan yang didaftarkan langsung oleh masyarakat Medan.
                </p>
              </div>

              <Link
                href="/umkm/ajukan"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173d2b] bg-[#f2eadb] px-4 py-2 rounded-xl transition hover:bg-[#e4d7be] shrink-0"
              >
                <Plus size={14} /> Daftarkan Usaha Anda
              </Link>
            </div>

            {umkms.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d8cfbe] bg-white py-16 text-center">
                <Store size={48} className="mx-auto text-[#a27731] mb-3 opacity-50" />
                <p className="text-[#697067] font-medium">Belum ada UMKM komunitas yang terdaftar saat ini.</p>
                <p className="text-xs text-[#8b9189] mt-1">Jadilah yang pertama mendaftarkan usaha Anda melalui tombol di atas!</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {umkms.map((umkm) => (
                  <div
                    key={umkm.id}
                    className="rounded-3xl bg-white border border-[#e8dfcf] overflow-hidden shadow-xs flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-lg"
                  >
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
                        className="flex items-center justify-center gap-2 w-full text-center rounded-xl bg-[#173d2b] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f291d]"
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