"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList,
} from "recharts";

const BIRU = "#1B4EF5";
const BIRU_MUDA = "#93AEFB";

// ── 21 Kecamatan Lumajang lengkap ──
const KECAMATAN_LIST = [
  "Lumajang", "Sumbersuko", "Tempeh", "Pasirian", "Candipuro",
  "Pronojiwo", "Tempursari", "Tekung", "Yosowilangun", "Jatiroto",
  "Kunir", "Sukodono", "Kedungjajang", "Klakah", "Ranuyoso",
  "Randuagung", "Padang", "Senduro", "Pasrujambe", "Gucialit",
  "Rowokangkung",
];

const BULAN_LABEL: Record<number, string> = {
  1: "Januari", 2: "Februari", 3: "Maret", 4: "April",
  5: "Mei", 6: "Juni", 7: "Juli", 8: "Agustus",
  9: "September", 10: "Oktober", 11: "November", 12: "Desember",
};

// ══════════════════════════════════════════════════════
// DATA DUMMY — sesuai rekap excel yang dikirim
// ══════════════════════════════════════════════════════
const rawData = [
  // Taiwan
  ...Array.from({ length: 5 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Tempursari", negara: "Taiwan",            jabatan: "Worker",              jenisKelamin: "L", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Candipuro",  negara: "Taiwan",            jabatan: "House Maid",          jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Pasirian",   negara: "Taiwan",            jabatan: "Caregiver",           jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Tempeh",     negara: "Taiwan",            jabatan: "Kitchen Helper",      jenisKelamin: "L", jenisPelayanan: "Ganti PP" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Kunir",      negara: "Taiwan",            jabatan: "Worker",              jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),

  // Singapura
  ...Array.from({ length: 0 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Lumajang",   negara: "Singapura",         jabatan: "Domestic Worker",     jenisKelamin: "L", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Tempeh",     negara: "Singapura",         jabatan: "Domestic Worker",     jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Pasirian",   negara: "Singapura",         jabatan: "Domestic Worker",     jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Candipuro",  negara: "Singapura",         jabatan: "House Keeper",        jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),

  // Hong Kong
  ...Array.from({ length: 8 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Tempursari", negara: "Hong Kong",         jabatan: "House Maid",          jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Pronojiwo",  negara: "Hong Kong",         jabatan: "House Keeper",        jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Candipuro",  negara: "Hong Kong",         jabatan: "Domestic Helper",     jenisKelamin: "P", jenisPelayanan: "Ganti PP" })),

  // Brunei Darussalam
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Sumbersuko", negara: "Brunei Darussalam", jabatan: "Construction Worker", jenisKelamin: "L", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Tempursari", negara: "Brunei Darussalam", jabatan: "Construction Worker", jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),

  // Kecamatan lain yang muncul di rekap excel
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Tempeh",     negara: "Singapura",         jabatan: "Domestic Helper",     jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Pasirian",   negara: "Taiwan",            jabatan: "Caregiver",           jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Pronojiwo",  negara: "Taiwan",            jabatan: "Caregiver",           jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Tekung",     negara: "Hong Kong",         jabatan: "House Maid",          jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Kunir",      negara: "Singapura",         jabatan: "Domestic Worker",     jenisKelamin: "L", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Senduro",    negara: "Taiwan",            jabatan: "House Maid",          jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Gucialit",   negara: "Taiwan",            jabatan: "Worker",              jenisKelamin: "L", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 1 },  () => ({ tahun: 2026, bulan: 2, kecamatan: "Rowokangkung",negara:"Singapura",         jabatan: "Domestic Worker",     jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),

  // Tahun 2025
  ...Array.from({ length: 5 },  () => ({ tahun: 2025, bulan: 1, kecamatan: "Lumajang",   negara: "Taiwan",            jabatan: "Worker",              jenisKelamin: "L", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2025, bulan: 1, kecamatan: "Tempeh",     negara: "Singapura",         jabatan: "House Maid",          jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2025, bulan: 2, kecamatan: "Tempursari", negara: "Hong Kong",         jabatan: "Domestic Worker",     jenisKelamin: "P", jenisPelayanan: "Rekom ID" })),
];

const TAHUN_LIST = [2025, 2026, 2027, 2028, 2029];
const BULAN_LIST = Array.from({ length: 12 }, (_, i) => i + 1);

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
        <p className="font-bold text-gray-800 mb-1.5 border-b pb-1.5">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex justify-between gap-4">
            <span style={{ color: p.color }} className="font-medium">{p.name}</span>
            <span className="font-bold text-gray-800">{p.value}</span>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t mt-1.5 pt-1.5">
          <span className="font-semibold text-gray-600">Total</span>
          <span className="font-bold text-gray-900">{total}</span>
        </div>
      </div>
    );
  }
  return null;
};

// ── Custom tick sumbu Y dengan total ──
const TickWithTotal = (props: any) => {
  const { x, y, payload, totalsMap } = props;
  const total = totalsMap?.[payload.value] ?? 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-4} y={0} dy={4} textAnchor="end" fill="#6b7280" fontSize={11}>
        {payload.value}
      </text>
      <text x={-4} y={14} textAnchor="end" fill="#1B4EF5" fontSize={10} fontWeight={600}>
        (n={total})
      </text>
    </g>
  );
};

export default function RekapCPMIPage() {
  const [tahun, setTahun] = useState(2026);
  const [bulan, setBulan] = useState(2);
  const [filterNegara, setFilterNegara] = useState("Semua Negara");
  const [filterJK, setFilterJK] = useState("Semua");

  const filtered = useMemo(() =>
    rawData.filter((d) => d.tahun === tahun && d.bulan === bulan),
    [tahun, bulan]
  );

  // ── Summary ──
  const totalCPMI = filtered.length;
  const rekomID = filtered.filter((d) => d.jenisPelayanan === "Rekom ID").length;
  const gantiPP = filtered.filter((d) => d.jenisPelayanan === "Ganti PP").length;
  const totalL = filtered.filter((d) => d.jenisKelamin === "L").length;
  const totalP = filtered.filter((d) => d.jenisKelamin === "P").length;

  // ── Grafik 1: Per Kecamatan — semua 21 kecamatan + total ──
  const dataKecamatan = useMemo(() => {
    const map: Record<string, { L: number; P: number }> = {};
    KECAMATAN_LIST.forEach((k) => { map[k] = { L: 0, P: 0 }; });
    filtered
      .forEach((d) => {
        if (map[d.kecamatan]) map[d.kecamatan][d.jenisKelamin as "L" | "P"]++;
        else { map[d.kecamatan] = { L: 0, P: 0 }; map[d.kecamatan][d.jenisKelamin as "L" | "P"]++; }
      });
    const rows = KECAMATAN_LIST.map((kec) => ({
      kecamatan: kec,
      "Laki-laki": map[kec]?.L ?? 0,
      "Perempuan": map[kec]?.P ?? 0,
      total: (map[kec]?.L ?? 0) + (map[kec]?.P ?? 0),
    }));
    const totalL = rows.reduce((s, r) => s + r["Laki-laki"], 0);
    const totalP = rows.reduce((s, r) => s + r["Perempuan"], 0);
    return { rows, totalL, totalP, grandTotal: totalL + totalP };
  }, [filtered]);

  const totalsMapKec = useMemo(() => {
    const m: Record<string, number> = {};
    dataKecamatan.rows.forEach((r) => { m[r.kecamatan] = r.total; });
    return m;
  }, [dataKecamatan]);

  // ── Grafik 2: Per Negara (Luar Negeri) + total ──
  const dataNegara = useMemo(() => {
    const map: Record<string, { L: number; P: number }> = {};
    filtered
      .forEach((d) => {
        if (!map[d.negara]) map[d.negara] = { L: 0, P: 0 };
        map[d.negara][d.jenisKelamin as "L" | "P"]++;
      });
    const rows = Object.entries(map).map(([negara, val]) => ({
      negara,
      "Laki-laki": val.L,
      "Perempuan": val.P,
      total: val.L + val.P,
    })).sort((a, b) => b.total - a.total);
    const totalL = rows.reduce((s, r) => s + r["Laki-laki"], 0);
    const totalP = rows.reduce((s, r) => s + r["Perempuan"], 0);
    return { rows, totalL, totalP, grandTotal: totalL + totalP };
  }, [filtered]);

  const totalsMapNegara = useMemo(() => {
    const m: Record<string, number> = {};
    dataNegara.rows.forEach((r) => { m[r.negara] = r.total; });
    return m;
  }, [dataNegara]);

  // ── Grafik 3: Jenis Pelayanan ──
  const dataPelayanan = useMemo(() => [
    { name: "Rekom ID", value: rekomID },
    { name: "Ganti PP", value: gantiPP },
  ], [rekomID, gantiPP]);

  // ── Grafik 4: Jabatan per Negara + total ──
  const negaraList = useMemo(() => {
    const set = new Set(filtered.map((d) => d.negara));
    return Array.from(set);
  }, [filtered]);

  const dataJabatan = useMemo(() => {
    const filteredJ = filtered.filter((d) => {
      if (filterNegara !== "Semua Negara" && d.negara !== filterNegara) return false;
      if (filterJK !== "Semua" && d.jenisKelamin !== filterJK) return false;
      return true;
    });
    const map: Record<string, { L: number; P: number }> = {};
    filteredJ.forEach((d) => {
      if (!map[d.jabatan]) map[d.jabatan] = { L: 0, P: 0 };
      map[d.jabatan][d.jenisKelamin as "L" | "P"]++;
    });
    const rows = Object.entries(map)
      .map(([jabatan, val]) => ({
        jabatan,
        "Laki-laki": val.L,
        "Perempuan": val.P,
        total: val.L + val.P,
      }))
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);
    const totalL = rows.reduce((s, r) => s + r["Laki-laki"], 0);
    const totalP = rows.reduce((s, r) => s + r["Perempuan"], 0);
    return { rows, totalL, totalP, grandTotal: totalL + totalP };
  }, [filtered, filterNegara, filterJK]);

  const totalsMapJabatan = useMemo(() => {
    const m: Record<string, number> = {};
    dataJabatan.rows.forEach((r) => { m[r.jabatan] = r.total; });
    return m;
  }, [dataJabatan]);

  // ── Style ──
  const selectClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] cursor-pointer appearance-none pr-8";

  const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative inline-block">
      {children}
      <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  // ── Komponen baris total di bawah tabel ringkasan ──
  const TotalRow = ({ label, l, p, total }: { label: string; l: number; p: number; total: number }) => (
    <div className="flex items-center justify-between bg-[#DDE5FE] rounded-xl px-4 py-2 mt-2">
      <span className="text-xs font-bold text-[#1B4EF5]">{label}</span>
      <div className="flex gap-6 text-xs font-bold text-gray-700">
        <span>L: <span className="text-[#1B4EF5]">{l}</span></span>
        <span>P: <span className="text-[#93AEFB]">{p}</span></span>
        <span>Total: <span className="text-gray-900">{total}</span></span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header + Filter Global ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Dashboard Rekap Rekom ID CPMI
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Menampilkan rekapitulasi data CPMI — {BULAN_LABEL[bulan]} {tahun}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-500 font-medium">Tahun</span>
            <SelectWrapper>
              <select value={tahun} onChange={(e) => setTahun(Number(e.target.value))} className={selectClass}>
                {TAHUN_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </SelectWrapper>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-500 font-medium">Bulan</span>
            <SelectWrapper>
              <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} className={selectClass}>
                {BULAN_LIST.map((b) => <option key={b} value={b}>{BULAN_LABEL[b]}</option>)}
              </select>
            </SelectWrapper>
          </div>
          <button className="flex items-center gap-2 bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-[#DDE5FE] -translate-y-6 translate-x-6 opacity-60" />
          <div className="w-12 h-12 rounded-full bg-[#DDE5FE] flex items-center justify-center shrink-0 z-10">
            <svg className="w-6 h-6 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-500 font-medium">Total CPMI</p>
            <p className="text-3xl font-black text-gray-900">{totalCPMI}</p>
            <p className="text-xs text-gray-400">Orang</p>
          </div>
        </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-blue-50 -translate-y-6 translate-x-6 opacity-60" />
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 z-10">
            <svg className="w-6 h-6 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-500 font-medium">Laki-laki</p>
            <p className="text-3xl font-black text-gray-900">{totalL}</p>
            <p className="text-xs text-gray-400">Orang</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-pink-50 -translate-y-6 translate-x-6 opacity-60" />
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center shrink-0 z-10">
            <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-500 font-medium">Perempuan</p>
            <p className="text-3xl font-black text-gray-900">{totalP}</p>
            <p className="text-xs text-gray-400">Orang</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-purple-50 -translate-y-6 translate-x-6 opacity-60" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0 z-10">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 font-medium z-10">Jenis Pelayanan</p>
          </div>
          <div className="space-y-1 z-10 relative">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rekom ID</span>
              <span className="font-bold text-gray-900">: {rekomID} Orang</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ganti PP</span>
              <span className="font-bold text-gray-900">: {gantiPP} Orang</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Baris Grafik 1 & 2 ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* GRAFIK 1 — Per Kecamatan */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 text-base">Rekap CPMI Berdasarkan Kecamatan</h2>
            <p className="text-xs text-gray-400 mt-0.5">Jumlah CPMI laki-laki dan perempuan per kecamatan asal — semua negara tujuan.</p>
          </div>

          {dataKecamatan.grandTotal === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Tidak ada data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={520}>
                <BarChart
                  data={dataKecamatan.rows}
                  layout="vertical"
                  margin={{ left: 12, right: 60, top: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="kecamatan"
                    width={100}
                    tick={(props) => <TickWithTotal {...props} totalsMap={totalsMapKec} />}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Laki-laki" fill={BIRU} radius={[0, 4, 4, 0]} barSize={9}>
                    <LabelList
                      dataKey="Laki-laki"
                      position="right"
                      style={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
                      formatter={((v: number) => v > 0 ? v : "") as any}
                    />
                  </Bar>
                  <Bar dataKey="Perempuan" fill={BIRU_MUDA} radius={[0, 4, 4, 0]} barSize={9}>
                    <LabelList
                      dataKey="Perempuan"
                      position="right"
                      style={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
                      formatter={((v: number) => v > 0 ? v : "") as any}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <TotalRow
                label="TOTAL KESELURUHAN"
                l={dataKecamatan.totalL}
                p={dataKecamatan.totalP}
                total={dataKecamatan.grandTotal}
              />
            </>
          )}
        </div>

        {/* GRAFIK 2 — Per Negara */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 text-base">Rekap CPMI Luar Negeri Berdasarkan Negara</h2>
            <p className="text-xs text-gray-400 mt-0.5">Jumlah CPMI laki-laki dan perempuan per negara tujuan.</p>
          </div>

          {dataNegara.grandTotal === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Tidak ada data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={dataNegara.rows}
                  margin={{ left: 8, right: 24, top: 20, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="negara" tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Laki-laki" fill={BIRU} radius={[4, 4, 0, 0]} barSize={28}>
                    <LabelList dataKey="Laki-laki" position="top" style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }} formatter={((v: number) => v > 0 ? v : "") as any} />
                  </Bar>
                  <Bar dataKey="Perempuan" fill={BIRU_MUDA} radius={[4, 4, 0, 0]} barSize={28}>
                    <LabelList dataKey="Perempuan" position="top" style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }} formatter={((v: number) => v > 0 ? v : "") as any} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Tabel ringkasan negara */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#DDE5FE] text-gray-700">
                      <th className="text-left px-3 py-2 font-semibold rounded-tl-lg">No</th>
                      <th className="text-left px-3 py-2 font-semibold">Negara</th>
                      <th className="text-center px-3 py-2 font-semibold">L</th>
                      <th className="text-center px-3 py-2 font-semibold">P</th>
                      <th className="text-center px-3 py-2 font-semibold rounded-tr-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataNegara.rows.map((row, i) => (
                      <tr key={row.negara} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-700">{row.negara}</td>
                        <td className="px-3 py-2 text-center text-[#1B4EF5] font-bold">{row["Laki-laki"]}</td>
                        <td className="px-3 py-2 text-center text-[#93AEFB] font-bold">{row["Perempuan"]}</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-900">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#DDE5FE] font-bold">
                      <td colSpan={2} className="px-3 py-2 text-[#1B4EF5] rounded-bl-lg">Total</td>
                      <td className="px-3 py-2 text-center text-[#1B4EF5]">{dataNegara.totalL}</td>
                      <td className="px-3 py-2 text-center text-[#1B4EF5]">{dataNegara.totalP}</td>
                      <td className="px-3 py-2 text-center text-gray-900 rounded-br-lg">{dataNegara.grandTotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Baris Grafik 3 & 4 ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* GRAFIK 3 — Jenis Pelayanan */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-gray-900 text-base">Rekap Jenis Pelayanan</h2>
            <p className="text-xs text-gray-400 mt-0.5">Proporsi jenis pelayanan CPMI dalam periode bulan yang dipilih.</p>
          </div>
          {totalCPMI === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Tidak ada data</div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={240}>
                  <PieChart>
                    <Pie
                      data={dataPelayanan}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90} endAngle={-270}
                    >
                      {dataPelayanan.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? BIRU : BIRU_MUDA} />
                      ))}
                    </Pie>
                    <Tooltip formatter={((v: number) => [`${v} Orang`, ""]) as any} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-900">{totalCPMI}</p>
                    <p className="text-xs text-gray-400">Total Pelayanan</p>
                  </div>
                  <div className="space-y-3">
                    {dataPelayanan.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: i === 0 ? BIRU : BIRU_MUDA }} />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            {item.value} Orang ({totalCPMI > 0 ? ((item.value / totalCPMI) * 100).toFixed(1) : 0}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabel ringkasan pelayanan */}
              <div className="mt-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#DDE5FE] text-gray-700">
                      <th className="text-left px-3 py-2 font-semibold rounded-tl-lg">No</th>
                      <th className="text-left px-3 py-2 font-semibold">Jenis Layanan</th>
                      <th className="text-center px-3 py-2 font-semibold rounded-tr-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataPelayanan.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-700">{item.name}</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-900">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#DDE5FE] font-bold">
                      <td colSpan={2} className="px-3 py-2 text-[#1B4EF5] rounded-bl-lg">TOTAL</td>
                      <td className="px-3 py-2 text-center text-gray-900 rounded-br-lg">{totalCPMI}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>

        {/* GRAFIK 4 — Jabatan */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="font-bold text-gray-900 text-base">Rekap Jabatan CPMI</h2>
              <p className="text-xs text-gray-400 mt-0.5">Jumlah CPMI berdasarkan jabatan sesuai filter negara dan jenis kelamin.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <SelectWrapper>
                <select value={filterNegara} onChange={(e) => setFilterNegara(e.target.value)} className={`${selectClass} text-xs`}>
                  <option value="Semua Negara">Semua Negara</option>
                  {negaraList.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </SelectWrapper>
              <SelectWrapper>
                <select value={filterJK} onChange={(e) => setFilterJK(e.target.value)} className={`${selectClass} text-xs`}>
                  <option value="Semua">Semua</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </SelectWrapper>
            </div>
          </div>

          {dataJabatan.grandTotal === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Tidak ada data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={dataJabatan.rows}
                  layout="vertical"
                  margin={{ left: 12, right: 60, top: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="jabatan"
                    width={110}
                    tick={(props) => <TickWithTotal {...props} totalsMap={totalsMapJabatan} />}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Laki-laki" fill={BIRU} radius={[0, 4, 4, 0]} barSize={10}>
                    <LabelList dataKey="Laki-laki" position="right" style={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} formatter={((v: number) => v > 0 ? v : "") as any} />
                  </Bar>
                  <Bar dataKey="Perempuan" fill={BIRU_MUDA} radius={[0, 4, 4, 0]} barSize={10}>
                    <LabelList dataKey="Perempuan" position="right" style={{ fontSize: 10, fill: "#374151", fontWeight: 600 }} formatter={((v: number) => v > 0 ? v : "") as any} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Tabel ringkasan jabatan */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#DDE5FE] text-gray-700">
                      <th className="text-left px-3 py-2 font-semibold rounded-tl-lg">No</th>
                      <th className="text-left px-3 py-2 font-semibold">Jabatan</th>
                      <th className="text-center px-3 py-2 font-semibold">L</th>
                      <th className="text-center px-3 py-2 font-semibold">P</th>
                      <th className="text-center px-3 py-2 font-semibold rounded-tr-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataJabatan.rows.map((row, i) => (
                      <tr key={row.jabatan} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-700">{row.jabatan}</td>
                        <td className="px-3 py-2 text-center text-[#1B4EF5] font-bold">{row["Laki-laki"]}</td>
                        <td className="px-3 py-2 text-center text-[#93AEFB] font-bold">{row["Perempuan"]}</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-900">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#DDE5FE] font-bold">
                      <td colSpan={2} className="px-3 py-2 text-[#1B4EF5] rounded-bl-lg">Total</td>
                      <td className="px-3 py-2 text-center text-[#1B4EF5]">{dataJabatan.totalL}</td>
                      <td className="px-3 py-2 text-center text-[#1B4EF5]">{dataJabatan.totalP}</td>
                      <td className="px-3 py-2 text-center text-gray-900 rounded-br-lg">{dataJabatan.grandTotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <TotalRow
                label="TOTAL KESELURUHAN"
                l={dataJabatan.totalL}
                p={dataJabatan.totalP}
                total={dataJabatan.grandTotal}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}