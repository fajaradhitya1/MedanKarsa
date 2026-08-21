"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">MedanKarsa</h1>
            <p className="mt-2 text-gray-500">
              Jelajahi, lestarikan, dan ikut berkarya untuk Medan.
            </p>
          </div>

          {/* TOMBOL GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.15c1.85-1.7 2.91-4.2 2.91-7.42z" />
              <path fill="#34A853" d="M12 21.8c2.65 0 4.88-.88 6.5-2.39l-3.15-2.45c-.88.59-2 0.94-3.35.94-2.57 0-4.75-1.74-5.53-4.08H3.22v2.53A9.82 9.82 0 0 0 12 21.8z" />
              <path fill="#FBBC05" d="M6.47 13.82A5.9 5.9 0 0 1 6.16 12c0-.63.11-1.24.31-1.82V7.65H3.22A9.82 9.82 0 0 0 2.2 12c0 1.58.38 3.07 1.02 4.35l3.25-2.53z" />
              <path fill="#EA4335" d="M12 6.1c1.44 0 2.74.5 3.76 1.48l2.82-2.82C16.88 3.15 14.65 2.2 12 2.2a9.82 9.82 0 0 0-8.78 5.45l3.25 2.53C7.25 7.84 9.43 6.1 12 6.1z" />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">atau login admin</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* FORM ADMIN LOGIN */}
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="text"
                placeholder="Username (contoh: admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#173d2b] focus:ring-1 focus:ring-[#173d2b]"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#173d2b] focus:ring-1 focus:ring-[#173d2b]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#173d2b] px-4 py-3 font-semibold text-white transition hover:bg-[#0f291d] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? "Memeriksa..." : "Login Admin"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Dengan melanjutkan, kamu menyetujui ketentuan penggunaan MedanKarsa.
          </p>
        </div>
      </div>
    </main>
  );
}