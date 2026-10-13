"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { useRole } from "@/hooks/useRole";

type DataAK1 = {
  id: number;
  noAk1: string;
  nama: string;
  nik: string;
  tanggalTerdaftar: string;
  email: string;
  jenisKelamin: string;
  pendidikan: string;
  jurusan: string;
  tahunLulus: string;
  keahlian: string;
  kecamatan: string;
  desa: string;
  alamat: string;
  noHp: string;
  tempatLahir: string;
  tanggalLahir: string;
  statusPerkawinan: string;
  tujuan: string;
  kategoriTujuan: string;
};

const dummyData: DataAK1[] = [
  {
    id: 1,
    noAk1: "AK1-2025-001",
    nama: "Ahmad Fauzi",
    nik: "3508019876543210",
    tanggalTerdaftar: "10/01/2025",
    email: "ahmad@gmail.com",
    jenisKelamin: "L",
    pendidikan: "SMA",
    jurusan: "IPA",
    tahunLulus: "2022",
    keahlian: "Perdagangan Eceran & Grosir",
    kecamatan: "Tempeh",
    desa: "Tempeh Lor",
    alamat: "Jl. Merdeka No. 10 RT 01 RW 02",
    noHp: "081234567890",
    tempatLahir: "Lumajang",
    tanggalLahir: "15/03/2003",
    statusPerkawinan: "Belum kawin",
    tujuan: "Indomaret",
    kategoriTujuan: "Dalam Negeri",
  },
];

export default function DataAK1Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [data, setData] = useState<DataAK1[]>(dummyData);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const itemsPerPage = 10;
  const role = useRole();
  const isAdmin = role === "Admin";

  // ── Bulk Import State ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<1 | 2 | 3>(1);
  const [importPreview, setImportPreview] = useState<DataAK1[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const parseExcelDate = (val: unknown): string => {
    if (!val) return "";
    if (typeof val === "number") {
      const date = XLSX.SSF.parse_date_code(val);
      if (date) return `${String(date.d).padStart(2, "0")}/${String(date.m).padStart(2, "0")}/${date.y}`;
    }
    return String(val);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    setImportErrors([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

      // Cari baris header (yang mengandung "NO. AK1" atau "NAMA")
      let headerRow = -1;
      for (let i = 0; i < raw.length; i++) {
        const row = raw[i] as string[];
        if (row.some((c) => String(c).includes("AK1") || String(c).toUpperCase() === "NAMA")) {
          headerRow = i;
          break;
        }
      }
      if (headerRow === -1) {
        setImportErrors(["Format file tidak dikenali. Pastikan file adalah template AK-1 yang benar."]);
        setImportStep(2);
        setImportPreview([]);
        return;
      }

      const dataRows = raw.slice(headerRow + 1);
      const parsed: DataAK1[] = [];
      const errors: string[] = [];

      dataRows.forEach((row: unknown, idx: number) => {
        const r = row as (string | number)[];
        // Skip baris kosong atau baris total/jumlah
        const noAk1Val = String(r[1] ?? "").trim();
        const namaVal = String(r[2] ?? "").trim();
        if (!noAk1Val && !namaVal) return;
        if (namaVal.toLowerCase().includes("jumlah")) return;

        const barisTampil = idx + headerRow + 2;

        // Validasi field wajib
        if (!namaVal) {
          errors.push(`Baris ${barisTampil}: Nama kosong — dilewati`);
          return;
        }
        if (!String(r[3] ?? "").trim()) {
          errors.push(`Baris ${barisTampil}: NIK kosong — dilewati`);
          return;
        }

        // Jenis kelamin: kolom 6=L, 7=P
        const isL = String(r[6] ?? "").trim() === "√" || String(r[6] ?? "").trim() === "1";
        const jenisKelamin = isL ? "L" : "P";

        // Status perkawinan: kolom 25=Kawin, 26=Belum, 27=Janda, 28=Duda
        let statusPerkawinan = "";
        if (String(r[25] ?? "").trim() === "1" || String(r[25] ?? "").trim() === "√") statusPerkawinan = "Kawin";
        else if (String(r[26] ?? "").trim() === "1" || String(r[26] ?? "").trim() === "√") statusPerkawinan = "Belum kawin";
        else if (String(r[27] ?? "").trim() === "1" || String(r[27] ?? "").trim() === "√") statusPerkawinan = "Janda";
        else if (String(r[28] ?? "").trim() === "1" || String(r[28] ?? "").trim() === "√") statusPerkawinan = "Duda";

        parsed.push({
          id: Date.now() + idx,
          noAk1: noAk1Val || String(r[0] ?? "").trim(),
          nama: namaVal,
          nik: String(r[3] ?? "").trim(),
          tanggalTerdaftar: parseExcelDate(r[4]),
          email: String(r[5] ?? "").trim(),
          jenisKelamin,
          pendidikan: String(r[8] ?? "").trim(),
          jurusan: String(r[9] ?? "").trim(),
          tahunLulus: String(r[10] ?? "").trim(),
          keahlian: "",
          kecamatan: String(r[11] ?? "").trim(),
          desa: String(r[12] ?? "").trim(),
          alamat: String(r[13] ?? "").trim(),
          noHp: String(r[14] ?? "").trim(),
          tempatLahir: String(r[15] ?? "").trim(),
          tanggalLahir: parseExcelDate(r[16]),
          statusPerkawinan,
          tujuan: String(r[r.length - 1] ?? "").trim(),
          kategoriTujuan: "",
        });
      });

      setImportPreview(parsed);
      setImportErrors(errors);
      setImportStep(2);
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    try {
      // TODO: await axios.post("/api/ak1/import", { data: importPreview });
      setData((prev) => [...prev, ...importPreview]);
      setImportStep(3);
    } catch {
      setImportErrors(["Terjadi kesalahan saat mengimpor data."]);
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setShowImportModal(false);
    setImportStep(1);
    setImportPreview([]);
    setImportErrors([]);
    setImportFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filtered = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.nik.includes(search) ||
      d.noAk1.toLowerCase().includes(search.toLowerCase())
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

  const columns = [
    "No. AK-1", "Nama", "NIK", "Tanggal Terdaftar", "Email",
    "Jenis Kelamin", "Pendidikan", "Jurusan", "Tahun Lulus",
    "Keahlian", "Kecamatan", "Desa/Kelurahan", "Alamat", "No. HP",
    "Tempat Lahir", "Tanggal Lahir", "Status Perkawinan", "Tujuan", "Kategori",
    ...(!isAdmin ? ["Aksi"] : []),
  ];

  return (
    <div className="space-y-5 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
            <h1 className="text-2xl font-black text-gray-900">Daftar AK-1</h1>
            <p className="text-sm text-gray-500">Data Kartu Kuning Pencarian Kerja</p> 
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-4 py-2 w-72 focus-within:border-[#1B4EF5] transition-all">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari NIK, nama, atau No. AK-1..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Import Excel */}
          <button
            onClick={() => { setShowImportModal(true); setImportStep(1); }}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#1B4EF5] text-gray-700 hover:text-[#1B4EF5] text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 11h-2v3h-2v-3H7l4-4 4 4zm0-6V3.5L18.5 7z" />
            </svg>
            Import Excel
          </button>

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
          <table className="w-full text-sm min-w-[2000px]">
            <thead>
              <tr className="bg-[#DDE5FE] text-gray-700">
                {columns.map((col) => (
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
                  <td colSpan={columns.length} className="text-center py-16 text-gray-400 text-sm">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-[#1B4EF5]">{item.noAk1}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{item.nama}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.nik}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.tanggalTerdaftar}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#1B4EF5] underline cursor-pointer">{item.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.jenisKelamin === "L"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-pink-100 text-pink-700"
                      }`}>
                        {item.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.pendidikan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.jurusan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.tahunLulus}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[240px]">{item.keahlian || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.kecamatan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.desa}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px]">{item.alamat}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.noHp}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.tempatLahir}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.tanggalLahir}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.statusPerkawinan === "Kawin"
                          ? "bg-green-100 text-green-700"
                          : item.statusPerkawinan === "Belum kawin"
                          ? "bg-blue-100 text-blue-700"
                          : item.statusPerkawinan === "Janda"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {item.statusPerkawinan}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.tujuan}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.kategoriTujuan === "Luar Negeri"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {item.kategoriTujuan}
                      </span>
                    </td>

                    {/* Aksi */}
                    {!isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/ipk/ak1/edit/${item.id}`)}
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
        <div className="flex items-center justify-end gap-1 px-4 py-4 border-t border-gray-100">
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
              <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                ...
              </span>
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

      {/* ── Modal Bulk Import ── */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl space-y-5 p-6">

            {/* Header modal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DDE5FE] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 11h-2v3h-2v-3H7l4-4 4 4zm0-6V3.5L18.5 7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Import Excel AK-1</h3>
                  <p className="text-xs text-gray-500">
                    {importStep === 1 && "Langkah 1 — Upload file"}
                    {importStep === 2 && "Langkah 2 — Preview data"}
                    {importStep === 3 && "Langkah 3 — Selesai"}
                  </p>
                </div>
              </div>
              <button onClick={resetImport} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    importStep >= s ? "bg-[#1B4EF5] text-white" : "bg-gray-100 text-gray-400"
                  }`}>{s}</div>
                  {s < 3 && <div className={`h-0.5 w-12 transition-all ${importStep > s ? "bg-[#1B4EF5]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            {/* ── Step 1: Upload ── */}
            {importStep === 1 && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#1B4EF5] rounded-2xl p-10 text-center cursor-pointer transition-all group"
                >
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 group-hover:text-[#1B4EF5] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 11h-2v3h-2v-3H7l4-4 4 4zm0-6V3.5L18.5 7z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-600 group-hover:text-[#1B4EF5]">Klik untuk pilih file Excel</p>
                  <p className="text-xs text-gray-400 mt-1">Format: .xlsx — Template harian AK-1</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex justify-end">
                  <button onClick={resetImport} className="border-2 border-gray-200 text-gray-600 font-semibold py-2 px-6 rounded-xl text-sm hover:border-gray-300 transition-all">
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Preview ── */}
            {importStep === 2 && (
              <div className="space-y-4">
                {/* Info file */}
                <div className="flex items-center gap-2 bg-[#DDE5FE] rounded-xl px-4 py-2.5">
                  <svg className="w-4 h-4 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6" />
                  </svg>
                  <span className="text-sm font-medium text-[#1B4EF5] truncate">{importFileName}</span>
                  <span className="ml-auto text-sm font-bold text-[#1B4EF5]">{importPreview.length} baris valid</span>
                </div>

                {/* Errors */}
                {importErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 space-y-1 max-h-28 overflow-y-auto">
                    {importErrors.map((err, i) => (
                      <p key={i} className="text-xs text-red-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">⚠️</span>{err}
                      </p>
                    ))}
                  </div>
                )}

                {/* Preview tabel */}
                {importPreview.length > 0 && (
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-xs min-w-[900px]">
                        <thead className="bg-[#DDE5FE] sticky top-0">
                          <tr>
                            {["No. AK-1","Nama","NIK","Tgl Daftar","Jenis Kelamin","Pendidikan","Jurusan","Kecamatan","Desa","No. HP","Tujuan"].map((h) => (
                              <th key={h} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {importPreview.slice(0, 10).map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-[#1B4EF5] font-medium">{row.noAk1}</td>
                              <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-800">{row.nama}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.nik}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.tanggalTerdaftar}</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.jenisKelamin === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                                  {row.jenisKelamin === "L" ? "L" : "P"}
                                </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.pendidikan}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.jurusan}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.kecamatan}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.desa}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.noHp}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{row.tujuan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {importPreview.length > 10 && (
                      <p className="text-center text-xs text-gray-400 py-2 border-t border-gray-100">
                        Menampilkan 10 dari {importPreview.length} baris
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setImportStep(1); setImportPreview([]); setImportErrors([]); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-all"
                  >
                    Ganti file
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    disabled={importPreview.length === 0 || isImporting}
                    className="flex-1 bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                  >
                    {isImporting ? "Mengimpor..." : `Import ${importPreview.length} data`}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Selesai ── */}
            {importStep === 3 && (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Import Berhasil!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-[#1B4EF5]">{importPreview.length} data</span> berhasil diimpor ke sistem
                  </p>
                  {importErrors.length > 0 && (
                    <p className="text-xs text-orange-500 mt-1">{importErrors.length} baris dilewati karena data tidak lengkap</p>
                  )}
                </div>
                <button
                  onClick={resetImport}
                  className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold px-8 py-2.5 rounded-full transition-all text-sm"
                >
                  Selesai
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}