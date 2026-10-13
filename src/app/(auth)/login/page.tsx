"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ─── Data simulasi — hapus saat backend siap ─────────────────────────────────

const USERS_DUMMY = [
  { username: "admin",         password: "Admin1234!", role: "Admin",   aktif: true  },
  { username: "budi.waseso",   password: "budi1234",   role: "Pegawai", aktif: true  },
  { username: "siti.maimunah", password: "siti1234",   role: "Pegawai", aktif: true  },
  { username: "agus.susanto",  password: "agus1234",   role: "Pegawai", aktif: false },
];

function buatTokenSimulasi(username: string, role: string): string {
  const header    = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload   = btoa(JSON.stringify({
    sub: username,
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 jam
  }));
  const signature = btoa("simulasi");
  return `${header}.${payload}.${signature}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    // TODO: ganti blok try ini dengan API call ke Spring Boot:
    // const res = await apiClient.post("/auth/login", { username, password });
    // const token = res.data.token;
    // document.cookie = `token=${token}; path=/; max-age=${60*60*8}; samesite=strict`;
    // const payload = JSON.parse(atob(token.split(".")[1]));
    // router.replace(payload.role === "Admin" ? "/manajemen-pengguna" : "/dashboard");

    try {
      await new Promise((r) => setTimeout(r, 800)); // simulasi loading

      const user = USERS_DUMMY.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        setError("Username atau password salah.");
        return;
      }

      if (!user.aktif) {
        setError("Akun Anda dinonaktifkan. Silakan hubungi Admin.");
        return;
      }

      // Simpan token simulasi ke cookie
      const token = buatTokenSimulasi(user.username, user.role);
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 8}; samesite=strict`;

      // Redirect berdasarkan role
      if (user.role === "Admin") {
        router.replace("/manajemen-pengguna");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ─── Panel Kiri ─── */}
      <div className="hidden lg:flex w-[45%] bg-[#1B4EF5] flex-col justify-center px-16 py-12 relative overflow-hidden">

        {/* Lingkaran dekoratif background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-white/5" />

        {/* Logo + Nama Instansi */}
        <div className="flex items-center gap-4 mb-16 relative z-10">
          <Image
            src="/logo-lumajang.png"
            alt="Logo Kabupaten Lumajang"
            width={80}
            height={80}
            quality={100}
            className="object-contain flex-shrink-0"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              Dinas Tenaga Kerja
            </p>
            <p className="text-white font-bold text-sm">
              Kabupaten Lumajang
            </p>
          </div>
        </div>

        {/* Nama Sistem */}
        <div className="relative z-10">
          <h1 className="text-white font-black text-7xl tracking-tight mb-3">
            PENTA
          </h1>
          <p className="text-[#DDE5FE] text-base leading-relaxed max-w-xs">
            Bidang Penempatan, Perluasan Kesempatan Kerja dan Transmigrasi.
          </p>
        </div>
      </div>

      {/* ─── Panel Kanan ─── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Header form */}
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-2">
              Selamat Datang<br />Admin &amp; Pegawai
            </h2>
            <p className="text-gray-500 text-sm">
              Silahkan masuk untuk melanjutkan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest mb-2 uppercase">
                Username
              </label>
              <Input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest mb-2 uppercase">
                Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                rightIcon={
                  showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )
                }
                onRightIconClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {/* Tombol Masuk */}
            <div className="pt-2">
              <Button type="submit" isLoading={isLoading}>
                Masuk &nbsp;→
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}