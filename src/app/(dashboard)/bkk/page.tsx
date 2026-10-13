"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, School, ChevronRight, Plus, Upload, FileCheck, Pencil, Trash2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SmkItem = {
  id: number;
  nama: string;
  skStd: string | null;   // nama file atau null jika belum upload
  skPak: string | null;
};

// ─── Data awal dari constants (nanti diganti fetch API) ───────────────────────

import { SMK_LUMAJANG } from "@/constants/smk-lumajang";

const initialData: SmkItem[] = SMK_LUMAJANG.map((s) => ({
  id: s.id,
  nama: s.nama,
  skStd: null,
  skPak: null,
}));

// ─── Component ────────────────────────────────────────────────────────────────

export default function BkkPage() {
  const router = useRouter();
  const [data, setData] = useState<SmkItem[]>(initialData);
  const [search, setSearch] = useState("");

  // Modal tambah/edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editTarget, setEditTarget] = useState<SmkItem | null>(null);
  const [formNama, setFormNama] = useState("");

  // Modal hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SmkItem | null>(null);

  // Modal upload SK
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{ smk: SmkItem; jenis: "skStd" | "skPak" } | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const filtered = data.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  );

  // ── CRUD Handlers ──────────────────────────────────────────────────────────

  const openTambah = () => {
    setEditTarget(null);
    setFormNama("");
    setShowFormModal(true);
  };

  const openEdit = (smk: SmkItem) => {
    setEditTarget(smk);
    setFormNama(smk.nama);
    setShowFormModal(true);
  };

  const handleSaveForm = () => {
    if (!formNama.trim()) return;
    if (editTarget) {
      setData((prev) =>
        prev.map((s) => (s.id === editTarget.id ? { ...s, nama: formNama.trim() } : s))
      );
    } else {
      const newId = Math.max(0, ...data.map((s) => s.id)) + 1;
      setData((prev) => [...prev, { id: newId, nama: formNama.trim(), skStd: null, skPak: null }]);
    }
    setShowFormModal(false);
  };

  const openDelete = (smk: SmkItem) => {
    setDeleteTarget(smk);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // ── Upload SK ──────────────────────────────────────────────────────────────

  const openUpload = (smk: SmkItem, jenis: "skStd" | "skPak") => {
    setUploadTarget({ smk, jenis });
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const handleUpload = () => {
    if (!uploadTarget || !uploadFile) return;
    // TODO: kirim file ke backend, simpan path dari response
    setData((prev) =>
      prev.map((s) =>
        s.id === uploadTarget.smk.id
          ? { ...s, [uploadTarget.jenis]: uploadFile.name }
          : s
      )
    );
    setShowUploadModal(false);
    setUploadTarget(null);
    setUploadFile(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Bursa Kerja Khusus (BKK)</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pilih sekolah untuk menginput data penempatan tenaga kerja
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-4 py-2 w-64 focus-within:border-[#1B4EF5] transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari nama sekolah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Tambah SMK */}
          <button
            onClick={openTambah}
            className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#1B4EF5] text-gray-700 hover:text-[#1B4EF5] font-bold text-sm px-5 py-2.5 rounded-full transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tambah SMK
          </button>

          {/* Lihat data */}
          <button
            onClick={() => router.push("/bkk/data")}
            className="flex items-center gap-2 border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all whitespace-nowrap"
          >
            Lihat data
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-500">
        Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
        dari <span className="font-semibold text-gray-700">{data.length}</span> sekolah
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#DDE5FE] text-gray-700">
              <th className="text-center px-4 py-3 font-semibold w-12">NO</th>
              <th className="text-left px-4 py-3 font-semibold">NAMA LEMBAGA</th>
              <th className="text-center px-4 py-3 font-semibold w-36">SK STD</th>
              <th className="text-center px-4 py-3 font-semibold w-36">SK PAK</th>
              <th className="text-center px-4 py-3 font-semibold w-44">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  <School className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  Tidak ada sekolah yang ditemukan
                </td>
              </tr>
            ) : (
              filtered.map((smk, idx) => (
                <tr key={smk.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-center text-xs">{idx + 1}</td>

                  {/* Nama */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-[#1B4EF5] flex-shrink-0" />
                      <span className="font-medium text-gray-800">{smk.nama}</span>
                    </div>
                  </td>

                  {/* SK STD */}
                  <td className="px-4 py-3 text-center">
                    {smk.skStd ? (
                      <button
                        onClick={() => openUpload(smk, "skStd")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold rounded-lg transition-all"
                        title={smk.skStd}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        Lihat / Ganti
                      </button>
                    ) : (
                      <button
                        onClick={() => openUpload(smk, "skStd")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#DDE5FE] text-gray-400 hover:text-[#1B4EF5] text-xs font-semibold rounded-lg border border-dashed border-gray-300 hover:border-[#1B4EF5] transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </button>
                    )}
                  </td>

                  {/* SK PAK */}
                  <td className="px-4 py-3 text-center">
                    {smk.skPak ? (
                      <button
                        onClick={() => openUpload(smk, "skPak")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold rounded-lg transition-all"
                        title={smk.skPak}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        Lihat / Ganti
                      </button>
                    ) : (
                      <button
                        onClick={() => openUpload(smk, "skPak")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#DDE5FE] text-gray-400 hover:text-[#1B4EF5] text-xs font-semibold rounded-lg border border-dashed border-gray-300 hover:border-[#1B4EF5] transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </button>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(smk)}
                        className="flex items-center gap-1.5 bg-[#DDE5FE] hover:bg-[#1B4EF5] text-[#1B4EF5] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(smk)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </button>
                      <button
                        onClick={() => router.push(`/bkk/${smk.id}/form`)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#1B4EF5] text-white text-xs font-semibold rounded-lg hover:bg-[#1540d4] transition-colors"
                      >
                        Pilih
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal Tambah / Edit SMK ── */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DDE5FE] flex items-center justify-center shrink-0">
                <School className="w-5 h-5 text-[#1B4EF5]" />
              </div>
              <h3 className="font-bold text-gray-900">
                {editTarget ? "Edit Nama SMK" : "Tambah SMK Baru"}
              </h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nama Lembaga
              </label>
              <input
                type="text"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: SMK Negeri 1 Lumajang"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleSaveForm()}
                autoFocus
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowFormModal(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSaveForm}
                disabled={!formNama.trim()}
                className="flex-1 bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                {editTarget ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Hapus ── */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hapus SMK</h3>
                <p className="text-sm text-gray-500">Tindakan ini tidak bisa dibatalkan.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Yakin ingin menghapus <span className="font-semibold text-gray-800">{deleteTarget.nama}</span>?
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Upload SK ── */}
      {showUploadModal && uploadTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DDE5FE] flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-[#1B4EF5]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Upload {uploadTarget.jenis === "skStd" ? "SK STD" : "SK PAK"}
                </h3>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{uploadTarget.smk.nama}</p>
              </div>
            </div>

            {/* File yang sudah ada */}
            {uploadTarget.smk[uploadTarget.jenis] && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <FileCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-xs text-green-700 truncate">
                  {uploadTarget.smk[uploadTarget.jenis]}
                </span>
              </div>
            )}

            {/* Input file */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {uploadTarget.smk[uploadTarget.jenis] ? "Ganti dokumen" : "Pilih dokumen"}{" "}
                <span className="font-normal text-gray-400">(PDF / DOC)</span>
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#DDE5FE] file:text-[#1B4EF5] file:font-semibold hover:file:bg-[#1B4EF5] hover:file:text-white file:transition-all cursor-pointer"
              />
              {uploadFile && (
                <p className="mt-1.5 text-xs text-gray-500">Dipilih: {uploadFile.name}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile}
                className="flex-1 bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}