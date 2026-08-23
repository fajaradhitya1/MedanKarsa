"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    // Login Google diarahkan ke dashboard user biasa
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Username atau password salah!");
      setIsLoading(false);
    } else {
      // Gunakan window.location.href agar terjadi hard reload dan sesi langsung terbaca sempurna
      window.location.href = "/admin/events";
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f0e6] p-4 sm:p-6 lg:p-8">
      {/* Container Card Utama (Split Screen) */}
      <div className="w-full max-w-5xl rounded-[36px] bg-white shadow-2xl border border-[#e2d8c5]/60 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* ================= SISI KIRI: PANEL HIJAU & ILUSTRASI ================= */}
        <div className="relative bg-[#0d281a] text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
          {/* Garis Dekorasi Kurva Abstrak di Sudut Kanan Atas */}
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#dcae59]">
              <path d="M200 0C200 110.457 110.457 200 0 200" stroke="currentColor" strokeWidth="2" />
              <path d="M200 40C200 133.888 133.888 200 40 200" stroke="currentColor" strokeWidth="1.5" />
              <path d="M200 80C200 157.32 157.32 200 80 200" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Logo Brand */}
          <div className="relative z-10">
            <h1 className="font-serif text-2xl font-bold tracking-wide text-white">
              Medan<span className="text-[#dcae59]">Karsa</span>
            </h1>
          </div>

          {/* Teks Headline */}
          <div className="relative z-10 my-12 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Jelajahi, bagikan, <br />
              dan <span className="text-[#dcae59] italic font-normal">berian berkarya</span> <br />
              untuk Medan.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed max-w-sm pt-2">
              Platform kolaborasi untuk masyarakat Medan dalam <span className="text-white font-semibold">berbagi ide, karya,</span> dan solusi untuk kota yang lebih baik.
            </p>
          </div>

          {/* Ilustrasi Gambar Landmark Medan di Bagian Bawah */}
          <div className="relative z-10 w-full mt-auto pt-10 pointer-events-none -mx-8 sm:-mx-12 -mb-8 sm:-mb-12">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d281a] via-[#0d281a]/50 to-transparent z-10" />
            <img 
              src="/assets/istanamaimun/cover.jpeg" 
              alt="Landmark Istana Maimun" 
              className="w-full h-48 sm:h-56 object-cover opacity-50 transform scale-105"
            />
          </div>
        </div>

        {/* ================= SISI KANAN: FORM LOGIN & GOOGLE ================= */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
          {/* Avatar Logo Kecil di Atas */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#0d281a] flex items-center justify-center shadow-md mb-4 border-2 border-[#dcae59]/40">
              <span className="font-serif text-[#dcae59] text-xl font-bold">M</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#173d2b]">
              Selamat datang kembali!
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Silakan masuk untuk melanjutkan ke dashboard.
            </p>
          </div>

          {/* TOMBOL GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 font-medium text-gray-700 text-xs sm:text-sm shadow-xs transition hover:bg-gray-50 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.15c1.85-1.7 2.91-4.2 2.91-7.42z" />
              <path fill="#34A853" d="M12 21.8c2.65 0 4.88-.88 6.5-2.39l-3.15-2.45c-.88.59-2 0.94-3.35.94-2.57 0-4.75-1.74-5.53-4.08H3.22v2.53A9.82 9.82 0 0 0 12 21.8z" />
              <path fill="#FBBC05" d="M6.47 13.82A5.9 5.9 0 0 1 6.16 12c0-.63.11-1.24.31-1.82V7.65H3.22A9.82 9.82 0 0 0 2.2 12c0 1.58.38 3.07 1.02 4.35l3.25-2.53z" />
              <path fill="#EA4335" d="M12 6.1c1.44 0 2.74.5 3.76 1.48l2.82-2.82C16.88 3.15 14.65 2.2 12 2.2a9.82 9.82 0 0 0-8.78 5.45l3.25 2.53C7.25 7.84 9.43 6.1 12 6.1z" />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">atau login admin</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* FORM ADMIN LOGIN */}
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 text-center font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <User size={16} />
              </span>
              <input
                type="text"
                placeholder="Username (contoh: admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3.5 text-xs sm:text-sm outline-none transition focus:border-[#0d281a] focus:bg-white focus:ring-1 focus:ring-[#0d281a]"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-11 pr-11 py-3.5 text-xs sm:text-sm outline-none transition focus:border-[#0d281a] focus:bg-white focus:ring-1 focus:ring-[#0d281a]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Opsi Ingat Saya & Lupa Password */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-gray-300 text-[#0d281a] focus:ring-[#0d281a] w-4 h-4" />
                <span>Ingat saya</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi superadmin untuk reset password."); }} className="text-[#0d281a] hover:underline font-semibold">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-2xl bg-[#0d281a] px-4 py-3.5 font-semibold text-white text-xs sm:text-sm shadow-md transition hover:bg-[#153e28] disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock size={15} />
              {isLoading ? "Memeriksa..." : "Login Admin"}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed">
            Dengan melanjutkan, kamu menyetujui <span className="underline cursor-pointer">ketentuan penggunaan</span> MedanKarsa.
          </p>

        </div>

      </div>
    </main>
  );
}