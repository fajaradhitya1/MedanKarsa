"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

type Props = {
  itemId: string;
  title: string;
  pointsRequired: number;
  totalPoints: number;
  type: string;
};

export default function RedeemButton({ itemId, title, pointsRequired, totalPoints, type }: Props) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");
  const router = useRouter();

  const canRedeem = totalPoints >= pointsRequired;

  const handleExecuteRedeem = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, title, pointsRequired, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menukar poin");

      setLoading(false);
      setShowConfirmModal(false);
      setSuccessOrderId(data.orderId);
      setShowSuccessModal(true); // Tampilkan modal sukses kustom
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <button
        disabled={!canRedeem}
        onClick={() => setShowConfirmModal(true)}
        className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-sm ${
          canRedeem
            ? "bg-[#173d2b] text-white hover:bg-[#0f291d]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {canRedeem ? "Tukar Poin Sekarang" : "Poin Belum Cukup"}
      </button>

      {/* 1. MODAL KONFIRMASI PENUKARAN */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <Gift size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#173d2b]">Konfirmasi Penukaran</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tukar <span className="font-bold text-[#b8860b]">{pointsRequired} Poin</span> untuk mendapatkan e-tiket <span className="font-semibold text-[#173d2b]">&quot;{title}&quot;</span>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={loading}
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                disabled={loading}
                onClick={handleExecuteRedeem}
                className="w-full py-3 rounded-xl bg-[#173d2b] text-xs font-bold text-white shadow-md hover:bg-[#0f291d] transition"
              >
                {loading ? "Memproses..." : "Ya, Tukar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL SUKSES PENUKARAN */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#173d2b]">Penukaran Berhasil!</h3>
              <p className="text-xs text-gray-500">Poin Anda telah berhasil dipotong dan e-tiket telah diterbitkan.</p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push(`/heritage/ticket/success?orderId=${successOrderId}`);
                router.refresh();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#173d2b] text-white text-xs font-bold tracking-wider uppercase shadow-md transition hover:bg-[#0f291d]"
            >
              Lihat E-Tiket Saya
            </button>
          </div>
        </div>
      )}
    </>
  );
}