import { memo, useRef } from "react";
import type { HeroImage } from "./Hero";
import { useSectionAnim, gsap } from "./anim";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]";

const lines = [
  "Soy Steff. Creo contenido que se siente como la recomendación de una amiga, no como un anuncio.",
  "Moda, belleza y el día a día de una mamá real, grabado con cuidado y mucha cercanía.",
];

export const About = memo(function About({ image }: { image: HeroImage }) {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = root.querySelectorAll("[data-word]");
      const text = root.querySelector("[data-words]");
      if (text) {
        gsap.fromTo(
          words,
          { opacity: 0.15 },
          { opacity: 1, ease: "none", stagger: 0.12, scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 55%", scrub: 0.5 } },
        );
      }
      const img = root.querySelector("[data-photo]");
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: 4, scale: 1.04 },
          { yPercent: -3, scale: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-arch]"), start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      }
    });
  });

  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="sobre-mi-title" className="scroll-mt-4 overflow-x-clip pb-[clamp(96px,14vw,200px)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-y-12 lg:grid-cols-12 lg:gap-x-8">
          <div data-arch className="relative mx-auto w-full max-w-[380px] lg:col-span-5 lg:mx-0 lg:max-w-[460px]">
            <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-b-0 border-ink/10 lg:aspect-[3/4]" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
              <div data-media className="absolute inset-0">
                <div aria-hidden className="absolute inset-x-0 bottom-0 top-0" style={{ background: "radial-gradient(closest-side at 50% 70%, rgba(255,247,235,0.65), rgba(255,247,235,0))" }} />
                <img
                  data-photo
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="(min-width: 1024px) 460px, 380px"
                  width={image.width}
                  height={image.height}
                  alt="Steff Ramírez sonriendo, con blazer crema"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-x-0 bottom-0 mx-auto h-[104%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_26px_34px_rgba(70,45,30,0.2)]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pb-6">
            <p data-fade className={eyebrow}>
              Sobre mí
            </p>
            <h2 id="sobre-mi-title" className="sr-only">
              Sobre Steff
            </h2>
            <div data-words className="mt-6 space-y-6 font-display text-[clamp(26px,4.2vw,46px)] font-normal leading-[1.18] tracking-[-0.01em] text-ink">
              {lines.map((l, li) => (
                <p key={li}>
                  {l.split(" ").map((w, i) => (
                    <span key={i}>
                      <span data-word className="inline-block">{w}</span>{" "}
                    </span>
                  ))}
                </p>
              ))}
            </div>
            <p data-fade className="mt-8 font-display text-[22px] italic text-ink-soft">
              - Steff
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});
