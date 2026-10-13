"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LansiaData {
  id: number;
  // Identitas Diri
  nik: string;
  namaLengkap: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  alamat: string;
  provinsi: string;
  kabupaten: string;
  noTelepon: string;
  email: string;
  // Status Kerja & Pengalaman
  statusPekerjaan: string;
  tmtPenempatan: string; // YYYY-MM-DD
  namaPerusahaan: string;
  sertifikatKompetensi: string;
  jabatan: string;
  sektorUsaha: string;
  pendidikanTerakhir: string;
  keahlian: string;
  pengalamanKerja: string;
  statusKepegawaian: string;
  hambatan: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
// TODO: fetch dari backend GET /api/lansia/:id

const dummyData: LansiaData[] = [
  {
    id: 1,
    nik: "3508015507500001",
    namaLengkap: "Soekarno Wirjoatmodjo",
    jenisKelamin: "laki-laki",
    tempatLahir: "Lumajang",
    tanggalLahir: "1950-07-15",
    alamat: "Jl. Basuki Rahmat No. 22, Lumajang",
    provinsi: "jawa-timur",
    kabupaten: "lumajang",
    noTelepon: "08134567890",
    email: "soekarno.w@email.com",
    statusPekerjaan: "bekerja",
    tmtPenempatan: "2022-04-01",
    namaPerusahaan: "CV Bumi Makmur",
    sertifikatKompetensi: "Pengawas Lapangan Madya",
    jabatan: "Pengawas Produksi",
    sektorUsaha: "Pertanian",
    pendidikanTerakhir: "sma",
    keahlian: "Manajemen Pertanian",
    pengalamanKerja: "Mandor Kebun",
    statusKepegawaian: "pkwt",
    hambatan: "Mobilitas terbatas jarak jauh",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Ubah DD/MM/YYYY → YYYY-MM-DD; kalau sudah YYYY-MM-DD dikembalikan apa adanya */
function toInputDate(raw: string): string {
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const [d, m, y] = raw.split("/");
  if (!d || !m || !y) return raw;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

// ─── Sub-komponen SelectWrapper ───────────────────────────────────────────────

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg
        className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function LansiaEditPage() {
  const params = useParams();
  const router = useRouter();

  const entryId = Number(params.id);

  // TODO: fetch GET /api/lansia/:entryId
  const existing = dummyData.find((d) => d.id === entryId);

  type FormState = Omit<LansiaData, "id">;

  const [form, setForm] = useState<FormState | null>(
    existing
      ? {
          nik: existing.nik,
          namaLengkap: existing.namaLengkap,
          jenisKelamin: existing.jenisKelamin,
          tempatLahir: existing.tempatLahir,
          tanggalLahir: toInputDate(existing.tanggalLahir),
          alamat: existing.alamat,
          provinsi: existing.provinsi,
          kabupaten: existing.kabupaten,
          noTelepon: existing.noTelepon,
          email: existing.email,
          statusPekerjaan: existing.statusPekerjaan,
          tmtPenempatan: toInputDate(existing.tmtPenempatan),
          namaPerusahaan: existing.namaPerusahaan,
          sertifikatKompetensi: existing.sertifikatKompetensi,
          jabatan: existing.jabatan,
          sektorUsaha: existing.sektorUsaha,
          pendidikanTerakhir: existing.pendidikanTerakhir,
          keahlian: existing.keahlian,
          pengalamanKerja: existing.pengalamanKerja,
          statusKepegawaian: existing.statusKepegawaian,
          hambatan: existing.hambatan,
        }
      : null
  );

  const [isSaving, setIsSaving] = useState(false);

  // ── Style reusable ──
  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white";
  const selectClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white appearance-none cursor-pointer";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";
  const radioClass =
    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium";

  // ── Not found ──
  if (!existing || !form) {
    return (
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Data Lansia</h1>
          <p className="text-sm text-gray-500">Tenaga Kerja Lansia Produktif Perusahaan</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center space-y-4">
          <p className="text-gray-500 text-sm">Data Lansia tidak ditemukan.</p>
          <button
            onClick={() => router.push("/lansia/data")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
          >
            Kembali ke data
          </button>
        </div>
      </div>
    );
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: await axios.put(`/api/lansia/${entryId}`, form);
      console.log("PUT /api/lansia/" + entryId, form);
      router.push("/lansia/data");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: "bekerja", label: "Bekerja" },
    { value: "belum-bekerja", label: "Belum bekerja" },
    { value: "pemberdayaan", label: "Pemberdayaan" },
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Data Lansia</h1>
          <p className="text-sm text-gray-500">Tenaga Kerja Lansia Produktif Perusahaan</p>
        </div>
        <button
          onClick={() => router.push("/lansia/data")}
          className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
        >
          Lihat data
        </button>
      </div>

      <div className="space-y-6">

        {/* ══════════════════════════════
            SECTION 1 — Identitas Diri
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
            Identitas diri
          </h2>

          {/* NIK & Nama */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>NIK (Nomor Induk Kependudukan)</label>
              <input
                type="text"
                maxLength={16}
                placeholder="Masukkan 16 digit NIK"
                value={form.nik}
                onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={form.namaLengkap}
                onChange={(e) => set("namaLengkap", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className={labelClass}>Jenis Kelamin</label>
            <div className="flex gap-3">
              {["laki-laki", "perempuan"].map((jk) => (
                <label
                  key={jk}
                  className={`${radioClass} ${
                    form.jenisKelamin === jk
                      ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                      : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value={jk}
                    checked={form.jenisKelamin === jk}
                    onChange={() => set("jenisKelamin", jk)}
                    className="accent-[#1B4EF5]"
                  />
                  {jk === "laki-laki" ? "Laki-laki" : "Perempuan"}
                </label>
              ))}
            </div>
          </div>

          {/* Tempat & Tanggal Lahir */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tempat Lahir</label>
              <input
                type="text"
                placeholder="Kab/Kota"
                value={form.tempatLahir}
                onChange={(e) => set("tempatLahir", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tanggal Lahir</label>
              <input
                type="date"
                value={form.tanggalLahir}
                onChange={(e) => set("tanggalLahir", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className={labelClass}>Alamat</label>
            <textarea
              placeholder="Alamat lengkap"
              value={form.alamat}
              onChange={(e) => set("alamat", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Provinsi & Kabupaten */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provinsi</label>
              <SelectWrapper>
                <select
                  value={form.provinsi}
                  onChange={(e) => set("provinsi", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih provinsi</option>
                  <option value="jawa-timur">Jawa Timur</option>
                  <option value="jawa-tengah">Jawa Tengah</option>
                  <option value="jawa-barat">Jawa Barat</option>
                  <option value="dki-jakarta">DKI Jakarta</option>
                  <option value="bali">Bali</option>
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label className={labelClass}>Kabupaten/Kota</label>
              <SelectWrapper>
                <select
                  value={form.kabupaten}
                  onChange={(e) => set("kabupaten", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih</option>
                  <option value="lumajang">Lumajang</option>
                  <option value="jember">Jember</option>
                  <option value="malang">Malang</option>
                  <option value="surabaya">Surabaya</option>
                </select>
              </SelectWrapper>
            </div>
          </div>

          {/* No Telepon & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nomor Telepon</label>
              <input
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                value={form.noTelepon}
                onChange={(e) => set("noTelepon", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Status Kerja & Pengalaman
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 19h18v2H3zm2-6h2v5H5zm4 0h2v5H9zm4 0h2v5h-2zm4 0h2v5h-2zM2 7l10-5l10 5v4H2zm10 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2z" />
            </svg>
            Status kerja &amp; pengalaman
          </h2>

          {/* Status Pekerjaan — 3 pilihan khusus Lansia */}
          <div>
            <label className={labelClass}>Status pekerjaan</label>
            <div className="flex flex-wrap gap-3">
              {statusOptions.map((status) => (
                <label
                  key={status.value}
                  className={`${radioClass} ${
                    form.statusPekerjaan === status.value
                      ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                      : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="statusPekerjaan"
                    value={status.value}
                    checked={form.statusPekerjaan === status.value}
                    onChange={() => set("statusPekerjaan", status.value)}
                    className="accent-[#1B4EF5]"
                  />
                  {status.label}
                </label>
              ))}
            </div>
          </div>

          {/* TMT Penempatan */}
          <div>
            <label className={labelClass}>TMT Penempatan</label>
            <input
              type="date"
              value={form.tmtPenempatan}
              onChange={(e) => set("tmtPenempatan", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Nama Perusahaan & Sertifikat */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama perusahaan</label>
              <input
                type="text"
                placeholder="Masukkan nama perusahaan"
                value={form.namaPerusahaan}
                onChange={(e) => set("namaPerusahaan", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sertifikat Kompetensi</label>
              <input
                type="text"
                placeholder="Nama sertifikat kompetensi"
                value={form.sertifikatKompetensi}
                onChange={(e) => set("sertifikatKompetensi", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Jabatan & Sektor Usaha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Jabatan</label>
              <input
                type="text"
                placeholder="Posisi pekerjaan"
                value={form.jabatan}
                onChange={(e) => set("jabatan", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sektor usaha</label>
              <input
                type="text"
                placeholder="Masukkan nama sektor"
                value={form.sektorUsaha}
                onChange={(e) => set("sektorUsaha", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Pendidikan & Keahlian */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pendidikan terakhir</label>
              <SelectWrapper>
                <select
                  value={form.pendidikanTerakhir}
                  onChange={(e) => set("pendidikanTerakhir", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Tingkat pendidikan</option>
                  <option value="sd">SD</option>
                  <option value="smp">SMP</option>
                  <option value="sma">SMA</option>
                  <option value="SMK">SMK</option>
                  <option value="d3">D3</option>
                  <option value="D4">D4</option>
                  <option value="s1">S1</option>
                  <option value="s2">S2</option>
                  <option value="s3">S3</option>
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label className={labelClass}>Keahlian</label>
              <input
                type="text"
                placeholder="Misal: Desain grafis"
                value={form.keahlian}
                onChange={(e) => set("keahlian", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Pengalaman Kerja & Status Kepegawaian */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pengalaman kerja terakhir</label>
              <input
                type="text"
                placeholder="Misal: Satpam"
                value={form.pengalamanKerja}
                onChange={(e) => set("pengalamanKerja", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status kepegawaian</label>
              <SelectWrapper>
                <select
                  value={form.statusKepegawaian}
                  onChange={(e) => set("statusKepegawaian", e.target.value)}
                  className={selectClass}
                >
                  <option value="">PKWT/PKWTT</option>
                  <option value="pkwt">PKWT</option>
                  <option value="pkwtt">PKWTT</option>
                </select>
              </SelectWrapper>
            </div>
          </div>

          {/* Hambatan */}
          <div>
            <label className={labelClass}>Hambatan</label>
            <textarea
              placeholder="Deskripsikan hambatan"
              value={form.hambatan}
              onChange={(e) => set("hambatan", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* ── Tombol Aksi ── */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-10 py-3 rounded-full transition-all"
          >
            {isSaving ? "Menyimpan..." : "Simpan perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/lansia/data")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}