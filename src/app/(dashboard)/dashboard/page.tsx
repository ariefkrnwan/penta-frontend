"use client";
import Link from "next/link";

type SubMenu = { label: string; href: string };

type ModulItem = {
  label: string;
  desc: string;
  href: string;
  submenu?: SubMenu[];
  hideLihat?: boolean;
  icon: React.ReactNode;
};

const modulUtama: ModulItem[] = [
  {
    label: "CPMI",
    desc: "Kelola data Calon Pekerja Migran Indonesia",
    href: "/cpmi/rekap",
    icon: (
      <svg className="w-10 h-10 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12s-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46" />
      </svg>
    ),
  },
  {
    label: "IPK",
    desc: "Informasi Pasar Kerja — Loker, AK-1, dan Penempatan Dalam Negeri",
    href: "/ipk",
    submenu: [
      { label: "Loker", href: "/ipk/loker/rekap" },
      { label: "AK-1", href: "/ipk/ak1/rekap" },
      { label: "Pendagri", href: "/ipk/pendagri/rekap" },
    ],
    hideLihat: true,
    icon: (
      <svg className="w-10 h-10 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M9 8c1.15 0 2 .85 2 2s-.85 2-2 2s-2-.85-2-2s.85-2 2-2m-3 8c0-1.66 1.34-3 3-3s3 1.34 3 3zm12-1h-4v-2h4zm0-4h-5V9h5z" />
      </svg>
    ),
  },
  {
    label: "PMI Bermasalah",
    desc: "Pekerja Migran Indonesia yang bekerja di luar negeri secara tidak resmi",
    href: "/pmi-non-prosedur/rekap",
    icon: (
      <svg className="w-10 h-10 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
        <path fill="currentColor" d="M10 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H2v-2c0-2.21 3.58-4 8-4m10-2V7h2v6h-2m0 4v-2h2v2z" />
      </svg>
    ),
  },
  {
    label: "BKK",
    desc: "Bursa Kerja Khusus — Penempatan tenaga kerja dari SMK di Lumajang",
    href: "/bkk/rekap",
    icon: (
      <svg className="w-10 h-10 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9zM5 13.18v4L12 21l7-3.82v-4L12 17z" />
      </svg>
    ),
  },
  {
    label: "Disabilitas",
    desc: "Kelola data pekerja disabilitas — Perusahaan, Komunitas, dan Pemberdayaan",
    href: "/disabilitas",
    submenu: [
      { label: "Perusahaan", href: "/disabilitas/perusahaan/rekap" },
      { label: "Komunitas", href: "/disabilitas/komunitas/rekap" },
      { label: "Pemberdayaan", href: "/disabilitas/pemberdayaan/rekap" },
    ],
    hideLihat: true,
    icon: (
      <svg className="w-10 h-10 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
        <path fill="currentColor" d="M8 6c0-2.21 1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4m9 16h1c1.1 0 2-.9 2-2v-4.78c0-1.12-.61-2.15-1.61-2.66c-.43-.22-.89-.43-1.39-.62zm-4.66-5L15 11.33c-.93-.21-1.93-.33-3-.33c-2.53 0-4.71.7-6.39 1.56A2.97 2.97 0 0 0 4 15.22V22h2.34c-.22-.45-.34-.96-.34-1.5C6 18.57 7.57 17 9.5 17zM10 22l1.41-3H9.5c-.83 0-1.5.67-1.5 1.5S8.67 22 9.5 22z" />
      </svg>
    ),
  },
  {
    label: "Lansia",
    desc: "Kelola data tenaga kerja lanjut usia",
    href: "/lansia/rekap",
    icon: (
      <svg className="w-10 h-10 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v1H4v-1c0-1.33 2.67-4 8-4zm-1 6h2v2h-2zm-3-1h2v3H8zm6 0h2v3h-2z" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Selamat Datang, di Dashboard PENTA
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sistem internal kelola dan pantau rekap seluruh data tenaga kerja.
          </p>
        </div>
      </div>

      {/* Grid konten */}
      <div className="grid grid-cols-3 gap-6 items-start">

        {/* Modul Utama — lebat penuh */}
        <div className="col-span-3 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Modul utama
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {modulUtama.map((modul) => (
              <div
                key={modul.href}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {modul.icon}
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{modul.label}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{modul.desc}</p>
                </div>

                {/* Sub menu jika ada */}
                {modul.submenu && (
                  <div className="flex flex-wrap gap-1.5">
                    {modul.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#DDE5FE] text-[#1B4EF5] hover:bg-[#1B4EF5] hover:text-white transition-all"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}

                {!modul.hideLihat && (
                  <Link
                    href={modul.href}
                    className="text-[#1B4EF5] text-sm font-medium hover:underline mt-auto"
                  >
                    Lihat selengkapnya
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}