import { useRef, type CSSProperties } from "react";
import { services } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export const Letters = ({ word = "STEFF" }: { word?: string }) => (
  <span aria-hidden>
    {word.split("").map((c, i) => (
      <span key={i} data-l className="inline-block">
        {c}
      </span>
    ))}
  </span>
);

const nav =
  "v12-link inline-flex min-h-11 items-center whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.14em] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

/** Top row: plain text links (Menú / name / Escríbeme), no pills, no blur. */
function HeroRow({ onMenu, onContact }: { onMenu: () => void; onContact: () => void }) {
  return (
    <header className="relative z-40 grid grid-cols-[1fr_auto_1fr] items-center px-5 pb-3 pt-3 sm:px-8 sm:pb-6 sm:pt-5 lg:absolute lg:inset-x-0 lg:top-0 lg:px-12 lg:pb-0 lg:pt-6">
      <div className="anim-down justify-self-start" style={d(1.5)}>
        <button type="button" onClick={onMenu} aria-haspopup="dialog" className={`${nav} cursor-pointer`}>
          Menú
        </button>
      </div>
      <a href="#top" className="anim-down px-1 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" style={d(1.4)}>
        <span className="block whitespace-nowrap text-[12px] font-semibold uppercase leading-none tracking-[0.14em] text-ink sm:tracking-[0.22em]">Steff Ramírez</span>
        <span className="mt-2 block whitespace-nowrap text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-ink-soft sm:tracking-[0.22em]">UGC Creator</span>
      </a>
      <div className="anim-down justify-self-end" style={d(1.6)}>
        <button type="button" onClick={onContact} aria-haspopup="dialog" className={`${nav} cursor-pointer`}>
          Escríbeme
        </button>
      </div>
    </header>
  );
}

/** The homepage hero card (same look as EleHero) with a plain text top row. */
export function Hero({ hero, onMenu, onContact, cue = "#servicios" }: { hero: Img; onMenu: () => void; onContact: () => void; cue?: string }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-card]"), { clipPath: "inset(0 0 100% 0 round 52px)", duration: 1.3, ease: "expo.inOut" })
      .from(root.querySelectorAll("[data-l]"), { yPercent: -60, opacity: 0, filter: "blur(10px)", duration: 1.2, stagger: 0.08 }, 0.6)
      .from(root.querySelector("[data-fig]"), { clipPath: "inset(0 0 100% 0)", y: -20, duration: 1.6 }, 0.85)
      .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -14, duration: 0.9, stagger: 0.06 }, 1.5);
  });

  return (
    <div className="v2-frame">
      <section ref={ref} id="top" aria-label="Presentación" data-card className="grain v2-hero">
        <HeroRow onMenu={onMenu} onContact={onContact} />

        <nav aria-label="Servicios" data-in className="relative z-30 h-[var(--svc-h)] lg:hidden">
          <ul className="flex h-full items-center justify-center gap-x-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft sm:gap-x-5 sm:tracking-[0.18em]">
            {services.map((s, i) => (
              <li key={s.id} className="flex items-center gap-x-3 sm:gap-x-5">
                {i > 0 && <span aria-hidden>·</span>}
                <a href={`#${s.id}`} className="py-3 transition-colors hover:text-ink">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="v2-hero__body">
          <h1 className="v2-title">
            <span className="sr-only">Steff Ramírez</span>
            <Letters />
          </h1>
          <div className="v2-stage">
            <img
              data-fig
              src={hero.src}
              srcSet={hero.srcSet}
              sizes="(min-width: 1024px) 480px, 340px"
              width={hero.width}
              height={hero.height}
              alt="Steff Ramírez, UGC creator"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="v2-model"
            />
          </div>
        </div>

        <a
          href={cue}
          data-in
          className="relative z-30 flex h-[var(--cue-h)] flex-col items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-14"
          style={d(0)}
        >
          Desliza
          <span aria-hidden className="relative block h-5 w-px overflow-hidden bg-ink/15">
            <span className="cue-line absolute inset-0 block bg-ink/60" />
          </span>
        </a>
      </section>
    </div>
  );
}
