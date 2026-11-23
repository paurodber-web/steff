import { useRef } from "react";
import { EMAIL, socials } from "../../v2/data";
import { ArrowUpRight, MailIcon } from "../../v2/Icons";
import { gsap, SplitText, useCopy, useMotion } from "../kit";
import { HERO_BG, cardRadius, framePad } from "../parts";
import { Em } from "./common";

const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#marcas", label: "Marcas" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#reserva", label: "Reserva" },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);

  useMotion(ref, (root) => {
    const at = { trigger: root, start: "top 95%", once: true } as const;
    const h = root.querySelector<HTMLElement>("[data-cta]")!;
    const split = SplitText.create(h, { type: "lines" });
    const tl = gsap.timeline({ scrollTrigger: at });
    tl.from(root, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.out", clearProps: "clipPath" })
      .from(split.lines, { yPercent: 70, opacity: 0, filter: "blur(10px)", duration: 0.9, stagger: 0.12, ease: "expo.out" }, 0.2)
      .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.55)
      .from(root.querySelectorAll("[data-mark]"), { yPercent: 30, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.3);
    return () => split.revert();
  });

  return (
    <div className={framePad}>
      <section
        ref={ref}
        id="contacto"
        aria-labelledby="v11-cta-h"
        className={`grain v11-wrap relative scroll-mt-4 overflow-hidden px-5 pb-0 pt-14 sm:px-10 sm:pt-20 lg:px-14 lg:pt-20 ${cardRadius}`}
        style={{ background: HERO_BG }}
      >
        <div className="relative z-10 mx-auto flex max-w-[1000px] flex-col items-center text-center">
          <p data-in className="text-[11px] font-medium uppercase tracking-[0.26em] text-ink/70">
            <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-ink/30" />
            Contacto
            <span className="ml-3 inline-block h-px w-8 translate-y-[-3px] bg-ink/30" />
          </p>
          <h2 id="v11-cta-h" data-cta className="mt-6 font-display text-[clamp(44px,9.5vw,128px)] leading-[0.98] tracking-[-0.02em] text-ink">
            ¿Creamos algo <Em>juntas</Em>?
          </h2>
          <p data-in className="mt-8 max-w-[42ch] text-[15px] leading-relaxed text-ink/75 sm:text-[17px]">
            Cuéntame tu marca y tu idea. Te respondo en menos de 24 horas.
          </p>
          <div data-in className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a href="#reserva" className="v11-btn v11-btn--solid justify-center">
              Reserva una llamada
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button type="button" onClick={copy} className="v11-btn v11-btn--ghost justify-center" aria-label={`Copiar email ${EMAIL}`}>
              <MailIcon className="h-4 w-4" />
              <span aria-live="polite">{done ? "¡Email copiado!" : EMAIL}</span>
            </button>
          </div>
        </div>

        <div data-in className="relative z-10 mt-14 flex flex-col gap-5 border-t border-ink/15 pt-5 sm:mt-20 lg:mt-24 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Secciones">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink/80">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="v11-link inline-flex min-h-9 items-center">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-x-5 text-[13px] text-ink/80">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="v11-link inline-flex min-h-9 items-center gap-1.5">
                  {s.label}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[12px] text-ink/60">© {new Date().getFullYear()} Steff Ramírez · Todos los derechos reservados</p>
        </div>

        <div aria-hidden className="pointer-events-none relative z-0 -mx-5 mt-4 h-[clamp(56px,12vw,170px)] select-none overflow-hidden sm:-mx-10 lg:-mx-14 lg:mt-2">
          <div data-mark className="text-center font-display text-[clamp(110px,24vw,340px)] leading-[0.8] tracking-[-0.03em] text-cream/35">
            Steff
          </div>
        </div>
      </section>
    </div>
  );
}
