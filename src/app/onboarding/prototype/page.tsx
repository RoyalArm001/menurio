import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Create your restaurant",
  description: "Launch your restaurant website and menu with Menurio.",
  robots: { index: false, follow: false },
};

export default function OnboardingPrototypePage() {
  return <OnboardingWizard />;
}
