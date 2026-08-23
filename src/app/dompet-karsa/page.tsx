import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Wallet, Award, ArrowUpRight, ArrowDownLeft, Ticket, Sparkles, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DompetKarsaPage() {
  let totalPoints = 0;
  let pointHistory: Array<{ id: string; description: string; amount: number; createdAt: Date }> = [];

  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      redirect("/login");
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        pointTransactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (dbUser) {
      pointHistory = dbUser.pointTransactions;
      // Hitung total poin secara real-time dari seluruh transaksi (masuk - keluar)
      totalPoints = dbUser.pointTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    }
  } catch (err) {
    console.warn("Gagal terhubung ke database, menggunakan data default.");
  }

  const rewardCatalog = [
    {
      id: "rw-1",
      title: "Tiket Masuk Gratis Rumah Tjong A Fie",
      pointsRequired: 150,
      category: "Heritage",
      image: "https://images.unsplash.com/photo-1584646098378-0874588d76b1?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "rw-2",
      title: "Tiket Masuk Istana Maimoon",
      pointsRequired: 200,
      category: "Heritage",
      image: "https://images.unsplash.com/photo-1596401340653-485303c72b8d?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "rw-3",
      title: "Tiket Event Budaya Medan",
      pointsRequired: 350,
      category: "Event Budaya",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b] pb-20">
      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="bg-[#b8860b]/20 text-[#b8860b] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Loyalty & Rewards
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-2">Dompet Karsa</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Kumpulkan poin dari setiap pembelian tiket dan tukarkan dengan liburan gratis!</p>
          </div>
          <Link
            href="/heritage"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#173d2b] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0f291d]"
          >
            <Ticket size={16} /> Jelajah & Belanja Tiket
          </Link>
        </div>

        {/* SALDO POIN CARD */}
        <div className="relative rounded-[32px] bg-linear-to-br from-[#173d2b] to-[#0f291d] text-white p-8 sm:p-10 shadow-xl overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Award size={220} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#f1c76e] text-xs font-bold uppercase tracking-widest">
                <Wallet size={16} /> Total Karsa Points Anda
              </div>
              <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white">
                {totalPoints.toLocaleString("id-ID")} <span className="text-lg font-sans font-normal text-gray-300">Poin</span>
              </h2>
              <p className="text-xs text-gray-300 max-w-md pt-1">
                Setiap pembelian tiket heritage atau event bernilai minimal Rp 10.000 akan otomatis memberikan cashback hingga 10% dalam bentuk Poin.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shrink-0 w-full sm:w-auto">
              <p className="text-[11px] text-gray-300 uppercase font-semibold">Status Member</p>
              <p className="text-lg font-serif font-bold text-[#f1c76e] mt-0.5">
                {totalPoints >= 1000 ? "Platinum Explorer 💎" : "Gold Explorer 🌟"}
              </p>
              <p className="text-[10px] text-gray-300 mt-1">
                {totalPoints >= 1000 ? "Status Tertinggi Tercapai!" : `${Math.max(0, 1000 - totalPoints)} poin lagi menuju Platinum`}
              </p>
            </div>
          </div>
        </div>

        {/* RIWAYAT TRANSAKSI REAL-TIME */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[30px] p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#173d2b]">Riwayat Poin Masuk & Keluar</h3>
                <span className="text-xs text-gray-400 font-medium">Aktivitas Terbaru</span>
              </div>

              <div className="space-y-3">
                {pointHistory.length > 0 ? (
                  pointHistory.map((tx) => {
                    const isPlus = tx.amount > 0;
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPlus ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {isPlus ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#173d2b]">{tx.description}</p>
                            <p className="text-[11px] text-gray-400">
                              {new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isPlus ? "text-emerald-600" : "text-amber-600"}`}>
                          {isPlus ? `+${tx.amount}` : tx.amount} Poin
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 text-center py-6">Belum ada riwayat transaksi poin tercatat.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#f5f0e6] rounded-[30px] p-6 sm:p-7 border border-[#e2b45e]/30 space-y-4">
              <div className="flex items-center gap-2 text-[#b8860b] font-bold text-sm">
                <Sparkles size={18} /> Cara Kerja Dompet Karsa
              </div>
              <ul className="space-y-3 text-xs text-gray-600 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold text-[#173d2b]">1.</span> Beli tiket masuk cagar budaya atau event di Medan.</li>
                <li className="flex gap-2"><span className="font-bold text-[#173d2b]">2.</span> Poin otomatis masuk setelah pembayaran terverifikasi.</li>
                <li className="flex gap-2"><span className="font-bold text-[#173d2b]">3.</span> Tukar poin untuk mendapatkan e-tiket gratis!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* KATALOG PENUKARAN */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#173d2b]">Katalog Penukaran Tiket</h3>
              <p className="text-xs text-gray-500 mt-0.5">Tukarkan poin Anda dengan tiket wisata dan event pilihan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardCatalog.map((item) => {
              const canRedeem = totalPoints >= item.pointsRequired;
              return (
                <div key={item.id} className="bg-white rounded-[30px] overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-4 left-4 bg-[#173d2b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="font-serif text-lg font-bold text-[#173d2b]">{item.title}</h4>
                      <p className="text-xs font-bold text-[#b8860b] flex items-center gap-1.5">
                        <Gift size={14} /> {item.pointsRequired} Poin Diperlukan
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <span className={`block w-full py-3 rounded-xl text-xs font-bold text-center transition shadow-sm ${canRedeem ? "bg-[#173d2b] text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                      {canRedeem ? "Tukar Poin Sekarang" : "Poin Belum Cukup"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}