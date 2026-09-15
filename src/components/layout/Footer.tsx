import Link from "next/link";
import type { StoreSettings } from "@/lib/types";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

export default function Footer({ settings }: { settings: StoreSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="container-lp grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl font-bold text-white">{settings.shopName}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            Bijoux, parfums et vêtements personnalisés pour révéler votre style au quotidien, livrés partout en Côte d'Ivoire.
          </p>
          <div className="mt-4 flex gap-3">
            <SocialIcon href={settings.socialLinks.instagram} label="Instagram">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.75-.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
            </SocialIcon>
            <SocialIcon href={settings.socialLinks.facebook} label="Facebook">
              <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
            </SocialIcon>
            <SocialIcon href={settings.socialLinks.tiktok} label="TikTok">
              <path d="M14 3h3c.1 2 1.6 3.5 3.7 3.7v3c-1.4 0-2.7-.4-3.7-1.2v6.8a5.7 5.7 0 1 1-5.7-5.7c.2 0 .4 0 .7.1v3.1a2.6 2.6 0 1 0 2 2.5V3Z" />
            </SocialIcon>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Liens rapides</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-gold-300">Accueil</Link></li>
            <li><Link href="/boutique" className="hover:text-gold-300">Boutique</Link></li>
            <li><Link href="/personnalisation" className="hover:text-gold-300">Personnalisation</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300">Contact</Link></li>
            <li><Link href="/livraison" className="hover:text-gold-300">Livraison</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Catégories</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/categorie/bijoux" className="hover:text-gold-300">Bijoux</Link></li>
            <li><Link href="/categorie/parfums" className="hover:text-gold-300">Parfums</Link></li>
            <li><Link href="/categorie/vetements" className="hover:text-gold-300">Vêtements</Link></li>
          </ul>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-gold-400">Informations</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/mentions-legales" className="hover:text-gold-300">Conditions générales</Link></li>
            <li><Link href="/confidentialite" className="hover:text-gold-300">Politique de confidentialité</Link></li>
            <li><Link href="/livraison" className="hover:text-gold-300">Livraison &amp; retours</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300">
                <WhatsappIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp : {settings.whatsappNumber}
              </a>
            </li>
            <li>
              <a href={`tel:${settings.phoneNumber}`} className="hover:text-gold-300">Téléphone : {settings.phoneNumber}</a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-gold-300">{settings.email}</a>
            </li>
            <li className="text-ink-400">{settings.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-lp text-center text-xs text-ink-400">
          © {year} {settings.shopName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-ink-200 transition-colors hover:border-gold-400 hover:text-gold-400"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        {children}
      </svg>
    </a>
  );
}
