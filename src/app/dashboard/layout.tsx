import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { ToastProvider } from "@/components/ui/toast";
import { RestaurantProvider } from "@/contexts/restaurant-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <ToastProvider>
      <RestaurantProvider>
        <DashboardShell userName={session.user.name ?? session.user.email ?? "User"}>
          {children}
        </DashboardShell>
      </RestaurantProvider>
    </ToastProvider>
  );
}
