import { useRef } from "react";
import { socials } from "../../v2/data";
import { ArrowUpRight } from "../../v2/Icons";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Band, Em, Folio, clipReveal, countUp, h2Big, headMotion } from "./common";
import { stats } from "./data";

export function SobreMi({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "lines");
    const frame = root.querySelector<HTMLElement>("[data-frame]")!;
    clipReveal(frame, frame, "inset(0% 100% 0% 0%)", "top 88%");
    gsap.from(root.querySelector("[data-cap]"), { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 70%", once: true } });
    gsap.fromTo(root.querySelector("[data-par]"), { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.6 } });

    const at = { trigger: root.querySelector("[data-body]"), start: "top 85%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-p]"), { opacity: 0, y: 16, duration: 0.7, stagger: 0.1, delay: 0.2, ease: "power2.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-stat]"), { opacity: 0, y: 20, duration: 0.7, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-stats]"), start: "top 95%", once: true } });
    countUp(root, "[data-count]", "top 95%");

    // signature: clip reveal left to right, then the flourish draws
    const sign = root.querySelector("[data-sign]");
    const line = root.querySelector<SVGPathElement>("[data-sign-line]");
    const tl = gsap.timeline({ scrollTrigger: { trigger: sign, start: "top 95%", once: true } });
    tl.from(sign, { clipPath: "inset(-20% 100% -20% -5%)", duration: 1.1, ease: "power2.inOut" });
    if (line) {
      const len = line.getTotalLength();
      tl.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, 0.7);
    }
    gsap.from(root.querySelectorAll("[data-soc]"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: root.querySelector("[data-socs]"), start: "top 98%", once: true } });
    return off;
  });

  return (
    <Band id="sobre-mi" labelledBy="v12-sobre-h" innerRef={ref} tone="sand">
      <Folio n="06">Sobre mí</Folio>
      <div className="grid gap-10 md:grid-cols-12 md:gap-x-8 md:gap-y-0 lg:gap-x-8">
        {/* single clean portrait, caption set under it like a magazine */}
        <figure className="md:col-span-5 lg:col-span-5">
          <div data-frame className="relative aspect-[4/4.7] overflow-hidden rounded-[4px] bg-[#d6c3a9] md:aspect-[4/5.6] lg:aspect-[4/4.9]">
            <div data-par className="absolute inset-0">
              <img
                src={portrait.src}
                srcSet={portrait.srcSet}
                sizes="(min-width: 1024px) 520px, (min-width: 768px) 40vw, 100vw"
                alt="Retrato de Steff Ramírez, creadora de contenido UGC"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[50%_8%] mix-blend-multiply"
              />
            </div>
          </div>
          <figcaption data-cap className="v12-caps mt-3 text-[11px] text-ink-soft">
            Steff Ramírez <span aria-hidden>·</span> UGC creator <span aria-hidden>·</span> Moda, belleza, lifestyle
          </figcaption>
        </figure>

        <div data-body className="flex flex-col justify-center md:col-span-7 lg:col-span-6 lg:col-start-7">
          <h2 id="v12-sobre-h" data-h2 className={h2Big}>
            Hola, soy <Em>Steff</Em>
          </h2>
          <p data-p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink sm:text-[18px]">
            Soy creadora de contenido UGC y ayudo a marcas de moda, belleza, lifestyle y maternidad a contar su historia con videos que se sienten reales.
          </p>
          <p data-p className="mt-3 max-w-[56ch] text-[16px] leading-[1.6] text-ink-soft sm:text-[17px]">
            Grabo desde casa, con luz natural y un tono cercano y auténtico: como la recomendación de una amiga, no como un anuncio. Como mamá, sé lo que de verdad convence a tu audiencia.
          </p>

          {/* TODO: sustituir por cifras reales */}
          <dl data-stats className="hair-t mt-8 grid grid-cols-3 pt-6">
            {stats.map((s, i) => (
              <div key={s.label} data-stat className={`flex flex-col-reverse justify-end gap-2 ${i ? "border-l border-[color:var(--v12-hair)] pl-4 sm:pl-7" : ""}`}>
                <dt className="v12-caps text-[11px] leading-snug text-ink-soft sm:text-[12px]">{s.label}</dt>
                <dd className="font-display text-[clamp(36px,9.4vw,52px)] leading-none text-ink lg:text-[clamp(44px,4vw,64px)]">
                  {s.prefix && <span className="mr-0.5 italic text-oxblood">{s.prefix}</span>}
                  <span data-count={s.value}>{s.value}</span>
                  <span className="italic text-oxblood">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative self-start">
              <p data-sign aria-label="Firma de Steff" className="pr-4 font-display text-[60px] italic leading-[1.05] tracking-[-0.03em] text-oxblood sm:text-[68px]" style={{ transform: "rotate(-4deg)", transformOrigin: "0 80%" }}>
                <span aria-hidden>Steff</span>
              </p>
              <svg aria-hidden viewBox="0 0 160 14" className="absolute -bottom-1 left-1 h-3 w-[78%] text-oxblood" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path data-sign-line d="M2 9c26-7 62-9 100-6 18 1.4 36 3 56 1.5" />
              </svg>
            </div>
            <ul data-socs className="flex flex-wrap gap-x-6 gap-y-1">
              {socials.map((s) => (
                <li key={s.label} data-soc>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="v12-ul inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink">
                    {s.label} <span className="text-ink-soft">{s.handle}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Band>
  );
}
