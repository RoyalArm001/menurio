"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/states";

type Branch = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  isDefault: boolean;
  isActive: boolean;
};

export default function BranchesClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const { push } = useToast();

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const data = await api.listBranches(activeRestaurant.id);
      setBranches(data.branches as Branch[]);
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load branches", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load branches
    void load();
  }, [activeRestaurant?.id]);

  async function create() {
    if (!activeRestaurant || !name.trim()) return;
    try {
      await api.createBranch(activeRestaurant.id, {
        name: name.trim(),
        address: address.trim() || undefined,
      });
      push("Branch created", "success");
      setName("");
      setAddress("");
      await load();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Create failed", "error");
    }
  }

  if (ctxLoading) return <p className="text-muted">Loading…</p>;
  if (!activeRestaurant) {
    return <EmptyState title="No restaurant" description="Create one first." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">Branches</h1>
        <p className="mt-2 text-muted">Manage locations. Multi-branch requires PRO+.</p>
      </div>
      <Card>
        <CardHeader title="Add branch" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
        <Button className="mt-4" onClick={create}>
          Add branch
        </Button>
      </Card>
      <div className="space-y-3">
        {branches.map((b) => (
          <Card key={b.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-sm text-muted">{b.address ?? "No address"}</p>
              </div>
              <div className="flex gap-2">
                {b.isDefault ? <Badge variant="success">Default</Badge> : null}
                {!b.isActive ? <Badge variant="warning">Inactive</Badge> : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
