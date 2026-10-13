"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { kecamatanList, kecamatanDesa } from "@/constants/lumajang";
import FormGuard from "@/components/FormGuard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormPendagri {
  // Periode
  idBulan: string;
  tahun: string;
  // Data Pribadi
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
  // Data Penempatan
  provinsiPenempatan: string;
  kotaPenempatan: string;
  // Data Perusahaan
  namaPerusahaan: string;
  nibPerusahaan: string;
  alamatPerusahaan: string;
  provinsiPerusahaan: string;
  kotaPerusahaan: string;
  // Data Pekerjaan
  namaJabatan: string;
  lapanganUsaha: string;
  tanggalMulai: string;
  gajiUpah: string;
  keterangan: string;
}

const INITIAL_FORM: FormPendagri = {
  idBulan: "",
  tahun: new Date().getFullYear().toString(),
  namaTenagaKerja: "",
  nik: "",
  alamatTenagaKerja: "",
  desa: "",
  kecamatan: "",
  provinsi: "Jawa Timur",
  kabKota: "Lumajang",
  email: "",
  nomorHp: "",
  jenisKelamin: "",
  pendidikan: "",
  provinsiPenempatan: "",
  kotaPenempatan: "",
  namaPerusahaan: "",
  nibPerusahaan: "",
  alamatPerusahaan: "",
  provinsiPerusahaan: "",
  kotaPerusahaan: "",
  namaJabatan: "",
  lapanganUsaha: "",
  tanggalMulai: "",
  gajiUpah: "",
  keterangan: "",
};

const BULAN = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6"},
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
];

const CURRENT_YEAR = new Date().getFullYear();
const TAHUN_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

// ─── Component ────────────────────────────────────────────────────────────────

export default function PendagriFormPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormPendagri>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const desaOptions =
    form.kecamatan && kecamatanDesa[form.kecamatan]
      ? kecamatanDesa[form.kecamatan]
      : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "kecamatan") return { ...prev, kecamatan: value, desa: "" };
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: await axios.post("/api/pendagri", form);
      console.log("Submit pendagri:", form);
      router.push("/pendagri/data");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Style reusable ──
  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white";
  const selectClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white appearance-none cursor-pointer";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

  const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      {children}
      <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Input Data Pendagri</h1>
          <p className="text-sm text-gray-500">Penempatan tenaga kerja dalam negeri</p>
        </div>
        <button
          onClick={() => router.push("/ipk/pendagri/data")}
          className="flex items-center gap-2 border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
        >
          Lihat data
        </button>
      </div>

    <FormGuard>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ══════════════════════════════
            SECTION 1 — Periode
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 18H5V8h14v13zM7 10h5v5H7z" />
            </svg>
            Periode
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ID Bulan</label>
              <SelectWrapper>
                <select name="idBulan" value={form.idBulan} onChange={handleChange} required className={selectClass}>
                  <option value="">Pilih bulan</option>
                  {BULAN.map((b) => (
                    <option key={b.value} value={b.value}>{b.value} — {b.label}</option>
                  ))}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label className={labelClass}>Tahun</label>
              <SelectWrapper>
                <select name="tahun" value={form.tahun} onChange={handleChange} required className={selectClass}>
                  {TAHUN_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </SelectWrapper>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Data Pribadi
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
            Data Pribadi Tenaga Kerja
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Tenaga Kerja</label>
              <input type="text" name="namaTenagaKerja" placeholder="Nama lengkap sesuai KTP" value={form.namaTenagaKerja} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>NIK</label>
              <input type="text" name="nik" placeholder="16 digit NIK" maxLength={16} value={form.nik} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Alamat Tenaga Kerja</label>
            <textarea name="alamatTenagaKerja" placeholder="Alamat lengkap sesuai KTP" value={form.alamatTenagaKerja} onChange={handleChange} rows={2} required className={`${inputClass} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kecamatan</label>
              <SelectWrapper>
                <select name="kecamatan" value={form.kecamatan} onChange={handleChange} className={selectClass}>
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
                <select name="desa" value={form.desa} onChange={handleChange} disabled={!form.kecamatan} className={`${selectClass} ${!form.kecamatan ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <option value="">Pilih desa</option>
                  {desaOptions.map((d: string) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </SelectWrapper>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provinsi</label>
              <input type="text" name="provinsi" value={form.provinsi} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Kab/Kota</label>
              <input type="text" name="kabKota" value={form.kabKota} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" placeholder="email@contoh.com" value={form.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nomor HP</label>
              <input type="tel" name="nomorHp" placeholder="08xx-xxxx-xxxx" value={form.nomorHp} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Jenis Kelamin — radio pill */}
            <div>
              <label className={labelClass}>Jenis Kelamin</label>
              <div className="flex gap-2 h-[46px]">
                {[
                  { value: "laki-laki", label: "Laki-laki" },
                  { value: "perempuan", label: "Perempuan" },
                ].map((jk) => (
                  <label
                    key={jk.value}
                    className={`flex items-center gap-2 px-4 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium flex-1 justify-center ${
                      form.jenisKelamin === jk.value
                        ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                        : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                    }`}
                  >
                    <input type="radio" name="jenisKelamin" value={jk.value} checked={form.jenisKelamin === jk.value} onChange={handleChange} className="accent-[#1B4EF5]" />
                    {jk.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Pendidikan</label>
              <input type="text" name="pendidikan" placeholder="Contoh: SMA/SMK, D3, S1" value={form.pendidikan} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 3 — Data Penempatan
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
                <input type="text" name="provinsiPenempatan" placeholder="Contoh: Jawa Timur" value={form.provinsiPenempatan} onChange={handleChange} className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Kota Penempatan</label>
                <input type="text" name="kotaPenempatan" placeholder="Contoh: Surabaya" value={form.kotaPenempatan} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 4 — Data Perusahaan
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
              <input type="text" name="namaPerusahaan" placeholder="Nama perusahaan penerima" value={form.namaPerusahaan} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>NIB Perusahaan</label>
              <input type="text" name="nibPerusahaan" placeholder="Nomor Induk Berusaha" value={form.nibPerusahaan} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Alamat Perusahaan</label>
            <textarea name="alamatPerusahaan" placeholder="Alamat lengkap perusahaan" value={form.alamatPerusahaan} onChange={handleChange} rows={2} required className={`${inputClass} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelClass}>Provinsi Perusahaan</label>
                <input type="text" name="provinsiPerusahaan" placeholder="Contoh: Jawa Timur" value={form.provinsiPerusahaan} onChange={handleChange} className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Kota Perusahaan</label>
                <input type="text" name="kotaPerusahaan" placeholder="Contoh: Jakarta Selatan" value={form.kotaPerusahaan} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 5 — Data Pekerjaan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 16.49 1 14.67 1c-1.11 0-2.1.54-2.67 1.4l-.67.9-.67-.91C10.43 1.54 9.44 1 8.33 1 6.51 1 5 2.54 5 4.66c0 .46.11.9.18 1.34H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5.33-3c.74 0 1.33.6 1.33 1.34 0 .73-.6 1.32-1.33 1.32H13V4.32C13 3.6 13.6 3 14.67 3zM8.33 3C9.4 3 10 3.6 10 4.32V6H8.33C7.6 6 7 5.41 7 4.68 7 3.94 7.6 3.34 8.33 3zM3 19V8h8v11H3zm10 0V8h8l.01 11H13z" />
            </svg>
            Data Pekerjaan
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Jabatan</label>
              <input type="text" name="namaJabatan" placeholder="Contoh: Staff Administrasi" value={form.namaJabatan} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Lapangan Usaha</label>
              <input type="text" name="lapanganUsaha" placeholder="Contoh: Retail, Manufaktur" value={form.lapanganUsaha} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tanggal Mulai Kerja</label>
              <input type="date" name="tanggalMulai" value={form.tanggalMulai} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gaji / Upah (Rp)</label>
              <input type="number" name="gajiUpah" placeholder="Contoh: 3500000" min={0} value={form.gajiUpah} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Keterangan</label>
            <textarea name="keterangan" placeholder="Keterangan tambahan jika ada" value={form.keterangan} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* ── Tombol Aksi ── */}
        <div className="group-disabled:hidden flex items-center justify-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-10 py-3 rounded-full transition-all"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan data"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all"
          >
            Batal
          </button>
        </div>
      </form>
    </FormGuard>
    </div>
  );
}