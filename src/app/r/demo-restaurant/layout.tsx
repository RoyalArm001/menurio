import type { Metadata } from "next";
import { DemoRestaurantShell } from "@/components/restaurant/demo-shell";

export const metadata: Metadata = {
  title: {
    absolute: "Avena Yerevan Demo Restaurant - Menurio",
  },
  description:
    "Explore the Menurio demo restaurant website with a visual menu, gallery, story and contact page.",
  alternates: {
    canonical: "/r/demo-restaurant",
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Avena Yerevan Demo Restaurant - Menurio",
    description:
      "A complete restaurant website and QR menu demo built with Menurio.",
    url: "/r/demo-restaurant",
    type: "website",
  },
};

export default function DemoRestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoRestaurantShell>{children}</DemoRestaurantShell>;
}
