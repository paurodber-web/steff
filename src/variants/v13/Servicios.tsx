import { useRef } from "react";
import { services } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Shot } from "../parts";
import { sectorFormats, sectorLook } from "./data";
import { Em, EASE } from "./common";

/** 1 · Servicios: galería editorial abierta, los 4 sectores siempre visibles. Entrada con clip-path + parallax suave por columna. */
export function Servicios({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-h]"), { opacity: 0, y: 22, duration: 0.8, ease: EASE, scrollTrigger: { trigger: root, start: "top 85%", once: true } });
    gsap.from(root.querySelectorAll("[data-pic]"), {
      clipPath: "inset(100% 0% 0% 0%)",
      duration: 0.9,
      stagger: 0.1,
      ease: EASE,
      clearProps: "clipPath",
      scrollTrigger: { trigger: root.querySelector("[data-gal]"), start: "top 85%", once: true },
    });
    // Parallax sutil, velocidad distinta por columna (sin pin).
    const speeds = [-4, 6, -2, 8];
    root.querySelectorAll<HTMLElement>("[data-par]").forEach((el, i) => {
      gsap.fromTo(el, { yPercent: -speeds[i % 4] }, { yPercent: speeds[i % 4], ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  return (
    <section ref={ref} id="servicios" aria-labelledby="v13-servicios-h" className="v13-sec v13-cream py-14 sm:py-16 lg:py-20">
      <div className="v13-wrap">
        <header data-h className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 lg:mb-12">
          <h2 id="v13-servicios-h" className="font-display text-[clamp(40px,10.4vw,56px)] leading-[1.04] tracking-[-0.022em] sm:text-[clamp(48px,7.4vw,64px)] lg:whitespace-nowrap lg:text-[clamp(56px,5.2vw,80px)]">
            Cuatro sectores, <Em>una</Em> voz
          </h2>
          <p className="max-w-[34ch] pb-1 text-[15px] text-ink-soft lg:text-[16px]">Contenido pensado para cada tipo de marca, con el mismo tono cercano y honesto.</p>
        </header>

        <ul data-gal className="v13-gal" aria-label="Sectores">
          {services.map((s) => (
            <li key={s.id} className="v13-gi">
              <div aria-hidden className="v13-gi__img" data-pic>
                <div data-par className="absolute inset-[-8%]">
                  <Shot img={portrait} item={sectorLook[s.id]} sizes="(min-width: 700px) 330px, 50vw" className="absolute inset-0" />
                </div>
              </div>
              <div className="v13-gi__head">
                <span className="v13-gi__n">{s.n}</span>
                <h3 className="v13-gi__name font-display">{s.name}</h3>
              </div>
              <p className="v13-gi__desc">{s.desc}</p>
              <p className="v13-gi__fmt">{sectorFormats[s.id].join(" · ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
