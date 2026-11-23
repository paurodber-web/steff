import { useRef } from "react";
import { processMeta } from "../../v2/data";
import { gsap, useMotion } from "../kit";
import { Em, Eyebrow, Panel, h2Cls, headMotion, leadCls } from "./common";
import { proceso } from "./data";

export function Proceso() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const off = headMotion(root);
    const list = root.querySelector<HTMLElement>("[data-list]")!;
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);
    const at = { trigger: list, start: "top 85%", once: true } as const;

    // connector draws with the scroll (no pinning): horizontal on desktop, vertical on mobile
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(root.querySelectorAll("[data-line-x]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 80%", end: "bottom 45%", scrub: 0.6 } });
    });
    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(root.querySelectorAll("[data-line-y]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 55%", scrub: 0.6 } });
    });

    steps.forEach((el, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", once: true }, delay: window.innerWidth >= 1024 ? i * 0.09 : 0 });
      tl.from(el, { opacity: 0, y: 26, duration: 0.75, ease: "expo.out" })
        .from(el.querySelector("[data-dot]"), { scale: 0.4, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.1)
        .from(el.querySelectorAll("[data-t]"), { opacity: 0, y: 10, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.25);
    });
    gsap.from(root.querySelectorAll("[data-meta] > *"), { opacity: 0, y: 10, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: at });
    return () => {
      off();
      mm.revert();
    };
  });

  return (
    <Panel id="proceso" labelledBy="v11-proceso-h" innerRef={ref}>
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Cómo funciono</Eyebrow>
          <h2 id="v11-proceso-h" data-h2 className={h2Cls}>
            Así trabajo, <Em>paso a paso</Em>
          </h2>
          <p data-lead className={leadCls}>
            Un proceso claro, sin vueltas: sabes qué pasa en cada etapa y cuándo recibes tus videos.
          </p>
        </div>
        <ul data-meta className="flex flex-wrap gap-2 lg:justify-end">
          {processMeta.map((m) => (
            <li key={m} className="v11-tag bg-[#fbf8f2] py-1.5 text-[12px] text-ink">
              {m}
            </li>
          ))}
        </ul>
      </header>

      <div className="relative mt-9 lg:mt-12">
        {/* connectors */}
        <span aria-hidden className="absolute left-[21px] top-5 bottom-5 w-px bg-ink/12 md:hidden" />
        <span aria-hidden data-line-y className="absolute left-[21px] top-5 bottom-5 w-px origin-top bg-oxblood md:hidden" />
        <span aria-hidden className="absolute left-0 right-0 top-[21px] hidden h-px bg-ink/12 lg:block" />
        <span aria-hidden data-line-x className="absolute left-0 right-0 top-[21px] hidden h-px origin-left bg-oxblood lg:block" />

        <ol data-list className="relative grid gap-7 md:grid-cols-2 md:gap-4 lg:grid-cols-5 lg:gap-6">
          {proceso.map((s, i) => (
            <li
              key={s.title}
              data-step
              className={`v11-step grid grid-cols-[44px_1fr] gap-x-4 md:block ${i === proceso.length - 1 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <span
                data-dot
                className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-[#fbf8f2] font-display text-[15px] italic text-oxblood md:mb-4"
              >
                {s.n}
              </span>
              <div>
                <div data-t className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[26px] leading-none text-ink sm:text-[28px]">{s.title}</h3>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">{s.when}</span>
                </div>
                <p data-t className="mt-2 max-w-[34ch] text-[14px] leading-snug text-ink-soft sm:text-[15px]">
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
