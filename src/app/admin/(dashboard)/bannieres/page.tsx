"use client";

import { useEffect, useState } from "react";
import type { Banner } from "@/lib/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", subtitle: "", ctaLabel: "Découvrir la boutique", ctaHref: "/boutique" });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    setBanners(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ title: "", subtitle: "", ctaLabel: "Découvrir la boutique", ctaHref: "/boutique" });
    load();
  }

  async function toggleActive(banner: Banner) {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, active: !b.active } : b)));
    await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !banner.active })
    });
  }

  async function remove(id: string) {
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900">Bannières de la page d'accueil</h1>
      <p className="mt-1 text-sm text-ink-500">La première bannière active est affichée dans la section hero de l'accueil.</p>

      <form onSubmit={addBanner} className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-ink-100 bg-white p-5 sm:grid-cols-2">
        <input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-ink-200 px-3 py-2 text-sm sm:col-span-2" />
        <textarea placeholder="Sous-titre" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} rows={2} className="rounded-lg border border-ink-200 px-3 py-2 text-sm sm:col-span-2" />
        <input placeholder="Texte du bouton" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} className="rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        <input placeholder="Lien du bouton" value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} className="rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        <button type="submit" className="btn-primary sm:col-span-2">Ajouter la bannière</button>
      </form>

      {loading ? (
        <p className="mt-6 text-sm text-ink-400">Chargement…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="flex items-start justify-between rounded-2xl border border-ink-100 bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-ink-800">{b.title}</p>
                <p className="mt-1 text-xs text-ink-500">{b.subtitle}</p>
                <p className="mt-1 text-xs text-ink-400">{b.ctaLabel} → {b.ctaHref}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button onClick={() => toggleActive(b)} className={`text-xs font-medium ${b.active ? "text-green-600" : "text-ink-400"}`}>
                  {b.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => remove(b.id)} className="text-xs font-medium text-red-500 hover:underline">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
