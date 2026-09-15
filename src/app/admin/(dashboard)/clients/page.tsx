"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { formatFcfa } from "@/lib/whatsapp";

interface CustomerSummary {
  name: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

export default function AdminClientsPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((orders: Order[]) => {
        const map = new Map<string, CustomerSummary>();
        orders.forEach((o) => {
          const key = o.customerPhone || o.customerName;
          const existing = map.get(key);
          if (existing) {
            existing.ordersCount += 1;
            existing.totalSpent += o.total;
            if (new Date(o.createdAt) > new Date(existing.lastOrderAt)) existing.lastOrderAt = o.createdAt;
          } else {
            map.set(key, {
              name: o.customerName,
              phone: o.customerPhone,
              city: o.city,
              ordersCount: 1,
              totalSpent: o.total,
              lastOrderAt: o.createdAt
            });
          }
        });
        setCustomers(Array.from(map.values()));
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900">Clients</h1>
      <p className="mt-1 text-sm text-ink-500">Clients identifiés à partir des commandes passées sur le site.</p>

      {loading ? (
        <p className="mt-6 text-sm text-ink-400">Chargement…</p>
      ) : customers.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-400">
          Aucun client enregistré pour le moment.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Commandes</th>
                <th className="px-4 py-3">Total dépensé</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone || c.name} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink-800">{c.name}</td>
                  <td className="px-4 py-3 text-ink-500">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-ink-500">{c.city || "—"}</td>
                  <td className="px-4 py-3 text-ink-500">{c.ordersCount}</td>
                  <td className="px-4 py-3 font-semibold text-ink-800">{formatFcfa(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
