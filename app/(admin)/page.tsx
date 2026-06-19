"use client";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

export default function AdminDashboard() {
  const stats = [
  { label: "TOTAL PRODUCTS", value: 0 },
  { label: "ORDERS TODAY", value: 0 },
  { label: "REVENUE (MTD)", value: "₹0" },
  { label: "ACTIVE USERS", value: 0 },
];

  return (
    <div className="space-y-6 anim-fade-up bg-white">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} padding="md">
            {s.value === null
              ? <Skeleton className="h-8 w-24 mb-2" />
              : <p className="font-display text-4xl mb-1">{s.value}</p>
            }
            <p className="font-mono text-[10px] tracking-[0.25em]" style={{ color: "var(--muted)" }}>{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}