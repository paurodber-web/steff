import { useRef } from "react";
import { services } from "../../v2/data";
import type { Img } from "../images";
import { gsap, SplitText, useMotion } from "../kit";
import { Shot } from "../parts";

const look = {
  moda: { tone: "sand", crop: "torso", tags: ["Try-on", "Reseña"] },
  belleza: { tone: "blush", crop: "face", tags: ["Rutina", "Unboxing"] },
  lifestyle: { tone: "cream", crop: "full", tags: ["Reseña", "Testimonial"] },
  momlife: { tone: "rose", crop: "torso", tags: ["Testimonial", "Hooks"] },
} as const;

export function Servicios({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const at = { start: "top 80%", once: true } as const;
    const eyebrow = root.querySelector("[data-eyebrow]");
    const h2 = root.querySelector<HTMLElement>("[data-h2]")!;
    const lead = root.querySelector("[data-lead]");
    const split = SplitText.create(h2, { type: "lines" });
    gsap.from(eyebrow, { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: h2, ...at } });
    gsap.from(split.lines, { yPercent: 60, opacity: 0, filter: "blur(8px)", duration: 0.9, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: h2, ...at } });
    gsap.from(lead, { opacity: 0, y: 14, duration: 0.7, delay: 0.25, ease: "power2.out", scrollTrigger: { trigger: h2, ...at } });

    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
    ScrollTriggerBatch(cards);
    function ScrollTriggerBatch(els: HTMLElement[]) {
      els.forEach((el, i) => {
        const col = i % 2;
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true }, delay: window.innerWidth >= 768 ? col * 0.1 : 0 });
        tl.from(el, { opacity: 0, y: 36, scale: 0.97, duration: 0.8, ease: "expo.out" })
          .from(el.querySelector("[data-clip]"), { clipPath: "inset(14% 14% 14% 14% round 20px)", duration: 0.9, ease: "expo.out" }, 0.05)
          .from(el.querySelectorAll("[data-t]"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.06, ease: "power2.out" }, 0.25);
        gsap.fromTo(el.querySelector("[data-par]"), { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
    }
    return () => split.revert();
  });

  return (
    <div className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
      <section
        ref={ref}
        id="servicios"
        aria-labelledby="v11-servicios-h"
        className="v11-panel v11-wrap scroll-mt-4 rounded-[28px] px-5 py-12 sm:rounded-[40px] sm:px-10 sm:py-16 lg:rounded-[52px] lg:px-14 lg:pb-14 lg:pt-24 xl:px-16"
      >
        <div className="grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-12">
          <header className="lg:col-span-5">
            <p data-eyebrow className="text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft">
              <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-ink/30" />
              Servicios
            </p>
            <h2 id="v11-servicios-h" data-h2 className="mt-5 font-display text-[clamp(34px,5.2vw,56px)] lg:text-[clamp(34px,3.3vw,50px)] leading-[1.04] tracking-[-0.01em] text-ink">
              <span className="lg:block lg:whitespace-nowrap">Contenido que se </span><span className="lg:block lg:whitespace-nowrap">siente <span className="italic text-oxblood">real</span> y vende</span>
            </h2>
            <p data-lead className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft sm:text-base">
              Cuatro sectores, una misma forma de contar: cercana, honesta y pensada para convertir.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:col-span-7 lg:gap-5">
            {services.map((s) => {
              const l = look[s.id];
              return (
                <li key={s.id} data-card className="v11-card group overflow-hidden rounded-[22px] sm:rounded-[28px] lg:rounded-[32px]">
                  <article className="grid grid-cols-[104px_1fr] items-stretch md:grid-cols-1">
                    <div data-clip className="relative min-h-[132px] overflow-hidden md:aspect-[16/10] md:min-h-0 lg:aspect-[2/1]">
                      <div data-par className="absolute inset-0">
                        <Shot img={portrait} item={l} sizes="(min-width: 1024px) 420px, (min-width: 768px) 40vw, 110px" className="v11-img absolute inset-0" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-4 sm:p-5 lg:p-6">
                      <div data-t className="flex items-baseline gap-3">
                        <span className="font-display text-[15px] italic leading-none text-ink-soft">{s.n}</span>
                        <h3 className="font-display text-[24px] leading-none text-ink sm:text-[28px]">{s.name}</h3>
                      </div>
                      <p data-t className="mt-2 text-[14px] leading-snug text-ink-soft sm:text-[15px]">{s.desc}</p>
                      <div data-t className="mt-3 flex flex-wrap gap-1.5">
                        {l.tags.map((t) => (
                          <span key={t} className="v11-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
