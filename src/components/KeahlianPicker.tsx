"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { keahlianGroups } from "@/constants/keahlian";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function KeahlianPicker({
  value,
  onChange,
  placeholder = "Pilih keahlian",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value); // pilihan sementara, baru berlaku setelah "Terapkan"
  const [query, setQuery] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setDraft(value);
    setQuery("");
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const applyChoice = () => {
    onChange(draft);
    setOpen(false);
  };

  // ── Filter pencarian ──
  const keyword = query.trim().toLowerCase();
  const groups = useMemo(
    () =>
      keahlianGroups
        .map((g) => ({
          huruf: g.huruf,
          items: g.items.filter((item) => item.toLowerCase().includes(keyword)),
        }))
        .filter((g) => g.items.length > 0),
    [keyword]
  );
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  // Saat modal terbuka: fokus ke kolom cari, tutup dengan Esc,
  // dan gulir ke pilihan yang sedang aktif.
  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();
    listRef.current
      ?.querySelector<HTMLInputElement>("input[type=radio]:checked")
      ?.scrollIntoView({ block: "center" });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* ── Tombol pemicu (tampil seperti dropdown) ── */}
      <div className="relative">
        <button
          type="button"
          onClick={openModal}
          disabled={disabled}
          aria-haspopup="dialog"
          className={`w-full text-left border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white truncate focus:outline-none focus:ring-2 focus:ring-[#1B4EF5]/30 focus:border-[#1B4EF5] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
            value ? "pr-16 text-gray-700" : "pr-10 text-gray-400"
          }`}
        >
          {value || placeholder}
        </button>

        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Hapus pilihan keahlian"
            className="absolute right-9 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <svg
          className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* ── Modal pilih keahlian ── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="keahlian-picker-title"
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col"
          >
            {/* Judul + jumlah + pencarian */}
            <div className="px-8 pt-7 pb-4 space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 id="keahlian-picker-title" className="text-xl font-black text-gray-900">
                  Pilih Keahlian
                </h3>
                <p className="text-sm text-gray-500 shrink-0">Menampilkan {total} keahlian</p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#1B4EF5] transition-all">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Cari keahlian"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 min-w-0 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                />
                <div className="border-l border-gray-200 px-4 py-3 text-gray-700" aria-hidden="true">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Daftar per huruf */}
            <div ref={listRef} className="flex-1 overflow-y-auto min-h-[200px]">
              {groups.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-400">Keahlian tidak ditemukan</p>
              ) : (
                groups.map((g) => (
                  <div key={g.huruf} className="pb-3">
                    <div className="px-8 pt-4 pb-2 text-sm font-bold text-gray-500 border-b border-gray-200">
                      {g.huruf}
                    </div>
                    <ul>
                      {g.items.map((item) => (
                        <li key={item}>
                          <label
                            className={`flex items-center gap-4 px-8 py-3 cursor-pointer transition-colors ${
                              draft === item ? "bg-[#F4F7FF]" : "hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="keahlian-picker"
                              value={item}
                              checked={draft === item}
                              onChange={() => setDraft(item)}
                              className="w-5 h-5 shrink-0 accent-[#1B4EF5]"
                            />
                            <span className="text-base text-gray-800">{item}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Tombol */}
            <div className="px-8 py-5 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={closeModal}
                className="border-2 border-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={applyChoice}
                className="bg-[#1B4EF5] hover:bg-[#1540cc] text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}