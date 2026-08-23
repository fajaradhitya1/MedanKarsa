import { Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function KarsaPointCard() {
  let currentPoints = 0;
  let pointHistory: Array<{ description: string; amount: number }> = [];

  try {
    const session = await auth();
    
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          pointTransactions: {
            orderBy: { createdAt: "desc" },
            take: 4,
          },
        },
      });

      if (dbUser && dbUser.pointTransactions) {
        currentPoints = dbUser.pointTransactions.reduce((acc, tx) => acc + tx.amount, 0);
        pointHistory = dbUser.pointTransactions;
      }
    }
  } catch (err) {
    console.warn("Gagal mengambil data poin real-time.");
  }

  return (
    <section className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      {/* POINT CARD */}
      <div className="overflow-hidden rounded-3xl bg-[#e4b75d]">
        <div className="flex h-full flex-col justify-between p-7 sm:p-10">
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-[#76551d]">DOMPET KARSA</p>
            <h2 className="mt-3 font-serif text-5xl font-bold text-[#173d2b]">
              {currentPoints.toLocaleString("id-ID")}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#59451e]">Karsa Point</p>
          </div>

          <div className="mt-12 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#59451e]">Level</p>
              <p className="font-bold text-[#173d2b]">{currentPoints >= 1000 ? "Master Explorer 👑" : "Explorer 🌟"}</p>
            </div>
            <a href="/dompet-karsa" className="rounded-xl bg-[#173d2b] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#0f291d]">
              Tukar Reward
            </a>
          </div>
        </div>
      </div>

      {/* HISTORY CARD */}
      <div className="rounded-3xl border border-[#e5dccb] bg-white p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[.15em] text-[#8b6b36]">RIWAYAT POIN</p>
            <h3 className="mt-1 font-serif text-2xl font-bold">Aktivitas Terbaru</h3>
          </div>
          <Trophy size={25} className="text-[#c08b2d]" />
        </div>

        <div className="mt-5 space-y-4">
          {pointHistory.length > 0 ? (
            pointHistory.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-[#eee9df] pb-3 last:border-none">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e8cd]">
                    <Trophy size={15} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{tx.description}</span>
                </div>
                <span className={`text-xs font-bold ${tx.amount > 0 ? "text-[#29804d]" : "text-amber-600"}`}>
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">Belum ada aktivitas poin tercatat.</p>
          )}
        </div>
      </div>
    </section>
  );
}