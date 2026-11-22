import { memo, useRef } from "react";
import { brands } from "./data";
import { useSectionAnim, gsap, ScrollTrigger } from "./anim";
import { Magnetic } from "./Magnetic";
import { ArrowUpRight } from "./Icons";

function Line({ italic, dir }: { italic?: boolean; dir: 1 | -1 }) {
  const list = [...brands, ...brands, ...brands];
  return (
    <div className="overflow-hidden">
      <div data-row={dir} className="flex w-max items-center whitespace-nowrap will-change-transform">
        {list.map((b, i) => (
          <span key={i} className="flex items-center">
            <span className={`font-display text-[clamp(48px,8.4vw,150px)] leading-[1.05] tracking-[-0.03em] ${italic ? "italic text-cream/55" : "text-cream"}`}>{b}</span>
            <svg aria-hidden viewBox="0 0 20 20" className="mx-[clamp(20px,3vw,52px)] h-[clamp(12px,1.4vw,22px)] w-[clamp(12px,1.4vw,22px)] text-[#d8a59a]">
              <path d="M10 0c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10C5.2 9.4 9.4 5.2 10 0Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Rolling credits: brand names travel with the scroll and lean into its speed. */
export const Credits = memo(function Credits({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = root.querySelectorAll<HTMLElement>("[data-row]");
      rows.forEach((row) => {
        const dir = Number(row.dataset.row);
        gsap.fromTo(
          row,
          { xPercent: dir === 1 ? 0 : -33.333 },
          { xPercent: dir === 1 ? -33.333 : 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.4 } },
        );
      });
      const skews = Array.from(rows).map((r) => gsap.quickTo(r, "skewX", { duration: 0.5, ease: "power3.out" }));
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-10, 10, self.getVelocity() / -220);
          skews.forEach((s) => s(v));
        },
      });
      return () => st.kill();
    });
  });

  return (
    <section
      ref={ref}
      id="marcas"
      data-folio="Nº 03 — Créditos"
      data-scene="#5c1a1f"
      aria-labelledby="marcas-title"
      className="v2-credits relative isolate overflow-hidden bg-oxblood pb-[clamp(96px,12vw,180px)] pt-[clamp(72px,9vw,140px)] text-cream"
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] -z-10 h-[120%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22]" style={{ background: "radial-gradient(closest-side, #a34b4a, rgba(163,75,74,0))" }} />

      <div className="mx-auto flex w-full max-w-[1320px] items-end justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <h2 id="marcas-title" data-fade className="text-[11px] font-medium uppercase tracking-[0.28em] text-cream/65">
          Nº 03 — Han confiado en mí
        </h2>
        <p data-fade className="hidden text-[11px] font-medium uppercase tracking-[0.28em] text-cream/40 sm:block">
          {String(brands.length).padStart(2, "0")} marcas
        </p>
      </div>
      <p className="sr-only">{brands.join(", ")}</p>

      <div aria-hidden className="mt-[clamp(40px,6vw,80px)] space-y-3 sm:space-y-1">
        <Line dir={1} />
        <Line dir={-1} italic />
      </div>

      <div className="mx-auto mt-[clamp(64px,9vw,128px)] flex w-full max-w-[1320px] flex-col items-start gap-8 px-5 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
        <p data-fade className="max-w-[16ch] font-display text-[clamp(36px,4.6vw,72px)] leading-[1] tracking-[-0.02em]">
          ¿Te encaja lo que <em className="italic text-[#e6b3a6]">ves</em>?
        </p>
        <div data-fade data-delay="0.1">
          <Magnetic>
            <button
              type="button"
              onClick={onContact}
              data-cursor="Hablemos"
              className="group relative grid h-[clamp(132px,13vw,184px)] w-[clamp(132px,13vw,184px)] cursor-pointer place-items-center overflow-hidden rounded-full bg-cream text-oxblood focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] group-hover:translate-y-0" />
              <span className="relative flex flex-col items-center gap-2 transition-colors duration-500 group-hover:text-cream">
                <ArrowUpRight className="h-6 w-6 transition-transform duration-700 group-hover:rotate-45" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Escríbeme</span>
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
});
