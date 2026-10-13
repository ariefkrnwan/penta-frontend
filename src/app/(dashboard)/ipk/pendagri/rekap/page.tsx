"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DataPendagri = {
  id: number;
  idBulan: string;
  tahun: string;
  namaTenagaKerja: string;
  nik: string;
  alamatTenagaKerja: string;
  desa: string;
  kecamatan: string;
  provinsi: string;
  kabKota: string;
  email: string;
  nomorHp: string;
  jenisKelamin: string;
  pendidikan: string;
  provinsiPenempatan: string;
  kotaPenempatan: string;
  namaPerusahaan: string;
  nibPerusahaan: string;
  alamatPerusahaan: string;
  provinsiPerusahaan: string;
  kotaPerusahaan: string;
  namaJabatan: string;
  lapanganUsaha: string;
  tanggalMulai: string;
  gajiUpah: string;
  keterangan: string;
};

// ─── Kecamatan Lumajang ───────────────────────────────────────────────────────

const KECAMATAN_LUMAJANG = [
  "Lumajang", "Tempeh", "Sukodono", "Tekung", "Kunir", "Yosowilangun",
  "Rowokangkung", "Jatiroto", "Randuagung", "Sumbersuko", "Klakah", "Ranuyoso",
  "Candipuro", "Pasirian", "Tempursari", "Pronojiwo", "Senduro", "Gucialit",
  "Padang", "Pasrujambe", "Kedungjajang",
];

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const allData: DataPendagri[] = [
  {
    id: 1,
    idBulan: "1",
    tahun: "2026",
    namaTenagaKerja: "Budi Santoso",
    nik: "3508010101020001",
    alamatTenagaKerja: "Jl. Raya Tempeh No. 5",
    desa: "Tempeh Lor",
    kecamatan: "Tempeh",
    provinsi: "Jawa Timur",
    kabKota: "Lumajang",
    email: "budi.santoso@email.com",
    nomorHp: "081234567890",
    jenisKelamin: "Laki-laki",
    pendidikan: "SMA/SMK",
    provinsiPenempatan: "Jawa Timur",
    kotaPenempatan: "Surabaya",
    namaPerusahaan: "PT Maju Jaya Bersama",
    nibPerusahaan: "9120012345678",
    alamatPerusahaan: "Jl. Raya Darmo No. 10, Surabaya",
    provinsiPerusahaan: "Jawa Timur",
    kotaPerusahaan: "Surabaya",
    namaJabatan: "Operator Produksi",
    lapanganUsaha: "Manufaktur",
    tanggalMulai: "2026-01-15",
    gajiUpah: "3500000",
    keterangan: "-",
  },
  {
    id: 2,
    idBulan: "2",
    tahun: "2026",
    namaTenagaKerja: "Siti Rahayu",
    nik: "3508015502030002",
    alamatTenagaKerja: "Jl. Mawar No. 3",
    desa: "Randuagung",
    kecamatan: "Randuagung",
    provinsi: "Jawa Timur",
    kabKota: "Lumajang",
    email: "siti.rahayu@email.com",
    nomorHp: "082345678901",
    jenisKelamin: "Perempuan",
    pendidikan: "D3",
    provinsiPenempatan: "DKI Jakarta",
    kotaPenempatan: "Jakarta Selatan",
    namaPerusahaan: "PT Karya Abadi Nusantara",
    nibPerusahaan: "8130023456789",
    alamatPerusahaan: "Jl. Sudirman No. 88, Jakarta",
    provinsiPerusahaan: "DKI Jakarta",
    kotaPerusahaan: "Jakarta Selatan",
    namaJabatan: "Staff Administrasi",
    lapanganUsaha: "Jasa Keuangan",
    tanggalMulai: "2026-02-01",
    gajiUpah: "4500000",
    keterangan: "-",
  },
  // Kecamatan lain kosong — akan terlihat saat dipilih dari dropdown
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
  return new Date(val).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const columns = [
  "ID Bulan", "Tahun", "Nama Tenaga Kerja", "NIK", "Alamat", "Desa",
  "Kecamatan", "Provinsi", "Kab/Kota", "Email", "No HP", "Jenis Kelamin",
  "Pendidikan", "Prov. Penempatan", "Kota Penempatan",
  "Nama Perusahaan", "NIB", "Alamat Perusahaan", "Prov. Perusahaan", "Kota Perusahaan",
  "Jabatan", "Lapangan Usaha", "Tgl Mulai", "Gaji/Upah", "Keterangan",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RekapPendagriPage() {
  const [selectedTahun, setSelectedTahun] = useState(CURRENT_YEAR.toString());
  const [selectedKecamatan, setSelectedKecamatan] = useState(KECAMATAN_LUMAJANG[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = allData.filter(
    (d) => d.tahun === selectedTahun && d.kecamatan === selectedKecamatan
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h1 className="text-2xl font-black text-gray-900">Rekap Pendagri</h1>
          <p className="text-sm text-gray-500">
            Rekap penempatan tenaga kerja dalam negeri per kecamatan
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
                onChange={(e) => { setSelectedTahun(e.target.value); setCurrentPage(1); }}
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

          {/* Filter Kecamatan */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <svg className="w-4 h-4 text-[#1B4EF5] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Kecamatan</span>
            <div className="relative flex items-center">
              <select
                value={selectedKecamatan}
                onChange={(e) => { setSelectedKecamatan(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-transparent text-sm font-semibold text-gray-800 pr-5 focus:outline-none cursor-pointer"
              >
                {KECAMATAN_LUMAJANG.map((kec) => (
                  <option key={kec} value={kec}>{kec}</option>
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

      {/* Info jumlah */}
      <div className="text-sm text-gray-500">
        Kecamatan <span className="font-semibold text-gray-700">{selectedKecamatan}</span> —{" "}
        <span className="font-semibold text-gray-700">{filtered.length}</span> data ditemukan
      </div>

      {/* ── Tabel ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[3600px]">
            <thead>
              <tr className="bg-[#DDE5FE] text-gray-700">
                <th className="text-center px-4 py-3 font-semibold whitespace-nowrap w-10">No</th>
                {columns.map((col) => (
                  <th key={col} className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-16 text-gray-400 text-sm">
                    <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                    Belum ada data untuk Kecamatan {selectedKecamatan} tahun {selectedTahun}
                  </td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-400 text-xs">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600 font-medium">{item.idBulan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600">{item.tahun}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{item.namaTenagaKerja}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.nik}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis">{item.alamatTenagaKerja}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.desa}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kecamatan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.provinsi}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kabKota}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.email || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.nomorHp}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.jenisKelamin === "Laki-laki"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-pink-50 text-pink-600"
                      }`}>
                        {item.jenisKelamin}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.pendidikan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.provinsiPenempatan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kotaPenempatan}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{item.namaPerusahaan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.nibPerusahaan || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis">{item.alamatPerusahaan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.provinsiPerusahaan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kotaPerusahaan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.namaJabatan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.lapanganUsaha}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatTanggal(item.tanggalMulai)}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{formatRupiah(item.gajiUpah)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.keterangan || "-"}</td>
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
              {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)}
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

    </div>
  );
}