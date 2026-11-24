import { useEffect, useRef, useState } from "react";
import { EMAIL, socials } from "../../v2/data";
import { ArrowUpRight } from "../../v2/Icons";
import { gsap, SplitText, useCopy, useMotion } from "../kit";
import { Gold } from "./common";

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
    tl.from(split.chars, { yPercent: 70, opacity: 0, duration: 0.7, stagger: 0.025, ease: "expo.out" }, 0)
      .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.5)
      .from(root.querySelectorAll("[data-fl]"), { yPercent: -70, opacity: 0, filter: "blur(10px)", duration: 1, stagger: 0.09, ease: "expo.out" }, 0.45)
      .add(() => root.querySelector("[data-word]")?.classList.add("is-in"), 1.4);
    return () => split.revert();
  });

  return (
    <section ref={ref} id="contacto" aria-labelledby="v12-cta-h" className="v12-sec v12-tone-dark relative overflow-hidden pb-6 pt-14 sm:pt-16 lg:pt-20">
      <div className="v12-wrap">
        <div data-in className="mb-8 lg:mb-10">
          <span aria-hidden className="v12-rule block h-px w-full" />
          <p className="v12-folio mt-3 flex items-baseline justify-between gap-4">
            <span>Contacto</span>
            <span aria-hidden className="v12-folio-n">08</span>
          </p>
        </div>

        <div className="md:grid md:grid-cols-12 md:items-end md:gap-x-8">
          <h2 id="v12-cta-h" data-cta className="font-display text-[clamp(46px,12vw,68px)] leading-[1.02] tracking-[-0.022em] text-cream sm:text-[clamp(56px,9vw,84px)] md:col-span-7 lg:text-[clamp(60px,6.4vw,104px)]">
            ¿Creamos algo{" "}
            <span className="whitespace-nowrap">
              <Gold>juntas</Gold>?
            </span>
          </h2>
          <div className="mt-6 md:col-span-5 md:mt-0 lg:pb-2 lg:pl-8">
            <p data-in className="v12-soft max-w-[34ch] text-[17px] leading-[1.6]">
              Cuéntame tu marca y tu idea. Te respondo en menos de 24 horas.
            </p>
            <div data-in className="mt-6 flex flex-col items-start gap-x-8 gap-y-1 sm:flex-row sm:flex-wrap sm:items-center">
              <a href="#reserva" className="v12-btn whitespace-nowrap">
                Reserva una llamada
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <button type="button" onClick={copy} className="v12-ul inline-flex min-h-11 cursor-pointer items-center text-[16px] font-medium text-cream" aria-label={`Copiar email ${EMAIL}`}>
                <span aria-live="polite">{done ? "¡Email copiado!" : EMAIL}</span>
              </button>
            </div>
          </div>
        </div>

        <div data-in className="hair-t mt-12 grid gap-y-2 pt-4 sm:mt-14 md:grid-cols-12 md:gap-x-8 lg:mt-12">
          <nav aria-label="Secciones" className="md:col-span-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-0 text-[15px] text-cream">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="v12-link inline-flex min-h-11 items-center">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-x-6 text-[15px] text-cream md:col-span-4 md:justify-end">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="v12-link inline-flex min-h-11 items-center gap-1.5">
                  {s.label}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* huge outlined lettering that fills the width, letter by letter */}
        <div ref={box} aria-hidden className="pointer-events-none relative z-0 mt-6 flex select-none justify-center overflow-hidden" style={{ height: "clamp(120px,19vw,300px)" }}>
          <div ref={word} data-word className="v12-outline flex w-max whitespace-nowrap font-display leading-[0.9] tracking-[-0.03em]" style={{ fontSize: "clamp(110px,24vw,340px)" }}>
            {"Steff".split("").map((c, i) => (
              <span key={i} data-fl className="inline-block">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="v12-soft text-[14px]">© {year} Steff Ramírez · Todos los derechos reservados</p>
          <a href="#top" className="v12-link inline-flex min-h-11 items-center text-[15px] text-cream">
            Volver arriba <span aria-hidden className="ml-1.5">↑</span>
          </a>
        </div>
      </div>
    </section>
  );
}
