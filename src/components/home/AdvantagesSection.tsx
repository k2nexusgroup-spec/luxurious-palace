const ADVANTAGES = [
  { icon: "✨", title: "Produits tendance", text: "Une sélection actualisée de bijoux, parfums et vêtements." },
  { icon: "🎨", title: "Personnalisation", text: "Des vêtements uniques adaptés à vos envies." },
  { icon: "📱", title: "Commande facile", text: "Commandez en quelques clics directement sur WhatsApp." },
  { icon: "🚚", title: "Livraison", text: "Livraison à Abidjan et dans les autres villes de Côte d'Ivoire." },
  { icon: "🔒", title: "Commande sécurisée", text: "Un accompagnement personnalisé à chaque étape de votre achat." }
];

export default function AdvantagesSection() {
  return (
    <section className="border-y border-ink-100 bg-white py-16">
      <div className="container-lp grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {ADVANTAGES.map((a, i) => (
          <div key={a.title} className="reveal text-center" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-2xl">
              {a.icon}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-ink-900">{a.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-400">{a.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
