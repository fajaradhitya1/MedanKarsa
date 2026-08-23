"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Mail, ArrowLeft, Ticket, MapPin, Calendar, Sparkles, User, CreditCard, Phone, Mail as MailIcon } from "lucide-react";

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
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Tombol Navigasi (Hilang saat diprint) */}
        <div className="flex justify-between items-center print:hidden">
          <Link href="/dompet-karsa" className="inline-flex items-center gap-2 text-xs font-bold text-[#173d2b] hover:underline">
            <ArrowLeft size={16} /> Kembali ke Dompet Karsa
          </Link>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {isPointRedeem ? "⭐ Ditukar dengan Karsa Poin" : "✅ Pembayaran Lunas"}
          </span>
        </div>

        {/* KARTU E-TIKET UTAMA */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 print:shadow-none print:border-none">
          
          {/* Header Banner */}
          <div className="bg-linear-to-br from-[#173d2b] to-[#0f291d] text-white p-8 text-center space-y-2 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <Ticket size={200} />
            </div>
            <span className="text-[#f1c76e] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              {isPointRedeem && <Sparkles size={14} />} E-Tiket Resmi Event MedanKarsa
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">
              {eventInfo?.title || "Tiket Masuk Event Budaya"}
            </h1>
            <p className="text-xs text-gray-300 font-mono pt-1">ID TICKET: {ticketData?.ticketCode || orderId}</p>
          </div>

          {/* DETAIL KONTEN LENGKAP */}
          <div className="p-8 space-y-8">
            
            {/* Bagian 1: Informasi Acara / Event */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#173d2b] border-b pb-2">Informasi Acara</h3>
              <div className="bg-[#fcf9f2] p-5 rounded-2xl border border-[#e2d8c5]/40 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#b8860b] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 font-semibold uppercase text-[10px]">Lokasi / Alamat Acara</p>
                    <p className="font-bold text-[#173d2b] mt-0.5">{eventInfo?.location || "Kota Medan, Sumatera Utara"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-[#b8860b] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 font-semibold uppercase text-[10px]">Waktu Pelaksanaan</p>
                    <p className="font-bold text-[#173d2b] mt-0.5">
                      {eventInfo?.startAt ? new Date(eventInfo.startAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }) : "Sesuai Jadwal Resmi"}
                    </p>
                  </div>
                </div>

                {eventInfo?.description && (
                  <p className="text-xs text-gray-600 pt-2 border-t border-gray-200/60 leading-relaxed">
                    {eventInfo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bagian 2: Data Diri Pemegang Tiket */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#173d2b] border-b pb-2">Data Pemegang Tiket</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-[#b8860b]" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Nama Lengkap</p>
                    <p className="font-bold text-[#173d2b]">{ticketData?.buyerName || "Pengunjung MedanKarsa"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MailIcon size={16} className="text-[#b8860b]" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Email Terdaftar</p>
                    <p className="font-bold text-[#173d2b]">{ticketData?.buyerEmail || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#b8860b]" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">No. Telepon / WhatsApp</p>
                    <p className="font-bold text-[#173d2b]">{ticketData?.buyerPhone || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard size={16} className="text-[#b8860b]" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Metode Transaksi</p>
                    <p className="font-bold text-[#b8860b] uppercase">
                      {isPointRedeem ? "⭐ Penukaran Karsa Poin" : ticketData?.paymentType || "QRIS / Transfer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 3: Barcode / QR Scan */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-[#faf7f2] space-y-2">
              <div className="font-mono text-2xl font-bold tracking-widest text-[#173d2b]">
                ||| | |||| || ||| || |||| |||
              </div>
              <p className="text-[11px] text-gray-500 text-center">Tunjukkan barcode di atas kepada panitia di gerbang masuk lokasi acara.</p>
            </div>

          </div>

          {/* Tombol Aksi Download & Gmail (Hilang saat diprint) */}
          <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handleDownloadTicket}
              className="w-full py-3.5 rounded-2xl bg-[#173d2b] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition hover:bg-[#0f291d]"
            >
              <Download size={16} /> Unduh / Cetak E-Tiket (PDF)
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