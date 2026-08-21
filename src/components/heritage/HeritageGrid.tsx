"use client";

import { useEffect, useMemo, useState } from "react";
import HeritageCard from "./HeritageCard";

type Heritage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  history: string | null;
  coverImage: string | null; // Pastikan ini sesuai dengan schema database
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

export default function HeritageGrid({
  heritage,
}: {
  heritage: Heritage[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;

      setQuery(customEvent.detail);
    };

    const handleCategory = (event: Event) => {
      const customEvent = event as CustomEvent<string>;

      setCategory(customEvent.detail);
    };

    window.addEventListener(
      "heritage-search",
      handleSearch
    );

    window.addEventListener(
      "heritage-category",
      handleCategory
    );

    return () => {
      window.removeEventListener(
        "heritage-search",
        handleSearch
      );

      window.removeEventListener(
        "heritage-category",
        handleCategory
      );
    };
  }, []);

  const filteredHeritage = useMemo(() => {
    const keyword = query.toLowerCase().trim();

    return heritage.filter((item) => {
      const matchesCategory =
        category === "ALL" ||
        item.category === category;

      const searchableText = `
        ${item.name}
        ${item.slug}
        ${item.description}
        ${item.history ?? ""}
        ${item.address ?? ""}
        ${item.category}
      `.toLowerCase();

      const matchesSearch =
        !keyword ||
        searchableText.includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [heritage, query, category]);

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-[#a27731]">
            DESTINASI
          </p>

          <h2 className="mt-2 font-serif text-3xl font-bold">
            Heritage pilihan Medan
          </h2>
        </div>

        <span className="hidden text-sm text-[#777d75] sm:block">
          {filteredHeritage.length} destinasi
        </span>
      </div>

      {filteredHeritage.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHeritage.map((item) => (
            <HeritageCard
              key={item.id}
              heritage={item}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-[#e5ddcd] bg-white px-6 py-16 text-center">
          <div className="text-4xl">🔎</div>

          <h3 className="mt-4 font-serif text-2xl font-bold">
            Heritage tidak ditemukan
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777d75]">
            Coba gunakan kata kunci lain atau pilih
            kategori yang berbeda.
          </p>
        </div>
      )}
    </section>
  );
}