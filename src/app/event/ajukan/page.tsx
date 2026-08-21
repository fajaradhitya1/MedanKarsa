"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Image as ImageIcon, Loader2, Upload, QrCode } from "lucide-react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/event/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-[#f2eadb] text-[#697067] text-sm">
      Memuat Peta Interaktif...
    </div>
  ),
});

export default function AjukanEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Budaya",
    description: "",
    detailDescription: "",
    location: "Lapangan Merdeka Medan",
    latitude: 3.5894,
    longitude: 98.6740,
    date: "",
    startTime: "",
    endTime: "",
    coverImage: "",
    price: "",
    paymentQrCode: "",
    danaNumber: "", // Tambahkan ini
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Ukuran gambar cover terlalu besar (Maksimal 2MB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, coverImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Ukuran gambar QR terlalu besar (Maksimal 2MB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setQrPreview(base64String);
        setFormData((prev) => ({ ...prev, paymentQrCode: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengajukan event.");
      }

      router.push("/event?submitted=true");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3e8] py-10 px-5 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm border border-[#e8dfcf]">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[.2em] text-[#a27731]">
            KONTRIBUSI WARGA
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#173d2b]">
            Ajukan Event Baru
          </h1>
          <p className="mt-2 text-sm text-[#697067]">
            Lengkapi informasi event, harga, dan QR pembayaran untuk modal acara.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAMA EVENT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">
              Nama Event
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Festival Kuliner Kesawan"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none focus:border-[#21633f]"
            />
          </div>

          {/* KATEGORI & HARGA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] bg-white outline-none focus:border-[#21633f]"
              >
                <option value="Budaya">Budaya</option>
                <option value="Kuliner">Kuliner</option>
                <option value="Kreatif">Kreatif</option>
                <option value="Seni">Seni</option>
                <option value="Musik">Musik</option>
                <option value="Komunitas">Komunitas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">
                Harga Tiket (Rp)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0 (Jika Gratis)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none focus:border-[#21633f]"
              />
            </div>
          </div>

          {/* UPLOAD COVER EVENT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">
              Cover Event (Foto Utama)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex h-28 w-full sm:w-36 items-center justify-center rounded-2xl border-2 border-dashed border-[#e2d8c5] bg-[#fdfbf7] overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview Cover" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-[#8b9189]">
                    <ImageIcon size={24} />
                    <span className="text-[10px] mt-1">Belum ada foto</span>
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#e2d8c5] bg-white px-4 py-4 text-xs font-bold text-[#173d2b] transition hover:bg-[#eee8dc]">
                  <Upload size={16} />
                  Pilih Foto Cover dari Perangkat
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* UPLOAD QR CODE PEMBAYARAN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">
              QR Code Pembayaran / Barcode Unik Event
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex h-28 w-full sm:w-36 items-center justify-center rounded-2xl border-2 border-dashed border-[#e2d8c5] bg-[#fdfbf7] overflow-hidden">
                {qrPreview ? (
                  <img src={qrPreview} alt="Preview QR" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-[#8b9189]">
                    <QrCode size={24} />
                    <span className="text-[10px] mt-1">Belum ada QR</span>
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#e2d8c5] bg-white px-4 py-4 text-xs font-bold text-[#173d2b] transition hover:bg-[#eee8dc]">
                  <Upload size={16} />
                  Pilih Gambar QR Code (QRIS / Rekening)
                  <input type="file" accept="image/*" onChange={handleQrChange} className="hidden" />
                </label>
                <p className="text-[11px] text-[#8b9189] mt-2">QR code ini akan tampil unik pada halaman detail event Anda.</p>
              </div>
            </div>
          </div>
          {/* NOMOR DANA */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">
              Nomor Akun DANA
            </label>
            <div className="flex gap-3">
              <span className="flex items-center px-4 bg-[#fdfbf7] border border-[#e2d8c5] rounded-2xl text-sm font-bold text-[#697067]">
                +62
              </span>
              <input
                type="tel"
                placeholder="812xxxxxxxxx"
                value={formData.danaNumber}
                onChange={(e) => setFormData({ ...formData, danaNumber: e.target.value })}
                className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none focus:border-[#21633f]"
              />
            </div>
            <p className="text-[11px] text-[#8b9189] mt-2">Masukkan nomor aktif yang terdaftar di DANA untuk menerima pembayaran tiket.</p>
          </div>

          {/* PETA INTERAKTIF */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">
              Tandai Lokasi Event di Peta
            </label>
            <div className="mb-3">
              <input
                type="text"
                required
                placeholder="Nama lokasi..."
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3 text-sm text-[#173d2b] outline-none focus:border-[#21633f]"
              />
            </div>
            <div className="h-72 w-full overflow-hidden rounded-2xl border border-[#e2d8c5]">
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={(lat, lng, address) => {
                  setFormData((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                    location: address,
                  }));
                }}
              />
            </div>
          </div>

          {/* TANGGAL DAN WAKTU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">Tanggal</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">Jam Mulai</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">Jam Selesai</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none"
              />
            </div>
          </div>

          {/* DESKRIPSI SINGKAT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">Deskripsi Singkat</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none"
            />
          </div>

          {/* DESKRIPSI DETAIL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-2">Deskripsi Lengkap</label>
            <textarea
              required
              rows={4}
              value={formData.detailDescription}
              onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
              className="w-full rounded-2xl border border-[#e2d8c5] px-4 py-3.5 text-sm text-[#173d2b] outline-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#173d2b] py-4 text-sm font-bold text-white transition hover:bg-[#0f291d] disabled:opacity-50"
          >
            {loading ? <><Loader2 className="animate-spin" size={18} /> Mengirim Pengajuan...</> : "Kirim Pengajuan Event"}
          </button>
        </form>
      </div>
    </main>
  );
}