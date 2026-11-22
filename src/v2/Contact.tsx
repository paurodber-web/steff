import { memo, useRef } from "react";
import { EMAIL, socials } from "./data";
import { CopyEmail } from "./CopyEmail";
import { ArrowUpRight } from "./Icons";
import { SplitTitle, useSectionAnim, gsap } from "./anim";

const linkCls =
  "rounded-sm underline decoration-cream/30 underline-offset-4 transition-colors hover:decoration-cream active:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream";

export const Contact = memo(function Contact() {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const card = root.querySelector("[data-card]");
      if (!card) return;
      gsap.fromTo(
        card,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "power3.out", clearProps: "clipPath", scrollTrigger: { trigger: root, start: "top 80%", once: true } },
      );
      gsap.from(root.querySelectorAll("[data-rise]"), {
        opacity: 0,
        y: -18,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.9,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
    });
  });

  return (
    <section ref={ref} id="contacto" aria-labelledby="contacto-title" className="scroll-mt-0">
      <div className="v2-frame">
        <div data-card className="v2-radius grain relative isolate overflow-hidden bg-ink text-cream">
          <div aria-hidden className="pointer-events-none absolute -bottom-[30%] left-1/2 h-[80%] w-[130%] -translate-x-1/2 rounded-full opacity-70" style={{ background: "radial-gradient(closest-side, #5c1a1f, rgba(92,26,31,0))" }} />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[60%] w-[120%] -translate-x-1/2 rounded-full opacity-[0.12]" style={{ background: "radial-gradient(closest-side, #f4eee3, rgba(244,238,227,0))" }} />
          <div className="relative mx-auto flex w-full max-w-[1200px] flex-col px-5 pb-6 pt-[clamp(72px,10vw,140px)] sm:px-8 lg:px-12">
            <p data-rise className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-cream/60 sm:tracking-[0.28em]">
              ¿Trabajamos juntas?
            </p>
            <h2
              id="contacto-title"
              className="mt-8 select-none text-center font-display font-medium uppercase leading-[0.85] tracking-[-0.02em]"
              style={{ fontSize: "min(15.2vw, 13.2rem)" }}
            >
              <SplitTitle letters parts={[{ t: "Hablemos" }]} />
            </h2>

            <div className="mx-auto mt-[clamp(40px,6vw,80px)] flex flex-col items-center text-center">
              <p data-rise className="max-w-[28rem] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-cream/70">
                Cuéntame sobre tu marca y qué te gustaría contar. Te respondo con ideas, no con plantillas.
              </p>
              <div data-rise className="mt-8 flex flex-col items-center gap-1 sm:mt-10">
                <a
                  id="contact-card-email"
                  href={`mailto:${EMAIL}`}
                  className="rounded-sm break-all font-display text-[clamp(22px,4.4vw,48px)] italic leading-tight underline decoration-cream/25 underline-offset-[8px] transition-colors hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  {EMAIL}
                </a>
                <CopyEmail targetId="contact-card-email" />
              </div>

              <ul data-rise aria-label="Redes sociales" className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-12 items-center gap-3 rounded-full border border-cream/25 pl-6 pr-4 text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-500 hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                    >
                      {s.label}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                      <span className="sr-only">(se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="mt-[clamp(64px,9vw,120px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-cream/15 pt-5 text-[13px] text-cream/60">
              <span>© 2026 Steff Ramírez</span>
              <ul className="flex gap-x-5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex min-h-11 items-center no-underline hover:text-cream`}>
                      {s.label}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#top" className={`${linkCls} inline-flex min-h-11 items-center no-underline hover:text-cream`}>
                Volver arriba ↑
              </a>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
});
