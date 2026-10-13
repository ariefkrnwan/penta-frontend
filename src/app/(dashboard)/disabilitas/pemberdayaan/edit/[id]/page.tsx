"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const HARI_LIST = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const HARI_BY_INDEX = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const MAX_FOTO = 2;
const MAX_FOTO_MB = 5;
const MAX_LAPORAN_MB = 10;
const LAPORAN_REGEX = /\.(pdf|docx?)$/i;

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldKey =
  | "namaKegiatan"
  | "hari"
  | "tanggal"
  | "waktu"
  | "tempat"
  | "jumlahPeserta"
  | "foto"
  | "laporan";

type FotoBaru = { id: string; file: File; url: string };
type LaporanLama = { nama: string; url: string; ukuran: string };

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  hari: string;
  tanggal: string; // format YYYY-MM-DD
  waktu: string;   // format HH:mm
  tempat: string;
  jumlahPeserta: number;
  foto: string[];  // URL foto yang sudah tersimpan
  laporan: LaporanLama | null;
};

// ─── Data contoh ──────────────────────────────────────────────────────────────
// TODO: ganti dengan data dari backend, mis. GET /api/disabilitas/pemberdayaan/{id}

const makePhoto = (hue: number, label: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='hsl(${hue},70%,72%)'/>` +
      `<stop offset='1' stop-color='hsl(${hue + 40},65%,45%)'/>` +
      `</linearGradient></defs>` +
      `<rect width='800' height='600' fill='url(#g)'/>` +
      `<text x='400' y='320' font-family='sans-serif' font-size='42' fill='white' text-anchor='middle'>${label}</text>` +
      `</svg>`
  );

const makePhotos = (hue: number, count: number) =>
  Array.from({ length: count }, (_, i) => makePhoto(hue + i * 22, `Foto ${i + 1}`));

const dummyData: Kegiatan[] = [
  { id: 1, namaKegiatan: "Pelatihan keterampilan menjahit bagi penyandang disabilitas", hari: "Kamis", tanggal: "2026-02-12", waktu: "09:00", tempat: "Balai Latihan Kerja Lumajang", jumlahPeserta: 25, foto: makePhotos(200, 2), laporan: { nama: "Laporan-Pelatihan-Menjahit.pdf", url: "#", ukuran: "1,2 MB" } },
  { id: 2, namaKegiatan: "Workshop kewirausahaan penyandang disabilitas", hari: "Rabu", tanggal: "2026-05-20", waktu: "08:30", tempat: "Gedung pertemuan Lumajang", jumlahPeserta: 30, foto: makePhotos(20, 2), laporan: { nama: "Laporan-Workshop-Kewirausahaan.docx", url: "#", ukuran: "2,4 MB" } },
  { id: 3, namaKegiatan: "Pelatihan olahan makanan dan pemasaran daring", hari: "Kamis", tanggal: "2026-08-27", waktu: "09:30", tempat: "Aula Dinas Tenaga Kerja Kabupaten Lumajang", jumlahPeserta: 20, foto: makePhotos(310, 1), laporan: null },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hariFromDate(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  return HARI_BY_INDEX[new Date(y, m - 1, d).getDay()];
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function EditKegiatanPemberdayaanPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = Number(rawId);

  // TODO: ganti dengan fetch ke backend berdasarkan id
  const kegiatan = dummyData.find((d) => d.id === id);

  // ── State Informasi Kegiatan (terisi data lama) ──
  const [namaKegiatan, setNamaKegiatan] = useState(kegiatan?.namaKegiatan ?? "");
  const [hari, setHari] = useState(kegiatan?.hari ?? "");
  const [tanggal, setTanggal] = useState(kegiatan?.tanggal ?? "");
  const [waktu, setWaktu] = useState(kegiatan?.waktu ?? "");
  const [tempat, setTempat] = useState(kegiatan?.tempat ?? "");
  const [jumlahPeserta, setJumlahPeserta] = useState(kegiatan ? String(kegiatan.jumlahPeserta) : "");

  // ── State Dokumentasi ──
  const [fotoLama, setFotoLama] = useState<string[]>(kegiatan?.foto ?? []);
  const [fotosBaru, setFotosBaru] = useState<FotoBaru[]>([]);
  const [laporanLama, setLaporanLama] = useState<LaporanLama | null>(kegiatan?.laporan ?? null);
  const [laporanBaru, setLaporanBaru] = useState<File | null>(null);

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [dragging, setDragging] = useState(false);

  const totalFoto = fotoLama.length + fotosBaru.length;
  const fotoPenuh = totalFoto >= MAX_FOTO;

  // Bersihkan URL preview foto baru saat halaman ditutup
  const fotosRef = useRef<FotoBaru[]>([]);
  useEffect(() => {
    fotosRef.current = fotosBaru;
  }, [fotosBaru]);
  useEffect(() => {
    return () => fotosRef.current.forEach((f) => URL.revokeObjectURL(f.url));
  }, []);

  const setError = (key: FieldKey, message?: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });

  // ── Tanggal → isi Hari otomatis (tetap bisa diubah) ──
  const handleTanggal = (value: string) => {
    setTanggal(value);
    setError("tanggal");
    if (value) {
      setHari(hariFromDate(value));
      setError("hari");
    }
  };

  // ── Foto ──
  const addFotos = (files: FileList | File[]) => {
    const accepted: FotoBaru[] = [];
    const problems: string[] = [];
    const slots = MAX_FOTO - totalFoto;

    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) {
        problems.push(`${f.name} bukan file gambar`);
        continue;
      }
      if (f.size > MAX_FOTO_MB * 1024 * 1024) {
        problems.push(`${f.name} lebih dari ${MAX_FOTO_MB} MB`);
        continue;
      }
      if (accepted.length >= slots) {
        problems.push(`Maksimal ${MAX_FOTO} foto`);
        break;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f,
        url: URL.createObjectURL(f),
      });
    }

    if (accepted.length > 0) setFotosBaru((prev) => [...prev, ...accepted]);
    setError("foto", problems.length > 0 ? problems.join(". ") + "." : undefined);
  };

  const removeFotoLama = (url: string) => {
    setFotoLama((prev) => prev.filter((u) => u !== url));
    setError("foto");
  };

  const removeFotoBaru = (fotoId: string) => {
    setFotosBaru((prev) => {
      const target = prev.find((f) => f.id === fotoId);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== fotoId);
    });
    setError("foto");
  };

  // ── File laporan ──
  const handleLaporan = (file: File | undefined) => {
    if (!file) return;
    if (!LAPORAN_REGEX.test(file.name)) {
      setError("laporan", "File laporan harus berformat PDF, DOC, atau DOCX.");
      return;
    }
    if (file.size > MAX_LAPORAN_MB * 1024 * 1024) {
      setError("laporan", `Ukuran file laporan maksimal ${MAX_LAPORAN_MB} MB.`);
      return;
    }
    setLaporanBaru(file);
    setError("laporan");
  };

  const hapusLaporan = () => {
    setLaporanBaru(null);
    setLaporanLama(null);
  };

  // Laporan yang sedang berlaku (file baru menggantikan yang lama)
  const laporanAktif = laporanBaru
    ? { nama: laporanBaru.name, ukuran: formatSize(laporanBaru.size), baru: true }
    : laporanLama
    ? { nama: laporanLama.nama, ukuran: laporanLama.ukuran, baru: false }
    : null;

  // ── Simpan ──
  const validate = () => {
    const next: Partial<Record<FieldKey, string>> = {};
    if (!namaKegiatan.trim()) next.namaKegiatan = "Nama kegiatan wajib diisi.";
    if (!hari) next.hari = "Pilih hari kegiatan.";
    if (!tanggal) next.tanggal = "Tanggal kegiatan wajib diisi.";
    if (!waktu) next.waktu = "Waktu kegiatan wajib diisi.";
    if (!tempat.trim()) next.tempat = "Tempat kegiatan wajib diisi.";
    if (!jumlahPeserta.trim()) next.jumlahPeserta = "Jumlah peserta wajib diisi.";
    else if (!/^\d+$/.test(jumlahPeserta.trim()) || Number(jumlahPeserta) < 1)
      next.jumlahPeserta = "Jumlah peserta harus berupa angka bulat minimal 1.";
    if (totalFoto === 0) next.foto = "Unggah minimal 1 foto kegiatan.";
    if (!laporanAktif) next.laporan = "Unggah file laporan kegiatan.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("namaKegiatan", namaKegiatan.trim());
    formData.append("hari", hari);
    formData.append("tanggal", tanggal); // format YYYY-MM-DD
    formData.append("waktu", waktu);     // format HH:mm
    formData.append("tempat", tempat.trim());
    formData.append("jumlahPeserta", jumlahPeserta.trim());
    fotoLama.forEach((url) => formData.append("fotoLama", url)); // foto lama yang dipertahankan
    fotosBaru.forEach((f) => formData.append("foto", f.file));   // foto baru
    if (laporanBaru) formData.append("laporan", laporanBaru);    // hanya jika file laporan diganti

    // TODO: kirim ke Spring Boot, mis.
    // await fetch(`/api/disabilitas/pemberdayaan/${id}`, { method: "PUT", body: formData });
    console.log("Perubahan tersimpan");
    router.push("/disabilitas/pemberdayaan/data");
  };

  const handleBatal = () => {
    router.push("/disabilitas/pemberdayaan/data");
  };

  // ── Style reusable (sama dengan form tambah) ──
  const inputClass = (hasError = false) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white ${
      hasError ? "border-red-400" : "border-gray-200"
    }`;
  const selectClass = (hasError = false) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white appearance-none cursor-pointer ${
      hasError ? "border-red-400" : "border-gray-200"
    }`;
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";
  const errorClass = "text-xs text-red-500 mt-1.5";
  const hintClass = "text-xs text-gray-400 mt-1.5";

  // ── Data tidak ditemukan ──
  if (!kegiatan) {
    return (
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Data Disabilitas</h1>
          <p className="text-sm text-gray-500">Pemberdayaan</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center space-y-4">
          <p className="text-gray-500 text-sm">Data kegiatan tidak ditemukan.</p>
          <button
            onClick={() => router.push("/disabilitas/pemberdayaan/data")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
          >
            Kembali ke data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Data Disabilitas</h1>
          <p className="text-sm text-gray-500">Pemberdayaan</p>
        </div>
        <button
          onClick={() => router.push("/disabilitas/pemberdayaan/data")}
          className="flex items-center gap-2 border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
        >
          Lihat data
        </button>
      </div>

      <form onSubmit={handleSimpan} noValidate className="space-y-6">

        {/* ══════════════════════════════
            SECTION 1 — Informasi Kegiatan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
            Informasi kegiatan
          </h2>

          {/* Nama Kegiatan */}
          <div>
            <label className={labelClass}>Nama Kegiatan</label>
            <input
              type="text"
              placeholder="Masukkan nama kegiatan"
              value={namaKegiatan}
              onChange={(e) => { setNamaKegiatan(e.target.value); setError("namaKegiatan"); }}
              className={inputClass(!!errors.namaKegiatan)}
            />
            {errors.namaKegiatan && <p className={errorClass}>{errors.namaKegiatan}</p>}
          </div>

          {/* Tanggal & Hari */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => handleTanggal(e.target.value)}
                className={inputClass(!!errors.tanggal)}
              />
              {errors.tanggal && <p className={errorClass}>{errors.tanggal}</p>}
            </div>
            <div>
              <label className={labelClass}>Hari</label>
              <div className="relative">
                <select
                  value={hari}
                  onChange={(e) => { setHari(e.target.value); setError("hari"); }}
                  className={selectClass(!!errors.hari)}
                >
                  <option value="">Pilih hari</option>
                  {HARI_LIST.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.hari ? (
                <p className={errorClass}>{errors.hari}</p>
              ) : (
                <p className={hintClass}>Terisi otomatis dari tanggal.</p>
              )}
            </div>
          </div>

          {/* Waktu & Tempat */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Waktu</label>
              <input
                type="time"
                value={waktu}
                onChange={(e) => { setWaktu(e.target.value); setError("waktu"); }}
                className={inputClass(!!errors.waktu)}
              />
              {errors.waktu && <p className={errorClass}>{errors.waktu}</p>}
            </div>
            <div>
              <label className={labelClass}>Tempat</label>
              <input
                type="text"
                placeholder="Lokasi kegiatan"
                value={tempat}
                onChange={(e) => { setTempat(e.target.value); setError("tempat"); }}
                className={inputClass(!!errors.tempat)}
              />
              {errors.tempat && <p className={errorClass}>{errors.tempat}</p>}
            </div>
          </div>

          {/* Jumlah Peserta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Jumlah Peserta</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  placeholder="Contoh: 25"
                  value={jumlahPeserta}
                  onChange={(e) => { setJumlahPeserta(e.target.value); setError("jumlahPeserta"); }}
                  className={`${inputClass(!!errors.jumlahPeserta)} pr-16`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  orang
                </span>
              </div>
              {errors.jumlahPeserta && <p className={errorClass}>{errors.jumlahPeserta}</p>}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Dokumentasi Kegiatan
        ══════════════════════════════ */}
        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            Dokumentasi kegiatan
          </h2>

          {/* Foto Kegiatan */}
          <div>
            <label className={labelClass}>Foto Kegiatan</label>

            {/* Foto tersimpan + foto baru */}
            {totalFoto > 0 && (
              <div className="grid grid-cols-2 gap-3 max-w-lg mb-3">
                {fotoLama.map((url, i) => (
                  <div key={url} className="space-y-1.5">
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Foto tersimpan ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFotoLama(url)}
                        aria-label={`Hapus foto tersimpan ${i + 1}`}
                        className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-red-500 text-white transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Foto tersimpan</p>
                  </div>
                ))}

                {fotosBaru.map((f) => (
                  <div key={f.id} className="space-y-1.5">
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.url} alt={f.file.name} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-[#1B4EF5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Baru
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFotoBaru(f.id)}
                        aria-label={`Hapus foto ${f.file.name}`}
                        className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-red-500 text-white transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 truncate" title={f.file.name}>{f.file.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(f.file.size)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Area upload: hanya tampil jika masih ada slot */}
            {!fotoPenuh && (
              <label
                htmlFor="foto-kegiatan"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFotos(e.dataTransfer.files);
                }}
                className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer transition-all focus-within:border-[#1B4EF5] ${
                  dragging
                    ? "border-[#1B4EF5] bg-[#DDE5FE]"
                    : errors.foto
                    ? "border-red-300 hover:border-[#1B4EF5] hover:bg-[#F4F7FF]"
                    : "border-gray-300 hover:border-[#1B4EF5] hover:bg-[#F4F7FF]"
                }`}
              >
                <svg className="w-8 h-8 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Klik untuk menambah foto, atau tarik ke sini
                </span>
                <span className="text-xs text-gray-400">
                  {totalFoto}/{MAX_FOTO} foto
                </span>
                <input
                  id="foto-kegiatan"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files) addFotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            )}

            {errors.foto ? (
              <p className={errorClass}>{errors.foto}</p>
            ) : (
              <p className={hintClass}>
                {fotoPenuh
                  ? `Batas ${MAX_FOTO} foto tercapai. Hapus salah satu foto untuk menggantinya.`
                  : `Format gambar (JPG, PNG, dll). Maksimal ${MAX_FOTO_MB} MB per foto, hingga ${MAX_FOTO} foto.`}
              </p>
            )}
          </div>

          {/* File Laporan */}
          <div>
            <label className={labelClass}>File Laporan</label>

            {/* Input tersembunyi (dipakai oleh tombol Ganti dan area upload) */}
            <input
              id="file-laporan"
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={(e) => {
                handleLaporan(e.target.files?.[0]);
                e.target.value = "";
              }}
            />

            {laporanAktif ? (
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-lg bg-[#DDE5FE] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{laporanAktif.nama}</p>
                  <p className="text-xs text-gray-400">
                    {laporanAktif.ukuran}
                    {laporanAktif.baru ? ", file baru (belum tersimpan)" : ", file tersimpan"}
                  </p>
                </div>
                <label
                  htmlFor="file-laporan"
                  className="cursor-pointer text-xs font-semibold text-[#1B4EF5] hover:text-white bg-[#DDE5FE] hover:bg-[#1B4EF5] px-3 py-1.5 rounded-lg transition-all"
                >
                  Ganti
                </label>
                <button
                  type="button"
                  onClick={hapusLaporan}
                  className="text-xs font-semibold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-all"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <label
                htmlFor="file-laporan"
                className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-all ${
                  errors.laporan
                    ? "border-red-300 hover:border-[#1B4EF5] hover:bg-[#F4F7FF]"
                    : "border-gray-300 hover:border-[#1B4EF5] hover:bg-[#F4F7FF]"
                }`}
              >
                <svg className="w-6 h-6 text-[#1B4EF5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Pilih file laporan</span>
              </label>
            )}

            {errors.laporan ? (
              <p className={errorClass}>{errors.laporan}</p>
            ) : (
              <p className={hintClass}>PDF atau Word (.doc, .docx). Maksimal {MAX_LAPORAN_MB} MB.</p>
            )}
          </div>
        </div>

        {/* ── Tombol Aksi ── */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="submit"
            className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold px-10 py-3 rounded-full transition-all"
          >
            Simpan perubahan
          </button>
          <button
            type="button"
            onClick={handleBatal}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}