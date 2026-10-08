"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import {
  Users,
  Store,
  ShoppingBag,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  X,
  Layers,
  Zap,
  Phone,
  Check,
  XCircle,
  Sparkles,
} from "lucide-react";

type RestaurantInfo = {
  id: string;
  name: string;
  slug: string;
  role: string;
  isOwner: boolean;
  isPublished: boolean;
  createdAt: string;
};

type UserRecord = {
  id: string;
  name: string | null;
  email: string;
  isPlatformAdmin: boolean;
  emailVerified: string | null;
  createdAt: string;
  restaurants: RestaurantInfo[];
};

type PlanRequestItem = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  requestedPlan: string;
  currentPlan: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  contactPhone: string | null;
  notes: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

type AdminOverviewData = {
  stats: { restaurants: number; users: number; orders: number };
  recentRestaurants: Array<{ id?: string; name: string; slug: string; createdAt: string }>;
  recentAudit: Array<{ action: string; createdAt: string }>;
  designs?: Array<{
    restaurantId: string;
    themeId: string;
    whiteLabelEnabled: boolean;
    customCssEnabled: boolean;
  }>;
  customDomains?: Array<{ restaurantId: string; hostname: string; verified: boolean }>;
  subscriptions?: Array<{ restaurantId: string; plan: string; status: string }>;
};

const ALL_PLANS = ["FREE", "START", "PRO", "PRO_PLUS"] as const;

export default function AdminOverviewPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "users" | "overview">("requests");
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [planRequestsList, setPlanRequestsList] = useState<PlanRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "owner" | "empty">("all");

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, usersRes, requestsRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/admin/users"),
        fetch("/api/admin/plan-requests"),
      ]);

      if (!overviewRes.ok) throw new Error("Failed to load overview data");
      if (!usersRes.ok) throw new Error("Failed to load users data");

      const overviewJson = await overviewRes.json();
      const usersJson = await usersRes.json();
      const requestsJson = requestsRes.ok ? await requestsRes.json() : { requests: [] };

      setOverviewData(overviewJson);
      setUsersList(usersJson.users ?? []);
      setPlanRequestsList(requestsJson.requests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function handleApprovePlan(requestId: string) {
    setActionLoadingId(requestId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/plan-requests/${requestId}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to approve plan request");

      setSuccessMessage(
        `Plan request approved! Restaurant subscription has been upgraded to ${data.plan}.`,
      );
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleRejectPlan(requestId: string) {
    setActionLoadingId(requestId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/plan-requests/${requestId}/reject`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to reject plan request");

      setSuccessMessage("Plan request marked as rejected.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDirectPlanChange(restaurantId: string, newPlan: string) {
    setActionLoadingId(restaurantId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update restaurant plan");

      setSuccessMessage(`Restaurant plan directly updated to ${newPlan}! Entitlements are now live.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plan");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error ?? "Failed to delete user");
      }

      setSuccessMessage(
        `User ${userToDelete.email} and all linked restaurant data have been permanently deleted.`,
      );
      setUserToDelete(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  }

  const pendingRequestsCount = useMemo(() => {
    return planRequestsList.filter((r) => r.status === "PENDING").length;
  }, [planRequestsList]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.name && user.name.toLowerCase().includes(query)) ||
        user.restaurants.some(
          (r) =>
            r.name.toLowerCase().includes(query) ||
            r.slug.toLowerCase().includes(query),
        );

      if (!matchQuery) return false;

      if (roleFilter === "admin") return user.isPlatformAdmin;
      if (roleFilter === "owner") return user.restaurants.length > 0;
      if (roleFilter === "empty") return user.restaurants.length === 0 && !user.isPlatformAdmin;

      return true;
    });
  }, [usersList, searchQuery, roleFilter]);

  return (
    <div className="site-container py-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-4">
          <Wordmark href="/admin" compact />
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Platform Superadmin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-soft hover:bg-cream"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-95"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error ? (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      {/* Overview Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-[24px] border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Pending Requests</p>
            <Zap className="size-5 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">{pendingRequestsCount}</p>
          <p className="mt-1 text-xs text-muted">Awaiting your approval</p>
        </div>

        <div className="rounded-[24px] border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Registered Users</p>
            <Users className="size-5 text-brand" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">
            {overviewData ? overviewData.stats.users : usersList.length}
          </p>
          <p className="mt-1 text-xs text-muted">Auto-created accounts</p>
        </div>

        <div className="rounded-[24px] border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Active Restaurants</p>
            <Store className="size-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">
            {overviewData ? overviewData.stats.restaurants : "—"}
          </p>
          <p className="mt-1 text-xs text-muted">Across all tenants</p>
        </div>

        <div className="rounded-[24px] border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Total Orders</p>
            <ShoppingBag className="size-5 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-ink">
            {overviewData ? overviewData.stats.orders : "—"}
          </p>
          <p className="mt-1 text-xs text-muted">Platform-wide orders</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex border-b border-line gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition relative ${
            activeTab === "requests"
              ? "border-brand text-brand"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Zap className="size-4" />
          Plan Upgrade Requests
          {pendingRequestsCount > 0 ? (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
              {pendingRequestsCount} new
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === "users"
              ? "border-brand text-brand"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Users className="size-4" />
          Registered Users & Restaurants ({usersList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === "overview"
              ? "border-brand text-brand"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Layers className="size-4" />
          Tenants & System Overview
        </button>
      </div>

      {/* TAB 1: PLAN UPGRADE REQUESTS */}
      {activeTab === "requests" ? (
        <div className="rounded-[28px] border border-line bg-surface p-6 shadow-soft">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                Subscription Plan Upgrade Requests
              </h2>
              <p className="text-sm text-muted">
                Review submitted requests from restaurant owners. Approving immediately activates all plan entitlements.
              </p>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="self-start sm:self-center text-xs text-brand font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="size-3" /> Refresh Requests
            </button>
          </div>

          {planRequestsList.length === 0 ? (
            <div className="py-12 text-center text-muted">
              <Zap className="mx-auto size-8 text-line" />
              <p className="mt-2 font-semibold text-ink">No Plan Requests Yet</p>
              <p className="text-xs text-muted">
                When restaurant owners request START, PRO, or PRO+ tiers from their dashboard, they will appear here for your approval.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold uppercase tracking-wider text-muted">
                    <th className="pb-3 pl-2">Restaurant / Owner</th>
                    <th className="pb-3">Contact Phone</th>
                    <th className="pb-3">Current → Requested Plan</th>
                    <th className="pb-3">Submitted</th>
                    <th className="pb-3">Notes</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {planRequestsList.map((req) => (
                    <tr key={req.id} className="hover:bg-paper/60 transition">
                      <td className="py-4 pl-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink">{req.restaurantName}</span>
                            <Link
                              href={`/r/${req.restaurantSlug}`}
                              target="_blank"
                              className="text-xs text-brand hover:underline font-mono inline-flex items-center"
                            >
                              /{req.restaurantSlug}
                              <ExternalLink className="size-3 ml-0.5" />
                            </Link>
                          </div>
                          <p className="text-xs text-muted">
                            {req.userName || "No name"} ({req.userEmail})
                          </p>
                        </div>
                      </td>

                      <td className="py-4 text-xs font-mono text-ink">
                        {req.contactPhone ? (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="size-3 text-muted" />
                            {req.contactPhone}
                          </span>
                        ) : (
                          <span className="text-muted italic">—</span>
                        )}
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-paper px-2.5 py-0.5 text-xs font-mono text-muted border border-line">
                            {req.currentPlan.replace("_", "+")}
                          </span>
                          <span className="text-xs text-muted">→</span>
                          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand uppercase">
                            {req.requestedPlan.replace("_", "+")}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 text-xs text-muted">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 text-xs text-muted max-w-xs truncate">
                        {req.notes || <span className="italic text-muted/60">—</span>}
                      </td>

                      <td className="py-4">
                        {req.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                            Pending
                          </span>
                        ) : req.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            <Check className="size-3.5" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-line/60 px-2.5 py-1 text-xs font-bold text-muted">
                            <XCircle className="size-3.5" /> Rejected
                          </span>
                        )}
                      </td>

                      <td className="py-4 pr-2 text-right">
                        {req.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={actionLoadingId === req.id}
                              onClick={() => handleApprovePlan(req.id)}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <Check className="size-3.5" />
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId === req.id}
                              onClick={() => handleRejectPlan(req.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-red-600 hover:border-red-200 disabled:opacity-50"
                            >
                              <X className="size-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {/* TAB 2: REGISTERED USERS & RESTAURANTS */}
      {activeTab === "users" ? (
        <div className="rounded-[28px] border border-line bg-surface p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">All Registered Users & Restaurants</h2>
              <p className="text-sm text-muted">
                Inspect auto-registered accounts, manage active plans directly, or permanently delete fake users.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, email, restaurant…"
                className="w-full rounded-full border border-line bg-paper py-2 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="mb-6 flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "all"
                  ? "bg-brand text-white"
                  : "bg-paper text-muted hover:bg-cream"
              }`}
            >
              All ({usersList.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("owner")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "owner"
                  ? "bg-brand text-white"
                  : "bg-paper text-muted hover:bg-cream"
              }`}
            >
              Restaurant Owners ({usersList.filter((u) => u.restaurants.length > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("admin")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "admin"
                  ? "bg-brand text-white"
                  : "bg-paper text-muted hover:bg-cream"
              }`}
            >
              Admins ({usersList.filter((u) => u.isPlatformAdmin).length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("empty")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "empty"
                  ? "bg-brand text-white"
                  : "bg-paper text-muted hover:bg-cream"
              }`}
            >
              No Restaurant ({usersList.filter((u) => u.restaurants.length === 0 && !u.isPlatformAdmin).length})
            </button>
          </div>

          {/* Users Table */}
          {loading && usersList.length === 0 ? (
            <div className="py-12 text-center text-muted">
              <RefreshCw className="mx-auto size-6 animate-spin text-brand" />
              <p className="mt-2 text-sm">Loading users from database…</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-muted">
              <Users className="mx-auto size-8 text-line" />
              <p className="mt-2 font-medium text-ink">No users found</p>
              <p className="text-xs text-muted">Try changing your search query or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold uppercase tracking-wider text-muted">
                    <th className="pb-3 pl-2">User / Email</th>
                    <th className="pb-3">Registered Date</th>
                    <th className="pb-3">Restaurant & Active Plan</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-paper/60 transition">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">
                              {user.name || "No name"}
                            </p>
                            <p className="text-xs text-muted font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-xs text-muted">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted" />
                          <span>
                            {new Date(user.createdAt).toLocaleDateString()} {" "}
                            {new Date(user.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-4">
                        {user.restaurants.length === 0 ? (
                          <span className="text-xs text-muted italic">No restaurants</span>
                        ) : (
                          <div className="space-y-2">
                            {user.restaurants.map((r) => {
                              const sub = overviewData?.subscriptions?.find((s) => s.restaurantId === r.id);
                              const currentPlan = sub?.plan ?? "FREE";
                              return (
                                <div key={r.id} className="flex flex-wrap items-center gap-2">
                                  <Building2 className="size-3.5 text-brand shrink-0" />
                                  <span className="font-semibold text-ink">{r.name}</span>
                                  <Link
                                    href={`/r/${r.slug}`}
                                    target="_blank"
                                    className="text-xs text-brand hover:underline font-mono inline-flex items-center gap-0.5 mr-2"
                                  >
                                    /{r.slug}
                                    <ExternalLink className="size-3" />
                                  </Link>

                                  {/* Direct Plan Selector for Admin */}
                                  <select
                                    value={currentPlan}
                                    disabled={actionLoadingId === r.id}
                                    onChange={(e) => handleDirectPlanChange(r.id, e.target.value)}
                                    className="rounded-lg border border-line bg-paper px-2 py-0.5 text-xs font-bold text-ink cursor-pointer focus:border-brand"
                                    title="Change plan directly"
                                  >
                                    {ALL_PLANS.map((p) => (
                                      <option key={p} value={p}>
                                        {p.replace("_", "+")} Plan
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      <td className="py-4">
                        {user.isPlatformAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <ShieldCheck className="size-3.5" />
                            Admin
                          </span>
                        ) : user.restaurants.length > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            Owner
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-line/60 px-2.5 py-1 text-xs font-semibold text-muted">
                            Member
                          </span>
                        )}
                      </td>

                      <td className="py-4 pr-2 text-right">
                        {user.isPlatformAdmin ? (
                          <span className="text-xs text-muted italic">Protected</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50"
                          >
                            <Trash2 className="size-3.5" />
                            Delete Fake User
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {/* TAB 3: OVERVIEW & SYSTEM DETAILS */}
      {activeTab === "overview" && overviewData ? (
        <div className="space-y-8">
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-soft">
              <h2 className="font-bold text-ink">Recent Restaurants</h2>
              <ul className="mt-4 space-y-3 text-sm divide-y divide-line">
                {overviewData.recentRestaurants.map((r) => (
                  <li key={r.slug} className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-semibold text-ink">{r.name}</span>
                      <p className="text-xs text-muted font-mono">/{r.slug}</p>
                    </div>
                    <Link
                      href={`/r/${r.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                    >
                      Visit site <ExternalLink className="size-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-soft">
              <h2 className="font-bold text-ink">Recent Audit Log</h2>
              <ul className="mt-4 space-y-2 text-xs font-mono">
                {overviewData.recentAudit.map((a, i) => (
                  <li
                    key={i}
                    className="flex justify-between rounded-xl bg-paper p-2 text-ink border border-line"
                  >
                    <span>{a.action}</span>
                    <span className="text-muted">
                      {new Date(a.createdAt).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-[28px] border border-line bg-surface p-6 shadow-soft">
            <h2 className="font-bold text-ink">Tenant Design & Entitlements</h2>
            <p className="mt-1 text-sm text-muted">
              Theme, white-label status, custom domain and active plan.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {(overviewData.designs ?? []).map((design) => {
                const sub = overviewData.subscriptions?.find(
                  (s) => s.restaurantId === design.restaurantId,
                );
                const domain = overviewData.customDomains?.find(
                  (d) => d.restaurantId === design.restaurantId,
                );
                const restaurant = overviewData.recentRestaurants.find(
                  (r) => r.id === design.restaurantId,
                );
                return (
                  <li
                    key={design.restaurantId}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-2.5"
                  >
                    <span className="font-semibold text-ink">
                      {restaurant?.name ?? design.restaurantId}
                    </span>
                    <span className="rounded-full bg-paper px-3 py-1 text-xs text-muted border border-line">
                      {design.themeId} · {sub?.plan ?? "FREE"} ·
                      {design.whiteLabelEnabled ? " white-label" : " branded"} ·
                      {domain ? ` ${domain.hostname}` : " no custom domain"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      ) : null}

      {/* CONFIRMATION MODAL FOR DELETING USER */}
      {userToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setUserToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-[28px] border border-line bg-surface p-6 shadow-float">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50">
              <AlertTriangle className="size-6" />
            </div>

            <h3 className="mt-4 text-xl font-bold text-ink">
              Delete Fake / Spam User?
            </h3>

            <p className="mt-2 text-sm text-muted">
              Are you sure you want to delete user{" "}
              <strong className="text-ink">{userToDelete.email}</strong>?
            </p>

            {userToDelete.restaurants.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/50 p-3 text-xs text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                <p className="font-semibold">Associated Restaurant Data will be deleted:</p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {userToDelete.restaurants.map((r) => (
                    <li key={r.id}>
                      {r.name} (/{r.slug}) — including all menus, branches, orders & QR codes
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-3 text-xs text-muted">
              This action is permanent and cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setUserToDelete(null)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Confirm & Delete
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
