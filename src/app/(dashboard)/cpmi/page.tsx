"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { kecamatanList, kecamatanDesa } from "@/constants/lumajang";
import FormGuard from "@/components/FormGuard";

export default function CPMIPage() {
  const router = useRouter();

  // ── State Identitas Diri ──
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("laki-laki");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [desa, setDesa] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [noTelepon, setNoTelepon] = useState("");

  // ── State Data Rekomendasi ──
  const [tanggalRekom, setTanggalRekom] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [negaraTujuan, setNegaraTujuan] = useState("");
  const [perusahaanPengirim, setPerusahaanPengirim] = useState("");
  const [pemberiKerja, setPemberiKerja] = useState("");
  const [bidang, setBidang] = useState("");
  const [kompetensi, setKompetensi] = useState("");
  const [noReg, setNoReg] = useState("");
  const [noSertifikat, setNoSertifikat] = useState("");

  // ── Handler kecamatan — reset desa saat ganti kecamatan ──
  const handleKecamatanChange = (val: string) => {
    setKecamatan(val);
    setDesa("");
  };

  const desaList = kecamatan ? kecamatanDesa[kecamatan] ?? [] : [];

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data CPMI tersimpan");
  };

  // ── Style reusable ──
  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white";
  const selectClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white appearance-none cursor-pointer";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";
  const radioClass =
    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium";

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-black text-gray-900">Data Rekom ID CPMI</h1>
            <p className="text-sm text-gray-500">Calon Pekerja Migran Indonesia</p>
        </div>
        <button
          onClick={() => router.push("/cpmi/data")}
          className="flex items-center gap-2 border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#1B4EF5] hover:text-white transition-all"
        >
          Lihat data
        </button>
      </div>

      <FormGuard>
        <form onSubmit={handleSimpan} className="space-y-6">
      
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
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
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
                    jenisKelamin === jk
                      ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                      : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value={jk}
                    checked={jenisKelamin === jk}
                    onChange={() => setJenisKelamin(jk)}
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
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tanggal Lahir</label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className={labelClass}>Alamat</label>
            <textarea
              placeholder="Alamat lengkap"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Kecamatan & Desa — saling terhubung */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kecamatan</label>
              <div className="relative">
                <select
                  value={kecamatan}
                  onChange={(e) => handleKecamatanChange(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih kecamatan</option>
                  {kecamatanList.map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label className={labelClass}>Desa / Kelurahan</label>
              <div className="relative">
                <select
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  disabled={!kecamatan}
                  className={`${selectClass} ${!kecamatan ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {kecamatan ? "Pilih desa" : "Pilih kecamatan dulu"}
                  </option>
                  {desaList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pendidikan & No Telepon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pendidikan</label>
              <div className="relative">
                <select
                  value={pendidikan}
                  onChange={(e) => setPendidikan(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Tingkat pendidikan</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="SMK">SMK</option>
                  <option value="D3">D3</option>
                  <option value="D4">D4</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label className={labelClass}>Nomor Telepon</label>
              <input
                type="tel"
                placeholder="08xx-xxxx-xxxx"
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Data Rekomendasi
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z" />
            </svg>
            Data Rekomendasi
          </h2>

          {/* Row 1: Tanggal Rekom, Keterangan, Jabatan, Negara Tujuan */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Tanggal Rekom</label>
              <input
                type="date"
                value={tanggalRekom}
                onChange={(e) => setTanggalRekom(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <input
                type="text"
                placeholder="Rekom ID"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Jabatan</label>
              <input
                type="text"
                placeholder="Misal: Caregiver"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Negara Tujuan</label>
              <input
                type="text"
                placeholder="Nama negara"
                value={negaraTujuan}
                onChange={(e) => setNegaraTujuan(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Perusahaan Pengirim & Pemberi Kerja */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Perusahaan Pengirim</label>
              <input
                type="text"
                placeholder="Masukkan nama perusahaan"
                value={perusahaanPengirim}
                onChange={(e) => setPerusahaanPengirim(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pemberi Kerja</label>
              <input
                type="text"
                placeholder="Masukkan nama pemberi kerja"
                value={pemberiKerja}
                onChange={(e) => setPemberiKerja(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3: Bidang & Kompetensi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bidang</label>
              <input
                type="text"
                placeholder="Misal: Domestic Worker"
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kompetensi</label>
              <input
                type="text"
                placeholder="Misal: Housekeeper"
                value={kompetensi}
                onChange={(e) => setKompetensi(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 4: No Reg & No Sertifikat */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>No Reg</label>
              <input
                type="text"
                placeholder="Masukkan nomor"
                value={noReg}
                onChange={(e) => setNoReg(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>No Sertifikat Kompetensi</label>
              <input
                type="text"
                placeholder="Masukkan nomor"
                value={noSertifikat}
                onChange={(e) => setNoSertifikat(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── Tombol Aksi ── */}
        <div className="group-disabled:hidden flex items-center justify-center gap-4 pt-2">
          <button
            type="submit"
            className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold px-10 py-3 rounded-full transition-all"
          >
            Simpan data
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