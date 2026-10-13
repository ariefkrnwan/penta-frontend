"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

// ─── Types ────────────────────────────────────────────────────────────────────

type Laporan = { nama: string; url: string; ukuran: string };

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  hari: string;
  tanggal: string; // format YYYY-MM-DD
  waktu: string;   // format HH:mm
  tempat: string;
  foto: string[];  // daftar URL foto
  laporan: Laporan | null;
};

type Row =
  | { type: "item"; m: number; item: Kegiatan }
  | { type: "empty"; m: number };

// ─── Konstanta & helper ───────────────────────────────────────────────────────

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function parseTanggal(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { y, m, d };
}

function formatTanggal(value: string) {
  const { y, m, d } = parseTanggal(value);
  return `${d} ${BULAN[m - 1]} ${y}`;
}

function formatWaktu(value: string) {
  return `${value.replace(":", ".")} WIB`;
}

const NAMA_KEGIATAN = "Pertemuan Rutin Paguyuban Disabilitas Kabupaten Lumajang";
const START_YEAR = 2026;

// ─── Data contoh ──────────────────────────────────────────────────────────────
// TODO: ganti dengan data dari backend (URL foto dan laporan dari Spring Boot).
// Foto di bawah hanyalah gambar pengganti agar galeri bisa dilihat.

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
  {
    id: 1,
    namaKegiatan: NAMA_KEGIATAN,
    hari: "Sabtu",
    tanggal: "2026-01-17",
    waktu: "09:00",
    tempat: "Balai Desa Jatian, Kecamatan Pasirian",
    foto: makePhotos(200, 2),
    laporan: { nama: "Laporan-Pertemuan-Januari.pdf", url: "#", ukuran: "1,2 MB" },
  },
  {
    id: 2,
    namaKegiatan: NAMA_KEGIATAN,
    hari: "Sabtu",
    tanggal: "2026-02-14",
    waktu: "10:00",
    tempat: "Aula Dinas Tenaga Kerja Kabupaten Lumajang",
    foto: makePhotos(150, 2),
    laporan: { nama: "Laporan-Pertemuan-Februari.pdf", url: "#", ukuran: "860 KB" },
  },
  {
    id: 3,
    namaKegiatan: NAMA_KEGIATAN,
    hari: "Sabtu",
    tanggal: "2026-03-21",
    waktu: "08:30",
    tempat: "Gedung pertemuan Lumajang",
    foto: makePhotos(20, 2),
    laporan: { nama: "Laporan-Pertemuan-Maret.docx", url: "#", ukuran: "2,4 MB" },
  },
  {
    id: 4,
    namaKegiatan: NAMA_KEGIATAN,
    hari: "Kamis",
    tanggal: "2026-04-16",
    waktu: "09:30",
    tempat: "Balai Latihan Kerja Lumajang",
    foto: makePhotos(310, 2),
    laporan: { nama: "Laporan-Pertemuan-April.pdf", url: "#", ukuran: "1,8 MB" },
  },
  {
    id: 5,
    namaKegiatan: NAMA_KEGIATAN,
    hari: "Rabu",
    tanggal: "2026-06-24",
    waktu: "07:30",
    tempat: "Alun-alun Lumajang",
    foto: makePhotos(100, 2),
    laporan: { nama: "Laporan-Pertemuan-Juni.pdf", url: "#", ukuran: "3,1 MB" },
  },
  {
    id: 6,
    namaKegiatan: NAMA_KEGIATAN,
    hari: "Sabtu",
    tanggal: "2026-09-19",
    waktu: "13:00",
    tempat: "Pendopo Kabupaten Lumajang",
    foto: makePhotos(260, 1),
    laporan: null,
  },
];

// ─── Galeri foto (mosaik) ─────────────────────────────────────────────────────

function PhotoMosaic({
  photos,
  title,
  onOpen,
}: {
  photos: string[];
  title: string;
  onOpen: (index: number) => void;
}) {
  if (photos.length === 0) {
    return (
      <div className="h-64 sm:h-72 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <span className="text-sm">Belum ada foto kegiatan</span>
      </div>
    );
  }

  const shown = photos.slice(0, 3);
  const extra = photos.length - 3;

  const tile = (i: number, cls: string) => (
    <button
      key={i}
      type="button"
      onClick={() => onOpen(i)}
      aria-label={`Lihat foto ${i + 1} dari ${photos.length}: ${title}`}
      className={`group relative overflow-hidden rounded-xl bg-gray-100 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4EF5] ${cls}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shown[i]}
        alt={`${title}, foto ${i + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {i === 2 && extra > 0 && (
        <span className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-xl font-black">
          +{extra}
        </span>
      )}
    </button>
  );

  if (shown.length === 1) {
    return <div className="h-64 sm:h-72">{tile(0, "")}</div>;
  }
  if (shown.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 h-64 sm:h-72">
        {tile(0, "")}
        {tile(1, "")}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 h-64 sm:h-72">
      {tile(0, "col-span-2 row-span-2")}
      {tile(1, "")}
      {tile(2, "")}
    </div>
  );
}

// ─── Lightbox foto ────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  index,
  title,
  onClose,
  onChange,
}: {
  photos: string[];
  index: number;
  title: string;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange((index - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") onChange((index + 1) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onClose, onChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto kegiatan: ${title}`}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl space-y-3">
        {/* Tutup */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute -top-2 right-0 -translate-y-full w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Foto */}
        <div className="relative flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[index]}
            alt={`${title}, foto ${index + 1}`}
            className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onChange((index - 1 + photos.length) % photos.length)}
                aria-label="Foto sebelumnya"
                className="absolute left-2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#1B4EF5] text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onChange((index + 1) % photos.length)}
                aria-label="Foto berikutnya"
                className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#1B4EF5] text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Keterangan */}
        <div className="flex items-center justify-between text-white text-sm">
          <p className="font-semibold truncate pr-4">{title}</p>
          <p className="text-white/70 shrink-0">
            Foto {index + 1} dari {photos.length}
          </p>
        </div>

        {/* Thumbnail */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                aria-label={`Buka foto ${i + 1}`}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Kartu kegiatan ───────────────────────────────────────────────────────────

function KegiatanCard({
  item,
  canManage,
  onOpenPhoto,
  onEdit,
  onDelete,
}: {
  item: Kegiatan;
  canManage: boolean;
  onOpenPhoto: (index: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { m, y } = parseTanggal(item.tanggal);

  const infoRows = [
    {
      label: "Hari dan tanggal",
      value: `${item.hari}, ${formatTanggal(item.tanggal)}`,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      label: "Waktu",
      value: formatWaktu(item.waktu),
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Tempat",
      value: item.tempat,
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    },
  ];

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-5">
      {/* Galeri */}
      <div className="lg:col-span-3 p-4">
        <PhotoMosaic photos={item.foto} title={item.namaKegiatan} onOpen={onOpenPhoto} />
        {item.foto.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {item.foto.length} foto dokumentasi. Klik foto untuk memperbesar.
          </p>
        )}
      </div>

      {/* Detail */}
      <div className="lg:col-span-2 p-6 lg:pl-2 flex flex-col gap-5">
        <div className="space-y-2">
          <span className="inline-block bg-[#DDE5FE] text-[#1B4EF5] text-xs font-bold px-3 py-1 rounded-full">
            {BULAN[m - 1]} {y}
          </span>
          <h3 className="text-lg font-black text-gray-900 leading-snug">{item.namaKegiatan}</h3>
        </div>

        <dl className="space-y-3">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DDE5FE] flex items-center justify-center shrink-0">
                <svg className="w-[18px] h-[18px] text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={row.icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-gray-400">{row.label}</dt>
                <dd className="text-sm font-medium text-gray-800">{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Laporan */}
        <div className="mt-auto space-y-4">
          {item.laporan ? (
            <a
              href={item.laporan.url}
              download
              className="flex items-center gap-3 border border-gray-200 hover:border-[#1B4EF5] rounded-xl px-4 py-3 transition-all group"
            >
              <svg className="w-5 h-5 text-[#1B4EF5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.laporan.nama}</p>
                <p className="text-xs text-gray-400">{item.laporan.ukuran}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#1B4EF5] shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh
              </span>
            </a>
          ) : (
            <p className="text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl px-4 py-3">
              Laporan belum diunggah.
            </p>
          )}

          {/* Aksi: hanya Pegawai */}
          {canManage && (
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 bg-[#DDE5FE] hover:bg-[#1B4EF5] text-[#1B4EF5] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function DataKegiatanKomunitasPage() {
  const router = useRouter();
  const role = useRole();
  // Edit, Hapus, dan Tambah hanya untuk Pegawai (Admin hanya melihat).
  const canManage = role === "Pegawai";

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [data, setData] = useState<Kegiatan[]>(dummyData);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(Math.max(currentYear, START_YEAR));
  const [bulan, setBulan] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ id: number; index: number } | null>(null);

  // ── Data turunan ──
  // Pilihan tahun: dari 2026 ke atas (selalu ada 4 tahun setelah tahun terbaru)
  const latestYear = Math.max(currentYear, ...data.map((d) => parseTanggal(d.tanggal).y));
  const yearOptions = Array.from(
    { length: Math.max(1, latestYear + 4 - START_YEAR + 1) },
    (_, i) => START_YEAR + i
  );

  const yearData = data.filter((d) => parseTanggal(d.tanggal).y === year);
  const monthsDone = new Set(yearData.map((d) => parseTanggal(d.tanggal).m));
  const totalFoto = yearData.reduce((sum, d) => sum + d.foto.length, 0);
  const totalLaporan = yearData.filter((d) => d.laporan).length;

  const keyword = search.trim().toLowerCase();
  const visible = yearData.filter((d) => {
    const matchBulan = bulan === null || parseTanggal(d.tanggal).m === bulan;
    const matchSearch =
      keyword === "" ||
      d.namaKegiatan.toLowerCase().includes(keyword) ||
      d.tempat.toLowerCase().includes(keyword);
    return matchBulan && matchSearch;
  });

  const isFutureMonth = (m: number) =>
    year > currentYear || (year === currentYear && m > currentMonth);

  // Bulan tanpa kegiatan tampil sebagai slot kosong (kecuali bulan yang belum tiba)
  const showEmptySlot = (m: number) =>
    keyword === "" && !isFutureMonth(m) && (bulan === null || bulan === m);

  const rows: Row[] = Array.from({ length: 12 }, (_, i) => 12 - i).flatMap((m): Row[] => {
    const items = visible.filter((d) => parseTanggal(d.tanggal).m === m);
    if (items.length > 0) return items.map((item) => ({ type: "item", m, item }));
    if (showEmptySlot(m)) return [{ type: "empty", m }];
    return [];
  });

  const lightboxItem = lightbox ? data.find((d) => d.id === lightbox.id) : undefined;

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      setData((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Data Kegiatan Komunitas</h1>
          <p className="text-sm text-gray-500">Disabilitas</p>
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
              placeholder="Cari kegiatan atau tempat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Filter Tahun */}
          <div className="relative">
            <select
              value={year}
              onChange={(e) => { setYear(Number(e.target.value)); setBulan(null); }}
              aria-label="Filter tahun"
              className="bg-white border-2 border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#1B4EF5] transition-all appearance-none cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Tambah kegiatan (Pegawai) */}
          {canManage && (
            <button
              onClick={() => router.push("/disabilitas/komunitas")}
              className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all"
            >
              Tambah kegiatan
            </button>
          )}
        </div>
      </div>

      {/* ── Ringkasan tahun: progres 12 bulan ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-500">Kegiatan terlaksana tahun {year}</p>
            <p className="text-3xl font-black text-gray-900">
              {monthsDone.size}
              <span className="text-base font-bold text-gray-400"> dari 12 bulan</span>
            </p>
          </div>
          <p className="text-sm text-gray-500 text-right">
            Kegiatan komunitas dilaksanakan satu kali setiap bulan.
            <br />
            Total {totalFoto} foto dokumentasi dan {totalLaporan} laporan terunggah.
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="h-2 rounded-full bg-[#DDE5FE] overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={12}
          aria-valuenow={monthsDone.size}
          aria-label="Bulan dengan kegiatan terlaksana"
        >
          <div
            className="h-full rounded-full bg-[#1B4EF5] transition-all"
            style={{ width: `${(monthsDone.size / 12) * 100}%` }}
          />
        </div>

        {/* Chip bulan (klik untuk memfilter) */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {BULAN_SINGKAT.map((label, i) => {
            const m = i + 1;
            const done = monthsDone.has(m);
            const future = isFutureMonth(m) && !done;
            const selected = bulan === m;
            return (
              <button
                key={m}
                type="button"
                disabled={future}
                onClick={() => setBulan(selected ? null : m)}
                aria-pressed={selected}
                title={`${BULAN[i]}: ${done ? "ada kegiatan" : future ? "belum tiba" : "belum ada kegiatan"}`}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  done
                    ? "bg-[#1B4EF5] text-white hover:bg-[#1540cc]"
                    : future
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                } ${selected ? "ring-2 ring-[#1B4EF5] ring-offset-2" : ""}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Daftar kegiatan per bulan ── */}
      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
          {keyword
            ? "Tidak ada kegiatan yang cocok dengan pencarian."
            : `Belum ada kegiatan di tahun ${year}.`}
        </div>
      ) : (
        <div className="space-y-5">
          {rows.map((row) =>
            row.type === "item" ? (
              <KegiatanCard
                key={`item-${row.item.id}`}
                item={row.item}
                canManage={canManage}
                onOpenPhoto={(index) => setLightbox({ id: row.item.id, index })}
                onEdit={() => router.push(`/disabilitas/komunitas/edit/${row.item.id}`)}
                onDelete={() => setDeleteId(row.item.id)}
              />
            ) : (
              <div
                key={`empty-${row.m}`}
                className="flex items-center justify-between gap-4 flex-wrap border-2 border-dashed border-gray-200 rounded-2xl px-6 py-5"
              >
                <div>
                  <p className="font-bold text-gray-700">{BULAN[row.m - 1]} {year}</p>
                  <p className="text-sm text-gray-400">Belum ada kegiatan di bulan ini.</p>
                </div>
                {canManage && (
                  <button
                    onClick={() => router.push("/disabilitas/komunitas")}
                    className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
                  >
                    Tambah kegiatan
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* ── Lightbox foto ── */}
      {lightbox && lightboxItem && (
        <Lightbox
          photos={lightboxItem.foto}
          index={lightbox.index}
          title={lightboxItem.namaKegiatan}
          onClose={() => setLightbox(null)}
          onChange={(index) => setLightbox({ id: lightbox.id, index })}
        />
      )}

      {/* ── Modal Konfirmasi Hapus ── */}
      {deleteId !== null && (
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
                onClick={() => setDeleteId(null)}
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