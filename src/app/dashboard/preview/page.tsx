import type { Metadata } from "next";
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";

export const metadata: Metadata = {
  title: "Dashboard Preview",
  description: "A public visual preview of the Menurio restaurant owner dashboard.",
  robots: { index: false, follow: false },
};

export default function DashboardPreviewPage() {
  return <OverviewDashboard userName="Aram" restaurantName="Avena Yerevan" />;
}
