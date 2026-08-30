"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/format";

export function QrCodeDisplay({
  value,
  size = 160,
  brandColor = "#D95532",
  caption,
  className,
}: {
  value: string;
  size?: number;
  brandColor?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[22px] border border-line bg-white p-4 shadow-soft",
        className,
      )}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        marginSize={2}
        fgColor={brandColor}
        bgColor="#ffffff"
        role="img"
        aria-label={caption ?? "QR code"}
      />
      {caption ? (
        <p className="mt-3 text-center text-xs font-bold uppercase tracking-wider text-muted">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
