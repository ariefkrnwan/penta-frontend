"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DataLoker = {
  id: number;
  idBulan: string;
  tahun: string;
  namaPerusahaan: string;
  nibPerusahaan: string;
  lapanganUsaha: string;
  namaJabatan: string;
  jumlahDibutuhkan: string;
  jenisKelamin: string;
  pendidikan: string;
};

type RekapPerusahaan = {
  namaPerusahaan: string;
  nibPerusahaan: string;
  lapanganUsaha: string;
  jabatan: { namaJabatan: string; jumlah: number; jenisKelamin: string; pendidikan: string }[];
  totalPengajuan: number;   // berapa kali perusahaan ini mengajukan loker
  totalDibutuhkan: number;  // total jumlah posisi yang dibutuhkan
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const allData: DataLoker[] = [
  // Perusahaan A — 3 kali pengajuan bulan 9/2026
  { id: 1, idBulan: "9", tahun: "2026", namaPerusahaan: "PT Maju Jaya Bersama", nibPerusahaan: "9120012345678", lapanganUsaha: "Manufaktur", namaJabatan: "Operator Produksi", jumlahDibutuhkan: "10", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK" },
  { id: 2, idBulan: "9", tahun: "2026", namaPerusahaan: "PT Maju Jaya Bersama", nibPerusahaan: "9120012345678", lapanganUsaha: "Manufaktur", namaJabatan: "Quality Control", jumlahDibutuhkan: "5", jenisKelamin: "Laki-laki / Perempuan", pendidikan: "D3" },
  { id: 3, idBulan: "9", tahun: "2026", namaPerusahaan: "PT Maju Jaya Bersama", nibPerusahaan: "9120012345678", lapanganUsaha: "Manufaktur", namaJabatan: "Supervisor Produksi", jumlahDibutuhkan: "2", jenisKelamin: "Laki-laki", pendidikan: "S1" },
  // Perusahaan B — 2 kali pengajuan bulan 9/2026
  { id: 4, idBulan: "9", tahun: "2026", namaPerusahaan: "PT Karya Abadi Nusantara", nibPerusahaan: "8130023456789", lapanganUsaha: "Jasa Keuangan", namaJabatan: "Staff Administrasi", jumlahDibutuhkan: "4", jenisKelamin: "Perempuan", pendidikan: "D3" },
  { id: 5, idBulan: "9", tahun: "2026", namaPerusahaan: "PT Karya Abadi Nusantara", nibPerusahaan: "8130023456789", lapanganUsaha: "Jasa Keuangan", namaJabatan: "Teller", jumlahDibutuhkan: "3", jenisKelamin: "Perempuan", pendidikan: "S1" },
  // Perusahaan C — 1 pengajuan bulan 9/2026
  { id: 6, idBulan: "9", tahun: "2026", namaPerusahaan: "PT Prima Suajtera International", nibPerusahaan: "1234567890123", lapanganUsaha: "Manufaktur", namaJabatan: "Mekanik Produksi", jumlahDibutuhkan: "5", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK" },
  // Data bulan lain
  { id: 7, idBulan: "1", tahun: "2026", namaPerusahaan: "PT Maju Jaya Bersama", nibPerusahaan: "9120012345678", lapanganUsaha: "Manufaktur", namaJabatan: "Operator Produksi", jumlahDibutuhkan: "8", jenisKelamin: "Laki-laki", pendidikan: "SMA/SMK" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BULAN_LABEL: Record<string, string> = {
  "1": "Januari", "2": "Februari", "3": "Maret", "4": "April",
  "5": "Mei", "6": "Juni", "7": "Juli", "8": "Agustus",
  "9": "September", "10": "Oktober", "11": "November", "12": "Desember",
};

const BULAN_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
const CURRENT_MONTH = String(new Date().getMonth() + 1);

// ─── Component ────────────────────────────────────────────────────────────────

export default function RekapLokerPage() {
  const [selectedTahun, setSelectedTahun] = useState(CURRENT_YEAR.toString());
  const [selectedBulan, setSelectedBulan] = useState(CURRENT_MONTH);

  // Group by perusahaan
  const rekap = useMemo<RekapPerusahaan[]>(() => {
    const filtered = allData.filter(
      (d) => d.tahun === selectedTahun && d.idBulan === selectedBulan
    );

    const map = new Map<string, RekapPerusahaan>();
    filtered.forEach((d) => {
      const key = d.namaPerusahaan;
      if (!map.has(key)) {
        map.set(key, {
          namaPerusahaan: d.namaPerusahaan,
          nibPerusahaan: d.nibPerusahaan,
          lapanganUsaha: d.lapanganUsaha,
          jabatan: [],
          totalPengajuan: 0,
          totalDibutuhkan: 0,
        });
      }
      const entry = map.get(key)!;
      entry.jabatan.push({
        namaJabatan: d.namaJabatan,
        jumlah: parseInt(d.jumlahDibutuhkan) || 0,
        jenisKelamin: d.jenisKelamin,
        pendidikan: d.pendidikan,
      });
      entry.totalPengajuan += 1;
      entry.totalDibutuhkan += parseInt(d.jumlahDibutuhkan) || 0;
    });

    return Array.from(map.values()).sort((a, b) =>
      b.totalDibutuhkan - a.totalDibutuhkan
    );
  }, [selectedTahun, selectedBulan]);

  const totalPengajuan = rekap.reduce((s, r) => s + r.totalPengajuan, 0);
  const totalDibutuhkan = rekap.reduce((s, r) => s + r.totalDibutuhkan, 0);

  return (
    <div className="space-y-5 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Rekap Loker</h1>
          <p className="text-sm text-gray-500">
            Informasi Pasar Kerja — Rekap lowongan kerja per bulan
          </p>
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
                onChange={(e) => setSelectedTahun(e.target.value)}
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
          <button
            onClick={() => alert("Ekspor Excel belum terhubung ke backend.")}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-600 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 7H8v2h5v-2zm0 4H8v2h5v-2zM8 9h2V7H8v2zm6-5v3h3l-3-3z" />
            </svg>
            Ekspor Excel
          </button>

          {/* Ekspor PDF */}
          <button
            onClick={() => alert("Ekspor PDF belum terhubung ke backend.")}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-500 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 9H8v-2h5v2zm2-4H8V5h7v2z" />
            </svg>
            Ekspor PDF
          </button>
        </div>
      </div>

      {/* ── Tab Bulan ── */}
      <div className="flex gap-2 flex-wrap">
        {BULAN_OPTIONS.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBulan(b)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              selectedBulan === b
                ? "bg-[#1B4EF5] text-white shadow"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#1B4EF5] hover:text-[#1B4EF5]"
            }`}
          >
            {BULAN_LABEL[b]}
          </button>
        ))}
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Periode</p>
          <p className="text-lg font-black text-gray-900">
            {BULAN_LABEL[selectedBulan]} {selectedTahun}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Total Perusahaan</p>
          <p className="text-3xl font-black text-[#1B4EF5]">{rekap.length}</p>
          <p className="text-xs text-gray-400 mt-1">{totalPengajuan} kali pengajuan loker</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Total Posisi Dibutuhkan</p>
          <p className="text-3xl font-black text-[#1B4EF5]">{totalDibutuhkan}</p>
          <p className="text-xs text-gray-400 mt-1">dari semua perusahaan</p>
        </div>
      </div>

      {/* ── Tabel Rekap ── */}
      {rekap.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 16.49 1 14.67 1c-1.11 0-2.1.54-2.67 1.4l-.67.9-.67-.91C10.43 1.54 9.44 1 8.33 1 6.51 1 5 2.54 5 4.66c0 .46.11.9.18 1.34H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" />
          </svg>
          <p className="text-sm">Belum ada data loker untuk {BULAN_LABEL[selectedBulan]} {selectedTahun}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rekap.map((perusahaan, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Header perusahaan */}
              <div className="flex items-center justify-between px-5 py-4 bg-[#DDE5FE]/40 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1B4EF5] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{perusahaan.namaPerusahaan}</p>
                    <p className="text-xs text-gray-500">
                      {perusahaan.lapanganUsaha}
                      {perusahaan.nibPerusahaan && ` · NIB: ${perusahaan.nibPerusahaan}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Pengajuan</p>
                    <p className="text-lg font-black text-[#1B4EF5]">{perusahaan.totalPengajuan}x</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Dibutuhkan</p>
                    <p className="text-lg font-black text-gray-900">{perusahaan.totalDibutuhkan} orang</p>
                  </div>
                </div>
              </div>

              {/* Tabel jabatan */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 w-8">No</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Nama Jabatan</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Jenis Kelamin</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Pendidikan</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 w-28">Jml. butuh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {perusahaan.jabatan.map((jab, jIdx) => (
                    <tr key={jIdx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-400">{jIdx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{jab.namaJabatan}</td>
                      <td className="px-4 py-3 text-gray-600">{jab.jenisKelamin || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">{jab.pendidikan || "-"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-[#DDE5FE] text-[#1B4EF5] text-sm font-bold">
                          {jab.jumlah}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td colSpan={4} className="px-5 py-2.5 text-xs font-semibold text-gray-500 text-right">Total</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-[#1B4EF5] text-white text-sm font-bold">
                        {perusahaan.totalDibutuhkan}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}