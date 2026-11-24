import { useRef, useState } from "react";
import { services } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Shot } from "../parts";
import { sectorFormats, sectorLook } from "./data";
import { Em, EASE } from "./common";

/** 1 · Servicios: tiras altas que se expanden. Entrada: las tiras suben con clip-path escalonado. */
export function Servicios({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-h]"), { opacity: 0, y: 22, duration: 0.8, ease: EASE, scrollTrigger: { trigger: root, start: "top 85%", once: true } });
    gsap.from(root.querySelectorAll("[data-strip]"), {
      clipPath: "inset(100% 0% 0% 0%)",
      y: 36,
      duration: 0.9,
      stagger: 0.1,
      ease: EASE,
      clearProps: "clipPath,transform",
      scrollTrigger: { trigger: root.querySelector("[data-strips]"), start: "top 85%", once: true },
    });
  });

  return (
    <section ref={ref} id="servicios" aria-labelledby="v13-servicios-h" className="v13-sec v13-cream py-14 sm:py-16 lg:py-20">
      <div className="v13-wrap">
        <header data-h className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 lg:mb-9">
          <h2 id="v13-servicios-h" className="font-display text-[clamp(40px,10.4vw,56px)] leading-[1.04] tracking-[-0.022em] sm:text-[clamp(48px,7.4vw,64px)] lg:whitespace-nowrap lg:text-[clamp(56px,5.2vw,80px)]">
            Cuatro sectores, <Em>una</Em> voz
          </h2>
          <p className="v13-caps pb-2 text-ink-soft">
            <span className="sm:hidden">Toca un sector</span>
            <span className="hidden sm:inline">Elige un sector</span>
          </p>
        </header>

        <ul data-strips className="v13-strips" aria-label="Sectores">
          {services.map((s, i) => {
            const on = active === i;
            const look = sectorLook[s.id];
            return (
              <li key={s.id} data-strip data-active={on} className="v13-strip">
                <div aria-hidden className="v13-strip__img">
                  <Shot img={portrait} item={look} sizes="(min-width: 1024px) 760px, 100vw" className="absolute inset-0" />
                </div>
                <span aria-hidden className="v13-strip__veil" />
                <span aria-hidden className="v13-strip__grad" />
                <button
                  type="button"
                  className="v13-strip__btn"
                  aria-expanded={on}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                >
                  <span className="v13-strip__num" aria-hidden>
                    {s.n}
                  </span>
                  <span className="v13-strip__vname" aria-hidden={on}>
                    {s.name}
                  </span>
                  <span className="v13-strip__foot" aria-hidden={!on}>
                    <span className="v13-strip__fmt" style={{ marginBottom: 8 }}>
                      {s.n}
                    </span>
                    <span className="v13-strip__title">{s.name}</span>
                    <span className="v13-strip__desc">{s.desc}</span>
                    <span className="v13-strip__fmt">{sectorFormats[s.id].join(" · ")}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
