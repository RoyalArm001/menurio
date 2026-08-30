import { Suspense } from "react";
import { LoadingState } from "@/components/ui/states";
import DemoMenuPageClient from "./menu-client";

export default function DemoMenuPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading menu..." />}>
      <DemoMenuPageClient />
    </Suspense>
  );
}
