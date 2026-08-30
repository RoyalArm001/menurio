/* eslint-disable @next/next/no-img-element -- ImageResponse renders embedded data URI images. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Menurio for Restaurants - websites, QR menus and orders";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const logoPromise = readFile(
  join(process.cwd(), "public", "icons", "menurio-logo-192.png"),
);

export default async function Image() {
  const logo = await logoPromise;
  const logoSrc = `data:image/png;base64,${Buffer.from(logo).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fbf8f2 0%, #f1e8d8 58%, #14110d 100%)",
          color: "#1d1b18",
          fontFamily: "Arial, sans-serif",
          padding: 76,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: 690 }}>
            <div
              style={{
                display: "flex",
                width: 250,
                alignItems: "center",
                border: "1px solid rgba(150,105,31,.35)",
                borderRadius: 999,
                padding: "12px 18px",
                color: "#96691f",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              12 months free
            </div>
            <div
              style={{
                marginTop: 34,
                fontSize: 74,
                lineHeight: 0.98,
                fontWeight: 800,
              }}
            >
              Your restaurant website, menu and orders.
            </div>
            <div
              style={{
                marginTop: 28,
                color: "#5f5a51",
                fontSize: 30,
                lineHeight: 1.35,
              }}
            >
              A fast, multilingual digital home for restaurants, cafes, bars
              and hotels.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: 286,
              height: 286,
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(218,169,80,.75)",
              borderRadius: 58,
              background: "linear-gradient(135deg, #0b0d13, #241d12)",
              boxShadow: "0 30px 100px rgba(24,18,10,.35)",
            }}
          >
            <img src={logoSrc} alt="" width={230} height={230} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
