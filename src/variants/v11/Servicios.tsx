import { useEffect, useRef, useState } from "react";
import { services } from "../../v2/data";
import { ArrowUpRight } from "../../v2/Icons";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Shot } from "../parts";
import { Em, Eyebrow, Panel, clipReveal, h2Big, headMotion } from "./common";

const look = {
  moda: { tone: "sand", crop: "torso", tags: ["Try-on", "Reseña"] },
  belleza: { tone: "blush", crop: "face", tags: ["Rutina", "Unboxing"] },
  lifestyle: { tone: "cream", crop: "full", tags: ["Reseña", "Testimonial"] },
  momlife: { tone: "rose", crop: "torso", tags: ["Testimonial", "Hooks"] },
} as const;

export function Servicios({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const mounted = useRef(false);

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 80%", "mask");

    // desktop list + image
    gsap.from(root.querySelectorAll("[data-row]"), { opacity: 0, y: 34, duration: 0.8, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-list]"), start: "top 88%", once: true } });
    clipReveal(root.querySelector("[data-stage]"), root.querySelector("[data-list]"), "inset(8% 8% 8% 8% round 40px)", "top 88%");

    // mobile / tablet cards
    gsap.utils.toArray<HTMLElement>("[data-card]", root).forEach((el, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true }, delay: window.innerWidth >= 768 ? (i % 2) * 0.1 : 0 });
      tl.from(el, { opacity: 0, y: 36, duration: 0.8, ease: "expo.out" })
        .from(el.querySelector("[data-clip]"), { clipPath: "inset(14% 14% 14% 14% round 20px)", duration: 0.9, ease: "expo.out" }, 0.05)
        .from(el.querySelector("[data-num]"), { scale: 0.4, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.3)
        .from(el.querySelectorAll("[data-t]"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.06, ease: "power2.out" }, 0.3);
      gsap.fromTo(el.querySelector("[data-par]"), { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    });
    return off;
  });

  // crossfade + slight scale on the big image whenever the active row changes
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const layers = root.querySelectorAll<HTMLElement>("[data-layer]");
    const calm = !mounted.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mounted.current = true;
    layers.forEach((l, i) => {
      gsap.killTweensOf(l);
      if (i === active) {
        gsap.set(l, { zIndex: 2 });
        if (calm) gsap.set(l, { opacity: 1, scale: 1 });
        else gsap.fromTo(l, { opacity: 0, scale: 1.09 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });
      } else {
        gsap.set(l, { zIndex: 1 });
        if (calm) gsap.set(l, { opacity: 0 });
        else gsap.to(l, { opacity: 0, duration: 0.05, delay: 0.8 });
      }
    });
  }, [active]);

  return (
    <Panel id="servicios" labelledBy="v11-servicios-h" innerRef={ref} className="lg:!pt-20">
      <header className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <Eyebrow>Servicios</Eyebrow>
          <h2 id="v11-servicios-h" data-h2 className={`${h2Big} text-ink`}>
            <span className="lg:block lg:whitespace-nowrap">Contenido que se </span>
            <span className="lg:block lg:whitespace-nowrap">
              siente <Em>real</Em> y vende
            </span>
          </h2>
        </div>
        <p data-lead className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft sm:text-base lg:col-span-4 lg:mt-0 lg:pb-3 lg:justify-self-end">
          Cuatro sectores, una misma forma de contar: cercana, honesta y pensada para convertir.
        </p>
      </header>

      {/* desktop: editorial list + image swap */}
      <div data-list className="mt-10 hidden items-stretch gap-10 lg:grid lg:grid-cols-12 xl:gap-14">
        <ul className="border-b border-ink/15 lg:col-span-7" aria-label="Sectores">
          {services.map((s, i) => (
            <li key={s.id} data-row className="border-t border-ink/15">
              <button
                type="button"
                className="v11-svc-row"
                aria-expanded={active === i}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="self-center font-display text-[15px] italic text-ink-soft">{s.n}</span>
                <span className="flex min-w-0 items-center justify-between gap-6">
                  <span className="v11-svc-name font-display text-[clamp(52px,5.6vw,92px)] leading-[1.02] tracking-[-0.015em]">{s.name}</span>
                  <span aria-hidden className="v11-svc-desc hidden max-w-[22ch] text-[14px] leading-snug text-ink-soft xl:block">
                    {s.desc}
                  </span>
                </span>
                <span className="v11-svc-arrow" aria-hidden>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <span className="sr-only">{s.desc}</span>
              </button>
            </li>
          ))}
        </ul>

        <div data-stage aria-hidden className="relative min-h-[460px] overflow-hidden rounded-[40px] bg-[#e4d8c6] lg:col-span-5">
          {services.map((s) => (
            <div key={s.id} data-layer className="v11-svc-layer absolute inset-0">
              <Shot img={portrait} item={look[s.id]} sizes="(min-width: 1024px) 520px, 100vw" className="absolute inset-0" />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-ink/55 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 z-10 grid">
            {services.map((s, i) => (
              <div
                key={s.id}
                data-on={active === i}
                className="flex items-end justify-between gap-4 rounded-[24px] bg-cream/90 p-5 opacity-0 backdrop-blur-md transition-opacity duration-500 [grid-area:1/1] data-[on=true]:opacity-100"
              >
                <div>
                  <p className="font-display text-[26px] leading-none text-ink">{s.name}</p>
                  <p className="mt-2 max-w-[26ch] text-[14px] leading-snug text-ink-soft">{s.desc}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {look[s.id].tags.map((t) => (
                    <span key={t} className="v11-tag bg-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* mobile / tablet: refined cards */}
      <ul className="mt-9 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:hidden">
        {services.map((s) => {
          const l = look[s.id];
          return (
            <li key={s.id} data-card className="v11-card overflow-hidden rounded-[26px] sm:rounded-[32px]">
              <article>
                <div data-clip className="relative aspect-[16/11] overflow-hidden md:aspect-[4/3]">
                  <div data-par className="absolute inset-0">
                    <Shot img={portrait} item={l} sizes="(min-width: 768px) 40vw, 92vw" className="absolute inset-0" />
                  </div>
                </div>
                <div className="relative px-5 pb-6 pt-10 sm:px-7">
                  <span
                    data-num
                    className="absolute -top-8 left-5 grid h-16 w-16 place-items-center rounded-full bg-oxblood font-display text-[22px] italic text-cream ring-[6px] ring-[#fbf8f2] sm:left-7"
                  >
                    {s.n}
                  </span>
                  <h3 data-t className="font-display text-[34px] leading-none text-ink sm:text-[38px]">
                    {s.name}
                  </h3>
                  <p data-t className="mt-2.5 text-[15px] leading-snug text-ink-soft">
                    {s.desc}
                  </p>
                  <div data-t className="mt-4 flex flex-wrap gap-1.5">
                    {l.tags.map((t) => (
                      <span key={t} className="v11-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
