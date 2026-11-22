import { memo, useRef } from "react";
import { formats, processMeta, steps } from "./data";
import { SplitTitle, useSectionAnim, gsap } from "./anim";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]";

export const Process = memo(function Process() {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const list = root.querySelector<HTMLElement>("[data-steps]");
      const line = root.querySelector<HTMLElement>("[data-line]");
      if (list && line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: 0.6 } },
        );
      }
      root.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
        const lit = el.querySelectorAll("[data-lit]");
        gsap.fromTo(
          lit,
          { opacity: 0.28 },
          { opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 68%", toggleActions: "play none none reverse" } },
        );
        const dot = el.querySelector("[data-dot]");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0.4, backgroundColor: "rgba(42,27,22,0.15)" },
            { scale: 1, backgroundColor: "#2a1b16", duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 68%", toggleActions: "play none none reverse" } },
          );
        }
      });
      gsap.from(root.querySelectorAll("[data-chip]"), {
        opacity: 0,
        y: -14,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: root.querySelector("[data-chips]"), start: "top 88%", once: true },
      });
    });
  });

  return (
    <section ref={ref} id="proceso" aria-labelledby="proceso-title" className="scroll-mt-4 overflow-x-clip py-[clamp(96px,14vw,200px)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="border-t border-ink/15 pt-[clamp(40px,6vw,72px)] lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p data-fade className={eyebrow}>
                Cómo trabajo
              </p>
              <h2 id="proceso-title" className="mt-6 max-w-[11ch] font-display text-[clamp(44px,8.5vw,96px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink lg:text-[clamp(56px,6vw,92px)]">
                <SplitTitle parts={[{ t: "Simple, claro y " }, { t: "a tu ritmo", em: true }, { t: "." }]} />
              </h2>
              <p data-fade data-delay="0.1" className="mt-6 max-w-[26rem] text-[clamp(16px,1.6vw,18px)] leading-relaxed text-ink-soft">
                Un proceso corto y sin fricciones: tú me cuentas lo que necesitas y yo me encargo del resto.
              </p>
              <ul data-fade data-delay="0.15" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink">
                {processMeta.map((m) => (
                  <li key={m} className="flex items-center gap-3">
                    <span aria-hidden className="h-1 w-1 rounded-full bg-ink/50" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-[clamp(56px,8vw,88px)] lg:col-span-7 lg:mt-0">
            <h3 data-fade className={eyebrow}>
              Qué puedo crear para ti
            </h3>
            <ul data-chips className="mt-6 flex flex-wrap gap-2.5">
              {formats.map((f) => (
                <li key={f} data-chip className="rounded-full border border-ink/20 px-4 py-2.5 text-[13px] text-ink">
                  {f}
                </li>
              ))}
            </ul>
            <p data-fade className="mt-5 text-[13px] text-ink-soft">
              Formato vertical 9:16 · derechos de uso a acordar
            </p>

            <h3 data-fade className={`${eyebrow} mt-[clamp(56px,8vw,96px)]`}>
              Paso a paso
            </h3>
            <ol data-steps className="relative mt-8">
              <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-ink/15" />
              <span aria-hidden data-line className="absolute bottom-3 left-[11px] top-3 w-px origin-top bg-ink" />
              {steps.map((s) => (
                <li key={s.n} data-step className="relative pb-[clamp(40px,6vw,72px)] pl-12 last:pb-0 sm:pl-16">
                  <span aria-hidden className="absolute left-0 top-[14px] grid h-[23px] w-[23px] place-items-center rounded-full bg-cream">
                    <span data-dot className="block h-[9px] w-[9px] rounded-full bg-ink" />
                  </span>
                  <div className="flex items-baseline gap-4">
                    <span data-lit className="font-display text-[18px] italic text-ink-soft">{s.n}</span>
                    <h4 data-lit className="font-display text-[clamp(30px,4vw,48px)] font-normal leading-none tracking-[-0.01em] text-ink">{s.title}</h4>
                  </div>
                  <p data-lit className="mt-4 max-w-[34rem] text-[16px] leading-relaxed text-ink-soft">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
});
