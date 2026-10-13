"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PengaduanDetail {
  id: number;
  tanggal: string;
  sumber: string;
  jenisPengaduan: string;
  deskripsi: string;
}

interface TelusurKasus {
  kronologi: string;
  pihakTerlibat: string;
  fakta: string;
  rekomendasi: string;
  kesimpulan: string;
}

interface TahapOpsional {
  deskripsi: string;
  foto: File | null;
  fotoPreview: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
// TODO: fetch dari backend GET /api/pengaduan/:id

const dummyPengaduan: PengaduanDetail[] = [
  {
    id: 1,
    tanggal: "05/10/2024",
    sumber: "Langsung",
    jenisPengaduan: "Pelayanan AK-1",
    deskripsi: "Proses penerbitan AK-1 memakan waktu lama tanpa kejelasan status.",
  },
  {
    id: 2,
    tanggal: "08/10/2024",
    sumber: "Hotline",
    jenisPengaduan: "BKK",
    deskripsi: "Informasi lowongan kerja dari BKK tidak akurat.",
  },
  {
    id: 3,
    tanggal: "12/10/2024",
    sumber: "Medsos",
    jenisPengaduan: "Lain-lain",
    deskripsi: "Petugas kurang responsif dalam menanggapi pertanyaan masyarakat.",
  },
];

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function FotoUpload({
  preview,
  disabled,
  onChange,
}: {
  preview: string;
  disabled: boolean;
  onChange: (file: File, preview: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(file, ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (preview) {
    return (
      <div>
        <p className="block text-xs font-semibold text-gray-600 mb-1.5">Bukti Foto</p>
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Bukti" className="w-full h-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs font-bold"
            >
              Ganti foto
            </button>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    );
  }

  return (
    <div>
      <p className="block text-xs font-semibold text-gray-600 mb-1.5">Bukti Foto</p>
      <button
        type="button"
        onClick={() => !disabled && ref.current?.click()}
        disabled={disabled}
        className={`w-40 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-[#1B4EF5]/40 hover:border-[#1B4EF5] hover:bg-[#DDE5FE]/30 cursor-pointer"
        }`}
      >
        <svg
          className={`w-8 h-8 ${disabled ? "text-gray-300" : "text-[#1B4EF5]/60"}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className={`text-xs font-semibold ${disabled ? "text-gray-300" : "text-[#1B4EF5]/70"}`}>
          {disabled ? "Tidak ada foto" : "Unggah foto"}
        </span>
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={disabled} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TindakLanjutPage() {
  const params  = useParams();
  const router  = useRouter();
  const role    = useRole();
  const isAdmin = role === "Admin";

  const pengaduanId = Number(params.id);

  // TODO: fetch GET /api/pengaduan/:pengaduanId
  const pengaduan = dummyPengaduan.find((p) => p.id === pengaduanId);

  const [telusur, setTelusur] = useState<TelusurKasus>({
    kronologi: "",
    pihakTerlibat: "",
    fakta: "",
    rekomendasi: "",
    kesimpulan: "",
  });

  const emptyOpsional: TahapOpsional = { deskripsi: "", foto: null, fotoPreview: "" };
  const [polisi, setPolisi]           = useState<TahapOpsional>(emptyOpsional);
  const [mediasi, setMediasi]         = useState<TahapOpsional>(emptyOpsional);
  const [penyelesaian, setPenyelesaian] = useState<TahapOpsional>(emptyOpsional);
  const [isSaving, setIsSaving]       = useState(false);

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white resize-none";
  const disabledClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 cursor-not-allowed resize-none";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

  const Textarea = ({
    value,
    onChange,
    placeholder,
    rows = 3,
    highlight = false,
  }: {
    value: string;
    onChange?: (v: string) => void;
    placeholder: string;
    rows?: number;
    highlight?: boolean;
  }) =>
    isAdmin ? (
      <textarea
        rows={rows}
        value={value}
        disabled
        placeholder="(belum diisi)"
        className={disabledClass}
      />
    ) : (
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ${highlight ? "border-[#1B4EF5]/40 focus:border-[#1B4EF5]" : ""}`}
      />
    );

  if (!pengaduan) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-4 text-center">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 font-semibold">Data pengaduan tidak ditemukan</p>
          <button
            onClick={() => router.push("/pengaduan")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-8 py-2.5 rounded-full hover:bg-[#DDE5FE] transition-all text-sm"
          >
            Kembali ke data
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: await axios.put(`/api/pengaduan/${pengaduanId}/tindak-lanjut`, { telusur, polisi, mediasi, penyelesaian })
      // TODO: upload foto polisi / mediasi / penyelesaian sebagai multipart terpisah
      console.log("PUT /api/pengaduan/" + pengaduanId + "/tindak-lanjut", { telusur, polisi, mediasi, penyelesaian });
      router.push("/pengaduan");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tindak Lanjut Pengaduan</h1>
          <p className="text-sm text-gray-500">
            #{pengaduanId} · {pengaduan.jenisPengaduan} · {pengaduan.tanggal}
          </p>
        </div>
        <button
          onClick={() => router.push("/pengaduan")}
          className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
        >
          Kembali
        </button>
      </div>

      {/* ── Ringkasan pengaduan ── */}
      <div className="bg-[#DDE5FE] rounded-2xl border border-[#1B4EF5]/20 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1B4EF5] shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 9h-2V5h2zm0 4h-2v-2h2z" />
          </svg>
          <span className="text-xs font-bold text-[#1B4EF5] uppercase tracking-wide">Isi Pengaduan</span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">{pengaduan.deskripsi}</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Sumber:</span>
            <span className="text-xs font-semibold text-gray-800">{pengaduan.sumber}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Jenis:</span>
            <span className="text-xs font-semibold text-gray-800">{pengaduan.jenisPengaduan}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          TAHAP 1 — Telusur Kasus
      ══════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#1B4EF5] text-white text-xs font-black flex items-center justify-center shrink-0">
            1
          </span>
          <div>
            <h2 className="text-base font-black text-gray-900">Telusur Kasus</h2>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Kronologi Kejadian</label>
            <Textarea
              value={telusur.kronologi}
              onChange={(v) => setTelusur((p) => ({ ...p, kronologi: v }))}
              placeholder="Uraikan kronologi kejadian secara runtut..."
            />
          </div>
          <div>
            <label className={labelClass}>Pihak yang Terlibat</label>
            <Textarea
              value={telusur.pihakTerlibat}
              onChange={(v) => setTelusur((p) => ({ ...p, pihakTerlibat: v }))}
              placeholder="Sebutkan pihak-pihak yang terlibat dalam kasus ini..."
            />
          </div>
          <div>
            <label className={labelClass}>Fakta di Lapangan</label>
            <Textarea
              value={telusur.fakta}
              onChange={(v) => setTelusur((p) => ({ ...p, fakta: v }))}
              placeholder="Tuliskan fakta yang ditemukan saat penelusuran..."
            />
          </div>
          <div>
            <label className={labelClass}>Rekomendasi Awal</label>
            <Textarea
              value={telusur.rekomendasi}
              onChange={(v) => setTelusur((p) => ({ ...p, rekomendasi: v }))}
              placeholder="Tuliskan rekomendasi awal penanganan..."
            />
          </div>

          {/* Kesimpulan — diberi pembatas */}
          <div className="pt-3 border-t border-dashed border-gray-200">
            <label className="block text-xs font-semibold text-[#1B4EF5] mb-1.5">
              Kesimpulan Hasil Telusur
            </label>
            <Textarea
              value={telusur.kesimpulan}
              onChange={(v) => setTelusur((p) => ({ ...p, kesimpulan: v }))}
              placeholder="Tuliskan kesimpulan dari hasil penelusuran kasus..."
              rows={4}
              highlight
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          TAHAP 2 — Keterkaitan Polisi
      ══════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-black flex items-center justify-center shrink-0">
            2
          </span>
          <div>
            <h2 className="text-base font-black text-gray-900">Keterkaitan dengan Polisi</h2>
            <p className="text-xs text-gray-400 mt-0.5">Opsional — isi jika pengaduan berlanjut ke pihak kepolisian</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Deskripsi</label>
            <Textarea
              value={polisi.deskripsi}
              onChange={(v) => setPolisi((p) => ({ ...p, deskripsi: v }))}
              placeholder="Uraikan keterkaitan kasus dengan pihak kepolisian..."
            />
          </div>
          <FotoUpload
            preview={polisi.fotoPreview}
            disabled={isAdmin}
            onChange={(file, preview) => setPolisi((p) => ({ ...p, foto: file, fotoPreview: preview }))}
          />
        </div>
      </div>

      {/* ══════════════════════════════
          TAHAP 3 — Mediasi Keluarga
      ══════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-black flex items-center justify-center shrink-0">
            3
          </span>
          <div>
            <h2 className="text-base font-black text-gray-900">Mediasi Keluarga</h2>
            <p className="text-xs text-gray-400 mt-0.5">Opsional — isi jika dilakukan mediasi dengan keluarga</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Deskripsi</label>
            <Textarea
              value={mediasi.deskripsi}
              onChange={(v) => setMediasi((p) => ({ ...p, deskripsi: v }))}
              placeholder="Uraikan proses mediasi keluarga yang dilakukan..."
            />
          </div>
          <FotoUpload
            preview={mediasi.fotoPreview}
            disabled={isAdmin}
            onChange={(file, preview) => setMediasi((p) => ({ ...p, foto: file, fotoPreview: preview }))}
          />
        </div>
      </div>

      {/* ══════════════════════════════
          TAHAP 4 — Penyelesaian
      ══════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-black flex items-center justify-center shrink-0">
            4
          </span>
          <div>
            <h2 className="text-base font-black text-gray-900">Penyelesaian</h2>
            <p className="text-xs text-gray-400 mt-0.5">Opsional — isi setelah pengaduan selesai ditangani</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Deskripsi</label>
            <Textarea
              value={penyelesaian.deskripsi}
              onChange={(v) => setPenyelesaian((p) => ({ ...p, deskripsi: v }))}
              placeholder="Uraikan hasil akhir penyelesaian pengaduan..."
            />
          </div>
          <FotoUpload
            preview={penyelesaian.fotoPreview}
            disabled={isAdmin}
            onChange={(file, preview) => setPenyelesaian((p) => ({ ...p, foto: file, fotoPreview: preview }))}
          />
        </div>
      </div>

      {/* ── Tombol — disembunyikan untuk Admin ── */}
      {!isAdmin && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-10 py-3 rounded-full transition-all"
          >
            {isSaving ? "Menyimpan..." : "Simpan Tindak Lanjut"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/pengaduan")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all"
          >
            Batal
          </button>
        </div>
      )}
    </div>
  );
}