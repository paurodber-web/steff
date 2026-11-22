import type { CSSProperties } from "react";
import { cn } from "./cn";
import { services, type Service } from "./data";
import { Header } from "./Header";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export type HeroImage = { src: string; srcSet: string; sizes: string; width: number; height: number };

function FlankService({ s, align, delay, className }: { s: Service; align: "left" | "right"; delay: number; className?: string }) {
  const right = align === "right";
  return (
    <li
      className={cn(
        "anim-down relative pt-4 before:absolute before:top-0 before:w-10 before:border-t before:border-ink/25 before:content-['']",
        right ? "before:right-0" : "before:left-0",
        className,
      )}
      style={d(delay)}
    >
      <a href={`#${s.id}`} className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
        <div className={cn("flex items-baseline gap-3", right && "flex-row-reverse")}>
          <span className="font-display text-[15px] italic leading-none text-ink-soft">{s.n}</span>
          <span className="text-[12px] font-semibold uppercase leading-none tracking-[0.22em] text-ink">{s.name}</span>
        </div>
        <p className="mt-2.5 text-[14px] leading-snug text-ink-soft">{s.desc}</p>
      </a>
    </li>
  );
}

export function Hero({ image, onMenu, onContact }: { image: HeroImage; onMenu: () => void; onContact: () => void }) {
  return (
    <div className="v2-frame">
      <section id="top" aria-label="Presentación" className="anim-card grain v2-hero">
        <Header onMenu={onMenu} onContact={onContact} />

        {/* <1024: service names in a single quiet line, linking to the real services section */}
        <nav aria-label="Servicios" className="anim-down relative z-30 h-[var(--svc-h)] lg:hidden" style={d(1.8)}>
          <ul className="flex h-full items-center justify-center gap-x-2.5 px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft sm:gap-x-4 sm:tracking-[0.22em]">
            {services.map((s, i) => (
              <li key={s.id} className="flex items-center gap-x-2.5 sm:gap-x-4">
                {i > 0 && <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-ink/40" />}
                <a
                  href={`#${s.id}`}
                  className="rounded-sm py-3 transition-colors hover:text-ink active:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="v2-hero__body">
          {/* the single h1: visually STEFF, read as the full name */}
          <h1 className="v2-title">
            <span className="sr-only">Steff Ramírez</span>
            <span aria-hidden>
              {"STEFF".split("").map((c, i) => (
                <span key={i} className="anim-letter" style={{ "--i": i } as CSSProperties}>
                  {c}
                </span>
              ))}
            </span>
          </h1>

          <div className="v2-stage">
            <div aria-hidden className="v2-glow" />
            <div aria-hidden className="v2-arch anim-down" style={d(1.1)} />

            {/* ≥1024: services flank the model, around its middle/lower-middle */}
            <ul className="v2-flank v2-flank--l hidden">
              <FlankService s={services[0]} align="left" delay={1.9} />
              <FlankService s={services[1]} align="left" delay={2.0} />
            </ul>

            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes}
              width={image.width}
              height={image.height}
              alt="Steff Ramírez, UGC creator"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="v2-model anim-girl"
            />

            <ul className="v2-flank v2-flank--r hidden">
              <FlankService s={services[2]} align="right" delay={1.95} />
              <FlankService s={services[3]} align="right" delay={2.05} />
            </ul>
          </div>
        </div>

        {/* scroll cue */}
        <a
          href="#sobre-mi"
          className="anim-down relative z-30 flex h-[var(--cue-h)] flex-col lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-14 items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink-soft transition-colors hover:text-ink active:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-ink"
          style={d(2.4)}
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
