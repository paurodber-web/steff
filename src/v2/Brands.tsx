import { memo, useRef } from "react";
import { brands, formats } from "./data";
import { CtaButton } from "./CtaButton";
import { useSectionAnim, gsap } from "./anim";

function Row({ items, hidden, big }: { items: readonly string[]; hidden?: boolean; big?: boolean }) {
  return (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((b) => (
        <li key={b} className="flex items-center">
          {big ? (
            <span className="font-display text-[clamp(34px,5.6vw,76px)] leading-none tracking-[-0.01em] text-cream">{b}</span>
          ) : (
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-cream/55 sm:text-[12px]">{b}</span>
          )}
          <span aria-hidden className={big ? "mx-[clamp(22px,3.6vw,52px)] text-[clamp(12px,1.2vw,16px)] text-sand" : "mx-6 text-[8px] text-sand/70"}>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Dark band between the portfolio and the process: social proof + a quiet way to get in touch. */
export const Brands = memo(function Brands({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const card = root.querySelector("[data-band]");
      if (!card) return;
      // the band opens from the centre line, like a curtain
      gsap.fromTo(
        card,
        { clipPath: "inset(12% 4% 12% 4% round 52px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 45%", scrub: 0.6 } },
      );
    });
  });

  return (
    <section ref={ref} aria-labelledby="marcas-title" className="overflow-x-clip">
      <div className="v2-frame">
        <div data-band className="v2-radius grain relative isolate overflow-hidden bg-ink py-[clamp(64px,9vw,128px)] text-cream">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.1]" style={{ background: "radial-gradient(closest-side, #f4eee3, rgba(244,238,227,0))" }} />

          <h2 id="marcas-title" data-fade className="relative px-5 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-cream/60 sm:tracking-[0.28em]">
            Marcas con las que he trabajado
          </h2>
          <p className="sr-only">{brands.join(", ")}</p>

          <div className="relative mt-10 space-y-6 sm:mt-14 sm:space-y-8">
            <div className="marquee">
              <div className="marquee__track">
                <Row items={brands} big hidden />
                <Row items={brands} big hidden />
              </div>
            </div>
            <div className="marquee marquee--rev">
              <div className="marquee__track marquee__track--fast">
                <Row items={formats} hidden />
                <Row items={formats} hidden />
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-[clamp(48px,7vw,96px)] flex max-w-[1200px] flex-col items-center gap-6 px-5 text-center sm:flex-row sm:justify-center sm:gap-10 sm:text-left">
            <p data-fade className="font-display text-[clamp(26px,3.2vw,40px)] leading-tight">
              ¿Te encaja lo que <em className="italic">ves</em>?
            </p>
            <div data-fade data-delay="0.1">
              <CtaButton onClick={onContact} className="bg-cream text-ink [&>span:first-child]:bg-sand [&>span:last-child]:bg-ink [&>span:last-child]:text-cream">
                Escríbeme
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
