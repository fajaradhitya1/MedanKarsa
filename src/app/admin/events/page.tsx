import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminEventList from "@/components/event/AdminEventList";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const events = await prisma.event.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      submittedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f3e8]">
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[.2em] text-[#a27731]">
            ADMIN
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#173d2b]">
            Pengajuan Event
          </h1>
          <p className="mt-3 text-sm text-[#697067]">
            Periksa dan verifikasi event yang diajukan oleh pengguna MedanKarsa.
          </p>
        </div>

        <AdminEventList
          events={events.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            category: event.category,
            location: event.location,
            startAt: event.startAt.toISOString(),
            endAt: event.endAt.toISOString(),
            status: event.status,
            userId: event.submittedBy?.id ?? null,
            submittedBy: event.submittedBy
              ? {
                  name: event.submittedBy.name ?? "Pengguna Tanpa Nama",
                  email: event.submittedBy.email,
                }
              : null,
          }))}
        />
      </section>
    </main>
  );
}