import type { Metadata } from "next";
import "./globals.css";

// 1. Import SessionProvider yang sudah Anda buat
// (Pastikan path-nya sesuai dengan lokasi file Anda menyimpannya, misalnya di folder components)
import SessionProvider from "@/components/providers/SessionProvider"; 
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "MedanKarsa",
  description:
    "Jelajahi heritage, event, budaya, dan UMKM Kota Medan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#f8f3e8] text-[#173d2b] antialiased">
        {/* 2. Bungkus Navbar dan children dengan SessionProvider */}
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}