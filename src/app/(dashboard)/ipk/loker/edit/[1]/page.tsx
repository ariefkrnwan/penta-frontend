"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormLoker {
  idBulan: string;
  tahun: string;
  namaPerusahaan: string;
  nibPerusahaan: string;
  lapanganUsaha: string;
  alamatPerusahaan: string;
  desa: string;
  kecamatan: string;
  provinsiPerusahaan: string;
  kabKotaPerusahaan: string;
  kodeJabatan: string;
  namaJabatan: string;
  jumlahDibutuhkan: string;
  jenisKelamin: string;
  pendidikan: string;
  keterampilanKompetensi: string;
}

type DataLoker = { id: number; data: FormLoker };

const INITIAL_FORM: FormLoker = {
  idBulan: "",
  tahun: new Date().getFullYear().toString(),
  namaPerusahaan: "",
  nibPerusahaan: "",
  lapanganUsaha: "",
  alamatPerusahaan: "",
  desa: "",
  kecamatan: "",
  provinsiPerusahaan: "",
  kabKotaPerusahaan: "",
  kodeJabatan: "",
  namaJabatan: "",
  jumlahDibutuhkan: "",
  jenisKelamin: "",
  pendidikan: "",
  keterampilanKompetensi: "",
};

// ─── Data contoh ──────────────────────────────────────────────────────────────
// TODO: ganti dengan data dari backend, mis. GET /api/ipk/loker/{id}

const dummyData: DataLoker[] = [
  {
    id: 1,
    data: {
      idBulan: "1",
      tahun: "2026",
      namaPerusahaan: "PT Maju Jaya Abadi",
      nibPerusahaan: "1234567890123",
      lapanganUsaha: "Manufaktur",
      alamatPerusahaan: "Jl. Raya Tempeh No. 45",
      desa: "Tempeh Lor",
      kecamatan: "Tempeh",
      provinsiPerusahaan: "Jawa Timur",
      kabKotaPerusahaan: "Lumajang",
      kodeJabatan: "7412.00",
      namaJabatan: "Mekanik Produksi",
      jumlahDibutuhkan: "5",
      jenisKelamin: "laki-laki",
      pendidikan: "SMA/SMK",
      keterampilanKompetensi: "Mampu mengoperasikan mesin CNC, memahami K3",
    },
  },
];

const BULAN = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
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

export default function EditLokerPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = Number(rawId);

  // TODO: ganti dengan fetch ke backend berdasarkan id
  const loker = dummyData.find((d) => d.id === id);

  const [form, setForm] = useState<FormLoker>({ ...INITIAL_FORM, ...loker?.data });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pastikan tahun yang tersimpan selalu ada di pilihan (walau sudah lebih lama dari 6 tahun)
  const tahunTersimpan = Number(loker?.data.tahun);
  const tahunOptions = Array.from(
    new Set([...TAHUN_OPTIONS, ...(tahunTersimpan ? [tahunTersimpan] : [])])
  ).sort((a, b) => b - a);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: await axios.put(`/api/ipk/loker/${id}`, form);
      console.log("Perubahan loker tersimpan:", { id, ...form });
      router.push("/ipk/loker/data");
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

  // ── Data tidak ditemukan ──
  if (!loker) {
    return (
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Loker</h1>
          <p className="text-sm text-gray-500">Ubah data lowongan kerja terdaftar dari perusahaan</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center space-y-4">
          <p className="text-gray-500 text-sm">Data loker tidak ditemukan.</p>
          <button
            onClick={() => router.push("/ipk/loker/data")}
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
          <h1 className="text-2xl font-black text-gray-900">Edit Loker</h1>
          <p className="text-sm text-gray-500">Ubah data lowongan kerja terdaftar dari perusahaan</p>
        </div>
        <button
          onClick={() => router.push("/ipk/loker/data")}
          className="flex items-center gap-2 border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
        >
          Lihat data
        </button>
      </div>

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
            {/* ID Bulan */}
            <div>
              <label className={labelClass}>ID Bulan</label>
              <div className="relative">
                <select
                  name="idBulan"
                  value={form.idBulan}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  <option value="">Pilih bulan</option>
                  {BULAN.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.value} — {b.label}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Tahun */}
            <div>
              <label className={labelClass}>Tahun</label>
              <div className="relative">
                <select
                  name="tahun"
                  value={form.tahun}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  {tahunOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Data Perusahaan
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
                placeholder="Nama perusahaan"
                value={form.namaPerusahaan}
                onChange={handleChange}
                required
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
            <label className={labelClass}>Lapangan Usaha</label>
            <input
              type="text"
              name="lapanganUsaha"
              placeholder="Contoh: Manufaktur, Retail, Jasa Keuangan"
              value={form.lapanganUsaha}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Alamat Perusahaan</label>
            <textarea
              name="alamatPerusahaan"
              placeholder="Alamat lengkap perusahaan"
              value={form.alamatPerusahaan}
              onChange={handleChange}
              rows={3}
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kecamatan</label>
              <input
                type="text"
                name="kecamatan"
                placeholder="Contoh: Tempeh"
                value={form.kecamatan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Desa / Kelurahan</label>
              <input
                type="text"
                name="desa"
                placeholder="Contoh: Tempeh Lor"
                value={form.desa}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provinsi Perusahaan</label>
              <input
                type="text"
                name="provinsiPerusahaan"
                placeholder="Contoh: Jawa Timur"
                value={form.provinsiPerusahaan}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kab/Kota Perusahaan</label>
              <input
                type="text"
                name="kabKotaPerusahaan"
                placeholder="Contoh: Surabaya"
                value={form.kabKotaPerusahaan}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 3 — Data Lowongan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 16.49 1 14.67 1c-1.11 0-2.1.54-2.67 1.4l-.67.9-.67-.91C10.43 1.54 9.44 1 8.33 1 6.51 1 5 2.54 5 4.66c0 .46.11.9.18 1.34H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5.33-3c.74 0 1.33.6 1.33 1.34 0 .73-.6 1.32-1.33 1.32H13V4.32C13 3.6 13.6 3 14.67 3zM8.33 3C9.4 3 10 3.6 10 4.32V6H8.33C7.6 6 7 5.41 7 4.68 7 3.94 7.6 3.34 8.33 3zM3 19V8h8v11H3zm10 0V8h8l.01 11H13z" />
            </svg>
            Data Lowongan
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kode Jabatan</label>
              <input
                type="text"
                name="kodeJabatan"
                placeholder="Contoh: 7412.00"
                value={form.kodeJabatan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nama Jabatan</label>
              <input
                type="text"
                name="namaJabatan"
                placeholder="Contoh: Mekanik Produksi"
                value={form.namaJabatan}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Jumlah Dibutuhkan</label>
              <input
                type="number"
                name="jumlahDibutuhkan"
                placeholder="Contoh: 5"
                min={1}
                value={form.jumlahDibutuhkan}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pendidikan</label>
              <input
                type="text"
                name="pendidikan"
                placeholder="Contoh: SMA/SMK, D3, S1"
                value={form.pendidikan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Jenis Kelamin</label>
              <div className="flex gap-2 h-[46px]">
                {[
                  { value: "laki-laki", label: "Laki-laki" },
                  { value: "perempuan", label: "Perempuan" },
                  { value: "laki-laki atau perempuan", label: "Laki-laki / Perempuan" },
                ].map((jk) => (
                  <label
                    key={jk.value}
                    className={`flex items-center gap-2 px-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium flex-1 justify-center ${
                      form.jenisKelamin === jk.value
                        ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                        : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value={jk.value}
                      checked={form.jenisKelamin === jk.value}
                      onChange={handleChange}
                      className="accent-[#1B4EF5]"
                    />
                    {jk.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Keterampilan / Kompetensi</label>
            <textarea
              name="keterampilanKompetensi"
              placeholder="Contoh: Mampu mengoperasikan mesin CNC, memahami K3, berpengalaman di bidang manufaktur"
              value={form.keterampilanKompetensi}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* ── Tombol Aksi ── */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1B4EF5] hover:bg-[#1540cc] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-10 py-3 rounded-full transition-all"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/ipk/loker/data")}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all"
          >
            Batal
          </button>
        </div>

      </form>
    </div>
  );
}