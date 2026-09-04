"use client";

import { useEffect, useState } from "react";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api } from "@/lib/api/client";
import { EmptyState } from "@/components/ui/states";
import {
  PLAN_PRICING,
  type SubscriptionPlan,
} from "@/lib/entitlements";
import {
  Check,
  Zap,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Phone,
  Send,
  X,
  AlertCircle,
} from "lucide-react";

type Subscription = {
  plan: SubscriptionPlan;
  status: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
};

type PendingPlanRequest = {
  id: string;
  requestedPlan: SubscriptionPlan;
  currentPlan: SubscriptionPlan;
  status: "PENDING" | "APPROVED" | "REJECTED";
  contactPhone: string | null;
  notes: string | null;
  createdAt: string;
};

const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  FREE: [
    "1 Language",
    "Single branch",
    "Digital QR Menu",
    "Standard themes",
    "Custom logo & cover image",
  ],
  START: [
    "Everything in Free",
    "Up to 3 Languages",
    "Brand primary colors",
    "Pro visual themes",
    "Multiple team members",
  ],
  PRO: [
    "Everything in Start",
    "Up to 5 Languages",
    "Online Table & Pickup Ordering",
    "Multi-branch support",
    "Advanced Analytics & Charts",
    "Advanced SEO Optimization",
    "AI Menu Import (Excel / PDF / Photo)",
    "PWA App Installation & Push Notifications",
  ],
  PRO_PLUS: [
    "Everything in Pro",
    "Up to 8 Languages",
    "Custom Domain (e.g. menu.yoursite.am)",
    "Table Ordering & Waiter Call System",
    "Full White-label (Remove platform branding)",
    "Custom CSS Styling",
    "Priority 24/7 Support",
  ],
};

const PLAN_ORDER: SubscriptionPlan[] = ["FREE", "START", "PRO", "PRO_PLUS"];

export default function SubscriptionClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [pendingReq, setPendingReq] = useState<PendingPlanRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Upgrade Modal State
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SubscriptionPlan | null>(null);
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function loadData() {
    if (!activeRestaurant) return;
    try {
      setLoading(true);
      const [restData, reqRes] = await Promise.all([
        api.getRestaurant(activeRestaurant.id),
        fetch(`/api/restaurants/${activeRestaurant.id}/plan-request`),
      ]);

      setSub(restData.subscription as Subscription);

      if (reqRes.ok) {
        const reqJson = await reqRes.json();
        setPendingReq(reqJson.pendingRequest ?? null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [activeRestaurant]);

  async function handleSendPlanRequest() {
    if (!activeRestaurant || !selectedPlanForUpgrade) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/restaurants/${activeRestaurant.id}/plan-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPlan: selectedPlanForUpgrade,
          contactPhone,
          notes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Failed to submit plan request");
      }

      setPendingReq(json.request);
      setSuccessMsg(
        `Your request for the ${selectedPlanForUpgrade} plan has been submitted! The administrator will review and activate it shortly.`,
      );
      setSelectedPlanForUpgrade(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission error");
    } finally {
      setSubmitting(false);
    }
  }

  if (ctxLoading || (loading && !sub)) {
    return <p className="text-muted">Loading subscription details…</p>;
  }

  if (!activeRestaurant || !sub) {
    return <EmptyState title="No restaurant selected" description="Please select or create a restaurant first." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="display-font text-3xl font-semibold tracking-tight">
              Subscription & Plans
            </h1>
            <p className="mt-2 text-muted">
              Choose the ideal tier for your restaurant. Upgrade requests are reviewed and activated by our team.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 shadow-soft">
            <span className="text-xs text-muted">Current Plan:</span>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand uppercase">
              {sub.plan.replace("_", "+")}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg ? (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg(null)}>
            <X className="size-4 text-emerald-700" />
          </button>
        </div>
      ) : null}

      {errorMsg ? (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg(null)}>
            <X className="size-4 text-red-700" />
          </button>
        </div>
      ) : null}

      {/* Pending Request Banner */}
      {pendingReq ? (
        <div className="rounded-[24px] border border-amber-500/30 bg-amber-500/10 p-5 text-amber-900 dark:text-amber-200 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                <Clock className="size-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  Plan Upgrade Request Under Review
                </h3>
                <p className="mt-1 text-sm opacity-90">
                  You requested to upgrade to the{" "}
                  <strong className="underline decoration-amber-500">
                    {pendingReq.requestedPlan.replace("_", "+")}
                  </strong>{" "}
                  plan on {new Date(pendingReq.createdAt).toLocaleDateString()}.
                  Once confirmed by the admin, your new features will activate instantly!
                </p>
                {pendingReq.contactPhone ? (
                  <p className="mt-1 text-xs opacity-75">
                    Contact Phone: {pendingReq.contactPhone}
                  </p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPlanForUpgrade(pendingReq.requestedPlan)}
              className="self-start sm:self-center rounded-full border border-amber-600/30 bg-surface px-4 py-2 text-xs font-semibold text-ink shadow-soft hover:bg-cream"
            >
              Update Request Details
            </button>
          </div>
        </div>
      ) : null}

      {/* Pricing Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLAN_ORDER.map((planKey) => {
          const isCurrent = sub.plan === planKey;
          const isPending = pendingReq?.requestedPlan === planKey;
          const pricing = PLAN_PRICING[planKey];
          const features = PLAN_FEATURES[planKey];
          const isPro = planKey === "PRO" || planKey === "PRO_PLUS";

          return (
            <div
              key={planKey}
              className={`relative flex flex-col justify-between rounded-[28px] border p-6 transition-all duration-200 ${
                isCurrent
                  ? "border-brand bg-brand/5 shadow-float ring-2 ring-brand/20"
                  : isPro
                    ? "border-line bg-surface shadow-soft hover:shadow-float"
                    : "border-line bg-surface shadow-soft"
              }`}
            >
              <div>
                {/* Popular Badge */}
                {planKey === "PRO" ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-soft flex items-center gap-1">
                    <Sparkles className="size-3" /> Most Popular
                  </div>
                ) : null}

                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <h3 className="display-font text-xl font-bold text-ink">
                    {planKey.replace("_", "+")}
                  </h3>
                  {isCurrent ? (
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
                      Active
                    </span>
                  ) : isPending ? (
                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      Pending
                    </span>
                  ) : null}
                </div>

                {/* Price */}
                <div className="mt-4">
                  <p className="text-2xl font-extrabold text-ink">
                    {pricing.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {planKey === "FREE" ? "Free forever" : "Billed monthly"}
                  </p>
                </div>

                {/* Features Divider */}
                <div className="my-5 border-t border-line" />

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-ink/90">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="rounded-full bg-emerald-500/15 p-0.5 text-emerald-600 mt-0.5 shrink-0">
                        <Check className="size-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-line">
                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-full border border-line bg-surface/60 py-2.5 text-xs font-bold text-muted cursor-not-allowed text-center"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanForUpgrade(planKey);
                      setContactPhone("");
                    }}
                    className={`w-full rounded-full py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-soft ${
                      isPro
                        ? "bg-brand text-white hover:opacity-95"
                        : "border border-line bg-surface text-ink hover:bg-cream"
                    }`}
                  >
                    {isPending ? "Update Request" : "Request This Plan"}
                    <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REQUEST PLAN MODAL */}
      {selectedPlanForUpgrade ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => !submitting && setSelectedPlanForUpgrade(null)}
          />
          <div className="relative w-full max-w-md rounded-[32px] border border-line bg-surface p-6 shadow-float">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-2xl bg-brand/10 p-2 text-brand">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-ink">
                    Request {selectedPlanForUpgrade.replace("_", "+")} Plan
                  </h3>
                  <p className="text-xs text-muted">
                    {PLAN_PRICING[selectedPlanForUpgrade].label}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="text-muted hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-4 text-xs text-muted leading-relaxed">
              Submit your upgrade request. Once approved by the administrator, your permissions and plan capabilities will be updated automatically.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+374 99 123456"
                    className="w-full rounded-xl border border-line bg-paper py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  Used by our team to confirm or contact you regarding payment & billing.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Notes or Requirements (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., We need custom domain setup for menu.ourcafe.am..."
                  rows={3}
                  className="w-full rounded-xl border border-line bg-paper p-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSendPlanRequest}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-soft hover:opacity-95 disabled:opacity-50"
              >
                {submitting ? (
                  "Submitting…"
                ) : (
                  <>
                    <Send className="size-3.5" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
