"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { QrCode } from "lucide-react";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/states";
import { QrCodeDisplay } from "@/components/qr/qr-code-display";

type QrRecord = {
  id: string;
  permanentId: string;
  permanentUrl: string;
  type: string;
  label: string | null;
  tableLabel: string | null;
};

export default function QrClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [codes, setCodes] = useState<QrRecord[]>([]);
  const [tableLabel, setTableLabel] = useState("");
  const { push } = useToast();

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const data = await api.listQrCodes(activeRestaurant.id);
      setCodes(data.qrCodes as QrRecord[]);
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load QR codes", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load QR codes
    void load();
  }, [activeRestaurant?.id]);

  async function create(type: "restaurant" | "menu" | "table") {
    if (!activeRestaurant) return;
    try {
      await api.createQrCode(activeRestaurant.id, {
        type,
        label: type === "table" ? `Table ${tableLabel}` : type,
        tableLabel: type === "table" ? tableLabel : undefined,
      });
      push("QR code created", "success");
      setTableLabel("");
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
        <h1 className="display-font text-3xl font-semibold tracking-tight">
          QR Codes
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Generate permanent QR codes for your restaurant, menu, or tables.
          Guests scan once — the link always stays valid even if you change your
          domain or slug.
        </p>
      </div>

      <Card>
        <h2 className="font-semibold">Generate new QR</h2>
        <p className="mt-1 text-sm text-muted">
          Restaurant QR opens your homepage. Menu QR opens the menu. Table QR
          includes the table number for orders.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => create("restaurant")}>
            <QrCode className="size-4" /> Restaurant QR
          </Button>
          <Button variant="secondary" onClick={() => create("menu")}>
            Menu QR
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
          <div>
            <Label>Table number</Label>
            <Input
              value={tableLabel}
              onChange={(e) => setTableLabel(e.target.value)}
              placeholder="12"
              className="mt-1 w-32"
            />
          </div>
          <Button
            variant="secondary"
            disabled={!tableLabel.trim()}
            onClick={() => create("table")}
          >
            Table QR
          </Button>
        </div>
      </Card>

      {codes.length === 0 ? (
        <EmptyState
          title="No QR codes yet"
          description="Your main restaurant QR is created automatically during setup. Generate more above."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {codes.map((qr) => (
            <Card key={qr.id} className="overflow-hidden p-0">
              <div className="bg-gradient-to-br from-cream to-white p-6">
                <QrCodeDisplay
                  value={qr.permanentUrl}
                  size={180}
                  caption="Scan to open"
                  className="mx-auto border-0 shadow-none"
                />
              </div>
              <div className="border-t border-line p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold capitalize">
                    {qr.label ?? qr.type}
                  </h3>
                  <Badge variant="muted">{qr.type}</Badge>
                </div>
                {qr.tableLabel ? (
                  <p className="mt-1 text-sm text-muted">
                    Table {qr.tableLabel}
                  </p>
                ) : null}
                <p className="mt-3 break-all font-mono text-xs text-muted">
                  {qr.permanentUrl}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={qr.permanentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-brand"
                  >
                    Open link →
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-ink"
                    onClick={() => {
                      void navigator.clipboard.writeText(qr.permanentUrl);
                      push("Link copied", "success");
                    }}
                  >
                    Copy link
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
