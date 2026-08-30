import { auth } from "@/lib/auth";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await auth();

  return (
    <OnboardingClient
      userName={session?.user?.name ?? ""}
      userEmail={session?.user?.email ?? ""}
    />
  );
}
