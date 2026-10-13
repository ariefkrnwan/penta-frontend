"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleType = "Admin" | "Pegawai";

type Pegawai = {
  id: number;
  nama: string;
  nip: string;
  role: RoleType;
  aktif: boolean;
  username: string;
  password: string;
  inisial: string;
  warna: string;
};

const ROLE_LIST: RoleType[] = ["Admin", "Pegawai"];

const ROLE_WARNA: Record<RoleType, string> = {
  "Admin":   "bg-purple-100 text-purple-700",
  "Pegawai": "bg-blue-100 text-[#1B4EF5]",
};

const WARNA_INISIAL = [
  "bg-[#1B4EF5]", "bg-teal-500", "bg-purple-500",
  "bg-orange-500", "bg-pink-500", "bg-green-600",
];

function getInisial(nama: string) {
  return nama.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function autoUsername(nama: string) {
  return nama.trim().toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
}

// ─── Komponen Kekuatan Password ───────────────────────────────────────────────

function KekuatanPassword({ password }: { password: string }) {
  const panjang    = password.length >= 8;
  const hurufBesar = /[A-Z]/.test(password);
  const angka      = /[0-9]/.test(password);
  const simbol     = /[^A-Za-z0-9]/.test(password);
  const skor       = [panjang, hurufBesar, angka, simbol].filter(Boolean).length;
  const label      = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const warna      = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const teks       = ["", "text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];
  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= skor ? warna[skor] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${teks[skor]}`}>Kekuatan: {label[skor]}</p>
    </div>
  );
}

// ─── Data Dummy ───────────────────────────────────────────────────────────────

const dataDummy: Pegawai[] = [
  { id:1, nama:"Administrator",  nip:"ADMIN-001",          role:"Admin",   aktif:true,  username:"admin",          password:"Admin1234!", inisial:"AD", warna:"bg-purple-500" },
  { id:2, nama:"Budi Waseso",    nip:"198005122005011004", role:"Pegawai", aktif:true,  username:"budi.waseso",    password:"budi1234",   inisial:"BW", warna:"bg-[#1B4EF5]"  },
  { id:3, nama:"Siti Maimunah",  nip:"198511202010012008", role:"Pegawai", aktif:true,  username:"siti.maimunah",  password:"siti1234",   inisial:"SM", warna:"bg-teal-500"   },
  { id:4, nama:"Agus Susanto",   nip:"PIIT-2023-045",      role:"Pegawai", aktif:false, username:"agus.susanto",   password:"agus1234",   inisial:"AS", warna:"bg-orange-500" },
];

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function ManajemenPenggunaPage() {
  const router = useRouter();

  // ── SEMUA useState di atas segalanya ──
  const [currentUserRole] = useState<RoleType>("Admin"); // TODO: baca dari JWT
  const [daftarPegawai, setDaftarPegawai] = useState<Pegawai[]>(dataDummy);
  const [search, setSearch]               = useState("");
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage = 5;

  // State Admin password
  const [adminPassSaatIni, setAdminPassSaatIni] = useState("");
  const [adminPassBaru, setAdminPassBaru]       = useState("");
  const [showAdminSaatIni, setShowAdminSaatIni] = useState(false);
  const [showAdminBaru, setShowAdminBaru]       = useState(false);
  const [adminMsg, setAdminMsg]                 = useState("");

  // State Modal Tambah/Edit
  const [showModal, setShowModal]       = useState(false);
  const [modalMode, setModalMode]       = useState<"tambah"|"edit">("tambah");
  const [editId, setEditId]             = useState<number|null>(null);
  const [formNama, setFormNama]         = useState("");
  const [formNip, setFormNip]           = useState("");
  const [formRole, setFormRole]         = useState<RoleType>("Pegawai");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [showFormPass, setShowFormPass] = useState(false);
  const [formError, setFormError]       = useState("");

  // State Modal Reset Password
  const [showResetPass, setShowResetPass]       = useState(false);
  const [resetPassId, setResetPassId]           = useState<number|null>(null);
  const [resetPassNama, setResetPassNama]       = useState("");
  const [resetPassBaru, setResetPassBaru]       = useState("");
  const [showResetPassVal, setShowResetPassVal] = useState(false);

  // State Modal Hapus
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId]     = useState<number|null>(null);
  const [deleteNama, setDeleteNama] = useState("");

  // ── Guard: useEffect setelah semua useState ──
  useEffect(() => {
    if (currentUserRole !== "Admin") {
      router.replace("/dashboard");
    }
  }, [currentUserRole, router]);

  // Jangan render konten jika bukan Admin
  if (currentUserRole !== "Admin") return null;

  // ── Statistik ──
  const totalAdmin   = daftarPegawai.filter((p) => p.role === "Admin").length;
  const totalPegawai = daftarPegawai.filter((p) => p.role === "Pegawai").length;
  const totalAktif   = daftarPegawai.filter((p) => p.aktif).length;

  // ── Filter & Paginasi ──
  const filtered   = daftarPegawai.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.nip.toLowerCase().includes(search.toLowerCase()) ||
    p.username.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  // ── Handlers ──
  const handleSimpanAdminPass = () => {
    if (!adminPassSaatIni) { setAdminMsg("❌ Masukkan password saat ini."); return; }
    if (adminPassBaru.length < 8) { setAdminMsg("❌ Password baru minimal 8 karakter."); return; }
    setAdminMsg("✅ Password berhasil diperbarui!");
    setAdminPassSaatIni(""); setAdminPassBaru("");
    setTimeout(() => setAdminMsg(""), 3000);
  };

  const handleToggleAktif = (id: number) => {
    setDaftarPegawai((prev) => prev.map((p) => p.id === id ? { ...p, aktif: !p.aktif } : p));
  };

  const handleTambah = () => {
    setModalMode("tambah"); setEditId(null);
    setFormNama(""); setFormNip(""); setFormRole("Pegawai");
    setFormUsername(""); setFormPassword(""); setFormError("");
    setShowModal(true);
  };

  const handleEdit = (p: Pegawai) => {
    setModalMode("edit"); setEditId(p.id);
    setFormNama(p.nama); setFormNip(p.nip); setFormRole(p.role);
    setFormUsername(p.username); setFormPassword(""); setFormError("");
    setShowModal(true);
  };

  const handleFormNamaChange = (val: string) => {
    setFormNama(val);
    if (modalMode === "tambah") setFormUsername(autoUsername(val));
  };

  const handleSimpanModal = () => {
    if (!formNama.trim())     { setFormError("Nama wajib diisi."); return; }
    if (!formNip.trim())      { setFormError("NIP / ID wajib diisi."); return; }
    if (!formUsername.trim()) { setFormError("Username wajib diisi."); return; }
    if (modalMode === "tambah" && formPassword.length < 8) {
      setFormError("Password minimal 8 karakter."); return;
    }
    if (modalMode === "tambah") {
      const idx = daftarPegawai.length % WARNA_INISIAL.length;
      setDaftarPegawai((prev) => [...prev, {
        id: Date.now(), nama: formNama.trim(), nip: formNip.trim(),
        role: formRole, aktif: true, username: formUsername.trim(),
        password: formPassword, inisial: getInisial(formNama),
        warna: WARNA_INISIAL[idx],
      }]);
    } else {
      setDaftarPegawai((prev) => prev.map((p) =>
        p.id === editId ? {
          ...p, nama: formNama.trim(), nip: formNip.trim(), role: formRole,
          username: formUsername.trim(),
          password: formPassword ? formPassword : p.password,
          inisial: getInisial(formNama),
        } : p
      ));
    }
    setShowModal(false);
  };

  const handleOpenResetPass = (p: Pegawai) => {
    setResetPassId(p.id); setResetPassNama(p.nama);
    setResetPassBaru(""); setShowResetPass(true);
  };

  const handleSimpanResetPass = () => {
    if (resetPassBaru.length < 8) return;
    setDaftarPegawai((prev) => prev.map((p) =>
      p.id === resetPassId ? { ...p, password: resetPassBaru } : p
    ));
    setShowResetPass(false); setResetPassBaru("");
  };

  const handleOpenHapus = (p: Pegawai) => {
    setDeleteId(p.id); setDeleteNama(p.nama); setShowDelete(true);
  };

  const handleHapus = () => {
    setDaftarPegawai((prev) => prev.filter((p) => p.id !== deleteId));
    setShowDelete(false); setDeleteId(null);
  };

  // ── Style ──
  const inputClass  = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white";
  const selectClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all bg-white appearance-none cursor-pointer";
  const labelClass  = "block text-xs font-semibold text-gray-600 mb-1.5";

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500">Kelola akun Admin dan Pegawai sistem PENTA</p>
        </div>
        <button onClick={handleTambah}
          className="flex items-center gap-2 bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Tambah pegawai
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Total Admin</p>
          <p className="text-3xl font-black text-purple-600">{totalAdmin}</p>
          <p className="text-xs text-gray-400 mt-1">akun dengan akses penuh</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Total Pegawai</p>
          <p className="text-3xl font-black text-[#1B4EF5]">{totalPegawai}</p>
          <p className="text-xs text-gray-400 mt-1">akun pegawai terdaftar</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 mb-1">Akun Aktif</p>
          <p className="text-3xl font-black text-green-600">{totalAktif}</p>
          <p className="text-xs text-gray-400 mt-1">dari {daftarPegawai.length} total akun</p>
        </div>
      </div>

      {/* ── Tabel Pengguna ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Daftar Pengguna</h2>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-60 focus-within:border-[#1B4EF5] transition-all">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Cari nama, NIP, username..."
              value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400" />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#DDE5FE] text-gray-700">
              <th className="text-left px-5 py-3 font-semibold w-10">No</th>
              <th className="text-left px-4 py-3 font-semibold">Pengguna</th>
              <th className="text-left px-4 py-3 font-semibold">NIP / ID</th>
              <th className="text-left px-4 py-3 font-semibold">Username</th>
              <th className="text-left px-4 py-3 font-semibold">Role</th>
              <th className="text-center px-4 py-3 font-semibold">Status</th>
              <th className="text-center px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">Tidak ada pengguna ditemukan</td></tr>
            ) : (
              paginated.map((p, idx) => {
                const isAdmin = p.role === "Admin";
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs">{(currentPage-1)*itemsPerPage+idx+1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${p.warna} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                          {p.inisial}
                        </div>
                        <span className="font-semibold text-gray-800">{p.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.nip}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.username}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_WARNA[p.role]}`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isAdmin ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Aktif</span>
                      ) : (
                        <button onClick={() => handleToggleAktif(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            p.aktif ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.aktif ? "bg-green-500" : "bg-gray-400"}`} />
                          {p.aktif ? "Aktif" : "Nonaktif"}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(p)}
                          className="flex items-center gap-1.5 bg-[#DDE5FE] hover:bg-[#1B4EF5] text-[#1B4EF5] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button onClick={() => handleOpenResetPass(p)}
                          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-500 text-amber-500 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Reset Pass
                        </button>
                        {!isAdmin && (
                          <button onClick={() => handleOpenHapus(p)}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Menampilkan <span className="font-semibold text-gray-600">{filtered.length === 0 ? 0 : (currentPage-1)*itemsPerPage+1}–{Math.min(currentPage*itemsPerPage, filtered.length)}</span> dari <span className="font-semibold text-gray-600">{filtered.length}</span> pengguna
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1,p-1))} disabled={currentPage===1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1B4EF5] hover:text-[#1B4EF5] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            {Array.from({length: totalPages},(_,i)=>i+1).map((pg) => (
              <button key={pg} onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentPage===pg ? "bg-[#1B4EF5] text-white shadow" : "border border-gray-200 text-gray-600 hover:border-[#1B4EF5] hover:text-[#1B4EF5]"}`}>
                {pg}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages,p+1))} disabled={currentPage===totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1B4EF5] hover:text-[#1B4EF5] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Ganti Password Admin ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <div>
            <h2 className="font-black text-gray-900 text-base">Ganti Password Admin</h2>
            <p className="text-xs text-gray-500">Hanya berlaku untuk akun Admin yang sedang login</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Password Saat Ini</label>
            <div className="relative">
              <input type={showAdminSaatIni ? "text" : "password"} placeholder="Masukkan password saat ini"
                value={adminPassSaatIni} onChange={(e) => setAdminPassSaatIni(e.target.value)} className={inputClass} />
              <button type="button" onClick={() => setShowAdminSaatIni(!showAdminSaatIni)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Password Baru</label>
            <div className="relative">
              <input type={showAdminBaru ? "text" : "password"} placeholder="Minimal 8 karakter"
                value={adminPassBaru} onChange={(e) => setAdminPassBaru(e.target.value)} className={inputClass} />
              <button type="button" onClick={() => setShowAdminBaru(!showAdminBaru)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <KekuatanPassword password={adminPassBaru} />
          </div>
        </div>
        {adminMsg && (
          <p className={`text-sm font-medium ${adminMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>{adminMsg}</p>
        )}
        <div className="flex justify-end">
          <button onClick={handleSimpanAdminPass}
            className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold px-8 py-2.5 rounded-full text-sm transition-all">
            Simpan password
          </button>
        </div>
      </div>

      {/* ══ MODAL Tambah / Edit ══ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DDE5FE] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1B4EF5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
                <h3 className="font-black text-gray-900">{modalMode === "tambah" ? "Tambah Pegawai" : "Edit Pegawai"}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama lengkap" value={formNama}
                  onChange={(e) => handleFormNamaChange(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>NIP / ID</label>
                <input type="text" placeholder="NIP atau ID pegawai" value={formNip}
                  onChange={(e) => setFormNip(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Role Akses</label>
                <div className="relative">
                  <select value={formRole} onChange={(e) => setFormRole(e.target.value as RoleType)} className={selectClass}>
                    {ROLE_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Username
                  {modalMode === "tambah" && <span className="text-gray-400 font-normal ml-1">(otomatis dari nama)</span>}
                </label>
                <input type="text" placeholder="Username untuk login" value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{modalMode === "edit" ? "Password Baru (opsional)" : "Password"}</label>
                <div className="relative">
                  <input type={showFormPass ? "text" : "password"}
                    placeholder={modalMode === "edit" ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                    value={formPassword} onChange={(e) => setFormPassword(e.target.value)} className={inputClass} />
                  <button type="button" onClick={() => setShowFormPass(!showFormPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </div>
                <KekuatanPassword password={formPassword} />
              </div>
              {formError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
              )}
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-all">
                Batal
              </button>
              <button onClick={handleSimpanModal}
                className="flex-1 bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                {modalMode === "tambah" ? "Tambah" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL Reset Password ══ */}
      {showResetPass && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Reset Password</h3>
                <p className="text-xs text-gray-500">{resetPassNama}</p>
              </div>
            </div>
            <div>
              <label className={labelClass}>Password Baru</label>
              <div className="relative">
                <input type={showResetPassVal ? "text" : "password"} placeholder="Minimal 8 karakter"
                  value={resetPassBaru} onChange={(e) => setResetPassBaru(e.target.value)} className={inputClass} />
                <button type="button" onClick={() => setShowResetPassVal(!showResetPassVal)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <KekuatanPassword password={resetPassBaru} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowResetPass(false); setResetPassBaru(""); }}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-all">
                Batal
              </button>
              <button onClick={handleSimpanResetPass} disabled={resetPassBaru.length < 8}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL Hapus ══ */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hapus Pegawai</h3>
                <p className="text-xs text-gray-500">Data yang dihapus tidak bisa dikembalikan.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Yakin ingin menghapus <span className="font-semibold text-gray-800">{deleteNama}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDelete(false); setDeleteId(null); }}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-all">
                Batal
              </button>
              <button onClick={handleHapus}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}