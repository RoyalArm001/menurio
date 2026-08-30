"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export function MarketingMobileActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      const footer = document.querySelector("footer");
      const footerVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight
        : false;
      setVisible(
        window.scrollY > Math.min(window.innerHeight * 0.72, 560) && !footerVisible,
      );
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <div className="mobile-safe-bottom fade-up fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 px-2 pt-2 shadow-[0_-12px_40px_rgba(0,0,0,.12)] backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-[.8fr_1.2fr] gap-2">
        <Link href="/r/demo-restaurant" className={buttonStyles({ variant: "secondary", size: "md", className: "w-full" })}>View demo</Link>
        <Link href="/setup-preview" className={buttonStyles({ size: "md", className: "w-full" })}>Create free</Link>
      </div>
    </div>
  );
}
