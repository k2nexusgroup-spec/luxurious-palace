"use client";

import { useEffect, useState } from "react";
import type { StoreSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function save() {
    if (!settings) return;
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateZone(id: string, patch: Partial<StoreSettings["deliveryZones"][number]>) {
    setSettings((s) => s && { ...s, deliveryZones: s.deliveryZones.map((z) => (z.id === id ? { ...z, ...patch } : z)) });
  }

  function togglePayment(name: string) {
    setSettings((s) => s && {
      ...s,
      paymentMethods: s.paymentMethods.map((p) => (p.name === name ? { ...p, enabled: !p.enabled } : p))
    });
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
        <LabeledInput label="Instagram" value={settings.socialLinks.instagram} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: v } })} />
        <LabeledInput label="Facebook" value={settings.socialLinks.facebook} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: v } })} />
        <LabeledInput label="TikTok" value={settings.socialLinks.tiktok} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, tiktok: v } })} />
      </section>

      <section className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-900">Zones de livraison</h2>
        {settings.deliveryZones.map((zone) => (
          <div key={zone.id} className="grid grid-cols-1 gap-3 border-t border-ink-50 pt-4 first:border-0 first:pt-0 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Zone</label>
              <p className="rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-700">{zone.name}</p>
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
          </div>
        ))}
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-900">Moyens de paiement</h2>
        <p className="text-xs text-ink-400">
          Activez un moyen de paiement uniquement lorsque son intégration technique (API Orange Money, MTN Money,
          Moov Money ou Wave) est réellement configurée. Aucun paiement n'est traité tant que ce n'est pas le cas.
        </p>
        {settings.paymentMethods.map((pm) => (
          <label key={pm.name} className="flex items-center justify-between border-t border-ink-50 py-2 text-sm text-ink-700 first:border-0">
            {pm.name}
            <input type="checkbox" checked={pm.enabled} onChange={() => togglePayment(pm.name)} className="accent-gold-500" />
          </label>
        ))}
      </section>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} className="btn-primary">Enregistrer les modifications</button>
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
