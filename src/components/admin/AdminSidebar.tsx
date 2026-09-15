"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/produits", label: "Produits", icon: "🛍️" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/clients", label: "Clients", icon: "👥" },
  { href: "/admin/promotions", label: "Promotions", icon: "🏷️" },
  { href: "/admin/temoignages", label: "Témoignages", icon: "💬" },
  { href: "/admin/bannieres", label: "Bannières", icon: "🖼️" },
  { href: "/admin/parametres", label: "Paramètres", icon: "⚙️" }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-ink-800 bg-ink-900 text-ink-200 lg:h-screen lg:w-64 lg:sticky lg:top-0">
      <div className="border-b border-white/10 p-6">
        <p className="font-serif text-lg font-bold text-white">Luxurious Palace</p>
        <p className="text-xs text-ink-400">Espace administrateur</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === link.href ? "bg-gold-500 text-ink-900" : "text-ink-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="mb-2 block text-center text-xs text-ink-400 hover:text-gold-400">
          Voir le site →
        </Link>
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-ink-200 hover:bg-white/5"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
