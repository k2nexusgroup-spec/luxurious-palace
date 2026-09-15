import Link from "next/link";
import { readStore } from "@/lib/db";
import { formatFcfa } from "@/lib/whatsapp";

export default function AdminDashboardPage() {
  const store = readStore();
  const totalProducts = store.products.length;
  const totalOrders = store.orders.length;
  const newOrders = store.orders.filter((o) => o.status === "nouvelle").length;
  const revenue = store.orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = store.products.filter((p) => p.stock <= 5).slice(0, 6);

  const cards = [
    { label: "Produits", value: totalProducts, href: "/admin/produits" },
    { label: "Commandes reçues", value: totalOrders, href: "/admin/commandes" },
    { label: "Nouvelles commandes", value: newOrders, href: "/admin/commandes" },
    { label: "Chiffre enregistré", value: formatFcfa(revenue), href: "/admin/commandes" }
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900">Tableau de bord</h1>
      <p className="mt-1 text-sm text-ink-500">Vue d'ensemble de la boutique Luxurious Palace.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-ink-100 bg-white p-5 transition-shadow hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-900">Stock faible</h2>
        {lowStock.length === 0 ? (
          <p className="mt-3 text-sm text-ink-400">Aucun produit en stock faible pour le moment.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-100">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-ink-700">{p.name}</span>
                <span className="font-semibold text-red-500">{p.stock} restant(s)</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
