import { useEffect, useRef, useState } from "react";
import { gsap, useMotion } from "../kit";
import { Em, Eyebrow, Panel, h2Cls, headMotion, leadCls } from "./common";
import { testimonials } from "./data";

export function Testimonios() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [idx, setIdx] = useState(0);

  useMotion(ref, (root) => {
    const off = headMotion(root);
    const list = root.querySelector<HTMLElement>("[data-list]")!;
    const at = { trigger: list, start: "top 88%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-feat-q]"), { opacity: 0, y: 24, duration: 0.9, delay: 0.15, ease: "expo.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-tcard]"), { opacity: 0, y: 34, rotate: 1.2, duration: 0.8, stagger: 0.12, ease: "expo.out", clearProps: "rotate", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-dots]"), { opacity: 0, duration: 0.6, delay: 0.5, scrollTrigger: at });
    return off;
  });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => {
      const first = el.children[0] as HTMLElement | undefined;
      if (!first) return;
      setIdx(Math.min(testimonials.length - 1, Math.max(0, Math.round(el.scrollLeft / (first.offsetWidth + 12)))));
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const c = el?.children[i] as HTMLElement | undefined;
    if (el && c) el.scrollTo({ left: c.offsetLeft - el.offsetLeft - 20, behavior: "smooth" });
  };

  return (
    <Panel id="testimonios" labelledBy="v11-testimonios-h" innerRef={ref}>
      <header>
        <Eyebrow>Testimonios</Eyebrow>
        <h2 id="v11-testimonios-h" data-h2 className={h2Cls}>
          Lo que dicen las <Em>marcas</Em>
        </h2>
        <p data-lead className={leadCls}>
          Palabras de quienes ya han trabajado conmigo.
        </p>
      </header>

      {/* TODO: sustituir por testimonios reales */}
      <div className="mt-8 lg:mt-10">
        <ul
          ref={track}
          data-list
          aria-label="Testimonios"
          tabIndex={0}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:p-0 lg:grid-cols-12 lg:gap-5"
        >
          {testimonials.map((t, i) => {
            const feat = i === 0;
            return (
              <li
                key={t.name}
                data-tcard
                className={`v11-card relative flex w-[84vw] max-w-[380px] shrink-0 snap-start flex-col justify-between rounded-[22px] p-6 sm:rounded-[28px] md:w-auto md:max-w-none lg:rounded-[32px] ${
                  feat ? "md:col-span-3 md:p-8 lg:col-span-7 lg:row-span-3 lg:p-12" : "lg:col-span-5 lg:p-5"
                }`}
              >
                <figure className="flex h-full flex-col justify-between gap-5 lg:gap-4">
                  <div>
                    <span aria-hidden className={`block font-display italic leading-[0.6] text-oxblood ${feat ? "text-[72px] md:text-[96px]" : "text-[44px] lg:text-[34px]"}`}>
                      “
                    </span>
                    <blockquote
                      {...(feat ? { "data-feat-q": true } : {})}
                      className={`font-display text-ink ${feat ? "mt-3 text-[22px] leading-[1.25] sm:text-[28px] lg:text-[clamp(26px,2.4vw,36px)]" : "mt-1 text-[18px] leading-snug lg:text-[17px]"}`}
                    >
                      {t.quote}
                    </blockquote>
                  </div>
                  <figcaption className={`flex gap-3 border-t border-ink/10 pt-4 ${feat ? "items-center justify-between" : "flex-wrap items-center justify-between md:flex-col md:items-start lg:flex-row lg:items-center"}`}>
                    <span>
                      <span className="block text-[15px] font-medium text-ink">{t.name}</span>
                      <span className="block text-[13px] text-ink-soft">{t.role}</span>
                    </span>
                    <span className="v11-tag">{t.brand}</span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
        <div data-dots className="mt-5 flex justify-center gap-2 md:hidden">
          {testimonials.map((t, i) => (
            <button key={t.name} type="button" aria-label={`Ver testimonio ${i + 1} de ${testimonials.length}`} aria-current={idx === i} onClick={() => go(i)} className="v11-dot" />
          ))}
        </div>
      </div>
    </Panel>
  );
}
