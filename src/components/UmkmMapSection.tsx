"use client";

import dynamic from "next/dynamic";

const UmkmMap = dynamic(() => import("@/components/umkm/UmkmMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-[420px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-gray-400">Memuat Peta Interaktif...</div>
});

export default function UmkmMapSection({ umkms }: { umkms: any[] }) {
  return <UmkmMap umkms={umkms} />;
}