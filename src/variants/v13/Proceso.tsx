import { useRef } from "react";
import { gsap, SplitText, useMotion } from "../kit";
import { proceso } from "./data";

/** 2 · Cómo funciono: una sola frase editorial que se rellena palabra a palabra con el scroll (sin pin). */
export function Proceso() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const p = root.querySelector<HTMLElement>("[data-sentence]")!;
    const split = SplitText.create(p, { type: "words" });
    gsap.fromTo(
      split.words,
      { opacity: 0.2 },
      { opacity: 1, ease: "none", duration: 1, stagger: 0.12, scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 50%", scrub: 0.5 } },
    );
    gsap.from(root.querySelectorAll("[data-step]"), {
      opacity: 0,
      y: 22,
      duration: 0.7,
      stagger: 0.08,
      ease: "expo.out",
      scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 92%", once: true },
    });
    return () => split.revert();
  });

  return (
    <section ref={ref} id="proceso" aria-labelledby="v13-proceso-h" className="v13-sec v13-dark py-16 sm:py-20 lg:py-24">
      <div className="v13-wrap">
        <h2 id="v13-proceso-h" className="v13-caps v13-soft mb-6 lg:mb-8">
          Cómo funciono
        </h2>
        <p data-sentence className="v13-sentence font-display">
          Me cuentas tu idea, <em>escribo</em> el guion, <em>grabo</em> con luz natural, <em>edito</em> para el scroll y te <em>entrego</em> en 5–7 días.
        </p>
        <ol data-steps className="v13-steps">
          {proceso.map((s) => (
            <li key={s.n} data-step className="v13-step">
              <span className="v13-step__n">{s.n}</span>
              <p className="v13-step__t">{s.title}</p>
              <p className="v13-step__w">{s.when}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
