"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, User, Phone, CreditCard, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

declare global {
  interface Window {
    snap: any;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default function HeritageBookingPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [heritageData, setHeritageData] = useState<any>(null);

  // State untuk Modal Sukses & Info Poin
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(50);
  const [redirectOrderId, setRedirectOrderId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    identityNumber: "",
    quantity: 1,
  });

  const TICKET_PRICE = 15000;

  useEffect(() => {
    fetch(`/api/heritage/${slug}`)
      .then((res) => res.json())
      .then((data) => setHeritageData(data))
      .catch((err) => console.error("Gagal memuat data heritage", err));
  }, [slug]);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "Mid-client-3_D4UQKJVjKqlo3i";
    
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.identityNumber) {
      alert("Mohon lengkapi semua data diri Anda!");
      return;
    }
    setStep(2);
  };

  const handleProceedPayment = async () => {
    setLoading(true);
    try {
      const userEmail = session?.user?.email || "visitor@medankarsa.com";

      const res = await fetch("/api/heritage/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          ...formData,
          email: userEmail,
          totalPrice: TICKET_PRICE * formData.quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat transaksi");

      const { token, orderId } = data;
      setRedirectOrderId(orderId);

      window.snap.pay(token, {
        onSuccess: async function (result: any) {
          // Konfirmasi ke backend untuk simpan tiket & tambah poin
          const verifyRes = await fetch("/api/heritage/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              name: formData.name,
              phone: formData.phone,
              email: userEmail,
              paymentType: result.payment_type || "qris",
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.pointsEarned) {
            setEarnedPoints(verifyData.pointsEarned);
          }

          setLoading(false);
          setShowSuccessModal(true); // Tampilkan modal sukses interaktif & info poin
        },
        onPending: function () {
          alert("Menunggu pembayaran Anda.");
          setLoading(false);
        },
        onError: function () {
          alert("Pembayaran gagal! Silakan coba lagi.");
          setLoading(false);
        },
        onClose: function () {
          alert("Anda menutup popup pembayaran sebelum selesai.");
          setLoading(false);
        },
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] py-10 px-5 print:hidden relative">
      <div className="mx-auto max-w-2xl bg-white rounded-[30px] p-6 sm:p-10 shadow-sm">
        <Link href={`/heritage/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#667068] hover:text-[#173d2b] mb-6">
          <ArrowLeft size={17} /> Kembali ke Detail Tempat
        </Link>

        <div className="border-b border-gray-100 pb-6 mb-6">
          <span className="bg-[#e2b45e]/20 text-[#b8860b] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pemesanan Tiket Masuk
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
            {heritageData?.name || "Memuat destinasi..."}
          </h1>
          <p className="text-xs text-gray-500 mt-1">Lengkapi data diri pengunjung dengan benar untuk penerbitan e-tiket resmi.</p>
        </div>

        {/* STEP 1 & 2 FORM KODE ANDA TETAP SAMA */}
        {step === 1 && (
          <form onSubmit={handleSubmitForm} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-1">Nomor Telepon / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-1">Nomor Identitas (NIK KTP)</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="identityNumber"
                  required
                  placeholder="Masukkan 16 digit NIK"
                  value={formData.identityNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#173d2b] mb-1">Jumlah Tiket</label>
              <input
                type="number"
                name="quantity"
                min={1}
                max={10}
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm focus:outline-none"
              />
            </div>

            <div className="bg-[#f5f0e6] p-4 rounded-2xl flex items-center justify-between mt-6">
              <div>
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-xl font-serif font-bold text-[#173d2b]">Rp {(TICKET_PRICE * formData.quantity).toLocaleString("id-ID")}</p>
              </div>
              <button type="submit" className="rounded-xl bg-[#173d2b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0f291d]">
                Konfirmasi Data Diri
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#f5f0e6] p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[#b8860b] font-bold text-sm">
                <ShieldCheck size={18} /> Periksa Kembali Data Anda
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-[#173d2b]/10">
                <div><p className="text-xs text-gray-500">Nama</p><p className="font-semibold">{formData.name}</p></div>
                <div><p className="text-xs text-gray-500">No. WhatsApp</p><p className="font-semibold">{formData.phone}</p></div>
                <div><p className="text-xs text-gray-500">No. Identitas</p><p className="font-semibold">{formData.identityNumber}</p></div>
                <div><p className="text-xs text-gray-500">Jumlah Tiket</p><p className="font-semibold">{formData.quantity} Orang</p></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Total Tagihan</p>
                <p className="text-2xl font-serif font-bold text-[#173d2b]">Rp {(TICKET_PRICE * formData.quantity).toLocaleString("id-ID")}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold text-gray-600">Ubah Data</button>
                <button type="button" disabled={loading} onClick={handleProceedPayment} className="rounded-xl bg-[#b8860b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#996f08]">
                  {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL SUKSES PEMBAYARAN & NOTIFIKASI POIN */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#173d2b]">Pembayaran Berhasil!</h3>
              <p className="text-xs text-gray-500">Tiket Anda telah terbit dan siap digunakan.</p>
            </div>

            {/* Kotak Informasi Poin yang Didapat */}
            <div className="bg-[#f8f3e8] border border-[#e2b45e]/30 rounded-2xl p-4 flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#b8860b] text-white flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Bonus Cashback</p>
                <p className="text-sm font-bold text-[#173d2b]">Berhasil Mendapat <span className="text-[#b8860b]">+{earnedPoints} Karsa Poin!</span></p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/heritage/ticket/success?orderId=${redirectOrderId}`)}
              className="w-full py-3.5 rounded-2xl bg-[#173d2b] text-white text-xs font-bold tracking-wider uppercase shadow-md transition hover:bg-[#0f291d]"
            >
              Lihat E-Tiket Saya
            </button>
          </div>
        </div>
      )}
    </main>
  );
}