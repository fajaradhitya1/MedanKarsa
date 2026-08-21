import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

type Heritage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  history: string | null;
  coverImage: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  category:
    | "SEJARAH"
    | "BUDAYA"
    | "KULINER"
    | "SENI"
    | "ARSITEKTUR";
};

const categoryLabel: Record<Heritage["category"], string> = {
  SEJARAH: "Sejarah",
  BUDAYA: "Budaya",
  KULINER: "Kuliner",
  SENI: "Seni",
  ARSITEKTUR: "Arsitektur",
};

export default function HeritageCard({
  heritage,
}: {
  heritage: Heritage;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#e6dece] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/heritage/${heritage.slug}`}>
        <div className="relative h-60 overflow-hidden bg-[#e8e2d6]">
          {heritage.coverImage ? (
            <img
              src={heritage.coverImage}
              alt={heritage.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#858a83]">
              Belum ada gambar
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#173d2b] shadow">
            {categoryLabel[heritage.category]}
          </div>

          <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#173d2b] shadow transition group-hover:bg-[#e2b45e]">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="p-5">
          <h2 className="font-serif text-xl font-bold text-[#173d2b]">
            {heritage.name}
          </h2>

          {heritage.address && (
            <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#777d75]">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>{heritage.address}</span>
            </div>
          )}

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#777d75]">
            {heritage.description}
          </p>

          <div className="mt-5 border-t border-[#eee8dc] pt-4 text-xs font-bold text-[#21633f]">
            Lihat detail →
          </div>
        </div>
      </Link>
    </article>
  );
}