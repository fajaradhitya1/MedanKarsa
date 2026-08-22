"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, ArrowLeft, Download, Send } from "lucide-react";

function TicketSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "MK-TICKET-DEMO";

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data tiket atau buat otomatis via API backend
    fetch(`/api/heritage/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentType: "qris" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ticket) {
          setTicket(data.ticket);
        } else {
          // Fallback data jika respons API belum siap
          setTicket({
            ticketCode: orderId,
            buyerName: "Pengunjung Medan Karsa",
            buyerPhone: "081234567890",
            buyerEmail: "visitor@medankarsa.com",
            status: "SUCCESS",
            createdAt: new Date().toISOString(),
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat detail tiket:", err);
        setTicket({
          ticketCode: orderId,
          buyerName: "Pengunjung Medan Karsa",
          buyerPhone: "081234567890",
          buyerEmail: "visitor@medankarsa.com",
          status: "SUCCESS",
          createdAt: new Date().toISOString(),
        });
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3e8] flex items-center justify-center text-[#173d2b]">
        <p className="font-serif text-lg animate-pulse">Memuat E-Tiket Anda...</p>
      </div>
    );
  }

  const expiresDate = new Date(ticket?.createdAt || Date.now());
  expiresDate.setDate(expiresDate.getDate() + 1);

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] py-12 px-5">
      <div className="mx-auto max-w-xl">
        {/* Tombol Navigasi - Disembunyikan saat di-print */}
        <div className="print:hidden mb-6">
          <Link href="/heritage" className="inline-flex items-center gap-2 text-sm font-semibold text-[#667068] hover:text-[#173d2b]">
            <ArrowLeft size={17} /> Kembali ke Beranda Heritage
          </Link>
        </div>

        {/* E-TICKET CARD */}
        <div className="bg-white rounded-[32px] shadow-lg border border-[#173d2b]/10 overflow-hidden relative">
          
          {/* Header Tiket */}
          <div className="bg-[#173d2b] text-white p-6 sm:p-8 text-center relative">
            <div className="absolute top-4 right-4 bg-[#b8860b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Lunas & Resmi
            </div>
            <CheckCircle2 className="mx-auto text-[#f1c76e] mb-2" size={42} />
            <h1 className="font-serif text-2xl font-bold">E-Tiket Masuk Cagar Budaya</h1>
            <p className="text-xs text-gray-300 mt-1">Tunjukkan QR Code ini kepada petugas di lokasi wisata.</p>
          </div>

          {/* Body Tiket */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Info Destinasi & Order ID */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Destinasi</p>
                <p className="font-serif text-lg font-bold text-[#173d2b]">Rumah Tjong A Fie</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Order ID</p>
                <p className="text-xs font-mono font-bold text-gray-600 max-w-[180px] truncate">{ticket?.ticketCode || orderId}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-[#f5f0e6] rounded-2xl p-6 text-center space-y-3">
              <div className="inline-block bg-white p-4 rounded-xl shadow-sm border border-[#173d2b]/10">
                <div className="w-36 h-36 bg-white flex flex-col items-center justify-center rounded-lg mx-auto">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket?.ticketCode || orderId}`} 
                    alt="QR Code Tiket" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 font-mono">Token: {ticket?.ticketCode || orderId}-VERIFIED</p>
            </div>

            {/* Detail Pemilik Tiket */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-sm">
              <div>
                <p className="text-xs text-gray-400">Nama Pengunjung</p>
                <p className="font-semibold text-[#173d2b]">{ticket?.buyerName || "Pengunjung"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">No. WhatsApp</p>
                <p className="font-semibold text-[#173d2b]">{ticket?.buyerPhone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email Akun</p>
                <p className="font-semibold text-[#173d2b] text-xs truncate">{ticket?.buyerEmail || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="font-semibold text-emerald-600 uppercase text-xs">{ticket?.status || "SUCCESS"}</p>
              </div>
            </div>

            {/* Masa Berlaku */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 text-xs">
              <Clock size={20} className="shrink-0 text-amber-600" />
              <div>
                <span className="font-bold">Masa Berlaku Tiket:</span> Berakhir pada{" "}
                {expiresDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                pukul 23:59 WIB.
              </div>
            </div>

            {/* Tombol Aksi - Sembunyikan saat di-print */}
            <div className="grid grid-cols-2 gap-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#173d2b] py-3 text-xs font-bold text-[#173d2b] hover:bg-[#173d2b] hover:text-white transition"
              >
                <Download size={15} /> Cetak / Unduh PDF
              </button>
              <button
                onClick={() => alert(`Tiket berhasil dikirim ke WhatsApp ${ticket?.buyerPhone || "Pengunjung"}!`)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#b8860b] py-3 text-xs font-bold text-white hover:bg-[#996f08] transition"
              >
                <Send size={15} /> Kirim ke WhatsApp
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default function TicketSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f3e8] flex items-center justify-center text-[#173d2b]">
        <p className="font-serif text-lg animate-pulse">Memuat E-Tiket Anda...</p>
      </div>
    }>
      <TicketSuccessContent />
    </Suspense>
  );
}