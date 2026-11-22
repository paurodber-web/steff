import { memo, useRef } from "react";
import type { HeroImage } from "./Hero";
import { useSectionAnim, gsap } from "./anim";

const lines = [
  [{ t: "Soy Steff. Creo contenido que se siente como la recomendación de una " }, { t: "amiga", em: true }, { t: ", no como un anuncio." }],
  [{ t: "Moda, belleza y el día a día de una mamá " }, { t: "real", em: true }, { t: ", grabado con cuidado y mucha cercanía." }],
];

const facts = [
  { k: "Idioma", v: "Español" },
  { k: "Luz", v: "Natural" },
  { k: "Formato", v: "9:16" },
];

function Badge() {
  const text = "UGC Creator · Moda · Belleza · Lifestyle · Momlife · ";
  return (
    <div aria-hidden className="absolute -left-4 bottom-[12%] z-20 grid h-[120px] w-[120px] place-items-center rounded-full bg-oxblood text-cream shadow-[0_24px_50px_-24px_rgba(63,16,20,0.8)] sm:-left-10 sm:h-[150px] sm:w-[150px]">
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
      const arch = root.querySelector<HTMLElement>("[data-arch]");
      const img = root.querySelector("[data-photo]");
      if (arch && img) {
        // the arch opens from a narrow keyhole to the full portrait
        gsap.fromTo(
          arch,
          { clipPath: "inset(22% 24% 0% 24% round 999px 999px 0px 0px)" },
          { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)", ease: "none", scrollTrigger: { trigger: arch, start: "top 95%", end: "center 55%", scrub: 0.6 } },
        );
        gsap.fromTo(img, { scale: 1.3, yPercent: 6 }, { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: arch, start: "top bottom", end: "bottom 40%", scrub: 0.6 } });
      }
      const name = root.querySelector("[data-name]");
      if (name) gsap.fromTo(name, { xPercent: 8 }, { xPercent: -14, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 } });
      const badge = root.querySelector("[data-badge]");
      if (badge) gsap.fromTo(badge, { rotate: -60 }, { rotate: 240, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 } });
      const words = root.querySelectorAll("[data-word]");
      gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: root.querySelector("[data-words]"), start: "top 85%", end: "bottom 70%", scrub: 0.4 } });
      const sig = root.querySelector<SVGTextElement>("[data-sig]");
      if (sig) {
        gsap.fromTo(
          sig,
          { strokeDashoffset: 520, fillOpacity: 0 },
          { strokeDashoffset: 0, fillOpacity: 1, duration: 2.4, ease: "power2.inOut", scrollTrigger: { trigger: sig, start: "top 90%", once: true } },
        );
      }
      gsap.from(root.querySelectorAll("[data-fact]"), { opacity: 0, y: -16, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.querySelector("[data-facts]"), start: "top 92%", once: true } });
    });
  });

  return (
    <section
      ref={ref}
      id="sobre-mi"
      data-folio="Nº 05 — Quién graba"
      data-scene="#f4eee3"
      aria-labelledby="sobre-mi-title"
      className="relative isolate scroll-mt-0 overflow-x-clip py-[clamp(112px,15vw,220px)]"
    >
      {/* surname, huge and outlined, drifting behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[clamp(40px,6vw,90px)] -z-10 overflow-hidden">
        <span data-name className="v2-outline block whitespace-nowrap font-display text-[clamp(150px,30vw,520px)] italic leading-[0.8] tracking-[-0.04em]">
          Ramírez
        </span>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-y-16 lg:grid-cols-12 lg:gap-x-10">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p data-fade className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft">
              Nº 05 — Quién graba
            </p>
            <h2 id="sobre-mi-title" className="sr-only">
              Sobre Steff
            </h2>
            <div data-words className="mt-8 space-y-7 font-display text-[clamp(28px,3.4vw,50px)] leading-[1.12] tracking-[-0.015em] text-ink">
              {lines.map((parts, li) => (
                <p key={li}>
                  {parts.flatMap((p, pi) =>
                    p.t
                      .split(/(\s+)/)
                      .filter((w) => w !== "")
                      .map((w, wi) =>
                        /^\s+$/.test(w) ? (
                          " "
                        ) : (
                          <span key={`${pi}-${wi}`} data-word className={p.em ? "inline-block italic text-oxblood" : "inline-block"}>
                            {w}
                          </span>
                        ),
                      ),
                  )}
                </p>
              ))}
            </div>

            <svg aria-hidden viewBox="0 0 260 90" className="mt-8 h-[72px] w-auto text-oxblood">
              <text
                data-sig
                x="4"
                y="70"
                className="font-display italic"
                style={{ fontSize: 76, fill: "currentColor", stroke: "currentColor", strokeWidth: 0.8, strokeDasharray: 520 }}
              >
                Steff
              </text>
            </svg>

            <dl data-facts className="mt-10 grid max-w-[34rem] grid-cols-3 border-t border-ink/15">
              {facts.map((f, i) => (
                <div key={f.k} data-fact className={i > 0 ? "border-l border-ink/15 pl-5 pt-5" : "pr-5 pt-5"}>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.24em] text-ink-soft">{f.k}</dt>
                  <dd className="mt-2 font-display text-[clamp(22px,2.2vw,30px)] leading-none text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-[440px] lg:order-2 lg:col-span-5 lg:col-start-8 lg:max-w-none">
            <div
              data-arch
              className="relative aspect-[3/4] overflow-hidden rounded-t-full"
              style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}
            >
              <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(closest-side at 50% 60%, rgba(255,247,235,0.7), rgba(255,247,235,0))" }} />
              <img
                data-photo
                src={image.src}
                srcSet={image.srcSet}
                sizes="(min-width: 1024px) 480px, 440px"
                width={image.width}
                height={image.height}
                alt="Steff Ramírez sonriendo, con blazer crema"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full origin-top object-cover object-top mix-blend-multiply"
              />
            </div>
            <Badge />
          </div>
        </div>
      </div>
    </section>
  );
});
