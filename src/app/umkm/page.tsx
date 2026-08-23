import { prisma } from "@/lib/prisma";
import Footer from "@/components/layout/Footer";
import { Utensils, Store, MapPin, ExternalLink, Star } from "lucide-react";
import UmkmMapSection from "@/components/UmkmMapSection";

export const dynamicOpt = "force-dynamic";

const legendaryCulinaryList = [
  {
    id: "kul-1",
    name: "Bika Ambon Zulaikha",
    category: "Kuliner Legendaris",
    description: "Pusat oleh-oleh bika ambon paling ikonik dan legendaris di Kota Medan.",
    address: "Jl. Mojopahit No.62 A, Petisah Hulu, Kec. Medan Baru",
    rating: 4.9,
    image: "/assets/kuliner/bikaambon.jpg",
    lat: 3.5815,
    lng: 98.6620,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bika+Ambon+Zulaikha+Jl+Mojopahit+Medan",
  },
  {
    id: "kul-2",
    name: "Soto Kesawan",
    category: "Kuliner Legendaris",
    description: "Soto udang dan daging legendaris yang berdiri sejak puluhan tahun lalu di kawasan Kesawan.",
    address: "Jl. Jend. Ahmad Yani (Kawasan Kesawan)",
    rating: 4.8,
    image: "/assets/kuliner/soto.jpeg",
    lat: 3.5902,
    lng: 98.6780,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Soto+Kesawan+Medan",
  },
  {
    id: "kul-3",
    name: "Merdeka Walk Culinary",
    category: "Pusat Kuliner",
    description: "Pusat jajanan dan kuliner outdoor di jantung Kota Medan dengan nuansa kolonial.",
    address: "Jl. Balai Kota (Pusat Kota Medan)",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop",
    lat: 3.5925,
    lng: 98.6750,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Merdeka+Walk+Medan",
  },
  {
    id: "kul-4",
    name: "Bihun Bebek Asie",
    category: "Kuliner Legendaris",
    description: "Bihun bebek khas Medan dengan kuah kaldu herbal yang sangat gurih dan terkenal.",
    address: "Jl. Kumango No.15, Kesawan",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    lat: 3.5935,
    lng: 98.6765,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bihun+Bebek+Asie+Jl+Kumango+Medan",
  },
];

export default async function UmkmPage() {
  let userUmkmList: any[] = [];
  try {
    userUmkmList = await prisma.umkm.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.warn("Gagal memuat data UMKM dari database.");
  }

  const mapMarkers = [
    ...legendaryCulinaryList.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      address: item.address,
      lat: item.lat,
      lng: item.lng,
      image: item.image,
    })),
    ...userUmkmList.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category || "UMKM Lokal",
      address: item.address,
      lat: item.latitude || 3.5952,
      lng: item.longitude || 98.6722,
      image: item.image || "/images/placeholder.jpg",
    }))
  ];

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] flex flex-col justify-between">
      <div className="space-y-12 pb-24">
        
        {/* PETA INTERAKTIF */}
        <div className="w-full bg-white border-b border-[#e8dfcf]">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="mb-4 text-left">
              <span className="text-xs font-bold tracking-[0.2em] text-[#b8860b] uppercase">Peta Persebaran</span>
              <h2 className="font-serif text-2xl font-bold text-[#173d2b]">Jelajahi Lokasi Kuliner & UMKM di Medan</h2>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-[#e8dfcf] shadow-sm">
              <UmkmMapSection umkms={mapMarkers} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
          
          {/* ================= SECTION 1: KULINER & OLEH-OLEH TERKENAL ================= */}
          <section className="space-y-6 text-left">
            <div className="border-b border-[#e2d8c5]/60 pb-4">
              <span className="text-xs font-bold tracking-[0.25em] text-[#b8860b] uppercase flex items-center gap-1.5">
                <Utensils size={15} /> Destinasi Terkenal & Legendaris
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#173d2b] mt-1">
                Kuliner & Oleh-Oleh Wajib Coba di Medan
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Daftar tempat kuliner ikonis yang sudah terkenal di publik lengkap dengan petunjuk arah Google Maps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {legendaryCulinaryList.map((item) => (
                <div key={item.id} className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-3 left-3 bg-[#173d2b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#173d2b] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={12} className="fill-[#b8860b] text-[#b8860b]" /> {item.rating}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-serif text-lg font-bold text-[#173d2b]">{item.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                      <div className="flex items-start gap-1.5 text-xs text-gray-600 pt-1">
                        <MapPin size={14} className="text-[#b8860b] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a
                      href={item.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#f8f3e8] border border-[#dcae59]/40 py-2.5 text-xs font-bold text-[#173d2b] transition hover:bg-[#173d2b] hover:text-white"
                    >
                      <MapPin size={14} className="text-[#b8860b]" /> Buka di Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= SECTION 2: REKOMENDASI TEMPAT UMKM (SUBMISSION LOKAL) ================= */}
          <section className="space-y-6 text-left pt-6 border-t border-[#e2d8c5]/60">
            <div className="border-b border-[#e2d8c5]/60 pb-4">
              <span className="text-xs font-bold tracking-[0.25em] text-[#b8860b] uppercase flex items-center gap-1.5">
                <Store size={15} /> Direktori Komunitas
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#173d2b] mt-1">
                Rekomendasi Tempat UMKM Lokal
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Pilihan tempat usaha lokal terbaik yang diajukan oleh masyarakat dan komunitas.
              </p>
            </div>

            {userUmkmList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userUmkmList.map((umkm) => (
                  <div key={umkm.id} className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#f8f3e8] flex items-center justify-center text-[#173d2b] border border-[#e2d8c5]">
                        <Store size={24} className="text-[#b8860b]" />
                      </div>
                      <div>
                        <span className="bg-[#b8860b]/15 text-[#b8860b] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {umkm.category || "UMKM"}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#173d2b] mt-1">{umkm.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{umkm.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-2 border-t border-gray-50">
                        <MapPin size={14} className="text-[#b8860b]" />
                        <span>{umkm.address}</span>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(umkm.name + " " + umkm.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#173d2b] py-2.5 text-xs font-bold text-white transition hover:bg-[#0f291d]"
                    >
                      Buka di Google Maps <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[28px] p-12 text-center border border-gray-100 space-y-3">
                <p className="text-sm text-gray-400">Belum ada data UMKM komunitas yang diajukan.</p>
              </div>
            )}
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}