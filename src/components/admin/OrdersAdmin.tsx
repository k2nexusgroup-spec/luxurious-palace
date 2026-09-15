"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { formatFcfa } from "@/lib/whatsapp";

const STATUSES: Order["status"][] = ["nouvelle", "confirmee", "expediee", "livree", "annulee"];

const STATUS_LABELS: Record<Order["status"], string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée"
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    setOrders(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Order["status"]) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900">Commandes</h1>
      <p className="mt-1 text-sm text-ink-500">
        Commandes enregistrées automatiquement lorsqu'un client valide son panier vers WhatsApp.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-ink-400">Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-400">
          Aucune commande pour le moment.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900">
                    {order.customerName} {order.customerPhone && `· ${order.customerPhone}`}
                  </p>
                  <p className="text-xs text-ink-400">
                    {new Date(order.createdAt).toLocaleString("fr-FR")} · {order.city || "Ville non précisée"}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as Order["status"])}
                  className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <ul className="mt-4 space-y-1 border-t border-ink-100 pt-3 text-sm text-ink-600">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {item.quantity}× {item.name}
                      {item.size && ` · ${item.size}`}
                      {item.color && ` · ${item.color}`}
                    </span>
                    <span>{formatFcfa(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex justify-end border-t border-ink-100 pt-3 text-sm font-bold text-ink-900">
                Total : {formatFcfa(order.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
