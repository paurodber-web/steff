import { useRef } from "react";
import type { Img } from "../images";
import { gsap, SplitText, useMotion } from "../kit";
import { Shot } from "../parts";
import { Gold, EASE } from "./common";

const Mark = ({ children }: { children: string }) => (
  <span className="v13-mark">
    {children}
    <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none" focusable="false">
      <path data-draw pathLength={1} d="M1 5.5 C 18 1.5, 34 7, 52 3.6 S 86 2.4, 99 4.6" />
    </svg>
  </span>
);

/** 6 · Sobre mí: mitad y mitad a sangre. Retrato con cortinilla desde la izquierda y zoom lento; subrayados dibujados. */
export function SobreMi({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const at = { trigger: root, start: "top 80%", once: true } as const;
    gsap.from(root.querySelector("[data-wipe]"), { clipPath: "inset(0% 100% 0% 0%)", duration: 1, ease: "expo.inOut", scrollTrigger: at });
    gsap.fromTo(root.querySelector("[data-zoom]"), { scale: 1.22 }, { scale: 1, duration: 2.2, ease: "power2.out", scrollTrigger: at });
    const h = root.querySelector<HTMLElement>("[data-h]")!;
    const s = SplitText.create(h, { type: "lines", mask: "lines" });
    gsap.from(s.lines, { yPercent: 105, duration: 0.9, stagger: 0.1, ease: EASE, delay: 0.25, onComplete: () => s.revert(), scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-in]"), { opacity: 0, y: 18, duration: 0.7, stagger: 0.09, ease: "power2.out", delay: 0.45, scrollTrigger: at });
    root.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p, i) => {
      gsap.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", delay: 0.9 + i * 0.25, scrollTrigger: at });
    });
    return () => s.revert();
  });

  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="v13-sobre-h" className="v13-sec v13-ox">
      <div className="v13-split">
        <div data-wipe className="v13-pic">
          <div data-zoom className="v13-pic__in">
            <Shot img={portrait} item={{ tone: "sand", crop: "full" }} sizes="(min-width: 768px) 50vw, 100vw" className="absolute inset-0" />
          </div>
        </div>

        <div className="v13-bio">
          <div className="v13-bio__in">
            <h2 id="v13-sobre-h" data-h className="font-display text-[clamp(48px,13vw,68px)] leading-[1.16] tracking-[-0.025em] md:text-[clamp(52px,6vw,96px)]">
              Hola, soy <Gold>Steff</Gold>
            </h2>
            {/* TODO (Steff): sustituir por tu bio real */}
            <p data-in className="mt-6 text-[17px] leading-[1.65] text-[#f4eee3] sm:text-[18px]">
              Creo contenido UGC para marcas de moda, belleza, lifestyle y maternidad. Grabo en casa con <Mark>luz natural</Mark> y cuento cada producto como se lo contaría a una amiga, con <Mark>ojo para el detalle</Mark> y sin que parezca un anuncio.
            </p>
            <p data-in className="mt-4 text-[17px] leading-[1.65] text-[#f4eee3] sm:text-[18px]">
              Contigo el proceso es fácil: brief claro, un guion aprobado antes de grabar y <Mark>entrega a tiempo</Mark>.
            </p>
            <p data-in className="v13-stats">
              <em>+3</em> años creando · <em>98%</em> entregas a tiempo · respuesta en <em>24 h</em>
            </p>
            <p data-in className="v13-sign" aria-label="Firma: Steff">
              <span aria-hidden>Steff</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
