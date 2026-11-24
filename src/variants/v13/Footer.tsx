import { useEffect, useRef, useState } from "react";
import { EMAIL, socials } from "../../v2/data";
import { gsap, SplitText, useCopy, useMotion } from "../kit";

const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#marcas", label: "Marcas" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#reserva", label: "Reserva" },
];

/** 8 · Contacto: una frase gigante. Los caracteres suben desde una máscara y el subrayado del email se dibuja. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  // estático en el servidor, actualizado tras el montaje: sin desajuste de hidratación
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  useMotion(ref, (root) => {
    const at = { trigger: root, start: "top 90%", once: true } as const;
    const h = root.querySelector<HTMLElement>("[data-cta]")!;
    const split = SplitText.create(h, { type: "lines,chars", mask: "lines" });
    const tl = gsap.timeline({ scrollTrigger: at });
    tl.from(split.chars, { yPercent: 115, duration: 0.8, stagger: 0.03, ease: "expo.out", onComplete: () => split.revert() }, 0)
      .from(root.querySelector("[data-ul]"), { scaleX: 0, duration: 0.9, ease: "expo.inOut" }, 0.7)
      .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.55);
    return () => split.revert();
  });

  return (
    <section ref={ref} id="contacto" aria-labelledby="v13-cta-h" className="v13-sec v13-dark pb-6 pt-14 sm:pt-16 lg:pt-20">
      <div className="v13-wrap">
        <h2 id="v13-cta-h" data-cta className="v13-statement">
          <span>¿Hacemos algo</span>
          <span>
            <em>bonito</em>?
          </span>
        </h2>

        <div className="mt-8 flex flex-col items-start gap-x-6 gap-y-1 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-baseline lg:mt-12">
          <button type="button" onClick={copy} className="v13-mail" aria-label={`Copiar email ${EMAIL}`}>
            {EMAIL}
            <span data-ul aria-hidden className="v13-mail__ul" />
          </button>
          <span data-in className="v13-copied min-h-[1.6em]" role="status" aria-live="polite">
            {done ? "Copiado" : ""}
          </span>
        </div>
        <p data-in className="v13-soft mt-3 max-w-[48ch] text-[17px]">
          Cuéntame tu marca y tu idea. Te respondo en menos de 24 horas.
        </p>

        <div data-in className="v13-hair-t mt-12 grid gap-y-1 pt-4 lg:mt-14 lg:grid-cols-12 lg:gap-x-8">
          <nav aria-label="Secciones" className="lg:col-span-7">
            <ul className="flex flex-wrap gap-x-6 text-[15px] text-cream">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="v13-link inline-flex min-h-11 items-center">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-x-6 text-[15px] text-cream lg:col-span-5 lg:justify-end">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="v13-link inline-flex min-h-11 items-center">
                  {s.label} <span aria-hidden className="ml-1">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div data-in className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="v13-soft text-[14px]">© {year} Steff Ramírez · Todos los derechos reservados</p>
          <a href="#top" className="v13-link inline-flex min-h-11 items-center text-[15px] text-cream">
            Volver arriba <span aria-hidden className="ml-1.5">↑</span>
          </a>
        </div>
      </div>
    </section>
  );
}
