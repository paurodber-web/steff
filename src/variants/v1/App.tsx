import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, SplitText, useMotion, useCopy, useFinePointer } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";

type P = { hero: Img; portrait: Img };

const tone: Record<string, string> = {
  cream: "#ece3d4",
  sand: "#d9c6aa",
  blush: "#e6cfc2",
  hero: "#d6c3a9",
  rose: "#c4a096",
  oxblood: "#5c1a1f",
};
const crop: Record<string, CSSProperties> = {
  face: { objectPosition: "50% 0%", transform: "scale(2.1)", transformOrigin: "50% 18%" },
  torso: { objectPosition: "50% 0%", transform: "scale(1.35)", transformOrigin: "50% 28%" },
  full: { objectPosition: "50% 0%" },
};

function Photo({ img, item, sizes, className }: { img: Img; item: Pick<VideoItem, "tone" | "crop">; sizes: string; className?: string }) {
  const dark = item.tone === "oxblood";
  return (
    <div className={`overflow-hidden ${className ?? "relative"}`} style={{ background: tone[item.tone] }}>
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes={sizes}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        data-img
        className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
        style={{ ...crop[item.crop], filter: dark ? "grayscale(1) contrast(1.1) brightness(1.2)" : "saturate(0.85)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ COLLECTION (horizontal runway) */
function Collection({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const all = services.flatMap((s) => portfolio[s.id].map((item, k) => ({ s, item, k })));

  useMotion(ref, (root) => {
    const intro = new SplitText(root.querySelector("[data-lines]")!, { type: "lines", mask: "lines" });
    gsap.from(intro.lines, { yPercent: 105, duration: 1.4, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root, start: "top 70%", once: true } });

    const track = root.querySelector<HTMLElement>("[data-track]")!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const dist = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: root.querySelector("[data-pin]"), start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      // every frame opens from the centre as it enters the runway
      track.querySelectorAll<HTMLElement>("[data-frame]").forEach((f) => {
        gsap.fromTo(f, { clipPath: "inset(18% 18% 18% 18%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: f, containerAnimation: tween, start: "left 100%", end: "left 55%", scrub: true } });
        const img = f.querySelector("[data-img]");
        if (img) gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: f, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
    mm.add("(max-width: 1023px)", () => {
      track.querySelectorAll<HTMLElement>("[data-frame]").forEach((f) =>
        gsap.fromTo(f, { clipPath: "inset(14% 14% 14% 14%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 88%", once: true } }),
      );
    });
    return () => {
      intro.revert();
      mm.revert();
    };
  });

  return (
    <section ref={ref} id="portafolio" aria-labelledby="col-title">
      <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-[clamp(120px,15vw,220px)] sm:px-8 lg:px-12">
        <p className="a-eyebrow">I — Colección</p>
        <h2 id="col-title" data-lines className="mt-6 max-w-[14ch] font-display text-[clamp(48px,8vw,132px)] leading-[0.95] tracking-[-0.02em]">
          Doce piezas, <em className="text-oxblood">una</em> sola mirada.
        </h2>
      </div>
      <div data-pin className="lg:flex lg:h-[100svh] lg:items-center lg:overflow-hidden">
        <ol data-track className="flex flex-col gap-14 px-5 sm:px-8 lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:px-[8vw]">
          {all.map(({ s, item, k }, i) => (
            <li key={item.brand} className={`lg:flex lg:items-center lg:gap-[4vw] ${i % 2 ? "lg:translate-y-[6svh]" : "lg:-translate-y-[4svh]"}`}>
              {k === 0 && (
                <div id={s.id} className="mb-8 scroll-mt-24 lg:mb-0 lg:w-[22vw]">
                  <p className="a-eyebrow">{s.n} / 04</p>
                  <h3 className="mt-3 font-display text-[clamp(56px,7vw,120px)] italic leading-[0.9]">{s.name}</h3>
                  <p className="mt-4 max-w-[18rem] text-[15px] text-ink-soft">{s.desc}</p>
                </div>
              )}
              <figure className="group">
                <div data-frame className="relative aspect-[9/16] w-full max-w-[420px] overflow-hidden lg:h-[64svh] lg:w-[36svh] lg:max-w-none">
                  <Photo img={portrait} item={item} sizes="(min-width:1024px) 36vh, 90vw" className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-6 text-[12px]">
                  <span className="font-display text-[22px] leading-none transition-[font-style] group-hover:italic">{item.brand}</span>
                  <span className="uppercase tracking-[0.24em] text-ink-soft">{item.format} · {item.duration}</span>
                </figcaption>
              </figure>
            </li>
          ))}
          <li className="hidden lg:block lg:w-[10vw]" aria-hidden />
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ INDEX (services with cursor preview) */
function Index({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const [hover, setHover] = useState<number | null>(null);
  const looks: VideoItem[] = services.map((s) => portfolio[s.id][0]);

  useMotion(ref, (root) => {
    root.querySelectorAll("[data-row]").forEach((r) => {
      gsap.from(r.querySelector("[data-rule]"), { scaleX: 0, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: r, start: "top 90%", once: true } });
      gsap.from(r.querySelectorAll("[data-t]"), { yPercent: 100, duration: 1.3, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: r, start: "top 90%", once: true } });
    });
  });
  useEffect(() => {
    if (!fine || !prev.current) return;
    const x = gsap.quickTo(prev.current, "x", { duration: 0.7, ease: "power3.out" });
    const y = gsap.quickTo(prev.current, "y", { duration: 0.7, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [fine]);

  return (
    <section ref={ref} aria-labelledby="idx-title" className="mx-auto max-w-[1320px] px-5 py-[clamp(120px,15vw,220px)] sm:px-8 lg:px-12">
      <div className="flex items-end justify-between">
        <p className="a-eyebrow">II — Índice</p>
        <p className="hidden text-[13px] text-ink-soft sm:block">Lo que grabo</p>
      </div>
      <h2 id="idx-title" className="sr-only">Categorías</h2>
      <ul className="mt-10" onPointerLeave={() => setHover(null)}>
        {services.map((s, i) => (
          <li key={s.id} data-row className="relative" onPointerEnter={() => setHover(i)}>
            <span data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20" />
            <a href={`#${s.id}`} className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-7 sm:grid-cols-[80px_1fr_auto] lg:py-9">
              <span className="overflow-hidden"><span data-t className="block font-display text-[18px] italic text-ink-soft">{s.n}</span></span>
              <span className="overflow-hidden"><span data-t className="block"><span className="block font-display text-[clamp(48px,8.4vw,140px)] leading-[0.9] tracking-[-0.02em] transition-[translate,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-6 group-hover:italic group-hover:text-oxblood">{s.name}</span></span></span>
              <span className="col-span-2 mt-2 overflow-hidden text-[15px] text-ink-soft sm:col-span-1 sm:mt-0 sm:text-right"><span data-t className="block">{s.desc}</span></span>
            </a>
          </li>
        ))}
        <li aria-hidden className="h-px bg-ink/20" />
      </ul>
      {fine && (
        <div ref={prev} aria-hidden className="pointer-events-none fixed left-0 top-0 z-50">
          <div className={`a-preview -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-500 ${hover === null ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}>
            {looks.map((l, i) => (
              <Photo key={i} img={portrait} item={l} sizes="240px" className={`absolute inset-0 transition-opacity duration-500 ${hover === i ? "opacity-100" : "opacity-0"}`} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ MAISONS */
function Maisons() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-b]"), { opacity: 0, y: -24, filter: "blur(8px)", duration: 1.4, ease: "expo.out", stagger: { each: 0.06, from: "center" }, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });
  return (
    <section ref={ref} aria-labelledby="mai-title" className="bg-ink py-[clamp(110px,14vw,200px)] text-cream">
      <div className="mx-auto max-w-[1320px] px-5 text-center sm:px-8 lg:px-12">
        <p className="a-eyebrow text-cream/55">III — Maisons</p>
        <h2 id="mai-title" className="mx-auto mt-6 max-w-[16ch] font-display text-[clamp(40px,5.6vw,88px)] leading-[1]">Han confiado en <em className="text-[#d9a99c]">mi mirada</em></h2>
        <ul className="mt-16 grid grid-cols-2 border-l border-t border-cream/15 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <li key={b} data-b className="grid min-h-[120px] place-items-center border-b border-r border-cream/15 px-4 font-display text-[clamp(22px,2.2vw,32px)] italic transition-colors duration-500 hover:bg-cream hover:text-ink sm:min-h-[150px]">{b}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ METHOD */
function Method() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-gold]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 80%", end: "bottom 60%", scrub: 0.6 } });
    gsap.from(root.querySelectorAll("[data-step]"), { opacity: 0, y: -40, duration: 1.4, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 80%", once: true } });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="met-title" className="mx-auto max-w-[1320px] px-5 py-[clamp(120px,15vw,220px)] sm:px-8 lg:px-12">
      <p className="a-eyebrow">IV — Método</p>
      <h2 id="met-title" className="mt-6 max-w-[16ch] font-display text-[clamp(48px,7vw,120px)] leading-[0.95]">Cuatro gestos, <em className="text-oxblood">ningún ruido.</em></h2>
      <div data-steps className="relative mt-20">
        <span data-gold aria-hidden className="absolute left-0 right-0 top-[38px] hidden h-px origin-left bg-[#a88b62] lg:block" />
        <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((s) => (
            <li key={s.n} data-step className="relative">
              <span className="relative z-10 inline-grid h-[76px] w-[76px] place-items-center rounded-full border border-[#a88b62] bg-cream font-display text-[30px] italic">{s.n}</span>
              <h3 className="mt-8 font-display text-[40px] leading-none">{s.title}</h3>
              <p className="mt-4 max-w-[19rem] text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-24 grid gap-x-10 border-t border-ink/15 pt-10 sm:grid-cols-2">
        {formats.map((f) => (
          <p key={f.name} className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4">
            <span className="font-display text-[26px]">{f.name}</span>
            <span className="text-right text-[13px] text-ink-soft">{f.note}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ PROFILE */
function Profile({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const arch = root.querySelector("[data-arch]")!;
    gsap.fromTo(arch, { clipPath: "inset(30% 30% 0% 30% round 999px 999px 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", ease: "none", scrollTrigger: { trigger: arch, start: "top 90%", end: "center 55%", scrub: 0.6 } });
    gsap.fromTo(arch.querySelector("img"), { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: { trigger: arch, start: "top bottom", end: "bottom 50%", scrub: 0.6 } });
    gsap.from(root.querySelector("[data-bio]"), { opacity: 0, y: -24, filter: "blur(6px)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-bio]"), start: "top 88%", once: true } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="per-title" className="mx-auto max-w-[1100px] px-5 pb-[clamp(120px,15vw,220px)] text-center sm:px-8">
      <p className="a-eyebrow">V — Perfil</p>
      <div data-arch className="relative mx-auto mt-10 aspect-[3/4] w-full max-w-[460px] overflow-hidden rounded-t-full" style={{ background: "#d6c3a9" }}>
        <img src={portrait.src} srcSet={portrait.srcSet} sizes="460px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
      </div>
      <h2 id="per-title" className="mt-14 font-display text-[clamp(44px,6vw,96px)] italic leading-none">Steff Ramírez</h2>
      <p data-bio className="a-dropcap mx-auto mt-10 max-w-[38rem] text-left text-[clamp(17px,1.5vw,20px)] leading-[1.75] text-ink-soft">
        Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y con mucha cercanía. Cada video empieza con una pregunta: ¿por qué alguien dejaría de deslizar aquí?
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */
function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <p className="a-eyebrow">VI — Preguntas</p>
          <h2 id="faq-title" className="mt-6 font-display text-[clamp(44px,5vw,80px)] leading-[0.95]">Antes de <em className="text-oxblood">empezar</em></h2>
        </div>
        <div className="lg:col-span-8">
          {faqs.map((f, i) => (
            <details key={f.q} className="a-faq group border-t border-ink/15 last:border-b" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-baseline gap-6 py-7">
                <span className="font-display text-[16px] italic text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-display text-[clamp(24px,2.4vw,34px)] leading-tight transition-colors group-open:italic group-open:text-oxblood">{f.q}</span>
                <span aria-hidden className="text-[22px] transition-transform duration-500 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[40rem] pb-8 pl-11 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CONTACT */
function Contact({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-big]")!, { type: "words,chars" });
    gsap.from(s.chars, { yPercent: 100, opacity: 0, rotateX: -60, duration: 1.6, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="con-title" className="p-3 sm:p-4 lg:p-5">
      <div className="a-card flex min-h-[90svh] flex-col items-center justify-center rounded-[28px] px-5 py-24 text-center sm:rounded-[40px] lg:rounded-[52px]">
        <p className="a-eyebrow">VII — Contacto</p>
        <h2 id="con-title" className="mt-6 [perspective:600px]"><span data-big className="block font-display text-[clamp(64px,13vw,220px)] italic leading-[0.9]">Escríbeme</span></h2>
        <a href={`mailto:${EMAIL}`} className="a-link mt-10 font-display text-[clamp(22px,3vw,40px)]">{EMAIL}</a>
        <button type="button" onClick={onContact} className="mt-10 inline-flex h-14 cursor-pointer items-center gap-4 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">Cuéntame tu idea<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink">↗</span></button>
        <button type="button" onClick={copy} className="mt-4 cursor-pointer text-[11px] font-medium uppercase tracking-[0.3em] text-ink-soft hover:text-ink">{done ? "Copiado ✓" : "Copiar correo"}</button>
        <ul className="mt-12 flex gap-8 text-[11px] font-medium uppercase tracking-[0.3em]">
          {socials.map((s) => (
            <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" className="a-link">{s.label}<span className="sr-only"> (se abre en una pestaña nueva)</span></a></li>
          ))}
        </ul>
        <p className="mt-20 text-[12px] text-ink-soft">© 2026 Steff Ramírez · UGC Creator</p>
      </div>
    </section>
  );
}

function Hero(p: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      {...p}
      title={<Letters />}
      back={
        <>
          <div aria-hidden className="v2-glow" />
          <div aria-hidden data-arch className="v2-arch" />
          <div aria-hidden className="a-ring" />
        </>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { clipPath: "inset(6% 6% 6% 6% round 60px)", scale: 1.03, duration: 1.8, ease: "expo.inOut" })
          .from(root.querySelectorAll("[data-l]"), { yPercent: 70, rotateX: -80, opacity: 0, duration: 1.6, stagger: 0.08 }, 0.6)
          .from(root.querySelector("[data-arch]"), { scaleY: 0, transformOrigin: "bottom", duration: 1.8 }, 0.8)
          .from(root.querySelector(".a-ring"), { scale: 0.6, opacity: 0, duration: 2 }, 0.9)
          .from(root.querySelector("[data-fig]"), { yPercent: 8, opacity: 0, filter: "blur(16px)", duration: 1.8 }, 1)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 1, stagger: 0.06 }, 1.6);
        // exhale: the card settles back and the name opens up as you leave
        gsap.to(root, { scale: 0.94, borderRadius: 72, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
        gsap.to(root.querySelector(".v2-title"), { letterSpacing: "0.12em", opacity: 0.25, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
      }}
    />
  );
}

export default function App({ hero, portrait }: P) {
  return (
    <Shell>
      {({ openMenu, openContact }) => (
        <>
          <Hero hero={hero} onMenu={openMenu} onContact={openContact} />
          <Collection portrait={portrait} />
          <Index portrait={portrait} />
          <Maisons />
          <Method />
          <Profile portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
