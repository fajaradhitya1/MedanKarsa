"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Map, User, Calendar, Store, Wallet, LogOut, ChevronRight, Ticket } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Menyesuaikan ikon navigasi agar lebih spesifik dan sesuai konteks
const userNavItems = [
  { label: "Beranda", href: "/dashboard", icon: Home },
  { label: "Heritage", href: "/heritage", icon: Map },
  { label: "Event", href: "/event", icon: Calendar },
  { label: "UMKM", href: "/umkm", icon: Store },
];

const adminNavItems = [
  { label: "Kelola Event", href: "/admin/events", icon: Calendar },
  { label: "Kelola UMKM", href: "/admin/umkm", icon: Store },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        })
        .catch((err) => console.error("Gagal memuat notifikasi:", err));
    }
  }, [session]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (pathname === "/login") {
    return null;
  }

  // Pengecekan mutlak khusus admin
  const userRole = (session?.user as any)?.role;
  const userEmail = session?.user?.email;
  const isAdmin = userRole === "ADMIN" && userEmail === "admin@medankarsa.com";

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8dfcf] bg-[#f8f3e8]/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        {/* LOGO */}
        <Link href={isAdmin ? "/admin/events" : "/dashboard"} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e1b45a]">
            <span className="text-xl">✦</span>
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#173d2b]">
              MedanKarsa {isAdmin && <span className="text-xs bg-[#173d2b] text-white px-2 py-0.5 rounded-md ml-1">Admin</span>}
            </h1>
            <p className="hidden text-xs text-[#6e756c] sm:block">
              {isAdmin ? "Panel Kontrol Administrator" : "Jelajahi. Hidupkan. Jaga Medan."}
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#173d2b] text-white shadow-sm"
                    : "text-[#667068] hover:bg-[#eee8dc] hover:text-[#173d2b]"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* USER */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {!isAdmin && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Notifikasi"
                    className="relative rounded-full p-2.5 text-[#173d2b] transition hover:bg-white shadow-sm border border-[#e8dfcf]"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 top-full mt-3 w-80 flex-col rounded-2xl border border-[#e8dfcf] bg-white p-3 shadow-xl z-50">
                      <div className="flex items-center justify-between border-b border-[#f2eadb] pb-2 mb-2 px-1">
                        <span className="font-serif font-bold text-[#173d2b] text-sm">Notifikasi</span>
                        <span className="text-xs text-[#8b9189]">{unreadCount} belum dibaca</span>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-center text-xs text-[#8b9189] py-6">Belum ada notifikasi.</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-xl text-xs transition border ${
                                notif.isRead ? "bg-white border-gray-100 text-gray-600" : "bg-[#f8f3e8]/70 border-[#e8dfcf] text-[#173d2b] font-medium"
                              }`}
                            >
                              <p className="font-bold mb-1">{notif.title}</p>
                              <p className="text-[#697067] leading-relaxed">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACCOUNT PROFILE & DROPDOWN (Menuju ke /akun saat diklik atau di-hover) */}
              <div className="relative">
                <div className="group relative inline-block">
                  <Link
                    href={isAdmin ? "/admin/events" : "/akun"}
                    className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-sm transition hover:shadow-md cursor-pointer border border-[#e8dfcf]/60"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce8dc] text-[#173d2b]">
                        <User size={17} />
                      </div>
                    )}

                    <span className="hidden text-sm font-semibold text-[#173d2b] sm:block">
                      {isAdmin ? "Admin" : `Hai, ${session.user?.name?.split(" ")[0] || "User"}!`}
                    </span>
                  </Link>

                  <div className="absolute right-0 top-full pt-2 hidden group-hover:flex flex-col w-56 z-50">
                    <div className="rounded-2xl border border-[#e8dfcf] bg-white p-2 shadow-xl space-y-1">
                      
                      {!isAdmin && (
                        <>
                          <Link
                            href="/akun"
                            className="flex items-center justify-between w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-[#173d2b] transition hover:bg-[#f8f3e8]"
                          >
                            <span className="flex items-center gap-2">
                              <User size={15} className="text-[#b8860b]" /> Akun & E-Tiket Saya
                            </span>
                            <ChevronRight size={14} className="text-gray-400" />
                          </Link>

                          <Link
                            href="/dompet-karsa"
                            className="flex items-center justify-between w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-[#173d2b] transition hover:bg-[#f8f3e8]"
                          >
                            <span className="flex items-center gap-2">
                              <Wallet size={15} className="text-[#b8860b]" /> Dompet Karsa Poin
                            </span>
                            <ChevronRight size={14} className="text-gray-400" />
                          </Link>

                          <div className="h-px bg-gray-100 my-1" />
                        </>
                      )}

                      <button
                        onClick={async () => {
                          await signOut({ redirect: false });
                          window.location.href = "/login";
                        }}
                        className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut size={15} /> Keluar dari Akun
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[#173d2b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f291d]"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="border-t border-[#e8dfcf] px-4 py-2 md:hidden">
        <nav className="flex items-center justify-between gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-fit items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#173d2b] text-white shadow-sm"
                    : "text-[#667068] hover:bg-[#eee8dc] hover:text-[#173d2b]"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}