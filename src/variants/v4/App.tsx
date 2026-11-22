import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, SplitText, useMotion, useLenis, useCopy, useFinePointer } from "../kit";

type P = { hero: Img; portrait: Img };
const tone: Record<string, string> = { cream: "#e9dfcf", sand: "#cdb592", blush: "#dcbcae", hero: "#d6c3a9", rose: "#b9877c", oxblood: "#5c1a1f" };
const crop: Record<string, CSSProperties> = {
  face: { objectPosition: "50% 0%", transform: "scale(2.1)", transformOrigin: "50% 18%" },
  torso: { objectPosition: "50% 0%", transform: "scale(1.35)", transformOrigin: "50% 28%" },
  full: { objectPosition: "50% 0%" },
};
const label = "text-[11px] font-medium uppercase tracking-[0.3em]";

/** Running timecode HH:MM:SS:FF, like a camera recording. */
function Timecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const f = () => {
      const ms = performance.now() - t0;
      const fr = Math.floor((ms % 1000) / 41.67);
      const s = Math.floor(ms / 1000);
      setTc(`00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(fr).padStart(2, "0")}`);
      raf = requestAnimationFrame(f);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span className="tabular-nums">{tc}</span>;
}

function Frame({ img, item, sizes, className }: { img: Img; item: VideoItem; sizes: string; className?: string }) {
  return (
    <div className={`overflow-hidden ${className ?? "relative"}`} style={{ background: tone[item.tone] }}>
      <img src={img.src} srcSet={img.srcSet} sizes={sizes} alt="" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" style={{ ...crop[item.crop], filter: item.tone === "oxblood" ? "grayscale(1) contrast(1.15) brightness(1.2)" : "contrast(1.05) saturate(0.9)" }} />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_40%,rgba(10,5,4,0.45))]" />
    </div>
  );
}

/* ------------------------------------------------------------------ HERO */
function Hero({ hero }: { hero: Img }) {
  const ref = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-title]")!, { type: "words,chars" });
    const tl = gsap.timeline();
    tl.fromTo(root.querySelectorAll("[data-bar]"), { scaleY: 1 }, { scaleY: 0, duration: 1.6, ease: "expo.inOut", stagger: 0 })
      .from(root.querySelector("[data-card]"), { filter: "brightness(0.2)", duration: 2, ease: "power2.out" }, 0.4)
      .from(root.querySelector("[data-fig]"), { opacity: 0, scale: 1.06, filter: "blur(14px)", duration: 2.2, ease: "power3.out" }, 0.8)
      .from(s.chars, { opacity: 0, filter: "blur(12px)", y: 20, duration: 1.4, ease: "power3.out", stagger: 0.05 }, 1.2)
      .from(root.querySelectorAll("[data-in]"), { opacity: 0, duration: 1, stagger: 0.1 }, 1.8);
    // the card sinks into the dark as you leave
    gsap.to(root.querySelector("[data-card]"), { scale: 0.92, filter: "brightness(0.55)", ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => s.revert();
  });
  useEffect(() => {
    const c = card.current;
    if (!c || !fine) return;
    const x = gsap.quickTo(c, "--lx", { duration: 0.8, ease: "power3.out" });
    const y = gsap.quickTo(c, "--ly", { duration: 0.8, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      x(((e.clientX - r.left) / r.width) * 100);
      y(((e.clientY - r.top) / r.height) * 100);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [fine]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[600px] p-3 sm:p-4 lg:p-5">
      <span data-bar aria-hidden className="absolute inset-x-0 top-0 z-50 h-1/2 origin-top bg-night" style={{ transform: "scaleY(0)" }} />
      <span data-bar aria-hidden className="absolute inset-x-0 bottom-0 z-50 h-1/2 origin-bottom bg-night" style={{ transform: "scaleY(0)" }} />
      <div ref={card} data-card className="d-card relative flex h-full flex-col items-center overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[52px]">
        <div className="relative z-30 flex w-full items-start justify-between px-5 pt-5 text-ink sm:px-8 sm:pt-7 lg:px-12">
          <p data-in className={label}><span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#b3261e] align-middle" />Rec <Timecode /></p>
          <nav data-in aria-label="Principal" className={`${label} hidden gap-8 md:flex`}>
            {[["reel", "Reel"], ["escenas", "Escenas"], ["detras", "Detrás"], ["contacto", "Contacto"]].map(([id, n]) => (
              <a key={id} href={`#${id}`} className="d-link">{n}</a>
            ))}
          </nav>
          <p data-in className={`${label} text-right`}>9:16 · 4K</p>
        </div>
        <h1 className="relative z-10 mt-[4svh] text-center sm:mt-[2svh]">
          <span className="sr-only">Steff Ramírez, UGC Creator</span>
          <span aria-hidden data-title className="d-hero-title block font-display leading-[0.85]">Steff <em>Ramírez</em></span>
        </h1>
        <p data-in className={`${label} relative z-10 mt-4 text-ink-soft`}>UGC Creator — Moda · Belleza · Lifestyle · Momlife</p>
        <img data-fig src={hero.src} srcSet={hero.srcSet} sizes="(min-width:1024px) 520px, 85vw" width={hero.width} height={hero.height} alt="Steff Ramírez, creadora de contenido UGC" fetchPriority="high" className="absolute bottom-0 left-1/2 z-20 h-[66%] w-auto max-w-none -translate-x-1/2" />
        <div aria-hidden className="d-spot pointer-events-none absolute inset-0 z-[25]" />
        <div data-in className={`${label} absolute inset-x-0 bottom-0 z-30 flex justify-between px-5 pb-5 text-ink sm:px-8 sm:pb-7 lg:px-12`}>
          <span>Escena 01 · Toma 01</span>
          <span>Desliza ↓</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ REEL: stacking category cards */
function Reel({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stack]"));
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (next) {
        gsap.to(c.firstElementChild, { scale: 0.92, filter: "brightness(0.45)", ease: "none", scrollTrigger: { trigger: next, start: "top 55%", end: "top top", scrub: true } });
      }
      gsap.from(c.querySelectorAll("[data-clip]"), { yPercent: 30, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: c, start: "top 60%", once: true } });
    });
    const s = new SplitText(root.querySelector("[data-h]")!, { type: "words,chars" });
    gsap.from(s.chars, { opacity: 0, filter: "blur(10px)", duration: 1.2, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="reel" aria-labelledby="r-title" className="relative">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-[clamp(120px,15vw,220px)] text-center sm:px-8">
        <p className={`${label} text-cream/50`}>Rollo 01 — El reel</p>
        <h2 id="r-title" data-h className="mt-6 font-display text-[clamp(56px,10vw,170px)] leading-[0.9]">Cuatro géneros, <em className="text-[#d99a8c]">una voz.</em></h2>
      </div>
      {services.map((s, i) => (
        <div key={s.id} id={s.id} data-stack className="sticky top-0 flex h-[100svh] items-center px-3 py-3 sm:px-4 lg:px-5" style={{ zIndex: i + 1 }}>
          <div className="d-stack relative flex h-full w-full flex-col overflow-hidden rounded-[28px] sm:rounded-[40px] lg:flex-row lg:rounded-[52px]" style={{ background: ["#1c1210", "#2a1418", "#231a14", "#3a1015"][i] }}>
            <div className="flex flex-col justify-between p-6 sm:p-10 lg:w-[38%] lg:p-14">
              <p className={`${label} text-cream/50`}>Género {s.n} / 04</p>
              <div>
                <h3 className="font-display text-[clamp(64px,9vw,160px)] leading-[0.85]">{i % 2 ? <em>{s.name}</em> : s.name}</h3>
                <p className="mt-4 max-w-[22rem] text-[16px] text-cream/70">{s.desc}</p>
              </div>
              <p className={`${label} hidden text-cream/40 lg:block`}>{portfolio[s.id].length} tomas</p>
            </div>
            <ul className="grid flex-1 grid-cols-3 gap-2 px-4 pb-4 sm:gap-3 sm:px-8 sm:pb-8 lg:items-center lg:gap-4 lg:p-10 lg:pl-0">
              {portfolio[s.id].map((item, k) => (
                <li key={item.brand} data-clip className={`group ${k === 1 ? "lg:translate-y-8" : ""}`}>
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[14px] lg:rounded-[20px]">
                    <Frame img={portrait} item={item} sizes="(min-width:1024px) 18vw, 30vw" className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                    <p className="absolute inset-x-2 top-[22%] text-center sm:inset-x-3"><span className="box-decoration-clone rounded bg-cream px-1.5 py-0.5 text-[10px] font-semibold leading-[1.7] text-ink sm:text-[13px]">{item.hook}</span></p>
                    <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-2 pt-8 text-[10px] sm:p-4 sm:text-[12px]"><span className="font-display text-[14px] italic sm:text-[20px]">{item.brand}</span><br /><span className="uppercase tracking-[0.2em] text-cream/70">{item.format} · {item.duration}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ ESCENAS: film strip */
function Scenes() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-strip]"), { xPercent: 4 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    gsap.from(root.querySelectorAll("[data-fmt]"), { opacity: 0, y: 20, duration: 1, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: root.querySelector("[data-fmts]"), start: "top 85%", once: true } });
  });
  return (
    <section ref={ref} id="escenas" aria-labelledby="e-title" className="overflow-hidden py-[clamp(120px,15vw,220px)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <p className={`${label} text-cream/50`}>Rollo 02 — Escenas</p>
        <h2 id="e-title" className="mt-6 max-w-[14ch] font-display text-[clamp(52px,8vw,140px)] leading-[0.9]">Del guion <em className="text-[#d99a8c]">al corte final.</em></h2>
      </div>
      <div className="mt-16 -rotate-1">
        <ol data-strip className="d-strip flex w-max gap-0 py-7">
          {[...steps, ...steps.slice(0, 2)].map((s, i) => (
            <li key={i} aria-hidden={i >= steps.length || undefined} className="mx-2 flex h-[min(60svh,460px)] w-[min(78vw,440px)] shrink-0 flex-col justify-between rounded-[6px] bg-[#e9dfcf] p-7 text-ink sm:p-9">
              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-soft"><span>Escena {String((i % 4) + 1).padStart(2, "0")}</span><span>Toma 1</span></div>
              <div>
                <p className="font-display text-[clamp(90px,11vw,150px)] italic leading-[0.8] text-oxblood">{s.n}</p>
                <h3 className="mt-4 font-display text-[44px] leading-none">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div data-fmts className="mx-auto mt-24 grid max-w-[1400px] gap-x-12 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
        {formats.map((f, i) => (
          <div key={f.name} data-fmt className="border-t border-cream/15 py-5">
            <p className={`${label} text-cream/40`}>Formato {String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-display text-[32px] leading-none">{f.name}</p>
            <p className="mt-2 text-[14px] text-cream/60">{f.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CREDITS */
function Credits() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-cr]").forEach((el) => {
      gsap.fromTo(el, { opacity: 0.12 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 50%", scrub: true } });
      gsap.fromTo(el, { opacity: 1 }, { opacity: 0.12, ease: "none", immediateRender: false, scrollTrigger: { trigger: el, start: "top 35%", end: "top 10%", scrub: true } });
    });
  });
  return (
    <section ref={ref} aria-labelledby="cr-title" className="py-[clamp(120px,15vw,220px)] text-center">
      <p className={`${label} text-cream/50`}>Rollo 03 — Créditos</p>
      <h2 id="cr-title" className="mt-6 font-display text-[clamp(44px,6vw,96px)] italic leading-none">Con la participación de</h2>
      <ul className="mx-auto mt-20 max-w-[900px] space-y-6 px-5">
        {brands.map((b, i) => (
          <li key={b} data-cr className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-6">
            <span className={`${label} text-right text-cream/50`}>Marca {String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-[clamp(34px,5vw,72px)] leading-none">{b}</span>
            <span />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ DETRÁS (about) */
function Behind({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-txt]")!, { type: "words" });
    gsap.fromTo(s.words, { opacity: 0.12 }, { opacity: 1, ease: "none", stagger: 0.05, scrollTrigger: { trigger: root.querySelector("[data-txt]"), start: "top 80%", end: "bottom 55%", scrub: true } });
    gsap.fromTo(root.querySelector("[data-ph]"), { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: root.querySelector("[data-ph]"), start: "top 85%", end: "center 50%", scrub: true } });
    gsap.fromTo(root.querySelector("[data-ph] img"), { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-ph]"), start: "top bottom", end: "bottom top", scrub: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="detras" aria-labelledby="b-title" className="mx-auto max-w-[1400px] px-5 py-[clamp(120px,15vw,220px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div data-ph className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-oxblood lg:rounded-[40px]">
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply grayscale" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
          <p className={`${label} absolute bottom-6 left-6 text-cream`}>Detrás de cámara</p>
        </div>
        <div>
          <p className={`${label} text-cream/50`}>Rollo 04 — Detrás</p>
          <h2 id="b-title" className="mt-6 font-display text-[clamp(52px,6.4vw,110px)] leading-[0.9]">Soy <em className="text-[#d99a8c]">Steff.</em></h2>
          <p data-txt className="mt-8 font-display text-[clamp(26px,2.6vw,40px)] leading-[1.2]">
            Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y mucha cercanía.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="fq-title" className="mx-auto max-w-[1100px] px-5 pb-[clamp(120px,15vw,220px)] sm:px-8">
      <p className={`${label} text-center text-cream/50`}>Rollo 05 — Preguntas</p>
      <h2 id="fq-title" className="mt-6 text-center font-display text-[clamp(48px,6vw,100px)] leading-none">Antes de <em className="text-[#d99a8c]">rodar</em></h2>
      <ul className="mt-14">
        {faqs.map((f, i) => (
          <li key={f.q} className="border-t border-cream/15 last:border-b">
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`dq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group flex w-full cursor-pointer items-baseline gap-6 py-7 text-left">
                <span className={`${label} w-8 shrink-0 text-cream/40`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`flex-1 font-display text-[clamp(26px,2.8vw,40px)] leading-tight transition-colors ${open === i ? "italic text-[#d99a8c]" : "group-hover:text-[#d99a8c]"}`}>{f.q}</span>
                <span aria-hidden className={`text-[28px] font-light transition-transform duration-500 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
            </h3>
            <div id={`dq${i}`} hidden={open !== i} className="pb-8 pl-14"><p className="max-w-[40rem] text-[17px] leading-relaxed text-cream/70">{f.a}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ CONTACT */
function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-card]"), { clipPath: "inset(40% 10% 40% 10% round 52px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: true } });
    const s = new SplitText(root.querySelector("[data-big]")!, { type: "words,chars" });
    gsap.from(s.chars, { opacity: 0, filter: "blur(12px)", y: 30, duration: 1.4, ease: "power3.out", stagger: 0.04, scrollTrigger: { trigger: root, start: "top 40%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="c-title" className="p-3 sm:p-4 lg:p-5">
      <div data-card className="d-card relative flex min-h-[94svh] flex-col items-center justify-center overflow-hidden rounded-[28px] px-5 py-24 text-center text-ink sm:rounded-[40px] lg:rounded-[52px]">
        <p className={label}>Rollo final — Contacto</p>
        <h2 id="c-title" className="mt-6"><span data-big className="block font-display text-[clamp(64px,12vw,210px)] leading-[0.85]">Rodemos <em className="text-oxblood">juntas.</em></span></h2>
        <a href={`mailto:${EMAIL}`} className="d-link mt-10 font-display text-[clamp(24px,3.4vw,48px)] italic">{EMAIL}</a>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={copy} className={`${label} cursor-pointer rounded-full bg-night px-6 py-4 text-cream transition-colors hover:bg-oxblood`}>{done ? "Copiado ✓" : "Copiar correo"}</button>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className={`${label} rounded-full border border-ink/30 px-6 py-4 transition-colors hover:bg-ink hover:text-cream`}>{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a>
          ))}
        </div>
        <p className={`${label} absolute inset-x-0 bottom-6 text-ink-soft`}>Fin · © 2026 Steff Ramírez</p>
      </div>
    </section>
  );
}

function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || !fine) return;
    const x = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.dataset.big = (e.target as HTMLElement).closest("a,button") ? "1" : "0";
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [fine]);
  if (!fine) return null;
  return <div ref={ref} aria-hidden className="d-dot" />;
}

export default function App({ hero, portrait }: P) {
  useLenis({ lerp: 0.07 });
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <main className="overflow-x-clip">
      <CursorDot />
      <Hero hero={hero} />
      <Reel portrait={portrait} />
      <Scenes />
      <Credits />
      <Behind portrait={portrait} />
      <Faq />
      <Contact />
    </main>
  );
}
