"use client";

import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ── Warna ──
const WARNA_KATEGORI: Record<string, string> = {
  "Deportasi": "#1B4EF5",
  "Deportasi Sakit": "#F59E0B",
  "Meninggal": "#EF4444",
};

const TAHUN_LIST = [2025, 2026, 2027, 2028];

// ══════════════════════════════════════════════════════
// DATA DUMMY — nanti diganti fetch dari Spring Boot
// ══════════════════════════════════════════════════════
const rawData = [
  // 2026
  ...Array.from({ length: 8 },  () => ({ tahun: 2026, bulan: 1,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2026, bulan: 1,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 1,  permasalahan: "Deportasi Sakit", jenisKelamin: "L" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2026, bulan: 1,  permasalahan: "Deportasi Sakit", jenisKelamin: "P" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 1,  permasalahan: "Meninggal",       jenisKelamin: "L" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 1,  permasalahan: "Meninggal",       jenisKelamin: "P" })),
  ...Array.from({ length: 6 },  () => ({ tahun: 2026, bulan: 2,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 7 },  () => ({ tahun: 2026, bulan: 2,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 2,  permasalahan: "Deportasi Sakit", jenisKelamin: "P" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2,  permasalahan: "Meninggal",       jenisKelamin: "P" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2026, bulan: 3,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 3,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2026, bulan: 3,  permasalahan: "Deportasi Sakit", jenisKelamin: "P" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 3,  permasalahan: "Meninggal",       jenisKelamin: "L" })),
  ...Array.from({ length: 9 },  () => ({ tahun: 2026, bulan: 4,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 6 },  () => ({ tahun: 2026, bulan: 4,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 4,  permasalahan: "Deportasi Sakit", jenisKelamin: "L" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 4,  permasalahan: "Meninggal",       jenisKelamin: "P" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2026, bulan: 5,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2026, bulan: 5,  permasalahan: "Deportasi Sakit", jenisKelamin: "L" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 5,  permasalahan: "Meninggal",       jenisKelamin: "L" })),
  ...Array.from({ length: 7 },  () => ({ tahun: 2026, bulan: 6,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2026, bulan: 6,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 6,  permasalahan: "Deportasi Sakit", jenisKelamin: "P" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 6,  permasalahan: "Meninggal",       jenisKelamin: "L" })),
  ...Array.from({ length: 10 }, () => ({ tahun: 2026, bulan: 7,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 8 },  () => ({ tahun: 2026, bulan: 7,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 7,  permasalahan: "Deportasi Sakit", jenisKelamin: "L" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 7,  permasalahan: "Meninggal",       jenisKelamin: "P" })),
  ...Array.from({ length: 6 },  () => ({ tahun: 2026, bulan: 8,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2026, bulan: 8,  permasalahan: "Deportasi Sakit", jenisKelamin: "L" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 8,  permasalahan: "Meninggal",       jenisKelamin: "L" })),
  // 2025
  ...Array.from({ length: 12 }, () => ({ tahun: 2025, bulan: 1,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 9 },  () => ({ tahun: 2025, bulan: 1,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 6 },  () => ({ tahun: 2025, bulan: 2,  permasalahan: "Deportasi Sakit", jenisKelamin: "P" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2025, bulan: 3,  permasalahan: "Meninggal",       jenisKelamin: "L" })),
  ...Array.from({ length: 7 },  () => ({ tahun: 2025, bulan: 4,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2025, bulan: 5,  permasalahan: "Deportasi Sakit", jenisKelamin: "L" })),
  // 2024
  ...Array.from({ length: 15 }, () => ({ tahun: 2024, bulan: 1,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 10 }, () => ({ tahun: 2024, bulan: 3,  permasalahan: "Deportasi",       jenisKelamin: "P" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2024, bulan: 6,  permasalahan: "Deportasi Sakit", jenisKelamin: "L" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2024, bulan: 9,  permasalahan: "Meninggal",       jenisKelamin: "P" })),
  // 2023
  ...Array.from({ length: 20 }, () => ({ tahun: 2023, bulan: 2,  permasalahan: "Deportasi",       jenisKelamin: "L" })),
  ...Array.from({ length: 8 },  () => ({ tahun: 2023, bulan: 5,  permasalahan: "Deportasi Sakit", jenisKelamin: "P" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2023, bulan: 8,  permasalahan: "Meninggal",       jenisKelamin: "L" })),
];

const BULAN_LABEL: Record<number, string> = {
  1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mei", 6: "Jun",
  7: "Jul", 8: "Agu", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Des",
};

const KATEGORI_LIST = ["Deportasi", "Deportasi Sakit", "Meninggal"];

// ── Custom Tooltip Pie ──
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, payload: p } = payload[0];
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-bold text-gray-800 mb-1">{name}</p>
        <p className="text-gray-600">Jumlah: <span className="font-bold text-gray-900">{value} orang</span></p>
        <p className="text-gray-600">Persentase: <span className="font-bold" style={{ color: p.fill }}>{p.persen}%</span></p>
        <p className="text-gray-600">Laki-laki: <span className="font-bold">{p.l}</span></p>
        <p className="text-gray-600">Perempuan: <span className="font-bold">{p.p}</span></p>
      </div>
    );
  }
  return null;
};

// ── Custom Label Pie ──
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, persen }: any) => {
  if (persen < 5) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {persen}%
    </text>
  );
};

export default function RekapPMIPage() {
  const [tahun, setTahun] = useState(2026);

  // ── Filter data berdasarkan tahun ──
  const filtered = useMemo(() =>
    rawData.filter((d) => d.tahun === tahun),
    [tahun]
  );

  const total = filtered.length;

  // ── Hitung per kategori ──
  const dataKategori = useMemo(() => {
    return KATEGORI_LIST.map((kat) => {
      const rows = filtered.filter((d) => d.permasalahan === kat);
      const l = rows.filter((d) => d.jenisKelamin === "L").length;
      const p = rows.filter((d) => d.jenisKelamin === "P").length;
      const jumlah = rows.length;
      const persen = total > 0 ? parseFloat(((jumlah / total) * 100).toFixed(1)) : 0;
      return { name: kat, value: jumlah, l, p, persen, fill: WARNA_KATEGORI[kat] };
    });
  }, [filtered, total]);

  const selectClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] cursor-pointer appearance-none pr-8";

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-gray-500">Rekapitulasi Data</p>
          <h1 className="text-2xl font-black text-gray-900">PMI Non Prosedural</h1>
          <p className="text-sm text-gray-400 mt-1">
            Menampilkan rekapitulasi data PMI Non Prosedural selama 1 tahun — {tahun}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-500 font-medium">Tahun</span>
          <div className="relative">
            <select
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              className={selectClass}
            >
              {TAHUN_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-[#DDE5FE] -translate-y-6 translate-x-6 opacity-60" />
          <div className="w-12 h-12 rounded-full bg-[#DDE5FE] flex items-center justify-center shrink-0 z-10">
            <svg className="w-6 h-6 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-500 font-medium">Total PMI Non Prosedur</p>
            <p className="text-3xl font-black text-gray-900">{total}</p>
            <p className="text-xs text-gray-400">Orang — {tahun}</p>
          </div>
        </div>

        {/* Per Kategori */}
        {dataKategori.map((kat) => {
          const bgMap: Record<string, string> = {
            "Deportasi": "bg-blue-50",
            "Deportasi Sakit": "bg-amber-50",
            "Meninggal": "bg-red-50",
          };
          const iconMap: Record<string, React.ReactNode> = {
            "Deportasi": (
              <svg className="w-6 h-6" style={{ color: kat.fill }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            ),
            "Deportasi Sakit": (
              <svg className="w-6 h-6" style={{ color: kat.fill }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
              </svg>
            ),
            "Meninggal": (
              <svg className="w-6 h-6" style={{ color: kat.fill }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            ),
          };
          return (
            <div key={kat.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className={`absolute right-0 top-0 w-24 h-24 rounded-full ${bgMap[kat.name]} -translate-y-6 translate-x-6 opacity-60`} />
              <div className="flex items-center gap-3 mb-3 z-10 relative">
                <div className={`w-10 h-10 rounded-full ${bgMap[kat.name]} flex items-center justify-center shrink-0`}>
                  {iconMap[kat.name]}
                </div>
                <p className="text-xs text-gray-500 font-medium">{kat.name}</p>
              </div>
              <div className="z-10 relative">
                <p className="text-2xl font-black text-gray-900">{kat.value} <span className="text-sm font-normal text-gray-400">orang</span></p>
                <p className="text-xs font-bold mt-1" style={{ color: kat.fill }}>{kat.persen}% dari total</p>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span>L: <span className="font-bold text-gray-700">{kat.l}</span></span>
                  <span>P: <span className="font-bold text-gray-700">{kat.p}</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Baris Utama: Pie Chart + Tabel Ringkasan ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-gray-900 text-base">Proporsi Kasus PMI Non Prosedural</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Distribusi berdasarkan kategori permasalahan — tahun {tahun}
            </p>
          </div>

          {total === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Tidak ada data untuk tahun {tahun}
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataKategori}
                    cx="50%" cy="50%"
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {dataKategori.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                    formatter={(value) => (
                      <span className="text-gray-700 font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Total di bawah pie */}
              <div className="flex items-center justify-center gap-2 bg-[#DDE5FE] rounded-xl px-4 py-2 mt-2">
                <span className="text-xs font-bold text-[#1B4EF5]">TOTAL KESELURUHAN {tahun}</span>
                <span className="text-xs font-black text-gray-900 ml-2">{total} Orang</span>
              </div>
            </>
          )}
        </div>

        {/* Tabel Ringkasan Kategori */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-gray-900 text-base">Ringkasan per Kategori</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Rincian jumlah laki-laki, perempuan, dan total per kategori — {tahun}
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#DDE5FE] text-gray-700">
                <th className="text-left px-4 py-3 font-semibold rounded-tl-xl">No</th>
                <th className="text-left px-4 py-3 font-semibold">Kategori</th>
                <th className="text-center px-4 py-3 font-semibold">Laki-laki</th>
                <th className="text-center px-4 py-3 font-semibold">Perempuan</th>
                <th className="text-center px-4 py-3 font-semibold">Jumlah</th>
                <th className="text-center px-4 py-3 font-semibold rounded-tr-xl">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dataKategori.map((kat, i) => (
                <tr key={kat.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: kat.fill }} />
                      <span className="font-medium text-gray-700">{kat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-[#1B4EF5]">{kat.l}</td>
                  <td className="px-4 py-3 text-center font-bold text-[#93AEFB]">{kat.p}</td>
                  <td className="px-4 py-3 text-center font-black text-gray-900">{kat.value}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: `${kat.fill}20`, color: kat.fill }}>
                      {kat.persen}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#DDE5FE] font-bold">
                <td colSpan={2} className="px-4 py-3 text-[#1B4EF5] rounded-bl-xl">TOTAL</td>
                <td className="px-4 py-3 text-center text-[#1B4EF5]">
                  {dataKategori.reduce((s, d) => s + d.l, 0)}
                </td>
                <td className="px-4 py-3 text-center text-[#1B4EF5]">
                  {dataKategori.reduce((s, d) => s + d.p, 0)}
                </td>
                <td className="px-4 py-3 text-center text-gray-900">{total}</td>
                <td className="px-4 py-3 text-center text-gray-900 rounded-br-xl">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}