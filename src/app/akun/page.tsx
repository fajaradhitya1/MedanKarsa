import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Wallet, Ticket, Award, ExternalLink, Calendar, Sparkles, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const dynamic = "force-dynamic";

export default async function AkunPage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const userEmail = session.user.email;

  // 1. Ambil data user dari database
  const dbUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!dbUser) {
    redirect("/login");
  }

  // 2. Ambil data tiket dan transaksi poin secara terpisah berdasarkan email/userId agar aman dari error relasi schema
  const userTickets = await prisma.ticket.findMany({
    where: { buyerEmail: userEmail },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  const pointTransactions = await prisma.pointTransaction.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  const totalPoints = pointTransactions.reduce((acc: number, tx: { amount: number }) => acc + tx.amount, 0);

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] pb-24">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 space-y-10">
        
        {/* HEADER PROFIL & TOMBOL LOGOUT */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#173d2b] text-white font-serif text-2xl font-bold flex items-center justify-center shadow-md shrink-0">
              {dbUser.name ? dbUser.name.charAt(0).toUpperCase() : "M"}
            </div>
            <div className="space-y-1 text-left">
              <span className="bg-[#b8860b]/20 text-[#b8860b] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Member MedanKarsa
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#173d2b] mt-1">{dbUser.name || "Pengguna MedanKarsa"}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-0.5">
                <Mail size={14} className="text-[#b8860b]" /> {dbUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/dompet-karsa"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#173d2b] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f291d]"
            >
              <Wallet size={16} /> Dompet Karsa ({totalPoints} Poin)
            </Link>
            
            {/* Form / Tombol Logout */}
            <form
              action={async () => {
                "use server";
                // Server action untuk menghapus sesi auth
                const { signOut } = await import("@/auth");
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <LogOut size={16} /> Keluar
              </button>
            </form>
          </div>
        </div>

        {/* GRID UTAMA: TIKET SAYA & RIWAYAT POIN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* SISI KIRI: DAFTAR E-TIKET SAYA */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[30px] p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-serif text-xl font-bold text-[#173d2b] flex items-center gap-2">
                  <Ticket size={20} className="text-[#b8860b]" /> E-Tiket Saya ({userTickets.length})
                </h3>
                <span className="text-xs text-gray-400">Aktif & Riwayat</span>
              </div>

              {userTickets.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {userTickets.map((ticket: any) => {
                    const isHeritage = ticket.ticketCode.includes("HERITAGE") || ticket.ticketCode.includes("TJONG") || ticket.ticketCode.includes("MAIM");
                    const successRoute = isHeritage ? `/heritage/ticket/success?orderId=${ticket.ticketCode}` : `/event/ticket/success?orderId=${ticket.ticketCode}`;

                    return (
                      <div key={ticket.id} className="p-5 rounded-2xl bg-[#fcf9f2] border border-[#e2d8c5]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-[#b8860b]">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#173d2b] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                              {isHeritage ? "Cagar Budaya" : "Event Budaya"}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">{ticket.ticketCode}</span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-[#173d2b]">
                            {ticket.event?.title || (ticket.ticketCode.includes("MAIM") ? "Tiket Masuk Istana Maimoon" : "Tiket Masuk Kunjungan")}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={13} className="text-[#b8860b]" /> 
                            {new Date(ticket.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                          </p>
                        </div>

                        <Link
                          href={successRoute}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#173d2b] text-white text-xs font-bold transition hover:bg-[#0f291d] shrink-0"
                        >
                          Buka E-Tiket <ExternalLink size={14} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-sm text-gray-400">Kamu belum memiliki e-tiket aktif.</p>
                  <Link href="/heritage" className="inline-block text-xs font-bold text-[#b8860b] hover:underline">
                    Jelajahi & Beli Tiket Sekarang &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* SISI KANAN: RINGKASAN POIN & AKTIVITAS */}
          <div className="space-y-6">
            
            {/* Kartu Ringkasan Poin */}
            <div className="bg-linear-to-br from-[#173d2b] to-[#0f291d] text-white rounded-[30px] p-6 sm:p-7 shadow-md space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f1c76e] uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={16} /> Saldo Karsa Poin
                </span>
                <Sparkles size={18} className="text-[#f1c76e]" />
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold">{totalPoints} <span className="text-sm font-sans font-normal text-gray-300">Poin</span></h3>
                <p className="text-[11px] text-gray-300 mt-1">Dapatkan cashback poin dari setiap pembelian tiket heritage dan event.</p>
              </div>
              <Link
                href="/dompet-karsa"
                className="block text-center w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition text-white"
              >
                Tukar Poin & Lihat Katalog
              </Link>
            </div>

            {/* Riwayat Aktivitas Poin Singkat */}
            <div className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100 space-y-4 text-left">
              <h4 className="font-serif text-base font-bold text-[#173d2b] border-b pb-3">Aktivitas Poin Terbaru</h4>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {pointTransactions.length > 0 ? (
                  pointTransactions.slice(0, 5).map((tx: any) => {
                    const isPlus = tx.amount > 0;
                    return (
                      <div key={tx.id} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-none">
                        <div className="space-y-0.5 pr-2">
                          <p className="font-bold text-[#173d2b] line-clamp-1">{tx.description}</p>
                          <p className="text-[10px] text-gray-400">{new Date(tx.createdAt).toLocaleDateString("id-ID")}</p>
                        </div>
                        <span className={`font-bold shrink-0 ${isPlus ? "text-emerald-600" : "text-amber-600"}`}>
                          {isPlus ? `+${tx.amount}` : tx.amount}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">Belum ada aktivitas poin.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}