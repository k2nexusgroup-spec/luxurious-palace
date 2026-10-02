"use client";

import { useEffect, useState } from "react";
import type { CategoryInfo } from "@/lib/types";
import { isImageUrl } from "@/lib/slug";

interface FormState {
  slug: string;
  name: string;
  description: string;
  image: string;
  subCategories: string; // un nom par ligne ou separes par une virgule
}

const emptyForm: FormState = { slug: "", name: "", description: "", image: "", subCategories: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const list: CategoryInfo[] = await res.json();
    setCategories(list.map((c) => ({ ...c, subCategories: c.subCategories ?? [] })));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  }

  function openEdit(c: CategoryInfo) {
    setForm({
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      subCategories: c.subCategories.map((s) => s.name).join(", ")
    });
    setError("");
    setFormOpen(true);
  }

  async function handleImage(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Échec de l'envoi de l'image.");
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const existing = categories.find((c) => c.slug === form.slug);
    const names = form.subCategories
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    // Les sous-categories deja existantes gardent leur identifiant (les produits y restent rattaches).
    const subCategories = names.map((name) => {
      const match = existing?.subCategories.find((s) => s.name.toLowerCase() === name.toLowerCase());
      return match ? match : { slug: "", name };
    });

    const payload = { name: form.name, description: form.description, image: form.image, subCategories };

    const res = form.slug
      ? await fetch(`/api/admin/categories/${form.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      : await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Échec de l'enregistrement.");
      return;
    }
    setFormOpen(false);
    load();
  }

  async function handleDelete(c: CategoryInfo) {
    if (!confirm(`Supprimer la catégorie « ${c.name} » ?`)) return;
    const res = await fetch(`/api/admin/categories/${c.slug}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Suppression impossible.");
      return;
    }
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Catégories</h1>
          <p className="mt-1 text-sm text-ink-500">
            Ces catégories apparaissent dans le menu, sur l'accueil et dans les filtres de la boutique.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Ajouter une catégorie
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-ink-400">Chargement…</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => (
            <div key={c.slug} className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
              <div className="flex h-36 items-center justify-center bg-ink-50">
                {isImageUrl(c.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-ink-300">Aucune image</span>
                )}
              </div>
              <div className="p-4">
                <p className="font-serif text-lg font-semibold text-ink-900">{c.name}</p>
                {c.description && <p className="mt-1 line-clamp-2 text-xs text-ink-500">{c.description}</p>}
                <p className="mt-2 text-xs text-ink-400">
                  {c.subCategories.length > 0
                    ? c.subCategories.map((s) => s.name).join(" · ")
                    : "Aucune sous-catégorie"}
                </p>
                <div className="mt-3 flex gap-4">
                  <button onClick={() => openEdit(c)} className="text-xs font-medium text-gold-600 hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(c)} className="text-xs font-medium text-red-500 hover:underline">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-400 sm:col-span-2 xl:col-span-3">
              Aucune catégorie. Ajoute-en une pour commencer.
            </p>
          )}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-ink-900">
                {form.slug ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="text-ink-400">✕</button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Nom de la catégorie</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex : Montres"
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Description (affichée sur l'accueil)</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Sous-catégories (séparées par une virgule)</label>
              <input
                value={form.subCategories}
                onChange={(e) => setForm({ ...form, subCategories: e.target.value })}
                placeholder="Ex : Montres homme, Montres femme"
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Image de la catégorie</label>
              <div className="flex items-center gap-3">
                <div className="flex h-20 w-28 items-center justify-center overflow-hidden rounded-lg border border-ink-200 bg-ink-50">
                  {isImageUrl(form.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-ink-300">Aucune</span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="inline-block cursor-pointer rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium text-ink-700 hover:border-gold-500">
                    {uploading ? "Envoi…" : form.image ? "Changer l'image" : "Choisir une image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        handleImage(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="block text-xs text-red-500 hover:underline"
                    >
                      Retirer l'image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-outline">Annuler</button>
              <button type="submit" disabled={saving || uploading} className="btn-primary">
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
