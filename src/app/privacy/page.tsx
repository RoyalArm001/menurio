import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Privacy Policy | Menurio",
  description: "How Menurio handles restaurant account and service data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <main className="site-container py-12 sm:py-16">
        <article className="mx-auto max-w-3xl rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Menurio</p>
          <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
          <p className="mt-4 text-sm leading-6 text-muted">Effective date: August 30, 2026</p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-muted">
            <section>
              <h2 className="text-lg font-semibold text-ink">Data we process</h2>
              <p className="mt-2">We process account information, restaurant profile and menu content, authorized staff details, service configuration, and operational events needed to provide the platform.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">How data is used</h2>
              <p className="mt-2">Data is used to operate the restaurant&apos;s site and menu, secure accounts, provide analytics, handle authorized orders, and improve reliability. We do not sell restaurant account data.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">Restaurant responsibility</h2>
              <p className="mt-2">Each restaurant is responsible for the guest and order information it collects through its public pages, including providing any notices or lawful basis required for its business.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">Security and retention</h2>
              <p className="mt-2">Access to tenant data is restricted server-side by restaurant membership and permissions. Data is retained only as needed for service operation, legal obligations, and legitimate business records.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">Your requests</h2>
              <p className="mt-2">Restaurant owners can request access, correction, or deletion of their account data through Menurio support, subject to applicable legal and operational requirements.</p>
            </section>
          </div>
        </article>
      </main>
    </MarketingShell>
  );
}
