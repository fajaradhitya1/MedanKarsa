"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3 text-xs font-bold transition cursor-pointer shadow-xs"
    >
      <LogOut size={16} /> Keluar (Logout)
    </button>
  );
}