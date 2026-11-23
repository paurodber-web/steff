import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useMotion } from "../kit";
import { Eyebrow, Gold, Panel, headMotion } from "./common";
import { testimonials } from "./data";

const initials = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

const Arrow = ({ dir }: { dir: "l" | "r" }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === "l" ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
  </svg>
);

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
    <Panel id="testimonios" labelledBy="v11-testimonios-h" innerRef={ref} tone="oxblood">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <header className="lg:col-span-4 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Eyebrow dark>Testimonios</Eyebrow>
            <h2 id="v11-testimonios-h" data-h2 className="mt-5 font-display text-[clamp(42px,11vw,68px)] leading-[0.98] tracking-[-0.02em] text-cream sm:text-[clamp(52px,9vw,80px)] lg:text-[clamp(48px,4.6vw,76px)]">
              Lo que dicen las <Gold>marcas</Gold>
            </h2>
            <p data-lead className="v11-soft mt-5 max-w-[30ch] text-[15px] leading-relaxed sm:text-base">
              Palabras de quienes ya han trabajado conmigo.
            </p>
          </div>
          <div className="mt-8 hidden items-center gap-3 lg:flex">
            <button type="button" aria-label="Testimonio anterior" onClick={() => go(idx - 1)} className="v11-circle-btn">
              <Arrow dir="l" />
            </button>
            <button type="button" aria-label="Testimonio siguiente" onClick={() => go(idx + 1)} className="v11-circle-btn">
              <Arrow dir="r" />
            </button>
            <span className="v11-soft ml-2 font-display text-[18px] italic tabular-nums" aria-hidden>
              {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
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
          <div className="relative">
            <span aria-hidden className="v11-gold block font-display text-[88px] italic leading-[0.55] sm:text-[120px]">
              “
            </span>
            <div className="grid" aria-live={running ? "off" : "polite"}>
              {testimonials.map((t, i) => (
                <figure key={t.name} data-on={idx === i} aria-hidden={idx !== i} className="v11-quote">
                  <blockquote data-q={i} className="font-display text-[clamp(23px,5.6vw,30px)] leading-[1.22] text-cream sm:text-[clamp(28px,3.6vw,36px)] lg:text-[clamp(28px,2.9vw,44px)]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#c9a87c]/60" aria-hidden />
                    <span>
                      <span className="block text-[15px] font-medium text-cream">{t.name}</span>
                      <span className="v11-soft block text-[13px]">
                        {t.role} · {t.brand}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* autoplay progress (also drives the advance); pauses on hover / focus */}
          <div aria-hidden className="mt-8 h-px w-full overflow-hidden bg-cream/15">
            {!reduced && <div key={idx} className="v11-prog" style={{ animationPlayState: running ? "running" : "paused" }} onAnimationEnd={() => go(idx + 1)} />}
          </div>

          <div data-sels className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <ul className="grid flex-1 grid-cols-4 gap-2 sm:max-w-[520px] lg:max-w-[620px]" aria-label="Elegir testimonio">
              {testimonials.map((t, i) => (
                <li key={t.name} data-sel>
                  <button type="button" aria-label={`${t.name}, ${t.brand}`} aria-current={idx === i} onClick={() => go(i)} className="v11-sel flex w-full flex-col items-center gap-2 rounded-2xl py-1 text-center">
                    <span className="v11-avatar" aria-hidden>
                      {initials(t.name)}
                    </span>
                    <span className="v11-sel-brand v11-soft text-[11px] leading-tight transition-colors sm:text-[12px]" aria-hidden>
                      {t.brand}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-3 sm:justify-end lg:hidden">
              <button type="button" aria-label="Testimonio anterior" onClick={() => go(idx - 1)} className="v11-circle-btn">
                <Arrow dir="l" />
              </button>
              <button type="button" aria-label="Testimonio siguiente" onClick={() => go(idx + 1)} className="v11-circle-btn">
                <Arrow dir="r" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
