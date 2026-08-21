import Link from "next/link";
import { CalendarDays, Plus, Sparkles, PartyPopper } from "lucide-react";

export default function EventHero() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#173d2b] via-[#245940] to-[#122e20] text-white shadow-lg border border-[#e2b45e]/30">
        
        {/* BACKGROUND FOTO DENGAN EFEK MERIAH & WARNA CERAH */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop')` }}
          />
          {/* Efek Gradien Cahaya Meriah (Warm Gold & Sunset Glow) */}
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[#dcae59]/30 blur-3xl z-0 animate-pulse" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#ff7b54]/20 blur-3xl z-0" />
        </div>

        {/* KONTEN HERO DENGAN NUANSA FESTIVAL */}
        <div className="relative z-10 mx-auto px-8 py-16 sm:px-14 lg:py-22 max-w-7xl">
          <div className="max-w-3xl">
            
            {/* Badge Ceria */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e2b45e] px-4 py-1.5 text-xs font-extrabold text-[#173d2b] shadow-md mb-6 transform -rotate-1">
              <PartyPopper size={15} /> FESTIVAL & ACARA KOTA MEDAN <Sparkles size={14} />
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl tracking-tight drop-shadow-sm">
              Temukan event <br />
              <span className="text-[#fce38a] underline decoration-[#e2b45e] decoration-wavy decoration-2">
                paling seru
              </span> di Medan!
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg font-sans">
              Dari pameran seni meriah, festival kuliner legendaris, hingga panggung musik komunitas. Jangan lewatkan keseruannya!
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/event/ajukan"
                className="flex items-center gap-2 rounded-2xl bg-[#e2b45e] px-7 py-4 text-sm font-bold text-[#173d2b] shadow-lg transition hover:bg-[#f0c975] hover:scale-105 active:scale-95"
              >
                <Plus size={18} className="stroke-[3]" />
                Ajukan Event Kamu
              </Link>
              
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white font-sans">
                <span className="flex h-3 w-3 rounded-full bg-green-400 animate-ping" />
                <span>Banyak acara seru minggu ini!</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}