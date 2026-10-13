"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const WARNA_RAGAM: Record<string, string> = {
  "Fisik": "#1B4EF5", "Mental": "#8B5CF6",
  "Intelektual": "#F59E0B", "Sensorik": "#10B981",
};
const WARNA_STATUS: Record<string, string> = { "PKWT": "#1B4EF5", "PKWTT": "#93AEFB" };
const WARNA_PENDIDIKAN: Record<string, string> = {
  "SD": "#1B4EF5", "SMP": "#3B82F6", "SMA": "#8B5CF6",
  "D3": "#F59E0B", "S1": "#10B981", "S2": "#EF4444", "S3": "#EC4899",
};

const TAHUN_LIST = [2023, 2024, 2025, 2026];
const RAGAM_LIST = ["Fisik", "Mental", "Intelektual", "Sensorik"];
const PENDIDIKAN_LIST = ["SD", "SMP", "SMA", "D3", "S1", "S2", "S3"];
const STATUS_LIST = ["PKWT", "PKWTT"];

const rawPerusahaan = [
  ...Array.from({ length: 8 },  () => ({ tahun: 2026, perusahaan: "Mustika Jaya",    ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "L" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2026, perusahaan: "Mustika Jaya",    ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, perusahaan: "Mustika Jaya",    ragam: "Mental",      pendidikan: "SMP", statusKepegawaian: "PKWTT", jenisKelamin: "L" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, perusahaan: "Mustika Jaya",    ragam: "Intelektual", pendidikan: "SD",  statusKepegawaian: "PKWTT", jenisKelamin: "P" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2026, perusahaan: "Mustika Jaya",    ragam: "Sensorik",    pendidikan: "D3",  statusKepegawaian: "PKWT",  jenisKelamin: "L" })),
  ...Array.from({ length: 6 },  () => ({ tahun: 2026, perusahaan: "PT Maju Bersama", ragam: "Fisik",       pendidikan: "S1",  statusKepegawaian: "PKWTT", jenisKelamin: "L" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2026, perusahaan: "PT Maju Bersama", ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, perusahaan: "PT Maju Bersama", ragam: "Sensorik",    pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "L" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, perusahaan: "PT Maju Bersama", ragam: "Mental",      pendidikan: "D3",  statusKepegawaian: "PKWTT", jenisKelamin: "P" })),
  ...Array.from({ length: 10 }, () => ({ tahun: 2026, perusahaan: "Indomaret",       ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "L" })),
  ...Array.from({ length: 7 },  () => ({ tahun: 2026, perusahaan: "Indomaret",       ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, perusahaan: "Indomaret",       ragam: "Intelektual", pendidikan: "SMP", statusKepegawaian: "PKWTT", jenisKelamin: "L" })),
  ...Array.from({ length: 5 },  () => ({ tahun: 2026, perusahaan: "Alfamart",        ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "P" })),
  ...Array.from({ length: 3 },  () => ({ tahun: 2026, perusahaan: "Alfamart",        ragam: "Sensorik",    pendidikan: "S1",  statusKepegawaian: "PKWTT", jenisKelamin: "L" })),
  ...Array.from({ length: 2 },  () => ({ tahun: 2026, perusahaan: "Alfamart",        ragam: "Mental",      pendidikan: "SMP", statusKepegawaian: "PKWT",  jenisKelamin: "P" })),
  ...Array.from({ length: 12 }, () => ({ tahun: 2025, perusahaan: "Mustika Jaya",    ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "L" })),
  ...Array.from({ length: 6 },  () => ({ tahun: 2025, perusahaan: "Indomaret",       ragam: "Fisik",       pendidikan: "SMA", statusKepegawaian: "PKWT",  jenisKelamin: "P" })),
  ...Array.from({ length: 4 },  () => ({ tahun: 2025, perusahaan: "PT Maju Bersama", ragam: "Mental",      pendidikan: "D3",  statusKepegawaian: "PKWTT", jenisKelamin: "L" })),
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
      <p className="font-bold text-gray-800 mb-1">{name}</p>
      <p className="text-gray-600">Jumlah: <span className="font-bold text-gray-900">{value} orang</span></p>
      <p className="text-gray-600">Persentase: <span className="font-bold" style={{ color: p.fill }}>{p.persen}%</span></p>
      <p className="text-gray-600">L: <span className="font-bold">{p.l}</span> &nbsp; P: <span className="font-bold">{p.p}</span></p>
    </div>
  );
};

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, persen }: any) => {
  if (persen < 5) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {persen}%
    </text>
  );
};

function PieSection({ title, subtitle, data, total }: {
  title: string; subtitle: string;
  data: { name: string; value: number; l: number; p: number; persen: number; fill: string }[];
  total: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-gray-900 text-base">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      {total === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Tidak ada data</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={95} paddingAngle={3}
                dataKey="value" labelLine={false} label={renderLabel}>
                {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#DDE5FE] text-gray-700">
                <th className="text-left px-3 py-2 font-semibold rounded-tl-xl">Kategori</th>
                <th className="text-center px-3 py-2 font-semibold">L</th>
                <th className="text-center px-3 py-2 font-semibold">P</th>
                <th className="text-center px-3 py-2 font-semibold">Jumlah</th>
                <th className="text-center px-3 py-2 font-semibold rounded-tr-xl">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.name} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: row.fill }} />
                      <span className="font-medium text-gray-700">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-[#1B4EF5]">{row.l}</td>
                  <td className="px-3 py-2 text-center font-bold text-[#93AEFB]">{row.p}</td>
                  <td className="px-3 py-2 text-center font-black text-gray-900">{row.value}</td>
                  <td className="px-3 py-2 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: `${row.fill}20`, color: row.fill }}>{row.persen}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#DDE5FE] font-bold">
                <td className="px-3 py-2 text-[#1B4EF5] rounded-bl-xl">TOTAL</td>
                <td className="px-3 py-2 text-center text-[#1B4EF5]">{data.reduce((s, d) => s + d.l, 0)}</td>
                <td className="px-3 py-2 text-center text-[#1B4EF5]">{data.reduce((s, d) => s + d.p, 0)}</td>
                <td className="px-3 py-2 text-center text-gray-900">{total}</td>
                <td className="px-3 py-2 text-center text-gray-900 rounded-br-xl">100%</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
}

function hitungPie(
  rows: typeof rawPerusahaan,
  groupKey: keyof typeof rawPerusahaan[0],
  warnaMap: Record<string, string>,
  keyList: string[],
) {
  const total = rows.length;
  return keyList.map((key) => {
    const subset = rows.filter((d) => d[groupKey] === key);
    const l = subset.filter((d) => d.jenisKelamin === "L").length;
    const p = subset.filter((d) => d.jenisKelamin === "P").length;
    const value = subset.length;
    const persen = total > 0 ? parseFloat(((value / total) * 100).toFixed(1)) : 0;
    return { name: key, value, l, p, persen, fill: warnaMap[key] ?? "#CBD5E1" };
  }).filter((d) => d.value > 0);
}

export default function RekapDisabilitasPerusahaanPage() {
  const [tahun, setTahun] = useState(2026);
  const [filterPerusahaan, setFilterPerusahaan] = useState("Semua");
  const [filterPendidikan, setFilterPendidikan] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const perusahaanList = useMemo(() => {
    const set = new Set(rawPerusahaan.map((d) => d.perusahaan));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() =>
    rawPerusahaan.filter((d) => {
      if (d.tahun !== tahun) return false;
      if (filterPerusahaan !== "Semua" && d.perusahaan !== filterPerusahaan) return false;
      if (filterPendidikan !== "Semua" && d.pendidikan !== filterPendidikan) return false;
      if (filterStatus !== "Semua" && d.statusKepegawaian !== filterStatus) return false;
      return true;
    }), [tahun, filterPerusahaan, filterPendidikan, filterStatus]);

  const total = filtered.length;

  const pieRagam      = useMemo(() => hitungPie(filtered, "ragam",            WARNA_RAGAM,       RAGAM_LIST),       [filtered]);
  const piePendidikan = useMemo(() => hitungPie(filtered, "pendidikan",       WARNA_PENDIDIKAN,  PENDIDIKAN_LIST),  [filtered]);
  const pieStatus     = useMemo(() => hitungPie(filtered, "statusKepegawaian",WARNA_STATUS,      STATUS_LIST),      [filtered]);

  const selectClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] cursor-pointer appearance-none pr-8";

  const SelectWrap = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      {children}
      <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-gray-500">Rekapitulasi Data</p>
          <h1 className="text-2xl font-black text-gray-900">Disabilitas Tenaga Kerja Perusahaan</h1>
          <p className="text-sm text-gray-400 mt-1">Rekap data tenaga kerja disabilitas di perusahaan — {tahun}</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-500 font-medium">Tahun</span>
          <SelectWrap>
            <select value={tahun} onChange={(e) => setTahun(Number(e.target.value))} className={selectClass}>
              {TAHUN_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </SelectWrap>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 flex-wrap">
        <span className="text-sm font-semibold text-gray-600">Filter:</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Perusahaan</span>
          <SelectWrap>
            <select value={filterPerusahaan} onChange={(e) => setFilterPerusahaan(e.target.value)} className={`${selectClass} text-xs`}>
              <option value="Semua">Semua Perusahaan</option>
              {perusahaanList.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </SelectWrap>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Pendidikan</span>
          <SelectWrap>
            <select value={filterPendidikan} onChange={(e) => setFilterPendidikan(e.target.value)} className={`${selectClass} text-xs`}>
              <option value="Semua">Semua</option>
              {PENDIDIKAN_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </SelectWrap>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Status Kepegawaian</span>
          <SelectWrap>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`${selectClass} text-xs`}>
              <option value="Semua">Semua</option>
              {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </SelectWrap>
        </div>
        {(filterPerusahaan !== "Semua" || filterPendidikan !== "Semua" || filterStatus !== "Semua") && (
          <button onClick={() => { setFilterPerusahaan("Semua"); setFilterPendidikan("Semua"); setFilterStatus("Semua"); }}
            className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        )}
        <div className="ml-auto bg-[#DDE5FE] rounded-xl px-4 py-2 text-xs font-bold text-[#1B4EF5]">
          Total: {total} orang
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-20 h-20 rounded-full bg-[#DDE5FE] -translate-y-4 translate-x-4 opacity-50" />
          <div className="w-11 h-11 rounded-full bg-[#DDE5FE] flex items-center justify-center shrink-0 z-10">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <div className="z-10">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-black text-gray-900">{total}</p>
            <p className="text-xs text-gray-400">orang</p>
          </div>
        </div>
        {RAGAM_LIST.map((ragam) => {
          const count = filtered.filter((d) => d.ragam === ragam).length;
          const persen = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
          return (
            <div key={ragam} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-20 h-20 rounded-full -translate-y-4 translate-x-4 opacity-20"
                style={{ background: WARNA_RAGAM[ragam] }} />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: WARNA_RAGAM[ragam] }} />
                <p className="text-xs text-gray-500 font-medium">{ragam}</p>
              </div>
              <p className="text-2xl font-black text-gray-900">{count} <span className="text-sm font-normal text-gray-400">orang</span></p>
              <p className="text-xs font-bold mt-1" style={{ color: WARNA_RAGAM[ragam] }}>{persen}%</p>
            </div>
          );
        })}
      </div>

      {/* 3 Pie Chart */}
      <div className="grid grid-cols-3 gap-4">
        <PieSection title="Ragam Disabilitas" subtitle="Distribusi berdasarkan ragam disabilitas"
          data={pieRagam} total={total} />
        <PieSection title="Pendidikan Terakhir" subtitle="Distribusi berdasarkan tingkat pendidikan"
          data={piePendidikan} total={total} />
        <PieSection title="Status Kepegawaian" subtitle="Distribusi PKWT dan PKWTT"
          data={pieStatus} total={total} />
      </div>
    </div>
  );
}