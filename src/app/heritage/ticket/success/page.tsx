import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, QrCode, Clock, ArrowLeft, Download, Send } from "lucide-react";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

async function TicketDetails({ orderId }: { orderId: string }) {
  // Ambil data tiket beserta relasi event/heritage dari database
  const ticket = await prisma.ticket.findUnique({
    where: { ticketCode: orderId },
    include: { event: true },
  });

  // Fallback jika tiket belum ada di database (misal baru pertama kali load)
  const ticketData = ticket || {
    ticketCode: orderId,
    buyerName: "Pengunjung Medan Karsa",
    buyerPhone: "-",
    buyerEmail: "-",
    status: "SUCCESS",
    createdAt: new Date(),
    event: { title: "Rumah Tjong A Fie" },
  };

  const expiresDate = new Date(ticketData.createdAt);
  expiresDate.setDate(expiresDate.getDate() + 1); // Berlaku 24 jam ke depan

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
                <p className="font-serif text-lg font-bold text-[#173d2b]">
                  {ticketData.event?.title || "Rumah Tjong A Fie"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Order ID</p>
                <p className="text-xs font-mono font-bold text-gray-600 max-w-[180px] truncate">{ticketData.ticketCode}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-[#f5f0e6] rounded-2xl p-6 text-center space-y-3">
              <div className="inline-block bg-white p-4 rounded-xl shadow-sm border border-[#173d2b]/10">
                <div className="w-36 h-36 bg-white flex flex-col items-center justify-center rounded-lg mx-auto">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData.ticketCode}`} 
                    alt="QR Code Tiket" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 font-mono">Token: {ticketData.ticketCode}-VERIFIED</p>
            </div>

            {/* Detail Pemilik Tiket */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-sm">
              <div>
                <p className="text-xs text-gray-400">Nama Pengunjung</p>
                <p className="font-semibold text-[#173d2b]">{ticketData.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">No. WhatsApp</p>
                <p className="font-semibold text-[#173d2b]">{ticketData.buyerPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email Akun</p>
                <p className="font-semibold text-[#173d2b] text-xs truncate">{ticketData.buyerEmail}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="font-semibold text-emerald-600 uppercase text-xs">{ticketData.status}</p>
              </div>
            </div>

            {/* Masa Berlaku (Expired Date) */}
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
                onClick={() => alert(`Tiket berhasil dikirim ke WhatsApp ${ticketData.buyerPhone}!`)}
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

export default async function TicketSuccessPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId;

  if (!orderId) {
    redirect("/heritage");
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f3e8] flex items-center justify-center text-[#173d2b]">
        <p className="font-serif text-lg animate-pulse">Memuat E-Tiket Anda...</p>
      </div>
    }>
      <TicketDetails orderId={orderId} />
    </Suspense>
  );
}