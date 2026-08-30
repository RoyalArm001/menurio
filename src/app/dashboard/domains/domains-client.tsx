"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/states";

type Domain = {
  id: string;
  hostname: string;
  verified: boolean;
  verificationToken: string;
};

export default function DomainsClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [hostname, setHostname] = useState("");
  const { push } = useToast();

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const data = await api.listDomains(activeRestaurant.id);
      setDomains(data.domains);
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load domains", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load domains
    void load();
  }, [activeRestaurant?.id]);

  async function add() {
    if (!activeRestaurant || !hostname.trim()) return;
    try {
      await api.addDomain(activeRestaurant.id, hostname.trim());
      push("Domain added — verify DNS to activate", "success");
      setHostname("");
      await load();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Add failed", "error");
    }
  }

  async function verify(domainId: string) {
    if (!activeRestaurant) return;
    try {
      await api.verifyDomain(activeRestaurant.id, domainId);
      push("Domain verified", "success");
      await load();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Verification failed", "error");
    }
  }

  if (ctxLoading) return <p className="text-muted">Loading…</p>;
  if (!activeRestaurant) {
    return <EmptyState title="No restaurant" description="Create one first." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">Domains</h1>
        <p className="mt-2 text-muted">Custom domains require PRO+ plan.</p>
      </div>
      <Card>
        <CardHeader title="Platform URL" />
        <p className="font-mono text-sm">
          {process.env.NEXT_PUBLIC_APP_URL ?? ""}/r/{activeRestaurant.slug}
        </p>
      </Card>
      <Card>
        <CardHeader title="Add custom domain" />
        <div className="space-y-4">
          <div>
            <Label>Hostname</Label>
            <Input
              placeholder="menu.restaurant.am"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
            />
          </div>
          <Button onClick={add}>Add domain</Button>
        </div>
      </Card>
      <div className="space-y-3">
        {domains.map((d) => (
          <Card key={d.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{d.hostname}</p>
                {!d.verified ? (
                  <p className="mt-1 text-xs text-muted">
                    Add TXT record: <code>{d.verificationToken}</code>
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={d.verified ? "success" : "warning"}>
                  {d.verified ? "Verified" : "Pending"}
                </Badge>
                {!d.verified ? (
                  <Button size="sm" variant="secondary" onClick={() => verify(d.id)}>
                    Mark verified
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
