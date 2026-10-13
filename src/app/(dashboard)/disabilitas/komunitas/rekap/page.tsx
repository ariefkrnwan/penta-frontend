"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  hari: string;
  tanggal: string; // format YYYY-MM-DD
  waktu: string;   // format HH:mm
  tempat: string;
  jumlahFoto: number;
  laporanTerunggah: boolean;
};

type RekapRow = { m: number; item: Kegiatan | null };

// ─── Konstanta & helper ───────────────────────────────────────────────────────

const START_YEAR = 2026;

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function parseTanggal(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { y, m, d };
}

function formatTanggal(value: string) {
  const { y, m, d } = parseTanggal(value);
  return `${d} ${BULAN[m - 1]} ${y}`;
}

function formatWaktu(value: string) {
  return `${value.replace(":", ".")} WIB`;
}

// ─── Data contoh ──────────────────────────────────────────────────────────────
// TODO: ganti dengan data dari backend, mis. GET /api/disabilitas/komunitas/rekap?tahun=2026

const NAMA = "Pertemuan Rutin Paguyuban Disabilitas Kabupaten Lumajang";

const dummyData: Kegiatan[] = [
  { id: 1, namaKegiatan: NAMA, hari: "Sabtu", tanggal: "2026-01-17", waktu: "09:00", tempat: "Balai Desa Jatian, Kecamatan Pasirian", jumlahFoto: 2, laporanTerunggah: true },
  { id: 2, namaKegiatan: NAMA, hari: "Sabtu", tanggal: "2026-02-14", waktu: "10:00", tempat: "Aula Dinas Tenaga Kerja Kabupaten Lumajang", jumlahFoto: 2, laporanTerunggah: true },
  { id: 3, namaKegiatan: NAMA, hari: "Sabtu", tanggal: "2026-03-21", waktu: "08:30", tempat: "Gedung pertemuan Lumajang", jumlahFoto: 2, laporanTerunggah: true },
  { id: 4, namaKegiatan: NAMA, hari: "Kamis", tanggal: "2026-04-16", waktu: "09:30", tempat: "Balai Latihan Kerja Lumajang", jumlahFoto: 2, laporanTerunggah: true },
  { id: 5, namaKegiatan: NAMA, hari: "Rabu", tanggal: "2026-06-24", waktu: "07:30", tempat: "Alun-alun Lumajang", jumlahFoto: 2, laporanTerunggah: true },
  { id: 6, namaKegiatan: NAMA, hari: "Sabtu", tanggal: "2026-09-19", waktu: "13:00", tempat: "Pendopo Kabupaten Lumajang", jumlahFoto: 1, laporanTerunggah: false },
];

// ─── Komponen kecil ───────────────────────────────────────────────────────────

function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : Math.min(1, value / total);

  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#DDE5FE" strokeWidth="12" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke="#1B4EF5" strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-gray-900">{Math.round(pct * 100)}%</span>
        <span className="text-xs text-gray-400">capaian</span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  caption: string;
  icon: string;
  tone?: "blue" | "red";
}) {
  const box = tone === "red" ? "bg-red-50" : "bg-[#DDE5FE]";
  const ico = tone === "red" ? "text-red-500" : "text-[#1B4EF5]";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${box} flex items-center justify-center shrink-0`}>
        <svg className={`w-5 h-5 ${ico}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{caption}</p>
      </div>
    </div>
  );
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function RekapKomunitasPage() {
  const router = useRouter();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [year, setYear] = useState(Math.max(currentYear, START_YEAR));

  // ── Pilihan tahun: dari 2026 ke atas ──
  const latestYear = Math.max(currentYear, ...dummyData.map((d) => parseTanggal(d.tanggal).y));
  const yearOptions = Array.from(
    { length: Math.max(1, latestYear + 4 - START_YEAR + 1) },
    (_, i) => START_YEAR + i
  );

  // ── Data tahun terpilih ──
  const yearData = dummyData.filter((d) => parseTanggal(d.tanggal).y === year);

  // Jumlah bulan yang sudah berjalan di tahun terpilih
  const elapsed = year < currentYear ? 12 : year === currentYear ? currentMonth : 0;

  const monthsWithData = new Set(yearData.map((d) => parseTanggal(d.tanggal).m));
  const doneElapsed = Array.from(monthsWithData).filter((m) => m <= elapsed).length;
  const missedMonths = Array.from({ length: elapsed }, (_, i) => i + 1).filter(
    (m) => !monthsWithData.has(m) && !(year === currentYear && m === currentMonth)
  ).length;

  const totalFoto = yearData.reduce((sum, d) => sum + d.jumlahFoto, 0);
  const laporanCount = yearData.filter((d) => d.laporanTerunggah).length;

  // ── Baris rekap: 12 bulan ──
  const rows: RekapRow[] = Array.from({ length: 12 }, (_, i) => i + 1).flatMap((m): RekapRow[] => {
    const items = yearData.filter((d) => parseTanggal(d.tanggal).m === m);
    return items.length > 0 ? items.map((item) => ({ m, item })) : [{ m, item: null }];
  });

  const statusOf = (m: number, item: Kegiatan | null) => {
    if (item) return { label: "Terlaksana", cls: "bg-green-100 text-green-600" };
    if (year > currentYear || (year === currentYear && m > currentMonth))
      return { label: "Belum tiba", cls: "bg-gray-100 text-gray-500" };
    if (year === currentYear && m === currentMonth)
      return { label: "Belum terlaksana", cls: "bg-yellow-100 text-yellow-700" };
    return { label: "Terlewat", cls: "bg-red-100 text-red-500" };
  };

  const columns = ["No", "Bulan", "Kegiatan", "Hari, Tanggal", "Waktu", "Tempat", "Foto", "Laporan", "Status"];

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Rekap Kegiatan Komunitas</h1>
          <p className="text-sm text-gray-500">Disabilitas</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Tahun */}
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              aria-label="Filter tahun"
              className="bg-white border-2 border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#1B4EF5] transition-all appearance-none cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Lihat data */}
          <button
            onClick={() => router.push("/disabilitas/komunitas/data")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
          >
            Lihat data
          </button>
        </div>
      </div>

      {/* ── Ringkasan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Capaian tahun */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <ProgressRing value={doneElapsed} total={elapsed} />
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Capaian tahun {year}</p>
            {elapsed > 0 ? (
              <p className="text-2xl font-black text-gray-900 leading-tight">
                {doneElapsed}
                <span className="text-base font-bold text-gray-400"> dari {elapsed} bulan</span>
              </p>
            ) : (
              <p className="text-base font-bold text-gray-400">Belum ada bulan berjalan</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Kegiatan dilaksanakan satu kali setiap bulan, target 12 kegiatan per tahun.
            </p>
          </div>
        </div>

        {/* Statistik */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total foto"
            value={String(totalFoto)}
            caption="Dokumentasi tahun ini"
            icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
          <StatCard
            label="Laporan terunggah"
            value={`${laporanCount}`}
            caption={`dari ${yearData.length} kegiatan`}
            icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          <StatCard
            label="Bulan terlewat"
            value={String(missedMonths)}
            caption="Tanpa kegiatan"
            tone={missedMonths > 0 ? "red" : "blue"}
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </div>
      </div>

      {/* ── Tabel rekap ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="bg-[#DDE5FE] text-gray-700">
                {columns.map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 font-semibold whitespace-nowrap ${
                      col === "No" || col === "Foto" ? "text-center" : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(({ m, item }, idx) => {
                const status = statusOf(m, item);
                return (
                  <tr key={`${m}-${item?.id ?? "kosong"}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{BULAN[m - 1]}</td>
                    {item ? (
                      <>
                        <td className="px-4 py-3 text-gray-700 max-w-[260px]">{item.namaKegiatan}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                          {item.hari}, {formatTanggal(item.tanggal)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatWaktu(item.waktu)}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[220px]">{item.tempat}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.jumlahFoto}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.laporanTerunggah
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.laporanTerunggah ? "Terunggah" : "Belum diunggah"}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-center text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                      </>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}