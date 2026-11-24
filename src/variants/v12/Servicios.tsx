import { useEffect, useRef, useState } from "react";
import { services } from "../../v2/data";
import { ArrowUpRight } from "../../v2/Icons";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Shot } from "../parts";
import { Band, Em, Folio, clipReveal, h2Big, headMotion, leadCls } from "./common";

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

    // desktop: rows rise in, hairlines draw, image wipes open
    const at = { trigger: root.querySelector("[data-list]"), start: "top 88%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-row]"), { opacity: 0, y: 30, duration: 0.8, stagger: 0.09, ease: "expo.out", scrollTrigger: at });
    clipReveal(root.querySelector("[data-stage]"), root.querySelector("[data-list]"), "inset(0% 0% 100% 0%)", "top 88%");

    // mobile / tablet: thumbnails wipe open, text follows
    gsap.utils.toArray<HTMLElement>("[data-item]", root).forEach((el, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true }, delay: window.innerWidth >= 768 ? (i % 2) * 0.1 : 0 });
      tl.from(el.querySelector("[data-clip]"), { clipPath: "inset(0% 100% 0% 0%)", duration: 0.9, ease: "expo.out" })
        .from(el.querySelectorAll("[data-t]"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.06, ease: "power2.out" }, 0.2);
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
        else gsap.fromTo(l, { opacity: 0, scale: 1.07 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });
      } else {
        gsap.set(l, { zIndex: 1 });
        if (calm) gsap.set(l, { opacity: 0 });
        else gsap.to(l, { opacity: 0, duration: 0.05, delay: 0.8 });
      }
    });
  }, [active]);

  return (
    <Band id="servicios" labelledBy="v12-servicios-h" innerRef={ref} tone="cream">
      <Folio n="01">Servicios</Folio>
      <header className="md:grid md:grid-cols-12 md:items-end md:gap-x-8">
        <h2 id="v12-servicios-h" data-h2 className={`${h2Big} md:col-span-8`}>
          Contenido que se siente <Em>real</Em> y vende
        </h2>
        <p data-lead className={`${leadCls} mt-5 max-w-[34ch] md:col-span-4 md:mt-0 md:pb-2 lg:justify-self-end`}>
          Cuatro sectores, una misma forma de contar: cercana, honesta y pensada para convertir.
        </p>
      </header>

      {/* desktop: numbered list + image swap, caption set under the image */}
      <div data-list className="mt-10 hidden lg:grid lg:grid-cols-12 lg:gap-x-8">
        <ul className="hair-b lg:col-span-7" aria-label="Sectores">
          {services.map((s, i) => (
            <li key={s.id} data-row className="hair-t">
              <button
                type="button"
                className="v12-svc-row"
                aria-expanded={active === i}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="v12-caps self-center text-ink-soft">{s.n}</span>
                <span className="flex min-w-0 items-center justify-between gap-6">
                  <span className="v12-svc-name font-display text-[clamp(48px,5.2vw,84px)] leading-[1.04] tracking-[-0.02em]">{s.name}</span>
                  <span aria-hidden className="v12-svc-desc hidden max-w-[22ch] text-[15px] leading-snug text-ink-soft xl:block">
                    {s.desc}
                  </span>
                </span>
                <span className="v12-svc-arrow" aria-hidden>
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <span className="sr-only">{s.desc}</span>
              </button>
            </li>
          ))}
        </ul>

        <figure className="lg:col-span-5">
          <div data-stage aria-hidden className="relative aspect-[1/1] overflow-hidden rounded-[4px] bg-[#e4d8c6]">
            {services.map((s) => (
              <div key={s.id} data-layer className="v12-svc-layer absolute inset-0">
                <Shot img={portrait} item={look[s.id]} sizes="(min-width: 1024px) 520px, 100vw" className="absolute inset-0" />
              </div>
            ))}
          </div>
          <figcaption className="mt-3 grid">
            {services.map((s, i) => (
              <p
                key={s.id}
                data-on={active === i}
                className="v12-caps text-ink-soft opacity-0 transition-opacity duration-500 [grid-area:1/1] data-[on=true]:opacity-100"
                aria-hidden={active !== i}
              >
                {s.n} {s.name} <span aria-hidden>·</span> {look[s.id].tags.join(" · ")}
              </p>
            ))}
          </figcaption>
        </figure>
      </div>

      {/* mobile / tablet: editorial rows, thumbnail + text, hairlines */}
      <ul className="hair-b mt-9 md:grid md:grid-cols-2 md:gap-x-10 lg:hidden">
        {services.map((s) => {
          const l = look[s.id];
          return (
            <li key={s.id} data-item className="hair-t">
              <article className="grid grid-cols-[104px_1fr] gap-x-5 py-5 sm:grid-cols-[132px_1fr] sm:gap-x-6">
                <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
                  <div data-par className="absolute inset-0">
                    <Shot img={portrait} item={l} sizes="(min-width: 640px) 132px, 104px" className="absolute inset-0" />
                  </div>
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p data-t className="v12-caps text-ink-soft">{s.n}</p>
                  <h3 data-t className="mt-1 font-display text-[32px] leading-[1.05] tracking-[-0.015em] text-ink sm:text-[36px]">
                    {s.name}
                  </h3>
                  <p data-t className="mt-2 text-[15.5px] leading-snug text-ink-soft">
                    {s.desc}
                  </p>
                  <p data-t className="v12-caps mt-2 text-[11px] text-ink-soft">
                    {l.tags.join(" · ")}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </Band>
  );
}
