import type { Metadata } from "next";
import { ThemeStudio } from "@/components/dashboard/theme-studio";

export const metadata: Metadata = {
  title: "Theme Studio Preview — Menurio",
  robots: { index: false, follow: false },
};

export default function ThemeStudioPreviewPage() {
  return <ThemeStudio />;
}
