import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Compass, Ticket, Building2, History, Sparkles, Clock, Share2, Camera, Users, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HeritagePanorama, { PanoramaScene } from "@/components/heritage/HeritagePanorama";
import HeritageImageCarousel from "@/components/heritage/HeritageImageCarousel";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HeritageDetailPage({ params }: Props) {
  const { slug } = await params;

  const heritage = await prisma.heritage.findUnique({
    where: { slug },
  });

  if (!heritage) {
    notFound();
  }

  const panoramaScenes = ((heritage as any).panoramaScenes as PanoramaScene[]) || [];
  
  const cover = heritage.coverImage ? [heritage.coverImage] : [];
  const dbImages = (heritage as any).images || [];
  const allImages = [...cover, ...dbImages].filter(Boolean);
  const mainImage = allImages[0] || "/images/placeholder.jpg";

  return (
    <main className="min-h-screen bg-[#f7f1e5] text-[#173d2b] pb-20">
      {/* Ambient heritage pattern / page frame */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#d6b15f]/10 blur-3xl" />
        <div className="absolute -right-24 top-[28rem] h-96 w-96 rounded-full bg-[#0b5941]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-10">
        {/* Modern heritage navigation */}
        <header className="mb-5 rounded-[24px] border border-[#e8dfce] bg-[#fffdf8]/90 px-4 py-3 shadow-[0_10px_35px_rgba(23,61,43,0.06)] backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0b5941] text-[#f4c65f] shadow-md">
                <Building2 size={21} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-xl font-bold tracking-tight text-[#0b5941]">MedanKarsa</p>
                <p className="hidden text-[10px] font-medium tracking-wide text-[#7a817a] sm:block">Merawat Warisan, Menyatukan Medan</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              <Link href="/" className="text-sm font-medium text-[#667068] transition hover:text-[#0b5941]">Beranda</Link>
              <Link href="/heritage" className="text-sm font-semibold text-[#0b5941]">Heritage</Link>
              <span className="h-5 w-px bg-[#e5ddcf]" />
              <span className="text-sm text-[#667068]">Destinasi</span>
              <span className="text-sm text-[#667068]">Event</span>
              <span className="text-sm text-[#667068]">Tentang Kami</span>
            </nav>

            <Link
              href={`/heritage/${heritage.slug}/book`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0b5941] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#0b5941]/15 transition hover:-translate-y-0.5 hover:bg-[#084732] sm:px-5"
            >
              <Ticket size={16} className="text-[#f4c65f]" />
              <span className="hidden sm:inline">Beli Tiket</span>
              <span className="sm:hidden">Tiket</span>
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 px-1 text-xs font-semibold text-[#778078]">
          <Link href="/" className="transition hover:text-[#0b5941]">Beranda</Link>
          <span>/</span>
          <Link href="/heritage" className="transition hover:text-[#0b5941]">Heritage</Link>
          <span>/</span>
          <span className="truncate text-[#173d2b]">{heritage.name}</span>
        </div>

        {/* HERO — same data / actions, redesigned only */}
        <section className="relative mb-8 min-h-[520px] overflow-hidden rounded-[34px] bg-[#0b5941] shadow-[0_24px_70px_rgba(23,61,43,0.18)]">
          <img
            src={mainImage}
            alt={heritage.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062f22]/95 via-[#0b5941]/75 to-[#0b5941]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/heritage"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white backdrop-blur transition hover:bg-white/15"
                  aria-label="Kembali ke Heritage"
                >
                  <ArrowLeft size={17} />
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f4c65f]/60 bg-[#0b5941]/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#f4c65f] backdrop-blur">
                  <Sparkles size={13} />
                  {heritage.category || "SEJARAH"}
                </span>
              </div>

              <span className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-medium text-white/80 backdrop-blur md:inline-flex">
                Warisan Kota Medan
              </span>
            </div>

            <div className="max-w-[650px] space-y-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#f4c65f]">
                  Mengenal lebih dekat
                </p>
                <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-[-0.035em] text-white drop-shadow-xl sm:text-6xl lg:text-7xl">
                  {heritage.name}
                </h1>
                <div className="mt-5 h-px w-28 bg-[#f4c65f]" />
              </div>

              <p className="max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                {heritage.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={`/heritage/${heritage.slug}/tour`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#f4c65f] bg-[#0b5941] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#084732]"
                >
                  <Compass size={18} className="text-[#f4c65f]" />
                  Tur 360°
                </Link>

                <Link
                  href={`/heritage/${heritage.slug}/book`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f4c65f] px-5 py-3 text-sm font-bold text-[#173d2b] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e7b74d]"
                >
                  <Ticket size={18} />
                  Beli Tiket Masuk
                </Link>
              </div>
            </div>

            {/* Hero gallery indicator — uses the same existing image collection */}
            <div className="mt-8 flex items-end justify-between gap-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-9 rounded-full bg-[#f4c65f]" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
              </div>
              <span className="hidden text-xs font-medium text-white/70 sm:block">
                Jelajahi warisan arsitektur Medan
              </span>
            </div>
          </div>
        </section>

        {/* PRATINJAU PANORAMA / CAROUSEL — behavior untouched */}
        <section className="mb-10">
          {panoramaScenes.length > 0 ? (
            <div className="overflow-hidden rounded-[30px] border border-[#e8dfce] bg-[#fffdf8] p-5 shadow-[0_14px_45px_rgba(23,61,43,0.07)] sm:p-7">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">Virtual experience</p>
                  <h3 className="font-serif text-2xl font-bold text-[#0b5941] sm:text-3xl">
                    Pratinjau Tur Virtual
                  </h3>
                </div>
                <span className="text-xs leading-5 text-[#697067]">
                  Geser foto atau klik hotspot untuk navigasi
                </span>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-[#eee6d8]">
                <HeritagePanorama scenes={panoramaScenes} defaultSceneId={panoramaScenes[0].id} />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[30px] border border-[#e8dfce] bg-[#fffdf8] p-3 shadow-[0_14px_45px_rgba(23,61,43,0.07)] sm:p-5">
              <HeritageImageCarousel images={allImages} name={heritage.name} />
            </div>
          )}
        </section>

        {/* CONTENT + PRACTICAL SIDEBAR */}
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_350px]">
          <article className="space-y-7">
            <section className="rounded-[30px] border border-[#e8dfce] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(23,61,43,0.05)] sm:p-9">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9f0e7] text-[#0b5941]">
                  <Building2 size={21} />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">Tentang</p>
                  <h2 className="font-serif text-2xl font-bold text-[#0b5941] sm:text-3xl">Tentang Tempat Ini</h2>
                </div>
              </div>
              <p className="max-w-4xl text-sm leading-8 text-[#697067] sm:text-base">
                {heritage.description}
              </p>
            </section>

            {heritage.history && (
              <section className="rounded-[30px] border border-[#e8dfce] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(23,61,43,0.05)] sm:p-9">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5ead1] text-[#b8860b]">
                    <History size={21} />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">Latar Belakang Waktu</p>
                    <h2 className="font-serif text-2xl font-bold text-[#0b5941] sm:text-3xl">Sejarah</h2>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                  <div className="hidden md:block">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d6e4d7] bg-[#e9f0e7] text-[#0b5941]">
                      <History size={22} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm leading-8 text-[#697067] sm:text-base">
                      {heritage.history}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe8dd] bg-[#f5f8f2] px-3.5 py-2 text-xs font-semibold text-[#173d2b]">
                        <CheckCircle2 size={14} className="text-[#b8860b]" /> Warisan Budaya
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe8dd] bg-[#f5f8f2] px-3.5 py-2 text-xs font-semibold text-[#173d2b]">
                        <CheckCircle2 size={14} className="text-[#b8860b]" /> Nilai Sejarah Tinggi
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe8dd] bg-[#f5f8f2] px-3.5 py-2 text-xs font-semibold text-[#173d2b]">
                        <CheckCircle2 size={14} className="text-[#b8860b]" /> Ikon Kota Medan
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-[30px] border border-[#e8dfce] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(23,61,43,0.05)] sm:p-9">
              <div className="mb-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">Yang akan kamu temukan</p>
                <h3 className="font-serif text-2xl font-bold text-[#0b5941] sm:text-3xl">Fasilitas & Sorotan</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="group rounded-[22px] border border-[#ebe4d7] bg-[#faf7ef] p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0b5941] shadow-sm">
                    <Building2 size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-[#173d2b]">Bangunan Asli Terawat</h4>
                  <p className="mt-2 text-xs leading-6 text-[#747a73]">Arsitektur klasik khas Tionghoa yang masih terjaga keasliannya.</p>
                </div>

                <div className="group rounded-[22px] border border-[#ebe4d7] bg-[#faf7ef] p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0b5941] shadow-sm">
                    <History size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-[#173d2b]">Edukasi Sejarah</h4>
                  <p className="mt-2 text-xs leading-6 text-[#747a73]">Tempat belajar langsung tentang sejarah peradaban multikultural di Medan.</p>
                </div>

                <div className="group rounded-[22px] border border-[#ebe4d7] bg-[#faf7ef] p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0b5941] shadow-sm">
                    <Camera size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-[#173d2b]">Spot Foto Instagramable</h4>
                  <p className="mt-2 text-xs leading-6 text-[#747a73]">Banyak sudut menarik bernuansa vintage dan estetik untuk diabadikan.</p>
                </div>

                <div className="group rounded-[22px] border border-[#ebe4d7] bg-[#faf7ef] p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0b5941] shadow-sm">
                    <Users size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-[#173d2b]">Ramah Pengunjung</h4>
                  <p className="mt-2 text-xs leading-6 text-[#747a73]">Cocok dikunjungi bersama keluarga, pelajar, maupun wisatawan umum.</p>
                </div>
              </div>
            </section>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
            <section className="rounded-[30px] border border-[#e8dfce] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(23,61,43,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9f0e7] text-[#0b5941]">
                  <MapPin size={19} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">Info</p>
                  <h3 className="font-serif text-xl font-bold text-[#0b5941]">Informasi Praktis</h3>
                </div>
              </div>

              <div className="divide-y divide-[#eee7da] rounded-2xl border border-[#eee7da] bg-[#faf7ef]">
                {heritage.address && (
                  <div className="flex gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b5941] shadow-sm">
                      <MapPin size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#969c95]">Lokasi</p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-[#173d2b]">{heritage.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b5941] shadow-sm">
                    <Clock size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#969c95]">Jam Operasional</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#173d2b]">Setiap Hari<br />08.00 – 17.00 WIB</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b5941] shadow-sm">
                    <Sparkles size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#969c95]">Kategori</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#173d2b]">{heritage.category || "Heritage • Sejarah"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[30px] bg-[#0b5941] p-6 text-white shadow-[0_18px_45px_rgba(11,89,65,0.2)]">
              <div className="absolute -right-8 -bottom-10 opacity-[0.08]">
                <Building2 size={180} />
              </div>
              <div className="relative z-10">
                <span className="inline-flex rounded-full bg-[#f4c65f] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#173d2b]">
                  Tiket Masuk Resmi
                </span>
                <p className="mt-4 font-serif text-3xl font-bold">
                  Rp 15.000 <span className="font-sans text-xs font-normal text-white/60">/ orang</span>
                </p>
                <p className="mt-2 text-xs leading-6 text-white/70">
                  Tiket berlaku untuk 1 hari kunjungan dengan sistem verifikasi QR Code instan.
                </p>

                <Link
                  href={`/heritage/${heritage.slug}/book`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#f4c65f] py-3.5 text-sm font-bold text-[#173d2b] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e7b74d]"
                >
                  <Ticket size={16} />
                  Pesan Tiket Sekarang
                </Link>

                <div className="mt-4 flex items-center justify-center gap-4 border-t border-white/10 pt-4 text-[11px] text-white/65">
                  <span>✨ Aman</span>
                  <span>⚡ Cepat</span>
                  <span>🛡️ Resmi</span>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#e8dfce] bg-[#fffdf8] p-6 text-center shadow-[0_12px_40px_rgba(23,61,43,0.05)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a9189]">Bagikan Halaman Ini</p>
              <div className="mt-4 flex justify-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f0e7] text-[#0b5941]">
                  <Share2 size={17} />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}