"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type SumberAduan = "Langsung" | "Surat" | "Medsos" | "Hotline";
type StatusTL    = "Belum" | "Selesai";

interface PengaduanRow {
  id: number;
  tahun: number;
  tanggal: string;
  sumber: SumberAduan;
  jenisPengaduan: string;
  deskripsi: string;
  status: StatusTL;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
// TODO: fetch dari backend GET /api/pengaduan

const dummyData: PengaduanRow[] = [
  { id: 1, tahun: 2024, tanggal: "05/10/2024", sumber: "Langsung",  jenisPengaduan: "Pelayanan AK-1",       deskripsi: "Proses penerbitan AK-1 memakan waktu lama tanpa kejelasan status.", status: "Selesai" },
  { id: 2, tahun: 2024, tanggal: "08/10/2024", sumber: "Hotline",   jenisPengaduan: "BKK",                  deskripsi: "Informasi lowongan kerja dari BKK tidak akurat.",                  status: "Belum"   },
  { id: 3, tahun: 2024, tanggal: "12/10/2024", sumber: "Medsos",    jenisPengaduan: "Lain-lain",            deskripsi: "Petugas kurang responsif dalam menanggapi pertanyaan masyarakat.", status: "Selesai" },
  { id: 4, tahun: 2024, tanggal: "20/10/2024", sumber: "Surat",     jenisPengaduan: "Administrasi",         deskripsi: "Dokumen administrasi tidak kunjung selesai diproses.",              status: "Belum"   },
  { id: 5, tahun: 2024, tanggal: "01/11/2024", sumber: "Langsung",  jenisPengaduan: "PMI",                  deskripsi: "PMI yang baru kembali tidak mendapat pendampingan.",                status: "Selesai" },
  { id: 6, tahun: 2024, tanggal: "15/11/2024", sumber: "Hotline",   jenisPengaduan: "Pelayanan Antar Kerja",deskripsi: "Antrian pelayanan antar kerja sangat panjang.",                    status: "Belum"   },
];

const SUMBER_LIST: SumberAduan[] = ["Langsung", "Surat", "Medsos", "Hotline"];

const JENIS_LIST = [
  "Administrasi",
  "Pelayanan Antar Kerja",
  "Pelayanan AK-1",
  "PMI",
  "Pelayanan Perusahaan",
  "BKK",
  "Lain-lain",
];

const SUMBER_COLOR: Record<SumberAduan, string> = {
  Langsung: "bg-blue-100 text-blue-700",
  Surat:    "bg-yellow-100 text-yellow-700",
  Medsos:   "bg-purple-100 text-purple-700",
  Hotline:  "bg-green-100 text-green-700",
};

// ─── Kartu statistik ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  caption,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  caption: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border shadow-sm p-5 flex items-start gap-4 ${accent ? "bg-[#1B4EF5] border-[#1B4EF5]" : "bg-white border-gray-100"}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent ? "bg-white/20" : "bg-[#DDE5FE]"}`}>
        <svg className={`w-5 h-5 ${accent ? "text-white" : "text-[#1B4EF5]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div className="min-w-0">
        <p className={`text-sm ${accent ? "text-white/80" : "text-gray-500"}`}>{label}</p>
        <p className={`text-2xl font-black leading-tight ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
        <p className={`text-xs mt-0.5 ${accent ? "text-white/60" : "text-gray-400"}`}>{caption}</p>
      </div>
    </div>
  );
}

// ─── Progress bar helper ──────────────────────────────────────────────────────

function ProgressBar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RekapPengaduanPage() {
  const router = useRouter();

  const [filterTahun, setFilterTahun] = useState<number | "all">("all");

  // ── Opsi tahun dari data ──
  const tahunOptions = Array.from(new Set(dummyData.map((d) => d.tahun))).sort((a, b) => b - a);

  // ── Data sesuai filter ──
  const scoped = dummyData.filter((d) => filterTahun === "all" || d.tahun === filterTahun);
  const total  = scoped.length;

  // 1. Jumlah pengaduan
  const selesai = scoped.filter((d) => d.status === "Selesai").length;
  const belum   = scoped.filter((d) => d.status === "Belum").length;

  // 2. Per sumber
  const perSumber = SUMBER_LIST.map((s) => ({
    sumber: s,
    jumlah: scoped.filter((d) => d.sumber === s).length,
  })).filter((s) => s.jumlah > 0 || total === 0);

  // 3. Per jenis
  const perJenis = JENIS_LIST.map((j) => ({
    jenis: j,
    jumlah: scoped.filter((d) => d.jenisPengaduan === j).length,
  })).filter((j) => j.jumlah > 0);

  // 4. Rekap per tahun untuk tabel bawah
  const tahunRows = tahunOptions.map((y) => {
    const items = dummyData.filter((d) => d.tahun === y);
    return {
      tahun: y,
      total: items.length,
      selesai: items.filter((d) => d.status === "Selesai").length,
      belum: items.filter((d) => d.status === "Belum").length,
    };
  });

  const periode = filterTahun === "all" ? "Semua tahun" : `Tahun ${filterTahun}`;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Rekap Pengaduan Masyarakat</h1>
          <p className="text-sm text-gray-500">Ringkasan data pengaduan yang masuk ke Dinas Tenaga Kerja</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter tahun */}
          <div className="relative">
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="bg-white border-2 border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#1B4EF5] transition-all appearance-none cursor-pointer"
            >
              <option value="all">Semua tahun</option>
              {tahunOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button
            onClick={() => router.push("/pengaduan")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
          >
            Lihat data
          </button>
        </div>
      </div>

      {/* ══════════════════════════════
          1. Jumlah Pengaduan
      ══════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pengaduan"
          value={String(total)}
          caption={periode}
          icon="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 9h-2V5h2zm0 4h-2v-2h2z"
          accent
        />
        <StatCard
          label="Sudah Ditindaklanjuti"
          value={String(selesai)}
          caption={total > 0 ? `${Math.round((selesai / total) * 100)}% dari total` : "—"}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          label="Belum Ditindaklanjuti"
          value={String(belum)}
          caption={total > 0 ? `${Math.round((belum / total) * 100)}% dari total` : "—"}
          icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          label="Jumlah Sumber"
          value={String(perSumber.length)}
          caption="Jenis sumber pengaduan"
          icon="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
        />
      </div>

      {/* ══════════════════════════════
          2 & 3. Sumber & Jenis — berdampingan
      ══════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Sumber Pengaduan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-black text-gray-900">Sumber Pengaduan</h2>
          {total === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Tidak ada data</p>
          ) : (
            <div className="space-y-3">
              {SUMBER_LIST.map((s) => {
                const jumlah = scoped.filter((d) => d.sumber === s).length;
                const colorMap: Record<SumberAduan, string> = {
                  Langsung: "bg-blue-400",
                  Surat:    "bg-yellow-400",
                  Medsos:   "bg-purple-400",
                  Hotline:  "bg-green-400",
                };
                return (
                  <div key={s} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SUMBER_COLOR[s]}`}>
                          {s}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{jumlah}</span>
                    </div>
                    <ProgressBar value={jumlah} total={total} color={colorMap[s]} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Jenis Pengaduan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-black text-gray-900">Jenis Pengaduan</h2>
          {total === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Tidak ada data</p>
          ) : (
            <div className="space-y-3">
              {JENIS_LIST.map((j) => {
                const jumlah = scoped.filter((d) => d.jenisPengaduan === j).length;
                if (jumlah === 0) return null;
                return (
                  <div key={j} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{j}</span>
                      <span className="text-sm font-bold text-gray-700">{jumlah}</span>
                    </div>
                    <ProgressBar value={jumlah} total={total} color="bg-[#1B4EF5]" />
                  </div>
                );
              })}
              {/* Jenis lain yang tidak ada di daftar tetap */}
              {scoped
                .filter((d) => !JENIS_LIST.includes(d.jenisPengaduan))
                .reduce<Record<string, number>>((acc, d) => {
                  acc[d.jenisPengaduan] = (acc[d.jenisPengaduan] || 0) + 1;
                  return acc;
                }, {})
                && Object.entries(
                  scoped
                    .filter((d) => !JENIS_LIST.includes(d.jenisPengaduan))
                    .reduce<Record<string, number>>((acc, d) => {
                      acc[d.jenisPengaduan] = (acc[d.jenisPengaduan] || 0) + 1;
                      return acc;
                    }, {})
                ).map(([j, jumlah]) => (
                  <div key={j} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{j}</span>
                      <span className="text-sm font-bold text-gray-700">{jumlah}</span>
                    </div>
                    <ProgressBar value={jumlah} total={total} color="bg-[#1B4EF5]" />
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          4. Tindak Lanjut — Selesai vs Belum
      ══════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-black text-gray-900">Status Tindak Lanjut</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Selesai */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-semibold">Sudah Selesai</p>
              <p className="text-3xl font-black text-emerald-700">{selesai}</p>
              <p className="text-xs text-emerald-500">{total > 0 ? `${Math.round((selesai / total) * 100)}% dari total` : "—"}</p>
            </div>
          </div>

          {/* Belum */}
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-red-500 font-semibold">Belum Ditindaklanjuti</p>
              <p className="text-3xl font-black text-red-600">{belum}</p>
              <p className="text-xs text-red-400">{total > 0 ? `${Math.round((belum / total) * 100)}% dari total` : "—"}</p>
            </div>
          </div>
        </div>

        {/* Progress visual selesai vs belum */}
        {total > 0 && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-600">Selesai</span>
              <span className="text-red-500">Belum</span>
            </div>
            <div className="h-3 rounded-full bg-red-100 overflow-hidden flex">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{ width: `${(selesai / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════
          Rekap per Tahun
      ══════════════════════════════ */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-gray-900">Rekap per Tahun</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#DDE5FE] text-[#1B4EF5]">
                  <th className="px-4 py-3 text-left font-bold rounded-tl-2xl">Tahun</th>
                  <th className="px-4 py-3 text-center font-bold">Total Pengaduan</th>
                  <th className="px-4 py-3 text-center font-bold">Selesai</th>
                  <th className="px-4 py-3 text-center font-bold">Belum</th>
                  <th className="px-4 py-3 text-left font-bold rounded-tr-2xl">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tahunRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">Tidak ada data</td>
                  </tr>
                ) : (
                  tahunRows.map((r) => (
                    <tr key={r.tahun} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-800">{r.tahun}</td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700">{r.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          {r.selesai}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                          {r.belum}
                        </span>
                      </td>
                      <td className="px-4 py-3 min-w-[160px]">
                        <ProgressBar value={r.selesai} total={r.total} color="bg-emerald-400" />
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