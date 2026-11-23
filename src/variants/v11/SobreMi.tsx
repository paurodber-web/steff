import { useRef } from "react";
import { socials } from "../../v2/data";
import { ArrowUpRight } from "../../v2/Icons";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Shot } from "../parts";
import { Em, Eyebrow, Panel, clipReveal, countUp, headMotion } from "./common";
import { stats } from "./data";

const BADGE = "UGC CREATOR · MODA · BELLEZA · LIFESTYLE · ";

export function SobreMi({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "lines");
    const frame = root.querySelector<HTMLElement>("[data-frame]")!;
    const sm = root.querySelector<HTMLElement>("[data-small]")!;
    clipReveal(frame, frame, "inset(0% 100% 0% 0% round 32px)", "top 88%");
    clipReveal(sm, frame, "inset(100% 0% 0% 0% round 24px)", "top 70%");
    gsap.from(root.querySelector("[data-badge]"), { scale: 0.3, rotate: -90, opacity: 0, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: frame, start: "top 70%", once: true } });
    // two layers, two speeds
    gsap.fromTo(root.querySelectorAll("[data-par]"), { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    gsap.fromTo(root.querySelector("[data-par2]"), { y: 36 }, { y: -36, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.8 } });

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
    <Panel id="sobre-mi" labelledBy="v11-sobre-h" innerRef={ref} tone="sand">
      <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8 lg:gap-16">
        {/* collage: portrait + overlapping crop + rotating badge */}
        <div className="relative pb-12 pr-9 sm:mx-auto sm:w-[76%] md:col-span-5 md:mx-0 md:w-auto sm:pr-14 lg:pb-14 lg:pr-16">
          <div data-frame className="relative aspect-[4/4.7] overflow-hidden rounded-[26px] bg-[#d6c3a9] sm:rounded-[32px] md:aspect-[4/5.6] lg:aspect-[4/4.7] lg:rounded-[40px]">
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

          <div data-par2 className="absolute bottom-0 right-0 z-10 w-[46%]">
            <div data-small className="relative aspect-[4/5] overflow-hidden rounded-[20px] shadow-[0_24px_40px_-24px_rgba(42,27,22,0.6)] ring-[6px] ring-[#e9dcc6] sm:rounded-[26px]">
              <div data-par className="absolute inset-0">
                <Shot img={portrait} item={{ tone: "blush", crop: "face" }} sizes="(min-width: 1024px) 240px, 40vw" className="absolute inset-0" />
              </div>
            </div>
          </div>

          <div data-badge className="absolute -left-2 top-4 z-20 md:bottom-24 md:top-auto lg:bottom-auto lg:top-4 grid h-[104px] w-[104px] place-items-center rounded-full bg-[#f8f3ea] shadow-[0_14px_30px_-14px_rgba(42,27,22,0.5)] sm:-left-4 sm:h-[124px] sm:w-[124px] md:-left-3 md:h-[100px] md:w-[100px] lg:-left-6 lg:h-[132px] lg:w-[132px]">
            <svg viewBox="0 0 120 120" className="v11-spin absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <path id="v11-badge-path" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" />
              </defs>
              <text fontSize="9.4" fontWeight="500" letterSpacing="1.2" fill="#2a1b16" style={{ fontFamily: "var(--font-sans)" }}>
                <textPath href="#v11-badge-path" textLength="268" lengthAdjust="spacing">
                  {BADGE}
                </textPath>
              </text>
            </svg>
            <span aria-hidden className="font-display text-[26px] italic leading-none text-oxblood">
              ✦
            </span>
          </div>
        </div>

        <div data-body className="flex flex-col justify-center md:col-span-7">
          <Eyebrow>Sobre mí</Eyebrow>
          <h2 id="v11-sobre-h" data-h2 className="mt-5 font-display text-[clamp(46px,12vw,68px)] leading-[0.98] tracking-[-0.02em] text-ink sm:text-[clamp(56px,9vw,84px)] md:text-[clamp(44px,6.2vw,64px)] lg:text-[clamp(64px,7.4vw,118px)]">
            Hola, soy <Em>Steff</Em>
          </h2>
          <p data-p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink sm:text-[17px]">
            Soy creadora de contenido UGC y ayudo a marcas de moda, belleza, lifestyle y maternidad a contar su historia con videos que se sienten reales.
          </p>
          <p data-p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Grabo desde casa, con luz natural y un tono cercano y auténtico: como la recomendación de una amiga, no como un anuncio. Como mamá, sé lo que de verdad convence a tu audiencia.
          </p>

          {/* TODO: sustituir por cifras reales */}
          <dl data-stats className="mt-7 grid grid-cols-3 gap-3 border-y border-ink/15 py-5 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} data-stat>
                <dd className="font-display text-[34px] leading-none text-ink sm:text-[46px] md:text-[38px] lg:text-[52px]">
                  {s.prefix && <span className="mr-0.5 italic text-oxblood">{s.prefix}</span>}
                  <span data-count={s.value}>{s.value}</span>
                  <span className="italic text-oxblood">{s.suffix}</span>
                </dd>
                <dt className="mt-2 text-[11px] uppercase leading-snug tracking-[0.14em] text-ink-soft sm:text-[12px]">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative self-start">
              <p data-sign aria-label="Firma de Steff" className="pr-4 font-display text-[60px] italic leading-[1.05] tracking-[-0.03em] text-oxblood sm:text-[72px]" style={{ transform: "rotate(-4deg)", transformOrigin: "0 80%" }}>
                <span aria-hidden>Steff</span>
              </p>
              <svg aria-hidden viewBox="0 0 160 14" className="absolute -bottom-1 left-1 h-3 w-[78%] text-oxblood" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path data-sign-line d="M2 9c26-7 62-9 100-6 18 1.4 36 3 56 1.5" />
              </svg>
            </div>
            <ul data-socs className="flex flex-wrap gap-2.5">
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
      </div>
    </Panel>
  );
}
