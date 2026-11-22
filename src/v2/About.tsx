import { memo, useRef } from "react";
import type { HeroImage } from "./Hero";
import { useSectionAnim, gsap } from "./anim";

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]";

const lines = [
  "Soy Steff. Creo contenido que se siente como la recomendación de una amiga, no como un anuncio.",
  "Moda, belleza y el día a día de una mamá real, grabado con cuidado y mucha cercanía.",
];

const facts = [
  { k: "Contenido", v: "en español" },
  { k: "Grabado", v: "con luz natural" },
  { k: "Formato", v: "vertical 9:16" },
];

/** Circular label that turns with the scroll. */
function Badge() {
  const text = "UGC Creator · Moda · Belleza · Lifestyle · Momlife · ";
  return (
    <div aria-hidden className="absolute -right-3 top-[8%] z-20 grid h-[124px] w-[124px] place-items-center rounded-full bg-ink text-cream shadow-[0_20px_40px_-20px_rgba(42,27,22,0.6)] sm:-right-8 sm:h-[148px] sm:w-[148px]">
      <svg data-badge viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="about-badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text className="fill-current text-[10.6px] font-medium uppercase tracking-[0.2em]">
          <textPath href="#about-badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="font-display text-[30px] italic leading-none">S</span>
    </div>
  );
}

export const About = memo(function About({ image }: { image: HeroImage }) {
  const ref = useRef<HTMLElement>(null);

  useSectionAnim(ref, (root, mm) => {
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const text = root.querySelector("[data-words]");
      if (text) {
        // words warm up as they reach the middle of the screen; done well before the text leaves
        gsap.fromTo(
          root.querySelectorAll("[data-word]"),
          { opacity: 0.18 },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: text, start: "top 88%", end: "bottom 78%", scrub: 0.4 } },
        );
      }
      const arch = root.querySelector("[data-arch]");
      const img = root.querySelector("[data-photo]");
      if (arch && img) {
        gsap.fromTo(
          img,
          { yPercent: 6, scale: 1.06 },
          { yPercent: -2, scale: 1, ease: "none", scrollTrigger: { trigger: arch, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      }
      const badge = root.querySelector("[data-badge]");
      if (badge) {
        gsap.fromTo(badge, { rotate: -40 }, { rotate: 200, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 } });
      }
      gsap.from(root.querySelectorAll("[data-fact]"), {
        opacity: 0,
        y: -16,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.querySelector("[data-facts]"), start: "top 92%", once: true },
      });
    });
  });

  return (
    <section
      ref={ref}
      id="sobre-mi"
      data-scene="#f4eee3"
      aria-labelledby="sobre-mi-title"
      className="scroll-mt-4 overflow-x-clip py-[clamp(96px,12vw,170px)]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          <div data-arch className="relative mx-auto w-full max-w-[400px] lg:col-span-5 lg:mx-0 lg:max-w-none">
            <div
              data-clip
              className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-b-0 border-ink/10 lg:aspect-[3/4]"
              style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}
            >
              <div data-media className="absolute inset-0">
                <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(closest-side at 50% 70%, rgba(255,247,235,0.65), rgba(255,247,235,0))" }} />
                <img
                  data-photo
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="(min-width: 1024px) 460px, 400px"
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
            <Badge />
          </div>

          <div className="lg:col-span-7">
            <p data-fade className={eyebrow}>
              Sobre mí
            </p>
            <h2 id="sobre-mi-title" className="sr-only">
              Sobre Steff
            </h2>
            <div data-words className="mt-6 space-y-6 font-display text-[clamp(28px,4.2vw,50px)] font-normal leading-[1.14] tracking-[-0.01em] text-ink">
              {lines.map((l, li) => (
                <p key={li}>
                  {l.split(" ").map((w, i) => (
                    <span key={i}>
                      <span data-word className={w.startsWith("real") || w.startsWith("amiga") ? "inline-block italic" : "inline-block"}>
                        {w}
                      </span>{" "}
                    </span>
                  ))}
                </p>
              ))}
            </div>
            <p data-fade className="mt-8 font-display text-[24px] italic text-ink-soft">
              — Steff
            </p>

            <dl data-facts className="mt-12 grid grid-cols-3 border-t border-ink/15">
              {facts.map((f, i) => (
                <div key={f.k} data-fact className={i > 0 ? "border-l border-ink/15 pl-4 pt-5 sm:pl-6" : "pr-4 pt-5"}>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:text-[11px]">{f.k}</dt>
                  <dd className="mt-2 font-display text-[clamp(17px,1.8vw,22px)] leading-tight text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
});
