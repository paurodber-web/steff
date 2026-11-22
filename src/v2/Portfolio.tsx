import { memo, useRef } from "react";
import { cn } from "./cn";
import { portfolio, services } from "./data";
import { SplitTitle, useSectionAnim, gsap } from "./anim";
import { VideoCard } from "./VideoCard";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]";

export const Portfolio = memo(function Portfolio() {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // giant category words drift sideways while the category scrolls past (decorative only)
      root.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
        const dir = Number(el.dataset.drift);
        gsap.fromTo(
          el,
          { xPercent: 6 * dir },
          { xPercent: -6 * dir, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
      });
    });
    // desktop: the three cards of a category float at slightly different speeds
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      root.querySelectorAll<HTMLElement>("[data-par]").forEach((el) => {
        const speed = Number(el.dataset.par);
        gsap.fromTo(
          el,
          { y: speed },
          { y: -speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
      });
    });
  });

  return (
    <section
      ref={ref}
      id="portafolio"
      data-scene="#f4eee3"
      aria-labelledby="portafolio-title"
      className="scroll-mt-4 overflow-x-clip pb-[clamp(72px,10vw,140px)] pt-[clamp(96px,14vw,200px)]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className="lg:col-span-8">
            <p data-fade className={eyebrow}>
              Portafolio
            </p>
            <h2
              id="portafolio-title"
              className="mt-6 font-display text-[clamp(44px,8.5vw,104px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink lg:text-[clamp(60px,7.4vw,108px)]"
            >
              <SplitTitle parts={[{ t: "Contenido que se siente " }, { t: "real", em: true }, { t: "." }]} />
            </h2>
          </div>
          <div className="mt-6 sm:mt-8 lg:col-span-4 lg:mt-0 lg:pb-3">
            <p data-fade data-delay="0.15" className="max-w-[30rem] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-ink-soft">
              Videos pensados para sentirse como una recomendación, no como un anuncio. Cuatro mundos, un mismo cuidado.
            </p>
            {/* quick jump to each category */}
            <ul data-fade data-delay="0.25" aria-label="Categorías" className="mt-6 flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <span className="font-display text-[13px] normal-case italic tracking-normal opacity-60">{s.n}</span>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(72px,10vw,140px)] space-y-[clamp(96px,13vw,180px)]">
          {services.map((s, idx) => {
            const flip = idx % 2 === 1;
            const items = portfolio[s.id];
            const kinds = [...new Set(items.map((it) => it.format))];
            return (
              <div key={s.id} id={s.id} className="relative isolate scroll-mt-24">
                {/* giant outlined word behind the category */}
                <span
                  aria-hidden
                  data-drift={flip ? -1 : 1}
                  className={cn(
                    "v2-ghost pointer-events-none absolute -top-[0.42em] -z-10 select-none whitespace-nowrap font-display italic leading-none",
                    flip ? "right-0" : "left-0",
                  )}
                >
                  {s.name}
                </span>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
                  <div className={cn("lg:col-span-4", flip && "lg:order-2")}>
                    <div className={cn("lg:sticky lg:top-32", flip && "lg:text-right")}>
                      <div data-fade className={cn("flex items-baseline gap-4", flip && "lg:flex-row-reverse")}>
                        <span className="font-display text-[clamp(22px,2.4vw,28px)] italic leading-none text-ink-soft">{s.n}</span>
                        <span className="h-px w-10 translate-y-[-0.3em] bg-ink/25" aria-hidden />
                      </div>
                      <h3 data-fade className="mt-4 font-display text-[clamp(48px,6.4vw,88px)] font-normal leading-[0.95] tracking-[-0.02em] text-ink">
                        {s.name}
                      </h3>
                      <p data-fade data-delay="0.08" className="mt-4 text-[16px] leading-relaxed text-ink-soft">
                        {s.desc}
                      </p>
                      <ul data-fade data-delay="0.14" className={cn("mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink", flip && "lg:justify-end")}>
                        {kinds.map((k) => (
                          <li key={k} className="flex items-center gap-2">
                            <span aria-hidden className="h-1 w-1 rounded-full bg-ink/40" />
                            {k}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* <768: snap carousel (page never scrolls sideways). >=768: three columns, editorial offsets */}
                  <ul
                    className={cn(
                      "no-scrollbar -mx-5 -mb-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-14 pt-2 sm:-mx-8 sm:scroll-px-8 sm:px-8",
                      "md:mx-0 md:mb-0 md:mt-12 md:grid md:grid-cols-3 md:items-start md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:pt-0",
                      "lg:col-span-8 lg:mt-0 lg:gap-6",
                      flip && "lg:order-1",
                    )}
                  >
                    {items.map((item, i) => (
                      <li
                        key={item.brand}
                        data-par={[30, -30, 50][i]}
                        className={cn(
                          "w-[72vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none",
                          // vary the rhythm per category so the four blocks never look identical
                          flip ? (i === 0 ? "md:mt-20" : i === 2 ? "md:mt-10" : "") : i === 1 ? "md:mt-20" : i === 2 ? "md:mt-8" : "",
                        )}
                      >
                        <VideoCard item={item} category={s.name} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
