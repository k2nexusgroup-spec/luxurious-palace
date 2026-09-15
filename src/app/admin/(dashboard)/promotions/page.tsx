"use client";

import { useEffect, useState } from "react";
import type { PromoCode } from "@/lib/types";

export default function AdminPromotionsPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("10");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/promo-codes");
    setCodes(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    await fetch("/api/admin/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, discountPercent: Number(discount), active: true })
    });
    setCode("");
    setDiscount("10");
    load();
  }

  async function toggleActive(promo: PromoCode) {
    setCodes((prev) => prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p)));
    await fetch(`/api/admin/promo-codes/${promo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !promo.active })
    });
  }

  async function remove(id: string) {
    await fetch(`/api/admin/promo-codes/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900">Promotions & codes promo</h1>
      <p className="mt-1 text-sm text-ink-500">
        Ces codes sont indicatifs : leur application au panier pourra être automatisée ultérieurement.
      </p>

      <form onSubmit={addCode} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-ink-100 bg-white p-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="EX: NOEL10" className="rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Réduction (%)</label>
          <input type="number" min={1} max={100} value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-24 rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="btn-primary">Ajouter</button>
      </form>

      {loading ? (
        <p className="mt-6 text-sm text-ink-400">Chargement…</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Réduction</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink-800">{c.code}</td>
                  <td className="px-4 py-3 text-ink-600">{c.discountPercent}%</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c)} className={c.active ? "text-green-600" : "text-ink-400"}>
                      {c.active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(c.id)} className="text-xs font-medium text-red-500 hover:underline">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
