import { prisma } from "@/lib/prisma";
import AdminUmkmList from "@/components/umkm/AdminUmkmList";

export const dynamic = "force-dynamic";

export default async function AdminUmkmPage() {
  // Ambil semua UMKM yang statusnya PENDING
  const pendingUmkms = await prisma.umkm.findMany({
    where: { status: "PENDING" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#f8f3e8] py-10 px-5 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[.2em] text-[#a27731]">PANEL ADMIN MEDANKARSA</p>
          <h1 className="font-serif text-3xl font-bold text-[#173d2b] mt-1">Verifikasi Pengajuan UMKM</h1>
          <p className="text-sm text-[#697067] mt-1">
            Tinjau dan setujui usulan tempat usaha warga agar tampil di peta interaktif UMKM Medan.
          </p>
        </div>

        <AdminUmkmList umkms={pendingUmkms} />
      </div>
    </main>
  );
}