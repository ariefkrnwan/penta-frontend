"use client";

import { useState, useEffect } from "react";

type RoleType = "Admin" | "Pegawai" | null;

export function useRole(): RoleType {
  const [role, setRole] = useState<RoleType>(null);

  useEffect(() => {
    try {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      if (!tokenCookie) return;
      const token = tokenCookie.split("=")[1];
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role as RoleType);
    } catch {
      setRole(null);
    }
  }, []);

  return role;
}