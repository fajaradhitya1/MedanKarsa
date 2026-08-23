"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  itemId: string;
  title: string;
  pointsRequired: number;
  totalPoints: number;
  type: string;
};

export default function RedeemButton({ itemId, title, pointsRequired, totalPoints, type }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const canRedeem = totalPoints >= pointsRequired;

  const handleRedeem = async () => {
    if (!canRedeem) return;

    if (!confirm(`Tukar ${pointsRequired} Poin untuk mendapatkan tiket "${title}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, title, pointsRequired, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menukar poin");

      alert(`Berhasil! E-tiket untuk ${title} telah diterbitkan.`);
      router.push(`/heritage/ticket/success?orderId=${data.orderId}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
      setLoading(false);
    }
  };

  return (
    <button
      disabled={!canRedeem || loading}
      onClick={handleRedeem}
      className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-sm ${
        canRedeem
          ? "bg-[#173d2b] text-white hover:bg-[#0f291d]"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      }`}
    >
      {loading ? "Memproses..." : canRedeem ? "Tukar Poin Sekarang" : "Poin Belum Cukup"}
    </button>
  );
}