import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useMotion } from "../kit";
import { Band, Folio, Gold, h2Mid, headMotion } from "./common";
import { testimonials } from "./data";

export function Testimonios() {
  const ref = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true);
  const first = useRef(true);
  const n = testimonials.length;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "words");
    const at = { trigger: root.querySelector("[data-stage]"), start: "top 88%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-stage] > *"), { opacity: 0, y: 28, duration: 0.9, stagger: 0.1, ease: "expo.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-sel]"), { opacity: 0, y: 16, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: root.querySelector("[data-sels]"), start: "top 95%", once: true } });
    return off;
  });

  // words of the incoming quote rise in (SplitText); skipped for reduced motion and on first paint
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = ref.current?.querySelector<HTMLElement>(`[data-q="${idx}"]`);
    if (!q) return;
    const split = SplitText.create(q, { type: "words" });
    const tw = gsap.from(split.words, { opacity: 0, y: 14, filter: "blur(6px)", duration: 0.7, stagger: 0.02, ease: "power3.out", onComplete: () => split.revert() });
    return () => {
      tw.kill();
      split.revert();
    };
  }, [idx]);

  const go = (i: number) => setIdx(((i % n) + n) % n);
  const running = !reduced && inView && !paused;

  return (
    <Band id="testimonios" labelledBy="v12-testimonios-h" innerRef={ref} tone="oxblood">
      <Folio n="05">Testimonios</Folio>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8">
        <header className="lg:col-span-4 lg:flex lg:flex-col lg:justify-between">
          <div>
            <h2 id="v12-testimonios-h" data-h2 className={h2Mid}>
              Lo que dicen las <Gold>marcas</Gold>
            </h2>
            <p data-lead className="v12-soft mt-5 max-w-[30ch] text-[16px] leading-[1.6] sm:text-[17px]">
              Palabras de quienes ya han trabajado conmigo.
            </p>
          </div>
          <p className="v12-caps v12-soft mt-8 hidden tabular-nums lg:block" aria-hidden>
            {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        </header>

        {/* TODO: sustituir por testimonios reales */}
        <div
          data-stage
          className="lg:col-span-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="grid" aria-live={running ? "off" : "polite"}>
            {testimonials.map((t, i) => (
              <figure key={t.name} data-on={idx === i} aria-hidden={idx !== i} className="v12-quote">
                <blockquote
                  data-q={i}
                  className="font-display text-[clamp(26px,6.6vw,34px)] leading-[1.22] tracking-[-0.01em] text-cream before:content-['“'] after:content-['”'] sm:text-[clamp(30px,4.4vw,40px)] lg:[text-indent:-0.42em] lg:text-[clamp(32px,3.1vw,48px)]"
                >
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 border-t border-[color:var(--v12-hair)] pt-4">
                  <span className="v12-caps block text-cream">{t.name}</span>
                  <span className="v12-soft mt-1 block text-[15px]">
                    {t.role} · {t.brand}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* autoplay progress (also drives the advance); pauses on hover / focus */}
          <div aria-hidden className="mt-8 h-px w-full overflow-hidden bg-cream/20">
            {!reduced && <div key={idx} className="v12-prog" style={{ animationPlayState: running ? "running" : "paused" }} onAnimationEnd={() => go(idx + 1)} />}
          </div>

          <div data-sels className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-0" aria-label="Elegir testimonio">
              {testimonials.map((t, i) => (
                <li key={t.name} data-sel>
                  <button type="button" aria-label={`${t.name}, ${t.brand}`} aria-current={idx === i} onClick={() => go(i)} className="v12-sel">
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => go(idx - 1)} className="v12-stepper">
                <span aria-hidden>←</span> <span className="sr-only">Testimonio</span> Anterior
              </button>
              <button type="button" onClick={() => go(idx + 1)} className="v12-stepper">
                Siguiente <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Band>
  );
}
