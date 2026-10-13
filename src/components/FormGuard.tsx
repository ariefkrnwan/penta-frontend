"use client";

import { useRole } from "@/hooks/useRole";

/**
 * Membungkus form input supaya:
 * - Admin hanya bisa melihat: semua kolom terkunci dan muncul keterangan khusus Admin.
 * - Pegawai bisa mengisi seperti biasa.
 *
 * Cara pakai:
 *   1. Bungkus <form> dengan <FormGuard> ... </FormGuard>
 *   2. Beri class "group-disabled:hidden" pada <div> pembungkus tombol Simpan dan Batal
 *      supaya tombol itu hilang untuk Admin.
 */
export default function FormGuard({ children }: { children: React.ReactNode }) {
  const role = useRole();
  const isAdmin = role === "Admin";
  // Terkunci selama role belum terbaca, supaya Admin tidak sempat bisa mengetik.
  const readOnly = role !== "Pegawai";

  return (
    <>
      {isAdmin && (
        <div className="flex items-start gap-3 bg-[#DDE5FE] text-[#1B4EF5] rounded-xl px-4 py-3 text-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Anda masuk sebagai Admin. Halaman ini hanya bisa dilihat, form tidak dapat diisi.</p>
        </div>
      )}

      <fieldset
        disabled={readOnly}
        className={`group min-w-0 border-0 p-0 m-0 ${
          readOnly
            ? "[&_:disabled]:cursor-not-allowed [&_input:disabled]:bg-gray-50 [&_textarea:disabled]:bg-gray-50 [&_select:disabled]:bg-gray-50"
            : ""
        }`}
      >
        {children}
      </fieldset>
    </>
  );
}