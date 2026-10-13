"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FormGuard from "@/components/FormGuard";

export default function PMIBermasalahPage() {
  const router = useRouter();

  // ── State Identitas Diri ──
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("laki-laki");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorPaspor, setNomorPaspor] = useState("");

  // ── State Penempatan & Kepulangan ──
  const [negara, setNegara] = useState("");
  const [tanggalPulang, setTanggalPulang] = useState("");

  // ── State Detail Kasus ──
  const [permasalahan, setPermasalahan] = useState("");
  const [statusPMI, setStatusPMI] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // ── State Upload ──
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [dokumen, setDokumen] = useState<File | null>(null);
  const fotoRef = useRef<HTMLInputElement>(null);
  const dokumenRef = useRef<HTMLInputElement>(null);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDokumenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDokumen(file);
  };

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data PMI Bermasalah tersimpan");
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
          <h1 className="text-2xl font-black text-gray-900">Data PMI</h1>
          <p className="text-sm text-gray-500">Pekerja Migran Indonesia yang Bermasalah</p>
        </div>
        <button
          onClick={() => router.push("/pmi-non-prosedur/data")}
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
                type="text" maxLength={16} placeholder="Masukkan 16 digit NIK"
                value={nik} onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input
                type="text" placeholder="Masukkan nama lengkap"
                value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className={labelClass}>Jenis Kelamin</label>
            <div className="flex gap-3">
              {["laki-laki", "perempuan"].map((jk) => (
                <label key={jk} className={`${radioClass} ${
                  jenisKelamin === jk
                    ? "border-[#1B4EF5] bg-[#DDE5FE] text-[#1B4EF5]"
                    : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                }`}>
                  <input type="radio" name="jenisKelamin" value={jk}
                    checked={jenisKelamin === jk} onChange={() => setJenisKelamin(jk)}
                    className="accent-[#1B4EF5]" />
                  {jk === "laki-laki" ? "Laki-laki" : "Perempuan"}
                </label>
              ))}
            </div>
          </div>

          {/* Tempat & Tanggal Lahir */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tempat Lahir</label>
              <input type="text" placeholder="Kab/Kota"
                value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tanggal Lahir</label>
              <input type="date" value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className={labelClass}>Alamat</label>
            <textarea placeholder="Alamat lengkap" value={alamat}
              onChange={(e) => setAlamat(e.target.value)} rows={3}
              className={`${inputClass} resize-none`} />
          </div>

          {/* Nomor Paspor */}
          <div>
            <label className={labelClass}>Nomor Paspor</label>
            <input
              type="text" placeholder="Contoh: A1234567"
              value={nomorPaspor}
              onChange={(e) => setNomorPaspor(e.target.value.toUpperCase())}
              className={inputClass}
            />
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 2 — Upload Foto & Dokumen
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Foto &amp; Dokumen
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Upload Foto */}
            <div>
              <label className={labelClass}>Foto PMI</label>
              <div
                onClick={() => fotoRef.current?.click()}
                className="border-2 border-dashed border-[#1B4EF5]/30 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1B4EF5] hover:bg-[#DDE5FE]/30 transition-all min-h-[160px]"
              >
                {fotoPreview ? (
                  <div className="relative w-full">
                    <img src={fotoPreview} alt="Preview foto" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFoto(null); setFotoPreview(null); if (fotoRef.current) fotoRef.current.value = ""; }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#DDE5FE] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#1B4EF5]">Klik untuk upload foto</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP — Maks. 5MB</p>
                    </div>
                  </>
                )}
                <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
              </div>
              {foto && (
                <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {foto.name}
                </p>
              )}
            </div>

            {/* Upload Dokumen */}
            <div>
              <label className={labelClass}>Dokumen Pendukung</label>
              <div
                onClick={() => dokumenRef.current?.click()}
                className="border-2 border-dashed border-[#1B4EF5]/30 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1B4EF5] hover:bg-[#DDE5FE]/30 transition-all min-h-[160px]"
              >
                {dokumen ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 9H8v-2h5v2zm2-4H8V5h7v2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 break-all max-w-[180px]">{dokumen.name}</p>
                      <p className="text-xs text-gray-400">{(dokumen.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDokumen(null); if (dokumenRef.current) dokumenRef.current.value = ""; }}
                      className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hapus dokumen
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#DDE5FE] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1B4EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#1B4EF5]">Klik untuk upload dokumen</p>
                      <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX — Maks. 10MB</p>
                    </div>
                  </>
                )}
                <input ref={dokumenRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleDokumenChange} />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 3 — Penempatan & Kepulangan
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            Penempatan dan kepulangan
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Negara</label>
              <input type="text" placeholder="Negara tujuan"
                value={negara} onChange={(e) => setNegara(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tanggal pulang</label>
              <input type="date" value={tanggalPulang}
                onChange={(e) => setTanggalPulang(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            SECTION 4 — Detail Kasus
        ══════════════════════════════ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            Detail kasus
          </h2>

          {/* Status PMI — Ilegal / Legal */}
          <div>
            <label className={labelClass}>Status PMI</label>
            <div className="flex gap-3">
              {[
                { value: "ilegal", label: "Ilegal", icon: "🚫" },
                { value: "legal",  label: "Legal",  icon: "✅" },
              ].map((s) => (
                <label key={s.value} className={`${radioClass} flex-1 justify-center ${
                  statusPMI === s.value
                    ? s.value === "ilegal"
                      ? "border-red-400 bg-red-50 text-red-600"
                      : "border-green-400 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-500 hover:border-[#1B4EF5]/40"
                }`}>
                  <input type="radio" name="statusPMI" value={s.value}
                    checked={statusPMI === s.value} onChange={() => setStatusPMI(s.value)}
                    className="accent-[#1B4EF5]" />
                  <span>{s.icon} {s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Permasalahan */}
          <div>
            <label className={labelClass}>Permasalahan</label>
            <div className="relative">
              <select value={permasalahan} onChange={(e) => setPermasalahan(e.target.value)} className={selectClass}>
                <option value="">Pilih kategori permasalahan</option>
                <option value="deportasi">Deportasi</option>
                <option value="deportasi-sakit">Deportasi sakit</option>
                <option value="meninggal">Meninggal</option>
              </select>
              <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className={labelClass}>Keterangan / kronologi</label>
            <textarea
              placeholder="Jelaskan secara ringkas kondisi saat dipulangkan"
              value={keterangan} onChange={(e) => setKeterangan(e.target.value)}
              rows={5} className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* ── Tombol Aksi ── */}
        <div className="group-disabled:hidden flex items-center justify-center gap-4 pt-2">
          <button type="submit"
            className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold px-10 py-3 rounded-full transition-all">
            Simpan data
          </button>
          <button type="button" onClick={() => router.back()}
            className="border-2 border-[#1B4EF5] text-[#1B4EF5] font-bold px-10 py-3 rounded-full hover:bg-[#DDE5FE] transition-all">
            Batal
          </button>
        </div>
      </form>
    </FormGuard>
    </div>
  );
}