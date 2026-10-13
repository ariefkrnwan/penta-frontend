"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUMBER_OPTIONS = ["Langsung", "Surat", "Media sosial", "Hotline"] as const;
type SumberAduan = typeof SUMBER_OPTIONS[number];

const JENIS_OPTIONS = [
  "Administrasi",
  "Pelayanan Antar Kerja",
  "Pelayanan AK-1",
  "PMI",
  "Pelayanan Perusahaan",
  "BKK",
  "Lain-lain",
] as const;
type JenisPengaduan = typeof JENIS_OPTIONS[number];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PengaduanTambahPage() {
  const router = useRouter();

  const [sumber, setSumber]             = useState<SumberAduan | "">("");
  const [jenis, setJenis]               = useState<JenisPengaduan | "">("");
  const [jenisLainnya, setJenisLainnya] = useState("");
  const [deskripsi, setDeskripsi]       = useState("");
  const [isSaving, setIsSaving]         = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!sumber) e.sumber = "Pilih sumber aduan";
    if (!jenis)  e.jenis  = "Pilih jenis pengaduan";
    if (jenis === "Lain-lain" && !jenisLainnya.trim())
      e.jenisLainnya = "Sebutkan jenis pengaduan";
    if (!deskripsi.trim()) e.deskripsi = "Deskripsi tidak boleh kosong";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const payload = {
        sumber,
        jenisPengaduan: jenis === "Lain-lain" ? jenisLainnya : jenis,
        deskripsi,
      };
      // TODO: await axios.post("/api/pengaduan", payload);
      console.log("POST /api/pengaduan", payload);
      router.push("/pengaduan");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const RadioOption = ({
    name,
    value,
    checked,
    onChange,
    label,
  }: {
    name: string;
    value: string;
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <label
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium select-none ${
        checked
          ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
          : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40 bg-white"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-[#1B4EF5]"
      />
      {label}
    </label>
  );

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tambah Pengaduan</h1>
          <p className="text-sm text-gray-500">Catat pengaduan masyarakat yang masuk</p>
        </div>
        <button
          onClick={() => router.push("/pengaduan")}
          className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
        >
          Lihat data
        </button>
      </div>

      {/* ── STEP 1 ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#1B4EF5] text-white text-xs font-black flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="text-base font-black text-gray-900">Sumber Aduan</h2>
        </div>

        <div>
          <label className={labelClass}>Pilih dari mana pengaduan ini berasal</label>
          <div className="flex flex-wrap gap-3">
            {SUMBER_OPTIONS.map((opt) => (
              <RadioOption
                key={opt}
                name="sumber"
                value={opt}
                checked={sumber === opt}
                onChange={() => { setSumber(opt); setErrors((e) => ({ ...e, sumber: "" })); }}
                label={opt}
              />
            ))}
          </div>
          {errors.sumber && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.sumber}
            </p>
          )}
        </div>
      </div>

      {/* ── STEP 2 ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#1B4EF5] text-white text-xs font-black flex items-center justify-center shrink-0">
            2
          </span>
          <h2 className="text-base font-black text-gray-900">Jenis Pengaduan</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelClass}>Pilih kategori pengaduan</label>
            <div className="flex flex-wrap gap-3">
              {JENIS_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  name="jenis"
                  value={opt}
                  checked={jenis === opt}
                  onChange={() => {
                    setJenis(opt);
                    setJenisLainnya("");
                    setErrors((e) => ({ ...e, jenis: "", jenisLainnya: "" }));
                  }}
                  label={opt}
                />
              ))}
            </div>
            {errors.jenis && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.jenis}
              </p>
            )}
          </div>

          {jenis === "Lain-lain" && (
            <div>
              <label className={labelClass}>Sebutkan jenis pengaduan</label>
              <input
                type="text"
                placeholder="Tuliskan pengaduan secara spesifik..."
                value={jenisLainnya}
                onChange={(e) => { setJenisLainnya(e.target.value); setErrors((er) => ({ ...er, jenisLainnya: "" })); }}
                className={inputClass}
              />
              {errors.jenisLainnya && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.jenisLainnya}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── STEP 3 ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#1B4EF5] text-white text-xs font-black flex items-center justify-center shrink-0">
            3
          </span>
          <h2 className="text-base font-black text-gray-900">Deskripsi Aduan</h2>
        </div>

        <div>
          <label className={labelClass}>Isi / uraian pengaduan</label>
          <textarea
            placeholder="Tuliskan isi pengaduan secara lengkap dan jelas..."
            value={deskripsi}
            onChange={(e) => { setDeskripsi(e.target.value); setErrors((er) => ({ ...er, deskripsi: "" })); }}
            rows={5}
            className={`${inputClass} resize-none`}
          />
          {errors.deskripsi && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.deskripsi}
            </p>
          )}
        </div>
      </div>

      {/* ── Tombol ── */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-10 py-3 rounded-full transition-all"
        >
          {isSaving ? "Menyimpan..." : "Simpan Pengaduan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/pengaduan")}
          className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all"
        >
          Batal
        </button>
      </div>
    </div>
  );
}