import { cn } from "@/lib/format";

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-line/80 bg-surface">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-cream/60">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 font-semibold text-ink sm:px-5"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line/70 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-4 text-muted sm:px-5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-500/12 text-blue-700",
    ACCEPTED: "bg-indigo-500/12 text-indigo-700",
    PREPARING: "bg-amber-500/12 text-amber-700",
    READY: "bg-success/12 text-success",
    COMPLETED: "bg-ink/8 text-ink",
    REJECTED: "bg-red-500/12 text-red-700",
    CANCELLED: "bg-muted/20 text-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        styles[status] ?? "bg-cream text-muted",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
