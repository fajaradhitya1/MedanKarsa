import { Landmark } from "lucide-react";

export default function HeritageHero() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#f8f3e8] text-[#173d2b] shadow-sm border border-[#173d2b]/10">
        
        {/* BACKGROUND VIDEO YANG DIOPTIMALKAN (Opasitas ringan & tanpa event berat) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover opacity-75"
          >
            <source src="/assets/video/highlightheritage.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Overlay gradien terang */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f3e8] via-[#f8f3e8]/80 to-transparent" />
        </div>

        {/* DEKORASI CAHAYA */}
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#dcae59]/20 blur-3xl z-0" />

        {/* KONTEN HERO */}
        <div className="relative z-10 mx-auto px-8 py-16 sm:px-12 lg:py-20">
          <div className="relative max-w-3xl">

            {/* ICON */}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e2b45e] text-[#173d2b] shadow-sm">
              <Landmark size={23} />
            </div>

            {/* LABEL */}
            <p className="text-xs font-bold tracking-[.25em] text-[#b8860b]">
              MEDAN HERITAGE
            </p>

            {/* TITLE */}
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-[#173d2b] sm:text-4xl lg:text-5xl">
              Temukan cerita
              <br />
              di balik kota Medan.
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#173d2b]/80 sm:text-base font-sans">
              Jelajahi tempat bersejarah, budaya, seni, kuliner, dan arsitektur yang menjadi bagian dari identitas Kota Medan.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}