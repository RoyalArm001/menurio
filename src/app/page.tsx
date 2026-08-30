export const dynamic = "force-dynamic";

import { MarketingHomeV2 } from "@/components/marketing-v2/home";
import { redirectIfCustomDomainRoot } from "@/lib/tenant/resolve-request";

export default async function Home() {
  if (process.env.DATABASE_URL) {
    await redirectIfCustomDomainRoot();
  }

  return <MarketingHomeV2 />;
}
