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
  jumlahPeserta: number;
  jumlahFoto: number;
  laporanTerunggah: boolean;
};

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
// TODO: ganti dengan data dari backend, mis. GET /api/disabilitas/pemberdayaan/rekap

const dummyData: Kegiatan[] = [
  { id: 1, namaKegiatan: "Pelatihan keterampilan menjahit bagi penyandang disabilitas", hari: "Kamis", tanggal: "2026-02-12", waktu: "09:00", tempat: "Balai Latihan Kerja Lumajang", jumlahPeserta: 25, jumlahFoto: 2, laporanTerunggah: true },
  { id: 2, namaKegiatan: "Workshop kewirausahaan penyandang disabilitas", hari: "Rabu", tanggal: "2026-05-20", waktu: "08:30", tempat: "Gedung pertemuan Lumajang", jumlahPeserta: 30, jumlahFoto: 2, laporanTerunggah: true },
  { id: 3, namaKegiatan: "Pelatihan olahan makanan dan pemasaran daring", hari: "Kamis", tanggal: "2026-08-27", waktu: "09:30", tempat: "Aula Dinas Tenaga Kerja Kabupaten Lumajang", jumlahPeserta: 20, jumlahFoto: 1, laporanTerunggah: false },
];

// ─── Kartu statistik ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: string;
  caption: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#DDE5FE] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function RekapPemberdayaanPage() {
  const router = useRouter();

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState<number | "all">(Math.max(currentYear, START_YEAR));

  // ── Pilihan tahun: dari 2026 ke atas ──
  const latestYear = Math.max(currentYear, ...dummyData.map((d) => parseTanggal(d.tanggal).y));
  const yearOptions = Array.from(
    { length: Math.max(1, latestYear + 4 - START_YEAR + 1) },
    (_, i) => START_YEAR + i
  );

  // ── Data sesuai filter tahun ──
  const scoped = dummyData.filter((d) => year === "all" || parseTanggal(d.tanggal).y === year);
  const daftar = [...scoped].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const totalPeserta = scoped.reduce((sum, d) => sum + d.jumlahPeserta, 0);
  const totalLaporan = scoped.filter((d) => d.laporanTerunggah).length;
  const periode = year === "all" ? "Semua tahun" : `Tahun ${year}`;

  // ── Rekap per tahun (terbaru dulu) ──
  // Kegiatan tidak terikat bulan, tetapi setiap tahun seharusnya ada kegiatan.
  const yearsToShow: number[] =
    year === "all"
      ? Array.from({ length: latestYear - START_YEAR + 1 }, (_, i) => latestYear - i)
      : [year];

  const yearRows = yearsToShow.map((y) => {
    const items = dummyData.filter((d) => parseTanggal(d.tanggal).y === y);
    return {
      year: y,
      kegiatan: items.length,
      peserta: items.reduce((sum, d) => sum + d.jumlahPeserta, 0),
      foto: items.reduce((sum, d) => sum + d.jumlahFoto, 0),
      laporan: items.filter((d) => d.laporanTerunggah).length,
    };
  });

  const yearsElapsed = yearRows.filter((r) => r.year <= currentYear).length;
  const yearsDone = yearRows.filter((r) => r.kegiatan > 0).length;

  const statusOf = (y: number, kegiatan: number) => {
    if (kegiatan > 0) return { label: "Terlaksana", cls: "bg-green-100 text-green-600" };
    if (y > currentYear) return { label: "Belum tiba", cls: "bg-gray-100 text-gray-500" };
    if (y === currentYear) return { label: "Belum ada kegiatan", cls: "bg-yellow-100 text-yellow-700" };
    return { label: "Tidak ada kegiatan", cls: "bg-red-100 text-red-500" };
  };

  const kolomTahun = ["Tahun", "Jumlah Kegiatan", "Total Peserta", "Total Foto", "Laporan Terunggah", "Status"];
  const kolomDaftar = ["No", "Kegiatan", "Hari, Tanggal", "Waktu", "Tempat", "Peserta", "Foto", "Laporan"];

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Rekap Kegiatan Pemberdayaan</h1>
          <p className="text-sm text-gray-500">Disabilitas</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Tahun */}
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
              aria-label="Filter tahun"
              className="bg-white border-2 border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#1B4EF5] transition-all appearance-none cursor-pointer"
            >
              <option value="all">Semua tahun</option>
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
            onClick={() => router.push("/disabilitas/pemberdayaan/data")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
          >
            Lihat data
          </button>
        </div>
      </div>

      {/* ── Ringkasan ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Kegiatan"
          value={String(scoped.length)}
          caption={periode}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
        <StatCard
          label="Total peserta"
          value={String(totalPeserta)}
          caption="Seluruh kegiatan"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <StatCard
          label="Laporan terunggah"
          value={String(totalLaporan)}
          caption={`dari ${scoped.length} kegiatan`}
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
        <StatCard
          label="Tahun terlaksana"
          value={String(yearsDone)}
          caption={yearsElapsed > 0 ? `dari ${yearsElapsed} tahun berjalan` : "Belum ada tahun berjalan"}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </div>

      {/* ── Rekap per tahun ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-gray-900">Rekap per tahun</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-[#DDE5FE] text-gray-700">
                  {kolomTahun.map((col) => (
                    <th
                      key={col}
                      className={`px-4 py-3 font-semibold whitespace-nowrap ${
                        col === "Tahun" || col === "Status" ? "text-left" : "text-center"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {yearRows.map((r) => {
                  const status = statusOf(r.year, r.kegiatan);
                  return (
                    <tr key={r.year} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-800">{r.year}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{r.kegiatan}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{r.peserta}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{r.foto}</td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {r.laporan}
                        <span className="text-gray-400"> / {r.kegiatan}</span>
                      </td>
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

      {/* ── Daftar kegiatan ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-gray-900">Daftar kegiatan</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="bg-[#DDE5FE] text-gray-700">
                  {kolomDaftar.map((col) => (
                    <th
                      key={col}
                      className={`px-4 py-3 font-semibold whitespace-nowrap ${
                        col === "No" || col === "Peserta" || col === "Foto" ? "text-center" : "text-left"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {daftar.length === 0 ? (
                  <tr>
                    <td colSpan={kolomDaftar.length} className="text-center py-16 text-gray-400 text-sm">
                      Tidak ada kegiatan ditemukan
                    </td>
                  </tr>
                ) : (
                  daftar.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium max-w-[280px]">{item.namaKegiatan}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {item.hari}, {formatTanggal(item.tanggal)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatWaktu(item.waktu)}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[220px]">{item.tempat}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.jumlahPeserta}</td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}