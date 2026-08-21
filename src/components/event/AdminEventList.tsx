"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, MapPin, Calendar, User } from "lucide-react";
// Import server action yang sudah kita buat
import { handleApproveEvent } from "@/actions/eventActions"; 

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startAt: string;
  endAt: string;
  status: string;
  submittedBy: { name: string; email: string } | null;
}

export default function AdminEventList({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (eventId: string, action: "PUBLISHED" | "REJECTED") => {
    setLoadingId(eventId);
    try {
      if (action === "PUBLISHED") {
        // Panggil fungsi Server Action yang sudah kita buat (Notifikasi + Email)
        const result = await handleApproveEvent(eventId);
        if (result.success) {
          router.refresh();
        } else {
          alert("Gagal menyetujui event.");
        }
      } else {
        // Untuk REJECTED, tetap gunakan fetch biasa atau buat action terpisah
        const res = await fetch("/api/admin/events", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: eventId, status: "REJECTED" }),
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Terjadi kesalahan saat menolak event.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menghubungi server.");
    } finally {
      setLoadingId(null);
    }
  };

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8cfbe] bg-white py-16 text-center">
        <p className="text-[#697067]">Tidak ada pengajuan event saat ini.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {events.map((event) => (
        <div key={event.id} className="rounded-2xl bg-white p-6 shadow-sm border border-[#e8dfcf] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-xl font-bold text-[#173d2b]">{event.title}</h3>
              <span className="bg-[#f2eadb] text-[#a27731] text-xs font-bold px-3 py-1 rounded-full">
                {event.category}
              </span>
            </div>
            
            <p className="text-sm text-[#697067] mb-5 line-clamp-3">
              {event.description}
            </p>

            <div className="space-y-2 text-sm text-[#173d2b] mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#a27731]" />
                <span>{new Date(event.startAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#a27731]" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#f2eadb]">
                <User size={16} className="text-[#8b9189]" />
                <div>
                  <p className="font-semibold text-xs text-[#8b9189]">DIAJUKAN OLEH:</p>
                  <p>{event.submittedBy?.name} <span className="text-[#8b9189]">({event.submittedBy?.email})</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => handleAction(event.id, "REJECTED")}
              disabled={loadingId === event.id}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <X size={16} /> Tolak
            </button>
            <button
              onClick={() => handleAction(event.id, "PUBLISHED")}
              disabled={loadingId === event.id}
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