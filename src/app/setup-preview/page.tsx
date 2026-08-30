import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Create your restaurant",
  description: "Preview Menurio's six-step restaurant setup experience.",
  robots: { index: false, follow: false },
};

export default function SetupPreviewPage() {
  return <OnboardingWizard />;
}
