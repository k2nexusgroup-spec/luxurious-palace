import type { Testimonial } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-ink-900 py-20 sm:py-28">
      <div className="container-lp">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow text-gold-400">Avis clients</span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Ce que nos clients disent</h2>
          <p className="mt-3 text-sm text-ink-300">
            Exemples d'avis à titre de démonstration — en attente des premiers retours clients réels.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="reveal rounded-2xl border border-white/10 bg-white/5 p-6"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <StarRating rating={t.rating} />
              <p className="mt-4 text-sm leading-relaxed text-ink-100">“{t.text}”</p>
              <p className="mt-4 text-sm font-semibold text-gold-300">
                {t.name} <span className="font-normal text-ink-400">· {t.city}</span>
              </p>
              <span className="mt-1 block text-[10px] uppercase tracking-widest text-ink-500">Avis de démonstration</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
