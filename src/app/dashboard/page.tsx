import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Footer from "@/components/layout/Footer";

import DashboardHero from "@/components/dashboard/HeroSection";
import QuickMenu from "@/components/dashboard/QuickMenu";
import HeritageRecommendation from "@/components/dashboard/HeritageRecommendation";
import SumateraBanner from "@/components/dashboard/SumateraBanner";
import AiExplorer from "@/components/dashboard/AiExplorer";
import EventRecommendation from "@/components/dashboard/EventRecommendation";
import MapPreview from "@/components/dashboard/MapPreview";
import KarsaPointCard from "@/components/dashboard/KarsaPointCard";
import FeatureSection from "@/components/dashboard/FeatureSection";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#ffff] text-[#173d2b] overflow-x-hidden">
      
      {/* 1. HERO SECTION FULL WIDTH */}
      <DashboardHero />

      {/* 2. SEMUA FITUR & KONTEN LEBAR FULL KIRI KANAN */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-12 space-y-16 bg-[#ffff]">
        <QuickMenu />

        <HeritageRecommendation />

        <SumateraBanner />

        <AiExplorer />

        <EventRecommendation />

        <MapPreview />

        <KarsaPointCard />

        <FeatureSection />
      </div>

      {/* 3. FOOTER FULL WIDTH DENGAN LENGKUNGAN SVG DI ATASNYA */}
      <Footer />

      <BottomNavigation />
    </main>
  );
}