import HeritageHero from "@/components/heritage/HeritageHero";
import HeritageSearch from "@/components/heritage/HeritageSearch";
import HeritageGrid from "@/components/heritage/HeritageGrid";
import Footer from "@/components/layout/Footer";

export default function HeritagePage() {
  const typedHeritage = [
    {
      id: "1",
      name: "Rumah Tjong A Fie",
      slug: "rumah-tjong-a-fie",
      description: "Bangunan bersejarah peninggalan Tjong A Fie yang menjadi salah satu ikon sejarah Kota Medan.",
      history: "Rumah Tjong A Fie merupakan salah satu bangunan bersejarah yang menggambarkan kehidupan masyarakat Medan pada masa lalu.",
      coverImage: "/assets/tjongafi/tjongafi.jpeg",
      address: "Jl. Jenderal Ahmad Yani No.105, Kesawan, Medan",
      images: [
        "/assets/tjongafi/halaman.jpeg",
        "/assets/tjongafi/ruangan.jpeg",
        "/assets/tjongafi/ruangtamu.jpeg"
      ],
      latitude: 3.5882,
      longitude: 98.6781,
      category: "SEJARAH" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Istana Maimun",
      slug: "istana-maimun",
      description: "Istana Kesultanan Deli yang menjadi salah satu landmark budaya dan sejarah Kota Medan.",
      history: "Istana Maimun merupakan peninggalan Kesultanan Deli dan menjadi salah satu destinasi wisata sejarah terkenal di Medan.",
      coverImage: "/assets/istanamaimun/cover1.jpg",
      address: "Jl. Brigjen Katamso No.66, Sukaraja, Medan",
      images: [
        "/assets/istanamaimun/cover.jpeg",
        "/assets/istanamaimun/cover2.jpeg"
      ],
      latitude: 3.5752,
      longitude: 98.6839,
      category: "ARSITEKTUR" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Rumah Tjong Yong Hian",
      slug: "rumah-tjong-yong-hian",
      description: "Salah satu bangunan bersejarah yang berkaitan dengan perkembangan Kota Medan pada masa kolonial.",
      history: "Rumah Tjong Yong Hian menjadi bagian dari sejarah perkembangan kawasan Kesawan dan perdagangan di Kota Medan.",
      coverImage: "/assets/Taman_Tjong_Yong_Hian_di_Medan.jpg",
      address: "Kesawan, Medan",
      latitude: 3.5901,
      longitude: 98.6785,
      images: [
        "/assets/Taman.jpg",
        "/assets/rumah2.jpeg"
      ],
      category: "SEJARAH" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      name: "Gedung London Sumatra (Lonsum)",
      slug: "gedung-london-sumatra",
      description: "Gedung bergaya kolonial Inggris abad ke-19 yang terkenal dengan lift kuno pertama di Medan.",
      history: "Gedung Kantor PT London Sumatra Indonesia Tbk ini dibangun pada tahun 1906 dan menjadi pusat perdagangan penting di era kolonial.",
      coverImage: "/assets/lonsum/cover.jpeg",
      address: "Jl. Jend. Ahmad Yani No.2, Kesawan, Medan",
      images: [
        "/assets/lonsum/detail1.jpeg",
        "/assets/lonsum/detail2.jpeg"
      ],
      latitude: 3.5915,
      longitude: 98.6772,
      category: "ARSITEKTUR" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "5",
      name: "Masjid Raya Al-Mashun",
      slug: "masjid-raya-al-mashun",
      description: "Masjid Raya Medan yang megah dengan arsitektur perpaduan gaya Maroko, Eropa, dan Melayu.",
      history: "Dibangun pada tahun 1906 oleh Sultan Ma'mun Al Rashid Perkasa Alam, masjid ini menjadi lambang keagungan Kesultanan Deli.",
      coverImage: "/assets/masjidraya/masjid.jpeg",
      address: "Jl. Sisingamangaraja No.74c, Mesjid, Medan",
      images: [
        "/assets/masjidraya/interior.jpeg",
        "/assets/masjidraya/halaman.jpeg"
      ],
      latitude: 3.5689,
      longitude: 98.6861,
      category: "ARSITEKTUR" as const, // Diubah ke kategori valid ("ARSITEKTUR" atau "SEJARAH")
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

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
                  Jelajahi Cagar Budaya Medan
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

      <Footer />
    </main>
  );
}