import { memo, useRef, useState } from "react";
import { cn } from "./cn";
import { faqs } from "./data";
import { SplitTitle, useSectionAnim, gsap } from "./anim";

export const Faq = memo(function Faq({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-faq-row]").forEach((row, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } });
        tl.fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut", delay: i * 0.04 });
        tl.from(row.querySelector("[data-q]"), { yPercent: -50, opacity: 0, duration: 1, ease: "expo.out" }, 0.3);
      });
    });
  });

  return (
    <section
      ref={ref}
      id="faq"
      data-folio="Nº 06 — Preguntas"
      data-scene="#ede1cf"
      aria-labelledby="faq-title"
      className="scroll-mt-0 overflow-x-clip py-[clamp(112px,15vw,220px)]"
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p data-fade className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft">
                Nº 06 — Preguntas
              </p>
              <h2 id="faq-title" className="mt-6 font-display text-[clamp(50px,6.4vw,104px)] font-normal leading-[0.92] tracking-[-0.03em] text-ink">
                <SplitTitle parts={[{ t: "Lo que " }, { t: "quizá", em: true }, { t: " te preguntas." }]} />
              </h2>
              <p data-fade data-delay="0.1" className="mt-8 text-[16px] text-ink-soft">
                ¿Otra duda?{" "}
                <button type="button" onClick={onContact} data-cursor="Escribir" className="v2-underline cursor-pointer text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                  Escríbeme
                </button>
              </p>
            </div>
          </div>

          <ul className="mt-14 lg:col-span-8 lg:mt-0">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} data-faq-row className="relative">
                  <span aria-hidden data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20" />
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      data-cursor={isOpen ? "Cerrar" : "Abrir"}
                      className="group flex w-full cursor-pointer items-start gap-5 py-7 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink sm:gap-8 sm:py-9"
                    >
                      <span className={cn("w-8 shrink-0 pt-2 font-display text-[16px] italic transition-colors duration-500", isOpen ? "text-oxblood" : "text-ink-soft")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        data-q
                        className={cn(
                          "flex-1 font-display text-[clamp(24px,2.8vw,40px)] leading-[1.1] tracking-[-0.015em] transition-[color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2",
                          isOpen ? "italic text-oxblood" : "text-ink",
                        )}
                      >
                        {f.q}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "relative mt-2 grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                          isOpen ? "border-oxblood bg-oxblood text-cream" : "border-ink/25 text-ink group-hover:border-oxblood group-hover:text-oxblood",
                        )}
                      >
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span className={cn("absolute h-3.5 w-px bg-current transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen && "scale-y-0")} />
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} data-open={isOpen} inert={!isOpen} className="faq-panel">
                    <div>
                      <p className="max-w-[38rem] pb-9 pl-[52px] pr-14 text-[17px] leading-relaxed text-ink-soft sm:pl-[64px]">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
            <li aria-hidden className="h-px bg-ink/20" />
          </ul>
        </div>
      </div>
    </section>
  );
});
