import { useRef } from "react";
import { socials } from "../../v2/data";
import { ArrowUpRight } from "../../v2/Icons";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Em, Eyebrow, Panel, h2Cls, headMotion } from "./common";
import { stats } from "./data";

export function SobreMi({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const off = headMotion(root);
    const frame = root.querySelector<HTMLElement>("[data-frame]")!;
    gsap.from(frame, { clipPath: "inset(0% 100% 0% 0% round 32px)", duration: 1, ease: "expo.out", scrollTrigger: { trigger: frame, start: "top 88%", once: true } });
    gsap.fromTo(root.querySelectorAll("[data-par]"), { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    const at = { trigger: root.querySelector("[data-body]"), start: "top 85%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-p]"), { opacity: 0, y: 16, duration: 0.7, stagger: 0.1, delay: 0.2, ease: "power2.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-stat]"), { opacity: 0, y: 20, duration: 0.7, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-stats]"), start: "top 95%", once: true } });
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
      const end = Number(n.dataset.count);
      const o = { v: 0 };
      n.textContent = "0";
      gsap.to(o, { v: end, duration: 1.4, ease: "power2.out", onUpdate: () => (n.textContent = String(Math.round(o.v))), scrollTrigger: { trigger: n, start: "top 95%", once: true } });
    });
    gsap.from(root.querySelectorAll("[data-soc]"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: root.querySelector("[data-socs]"), start: "top 98%", once: true } });
    return off;
  });

  return (
    <Panel id="sobre-mi" labelledBy="v11-sobre-h" innerRef={ref}>
      <div className="grid gap-9 lg:grid-cols-12 lg:items-stretch lg:gap-14">
        <div
          data-frame
          className="relative aspect-[4/4.4] overflow-hidden rounded-[22px] bg-[#d6c3a9] sm:aspect-[16/11] sm:rounded-[32px] lg:col-span-5 lg:aspect-auto lg:min-h-[480px] lg:rounded-[40px]"
        >
          <div data-par className="absolute inset-0">
            <img
              src={portrait.src}
              srcSet={portrait.srcSet}
              sizes="(min-width: 1024px) 520px, 100vw"
              alt="Retrato de Steff Ramírez, creadora de contenido UGC"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_8%] mix-blend-multiply"
            />
          </div>
        </div>

        <div data-body className="flex flex-col justify-center lg:col-span-7">
          <Eyebrow>Sobre mí</Eyebrow>
          <h2 id="v11-sobre-h" data-h2 className={h2Cls}>
            Hola, soy <Em>Steff</Em>
          </h2>
          <p data-p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink sm:text-[17px]">
            Soy creadora de contenido UGC y ayudo a marcas de moda, belleza, lifestyle y maternidad a contar su historia con videos que se sienten reales.
          </p>
          <p data-p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Grabo desde casa, con luz natural y un tono cercano y auténtico: como la recomendación de una amiga, no como un anuncio. Como mamá, sé lo que de verdad convence a tu audiencia.
          </p>

          {/* TODO: sustituir por cifras reales */}
          <dl data-stats className="mt-7 grid grid-cols-3 gap-3 border-y border-ink/10 py-5 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} data-stat>
                <dd className="font-display text-[34px] leading-none text-ink sm:text-[46px]">
                  {s.prefix && <span className="mr-0.5 font-sans text-[0.6em] text-oxblood">{s.prefix}</span>}
                  <span data-count={s.value}>{s.value}</span>
                  {s.suffix}
                </dd>
                <dt className="mt-2 text-[11px] uppercase leading-snug tracking-[0.14em] text-ink-soft sm:text-[12px]">{s.label}</dt>
              </div>
            ))}
          </dl>

          <ul data-socs className="mt-6 flex flex-wrap gap-2.5">
            {socials.map((s) => (
              <li key={s.label} data-soc>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="v11-btn v11-btn--ghost">
                  {s.label} <span className="text-ink-soft">{s.handle}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
