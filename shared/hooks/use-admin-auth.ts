"use client";

import { useEffect, useState } from "react";
import pb from "@/shared/lib/pocketbase";

export function useAdminAuth() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (pb.authStore.isValid) {
        if (!cancelled) {
          setAuthorized(true);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (!res.ok) {
          window.location.href = "/admin-login";
          return;
        }

        const data = await res.json();
        pb.authStore.save(data.token, data.record);

        if (!cancelled) {
          setAuthorized(true);
        }
      } catch {
        window.location.href = "/admin-login";
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return { authorized, loading };
}

export async function adminLogout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  pb.authStore.clear();
  window.location.href = "/admin-login";
}
