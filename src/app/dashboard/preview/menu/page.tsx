import type { Metadata } from "next";
import { MenuWorkbench } from "@/components/dashboard/menu-workbench";

export const metadata: Metadata = {
  title: "Menu Editor Preview — Menurio",
  robots: { index: false, follow: false },
};

export default function MenuEditorPreviewPage() {
  return <MenuWorkbench />;
}
