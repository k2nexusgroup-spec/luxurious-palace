"use client";

import { useEffect, useState } from "react";
import type { Badge, CategorySlug, Gender, Product, SubCategorySlug } from "@/lib/types";
import { formatFcfa } from "@/lib/whatsapp";

const SUBCATEGORIES: Record<CategorySlug, SubCategorySlug[]> = {
  bijoux: ["chaines", "bracelets", "boucles-oreilles"],
  parfums: ["parfum-homme", "parfum-femme"],
  vetements: ["debardeurs", "tshirts", "polos", "boxers"]
};

const BADGES: Badge[] = ["nouveau", "populaire", "promo"];

const emptyForm = {
  id: "",
  name: "",
  category: "bijoux" as CategorySlug,
  subCategory: "chaines" as SubCategorySlug,
  gender: "mixte" as Gender,
  price: "",
  oldPrice: "",
  stock: "",
  sizes: "",
  colors: "",
  customizable: false,
  customizationNote: "",
  description: "",
  shortDescription: "",
  badges: [] as Badge[]
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      gender: p.gender,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      stock: String(p.stock),
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      customizable: p.customizable,
      customizationNote: p.customizationNote ?? "",
      description: p.description,
      shortDescription: p.shortDescription,
      badges: p.badges
    });
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  function toggleBadge(b: Badge) {
    setForm((f) => ({
      ...f,
      badges: f.badges.includes(b) ? f.badges.filter((x) => x !== b) : [...f.badges, b]
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      subCategory: form.subCategory,
      gender: form.gender,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      customizable: form.customizable,
      customizationNote: form.customizationNote,
      description: form.description,
      shortDescription: form.shortDescription,
      badges: form.badges
    };

    if (form.id) {
      await fetch(`/api/admin/products/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    setSaving(false);
    setFormOpen(false);
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Produits</h1>
          <p className="mt-1 text-sm text-ink-500">{products.length} produit(s) dans le catalogue.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Ajouter un produit
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Personnalisable</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-ink-400" colSpan={6}>Chargement…</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink-800">{p.name}</td>
                  <td className="px-4 py-3 capitalize text-ink-500">{p.category} / {p.subCategory}</td>
                  <td className="px-4 py-3 text-ink-700">{formatFcfa(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 5 ? "font-semibold text-red-500" : "text-ink-600"}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">{p.customizable ? "Oui" : "Non"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-3 text-xs font-medium text-gold-600 hover:underline">
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs font-medium text-red-500 hover:underline">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-ink-900">
                {form.id ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="text-ink-400">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nom du produit">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </Field>

              <Field label="Catégorie">
                <select
                  value={form.category}
                  onChange={(e) => {
                    const category = e.target.value as CategorySlug;
                    setForm({ ...form, category, subCategory: SUBCATEGORIES[category][0] });
                  }}
                  className="input"
                >
                  <option value="bijoux">Bijoux</option>
                  <option value="parfums">Parfums</option>
                  <option value="vetements">Vêtements</option>
                </select>
              </Field>

              <Field label="Sous-catégorie">
                <select value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value as SubCategorySlug })} className="input">
                  {SUBCATEGORIES[form.category].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Genre">
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })} className="input">
                  <option value="mixte">Mixte</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </Field>

              <Field label="Prix (FCFA)">
                <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
              </Field>
              <Field label="Ancien prix (promo, optionnel)">
                <input type="number" min={0} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className="input" />
              </Field>

              <Field label="Stock">
                <input required type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" />
              </Field>

              <Field label="Tailles (séparées par une virgule)">
                <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" className="input" />
              </Field>

              <Field label="Couleurs (séparées par une virgule)">
                <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Noir, Blanc" className="input" />
              </Field>

              <Field label="Badges">
                <div className="flex flex-wrap gap-3 pt-2">
                  {BADGES.map((b) => (
                    <label key={b} className="flex items-center gap-1.5 text-xs capitalize text-ink-600">
                      <input type="checkbox" checked={form.badges.includes(b)} onChange={() => toggleBadge(b)} className="accent-gold-500" />
                      {b}
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Description courte" className="mt-4">
              <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input" />
            </Field>

            <Field label="Description complète" className="mt-4">
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
            </Field>

            <label className="mt-4 flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={form.customizable} onChange={(e) => setForm({ ...form, customizable: e.target.checked })} className="accent-gold-500" />
              Article personnalisable
            </label>

            {form.customizable && (
              <Field label="Note de personnalisation (indications pour le client)" className="mt-3">
                <input value={form.customizationNote} onChange={(e) => setForm({ ...form, customizationNote: e.target.value })} className="input" />
              </Field>
            )}

            <p className="mt-4 text-xs text-ink-400">
              Aucune photo n'est encore configurée pour ce produit : un visuel de démonstration s'affiche à sa place.
              L'ajout de vraies photos (upload ou lien) pourra être branché ultérieurement.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-outline">Annuler</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e2e3e5;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-ink-500">{label}</label>
      {children}
    </div>
  );
}
