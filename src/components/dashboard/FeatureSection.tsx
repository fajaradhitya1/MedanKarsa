import { Bot, CloudSun, Medal, ScanLine, Siren } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Heritage Guide",
    text: "Penjelasan sejarah interaktif di setiap titik heritage.",
  },
  {
    icon: ScanLine,
    title: "Heritage 360°",
    text: "Jelajahi tempat bersejarah secara virtual.",
  },
  {
    icon: Siren,
    title: "AI Report Assistant",
    text: "Analisis laporan dan tentukan tingkat prioritas.",
  },
  {
    icon: CloudSun,
    title: "Medan Siaga",
    text: "Informasi kondisi cuaca, banjir, dan keramaian.",
  },
  {
    icon: Medal,
    title: "Karsa Mission",
    text: "Selesaikan misi, dapat poin, dan dukung kota.",
  },
];

export default function FeatureSection() {
  return (
    <section className="mt-20">
      <div className="rounded-[36px] bg-[#fdfbf7] p-8 sm:p-12 border border-[#e2d8c5]">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs font-bold tracking-[.25em] text-[#8b6b36]">
            EKOSISTEM DIGITAL
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#173d2b] sm:text-4xl">
            Fitur Unggulan MedanKarsa
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-[#e8dfcf]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f1e3] text-[#21633f] transition group-hover:bg-[#173d2b] group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 font-serif text-base font-bold text-[#173d2b]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-[#697067]">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}