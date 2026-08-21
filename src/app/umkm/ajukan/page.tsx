"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, FileText, Tag, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("@/components/umkm/LocationPickerMap"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#eee8dc] rounded-2xl animate-pulse flex items-center justify-center text-xs text-[#697067]">Memuat Peta Pemilihan Lokasi...</div>,
});

export default function AjukanUmkmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Default titik pusat Kota Medan
  const [coords, setCoords] = useState({ lat: 3.5952, lng: 98.6722 });

  const [formData, setFormData] = useState({
    name: "",
    category: "Kuliner",
    description: "",
    address: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/umkm/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: coords.lat,   // Mengirim koordinat hasil geseran user
          longitude: coords.lng, // Mengirim koordinat hasil geseran user
        }),
      });

      if (res.ok) {
        alert("UMKM berhasil diajukan! Menunggu verifikasi admin.");
        router.push("/umkm");
      } else {
        alert("Gagal mengajukan UMKM.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3e8] py-10 px-5 lg:px-8">
      <div className="mx-auto max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-[#e8dfcf]">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-[.2em] text-[#a27731]">MEDANKARSA UMKM</p>
          <h1 className="font-serif text-3xl font-bold text-[#173d2b] mt-1">Daftarkan UMKM Anda</h1>
          <p className="text-sm text-[#697067] mt-1">
            Isi informasi usaha dan geser pin merah pada peta agar posisinya akurat 100%.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#173d2b] uppercase mb-1">Nama Usaha / UMKM</label>
            <div className="flex items-center rounded-xl border border-[#e8dfcf] px-3 py-2.5 bg-[#f8f3e8]/30">
              <Store size={18} className="text-[#a27731] mr-2" />
              <input
                type="text"
                required
                placeholder="Contoh: Khas Medan Merdeka"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent text-sm focus:outline-none text-[#173d2b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173d2b] uppercase mb-1">Kategori</label>
            <div className="flex items-center rounded-xl border border-[#e8dfcf] px-3 py-2.5 bg-[#f8f3e8]/30">
              <Tag size={18} className="text-[#a27731] mr-2" />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-transparent text-sm focus:outline-none text-[#173d2b]"
              >
                <option value="Kuliner">Kuliner / Makanan</option>
                <option value="Kerajinan">Kerajinan Tangan / Souvenir</option>
                <option value="Fashion">Fashion & Pakaian</option>
                <option value="Jasa">Jasa & Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173d2b] uppercase mb-1">Deskripsi Usaha</label>
            <div className="flex items-start rounded-xl border border-[#e8dfcf] p-3 bg-[#f8f3e8]/30">
              <FileText size={18} className="text-[#a27731] mr-2 mt-0.5" />
              <textarea
                required
                rows={3}
                placeholder="Ceritakan produk unggulan atau keunikan UMKM Anda..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-transparent text-sm focus:outline-none text-[#173d2b] resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173d2b] uppercase mb-1">Alamat Lengkap / Patokan</label>
            <div className="flex items-start rounded-xl border border-[#e8dfcf] p-3 bg-[#f8f3e8]/30">
              <MapPin size={18} className="text-[#a27731] mr-2 mt-0.5" />
              <textarea
                required
                rows={2}
                placeholder="Contoh: Jl. Dr. Mansyur No. 9 (Dekat gerbang kampus)"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-transparent text-sm focus:outline-none text-[#173d2b] resize-none"
              />
            </div>
          </div>

          {/* WIDGET PETA DRAGGABLE UNTUK MENENTUKAN TITIK AKURAT */}
          <div>
            <label className="block text-xs font-bold text-[#173d2b] uppercase mb-1">
              Tentukan Titik Lokasi di Peta (Geser Pin ke Lokasi Anda)
            </label>
            <div className="rounded-2xl overflow-hidden border border-[#e8dfcf]">
              <LocationPickerMap position={coords} setPosition={setCoords} />
            </div>
            <p className="text-[11px] text-[#8b9189] mt-1.5 italic">
              📍 Koordinat terpilih: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173d2b] uppercase mb-1">Link Foto Usaha (Opsional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-xl border border-[#e8dfcf] px-3 py-2.5 text-sm bg-[#f8f3e8]/30 focus:outline-none text-[#173d2b]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#173d2b] py-3.5 text-sm font-bold text-white transition hover:bg-[#0f291d] shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Navigation size={16} />
            {loading ? "Menyimpan..." : "Kirim Pengajuan UMKM"}
          </button>
        </form>
      </div>
    </main>
  );
}