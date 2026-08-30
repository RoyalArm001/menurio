"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/states";

type Member = {
  name: string | null;
  email: string;
  role: string;
};

export default function TeamClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EDITOR");
  const { push } = useToast();

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const data = await api.listMembers(activeRestaurant.id);
      setMembers(data.members as Member[]);
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load team", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch team on restaurant change
    void load();
  }, [activeRestaurant?.id]);

  async function invite() {
    if (!activeRestaurant || !email.trim()) return;
    try {
      await api.addMember(activeRestaurant.id, email.trim(), role);
      push("Member invited", "success");
      setEmail("");
      await load();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Invite failed", "error");
    }
  }

  if (ctxLoading) return <p className="text-muted">Loading…</p>;
  if (!activeRestaurant) {
    return <EmptyState title="No restaurant" description="Create a restaurant first." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">Team</h1>
        <p className="mt-2 text-muted">Manage staff roles and permissions.</p>
      </div>
      <Card>
        <CardHeader title="Invite member" />
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@restaurant.am"
            />
          </div>
          <div>
            <Label>Role</Label>
            <select
              className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {["ADMIN", "MANAGER", "EDITOR", "ORDER_OPERATOR"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={invite}>Invite</Button>
          </div>
        </div>
      </Card>
      <Card padding="none">
        <div className="p-5">
          <CardHeader title="Members" />
        </div>
        <DataTable
          columns={["Name", "Role", "Email"]}
          rows={members.map((m) => [m.name ?? "—", m.role, m.email])}
        />
      </Card>
    </div>
  );
}
