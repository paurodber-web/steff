import { memo, useRef } from "react";
import { brands, portfolio, services } from "./data";
import { ArrowRight } from "./Icons";
import { SplitTitle, useSectionAnim, gsap } from "./anim";
import { VideoCard } from "./VideoCard";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]";

function BrandStrip() {
  const row = (hidden?: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {brands.map((b) => (
        <li key={b} className="flex items-center">
          <span className="font-display text-[clamp(28px,4.4vw,52px)] leading-none tracking-[-0.01em] text-ink">{b}</span>
          <span aria-hidden className="mx-[clamp(24px,4vw,56px)] text-[clamp(12px,1.2vw,16px)] text-ink-soft">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mt-[clamp(80px,11vw,160px)]">
      <p data-fade className={`${eyebrow} px-5 text-center sm:px-8`}>
        Marcas con las que he trabajado
      </p>
      <div data-fade data-delay="0.1" className="marquee mt-8 sm:mt-10">
        <div className="marquee__track">
          {row()}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

export const Portfolio = memo(function Portfolio({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    // desktop: soft parallax between the three columns
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      root.querySelectorAll<HTMLElement>("[data-par]").forEach((el) => {
        const speed = Number(el.dataset.par);
        gsap.fromTo(
          el,
          { yPercent: speed },
          { yPercent: -speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
      });
    });
  });

  return (
    <section ref={ref} id="portafolio" aria-labelledby="portafolio-title" className="scroll-mt-4 overflow-x-clip pb-[clamp(72px,10vw,140px)] pt-[clamp(96px,14vw,200px)]">
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
          <p data-fade data-delay="0.15" className="mt-6 max-w-[30rem] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-ink-soft sm:mt-8 lg:col-span-4 lg:mt-0 lg:pb-3">
            Videos pensados para sentirse como una recomendación, no como un anuncio. Cuatro mundos, un mismo cuidado.
          </p>
        </div>

        <div className="mt-[clamp(48px,7vw,96px)] space-y-[clamp(64px,9vw,128px)]">
          {services.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-4">
              <div data-fade className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-t border-ink/15 pt-6 sm:pt-8">
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="font-display text-[clamp(40px,6vw,72px)] italic leading-none text-ink-soft">{s.n}</span>
                  <h3 className="text-[13px] font-semibold uppercase leading-none tracking-[0.24em] text-ink">{s.name}</h3>
                </div>
                <p className="text-[15px] leading-snug text-ink-soft">{s.desc}</p>
              </div>

              {/* <768: horizontal snap carousel (page never scrolls sideways). >=768: three columns */}
              <ul className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-14 pt-2 -mb-6 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-auto md:mt-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:pt-0 md:mb-0 lg:gap-10">
                {portfolio[s.id].map((item, i) => (
                  <li
                    key={item.brand}
                    data-par={i === 1 ? -4 : 4}
                    className={`w-[72vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none ${i === 1 ? "md:mt-14 lg:mt-20" : ""}`}
                  >
                    <VideoCard item={item} category={s.name} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <BrandStrip />

      <div className="px-5 pt-[clamp(40px,6vw,72px)] text-center sm:px-8">
        <button
          type="button"
          onClick={onContact}
          data-fade
          className="group inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-sm text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <span className="underline decoration-ink/30 underline-offset-[6px] transition-colors group-hover:decoration-ink">¿Te encaja? Escríbeme</span>
          <ArrowRight className="h-[18px] w-[18px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5" />
        </button>
      </div>
    </section>
  );
});
