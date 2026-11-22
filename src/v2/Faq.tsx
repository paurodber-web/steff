import { memo, useRef, useState } from "react";
import { cn } from "./cn";
import { faqs } from "./data";
import { PlusIcon } from "./Icons";
import { SplitTitle, useSectionAnim, gsap } from "./anim";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]";

export const Faq = memo(function Faq({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(root.querySelectorAll("[data-faq-row]"), {
        opacity: 0,
        y: -18,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.querySelector("[data-faq-list]"), start: "top 85%", once: true },
      });
    });
  });

  return (
    <section ref={ref} id="faq" data-scene="#ede1cf" aria-labelledby="faq-title" className="scroll-mt-4 overflow-x-clip py-[clamp(96px,12vw,170px)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p data-fade className={eyebrow}>
                Preguntas frecuentes
              </p>
              <h2 id="faq-title" className="mt-6 max-w-[10ch] font-display text-[clamp(44px,8.5vw,96px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink lg:text-[clamp(56px,6vw,92px)]">
                <SplitTitle parts={[{ t: "Lo que " }, { t: "quizá", em: true }, { t: " te preguntas." }]} />
              </h2>
              <p data-fade data-delay="0.1" className="mt-6 text-[16px] text-ink-soft">
                ¿Otra duda?{" "}
                <button
                  type="button"
                  onClick={onContact}
                  className="cursor-pointer rounded-sm text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  Escríbeme
                </button>
                .
              </p>
            </div>
          </div>

          <ul data-faq-list className="mt-[clamp(40px,6vw,64px)] rounded-[28px] bg-cream/70 px-5 shadow-[0_30px_60px_-45px_rgba(42,27,22,0.45)] ring-1 ring-ink/10 sm:px-8 lg:col-span-7 lg:mt-0">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} data-faq-row className="border-b border-ink/10 last:border-b-0">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full cursor-pointer items-start gap-4 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink sm:gap-6 sm:py-8"
                    >
                      <span className="w-6 shrink-0 pt-1.5 font-display text-[15px] italic text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 font-display text-[clamp(21px,2.4vw,28px)] leading-snug tracking-[-0.01em] text-ink transition-[font-style] group-hover:italic">{f.q}</span>
                      <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-cream">
                        <PlusIcon className={cn("h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen && "rotate-[135deg]")} />
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} data-open={isOpen} inert={!isOpen} className="faq-panel">
                    <div>
                      <p className="max-w-[40rem] pb-7 pl-10 pr-12 text-[16px] leading-relaxed text-ink-soft sm:pb-9 sm:pl-12">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
});
