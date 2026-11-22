import { memo, useRef } from "react";
import { formats, processMeta, steps } from "./data";
import { SplitTitle, useSectionAnim, gsap } from "./anim";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";
const who = ["Tú me cuentas", "Yo propongo", "Yo grabo", "Tú publicas"];

export const Process = memo(function Process() {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-step]").forEach((row) => {
        const rule = row.querySelector("[data-rule]");
        const num = row.querySelector("[data-num]");
        const body = row.querySelectorAll("[data-body]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 82%", once: true } });
        if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" });
        tl.from(body, { yPercent: -60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.35);
        // the numeral fills with ink as the row crosses the middle of the screen
        if (num) {
          gsap.fromTo(num, { "--fill": "0%" }, { "--fill": "100%", ease: "none", scrollTrigger: { trigger: row, start: "top 75%", end: "bottom 45%", scrub: 0.5 } });
        }
      });
      gsap.from(root.querySelectorAll("[data-dish]"), {
        opacity: 0,
        y: -18,
        duration: 1,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.querySelector("[data-menu]"), start: "top 85%", once: true },
      });
    });
  });

  return (
    <section
      ref={ref}
      id="proceso"
      data-folio="Nº 04 — Método"
      data-scene="#e6d6bf"
      aria-labelledby="proceso-title"
      className="scroll-mt-0 overflow-x-clip py-[clamp(112px,15vw,220px)]"
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className="lg:col-span-8">
            <p data-fade className={eyebrow}>
              Nº 04 — Método
            </p>
            <h2 id="proceso-title" className="mt-6 font-display text-[clamp(50px,9.6vw,150px)] font-normal leading-[0.92] tracking-[-0.03em] text-ink">
              <SplitTitle parts={[{ t: "Del brief " }, { t: "al feed", em: true }, { t: "." }]} />
            </h2>
          </div>
          <div className="mt-8 lg:col-span-4 lg:mt-0 lg:pb-4">
            <p data-fade data-delay="0.1" className="max-w-[24rem] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-ink-soft">
              Cuatro pasos, sin fricciones. Tú pones la marca; yo, la historia.
            </p>
            <ul data-fade data-delay="0.15" className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-medium uppercase tracking-[0.18em] text-ink">
              {processMeta.map((m) => (
                <li key={m} className="flex items-center gap-2.5">
                  <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-oxblood" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="mt-[clamp(64px,9vw,128px)]">
          {steps.map((s, i) => (
            <li key={s.n} data-step className="group relative">
              <span aria-hidden data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-ink/25" />
              <div className="grid grid-cols-[auto_1fr] items-start gap-x-6 py-[clamp(28px,4vw,56px)] sm:gap-x-10 lg:grid-cols-12 lg:gap-x-8">
                <span
                  aria-hidden
                  data-num
                  className="v2-numeral font-display text-[clamp(64px,10vw,168px)] italic leading-[0.8] lg:col-span-3"
                >
                  {s.n}
                </span>
                <div className="overflow-hidden lg:col-span-4">
                  <h3 data-body className="font-display text-[clamp(32px,3.6vw,56px)] leading-none tracking-[-0.02em] text-ink">
                    <span className="sr-only">Paso {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p data-body className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-oxblood">
                    {who[i]}
                  </p>
                </div>
                <p data-body className="col-span-2 mt-5 max-w-[30rem] text-[clamp(16px,1.4vw,18px)] leading-relaxed text-ink-soft lg:col-span-5 lg:mt-1">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
          <li aria-hidden className="h-px bg-ink/25" />
        </ol>

        {/* the menu */}
        <div className="mt-[clamp(80px,11vw,160px)] lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <h3 data-fade className="font-display text-[clamp(36px,4vw,60px)] leading-none tracking-[-0.02em] text-ink">
              La <em className="italic text-oxblood">carta</em>
            </h3>
            <p data-fade className="mt-4 max-w-[18rem] text-[15px] leading-relaxed text-ink-soft">
              Formato vertical 9:16, subtítulos incluidos. Derechos de uso a acordar en cada proyecto.
            </p>
          </div>
          <ul data-menu className="mt-10 lg:col-span-8 lg:mt-0">
            {formats.map((f, i) => (
              <li key={f.name} data-dish className="group flex items-baseline gap-4 border-b border-ink/10 py-4 first:pt-0">
                <span className="w-7 shrink-0 font-display text-[14px] italic text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[clamp(22px,2.2vw,32px)] leading-tight text-ink transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-oxblood">
                  {f.name}
                </span>
                <span aria-hidden className="v2-leader mx-1 hidden flex-1 sm:block" />
                <span className="ml-auto text-right text-[13px] text-ink-soft sm:ml-0 sm:max-w-[16rem]">{f.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});
