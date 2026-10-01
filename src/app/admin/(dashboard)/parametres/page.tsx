"use client";

import { useEffect, useState } from "react";
import type { StoreSettings } from "@/lib/types";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateZone(id: string, patch: Partial<StoreSettings["deliveryZones"][number]>) {
    setSettings((s) => s && { ...s, deliveryZones: s.deliveryZones.map((z) => (z.id === id ? { ...z, ...patch } : z)) });
  }

  function addZone() {
    setSettings((s) => s && {
      ...s,
      deliveryZones: [...s.deliveryZones, { id: makeId("zone"), name: "Nouvelle zone", fee: null, delay: "À configurer" }]
    });
  }

  function removeZone(id: string) {
    setSettings((s) => s && { ...s, deliveryZones: s.deliveryZones.filter((z) => z.id !== id) });
  }

  function updatePayment(id: string, patch: Partial<StoreSettings["paymentMethods"][number]>) {
    setSettings((s) => s && { ...s, paymentMethods: s.paymentMethods.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }

  function addPayment() {
    setSettings((s) => s && {
      ...s,
      paymentMethods: [...s.paymentMethods, { id: makeId("paiement"), name: "Nouveau moyen de paiement", enabled: false, detail: "" }]
    });
  }

  function removePayment(id: string) {
    setSettings((s) => s && { ...s, paymentMethods: s.paymentMethods.filter((p) => p.id !== id) });
  }

  if (!settings) return <p className="text-sm text-ink-400">Chargement…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-ink-900">Paramètres de la boutique</h1>

      <section className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-900">Informations générales</h2>
        <LabeledInput label="Nom de la boutique" value={settings.shopName} onChange={(v) => setSettings({ ...settings, shopName: v })} />
        <LabeledInput label="Slogan" value={settings.tagline} onChange={(v) => setSettings({ ...settings, tagline: v })} />
        <LabeledInput label="Numéro WhatsApp" value={settings.whatsappNumber} onChange={(v) => setSettings({ ...settings, whatsappNumber: v })} />
        <LabeledInput label="Téléphone" value={settings.phoneNumber} onChange={(v) => setSettings({ ...settings, phoneNumber: v })} />
        <LabeledInput label="Lien WhatsApp" value={settings.whatsappLink} onChange={(v) => setSettings({ ...settings, whatsappLink: v })} />
        <LabeledInput label="Email" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
        <LabeledInput label="Adresse" value={settings.address} onChange={(v) => setSettings({ ...settings, address: v })} />
      </section>

      <section className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-900">Réseaux sociaux</h2>
        <p className="text-xs text-ink-400">Colle le lien complet de chaque page (ex: https://instagram.com/tonpseudo).</p>
        <LabeledInput label="Instagram" value={settings.socialLinks.instagram} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: v } })} />
        <LabeledInput label="Facebook" value={settings.socialLinks.facebook} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: v } })} />
        <LabeledInput label="TikTok" value={settings.socialLinks.tiktok} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, tiktok: v } })} />
      </section>

      <section className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Zones de livraison</h2>
          <button type="button" onClick={addZone} className="text-xs font-medium text-gold-600 hover:underline">
            + Ajouter une zone
          </button>
        </div>
        <p className="text-xs text-ink-400">
          Laisse les frais vides pour afficher "À confirmer avec vous" sur le site tant que tu n'as pas fixé un tarif.
        </p>
        {settings.deliveryZones.map((zone) => (
          <div key={zone.id} className="grid grid-cols-1 gap-3 border-t border-ink-50 pt-4 first:border-0 first:pt-0 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Nom de la zone</label>
              <input
                value={zone.name}
                onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Frais (FCFA)</label>
              <input
                type="number"
                min={0}
                value={zone.fee ?? ""}
                placeholder="À configurer"
                onChange={(e) => updateZone(zone.id, { fee: e.target.value ? Number(e.target.value) : null })}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Délai</label>
              <input
                value={zone.delay}
                onChange={(e) => updateZone(zone.id, { delay: e.target.value })}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeZone(zone.id)}
                className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 sm:w-auto"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {settings.deliveryZones.length === 0 && (
          <p className="text-sm text-ink-400">Aucune zone configurée.</p>
        )}
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Moyens de paiement</h2>
          <button type="button" onClick={addPayment} className="text-xs font-medium text-gold-600 hover:underline">
            + Ajouter un moyen
          </button>
        </div>
        <p className="text-xs text-ink-400">
          Active un moyen de paiement et indique le numéro / l'identifiant à utiliser (ex: numéro Orange Money).
          Cette information s'affiche aux clients sur la page Livraison. Aucun paiement en ligne automatique n'est
          traité : le client t'envoie la preuve de paiement sur WhatsApp.
        </p>
        {settings.paymentMethods.map((pm) => (
          <div key={pm.id} className="space-y-2 border-t border-ink-50 pt-4 first:border-0 first:pt-0">
            <div className="flex items-center justify-between gap-3">
              <input
                value={pm.name}
                onChange={(e) => updatePayment(pm.id, { name: e.target.value })}
                className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium"
              />
              <label className="flex shrink-0 items-center gap-2 text-xs text-ink-600">
                Actif
                <input type="checkbox" checked={pm.enabled} onChange={(e) => updatePayment(pm.id, { enabled: e.target.checked })} className="accent-gold-500" />
              </label>
              <button
                type="button"
                onClick={() => removePayment(pm.id)}
                className="shrink-0 text-xs font-medium text-red-500 hover:underline"
              >
                Supprimer
              </button>
            </div>
            <input
              value={pm.detail}
              onChange={(e) => updatePayment(pm.id, { detail: e.target.value })}
              placeholder="Numéro ou identifiant à communiquer (ex: 07 00 00 00 00)"
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
        ))}
        {settings.paymentMethods.length === 0 && (
          <p className="text-sm text-ink-400">Aucun moyen de paiement configuré.</p>
        )}
      </section>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
        {saved && <span className="text-sm text-green-600">Enregistré ✓</span>}
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-500">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm" />
    </div>
  );
}
