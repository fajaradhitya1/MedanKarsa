"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = use(params);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [timeLeft, setTimeLeft] = useState(900);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  // State untuk Data Event Dinamis
  const [eventData, setEventData] = useState({
    title: "Memuat Event...",
    price: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data event asli berdasarkan slug saat halaman dibuka
  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setEventData({
            title: data.title || "Tiket Event MedanKarsa",
            price: data.price !== undefined ? data.price : 50000,
          });
        }
      } catch (err) {
        console.error("Gagal memuat detail event:", err);
      }
    }
    fetchEventDetails();
  }, [slug]);

  // Memuat Script Midtrans Snap
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    const script = document.createElement("script");
    script.src = midtransScriptUrl;
    script.setAttribute("data-client-key", myClientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Timer Real-Time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompletePayment = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          idNumber: formData.idNumber,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            alert("Pembayaran Berhasil! E-Tiket otomatis dikirim ke Gmail Anda.");
            window.location.href = `/event/${slug}`;
          },
          onPending: function (result: any) {
            alert("Menunggu pembayaran Anda diselesaikan.");
          },
          onError: function (result: any) {
            alert("Pembayaran gagal atau dibatalkan.");
          },
          onClose: function () {
            setIsSubmitting(false);
          }
        });
      } else {
        alert(data.error || "Gagal memproses pembayaran");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
      setIsSubmitting(false);
    }
  };

  // Format ke Rupiah
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(eventData.price);

  return (
    <div className="min-h-screen bg-[#f8f3e8] text-[#173d2b] pb-24">
      
      {/* HEADER WIZARD */}
      <div className="bg-white border-b border-[#e2d8c5] py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2.5">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${step === 1 ? "border-[#173d2b] text-white bg-[#173d2b]" : "border-[#777d75] text-[#777d75]"}`}>1</span>
            <span className={step === 1 ? "text-[#173d2b]" : "text-[#777d75]"}>Personal Information</span>
          </div>
          <span className="text-[#e2d8c5]">&gt;</span>
          <div className="flex items-center gap-2.5">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${step === 2 ? "border-[#173d2b] text-white bg-[#173d2b]" : "border-[#777d75] text-[#777d75]"}`}>2</span>
            <span className={step === 2 ? "text-[#173d2b]" : "text-[#777d75]"}>Confirmation</span>
          </div>
          <span className="text-[#e2d8c5]">&gt;</span>
          <div className="flex items-center gap-2.5">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${step === 3 ? "border-[#173d2b] text-white bg-[#173d2b]" : "border-[#777d75] text-[#777d75]"}`}>3</span>
            <span className={step === 3 ? "text-[#173d2b]" : "text-[#777d75]"}>Payment</span>
          </div>
        </div>
      </div>

      {/* TIMER */}
      <div className="bg-[#fbbf24] text-[#173d2b] py-3 px-6 text-center text-sm font-bold shadow-xs flex items-center justify-center gap-3">
        <span className="bg-black/10 px-3 py-1 rounded font-mono tracking-wider text-base">{formattedTimer}</span> 
        <span>Remaining time to make your payment</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        <button
          onClick={() => {
            if (step === 1) window.location.href = `/event/${slug}`;
            else if (step === 2) setStep(1);
            else if (step === 3) setStep(2);
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#173d2b] hover:underline mb-6 bg-white px-4 py-2.5 rounded-xl border border-[#e2d8c5] shadow-xs transition"
        >
          <ArrowLeft size={16} /> {step === 1 ? "Kembali ke Detail Event" : "Kembali ke Tahap Sebelumnya"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
          
          {/* TAHAP 1 */}
          {step === 1 && (
            <div className="bg-white rounded-[28px] border border-[#e2d8c5] p-8 sm:p-10 shadow-xs">
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#173d2b] mb-2">First Name *</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full rounded-xl border border-[#e2d8c5] px-4 py-3 outline-none focus:border-[#173d2b] bg-[#fdfbf7]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#173d2b] mb-2">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full rounded-xl border border-[#e2d8c5] px-4 py-3 outline-none focus:border-[#173d2b] bg-[#fdfbf7]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173d2b] mb-2">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full rounded-xl border border-[#e2d8c5] px-4 py-3 outline-none focus:border-[#173d2b] bg-[#fdfbf7]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173d2b] mb-2">Phone Number *</label>
                  <div className="flex gap-3">
                    <select className="rounded-xl border border-[#e2d8c5] px-4 py-3 bg-[#fdfbf7] text-xs font-bold outline-none">
                      <option>🇮🇩 +62</option>
                    </select>
                    <input type="tel" name="phone" required placeholder="81222333444" value={formData.phone} onChange={handleInputChange} className="w-full rounded-xl border border-[#e2d8c5] px-4 py-3 outline-none focus:border-[#173d2b] bg-[#fdfbf7]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173d2b] mb-2">ID Number (KTP/Passport) *</label>
                  <input type="text" name="idNumber" required value={formData.idNumber} onChange={handleInputChange} className="w-full rounded-xl border border-[#e2d8c5] px-4 py-3 outline-none focus:border-[#173d2b] bg-[#fdfbf7]" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-[#173d2b] py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#21633f] text-center mt-8">
                  Lanjut ke Konfirmasi →
                </button>
              </form>
            </div>
          )}

          {/* TAHAP 2 */}
          {step === 2 && (
            <div className="bg-white rounded-[28px] border border-[#e2d8c5] p-8 sm:p-10 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#173d2b] border-b border-[#f2eadb] pb-4">Konfirmasi Data Pemesan</h2>
              <div className="space-y-3 text-sm bg-[#fdfbf7] p-6 rounded-2xl border border-[#e2d8c5] leading-relaxed">
                <p><strong>Nama Lengkap:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>No. Telepon / WhatsApp:</strong> +62 {formData.phone}</p>
                <p><strong>No. Identitas (KTP):</strong> {formData.idNumber}</p>
              </div>
              <button onClick={() => setStep(3)} className="w-full rounded-xl bg-[#173d2b] py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#21633f] text-center">
                Lanjut ke Pembayaran Otomatis (Midtrans) →
              </button>
            </div>
          )}

          {/* TAHAP 3 */}
          {step === 3 && (
            <div className="bg-white rounded-[28px] border border-[#e2d8c5] p-8 sm:p-10 shadow-xs space-y-6 text-center">
              <h2 className="font-serif text-xl font-bold text-[#173d2b] border-b border-[#f2eadb] pb-4 text-left">Metode Pembayaran Otomatis</h2>
              <p className="text-sm text-[#697067]">
                Silakan klik tombol di bawah untuk memilih metode pembayaran (QRIS, Virtual Account, E-Wallet) melalui sistem aman Midtrans.
              </p>
              <button onClick={handleCompletePayment} disabled={isSubmitting} className="w-full rounded-xl bg-[#21633f] py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#173d2b] text-center flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                <CheckCircle2 size={18} /> {isSubmitting ? "Menghubungkan ke Pembayaran..." : "Bayar Sekarang (Midtrans Snap)"}
              </button>
            </div>
          )}

          {/* SISI KANAN: ORDER SUMMARY DINAMIS */}
          <div className="space-y-6 sticky top-6">
            <div className="bg-white rounded-[28px] border border-[#e2d8c5] p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#173d2b] border-b border-[#f2eadb] pb-3">Order Summary</h3>
              <div className="flex justify-between items-center text-xs sm:text-sm text-[#697067]">
                <div>
                  <p className="font-bold text-[#173d2b]">{eventData.title}</p>
                  <p>1 ticket x {formattedPrice}</p>
                </div>
                <span className="font-bold text-[#173d2b]">{formattedPrice}</span>
              </div>
              <div className="border-t border-[#f2eadb] pt-4 flex justify-between items-center font-serif text-base sm:text-lg font-bold text-[#173d2b]">
                <span>Subtotal</span>
                <span className="text-[#173d2b]">{formattedPrice}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}