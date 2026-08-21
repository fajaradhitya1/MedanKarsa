"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPlace } from "./MedanMap";

const MedanMap = dynamic(() => import("./MedanMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#e9e2d2]">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#dcae59] border-t-transparent" />
        <p className="text-sm font-semibold text-[#173d2b]">Memuat peta Medan...</p>
      </div>
    </div>
  ),
});

interface ClientMapPreviewProps {
  places: MapPlace[];
}

export default function ClientMapPreview({ places }: ClientMapPreviewProps) {
  return (
    <div className="relative z-0 mt-6 h-[430px] overflow-hidden rounded-3xl border border-[#e2d8c5] shadow-sm">
      <div className="absolute inset-0 z-0">
        <MedanMap location={null} places={places} />
      </div>
    </div>
  );
}