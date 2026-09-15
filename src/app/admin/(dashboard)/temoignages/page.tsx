"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", city: "", rating: "5", text: "" });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addTestimonial(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.text) return;
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating: Number(form.rating) })
    });
    setForm({ name: "", city: "", rating: "5", text: "" });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-900">Témoignages</h1>
      <p className="mt-1 text-sm text-ink-500">
        Les avis affichés sur le site sont marqués comme données de démonstration tant que de vrais avis clients ne
        sont pas ajoutés.
      </p>

      <form onSubmit={addTestimonial} className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-ink-100 bg-white p-5 sm:grid-cols-2">
        <input placeholder="Nom du client" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        <input placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="rounded-lg border border-ink-200 px-3 py-2 text-sm">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoiles</option>)}
        </select>
        <div />
        <textarea
          placeholder="Texte de l'avis"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          rows={2}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm sm:col-span-2"
        />
        <button type="submit" className="btn-primary sm:col-span-2">Ajouter le témoignage</button>
      </form>

      {loading ? (
        <p className="mt-6 text-sm text-ink-400">Chargement…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((t) => (
            <div key={t.id} className="flex items-start justify-between rounded-2xl border border-ink-100 bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-ink-800">{t.name} · {t.city} · {t.rating}★</p>
                <p className="mt-1 text-sm text-ink-500">{t.text}</p>
              </div>
              <button onClick={() => remove(t.id)} className="shrink-0 text-xs font-medium text-red-500 hover:underline">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
