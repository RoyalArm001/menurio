"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import { cn } from "@/lib/format";
import {
  resolvePublicLanguage,
} from "@/lib/i18n/public-languages";

export function LanguageSwitcher({
  defaultLanguage = "en",
  supportedLanguages,
  className,
}: {
  defaultLanguage?: string;
  supportedLanguages?: string[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = resolvePublicLanguage(
    searchParams.get("lang") ?? defaultLanguage,
    supportedLanguages,
    defaultLanguage,
  );

  const languages = supportedLanguages?.length
    ? supportedLanguages
    : ["en", "hy", "ru"];

  function setLanguage(code: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", code);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
      router.refresh();
    });
  }

  return (
    <div
      className={cn("flex items-center gap-1 rounded-full border border-line bg-white p-1", className)}
      role="group"
      aria-label="Language"
    >
      {languages.map((code) => {
        const active = currentLang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={cn(
              "min-w-[2.5rem] rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide transition",
              active
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:bg-cream hover:text-ink",
            )}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
