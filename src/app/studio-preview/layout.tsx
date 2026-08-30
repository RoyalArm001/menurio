import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Restaurant Studio Preview",
  description: "Public visual prototype of the Menurio restaurant owner workspace.",
  robots: { index: false, follow: false },
};

export default function StudioPreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DashboardShell preview userName="Aram">
      {children}
    </DashboardShell>
  );
}
