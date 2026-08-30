"use client";

import { useEffect } from "react";

/** Suppress browser automatic translation on public restaurant pages */
export function PublicTranslationGuard() {
  useEffect(() => {
    document.documentElement.setAttribute("translate", "no");
    document.documentElement.classList.add("notranslate");

    let meta = document.querySelector('meta[name="google"][content="notranslate"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "google");
      meta.setAttribute("content", "notranslate");
      document.head.appendChild(meta);
    }
  }, []);

  return null;
}
