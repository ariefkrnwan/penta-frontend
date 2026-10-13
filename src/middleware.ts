import { NextRequest, NextResponse } from "next/server";

// ─── Helper: decode JWT tanpa library ────────────────────────────────────────

function decodeJWT(token: string): { role?: string; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    // JWT memakai base64url → ubah ke base64 biasa + padding sebelum atob
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

// ─── Route config ─────────────────────────────────────────────────────────────

// Route yang hanya boleh diakses Admin
const ADMIN_ONLY_ROUTES = [
  "/manajemen-pengguna",
];

// Route yang TIDAK boleh diakses Admin (hanya Pegawai):
// khusus halaman form input / tambah data.
// Halaman tabel data, rekap, import, dan ekspor boleh dibuka Admin.
const PEGAWAI_ONLY_ROUTES = [
  "/bkk/tambah",
  "/ipk/loker/tambah",
];

// Pattern yang tidak boleh diakses Admin
// Catatan: /bkk/[id]/form sengaja TIDAK ada di sini, karena Admin juga
// harus bisa membuka halaman form BKK (pilih sekolah → form input).
const PEGAWAI_ONLY_PATTERNS = [
  /\/(tambah|edit)(\/|$)/,        // semua /.../tambah dan /.../edit/[id]
];

// Route publik (tidak perlu auth)
const PUBLIC_ROUTES = ["/login", "/"];

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati route publik dan aset statis
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Ambil token dari cookie
  const token = request.cookies.get("token")?.value;

  // Belum login → redirect ke /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decode JWT
  const payload = decodeJWT(token);

  // Token tidak valid
  if (!payload || !payload.role) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    return res;
  }

  // Token expired
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    return res;
  }

  const role = payload.role as "Admin" | "Pegawai";

  // ── Guard: route hanya untuk Admin ──
  const isAdminOnly = ADMIN_ONLY_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  if (isAdminOnly && role !== "Admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Guard: route hanya untuk Pegawai (form input / tambah / edit) ──
  const isPegawaiOnly =
    PEGAWAI_ONLY_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/")) ||
    PEGAWAI_ONLY_PATTERNS.some((pattern) => pattern.test(pathname));

  if (isPegawaiOnly && role !== "Pegawai") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};