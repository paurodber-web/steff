import { useRef, type CSSProperties, type ReactNode } from "react";
import { Header } from "../v2/Header";
import { services } from "../v2/data";
import type { Img } from "./images";
import { gsap, useMotion } from "./kit";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

type Props = {
  hero: Img;
  onMenu: () => void;
  onContact: () => void;
  /** visual title (the h1 always reads "Steff Ramírez"); defaults to STEFF in letters */
  title?: ReactNode;
  /** layers behind the figure (inside the stage) */
  back?: ReactNode;
  /** layers in front of everything inside the card */
  front?: ReactNode;
  /** desktop flanking services next to the figure */
  flanks?: boolean;
  /** extra class on the card (background treatments) */
  cardClass?: string;
  cardStyle?: CSSProperties;
  /** custom intro/scroll motion; receives the section root */
  motion?: (root: HTMLElement) => void | (() => void);
  cue?: string;
};

export const Letters = ({ word = "STEFF" }: { word?: string }) => (
  <span aria-hidden>
    {word.split("").map((c, i) => (
      <span key={i} data-l className="inline-block">
        {c}
      </span>
    ))}
  </span>
);

function Flank({ s, right }: { s: (typeof services)[number]; right?: boolean }) {
  return (
    <li data-in className={`relative pt-4 before:absolute before:top-0 before:w-10 before:border-t before:border-ink/25 before:content-[''] ${right ? "before:right-0" : "before:left-0"}`}>
      <a href={`#${s.id}`} className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
        <div className={`flex items-baseline gap-3 ${right ? "flex-row-reverse" : ""}`}>
          <span className="font-display text-[15px] italic leading-none text-ink-soft">{s.n}</span>
          <span className="text-[12px] font-semibold uppercase leading-none tracking-[0.22em] text-ink">{s.name}</span>
        </div>
        <p className="mt-2.5 text-[14px] leading-snug text-ink-soft">{s.desc}</p>
      </a>
    </li>
  );
}

/**
 * The homepage hero, rebuilt on the same proven layout (rounded beige card, centred title and
 * figure, real menu/contact header) with slots for each variant's elevation.
 */
export function EleHero({ hero, onMenu, onContact, title, back, front, flanks = true, cardClass, cardStyle, motion, cue = "#portafolio" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    if (motion) return motion(root);
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-card]"), { clipPath: "inset(0 0 100% 0 round 52px)", duration: 1.3, ease: "expo.inOut" })
      .from(root.querySelectorAll("[data-l]"), { yPercent: -60, opacity: 0, filter: "blur(10px)", duration: 1.2, stagger: 0.08 }, 0.6)
      .from(root.querySelector("[data-fig]"), { clipPath: "inset(0 0 100% 0)", y: -20, duration: 1.6 }, 0.85)
      .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -14, duration: 0.9, stagger: 0.06 }, 1.5);
  });

  return (
    <div className="v2-frame">
      <section ref={ref} id="top" aria-label="Presentación" data-card className={`grain v2-hero ${cardClass ?? ""}`} style={cardStyle}>
        <Header onMenu={onMenu} onContact={onContact} />

        <nav aria-label="Servicios" data-in className="relative z-30 h-[var(--svc-h)] lg:hidden">
          <ul className="flex h-full items-center justify-center gap-x-2.5 px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft sm:gap-x-4 sm:tracking-[0.22em]">
            {services.map((s, i) => (
              <li key={s.id} className="flex items-center gap-x-2.5 sm:gap-x-4">
                {i > 0 && <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-ink/40" />}
                <a href={`#${s.id}`} className="rounded-sm py-3 transition-colors hover:text-ink">{s.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="v2-hero__body">
          <h1 className="v2-title">
            <span className="sr-only">Steff Ramírez</span>
            {title ?? <Letters />}
          </h1>
          <div className="v2-stage">
            {back}
            {flanks && (
              <ul className="v2-flank v2-flank--l hidden">
                <Flank s={services[0]} />
                <Flank s={services[1]} />
              </ul>
            )}
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
            {flanks && (
              <ul className="v2-flank v2-flank--r hidden">
                <Flank s={services[2]} right />
                <Flank s={services[3]} right />
              </ul>
            )}
          </div>
        </div>

        {front}

        <a
          href={cue}
          data-in
          className="relative z-30 flex h-[var(--cue-h)] flex-col items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink-soft transition-colors hover:text-ink lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-14"
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
