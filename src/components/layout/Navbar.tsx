"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const time =
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) + " WIB";
      setDateTime({ date, time });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm">

      {/* Kiri — Branding */}
      <div className="flex items-center gap-1">
        <span className="text-gray-900 font-black text-xl">Sistem</span>
        <span className="text-[#1B4EF5] font-black text-xl ml-1">PENTA</span>
      </div>

      {/* Kanan — Date & Time */}
      <div className="flex items-center gap-3 bg-[#DDE5FE] border border-[#1B4EF5]/20 rounded-xl px-4 py-2">
        <div className="text-[#1B4EF5]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	          <path d="M0 0h24v24H0z" fill="none" />
	          <path fill="currentColor" d="M7.288 13.713Q7 13.425 7 13t.288-.712T8 12t.713.288T9 13t-.288.713T8 14t-.712-.288m4 0Q11 13.426 11 13t.288-.712T12 12t.713.288T13 13t-.288.713T12 14t-.712-.288m4 0Q15 13.426 15 13t.288-.712T16 12t.713.288T17 13t-.288.713T16 14t-.712-.288M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V3q0-.425.288-.712T7 2t.713.288T8 3v1h8V3q0-.425.288-.712T17 2t.713.288T18 3v1h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5z" />
          </svg>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 leading-tight">{dateTime.date}</p>
          <p className="text-sm font-bold text-[#1B4EF5] leading-tight">{dateTime.time}</p>
        </div>
      </div>

    </header>
  );
}