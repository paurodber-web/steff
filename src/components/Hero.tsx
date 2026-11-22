import { useCallback, useState, type CSSProperties } from "react";
import { cn } from "../utils/cn";
import { services } from "../data";
import { Header } from "./Header";
import { MenuOverlay } from "./MenuOverlay";
import { ContactOverlay } from "./ContactOverlay";
import { CtaButton } from "./CtaButton";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Service({ s, align, delay, className }: { s: (typeof services)[number]; align: "left" | "right"; delay: number; className?: string }) {
  const right = align === "right";
  return (
    <li
      id={s.id}
      className={cn(
        "anim-down relative pt-4 before:absolute before:top-0 before:w-10 before:border-t before:border-ink/20 before:content-['']",
        right ? "text-right before:right-0" : "before:left-0",
        className,
      )}
      style={d(delay)}
    >
      <div className={cn("flex items-baseline gap-3", right && "flex-row-reverse")}>
        <span className="font-display text-[15px] italic leading-none text-ink-soft">{s.n}</span>
        <h3 className="text-[11.5px] font-semibold uppercase leading-none tracking-[0.28em] text-ink">{s.name}</h3>
      </div>
      <p className="mt-2.5 text-[14px] leading-snug text-ink-soft">{s.desc}</p>
    </li>
  );
}

export default function Hero() {
  const [activeOverlay, setActiveOverlay] = useState<"menu" | "contact" | null>(null);
  const close = useCallback(() => setActiveOverlay(null), []);

  return (
    <section id="top" className="h-dvh min-h-[600px] w-full bg-cream p-3 sm:p-4 lg:p-5">
      <div className="anim-card grain relative isolate h-full w-full overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,#dccab2_0%,#d3bfa5_48%,#c7af93_100%)] sm:rounded-[40px] lg:rounded-[52px]">
        {/* soft light behind the model */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[42%] h-[85%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,247,235,0.7),rgba(255,247,235,0))]"
        />

        <Header onMenu={() => setActiveOverlay("menu")} onContact={() => setActiveOverlay("contact")} />

        {/* mobile / tablet: service names in a single quiet line */}
        <ul
          className="anim-down absolute inset-x-0 top-[86px] z-30 flex items-center justify-center gap-x-2.5 text-[9.5px] font-medium uppercase tracking-[0.18em] text-ink-soft sm:top-[112px] sm:gap-x-4 sm:text-[11px] sm:tracking-[0.26em] lg:hidden"
          style={d(1.8)}
        >
          {services.map((s, i) => (
            <li key={s.id} className="flex items-center gap-x-2.5 sm:gap-x-4">
              {i > 0 && <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-ink/40" />}
              {s.name}
            </li>
          ))}
        </ul>

        {/* stage: arch + title (behind) + model (in front) */}
        <div className="absolute inset-x-0 bottom-0 h-[80%] sm:h-[84%] lg:h-[86%]">
          {/* arch */}
          <div
            aria-hidden
            className="anim-down absolute bottom-0 left-1/2 z-0 h-[90%] w-[88%] -translate-x-1/2 rounded-t-full border border-b-0 border-ink/10 bg-gradient-to-b from-white/30 via-white/10 to-transparent sm:w-[62%] lg:aspect-[4/5] lg:h-[93%] lg:w-auto"
            style={d(1.1)}
          />

          {/* title — always behind the model */}
          <div className="pointer-events-none absolute inset-x-0 top-[8%] z-10 -translate-y-1/2 text-center sm:top-[10%] lg:top-[17%]">
            <h1
              aria-label="Steff"
              className="font-display text-[min(26vw,19vh)] font-medium uppercase leading-[0.82] tracking-[-0.02em] text-ink select-none whitespace-nowrap sm:text-[min(24vw,21vh)] lg:text-[min(21vw,40vh)]"
            >
              {"STEFF".split("").map((c, i) => (
                <span key={i} aria-hidden className="anim-letter" style={{ "--i": i } as CSSProperties}>
                  {c}
                </span>
              ))}
            </h1>
          </div>

          {/* model */}
          <div className="anim-girl pointer-events-none absolute inset-0 z-20 flex items-end justify-center">
            <img
              src="/steff.png"
              alt="Steff Ramírez, UGC creator"
              width={701}
              height={926}
              draggable={false}
              className="h-full w-auto max-w-none shrink-0 select-none [filter:drop-shadow(0_26px_34px_rgba(70,45,30,0.2))]"
            />
          </div>
        </div>

        {/* desktop: services flank the model */}
        <ul className="absolute bottom-[150px] left-[5.5vw] z-30 hidden w-[17vw] max-w-[250px] flex-col gap-7 lg:flex">
          <Service s={services[0]} align="left" delay={1.9} />
          <Service s={services[1]} align="left" delay={2.0} className="translate-x-14" />
        </ul>
        <ul className="absolute bottom-[150px] right-[5.5vw] z-30 hidden w-[17vw] max-w-[250px] flex-col gap-7 lg:flex">
          <Service s={services[2]} align="right" delay={1.95} />
          <Service s={services[3]} align="right" delay={2.05} className="-translate-x-14" />
        </ul>

        {/* The original CTA remains available in code, hidden at the user's request. */}
        <div className="hidden">
          {/* Temporarily hidden at the user's request; keep the CTA code for now. */}
          <div
            className="anim-down flex items-center gap-5 rounded-full border border-white/50 bg-cream/55 p-2 pl-9 shadow-[0_24px_50px_-24px_rgba(42,27,22,0.45)] backdrop-blur-xl xl:gap-8 xl:pl-10"
            style={d(2.0)}
          >
            <p className="whitespace-nowrap font-display text-[20px] italic leading-none text-ink xl:text-[27px]">
              ¿Tu marca es la siguiente?
            </p>
            <CtaButton />
          </div>
        </div>

        {/* The mobile CTA remains available in code, hidden at the user's request. */}
        <div className="hidden">
          <div
            className="anim-down mx-auto max-w-[540px] rounded-[24px] border border-white/50 bg-cream/60 p-4 text-center shadow-[0_24px_50px_-24px_rgba(42,27,22,0.5)] backdrop-blur-xl sm:rounded-[30px] sm:p-5"
            style={d(2.0)}
          >
            <p className="mt-2.5 font-display text-[25px] italic leading-none text-ink sm:text-[30px]">
              ¿Tu marca es la siguiente?
            </p>
            <CtaButton className="mt-4 w-full" />
          </div>
        </div>

        <MenuOverlay open={activeOverlay === "menu"} onClose={close} />
        <ContactOverlay open={activeOverlay === "contact"} onClose={close} />
      </div>
    </section>
  );
}

