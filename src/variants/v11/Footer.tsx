import { useEffect, useRef, useState } from "react";
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
  const box = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const { copy, done } = useCopy(EMAIL);
  // static on the server, refreshed after mount: no hydration mismatch
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  // fit the outlined word to the full width of the card
  useEffect(() => {
    const b = box.current;
    const w = word.current;
    if (!b || !w) return;
    const fit = () => {
      if (!b.clientWidth) return;
      // optical-size axis makes width non-linear: converge by re-measuring at the real size
      let fs = Math.max(60, b.clientWidth / 2.2);
      for (let i = 0; i < 5; i++) {
        w.style.fontSize = `${fs}px`;
        const natural = w.offsetWidth;
        if (!natural) return;
        fs *= (b.clientWidth / natural) * 0.88;
      }
      w.style.fontSize = `${fs}px`;
      b.style.height = `${fs * 0.8}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  useMotion(ref, (root) => {
    const at = { trigger: root, start: "top 95%", once: true } as const;
    const h = root.querySelector<HTMLElement>("[data-cta]")!;
    const split = SplitText.create(h, { type: "words,chars" });
    const tl = gsap.timeline({ scrollTrigger: at });
    tl.from(root, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.out", clearProps: "clipPath" })
      .from(split.chars, { yPercent: 70, opacity: 0, duration: 0.7, stagger: 0.025, ease: "expo.out" }, 0.25)
      .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.5)
      .from(root.querySelectorAll("[data-fl]"), { yPercent: -70, opacity: 0, filter: "blur(10px)", duration: 1, stagger: 0.09, ease: "expo.out" }, 0.45)
      .add(() => root.querySelector("[data-word]")?.classList.add("is-in"), 1.4);
    return () => split.revert();
  });

  return (
    <div className={framePad}>
      <section
        ref={ref}
        id="contacto"
        aria-labelledby="v11-cta-h"
        className={`grain v11-wrap relative scroll-mt-4 overflow-hidden px-5 pb-5 pt-14 sm:px-10 sm:pt-20 lg:px-14 lg:pt-16 ${cardRadius}`}
        style={{ background: HERO_BG }}
      >
        <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:text-left">
          <div>
            <p data-in className="text-[11px] font-medium uppercase tracking-[0.26em] text-ink/70">
              <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-ink/30" />
              Contacto
            </p>
            <h2 id="v11-cta-h" data-cta className="mt-5 font-display text-[clamp(46px,12vw,72px)] leading-[0.98] tracking-[-0.02em] text-ink sm:text-[clamp(60px,9vw,96px)] lg:text-[clamp(56px,6.2vw,100px)]">
              ¿Creamos algo{" "}
              <span className="whitespace-nowrap">
                <Em>juntas</Em>?
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-center lg:items-start lg:pb-2">
            <p data-in className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-ink/75 sm:text-[17px] lg:mt-0">
              Cuéntame tu marca y tu idea. Te respondo en menos de 24 horas.
            </p>
            <div data-in className="mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
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
        </div>

        <div data-in className="relative z-10 mt-12 flex flex-col gap-3 border-t border-ink/15 pt-4 sm:mt-14 lg:mt-10 lg:flex-row lg:items-center lg:justify-between">
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
        </div>

        {/* huge outlined lettering that fills the width, letter by letter */}
        <div ref={box} aria-hidden className="pointer-events-none relative z-0 mt-6 flex select-none justify-center overflow-hidden" style={{ height: "clamp(120px,19vw,300px)" }}>
          <div ref={word} data-word className="v11-outline flex w-max whitespace-nowrap font-display leading-[0.9] tracking-[-0.03em]" style={{ fontSize: "clamp(110px,24vw,340px)" }}>
            {"Steff".split("").map((c, i) => (
              <span key={i} data-fl className="inline-block">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-ink/70">© {year} Steff Ramírez · Todos los derechos reservados</p>
          <a href="#top" className="v11-btn v11-btn--ghost justify-center">
            Volver arriba
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
