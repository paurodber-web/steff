import { memo, useRef } from "react";
import { formats, processMeta, steps } from "./data";
import { SplitTitle, useSectionAnim, gsap } from "./anim";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]";

export const Process = memo(function Process() {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const list = root.querySelector<HTMLElement>("[data-steps]");
      if (list) {
        // cards drop in one after another, like the hero's elements
        gsap.from(list.querySelectorAll("[data-step]"), {
          opacity: 0,
          y: -40,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: list, start: "top 82%", once: true },
        });
      }
      gsap.from(root.querySelectorAll("[data-chip]"), {
        opacity: 0,
        y: -14,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.querySelector("[data-chips]"), start: "top 90%", once: true },
      });
    });
  });

  return (
    <section
      ref={ref}
      id="proceso"
      data-scene="#e6d6bf"
      aria-labelledby="proceso-title"
      className="scroll-mt-4 overflow-x-clip py-[clamp(96px,12vw,170px)]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className="lg:col-span-7">
            <p data-fade className={eyebrow}>
              Cómo trabajo
            </p>
            <h2
              id="proceso-title"
              className="mt-6 max-w-[12ch] font-display text-[clamp(44px,8.5vw,104px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink lg:text-[clamp(60px,7vw,104px)]"
            >
              <SplitTitle parts={[{ t: "Simple, claro y " }, { t: "a tu ritmo", em: true }, { t: "." }]} />
            </h2>
          </div>
          <div className="mt-6 sm:mt-8 lg:col-span-5 lg:mt-0 lg:pb-3">
            <p data-fade data-delay="0.1" className="max-w-[28rem] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-ink-soft">
              Un proceso corto y sin fricciones: tú me cuentas lo que necesitas y yo me encargo del resto.
            </p>
            <ul data-fade data-delay="0.15" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-ink">
              {processMeta.map((m) => (
                <li key={m} className="flex items-center gap-3">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-ink/50" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol data-steps className="relative mt-[clamp(56px,8vw,104px)] grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              data-step
              className="group relative flex flex-col rounded-[28px] border border-ink/10 bg-cream/70 p-7 shadow-[0_30px_50px_-40px_rgba(42,27,22,0.45)] backdrop-blur-[2px] transition-[transform,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:bg-cream sm:min-h-[340px] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[15px] italic text-ink-soft">Paso</span>
                <span aria-hidden className="relative z-10 grid h-[30px] w-[30px] place-items-center rounded-full border border-ink/15 bg-cream">
                  <span className="block h-2 w-2 rounded-full bg-oxblood transition-transform duration-500 group-hover:scale-150" />
                </span>
              </div>
              <span aria-hidden className="mt-4 font-display text-[clamp(52px,7vw,96px)] italic sm:mt-6 leading-none text-ink/15 transition-colors duration-700 group-hover:text-oxblood/45">
                {s.n}
              </span>
              <div className="pt-6 sm:pt-8">
                <h3 className="font-display text-[clamp(28px,2.6vw,36px)] font-normal leading-none tracking-[-0.01em] text-ink">
                  <span className="sr-only">{s.n}. </span>
                  {s.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-[clamp(64px,9vw,120px)] lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
          <div className="lg:col-span-4">
            <h3 data-fade className={eyebrow}>
              Qué puedo crear para ti
            </h3>
            <p data-fade className="mt-4 text-[14px] text-ink-soft">
              Formato vertical 9:16 · derechos de uso a acordar
            </p>
          </div>
          <ul data-chips className="mt-6 flex flex-wrap gap-2.5 lg:col-span-8 lg:mt-0">
            {formats.map((f) => (
              <li
                key={f}
                data-chip
                className="rounded-full border border-ink/15 bg-cream/60 px-5 py-3 font-display text-[clamp(17px,1.6vw,21px)] text-ink transition-colors duration-500 hover:border-oxblood hover:bg-oxblood hover:text-cream"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});
