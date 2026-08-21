import { Trophy } from "lucide-react";

const history = [
  ["Scan Heritage - Istana Maimun", "+20"],
  ["Pembelian UMKM - Kopi Tiam", "+30"],
  ["Hadiri Event - Heritage Night", "+50"],
  ["Laporan Kondisi Jalan", "+30"],
];

export default function KarsaPointCard() {
  return (
    <section className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      {/* POINT */}
      <div className="overflow-hidden rounded-3xl bg-[#e4b75d]">
        <div className="flex h-full flex-col justify-between p-7 sm:p-10">
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-[#76551d]">
              DOMPET KARSA
            </p>

            <h2 className="mt-3 font-serif text-5xl font-bold text-[#173d2b]">
              2.450
            </h2>

            <p className="mt-1 text-sm font-medium text-[#59451e]">
              Karsa Point
            </p>
          </div>

          <div className="mt-12 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#59451e]">
                Level
              </p>

              <p className="font-bold text-[#173d2b]">
                Explorer
              </p>
            </div>

            <a
              href="/wallet"
              className="rounded-xl bg-[#173d2b] px-5 py-3 text-xs font-bold text-white"
            >
              Tukar Reward
            </a>
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <div className="rounded-3xl border border-[#e5dccb] bg-white p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[.15em] text-[#8b6b36]">
              RIWAYAT POIN
            </p>

            <h3 className="mt-1 font-serif text-2xl font-bold">
              Aktivitas Terbaru
            </h3>
          </div>

          <Trophy
            size={25}
            className="text-[#c08b2d]"
          />
        </div>

        <div className="mt-5 space-y-4">
          {history.map(([title, point]) => (
            <div
              key={title}
              className="flex items-center justify-between border-b border-[#eee9df] pb-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e8cd]">
                  <Trophy size={15} />
                </div>

                <span className="text-xs font-medium">
                  {title}
                </span>
              </div>

              <span className="text-xs font-bold text-[#29804d]">
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}