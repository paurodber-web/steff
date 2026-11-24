import { useRef } from "react";
import { brands } from "../../v2/data";
import { gsap, useMotion } from "../kit";
import { figures } from "./data";
import { Em, EASE } from "./common";

const fmt = (v: number, dec: number) => v.toFixed(dec).replace(".", ",");

/** 4 · Marcas: índice tipográfico. Los nombres se descifran (ScrambleText) y las cifras cuentan hacia arriba. */
export function Marcas() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-h]"), { opacity: 0, y: 24, duration: 0.8, ease: EASE, scrollTrigger: { trigger: root, start: "top 85%", once: true } });

    const names = Array.from(root.querySelectorAll<HTMLElement>("[data-scr]"));
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector("[data-grid]"), start: "top 88%", once: true } });
    names.forEach((el, i) => {
      tl.to(el, { duration: 0.9, scrambleText: { text: el.dataset.t ?? "", chars: "abcdefghijklmnopqrstuvwxyz", speed: 0.8, revealDelay: 0.12 } }, 0.05 + i * 0.07);
    });

    root.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
      const end = Number(n.dataset.count);
      const dec = Number(n.dataset.dec ?? 0);
      const o = { v: 0 };
      n.textContent = fmt(0, dec);
      gsap.to(o, { v: end, duration: 1.4, ease: "power2.out", onUpdate: () => (n.textContent = fmt(o.v, dec)), scrollTrigger: { trigger: n, start: "top 95%", once: true } });
    });
  });

  return (
    <section ref={ref} id="marcas" aria-labelledby="v13-marcas-h" className="v13-sec v13-paper py-14 sm:py-16 lg:py-20">
      <div className="v13-wrap">
        <h2 data-h id="v13-marcas-h" className="mb-9 max-w-[16ch] font-display text-[clamp(38px,10vw,54px)] leading-[1.06] tracking-[-0.022em] text-balance sm:max-w-[22ch] sm:text-[clamp(44px,6.6vw,60px)] lg:mb-12 lg:max-w-[26ch] lg:text-[clamp(52px,4.4vw,68px)]">
          Marcas que ya <Em>confiaron</Em> en mi forma de contar
        </h2>

        <ul data-grid className="v13-brands">
          {brands.map((b, i) => (
            <li key={b} data-brand className="v13-brand">
              <span aria-hidden className="v13-brand__i">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sr-only">{b}</span>
              <span aria-hidden data-scr data-t={b} className="v13-brand__n">
                {b}
              </span>
            </li>
          ))}
        </ul>

        <ul className="v13-figs">
          {figures.map((f) => (
            <li key={f.label} className="v13-fig">
              <span className="v13-fig__v">
                {f.prefix}
                <span data-count={f.value} data-dec={f.dec}>
                  {fmt(f.value, f.dec)}
                </span>
                {f.suffix}
              </span>
              <span className="v13-fig__l">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
