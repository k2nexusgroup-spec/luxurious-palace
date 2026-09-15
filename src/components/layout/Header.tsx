"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { useCartCount } from "@/lib/cart-store";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/categorie/bijoux", label: "Bijoux" },
  { href: "/categorie/parfums", label: "Parfums" },
  { href: "/categorie/vetements", label: "Vêtements" },
  { href: "/personnalisation", label: "Personnalisation" },
  { href: "/contact", label: "Contact" }
];

export default function Header({ shopName, whatsappLink }: { shopName: string; whatsappLink: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cartCount = useCartCount();
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/boutique?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="container-lp flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-wide text-ink-900 sm:text-2xl">
          {shopName}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-600 transition-colors hover:text-gold-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center overflow-hidden rounded-full border border-ink-200">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Rechercher un produit…"
                  className="w-44 bg-transparent px-4 py-2 text-sm outline-none md:w-56"
                />
                <button type="submit" className="px-3 text-ink-500 hover:text-gold-600" aria-label="Rechercher">
                  <SearchIcon className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button aria-label="Rechercher" onClick={() => setSearchOpen(true)} className="text-ink-700 hover:text-gold-600">
                <SearchIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <Link href="/panier" aria-label="Panier" className="relative text-ink-700 hover:text-gold-600">
            <CartIcon className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink-900">
                {cartCount}
              </span>
            )}
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp hidden !px-4 !py-2 text-xs sm:inline-flex"
          >
            <WhatsappIcon className="h-4 w-4" />
            Commander
          </a>

          <button
            aria-label="Menu"
            className="text-ink-800 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "overflow-hidden bg-white transition-all duration-300 lg:hidden",
          menuOpen ? "max-h-[28rem] border-t border-ink-100" : "max-h-0"
        )}
      >
        <nav className="container-lp flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-ink-700 hover:bg-gold-50 hover:text-gold-700"
            >
              {link.label}
            </Link>
          ))}
          <form onSubmit={submitSearch} className="mt-2 flex items-center overflow-hidden rounded-full border border-ink-200">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit…"
              className="w-full bg-transparent px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="px-3 text-ink-500" aria-label="Rechercher">
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-3 w-full">
            <WhatsappIcon className="h-4 w-4" />
            Commander sur WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
