import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
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
  const isAdmin = await isPlatformAdmin(session.user.id);

  return (
    <ToastProvider>
      <RestaurantProvider>
        <DashboardShell
          userName={session.user.name ?? session.user.email ?? "User"}
          isPlatformAdmin={isAdmin}
        >
          {children}
        </DashboardShell>
      </RestaurantProvider>
    </ToastProvider>
  );
}
