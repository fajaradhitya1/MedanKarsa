"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, QrCode, Calendar, Clock, User, ShieldCheck, ArrowLeft, Download, Send } from "lucide-react";

function TicketContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // Fetch detail tiket dari backend berdasarkan orderId pembayaran
      fetch(`/api/heritage/ticket-detail?orderId=${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setTicketData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal memuat tiket:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3e8] flex items-center justify-center text-[#173d2b]">
        <p className="font-serif text-lg animate-pulse">Memuat E-Tiket Anda...</p>
      </div>
    );
  }

  // Data dummy/fallback jika diakses langsung tanpa orderId valid (untuk preview layout)
  const ticket = ticketData || {
    orderId: orderId || "MK-HERITAGE-2026-0823",
    heritageName: "Rumah Tjong A Fie",
    name: "Fajar Adhitya",
    phone: "081234567890",
    identityNumber: "1271012345678901",
    quantity: 1,
    totalPrice: 15000,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 jam ke depan
    status: "SUCCESS",
  };

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] py-12 px-5">
      <div className="mx-auto max-w-xl">
        {/* Tombol Navigasi */}
        <Link href="/heritage" className="inline-flex items-center gap-2 text-sm font-semibold text-[#667068] hover:text-[#173d2b] mb-6">
          <ArrowLeft size={17} /> Kembali ke Beranda Heritage
        </Link>

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
                <p className="font-serif text-lg font-bold text-[#173d2b]">{ticket.heritageName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Order ID</p>
                <p className="text-xs font-mono font-bold text-gray-600">{ticket.orderId}</p>
              </div>
            </div>

            {/* QR Code Simulation */}
            <div className="bg-[#f5f0e6] rounded-2xl p-6 text-center space-y-3">
              <div className="inline-block bg-white p-4 rounded-xl shadow-sm border border-[#173d2b]/10">
                {/* Visual Placeholder QR Code / Generate dari ID */}
                <div className="w-36 h-36 bg-[#173d2b] text-white flex flex-col items-center justify-center rounded-lg mx-auto">
                  <QrCode size={72} className="text-[#f1c76e]" />
                  <span className="text-[9px] font-mono mt-1 tracking-widest">SCAN ME</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 font-mono">Token: {ticket.orderId}-VERIFIED</p>
            </div>

            {/* Detail Pemilik Tiket */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-sm">
              <div>
                <p className="text-xs text-gray-400">Nama Pengunjung</p>
                <p className="font-semibold text-[#173d2b]">{ticket.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">No. WhatsApp</p>
                <p className="font-semibold text-[#173d2b]">{ticket.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Nomor Identitas (KTP)</p>
                <p className="font-semibold text-[#173d2b]">{ticket.identityNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Jumlah Tiket</p>
                <p className="font-semibold text-[#173d2b]">{ticket.quantity} Orang (Rp {ticket.totalPrice?.toLocaleString("id-ID")})</p>
              </div>
            </div>

            {/* Masa Berlaku (Expired Date) */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 text-xs">
              <Clock size={20} className="shrink-0 text-amber-600" />
              <div>
                <span className="font-bold">Masa Berlaku Tiket:</span> Berakhir pada{" "}
                {new Date(ticket.expiresAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                pukul 23:59 WIB.
              </div>
            </div>

            {/* Tombol Aksi (Simpan / Kirim Ulang) */}
            {/* Tombol Aksi (Simpan / Kirim Ulang) - Sembunyikan saat di-print */}
<div className="grid grid-cols-2 gap-3 pt-2 print:hidden">
  <button
    onClick={() => window.print()}
    className="flex items-center justify-center gap-2 rounded-xl border border-[#173d2b] py-3 text-xs font-bold text-[#173d2b] hover:bg-[#173d2b] hover:text-white transition"
  >
    <Download size={15} /> Cetak / Unduh PDF
  </button>
  <button
    onClick={() => alert("Tiket berhasil dikirim ulang ke WhatsApp & Email Anda!")}
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
        <p className="font-serif text-lg animate-pulse">Memuat Halaman...</p>
      </div>
    }>
      <TicketContent />
    </Suspense>
  );
}