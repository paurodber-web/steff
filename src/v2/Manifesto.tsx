import { memo, useRef, type CSSProperties } from "react";
import { services } from "./data";
import type { HeroImage } from "./Hero";
import { useSectionAnim, gsap } from "./anim";

type Token = { w: string; em?: boolean } | { pill: { bg: string; pos: string; scale: number; origin: string; filter?: string } };

// "Convierto productos en historias que la gente guarda, comparte y compra."
const tokens: Token[] = [
  { w: "Convierto" },
  { w: "productos" },
  { pill: { bg: "#e7cbbd", pos: "50% 0%", scale: 2.1, origin: "50% 24%" } },
  { w: "en" },
  { w: "historias", em: true },
  { w: "que" },
  { w: "la" },
  { w: "gente" },
  { pill: { bg: "#5c1a1f", pos: "50% 0%", scale: 1.25, origin: "50% 45%", filter: "grayscale(1) contrast(1.1) brightness(1.2)" } },
  { w: "guarda," },
  { w: "comparte" },
  { w: "y" },
  { pill: { bg: "#d8c2a3", pos: "50% 0%", scale: 1.7, origin: "62% 72%" } },
  { w: "compra.", em: true },
];

export const Manifesto = memo(function Manifesto({ portrait }: { portrait: HeroImage }) {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const text = root.querySelector("[data-manifesto]");
      if (!text) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: text, start: "top 78%", once: true } });
      tl.from(text.querySelectorAll("[data-mw]"), {
        yPercent: -110,
        rotate: -4,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.045,
      });
      tl.fromTo(
        text.querySelectorAll("[data-pill]"),
        { clipPath: "inset(0% 50% 0% 50% round 999px)" },
        { clipPath: "inset(0% 0% 0% 0% round 999px)", duration: 1.4, ease: "expo.inOut", stagger: 0.12 },
        0.35,
      );
      tl.from(text.querySelectorAll("[data-pill] img"), { scale: "+=0.6", duration: 1.8, ease: "expo.out", stagger: 0.12 }, 0.45);
      // pills keep breathing with the scroll
      text.querySelectorAll<HTMLElement>("[data-pill] img").forEach((img, i) => {
        gsap.to(img, { yPercent: i % 2 ? 10 : -10, ease: "none", scrollTrigger: { trigger: text, start: "top bottom", end: "bottom top", scrub: 0.8 } });
      });
    });
  });

  return (
    <section ref={ref} id="manifiesto" data-folio="Nº 01 — Manifiesto" data-scene="#f4eee3" aria-labelledby="manifiesto-title" className="overflow-x-clip pt-[clamp(120px,16vw,240px)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <h2 id="manifiesto-title" className="sr-only">
          Convierto productos en historias que la gente guarda, comparte y compra.
        </h2>
        <p
          data-manifesto
          aria-hidden
          className="font-display text-[clamp(44px,7.6vw,132px)] font-normal leading-[1.02] tracking-[-0.035em] text-ink"
        >
          {tokens.map((t, i) =>
            "w" in t ? (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <span data-mw className={t.em ? "inline-block italic text-oxblood" : "inline-block"}>
                  {t.w}
                </span>
                {" "}
              </span>
            ) : (
              <span key={i} className="inline-block align-[-0.04em]">
                <span
                  data-pill
                  className="relative mx-[0.06em] inline-block h-[0.74em] w-[1.7em] overflow-hidden rounded-full sm:w-[1.9em]"
                  style={{ background: t.pill.bg }}
                >
                  <img
                    src={portrait.src}
                    srcSet={portrait.srcSet}
                    sizes="240px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
                    style={{ objectPosition: t.pill.pos, transform: `scale(${t.pill.scale})`, transformOrigin: t.pill.origin, filter: t.pill.filter } as CSSProperties}
                  />
                </span>
                {" "}
              </span>
            ),
          )}
        </p>

        <div className="mt-[clamp(56px,8vw,120px)] grid gap-10 border-t border-ink/15 pt-8 lg:grid-cols-12 lg:gap-x-8">
          <p data-fade className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft lg:col-span-3">
            Nº 01 — Manifiesto
          </p>
          <p data-fade data-delay="0.1" className="max-w-[34rem] text-[clamp(17px,1.6vw,21px)] leading-relaxed text-ink lg:col-span-5">
            Soy Steff Ramírez, creadora UGC. Grabo con el tono de una amiga que te recomienda algo, porque eso es lo que la gente cree y lo que la gente compra.
          </p>
          <ol data-fade data-delay="0.2" className="grid grid-cols-2 gap-x-6 gap-y-3 lg:col-span-4 lg:pl-8">
            {services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  data-cursor="Ver"
                  className="group flex items-baseline gap-3 rounded-sm py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  <span className="font-display text-[14px] italic text-ink-soft">{s.n}</span>
                  <span className="v2-underline text-[12px] font-semibold uppercase tracking-[0.22em] text-ink">{s.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
});
