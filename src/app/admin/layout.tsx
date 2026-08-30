import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const ok = await isPlatformAdmin(session.user.id);
  if (!ok) redirect("/dashboard");

  return <div className="min-h-screen bg-paper">{children}</div>;
}
