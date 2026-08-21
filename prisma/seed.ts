import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  UserRole,
  HeritageCategory,
  ReportCategory,
  ReportStatus,
} from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting MedanKarsa seed...");

  // ==========================================
  // CLEAN DATABASE
  // ==========================================
  try { await prisma.rewardClaim.deleteMany(); } catch (e) {}
  try { await prisma.reward.deleteMany(); } catch (e) {}
  try { await prisma.ticket.deleteMany(); } catch (e) {}
  try { await prisma.notification.deleteMany(); } catch (e) {}
  try { await prisma.aiScan.deleteMany(); } catch (e) {}
  try { await prisma.karsaPoint.deleteMany(); } catch (e) {}
  try { await prisma.report.deleteMany(); } catch (e) {}
  try { await prisma.location.deleteMany(); } catch (e) {}
  try { await prisma.event.deleteMany(); } catch (e) {}
  try { await prisma.heritage.deleteMany(); } catch (e) {}
  try { await prisma.profile.deleteMany(); } catch (e) {}
  try { await prisma.user.deleteMany(); } catch (e) {}

  // ==========================================
  // USERS
  // ==========================================
  const user = await prisma.user.create({
    data: {
      email: "fajar@medankarsa.com",
      name: "Fajar Adhitya",
      role: UserRole.USER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@medankarsa.com",
      username: "admin",
      password: "adminkarsa",
      name: "Admin MedanKarsa",
      role: UserRole.ADMIN,
    },
  });

  // ==========================================
  // HERITAGE
  // ==========================================
  await prisma.heritage.create({
    data: {
      name: "Rumah Tjong A Fie",
      slug: "rumah-tjong-a-fie",
      description: "Bangunan bersejarah peninggalan Tjong A Fie yang menjadi salah satu ikon sejarah Kota Medan.",
      history: "Rumah Tjong A Fie merupakan salah satu bangunan bersejarah yang menggambarkan kehidupan masyarakat Medan pada masa lalu.",
      coverImage: "/assets/tjongafi/tjongafi.jpeg",
      address: "Jl. Jenderal Ahmad Yani No.105, Kesawan, Medan",
      images: [
        "/assets/tjongafi/halaman.jpeg",
        "/assets/tjongafi/ruangan.jpeg",
        "/assets/tjongafi/ruangtamu.jpeg"
      ],
      latitude: 3.5882,
      longitude: 98.6781,
      category: HeritageCategory.SEJARAH,
    },
  });

  await prisma.heritage.create({
    data: {
      name: "Istana Maimun",
      slug: "istana-maimun",
      description: "Istana Kesultanan Deli yang menjadi salah satu landmark budaya dan sejarah Kota Medan.",
      history: "Istana Maimun merupakan peninggalan Kesultanan Deli dan menjadi salah satu destinasi wisata sejarah terkenal di Medan.",
      coverImage: "/assets/istanamaimun/cover1.jpg",
      address: "Jl. Brigjen Katamso No.66, Sukaraja, Medan",
      images: [
        "/assets/istanamaimun/cover.jpeg",
        "/assets/istanamaimun/cover2.jpeg"
      ],
      latitude: 3.5752,
      longitude: 98.6839,
      category: HeritageCategory.ARSITEKTUR,
    },
  });

  await prisma.heritage.create({
    data: {
      name: "Rumah Tjong Yong Hian",
      slug: "rumah-tjong-yong-hian",
      description: "Salah satu bangunan bersejarah yang berkaitan dengan perkembangan Kota Medan pada masa kolonial.",
      history: "Rumah Tjong Yong Hian menjadi bagian dari sejarah perkembangan kawasan Kesawan dan perdagangan di Kota Medan.",
      coverImage: "/assets/Taman_Tjong_Yong_Hian_di_Medan.jpg",
      images: [
        "/assets/Taman.jpg",       // Pastikan file ini ada di folder public/assets
        "/assets/rumah2.jpeg"      // Pastikan file ini ada di folder public/assets
      ],
      address: "Kesawan, Medan",
      latitude: 3.5901,
      longitude: 98.6785,
      category: HeritageCategory.SEJARAH,
    },
  });

  // ==========================================
  // EVENTS
  // ==========================================
  await prisma.event.create({
    data: {
      title: "Medan Heritage Night",
      slug: "medan-heritage-night",
      description: "Malam apresiasi sejarah dan budaya Kota Medan dengan suasana heritage.",
      detailDescription: "Acara malam penuh kebudayaan di kawasan bersejarah Kesawan.",
      location: "Kesawan, Medan",
      latitude: 3.5882,
      longitude: 98.6781,
      startAt: new Date("2026-09-12T19:00:00"),
      endAt: new Date("2026-09-12T22:00:00"),
      category: "Budaya",
      price: 0,
    },
  });

  await prisma.event.create({
    data: {
      title: "Fun Run",
      slug: "fun-run",
      description: "Festival lari seru bersama warga Kota Medan.",
      detailDescription: "Acara lari santai dengan rute melewati ikon-ikon bersejarah Kota Medan.",
      location: "Lapangan Benteng",
      latitude: 3.5894,
      longitude: 98.6740,
      startAt: new Date("2026-08-22T06:00:00"),
      endAt: new Date("2026-08-22T10:00:00"),
      category: "Olahraga",
      price: 25000,
    },
  });

  // ==========================================
  // REPORT
  // ==========================================
  await prisma.report.create({
    data: {
      userId: user.id,
      title: "Lampu Jalan Mati",
      description: "Lampu penerangan jalan tidak menyala pada malam hari.",
      category: ReportCategory.LAMPU_JALAN,
      image: "/images/reports/lampu.jpg",
      address: "Jl. Iskandar Muda, Medan",
      latitude: 3.582,
      longitude: 98.666,
      status: ReportStatus.PROCESSING,
    },
  });

  console.log("✅ MedanKarsa seed completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });