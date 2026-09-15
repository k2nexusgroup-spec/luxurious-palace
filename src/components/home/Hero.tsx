import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/types";
import WhatsappIcon from "@/components/ui/WhatsappIcon";

export default function Hero({ banner, whatsappLink }: { banner: Banner; whatsappLink: string }) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <Image
        src="/hero-bg.jpg"
        alt="Boutique Luxurious Palace"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900/90 via-ink-900/75 to-ink-900/90" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(195,154,53,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(195,154,53,0.35), transparent 45%)"
        }}
      />

      <div className="container-lp relative flex min-h-[78vh] flex-col items-start justify-center gap-6 py-24 sm:min-h-[85vh]">
        <span className="reveal section-eyebrow text-gold-400">Luxurious Palace</span>
        <h1 className="reveal max-w-2xl font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
          {banner.title}
        </h1>
        <p className="reveal max-w-xl text-base leading-relaxed text-ink-200 sm:text-lg" style={{ animationDelay: "0.2s" }}>
          {banner.subtitle}
        </p>
        <div className="reveal flex flex-wrap gap-4 pt-2" style={{ animationDelay: "0.3s" }}>
          <Link href={banner.ctaHref} className="btn-primary bg-gold-500 text-ink-900 hover:bg-white">
            {banner.ctaLabel}
          </Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <WhatsappIcon className="h-4 w-4" />
            Commander sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
