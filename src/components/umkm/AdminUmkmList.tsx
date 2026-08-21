"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, MapPin, Store, Tag, User } from "lucide-react";

interface UmkmItem {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string | null;
  status: string;
  user: { name: string | null; email: string | null } | null;
}

export default function AdminUmkmList({ umkms }: { umkms: UmkmItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (umkmId: string, action: "APPROVED" | "REJECTED") => {
    setLoadingId(umkmId);
    try {
      const res = await fetch("/api/admin/umkm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: umkmId, status: action }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Terjadi kesalahan saat memproses UMKM.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menghubungi server.");
    } finally {
      setLoadingId(null);
    }
  };

  if (umkms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8cfbe] bg-white py-16 text-center">
        <p className="text-[#697067]">Tidak ada pengajuan UMKM baru saat ini.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {umkms.map((umkm) => (
        <div key={umkm.id} className="rounded-3xl bg-white p-6 shadow-sm border border-[#e8dfcf] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-serif text-xl font-bold text-[#173d2b]">{umkm.name}</h3>
              <span className="bg-[#f2eadb] text-[#a27731] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={12} /> {umkm.category}
              </span>
            </div>

            <p className="text-sm text-[#697067] mb-4 line-clamp-3">
              {umkm.description}
            </p>

            <div className="space-y-2 text-sm text-[#173d2b] mb-6">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#a27731] shrink-0 mt-0.5" />
                <span>{umkm.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#f2eadb]">
                <User size={16} className="text-[#8b9189]" />
                <div>
                  <p className="font-semibold text-[10px] text-[#8b9189]">DIAJUKAN OLEH:</p>
                  <p className="text-xs">{umkm.user?.name} <span className="text-[#8b9189]">({umkm.user?.email})</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => handleAction(umkm.id, "REJECTED")}
              disabled={loadingId === umkm.id}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <X size={16} /> Tolak
            </button>
            <button
              onClick={() => handleAction(umkm.id, "APPROVED")}
              disabled={loadingId === umkm.id}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#173d2b] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f291d] disabled:opacity-50"
            >
              <Check size={16} /> Setujui
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}