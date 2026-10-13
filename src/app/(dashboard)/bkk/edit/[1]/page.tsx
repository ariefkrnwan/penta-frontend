"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SMK_LUMAJANG } from "@/constants/smk-lumajang";
import { kecamatanList, kecamatanDesa } from "@/constants/lumajang";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BkkData {
  id: number;
  smkId: number;
  namaTenagaKerja: string;
  nik: string;
  jenisKelamin: string;
  alamatTenagaKerja: string;
  kecamatan: string;
  desa: string;
  provinsiTk: string;
  kabKotaTk: string;
  email: string;
  nomorHp: string;
  pendidikanTk: string;
  // Data Penempatan
  provinsiPd: string;
  kabKotaPd: string;
  // Data Perusahaan
  namaPerusahaan: string;
  nibPerusahaan: string;
  alamatPerusahaan: string;
  provinsiPa: string;
  kabKotaPa: string;
  // Data Pekerjaan
  namaJabatan: string;
  lapanganUsaha: string;
  tanggalMulai: string; // format YYYY-MM-DD untuk input date
  gajiUpah: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
// TODO: fetch dari backend GET /api/bkk/:id

const dummyBkkData: BkkData[] = [
  {
    id: 1,
    smkId: 1,
    namaTenagaKerja: "Andi Pratama",
    nik: "3508011234560001",
    jenisKelamin: "laki-laki",
    alamatTenagaKerja: "Jl. Diponegoro No. 12",
    kecamatan: "Lumajang",
    desa: "Tompokersan",
    provinsiTk: "Jawa Timur",
    kabKotaTk: "Lumajang",
    email: "andi.pratama@email.com",
    nomorHp: "08123456789",
    pendidikanTk: "SMK",
    provinsiPd: "Jawa Timur",
    kabKotaPd: "Surabaya",
    namaPerusahaan: "PT Maju Bersama",
    nibPerusahaan: "1234567890123",
    alamatPerusahaan: "Jl. Raya Darmo No. 5, Surabaya",
    provinsiPa: "Jawa Timur",
    kabKotaPa: "Surabaya",
    namaJabatan: "Staff Administrasi",
    lapanganUsaha: "Perdagangan",
    tanggalMulai: "2024-03-01",
    gajiUpah: "3500000",
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

// ─── Sub-komponen select wrapper (ditulis di luar agar tidak re-render penuh) ─

interface SelectWrapperProps {
  children: React.ReactNode;
}

function SelectWrapper({ children }: SelectWrapperProps) {
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

export default function BkkEditPage() {
  const params = useParams();
  const router = useRouter();

  // ID di sini adalah ID entri BKK, bukan smkId
  const bkkId = Number(params.id);

  // TODO: fetch GET /api/bkk/:bkkId
  const existing = dummyBkkData.find((d) => d.id === bkkId);

  const sekolah = existing
    ? SMK_LUMAJANG.find((s) => s.id === existing.smkId)
    : undefined;

  const [form, setForm] = useState<Omit<BkkData, "id" | "smkId"> | null>(
    existing
      ? {
          namaTenagaKerja: existing.namaTenagaKerja,
          nik: existing.nik,
          jenisKelamin: existing.jenisKelamin,
          alamatTenagaKerja: existing.alamatTenagaKerja,
          kecamatan: existing.kecamatan,
          desa: existing.desa,
          provinsiTk: existing.provinsiTk,
          kabKotaTk: existing.kabKotaTk,
          email: existing.email,
          nomorHp: existing.nomorHp,
          pendidikanTk: existing.pendidikanTk,
          provinsiPd: existing.provinsiPd,
          kabKotaPd: existing.kabKotaPd,
          namaPerusahaan: existing.namaPerusahaan,
          nibPerusahaan: existing.nibPerusahaan,
          alamatPerusahaan: existing.alamatPerusahaan,
          provinsiPa: existing.provinsiPa,
          kabKotaPa: existing.kabKotaPa,
          namaJabatan: existing.namaJabatan,
          lapanganUsaha: existing.lapanganUsaha,
          tanggalMulai: toInputDate(existing.tanggalMulai),
          gajiUpah: existing.gajiUpah,
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
          <h1 className="text-2xl font-black text-gray-900">Edit Data BKK</h1>
          <p className="text-sm text-gray-500">Bursa Kerja Khusus</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center space-y-4">
          <p className="text-gray-500 text-sm">Data BKK tidak ditemukan.</p>
          <button
            onClick={() => router.push("/bkk")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
          >
            Kembali ke data
          </button>
        </div>
      </div>
    );
  }

  const desaOptions =
    form.kecamatan && kecamatanDesa[form.kecamatan]
      ? kecamatanDesa[form.kecamatan]
      : [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (!prev) return prev;
      if (name === "kecamatan") return { ...prev, kecamatan: value, desa: "" };
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: await axios.put(`/api/bkk/${bkkId}`, { smkId: existing.smkId, ...form });
      console.log("PUT /api/bkk/" + bkkId, { smkId: existing.smkId, ...form });
      router.push("/bkk");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Edit Data Penempatan
          </h1>
          {sekolah && (
            <p className="text-sm text-gray-500">{sekolah.nama}</p>
          )}
        </div>
        <button
          onClick={() => router.push("/bkk")}
          className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-5 py-2 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all text-sm"
        >
          Lihat data
        </button>
      </div>

      <div className="space-y-6">

        {/* ══════════════════════════════
            SECTION 1 — Data Pribadi
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
            Data Pribadi Tenaga Kerja
          </h2>

          {/* NIK & Nama */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>NIK</label>
              <input
                type="text"
                name="nik"
                maxLength={16}
                placeholder="Masukkan 16 digit NIK"
                value={form.nik}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nama Tenaga Kerja</label>
              <input
                type="text"
                name="namaTenagaKerja"
                placeholder="Nama lengkap sesuai KTP"
                value={form.namaTenagaKerja}
                onChange={handleChange}
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
                    onChange={handleChange}
                    className="accent-[#1B4EF5]"
                  />
                  {jk === "laki-laki" ? "Laki-laki" : "Perempuan"}
                </label>
              ))}
            </div>
          </div>

          {/* Kecamatan & Desa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kecamatan</label>
              <SelectWrapper>
                <select
                  name="kecamatan"
                  value={form.kecamatan}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Pilih kecamatan</option>
                  {kecamatanList.map((kec: string) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label className={labelClass}>Desa / Kelurahan</label>
              <SelectWrapper>
                <select
                  name="desa"
                  value={form.desa}
                  onChange={handleChange}
                  disabled={!form.kecamatan}
                  className={`${selectClass} ${!form.kecamatan ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Pilih desa</option>
                  {desaOptions.map((d: string) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </SelectWrapper>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className={labelClass}>Alamat Tenaga Kerja</label>
            <textarea
              name="alamatTenagaKerja"
              placeholder="Alamat lengkap"
              value={form.alamatTenagaKerja}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Provinsi & Kab/Kota TK */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provinsi</label>
              <input
                type="text"
                name="provinsiTk"
                value={form.provinsiTk}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kab/Kota</label>
              <input
                type="text"
                name="kabKotaTk"
                value={form.kabKotaTk}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Email & Nomor HP */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nomor HP</label>
              <input
                type="tel"
                name="nomorHp"
                placeholder="08xx-xxxx-xxxx"
                value={form.nomorHp}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Pendidikan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pendidikan</label>
              <input
                type="text"
                name="pendidikanTk"
                value={form.pendidikanTk}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Data Penempatan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Data Penempatan
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provinsi Penempatan</label>
              <input
                type="text"
                name="provinsiPd"
                placeholder="Contoh: Jawa Timur"
                value={form.provinsiPd}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kab/Kota Penempatan</label>
              <input
                type="text"
                name="kabKotaPd"
                placeholder="Contoh: Surabaya"
                value={form.kabKotaPd}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 3 — Data Perusahaan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
            </svg>
            Data Perusahaan
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Perusahaan</label>
              <input
                type="text"
                name="namaPerusahaan"
                placeholder="Nama perusahaan penerima"
                value={form.namaPerusahaan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>NIB Perusahaan</label>
              <input
                type="text"
                name="nibPerusahaan"
                placeholder="Nomor Induk Berusaha"
                value={form.nibPerusahaan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Alamat Perusahaan</label>
            <textarea
              name="alamatPerusahaan"
              placeholder="Alamat lengkap perusahaan"
              value={form.alamatPerusahaan}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provinsi Perusahaan</label>
              <input
                type="text"
                name="provinsiPa"
                placeholder="Contoh: Jawa Timur"
                value={form.provinsiPa}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kab/Kota Perusahaan</label>
              <input
                type="text"
                name="kabKotaPa"
                placeholder="Contoh: Jember"
                value={form.kabKotaPa}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 4 — Data Pekerjaan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 16.49 1 14.67 1c-1.11 0-2.1.54-2.67 1.4l-.67.9-.67-.91C10.43 1.54 9.44 1 8.33 1 6.51 1 5 2.54 5 4.66c0 .46.11.9.18 1.34H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5.33-3c.74 0 1.33.6 1.33 1.34 0 .73-.6 1.32-1.33 1.32H13V4.32C13 3.6 13.6 3 14.67 3zM8.33 3C9.4 3 10 3.6 10 4.32V6H8.33C7.6 6 7 5.41 7 4.68 7 3.94 7.6 3.34 8.33 3zM3 19V8h8v11H3zm10 0V8h8l.01 11H13z" />
            </svg>
            Data Pekerjaan
          </h2>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Nama Jabatan</label>
              <input
                type="text"
                name="namaJabatan"
                placeholder="Misal: Staff Administrasi"
                value={form.namaJabatan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Lapangan Usaha</label>
              <input
                type="text"
                name="lapanganUsaha"
                placeholder="Misal: Perdagangan"
                value={form.lapanganUsaha}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tanggal Mulai Kerja</label>
              <input
                type="date"
                name="tanggalMulai"
                value={form.tanggalMulai}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Gaji / Upah (Rp)</label>
              <input
                type="number"
                name="gajiUpah"
                placeholder="Contoh: 3500000"
                min={0}
                value={form.gajiUpah}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
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
            onClick={() => router.push("/bkk")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}