"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Mail, ArrowLeft, Ticket, MapPin, Sparkles } from "lucide-react";

function EventTicketContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/ticket/detail?orderId=${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTicketData(data.ticket);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal memuat tiket event", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleDownloadTicket = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    setEmailSending(true);
    try {
      const res = await fetch("/api/ticket/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim email");

      setEmailSent(true);
      alert("E-tiket event berhasil dikirim ke Gmail Anda!");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat mengirim email.");
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3e8] flex items-center justify-center text-[#173d2b] font-serif">
        Memuat E-Tiket Event Anda...
      </div>
    );
  }

  const isPointRedeem = ticketData?.paymentType === "KARSA_POINTS" || orderId?.startsWith("REDEEM");
  const eventInfo = ticketData?.event;

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] py-10 px-5">
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* Tombol Navigasi */}
        <div className="flex justify-between items-center print:hidden">
          <Link href="/dompet-karsa" className="inline-flex items-center gap-2 text-xs font-bold text-[#173d2b] hover:underline">
            <ArrowLeft size={16} /> Kembali ke Dompet Karsa
          </Link>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {isPointRedeem ? "Ditukar dengan Karsa Poin" : "Pembayaran Event Lunas"}
          </span>
        </div>

        {/* KARTU E-TIKET EVENT */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 print:shadow-none print:border-none">
          
          {/* Header */}
          <div className="bg-[#173d2b] text-white p-8 text-center space-y-2 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <Ticket size={180} />
            </div>
            <span className="text-[#f1c76e] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              {isPointRedeem && <Sparkles size={14} />} E-Tiket Resmi Event MedanKarsa
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              {eventInfo?.title || "Tiket Masuk Event Budaya"}
            </h1>
            <p className="text-xs text-gray-300 font-mono pt-1">ID: {ticketData?.ticketCode || orderId}</p>
          </div>

          {/* Detail Informasi */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              {eventInfo?.description && (
                <p className="text-xs text-gray-500 line-clamp-2 bg-[#f8f3e8] p-3.5 rounded-xl">
                  {eventInfo.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase font-semibold">Nama Peserta</p>
                  <p className="font-bold text-[#173d2b] mt-0.5">{ticketData?.buyerName || "Pengunjung"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase font-semibold">Metode</p>
                  <p className="font-bold text-[#b8860b] mt-0.5 uppercase">
                    {isPointRedeem ? "⭐ Penukaran Poin Karsa" : ticketData?.paymentType || "QRIS / Transfer"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase font-semibold">Lokasi Acara</p>
                  <p className="font-bold text-[#173d2b] mt-0.5 flex items-center gap-1">
                    <MapPin size={14} className="text-[#b8860b]" /> {eventInfo?.location || "Kota Medan"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase font-semibold">Status Tiket</p>
                  <p className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Aktif / Valid
                  </p>
                </div>
              </div>
            </div>

            {/* Barcode / QR */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-[#faf7f2] space-y-2">
              <div className="font-mono text-xl font-bold tracking-widest text-[#173d2b]">
                ||| | |||| || ||| || ||||
              </div>
              <p className="text-[11px] text-gray-500 text-center">Tunjukkan barcode ini di gerbang masuk lokasi event.</p>
            </div>
          </div>

          {/* Tombol Aksi Download & Gmail */}
          <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handleDownloadTicket}
              className="w-full py-3.5 rounded-2xl bg-[#173d2b] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition hover:bg-[#0f291d]"
            >
              <Download size={16} /> Unduh / Cetak E-Tiket
            </button>

            <button
              disabled={emailSending || emailSent}
              onClick={handleSendEmail}
              className="w-full py-3.5 rounded-2xl bg-[#f5f0e6] text-[#173d2b] border border-[#e2b45e]/40 text-xs font-bold flex items-center justify-center gap-2 transition hover:bg-[#ebdcc4] disabled:opacity-50"
            >
              <Mail size={16} /> {emailSent ? "Terkirim ke Gmail" : emailSending ? "Mengirim..." : "Kirim ke Gmail"}
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}

export default function EventTicketSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f3e8] flex items-center justify-center text-[#173d2b]">Memuat E-Tiket Event...</div>}>
      <EventTicketContent />
    </Suspense>
  );
}