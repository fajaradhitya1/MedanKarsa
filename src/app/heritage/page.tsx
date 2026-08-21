import HeritageHero from "@/components/heritage/HeritageHero";
import HeritageSearch from "@/components/heritage/HeritageSearch";
import HeritageGrid from "@/components/heritage/HeritageGrid";
import Footer from "@/components/layout/Footer"; // 1. Import Footer yang sudah Anda buat

import { prisma } from "@/lib/prisma";

export default async function HeritagePage() {
  const heritage = await prisma.heritage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const typedHeritage = heritage.map((item) => ({
    ...item,
    category: item.category as "SEJARAH" | "BUDAYA" | "KULINER" | "SENI" | "ARSITEKTUR",
  }));

  return (
    <main className="min-h-screen bg-[#ffff] text-[#173d2b] flex flex-col justify-between">
      <div>
        <HeritageHero />

        <div className="mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8">
          <div className="mb-14">
            <HeritageSearch />
          </div>

          <section>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#173d2b]/10 pb-4">
              <div>
                <span className="text-xs font-bold tracking-[0.25em] text-[#b8860b] uppercase">
                  Eksplorasi Warisan
                </span>
                <h2 className="text-3xl font-serif font-bold text-[#173d2b] mt-1">
                  Jelajah Cagar Budaya Medan
                </h2>
              </div>
              <p className="text-sm text-[#173d2b]/70 mt-2 sm:mt-0 font-sans">
                Menampilkan {typedHeritage.length} destinasi bersejarah pilihan
              </p>
            </div>

            <HeritageGrid heritage={typedHeritage} />
          </section>
        </div>
      </div>

      {/* 2. Pasang Footer di sini tanpa mengubah desain aslinya */}
      <Footer />
    </main>
  );
}