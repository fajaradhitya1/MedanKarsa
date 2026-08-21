import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Compass } from "lucide-react";
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
  
  // Ambil coverImage dan array images dari database secara langsung
  const cover = heritage.coverImage ? [heritage.coverImage] : [];
  const dbImages = (heritage as any).images || [];
  
  // Gabungkan semua gambar
  const allImages = [...cover, ...dbImages].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#173d2b]">
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <Link href="/heritage" className="inline-flex items-center gap-2 text-sm font-semibold text-[#667068] hover:text-[#173d2b]">
          <ArrowLeft size={17} /> Kembali ke Heritage
        </Link>

        <section className="mt-7 overflow-hidden rounded-[30px] bg-white p-6 sm:p-10 shadow-sm">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="rounded-full bg-[#e2b45e] px-3 py-1.5 text-xs font-bold text-[#173d2b]">
                {heritage.category}
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold text-[#173d2b] sm:text-5xl">
                {heritage.name}
              </h1>
            </div>

            <Link
              href={`/heritage/${heritage.slug}/tour`}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#173d2b] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#0f291d]"
            >
              <Compass size={18} className="text-[#f1c76e]" /> Mulai Tur Virtual 360°
            </Link>
          </div>

          {/* TAMPILKAN 360 PANORAMA ATAU CAROUSEL */}
          {panoramaScenes.length > 0 ? (
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#173d2b]">
                  ✨ Pratinjau Tur Virtual {heritage.name}
                </h3>
                <span className="text-xs text-[#697067]">Geser foto atau klik hotspot untuk navigasi</span>
              </div>
              <HeritagePanorama scenes={panoramaScenes} defaultSceneId={panoramaScenes[0].id} />
            </div>
          ) : (
            <div className="mb-10">
              <HeritageImageCarousel images={allImages} name={heritage.name} />
            </div>
          )}

          {/* Deskripsi & Informasi */}
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <article>
              <h2 className="font-serif text-2xl font-bold">Tentang Tempat Ini</h2>
              <p className="mt-4 text-sm leading-8 text-[#697067]">{heritage.description}</p>

              {heritage.history && (
                <>
                  <h2 className="mt-10 font-serif text-2xl font-bold">Sejarah</h2>
                  <p className="mt-4 text-sm leading-8 text-[#697067]">{heritage.history}</p>
                </>
              )}
            </article>

            <aside className="h-fit rounded-2xl bg-[#f5f0e6] p-5">
              <h3 className="font-serif text-xl font-bold">Informasi</h3>
              <div className="mt-5 space-y-4">
                {heritage.address && (
                  <div className="flex gap-3">
                    <MapPin className="shrink-0 text-[#21633f]" size={19} />
                    <div>
                      <p className="text-xs text-[#888d86]">Lokasi</p>
                      <p className="mt-1 text-sm font-semibold">{heritage.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}