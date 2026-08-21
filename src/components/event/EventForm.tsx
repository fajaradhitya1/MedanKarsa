"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Clock, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  "Budaya",
  "Seni",
  "Musik",
  "Kuliner",
  "Workshop",
  "Komunitas",
  "Olahraga",
  "Lainnya",
];

export default function EventForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    detailDescription: "",
    category: "Budaya",
    location: "",
    latitude: "3.5952",
    longitude: "98.6722",
    date: "",
    startTime: "",
    endTime: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengajukan event"
        );
      }

      router.push(
        "/event?submitted=true"
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* NAMA */}
      <div>
        <label className="mb-2 block text-sm font-bold text-[#26342b]">
          Nama Event
        </label>

        <input
          required
          value={form.title}
          onChange={(e) =>
            updateField("title", e.target.value)
          }
          placeholder="Contoh: Medan Heritage Night"
          className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3 outline-none transition focus:border-[#173d2b] focus:ring-2 focus:ring-[#173d2b]/10"
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="mb-2 block text-sm font-bold text-[#26342b]">
          Kategori
        </label>

        <select
          value={form.category}
          onChange={(e) =>
            updateField(
              "category",
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3 outline-none focus:border-[#173d2b]"
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* SHORT DESCRIPTION */}
      <div>
        <label className="mb-2 block text-sm font-bold text-[#26342b]">
          Deskripsi Singkat
        </label>

        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          placeholder="Jelaskan event secara singkat..."
          className="w-full resize-none rounded-2xl border border-[#ded5c5] bg-white px-4 py-3 outline-none focus:border-[#173d2b]"
        />
      </div>

      {/* DETAIL */}
      <div>
        <label className="mb-2 block text-sm font-bold text-[#26342b]">
          Deskripsi Detail
        </label>

        <textarea
          required
          rows={7}
          value={form.detailDescription}
          onChange={(e) =>
            updateField(
              "detailDescription",
              e.target.value
            )
          }
          placeholder="Tuliskan informasi lengkap mengenai event..."
          className="w-full resize-none rounded-2xl border border-[#ded5c5] bg-white px-4 py-3 outline-none focus:border-[#173d2b]"
        />
      </div>

      {/* LOCATION */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#26342b]">
          <MapPin size={16} />
          Lokasi
        </label>

        <input
          required
          value={form.location}
          onChange={(e) =>
            updateField(
              "location",
              e.target.value
            )
          }
          placeholder="Contoh: Kesawan, Kota Medan"
          className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3 outline-none focus:border-[#173d2b]"
        />
      </div>

      {/* COORDINATE */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold text-[#697067]">
            Latitude
          </label>

          <input
            value={form.latitude}
            onChange={(e) =>
              updateField(
                "latitude",
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[#697067]">
            Longitude
          </label>

          <input
            value={form.longitude}
            onChange={(e) =>
              updateField(
                "longitude",
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3"
          />
        </div>
      </div>

      {/* DATE */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#26342b]">
          <CalendarDays size={16} />
          Tanggal
        </label>

        <input
          required
          type="date"
          value={form.date}
          onChange={(e) =>
            updateField(
              "date",
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3"
        />
      </div>

      {/* TIME */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Clock size={16} />
            Jam Mulai
          </label>

          <input
            required
            type="time"
            value={form.startTime}
            onChange={(e) =>
              updateField(
                "startTime",
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Clock size={16} />
            Jam Selesai
          </label>

          <input
            required
            type="time"
            value={form.endTime}
            onChange={(e) =>
              updateField(
                "endTime",
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-[#ded5c5] bg-white px-4 py-3"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173d2b] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#21633f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Mengirim pengajuan...
          </>
        ) : (
          "Ajukan Event"
        )}
      </button>
    </form>
  );
}