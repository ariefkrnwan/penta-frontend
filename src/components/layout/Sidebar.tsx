"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleType = "Admin" | "Pegawai";
type SubMenuItem = { label: string; href: string };
type MenuItem = {
  label: string;
  href: string;
  roles: RoleType[];
  icon: React.ReactNode;
  submenu?: SubMenuItem[];
};

// ─── Helper: baca role dari cookie token ─────────────────────────────────────

function getRoleFromCookie(): RoleType | null {
  try {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
    if (!tokenCookie) return null;
    const token = tokenCookie.split("=")[1];
    // JWT memakai base64url → normalkan sebelum atob
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));
    return payload.role as RoleType;
  } catch {
    return null;
  }
}

// ─── Menu Items ───────────────────────────────────────────────────────────────
// Admin dan Pegawai memakai menu yang sama (Admin hanya-lihat di halaman tabel).
// Manajemen Pengguna khusus Admin.

const BOTH: RoleType[] = ["Admin", "Pegawai"];

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: BOTH,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M14.305 9q-.345 0-.575-.23t-.23-.587V4.817q0-.357.234-.587t.58-.23h4.88q.347 0 .576.23t.23.587v3.366q0 .358-.234.587q-.234.23-.58.23zm-9.5 3q-.345 0-.575-.23T4 11.2V4.8q0-.34.234-.57t.58-.23h4.88q.347 0 .576.23t.23.57v6.4q0 .34-.234.57t-.58.23zm9.5 8q-.345 0-.575-.23t-.23-.57v-6.4q0-.34.234-.57t.58-.23h4.88q.347 0 .576.23t.23.57v6.4q0 .34-.234.57t-.58.23zm-9.5 0q-.345 0-.575-.23T4 19.183v-3.366q0-.357.234-.587t.58-.23h4.88q.347 0 .576.23t.23.587v3.366q0 .358-.234.587q-.234.23-.58.23z" />
      </svg>
    ),
  },
  // ── CPMI ──
  { label: "CPMI", href: "/cpmi", roles: BOTH, icon: iconCPMI() },
  // ── IPK ──
  {
    label: "IPK", href: "/ipk", roles: BOTH, icon: iconIPK(),
    submenu: [
      { label: "AK-1",     href: "/ipk/ak1"      },
      { label: "Loker",    href: "/ipk/loker"    },
      { label: "Pendagri", href: "/ipk/pendagri" },
    ],
  },
  // ── PMI Bermasalah ──
  { label: "PMI Bermasalah", href: "/pmi-non-prosedur", roles: BOTH, icon: iconPMI() },
  // ── BKK ──
  { label: "BKK", href: "/bkk", roles: BOTH, icon: iconBKK() },
  // ── Disabilitas ──
  {
    label: "Disabilitas", href: "/disabilitas", roles: BOTH, icon: iconDisabilitas(),
    submenu: [
      { label: "Perusahaan",   href: "/disabilitas/perusahaan"   },
      { label: "Komunitas",    href: "/disabilitas/komunitas"    },
      { label: "Pemberdayaan", href: "/disabilitas/pemberdayaan" },
    ],
  },
  // ── Lansia ──
  { label: "Lansia", href: "/lansia", roles: BOTH, icon: iconLansia() },
  // ── Pengaduan Masyarakat ──
  { label: "Pengaduan Masyarakat", href: "/pengaduan", roles: BOTH, icon: iconPengaduan() },
  // ── Manajemen Pengguna — Admin only ──
  {
    label: "Manajemen Pengguna", href: "/manajemen-pengguna", roles: ["Admin"],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
];

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function iconCPMI() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12s-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46" />
    </svg>
  );
}
function iconIPK() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M9 8c1.15 0 2 .85 2 2s-.85 2-2 2s-2-.85-2-2s.85-2 2-2m-3 8c0-1.66 1.34-3 3-3s3 1.34 3 3zm12-1h-4v-2h4zm0-4h-5V9h5z" />
    </svg>
  );
}
function iconPMI() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M10 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H2v-2c0-2.21 3.58-4 8-4m10-2V7h2v6h-2m0 4v-2h2v2z" />
    </svg>
  );
}
function iconBKK() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9zM5 13.18v4L12 21l7-3.82v-4L12 17z" />
    </svg>
  );
}
function iconDisabilitas() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M8 6c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m9 16h1c1.1 0 2-.9 2-2v-4.78c0-1.12-.61-2.15-1.61-2.66c-.43-.22-.89-.43-1.39-.62zm-4.66-5L15 11.33c-.93-.21-1.93-.33-3-.33c-2.53 0-4.71.7-6.39 1.56A2.97 2.97 0 0 0 4 15.22V22h2.34c-.22-.45-.34-.96-.34-1.5C6 18.57 7.57 17 9.5 17zM10 22l1.41-3H9.5c-.83 0-1.5.67-1.5 1.5S8.67 22 9.5 22z" />
    </svg>
  );
}
function iconLansia() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v1H4v-1c0-1.33 2.67-4 8-4zm-1 6h2v2h-2zm-3-1h2v3H8zm6 0h2v3h-2z" />
    </svg>
  );
}

function iconPengaduan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 9h-2V5h2zm0 4h-2v-2h2z" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [collapsed, setCollapsed]     = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [role, setRole]               = useState<RoleType | null>(null);

  useEffect(() => {
    setRole(getRoleFromCookie());
    if (pathname.startsWith("/disabilitas")) setOpenSubmenu("Disabilitas");
    if (pathname.startsWith("/ipk"))         setOpenSubmenu("IPK");
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const toggleSubmenu = (label: string) =>
    setOpenSubmenu(openSubmenu === label ? null : label);

  const visibleMenus = menuItems.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  return (
    <aside className={`${collapsed ? "w-[72px]" : "w-64"} min-h-screen bg-[#1B4EF5] flex flex-col shrink-0 transition-all duration-300 ease-in-out`}>

      {/* Toggle */}
      <div className={`flex ${collapsed ? "justify-center" : "justify-end"} px-4 pt-5 pb-3`}>
        <button onClick={() => setCollapsed(!collapsed)}
          className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
          title={collapsed ? "Buka sidebar" : "Tutup sidebar"}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="mx-4 border-t border-white/10 mb-3" />

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {visibleMenus.map((item) => {
          const key           = `${item.href}-${item.roles.join("")}`;
          const isActive      = pathname === item.href || pathname.startsWith(item.href + "/");
          const hasSubmenu    = !!item.submenu;
          const isSubmenuOpen = openSubmenu === item.label;

          return (
            <div key={key}>
              {hasSubmenu ? (
                <button
                  onClick={() => {
                    if (collapsed) { setCollapsed(false); setOpenSubmenu(item.label); }
                    else toggleSubmenu(item.label);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group w-full ${collapsed ? "justify-center" : ""} ${
                    isActive ? "bg-white text-[#1B4EF5] font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-[#1B4EF5]" : "text-white/80 group-hover:text-white"}>{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium truncate flex-1 text-left">{item.label}</span>
                      <svg className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <Link href={item.href} title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${collapsed ? "justify-center" : ""} ${
                    isActive ? "bg-white text-[#1B4EF5] font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-[#1B4EF5]" : "text-white/80 group-hover:text-white"}>{item.icon}</span>
                  {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                </Link>
              )}

              {/* Submenu */}
              {hasSubmenu && isSubmenuOpen && !collapsed && (
                <div className="mt-1 ml-4 pl-4 border-l border-white/20 space-y-1">
                  {item.submenu!.map((sub) => {
                    const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + "/");
                    return (
                      <Link key={sub.href} href={sub.href}
                        className={`flex items-center px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                          isSubActive ? "bg-white text-[#1B4EF5] font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-5 border-t border-white/10">
        <button onClick={handleLogout} title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 w-full ${collapsed ? "justify-center" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
              d="M6 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm10.293 5.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L18.586 13H10a1 1 0 1 1 0-2h8.586l-2.293-2.293a1 1 0 0 1 0-1.414" />
          </svg>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}