"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { kecamatanList, kecamatanDesa } from "@/constants/lumajang";
import KeahlianPicker from "@/components/KeahlianPicker";
import FormGuard from "@/components/FormGuard";

export default function AK1Page() {
  const router = useRouter();

  const [noAk1, setNoAk1] = useState("");
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [tanggalTerdaftar, setTanggalTerdaftar] = useState("");
  const [email, setEmail] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("L");
  const [statusPerkawinan, setStatusPerkawinan] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [tahunLulus, setTahunLulus] = useState("");
  const [keahlian, setKeahlian] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [desa, setDesa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tujuan, setTujuan] = useState("");
  // ── Kategori dipilih manual oleh user, tidak lagi otomatis ──
  const [kategoriTujuan, setKategoriTujuan] = useState<"Dalam Negeri" | "Luar Negeri" | "">("");

  const handleKecamatanChange = (val: string) => {
    setKecamatan(val);
    setDesa("");
  };

  const desaList = kecamatan ? kecamatanDesa[kecamatan] ?? [] : [];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
    // TODO: kirim ke API backend teman
      console.log("Data AK-1 tersimpan:", {
        noAk1, nama, nik, tanggalTerdaftar, email,
        jenisKelamin, statusPerkawinan, pendidikan, jurusan, tahunLulus,
        keahlian, kecamatan, desa, alamat, noHp, tempatLahir, tanggalLahir,
        tujuan, kategoriTujuan,
      });
      } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white";
  const selectClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white appearance-none cursor-pointer";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";
  const radioClass =
    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium";

  // Validasi: tujuan dan kategori harus diisi keduanya
  const tujuanValid = tujuan.trim() !== "" && kategoriTujuan !== "";

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">AK-1</h1>
          <p className="text-sm text-gray-500">Data Kartu Kuning Pencarian Kerja</p>
        </div>
        <button
          onClick={() => router.push("/ipk/ak1/data")}
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

          {/* No AK1 & Nama */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>No. AK-1</label>
              <input
                type="text"
                placeholder="Masukkan nomor AK-1"
                value={noAk1}
                onChange={(e) => setNoAk1(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nama</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* NIK & Tanggal Terdaftar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>NIK</label>
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
              <label className={labelClass}>Tanggal Terdaftar</label>
              <input
                type="date"
                value={tanggalTerdaftar}
                onChange={(e) => setTanggalTerdaftar(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Jenis Kelamin & Status Perkawinan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Jenis Kelamin</label>
              <div className="flex gap-3">
                {[{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }].map((jk) => (
                  <label
                    key={jk.value}
                    className={`${radioClass} ${
                      jenisKelamin === jk.value
                        ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                        : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value={jk.value}
                      checked={jenisKelamin === jk.value}
                      onChange={() => setJenisKelamin(jk.value)}
                      className="accent-[#1B4EF5]"
                    />
                    {jk.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Status Perkawinan</label>
              <div className="relative">
                <select
                  value={statusPerkawinan}
                  onChange={(e) => setStatusPerkawinan(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih status</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Belum kawin">Belum kawin</option>
                  <option value="Janda">Janda</option>
                  <option value="Duda">Duda</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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

          {/* No HP */}
          <div>
            <label className={labelClass}>No. HP</label>
            <input
              type="tel"
              placeholder="08xx-xxxx-xxxx"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* ════════════════════════════════════════════
              TUJUAN + KATEGORI — berdampingan, manual
          ════════════════════════════════════════════ */}
          <div>
            <label className={labelClass}>
              Tujuan & Kategori
              <span className="text-red-400 ml-0.5">*</span>
            </label>

            <div className="flex gap-3 items-start">
              {/* Input teks Tujuan */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Contoh: PT Morowali / Arab Saudi / Hongkong"
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  className={`${inputClass} ${
                    tujuan && !kategoriTujuan
                      ? "border-orange-300 focus:border-orange-400 focus:ring-orange-200"
                      : ""
                  }`}
                />
              </div>

              {/* Dropdown Kategori */}
              <div className="relative w-44 shrink-0">
                <select
                  value={kategoriTujuan}
                  onChange={(e) =>
                    setKategoriTujuan(e.target.value as "Dalam Negeri" | "Luar Negeri" | "")
                  }
                  className={`
                    w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold
                    focus:outline-none focus:ring-2 transition-all bg-white
                    appearance-none cursor-pointer
                    ${
                      kategoriTujuan === "Dalam Negeri"
                        ? "border-green-400 text-green-600 bg-green-50 focus:ring-green-200"
                        : kategoriTujuan === "Luar Negeri"
                        ? "border-blue-400 text-blue-600 bg-blue-50 focus:ring-blue-200"
                        : "border-gray-200 text-gray-400 focus:border-[#1B4EF5] focus:ring-[#1B4EF5]/20"
                    }
                  `}
                >
                  <option value="">Pilih kategori</option>
                  <option value="Dalam Negeri">🏠 Dalam Negeri</option>
                  <option value="Luar Negeri">🌏 Luar Negeri</option>
                </select>
                <svg
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Hint teks di bawah field */}
            <p className="text-xs mt-1.5">
              {tujuan && !kategoriTujuan && (
                <span className="text-orange-500 font-medium">
                  ⚠ Pilih kategori tujuan (Dalam Negeri / Luar Negeri)
                </span>
              )}
              {tujuan && kategoriTujuan === "Dalam Negeri" && (
                <span className="text-green-600 font-medium">
                  ✓ Tujuan bekerja di dalam wilayah Indonesia
                </span>
              )}
              {tujuan && kategoriTujuan === "Luar Negeri" && (
                <span className="text-blue-600 font-medium">
                  ✓ Tujuan bekerja ke luar negeri
                </span>
              )}
              {!tujuan && (
                <span className="text-gray-400">
                  Isi nama perusahaan / kota / negara tujuan, lalu pilih kategorinya
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Pendidikan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
            Pendidikan
          </h2>

          {/* Pendidikan & Jurusan */}
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
              <label className={labelClass}>Jurusan</label>
              <input
                type="text"
                placeholder="Masukkan jurusan"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Tahun Lulus & Keahlian */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tahun Lulus</label>
              <input
                type="number"
                placeholder="Contoh: 2020"
                min={1980}
                max={new Date().getFullYear()}
                value={tahunLulus}
                onChange={(e) => setTahunLulus(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Keahlian</label>
              <KeahlianPicker value={keahlian} onChange={setKeahlian} />
            </div>
          </div>
        </div>
        
        {/* ══════════════════════════════
            SECTION 3 — Alamat Sesuai KTP
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Alamat sesuai KTP
          </h2>

          {/* Kecamatan & Desa */}
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

          {/* Alamat */}
          <div>
            <label className={labelClass}>Alamat Lengkap</label>
            <textarea
              placeholder="Alamat sesuai KTP"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
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