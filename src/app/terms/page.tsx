import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/shell";

export const metadata: Metadata = {
  title: "Terms of Service | Menurio",
  description: "Terms for using Menurio restaurant websites, menus, and ordering tools.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <main className="site-container py-12 sm:py-16">
        <article className="mx-auto max-w-3xl rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Menurio</p>
          <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight text-ink">Terms of Service</h1>
          <p className="mt-4 text-sm leading-6 text-muted">Effective date: August 30, 2026</p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-muted">
            <section>
              <h2 className="text-lg font-semibold text-ink">Using Menurio</h2>
              <p className="mt-2">You may use Menurio to manage a restaurant&apos;s public website, menu, QR code, and permitted ordering tools. You are responsible for the accuracy of your restaurant content, prices, availability, contact details, and compliance with applicable laws.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">Accounts and access</h2>
              <p className="mt-2">Keep account credentials confidential and grant staff access only when authorized. Restaurant owners are responsible for activity performed through their tenant account.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">Plans and service changes</h2>
              <p className="mt-2">Features depend on the active subscription plan. We may update the service to improve reliability, security, or compliance. Payment terms will be shown before a paid plan is activated.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">Content and acceptable use</h2>
              <p className="mt-2">Do not upload unlawful, infringing, deceptive, or harmful content, attempt to access another restaurant&apos;s data, or interfere with the platform&apos;s availability or security.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">Contact</h2>
              <p className="mt-2">For account or service questions, contact Menurio using the support channel shown in your dashboard.</p>
            </section>
          </div>
        </article>
      </main>
    </MarketingShell>
  );
}
