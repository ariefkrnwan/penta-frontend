"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

// ─── Types ────────────────────────────────────────────────────────────────────

type DataBKK = {
  id: number;
  tahun: number;
  sekolah: string;
  namaTenagaKerja: string;
  nik: string;
  jenisKelamin: string;
  alamat: string;
  kecamatan: string;
  desa: string;
  provinsiTk: string;
  kabKotaTk: string;
  email: string;
  nomorHp: string;
  pendidikan: string;
  provinsiPd: string;
  kabKotaPd: string;
  namaPerusahaan: string;
  nibPerusahaan: string;
  alamatPerusahaan: string;
  provinsiPa: string;
  kabKotaPa: string;
  namaJabatan: string;
  lapanganUsaha: string;
  tanggalMulai: string;
  gajiUpah: string;
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const dummyData: DataBKK[] = [
  {
    id: 1,
    tahun: 2026,
    sekolah: "SMK MUHAMMADIYAH LUMAJANG",
    namaTenagaKerja: "Ahmad Fauzi",
    nik: "3508012601020001",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Merdeka No. 12, Lumajang",
    kecamatan: "Tempeh",
    desa: "Tempeh Lor",
    provinsiTk: "Jawa Timur",
    kabKotaTk: "Lumajang",
    email: "ahmad.fauzi@email.com",
    nomorHp: "081234567890",
    pendidikan: "SMA/SMK",
    provinsiPd: "Jawa Timur",
    kabKotaPd: "Surabaya",
    namaPerusahaan: "PT Indomarco Prismatama",
    nibPerusahaan: "1234567890123",
    alamatPerusahaan: "Jl. Raya Darmo No.5, Surabaya",
    provinsiPa: "Jawa Timur",
    kabKotaPa: "Surabaya",
    namaJabatan: "Store Crew",
    lapanganUsaha: "Retail Perdagangan",
    tanggalMulai: "2026-01-15",
    gajiUpah: "3500000",
  },
];

// ─── Columns ──────────────────────────────────────────────────────────────────

const columns = [
  "Nama Tenaga Kerja",
  "NIK",
  "Jenis Kelamin",
  "Sekolah",
  "Kecamatan",
  "Desa",
  "Kab/Kota",
  "Email",
  "No HP",
  "Pendidikan",
  "Provinsi Penempatan",
  "Kab/Kota Penempatan",
  "Nama Perusahaan",
  "NIB",
  "Alamat Perusahaan",
  "Provinsi Perusahaan",
  "Kab/Kota Perusahaan",
  "Jabatan",
  "Lapangan Usaha",
  "Tgl Mulai",
  "Gaji/Upah",
  "Aksi",
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

function formatRupiah(val: string) {
  const num = parseInt(val);
  if (isNaN(num)) return "-";
  return "Rp " + num.toLocaleString("id-ID");
}

function formatTanggal(val: string) {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataBKKPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [data, setData] = useState<DataBKK[]>(dummyData);
  const [selectedTahun, setSelectedTahun] = useState<number>(CURRENT_YEAR);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const itemsPerPage = 10;
  const role = useRole();
  const isAdmin = role === "Admin";
  const visibleColumns = isAdmin ? columns.filter((c) => c !== "Aksi") : columns;

  // Filter berdasarkan tahun + search
  const filtered = data.filter(
    (d) =>
      d.tahun === selectedTahun &&
      (d.namaTenagaKerja.toLowerCase().includes(search.toLowerCase()) ||
        d.nik.includes(search) ||
        d.sekolah.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      setData((prev) => prev.filter((d) => d.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-5 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Data BKK</h1>
          <p className="text-sm text-gray-500">Bursa Kerja Khusus — Data Penempatan Tenaga Kerja</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">

          {/* ── Filter Tahun ── */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <svg className="w-4 h-4 text-[#1B4EF5] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 18H5V8h14v13zM7 10h5v5H7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Tahun</span>
            <div className="relative flex items-center">
              <select
                value={selectedTahun}
                onChange={(e) => {
                  setSelectedTahun(Number(e.target.value));
                  setCurrentPage(1);
                }}
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

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-4 py-2 w-64 focus-within:border-[#1B4EF5] transition-all">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama, NIK, sekolah..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
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

      {/* ── Tabel ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[3200px]">
            <thead>
              <tr className="bg-[#DDE5FE] text-gray-700">
                <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-10">No</th>
                {visibleColumns.map((col) => (
                  <th
                    key={col}
                    className={`text-left px-4 py-3 font-semibold whitespace-nowrap ${
                      col === "Aksi" ? "text-center" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3L1 9l11 6l9-4.91V17h2V9zM5 13.18v4L12 21l7-3.82v-4L12 17z" />
                    </svg>
                    Tidak ada data untuk tahun {selectedTahun}
                  </td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-400 text-xs">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{item.namaTenagaKerja}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.nik}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.jenisKelamin === "Laki-laki"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-pink-50 text-pink-600"
                      }`}>
                        {item.jenisKelamin}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">{item.sekolah}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kecamatan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.desa}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kabKotaTk}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.nomorHp}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.pendidikan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.provinsiPd}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kabKotaPd}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{item.namaPerusahaan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.nibPerusahaan || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">{item.alamatPerusahaan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.provinsiPa}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kabKotaPa}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.namaJabatan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.lapanganUsaha}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatTanggal(item.tanggalMulai)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">{formatRupiah(item.gajiUpah)}</td>

                    {/* Aksi */}
                    {!isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/bkk/edit/${item.id}`)}
                          className="flex items-center gap-1.5 bg-[#DDE5FE] hover:bg-[#1B4EF5] text-[#1B4EF5] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => { setDeleteId(item.id); setShowDeleteModal(true); }}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Menampilkan{" "}
            <span className="font-semibold text-gray-600">
              {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filtered.length)}
            </span>{" "}
            dari <span className="font-semibold text-gray-600">{filtered.length}</span> data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1B4EF5] hover:text-[#1B4EF5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {renderPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-[#1B4EF5] text-white shadow"
                      : "border border-gray-200 text-gray-600 hover:border-[#1B4EF5] hover:text-[#1B4EF5]"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1B4EF5] hover:text-[#1B4EF5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal Konfirmasi Hapus ── */}
      {showDeleteModal && (
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
                <h3 className="font-bold text-gray-900">Hapus Data</h3>
                <p className="text-sm text-gray-500">Data yang dihapus tidak bisa dikembalikan.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Apakah kamu yakin ingin menghapus data ini?</p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}