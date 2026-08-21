"use client";

import dynamic from "next/dynamic";

const ClientLeafletMap = dynamic(() => import("./ClientLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full bg-[#eee8dc] animate-pulse rounded-2xl flex items-center justify-center text-xs text-[#697067]">
      Memuat Peta Interaktif UMKM...
    </div>
  ),
});

export default function UmkmMapWrapper({ umkms }: { umkms: any[] }) {
  return <ClientLeafletMap umkms={umkms} />;
}