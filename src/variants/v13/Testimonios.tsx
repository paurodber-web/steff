import { useRef } from "react";
import { gsap, SplitText, useMotion } from "../kit";
import { testimonials as T } from "./data";
import { EASE } from "./common";


/** 5 · Testimonios: columnas de periódico. Revelado línea a línea con máscara y filetes que se dibujan. */
export function Testimonios() {
  const ref = useRef<HTMLElement>(null);
  const [lead, ...rest] = T;

  useMotion(ref, (root) => {
    const splits: SplitText[] = [];
    root.querySelectorAll<HTMLElement>("[data-q]").forEach((q, i) => {
      const s = SplitText.create(q, { type: "lines", mask: "lines" });
      splits.push(s);
      gsap.from(s.lines, {
        yPercent: 105,
        duration: 0.85,
        stagger: 0.09,
        ease: EASE,
        delay: i === 0 ? 0 : 0.15 + i * 0.1,
        onComplete: () => s.revert(),
        scrollTrigger: { trigger: q, start: "top 88%", once: true },
      });
      const by = q.closest("[data-qwrap]")?.querySelector("[data-by]");
      if (by) gsap.from(by, { opacity: 0, y: 12, duration: 0.7, delay: 0.5 + i * 0.1, ease: "power2.out", scrollTrigger: { trigger: q, start: "top 88%", once: true } });
    });
    const at = { trigger: root.querySelector("[data-spread]"), start: "top 85%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-vrule]"), { scaleY: 0, duration: 1.1, ease: EASE, scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-mast]"), { opacity: 0, y: 14, duration: 0.7, ease: "power2.out", scrollTrigger: at });
    return () => splits.forEach((s) => s.revert());
  });

  return (
    <section ref={ref} id="testimonios" aria-labelledby="v13-testi-h" className="v13-sec v13-sand py-14 sm:py-16 lg:py-20">
      <div className="v13-wrap">
        <div data-mast className="v13-masthead">
          <h2 id="v13-testi-h" className="font-display italic">
            Lo que dicen
          </h2>
        </div>

        <div data-spread className="v13-spread">
          <figure data-qwrap className="v13-q v13-q--lead m-0">
            <div className="v13-lead">
              <span aria-hidden className="v13-cap-letter">
                {lead.quote.charAt(0)}
              </span>
              <blockquote className="m-0">
                <span className="sr-only">{lead.quote}</span>
                <p aria-hidden data-q className="v13-quote v13-quote--lead">
                  {lead.quote.slice(1)}
                </p>
              </blockquote>
            </div>
            <figcaption data-by className="v13-by" style={{ marginTop: 22 }}>
              <b>{lead.name}</b>
              {lead.role}, {lead.brand}
            </figcaption>
          </figure>

          <div className="v13-side">
            <span aria-hidden data-vrule className="v13-vrule" />
            {rest.map((t) => (
              <figure key={t.name} data-qwrap className="v13-q m-0">
                <blockquote className="m-0">
                  <p data-q className="v13-quote">
                    {t.quote}
                  </p>
                </blockquote>
                <figcaption data-by className="v13-by">
                  <b>{t.name}</b>
                  {t.role}, {t.brand}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
