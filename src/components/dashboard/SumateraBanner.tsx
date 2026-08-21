export default function SumateraBanner() {
  return (
    <section className="mt-20">
      <div className="relative overflow-hidden rounded-[36px] bg-[#173d2b] px-6 py-16 text-center sm:px-12 lg:px-20 text-white border border-[#0f291d] shadow-md">
        
        {/* Latar Belakang Alam */}
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[.3em] text-[#dcae59]">KOLABORASI BERKELANJUTAN</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
            Sumatera Utara <br />
            Menanti Langkah Kita
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80 font-sans sm:text-base">
            Bersama membangun ekosistem yang lebih baik untuk generasi masa depan melalui gerakan kolektif, inklusif, dan inovatif.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white/10 px-5 py-2 text-xs font-bold backdrop-blur-md border border-white/15">🌱 Kolaboratif</span>
            <span className="rounded-full bg-white/10 px-5 py-2 text-xs font-bold backdrop-blur-md border border-white/15">♻️ Berkelanjutan</span>
            <span className="rounded-full bg-white/10 px-5 py-2 text-xs font-bold backdrop-blur-md border border-white/15">🤝 Inklusif</span>
            <span className="rounded-full bg-white/10 px-5 py-2 text-xs font-bold backdrop-blur-md border border-white/15">💡 Inovatif</span>
          </div>
        </div>

      </div>
    </section>
  );
}