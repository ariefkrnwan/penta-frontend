"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormGuard from "@/components/FormGuard";

export default function DisabilitasLansiaPage() {
  const router = useRouter();

  // ── State Identitas Diri ──
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("laki-laki");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [email, setEmail] = useState("");

  // ── State Status Kerja ──
  const [statusPekerjaan, setStatusPekerjaan] = useState("bekerja");
  const [tmtPenempatan, setTmtPenempatan] = useState("");
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [sertifikatKompetensi, setSertifikatKompetensi] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [sektorUsaha, setSektorUsaha] = useState("");
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState("");
  const [keahlian, setKeahlian] = useState("");
  const [pengalamanKerja, setPengalamanKerja] = useState("");
  const [statusKepegawaian, setStatusKepegawaian] = useState("");
  const [hambatan, setHambatan] = useState("");

  // ── State Status Disabilitas ──
  const [ragamDisabilitas, setRagamDisabilitas] = useState("fisik");
  const [spesifikDisabilitas, setSpesifikDisabilitas] = useState("");

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: kirim data ke Spring Boot
    console.log("Data lansia tersimpan");
  };

  const handleBatal = () => {
    router.back();
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
          <h1 className="text-2xl font-black text-gray-900">
            Data Lansia
          </h1>
          <p className="text-sm text-gray-500">Tenaga Kerja Lansia Produktif Perusahaan</p>
        </div>
        <button
          onClick={() => router.push("/lansia/data")}
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

          {/* Provinsi & Kabupaten */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provinsi</label>
              <div className="relative">
                <select
                  value={provinsi}
                  onChange={(e) => setProvinsi(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih provinsi</option>
                  <option value="jawa-timur">Jawa Timur</option>
                  <option value="jawa-tengah">Jawa Tengah</option>
                  <option value="jawa-barat">Jawa Barat</option>
                  <option value="dki-jakarta">DKI Jakarta</option>
                  <option value="bali">Bali</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label className={labelClass}>Kabupaten/Kota</label>
              <div className="relative">
                <select
                  value={kabupaten}
                  onChange={(e) => setKabupaten(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih</option>
                  <option value="lumajang">Lumajang</option>
                  <option value="jember">Jember</option>
                  <option value="malang">Malang</option>
                  <option value="surabaya">Surabaya</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* No Telepon & Email */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Status Kerja
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 19h18v2H3zm2-6h2v5H5zm4 0h2v5H9zm4 0h2v5h-2zm4 0h2v5h-2zM2 7l10-5l10 5v4H2zm10 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2z" />
            </svg>
            Status kerja &amp; pengalaman
          </h2>

          {/* Status Pekerjaan — 3 pilihan untuk Lansia */}
          <div>
            <label className={labelClass}>Status pekerjaan</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "bekerja", label: "Bekerja" },
                { value: "belum-bekerja", label: "Belum bekerja" },
                { value: "pemberdayaan", label: "Pemberdayaan" },
              ].map((status) => (
                <label
                  key={status.value}
                  className={`${radioClass} ${
                    statusPekerjaan === status.value
                      ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                      : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="statusPekerjaan"
                    value={status.value}
                    checked={statusPekerjaan === status.value}
                    onChange={() => setStatusPekerjaan(status.value)}
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
              value={tmtPenempatan}
              onChange={(e) => setTmtPenempatan(e.target.value)}
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
                value={namaPerusahaan}
                onChange={(e) => setNamaPerusahaan(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sertifikat Kompetensi</label>
              <input
                type="text"
                placeholder="Nama sertifikat kompetensi"
                value={sertifikatKompetensi}
                onChange={(e) => setSertifikatKompetensi(e.target.value)}
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
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sektor usaha</label>
              <input
                type="text"
                placeholder="Masukkan nama sektor"
                value={sektorUsaha}
                onChange={(e) => setSektorUsaha(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Pendidikan & Keahlian */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pendidikan terakhir</label>
              <div className="relative">
                <select
                  value={pendidikanTerakhir}
                  onChange={(e) => setPendidikanTerakhir(e.target.value)}
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
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label className={labelClass}>Keahlian</label>
              <input
                type="text"
                placeholder="Misal: Desain grafis"
                value={keahlian}
                onChange={(e) => setKeahlian(e.target.value)}
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
                value={pengalamanKerja}
                onChange={(e) => setPengalamanKerja(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status kepegawaian</label>
              <div className="relative">
                <select
                  value={statusKepegawaian}
                  onChange={(e) => setStatusKepegawaian(e.target.value)}
                  className={selectClass}
                >
                  <option value="">PKWT/PKWTT</option>
                  <option value="pkwt">PKWT</option>
                  <option value="pkwtt">PKWTT</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hambatan */}
          <div>
            <label className={labelClass}>Hambatan</label>
            <textarea
              placeholder="Deskripsikan hambatan"
              value={hambatan}
              onChange={(e) => setHambatan(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
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
            onClick={handleBatal}
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