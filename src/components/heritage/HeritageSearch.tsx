"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeritageSearch() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const event = new CustomEvent("heritage-search", {
      detail: query,
    });

    window.dispatchEvent(event);
  }, [query]);

  return (
    <div className="relative z-20 mx-auto -mt-7 max-w-4xl">
      <div className="flex items-center gap-3 rounded-2xl border border-[#e5ddcd] bg-white p-3 shadow-xl">
        <Search
          size={20}
          className="ml-2 shrink-0 text-[#777d75]"
        />

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari heritage, sejarah, budaya..."
          className="w-full bg-transparent px-1 py-3 text-sm text-[#173d2b] outline-none placeholder:text-[#999d97]"
        />
      </div>
    </div>
  );
}