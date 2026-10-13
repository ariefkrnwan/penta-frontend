"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type DataBKK = {
  id: number;
  tahun: string;
  namaSekolah: string;
  namaTenagaKerja: string;
  nik: string;
  jenisKelamin: string;
  pendidikan: string;
  namaPerusahaan: string;
  namaJabatan: string;
  lapanganUsaha: string;
  tanggalMulai: string;
  gajiUpah: string;
};

type RekapSMK = {
  namaSekolah: string;
  jumlahMurid: number;
  murid: DataBKK[];
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const allData: DataBKK[] = [
  // SMK Muhammadiyah Lumajang — 4 murid
  { id: 1, tahun: "2026", namaSekolah: "SMK MUHAMMADIYAH LUMAJANG", namaTenagaKerja: "Ahmad Fauzi", nik: "3508012601020001", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT Indomarco Prismatama", namaJabatan: "Store Crew", lapanganUsaha: "Retail", tanggalMulai: "2026-01-15", gajiUpah: "3500000" },
  { id: 2, tahun: "2026", namaSekolah: "SMK MUHAMMADIYAH LUMAJANG", namaTenagaKerja: "Siti Aisyah", nik: "3508014502030002", jenisKelamin: "Perempuan", pendidikan: "SMA/SMK", namaPerusahaan: "PT Maju Jaya Bersama", namaJabatan: "Kasir", lapanganUsaha: "Retail", tanggalMulai: "2026-02-01", gajiUpah: "3200000" },
  { id: 3, tahun: "2026", namaSekolah: "SMK MUHAMMADIYAH LUMAJANG", namaTenagaKerja: "Budi Santoso", nik: "3508011203020003", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT Karya Abadi", namaJabatan: "Teknisi", lapanganUsaha: "Manufaktur", tanggalMulai: "2026-01-20", gajiUpah: "4000000" },
  { id: 4, tahun: "2026", namaSekolah: "SMK MUHAMMADIYAH LUMAJANG", namaTenagaKerja: "Dewi Rahayu", nik: "3508012303030004", jenisKelamin: "Perempuan", pendidikan: "SMA/SMK", namaPerusahaan: "PT Sinar Harapan", namaJabatan: "Admin", lapanganUsaha: "Jasa", tanggalMulai: "2026-03-01", gajiUpah: "3000000" },
  // SMK Negeri 1 Lumajang — 3 murid
  { id: 5, tahun: "2026", namaSekolah: "SMK NEGERI 1 LUMAJANG", namaTenagaKerja: "Rizal Pratama", nik: "3508013001020005", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT Astra Honda Motor", namaJabatan: "Mekanik", lapanganUsaha: "Otomotif", tanggalMulai: "2026-01-10", gajiUpah: "4500000" },
  { id: 6, tahun: "2026", namaSekolah: "SMK NEGERI 1 LUMAJANG", namaTenagaKerja: "Nur Halimah", nik: "3508011502030006", jenisKelamin: "Perempuan", pendidikan: "SMA/SMK", namaPerusahaan: "PT Bank Jatim", namaJabatan: "Teller", lapanganUsaha: "Jasa Keuangan", tanggalMulai: "2026-02-15", gajiUpah: "4000000" },
  { id: 7, tahun: "2026", namaSekolah: "SMK NEGERI 1 LUMAJANG", namaTenagaKerja: "Eko Prasetyo", nik: "3508011804020007", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT Telkom Indonesia", namaJabatan: "Teknisi IT", lapanganUsaha: "Teknologi", tanggalMulai: "2026-01-25", gajiUpah: "5000000" },
  // SMK Al Maliki Sukodono — 2 murid
  { id: 8, tahun: "2026", namaSekolah: "SMK AL MALIKI SUKODONO", namaTenagaKerja: "Fajar Hidayat", nik: "3508010501020008", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT Prima Suajtera", namaJabatan: "Operator", lapanganUsaha: "Manufaktur", tanggalMulai: "2026-02-01", gajiUpah: "3500000" },
  { id: 9, tahun: "2026", namaSekolah: "SMK AL MALIKI SUKODONO", namaTenagaKerja: "Lailatul Fitriah", nik: "3508012102030009", jenisKelamin: "Perempuan", pendidikan: "SMA/SMK", namaPerusahaan: "PT Maju Bersama", namaJabatan: "Staff Admin", lapanganUsaha: "Jasa", tanggalMulai: "2026-03-10", gajiUpah: "3000000" },
  // SMK Negeri 2 Lumajang — 5 murid
  { id: 10, tahun: "2026", namaSekolah: "SMK NEGERI 2 LUMAJANG", namaTenagaKerja: "Hendra Wijaya", nik: "3508011001020010", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT Unilever Indonesia", namaJabatan: "Sales", lapanganUsaha: "FMCG", tanggalMulai: "2026-01-05", gajiUpah: "4000000" },
  { id: 11, tahun: "2026", namaSekolah: "SMK NEGERI 2 LUMAJANG", namaTenagaKerja: "Indah Permata", nik: "3508012201030011", jenisKelamin: "Perempuan", pendidikan: "SMA/SMK", namaPerusahaan: "PT Unilever Indonesia", namaJabatan: "Promotor", lapanganUsaha: "FMCG", tanggalMulai: "2026-01-05", gajiUpah: "3800000" },
  { id: 12, tahun: "2026", namaSekolah: "SMK NEGERI 2 LUMAJANG", namaTenagaKerja: "Yoga Pratama", nik: "3508010302020012", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT XYZ Nusantara", namaJabatan: "Teknisi", lapanganUsaha: "Manufaktur", tanggalMulai: "2026-02-20", gajiUpah: "4200000" },
  { id: 13, tahun: "2026", namaSekolah: "SMK NEGERI 2 LUMAJANG", namaTenagaKerja: "Putri Handayani", nik: "3508011403030013", jenisKelamin: "Perempuan", pendidikan: "SMA/SMK", namaPerusahaan: "PT ABC", namaJabatan: "Admin", lapanganUsaha: "Jasa", tanggalMulai: "2026-03-01", gajiUpah: "3200000" },
  { id: 14, tahun: "2026", namaSekolah: "SMK NEGERI 2 LUMAJANG", namaTenagaKerja: "Andi Setiawan", nik: "3508010205020014", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK", namaPerusahaan: "PT ABC", namaJabatan: "Gudang", lapanganUsaha: "Logistik", tanggalMulai: "2026-03-15", gajiUpah: "3500000" },
  // SMK PGRI Lumajang — 1 murid
  { id: 15, tahun: "2026", namaSekolah: "SMK PGRI 1 LUMAJANG", namaTenagaKerja: "Dian Ayu", nik: "3508012903030015", jenisKelamin: "Perempuan", pendidikan: "SMA/SMK", namaPerusahaan: "PT Sumber Rejeki", namaJabatan: "Kasir", lapanganUsaha: "Retail", tanggalMulai: "2026-04-01", gajiUpah: "3000000" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

function formatRupiah(val: string) {
  const num = parseInt(val);
  if (isNaN(num)) return "-";
  return "Rp " + num.toLocaleString("id-ID");
}

function formatTanggal(val: string) {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Custom tooltip untuk bar chart
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-gray-700 mb-1 max-w-[160px] leading-snug">{label}</p>
        <p className="text-[#1B4EF5] font-black text-lg">{payload[0].value} <span className="text-xs font-normal text-gray-500">murid</span></p>
      </div>
    );
  }
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RekapBKKPage() {
  const [selectedTahun, setSelectedTahun] = useState(CURRENT_YEAR.toString());
  const [expandedSMK, setExpandedSMK] = useState<string | null>(null);

  // Group by SMK, filter tahun
  const rekap = useMemo<RekapSMK[]>(() => {
    const filtered = allData.filter((d) => d.tahun === selectedTahun);
    const map = new Map<string, RekapSMK>();
    filtered.forEach((d) => {
      if (!map.has(d.namaSekolah)) {
        map.set(d.namaSekolah, { namaSekolah: d.namaSekolah, jumlahMurid: 0, murid: [] });
      }
      const entry = map.get(d.namaSekolah)!;
      entry.murid.push(d);
      entry.jumlahMurid += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.jumlahMurid - a.jumlahMurid);
  }, [selectedTahun]);

  const totalMurid = rekap.reduce((s, r) => s + r.jumlahMurid, 0);
  const tertinggi = rekap[0];
  const terendah = rekap[rekap.length - 1];

  // Data chart — hanya tertinggi dan terendah
  const chartData = rekap.length === 0 ? [] : [
    {
      name: rekap[0].namaSekolah.replace("SMK ", ""),
      namaPenuh: rekap[0].namaSekolah,
      jumlah: rekap[0].jumlahMurid,
      warna: "#1B4EF5",
    },
    ...(rekap.length > 1 ? [{
      name: rekap[rekap.length - 1].namaSekolah.replace("SMK ", ""),
      namaPenuh: rekap[rekap.length - 1].namaSekolah,
      jumlah: rekap[rekap.length - 1].jumlahMurid,
      warna: "#FB923C",
    }] : []),
  ];

  const toggleExpand = (nama: string) => {
    setExpandedSMK(expandedSMK === nama ? null : nama);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Rekap BKK</h1>
          <p className="text-sm text-gray-500">Bursa Kerja Khusus — Rekap murid bekerja per SMK</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Tahun */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <svg className="w-4 h-4 text-[#1B4EF5] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 18H5V8h14v13zM7 10h5v5H7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Tahun</span>
            <div className="relative flex items-center">
              <select
                value={selectedTahun}
                onChange={(e) => { setSelectedTahun(e.target.value); setExpandedSMK(null); }}
                className="appearance-none bg-transparent text-sm font-semibold text-gray-800 pr-5 focus:outline-none cursor-pointer"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <svg className="w-3.5 h-3.5 text-gray-500 absolute right-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {/* Ekspor Excel */}
          <button onClick={() => alert("Ekspor Excel belum terhubung ke backend.")} className="flex items-center gap-2 bg-white border border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-600 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 7H8v2h5v-2zm0 4H8v2h5v-2zM8 9h2V7H8v2zm6-5v3h3l-3-3z" /></svg>
            Ekspor Excel
          </button>
          {/* Ekspor PDF */}
          <button onClick={() => alert("Ekspor PDF belum terhubung ke backend.")} className="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-500 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 9H8v-2h5v2zm2-4H8V5h7v2z" /></svg>
            Ekspor PDF
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Total SMK</p>
          <p className="text-3xl font-black text-[#1B4EF5]">{rekap.length}</p>
          <p className="text-xs text-gray-400 mt-1">dari 41 SMK di Lumajang</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Total Murid Bekerja</p>
          <p className="text-3xl font-black text-[#1B4EF5]">{totalMurid}</p>
          <p className="text-xs text-gray-400 mt-1">tahun {selectedTahun}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-[#1B4EF5]">
          <p className="text-xs font-semibold text-gray-500 mb-1">Tertinggi</p>
          <p className="text-2xl font-black text-[#1B4EF5]">{tertinggi?.jumlahMurid ?? 0} murid</p>
          <p className="text-xs text-gray-600 mt-1 font-medium truncate">{tertinggi?.namaSekolah ?? "-"}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-orange-400">
          <p className="text-xs font-semibold text-gray-500 mb-1">Terendah</p>
          <p className="text-2xl font-black text-orange-500">{terendah?.jumlahMurid ?? 0} murid</p>
          <p className="text-xs text-gray-600 mt-1 font-medium truncate">{terendah?.namaSekolah ?? "-"}</p>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      {rekap.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-black text-gray-900 mb-1">Grafik Murid Bekerja per SMK</h2>
          <p className="text-xs text-gray-500 mb-6">Tahun {selectedTahun} — diurutkan dari tertinggi ke terendah</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 24, right: 40, left: 0, bottom: 16 }} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#374151", fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: "Murid", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#9ca3af" } }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#DDE5FE", opacity: 0.5 }} />
              <Bar dataKey="jumlah" radius={[8, 8, 0, 0]} maxBarSize={80}>
                <LabelList dataKey="jumlah" position="top" style={{ fontSize: 13, fontWeight: 700, fill: "#1B4EF5" }} />
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.warna} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-5 justify-center mt-2">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#1B4EF5]" /><span className="text-xs text-gray-500">Tertinggi</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#93AEFB]" /><span className="text-xs text-gray-500">Lainnya</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-400" /><span className="text-xs text-gray-500">Terendah</span></div>
          </div>
        </div>
      )}

      {/* ── Daftar SMK (accordion) ── */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-gray-900">Detail per SMK</h2>
        {rekap.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400 text-sm">
            Belum ada data untuk tahun {selectedTahun}
          </div>
        ) : (
          rekap.map((smk, idx) => (
            <div key={smk.namaSekolah} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header SMK — klik untuk expand */}
              <button
                onClick={() => toggleExpand(smk.namaSekolah)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                    idx === 0 ? "bg-[#1B4EF5]" : idx === rekap.length - 1 ? "bg-orange-400" : "bg-[#93AEFB]"
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{smk.namaSekolah}</p>
                    <p className="text-xs text-gray-500">{smk.jumlahMurid} murid bekerja</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#DDE5FE] text-[#1B4EF5] text-sm font-black">
                    {smk.jumlahMurid} murid
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedSMK === smk.namaSekolah ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Tabel murid — expand */}
              {expandedSMK === smk.namaSekolah && (
                <div className="border-t border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#DDE5FE]/50">
                        <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-600 w-10">No</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Nama Murid</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">NIK</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">JK</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Nama Perusahaan</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Jabatan</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Lapangan Usaha</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Tgl Mulai</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Gaji/Upah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {smk.murid.map((m, mIdx) => (
                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-center text-xs text-gray-400">{mIdx + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{m.namaTenagaKerja}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{m.nik}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m.jenisKelamin === "Laki-laki" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>
                              {m.jenisKelamin === "Laki-laki" ? "L" : "P"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">{m.namaPerusahaan}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{m.namaJabatan}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{m.lapanganUsaha}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatTanggal(m.tanggalMulai)}</td>
                          <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">{formatRupiah(m.gajiUpah)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}