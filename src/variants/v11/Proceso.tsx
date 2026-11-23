import { useRef } from "react";
import { processMeta } from "../../v2/data";
import { gsap, useMotion } from "../kit";
import { Eyebrow, Gold, Panel, h2Big, headMotion } from "./common";
import { proceso } from "./data";

/* small hand-drawn style line icons, one per step */
const ICONS: Record<string, string[]> = {
  Brief: ["M11 7.5c6-1 20-1 26 0 1 9 1 24 0 33-6 1-20 1-26 0-1-9-1-24 0-33Z", "M17 17c4-.6 10-.6 14 0", "M17 24c5-.5 9-.5 14 0", "M17 31c3-.5 6-.5 9 0"],
  Guion: ["M31 8.5 39.5 17 18 38.5 8 41l2.5-10Z", "M27 12.5l8.5 8.5", "M10.5 31 17 37.5"],
  "Grabación": ["M15 6.5c5-.6 13-.6 18 0 1.6 11 1.6 24 0 35-5 .6-13 .6-18 0-1.6-11-1.6-24 0-35Z", "M24 17.5a5.5 5.5 0 1 0 .1 0Z", "M21 35.5h6"],
  "Edición": ["M6 14.5c10-.7 26-.7 36 0", "M6 24c10 .5 26 .5 36 0", "M6 33.5c10-.5 26-.5 36 0", "M17 11.5a3 3 0 1 0 .1 0Z", "M31 21a3 3 0 1 0 .1 0Z", "M21 30.5a3 3 0 1 0 .1 0Z"],
  Entrega: ["M6 22.5 42 8 30.5 40.5 22.5 28Z", "M22.5 28 42 8", "M22.5 28 21 38"],
};

function StepIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {(ICONS[name] ?? []).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const NUM_H = "clamp(72px,7.4vw,120px)";

export function Proceso() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "chars");
    const list = root.querySelector<HTMLElement>("[data-list]")!;
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);
    const at = { trigger: list, start: "top 85%", once: true } as const;

    // connector draws with the scroll (no pinning): horizontal on desktop, vertical on mobile
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(root.querySelectorAll("[data-line-x]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 80%", end: "bottom 55%", scrub: 0.6 } });
    });
    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      root.querySelectorAll("[data-hair]").forEach((h) => gsap.fromTo(h, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 92%", once: true } }));
    });
    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(root.querySelectorAll("[data-line-y]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 55%", scrub: 0.6 } });
    });

    steps.forEach((el, i) => {
      const num = el.querySelector("[data-num]");
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", once: true }, delay: window.innerWidth >= 1024 ? i * 0.09 : 0 });
      tl.from(num, { opacity: 0, yPercent: 30, duration: 0.8, ease: "expo.out" })
        .from(el.querySelectorAll("[data-dot]"), { scale: 0.2, opacity: 0, duration: 0.6, ease: "back.out(2.4)" }, 0.1)
        .from(el.querySelectorAll("[data-t]"), { opacity: 0, y: 14, duration: 0.55, stagger: 0.07, ease: "power2.out" }, 0.2)
        .add(() => num?.classList.add("is-in"), 0.4);
    });
    gsap.from(root.querySelectorAll("[data-meta] > *"), { opacity: 0, y: 10, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: at });
    return () => {
      off();
      mm.revert();
    };
  });

  return (
    <Panel id="proceso" labelledBy="v11-proceso-h" innerRef={ref} tone="dark">
      <header className="flex flex-col items-center text-center">
        <Eyebrow dark>Cómo funciono</Eyebrow>
        <h2 id="v11-proceso-h" data-h2 className={`${h2Big} text-cream`}>
          Así trabajo, <Gold>paso a paso</Gold>
        </h2>
        <p data-lead className="v11-soft mt-5 max-w-[46ch] text-[15px] leading-relaxed sm:text-base">
          Un proceso claro, sin vueltas: sabes qué pasa en cada etapa y cuándo recibes tus videos.
        </p>
        <ul data-meta className="mt-6 flex flex-wrap justify-center gap-2">
          {processMeta.map((m) => (
            <li key={m} className="v11-tag py-1.5 text-[12px]">
              {m}
            </li>
          ))}
        </ul>
      </header>

      <div className="relative mt-12 lg:mt-14">
        {/* connectors */}
        <span aria-hidden className="absolute bottom-6 left-[75px] top-6 w-px bg-cream/15 md:hidden" />
        <span aria-hidden data-line-y className="absolute bottom-6 left-[75px] top-6 w-px origin-top bg-[#c9a87c] md:hidden" />
        <span aria-hidden className="absolute left-0 right-0 hidden h-px bg-cream/15 lg:block" style={{ top: `calc(${NUM_H} + 12px)` }} />
        <span aria-hidden data-line-x className="absolute left-0 right-0 hidden h-px origin-left bg-[#c9a87c] lg:block" style={{ top: `calc(${NUM_H} + 12px)` }} />

        <ol data-list className="relative grid gap-9 md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:grid-cols-5 lg:gap-6">
          {proceso.map((s, i) => (
            <li
              key={s.title}
              data-step
              className={`relative grid grid-cols-[64px_1fr] items-start gap-x-6 md:block md:pt-7 lg:pt-0 ${i === proceso.length - 1 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <span aria-hidden data-hair className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-[#c9a87c] md:block lg:hidden" />
              <span aria-hidden data-dot className="absolute left-[71px] top-[22px] h-2.5 w-2.5 rounded-full bg-[#c9a87c] md:hidden" />
              <span aria-hidden data-dot className="absolute left-0 hidden h-2.5 w-2.5 rounded-full bg-[#c9a87c] lg:block" style={{ top: `calc(${NUM_H} + 8px)` }} />

              <span data-num aria-hidden className="v11-num block font-display text-[52px] leading-none md:text-[88px] lg:text-[clamp(72px,7.4vw,120px)]">
                {s.n}
              </span>
              <div className="lg:mt-9">
                <div data-t className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-4">
                  <StepIcon name={s.title} className="v11-gold h-9 w-9 shrink-0 lg:h-11 lg:w-11" />
                  <h3 className="font-display text-[28px] leading-none text-cream">
                    <span className="sr-only">Paso {s.n}: </span>
                    {s.title}
                  </h3>
                </div>
                <p data-t className="v11-gold mt-3 text-[11px] font-medium uppercase tracking-[0.2em]">
                  {s.when}
                </p>
                <p data-t className="v11-soft mt-2 max-w-[34ch] text-[14.5px] leading-snug">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}
