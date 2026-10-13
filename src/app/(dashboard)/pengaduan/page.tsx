"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

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
  {
    id: 1,
    tahun: 2024,
    tanggal: "05/10/2024",
    sumber: "Langsung",
    jenisPengaduan: "Pelayanan AK-1",
    deskripsi: "Proses penerbitan AK-1 memakan waktu lama tanpa kejelasan status.",
    status: "Selesai",
  },
  {
    id: 2,
    tahun: 2024,
    tanggal: "08/10/2024",
    sumber: "Hotline",
    jenisPengaduan: "BKK",
    deskripsi: "Informasi lowongan kerja dari BKK tidak akurat.",
    status: "Belum",
  },
  {
    id: 3,
    tahun: 2024,
    tanggal: "12/10/2024",
    sumber: "Medsos",
    jenisPengaduan: "Lain-lain",
    deskripsi: "Petugas kurang responsif dalam menanggapi pertanyaan masyarakat.",
    status: "Selesai",
  },
];

// ─── Badge helpers ────────────────────────────────────────────────────────────

const SUMBER_COLOR: Record<SumberAduan, string> = {
  Langsung: "bg-blue-100 text-blue-700",
  Surat:    "bg-yellow-100 text-yellow-700",
  Medsos:   "bg-purple-100 text-purple-700",
  Hotline:  "bg-green-100 text-green-700",
};

const STATUS_COLOR: Record<StatusTL, string> = {
  "Belum":   "bg-red-100 text-red-600",
  "Selesai": "bg-emerald-100 text-emerald-700",
};

function SumberBadge({ sumber }: { sumber: SumberAduan }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${SUMBER_COLOR[sumber]}`}>
      {sumber}
    </span>
  );
}

function StatusBadge({ status }: { status: StatusTL }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[status]}`}>
      {status}
    </span>
  );
}

// ─── Modal konfirmasi hapus ───────────────────────────────────────────────────

function ModalHapus({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Hapus Pengaduan</h3>
            <p className="text-sm text-gray-500">Data yang dihapus tidak bisa dikembalikan.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Apakah kamu yakin ingin menghapus pengaduan ini?</p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PengaduanPage() {
  const router  = useRouter();
  const role    = useRole();
  const isAdmin = role === "Admin";

  const [data, setData]           = useState<PengaduanRow[]>(dummyData);
  const [search, setSearch]       = useState("");
  const [filterSumber, setFilterSumber] = useState<SumberAduan | "">("");
  const [filterTahun, setFilterTahun] = useState<number>(0);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const filtered = data.filter((row) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      row.jenisPengaduan.toLowerCase().includes(q) ||
      row.deskripsi.toLowerCase().includes(q);
    const matchSumber = !filterSumber || row.sumber === filterSumber;
    const matchTahun = filterTahun === 0 || row.tahun === filterTahun;
    return matchSearch && matchSumber && matchTahun;
  });

  // Tambah opsi tahun dinamis dari data
  const tahunOptions = Array.from(
    new Set(data.map((d) => d.tahun))
  ).sort((a, b) => b - a);

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      // TODO: await axios.delete(`/api/pengaduan/${deleteId}`)
      setData((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pengaduan Masyarakat</h1>
          <p className="text-sm text-gray-500">Daftar pengaduan yang masuk ke Dinas Tenaga Kerja bidang Penta</p>
        </div>  

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-4 py-2 w-64 focus-within:border-[#1B4EF5] transition-all">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari pengaduan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Filter sumber */}
          <div className="relative">
            <select
              value={filterSumber}
              onChange={(e) => setFilterSumber(e.target.value as SumberAduan | "")}
              className="bg-white border-2 border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#1B4EF5] transition-all appearance-none cursor-pointer"
            >
              <option value="">Semua sumber</option>
              {(["Langsung", "Surat", "Medsos", "Hotline"] as SumberAduan[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Filter tahun */}
          <div className="relative">
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(Number(e.target.value))}
              className="bg-white border-2 border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#1B4EF5] transition-all appearance-none cursor-pointer"
            >
              <option value={0}>Semua tahun</option>   {/* ← tambah baris ini */}
              {tahunOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Rekap — sebelum tombol Tambah */}
          <button
            onClick={() => router.push("/pengaduan/rekap")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
          >
            Rekap
          </button>

          {/* Tambah — Pegawai only */}
          {!isAdmin && (
            <button
              onClick={() => router.push("/pengaduan/tambah")}
              className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah
            </button>
          )}
        </div>
      </div>

      {/* ── Tabel ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#DDE5FE] text-[#1B4EF5]">
                <th className="px-4 py-3 text-left font-bold rounded-tl-2xl w-10">No</th>
                <th className="px-4 py-3 text-left font-bold whitespace-nowrap">Tanggal</th>
                <th className="px-4 py-3 text-left font-bold">Sumber</th>
                <th className="px-4 py-3 text-left font-bold whitespace-nowrap">Jenis Pengaduan</th>
                <th className="px-4 py-3 text-left font-bold">Deskripsi</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-left font-bold rounded-tr-2xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                    Tidak ada data pengaduan
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-[#DDE5FE]/20 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.tanggal}</td>
                    <td className="px-4 py-3"><SumberBadge sumber={row.sumber} /></td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{row.jenisPengaduan}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs">
                      <p className="truncate">{row.deskripsi}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/pengaduan/${row.id}/tindak-lanjut`}
                          className="flex items-center gap-1.5 bg-[#DDE5FE] hover:bg-[#1B4EF5] text-[#1B4EF5] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Tindak Lanjut
                        </Link>
                        {!isAdmin && (
                          <button
                            onClick={() => setDeleteId(row.id)}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal hapus ── */}
      {deleteId !== null && (
        <ModalHapus
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}