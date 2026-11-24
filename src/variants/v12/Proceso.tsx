import { useRef } from "react";
import { processMeta } from "../../v2/data";
import { gsap, useMotion } from "../kit";
import { Band, Folio, Gold, h2Big, headMotion } from "./common";
import { proceso } from "./data";

const NUM_H = "clamp(72px,7.4vw,120px)";

export function Proceso() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "chars");
    const list = root.querySelector<HTMLElement>("[data-list]")!;
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);
    const at = { trigger: list, start: "top 85%", once: true } as const;

    // connector draws with the scroll (no pinning): horizontal on desktop, vertical on mobile, hairlines per row on tablet
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(root.querySelectorAll("[data-line-x]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 80%", end: "bottom 60%", scrub: 0.6 } });
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
    gsap.from(root.querySelectorAll("[data-meta]"), { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", scrollTrigger: at });
    return () => {
      off();
      mm.revert();
    };
  });

  return (
    <Band id="proceso" labelledBy="v12-proceso-h" innerRef={ref} tone="dark">
      <Folio n="02">Cómo funciono</Folio>
      <header className="md:grid md:grid-cols-12 md:items-end md:gap-x-8">
        <h2 id="v12-proceso-h" data-h2 className={`${h2Big} md:col-span-7`}>
          Así trabajo, <Gold>paso a paso</Gold>
        </h2>
        <div className="mt-5 md:col-span-5 md:mt-0 md:pb-2 lg:justify-self-end lg:max-w-[40ch]">
          <p data-lead className="v12-soft max-w-[44ch] text-[16px] leading-[1.6] sm:text-[17px]">
            Un proceso claro, sin vueltas: sabes qué pasa en cada etapa y cuándo recibes tus videos.
          </p>
          <p data-meta className="v12-caps v12-gold mt-4">
            {processMeta.join(" · ")}
          </p>
        </div>
      </header>

      <div className="relative mt-12 lg:mt-14">
        {/* connectors */}
        <span aria-hidden className="absolute bottom-6 left-[75px] top-6 w-px bg-cream/20 md:hidden" />
        <span aria-hidden data-line-y className="absolute bottom-6 left-[75px] top-6 w-px origin-top bg-[#d2b186] md:hidden" />
        <span aria-hidden className="absolute left-0 right-0 hidden h-px bg-cream/20 lg:block" style={{ top: `calc(${NUM_H} + 12px)` }} />
        <span aria-hidden data-line-x className="absolute left-0 right-0 hidden h-px origin-left bg-[#d2b186] lg:block" style={{ top: `calc(${NUM_H} + 12px)` }} />

        <ol data-list className="relative grid gap-9 md:gap-0 lg:grid-cols-5 lg:gap-8">
          {proceso.map((s) => (
            <li
              key={s.title}
              data-step
              className="relative grid grid-cols-[64px_1fr] items-start gap-x-6 md:grid-cols-12 md:gap-x-8 md:py-6 lg:block lg:py-0"
            >
              <span aria-hidden data-hair className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-[#d2b186] md:block lg:hidden" />
              <span aria-hidden data-dot className="absolute left-[71px] top-[22px] h-2.5 w-2.5 rounded-full bg-[#d2b186] md:hidden" />
              <span aria-hidden data-dot className="absolute left-0 hidden h-2.5 w-2.5 rounded-full bg-[#d2b186] lg:block" style={{ top: `calc(${NUM_H} + 8px)` }} />

              <span data-num aria-hidden className="v12-num block font-display text-[52px] leading-none md:col-span-2 md:text-[72px] lg:text-[clamp(72px,7.4vw,120px)]">
                {s.n}
              </span>
              <div className="md:col-span-10 md:grid md:grid-cols-10 md:gap-x-8 lg:mt-9 lg:block">
                <div className="md:col-span-4">
                  <h3 data-t className="font-display text-[30px] leading-none text-cream md:text-[34px]">
                    <span className="sr-only">Paso {s.n}: </span>
                    {s.title}
                  </h3>
                  <p data-t className="v12-gold v12-caps mt-3">
                    {s.when}
                  </p>
                </div>
                <p data-t className="v12-soft mt-2 max-w-[36ch] text-[16px] leading-[1.55] md:col-span-6 md:mt-0 lg:mt-3 lg:text-[16px]">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Band>
  );
}
