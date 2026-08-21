import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventRecommendation() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED", endAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
  });

  // Fungsi pengelompokan event berdasarkan tanggal
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = new Date(event.startAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  return (
    <section className="mt-20">
      
      {/* Header Section */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-bold tracking-[.25em] text-[#a27731]">INFORMASI TERBARU</p>
          <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#173d2b]">
            Event & Kegiatan
          </h2>
        </div>

        <Link
          href="/event"
          className="flex items-center gap-1.5 text-sm font-bold text-[#173d2b] transition hover:text-[#21633f]"
        >
          Lebih Banyak Event <ArrowRight size={16} />
        </Link>
      </div>

      {/* Layout Utama: Kiri Banner Ilustrasi Animasi, Kanan List Event */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        
        {/* Kolom Kiri: Banner Ilustrasi dengan Animasi Gerak/Melayang */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#173d2b] p-8 text-white h-[420px] flex flex-col justify-between border border-[#0f291d] shadow-lg">
          
          {/* Latar Belakang Dekoratif */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center pointer-events-none" />

          {/* ILUSTRASI KOMPUTER DENGAN ANIMASI GERAK (FLOATING) */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <img 
              src="https://img.freepik.com/free-vector/retro-computer-concept-illustration_114360-12345.jpg" 
              alt="Event 2 Go Illustration"
              className="w-64 h-64 object-contain animate-[bounce_4s_ease-in-out_infinite]"
            />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-[#dcae59] px-3.5 py-1 text-xs font-bold text-[#173d2b]">
              <Flame size={14} /> Event2Go
            </span>
            <Sparkles className="text-[#dcae59]" size={20} />
          </div>

          <div className="relative z-10 mt-auto">
            <div className="inline-block rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/15">
              <h3 className="font-serif text-2xl font-bold">Event2Go This Week</h3>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: List Event Terkelompok Berdasarkan Tanggal */}
        <div className="relative flex flex-col gap-8">
          {events.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#e2d8c5] bg-white p-8 text-center text-sm text-[#777d75]">
              Belum ada event yang dipublikasikan saat ini.
            </div>
          ) : (
            Object.entries(groupedEvents).map(([dateKey, eventsList]) => {
              const date = new Date(dateKey);
              const monthShort = date.toLocaleDateString("id-ID", { month: "short" }).toUpperCase();
              const dayNumber = date.getDate();
              const dayName = date.toLocaleDateString("id-ID", { weekday: "short" }).toUpperCase();

              return (
                <div key={dateKey} className="relative flex gap-6">
                  
                  {/* Sisi Kiri: Box Tanggal & Garis Penghubung Timeline */}
                  <div className="relative flex flex-col items-center">
                    <div className="sticky top-20 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white border border-[#e2d8c5] shadow-xs text-[#173d2b] font-serif z-20">
                      <span className="text-[9px] font-bold text-[#a27731]">{monthShort}</span>
                      <span className="text-xl font-bold leading-tight">{dayNumber}</span>
                      <span className="text-[9px] font-bold text-[#697067]">{dayName}</span>
                    </div>
                    {/* Garis Vertikal Timeline */}
                    <div className="absolute top-16 bottom-[-32px] w-[2px] bg-[#e2d8c5] z-10" />
                  </div>

                  {/* Sisi Kanan: Kumpulan Event di Tanggal Tersebut */}
                  <div className="flex-1 flex flex-col gap-4">
                    {eventsList.map((event) => (
                      <Link
                        key={event.id}
                        href={`/event/${event.slug}`}
                        className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-[#e2d8c5] hover:border-[#dcae59] transition shadow-xs"
                      >
                        <div className="pr-4">
                          <h4 className="font-serif text-base font-bold text-[#173d2b] group-hover:text-[#a27731] transition line-clamp-1">
                            {event.title}
                          </h4>
                          <p className="text-xs text-[#697067] font-sans mt-1">
                            {event.location}
                          </p>
                        </div>
                        
                        {/* Gambar Thumbnail Aman dari String Kosong */}
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-24 h-14 object-cover rounded-xl shrink-0 border border-[#e2d8c5] transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-24 h-14 rounded-xl bg-[#173d2b] text-[#dcae59] flex items-center justify-center font-serif text-[10px] shrink-0">
                            MedanKarsa
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}