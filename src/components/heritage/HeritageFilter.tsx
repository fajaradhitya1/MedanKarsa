"use client";

import { useEffect, useState } from "react";

const categories = [
  {
    value: "ALL",
    label: "Semua",
  },
  {
    value: "SEJARAH",
    label: "Sejarah",
  },
  {
    value: "BUDAYA",
    label: "Budaya",
  },
  {
    value: "KULINER",
    label: "Kuliner",
  },
  {
    value: "SENI",
    label: "Seni",
  },
  {
    value: "ARSITEKTUR",
    label: "Arsitektur",
  },
];

export default function HeritageFilter() {
  const [active, setActive] = useState("ALL");

  useEffect(() => {
    const event = new CustomEvent("heritage-category", {
      detail: active,
    });

    window.dispatchEvent(event);
  }, [active]);

  return (
    <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = active === category.value;

        return (
          <button
            key={category.value}
            onClick={() => setActive(category.value)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition ${
              isActive
                ? "bg-[#173d2b] text-white shadow-md"
                : "border border-[#dfd7c8] bg-white text-[#697067] hover:bg-[#eee9df]"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}