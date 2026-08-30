import Link from "next/link";
import Image from "next/image";
import { cx } from "@/components/ui/button";
import { PLATFORM_BRANDING } from "@/lib/platform/branding";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[13px] shadow-[0_10px_28px_rgba(24,18,10,.22)]",
        className,
      )}
    >
      <Image
        src={PLATFORM_BRANDING.icon192}
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    </span>
  );
}

export function Wordmark({
  href = "/",
  light = false,
  compact = false,
}: {
  href?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center gap-2.5 font-bold tracking-normal",
        light ? "text-white" : "text-ink",
      )}
      aria-label="Menurio home"
    >
      <BrandMark />
      <span className="text-[19px]">
        Menurio{compact ? null : <span className="font-medium opacity-55"> / Restaurants</span>}
      </span>
    </Link>
  );
}
