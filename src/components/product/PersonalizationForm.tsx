"use client";

import { useState } from "react";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

const ARTICLE_TYPES = ["Débardeur", "T-shirt", "Polo", "Boxer"];

export default function PersonalizationForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [article, setArticle] = useState(ARTICLE_TYPES[0]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = [
      "Bonjour, je souhaite personnaliser un article :",
      `Nom : ${name || "-"}`,
      `Article : ${article}`,
      size ? `Taille : ${size}` : null,
      color ? `Couleur : ${color}` : null,
      `Détails de la personnalisation : ${details || "-"}`,
      "",
      "Merci de m'indiquer le prix, les délais et les modalités de livraison."
    ]
      .filter(Boolean)
      .join("\n");
    window.open(buildWhatsappUrl(whatsappNumber, message), "_blank");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
      <h2 className="font-serif text-xl font-semibold text-ink-900">Demander ma personnalisation</h2>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-500">Nom</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-gold-500"
          placeholder="Votre nom"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Type d'article</label>
          <select value={article} onChange={(e) => setArticle(e.target.value)} className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm">
            {ARTICLE_TYPES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Taille souhaitée</label>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="S, M, L, XL…"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-gold-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-500">Couleur souhaitée</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-gold-500"
          placeholder="Ex : Noir, Blanc…"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-500">
          Décrivez votre personnalisation <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder="Texte, initiales, logo, visuel, emplacement souhaité…"
          className="w-full rounded-lg border border-ink-200 p-3 text-sm outline-none focus:border-gold-500"
        />
      </div>

      <button type="submit" className="btn-whatsapp w-full">
        <WhatsappIcon className="h-4 w-4" />
        Envoyer ma demande sur WhatsApp
      </button>
    </form>
  );
}
