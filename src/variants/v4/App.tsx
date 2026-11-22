import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, SplitText, useMotion, useCopy, useFinePointer } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";

function Timecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t0 = performance.now();
    let raf = 0;
    const f = () => {
      const ms = performance.now() - t0;
      const s = Math.floor(ms / 1000);
      setTc(`00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(Math.floor((ms % 1000) / 41.67)).padStart(2, "0")}`);
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span className="tabular-nums">{tc}</span>;
}

/* ------------------------------------------------------------------ HERO with studio light */
function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  const fine = useFinePointer();
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const card = wrap.current?.querySelector<HTMLElement>("#top");
    if (!card || !fine) return;
    const x = gsap.quickTo(card, "--lx", { duration: 0.9, ease: "power3.out" });
    const y = gsap.quickTo(card, "--ly", { duration: 0.9, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      x(((e.clientX - r.left) / r.width) * 100);
      y(((e.clientY - r.top) / r.height) * 100);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [fine]);
  return (
    <div ref={wrap} className="relative">
      <EleHero
        hero={hero}
        onMenu={onMenu}
        onContact={onContact}
        title={<Letters />}
        cardClass="s-card"
        back={<div aria-hidden className="v2-glow" />}
        front={
          <>
            <div aria-hidden className="s-spot pointer-events-none absolute inset-0 z-[25]" />
            <p data-in className="absolute left-1/2 top-[86px] z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-cream/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-soft backdrop-blur sm:flex lg:top-[104px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-oxblood" /> Rec <Timecode />
            </p>
            <span data-bar aria-hidden className="absolute inset-x-0 top-0 z-50 h-1/2 origin-top bg-cream" style={{ transform: "scaleY(0)" }} />
            <span data-bar aria-hidden className="absolute inset-x-0 bottom-0 z-50 h-1/2 origin-bottom bg-cream" style={{ transform: "scaleY(0)" }} />
          </>
        }
        motion={(root) => {
          const tl = gsap.timeline();
          tl.fromTo(root.querySelectorAll("[data-bar]"), { scaleY: 1 }, { scaleY: 0, duration: 1.6, ease: "expo.inOut" })
            .from(root, { filter: "brightness(0.55)", duration: 2.2, ease: "power2.out" }, 0.3)
            .from(root.querySelectorAll("[data-l]"), { opacity: 0, filter: "blur(14px)", scale: 1.1, duration: 1.6, stagger: 0.08, ease: "power3.out" }, 0.9)
            .from(root.querySelector("[data-fig]"), { opacity: 0, scale: 1.05, filter: "blur(12px)", duration: 2, ease: "power3.out" }, 1)
            .from(root.querySelectorAll("[data-in]"), { opacity: 0, duration: 1, stagger: 0.06 }, 1.7);
          gsap.to(root, { scale: 0.92, filter: "brightness(0.85)", ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ ESCENAS: stacking cards */
const stackTones = ["#f8f3ea", "#ecd7cb", "#e3d1b8", "#5c1a1f"];
function Scenes({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stack]"));
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (next) gsap.to(c.firstElementChild, { scale: 0.93, filter: "brightness(0.82)", ease: "none", scrollTrigger: { trigger: next, start: "top 55%", end: "top top", scrub: true } });
      gsap.from(c.querySelectorAll("[data-clip]"), { yPercent: 25, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: c, start: "top 60%", once: true } });
    });
    const s = new SplitText(root.querySelector("[data-h]")!, { type: "words,chars" });
    gsap.from(s.chars, { opacity: 0, filter: "blur(10px)", duration: 1.2, stagger: 0.03, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="portafolio" aria-labelledby="r-title" className="relative">
      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-[clamp(120px,15vw,220px)] text-center sm:px-8">
        <p className={kicker}>Portafolio — cuatro escenas</p>
        <h2 id="r-title" data-h className="mt-6 font-display text-[clamp(52px,9vw,150px)] leading-[0.92] tracking-[-0.02em]">Cada toma, <em className="text-oxblood">una historia.</em></h2>
      </div>
      {services.map((s, i) => {
        const dark = i === 3;
        return (
          <div key={s.id} id={s.id} data-stack className="sticky top-0 flex h-[100svh] items-center px-3 py-3 sm:px-4 lg:px-5" style={{ zIndex: i + 1 }}>
            <div className={`s-stack relative flex h-full w-full origin-top flex-col overflow-hidden rounded-[28px] sm:rounded-[40px] lg:flex-row lg:rounded-[52px] ${dark ? "text-cream" : "text-ink"}`} style={{ background: stackTones[i] }}>
              <div className="flex flex-col justify-between p-6 sm:p-10 lg:w-[38%] lg:p-14">
                <p className={`${kicker} ${dark ? "text-cream/60" : ""}`}>Escena {s.n} · Toma 01</p>
                <div>
                  <h3 className="font-display text-[clamp(64px,9vw,160px)] leading-[0.88] tracking-[-0.02em]">{i % 2 ? <em>{s.name}</em> : s.name}</h3>
                  <p className={`mt-4 max-w-[22rem] text-[16px] ${dark ? "text-cream/75" : "text-ink-soft"}`}>{s.desc}</p>
                </div>
                <p className={`${kicker} hidden lg:block ${dark ? "text-cream/50" : ""}`}>{portfolio[s.id].length} tomas</p>
              </div>
              <ul className="grid flex-1 grid-cols-3 gap-2 px-4 pb-4 sm:gap-3 sm:px-8 sm:pb-8 lg:items-center lg:gap-5 lg:p-12 lg:pl-0">
                {portfolio[s.id].map((item, k) => (
                  <li key={item.brand} data-clip className={`group ${k === 1 ? "lg:translate-y-10" : ""}`}>
                    <div className="relative aspect-[9/16] overflow-hidden rounded-[14px] shadow-[0_30px_50px_-30px_rgba(42,27,22,0.6)] lg:rounded-[22px]">
                      <Shot img={portrait} item={item} sizes="(min-width:1024px) 18vw, 30vw" className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                      <p className="absolute inset-x-2 top-[22%] text-center sm:inset-x-3"><span className="box-decoration-clone rounded bg-cream px-1.5 py-0.5 text-[10px] font-semibold leading-[1.7] text-ink sm:text-[13px]">{item.hook}</span></p>
                      <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(30,14,12,0.7)] to-transparent p-2 pt-10 text-[10px] text-cream sm:p-4 sm:text-[11px]"><span className="font-display text-[14px] italic sm:text-[20px]">{item.brand}</span><br /><span className="uppercase tracking-[0.2em] opacity-75">{item.format} · {item.duration}</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ------------------------------------------------------------------ PROCESO: film strip */
function Strip() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-strip]"), { xPercent: 4 }, { xPercent: -24, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    gsap.from(root.querySelectorAll("[data-fmt]"), { opacity: 0, y: -16, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: root.querySelector("[data-fmts]"), start: "top 85%", once: true } });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="e-title" className="overflow-hidden py-[clamp(120px,15vw,220px)]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <p className={kicker}>Cómo trabajo</p>
        <h2 id="e-title" className="mt-6 max-w-[14ch] font-display text-[clamp(52px,8vw,136px)] leading-[0.92] tracking-[-0.02em]">Del guion <em className="text-oxblood">al corte final.</em></h2>
      </div>
      <div className="mt-16 -rotate-1">
        <ol data-strip className="s-strip flex w-max py-8">
          {[...steps, ...steps.slice(0, 2)].map((s, i) => (
            <li key={i} aria-hidden={i >= steps.length || undefined} className="relative z-[1] mx-2 flex h-[min(58svh,440px)] w-[min(78vw,420px)] shrink-0 flex-col justify-between rounded-[10px] bg-[#f8f3ea] p-7 sm:p-9">
              <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft"><span>Escena {String((i % 4) + 1).padStart(2, "0")}</span><span>Toma 1</span></div>
              <div>
                <p className="font-display text-[clamp(84px,10vw,140px)] italic leading-[0.8] text-oxblood">{s.n}</p>
                <h3 className="mt-4 font-display text-[42px] leading-none">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div data-fmts className="mx-auto mt-24 grid max-w-[1200px] gap-x-12 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
        {formats.map((f, i) => (
          <div key={f.name} data-fmt className="border-t border-ink/15 py-5">
            <p className={kicker}>Formato {String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-display text-[30px] leading-none">{f.name}</p>
            <p className="mt-2 text-[14px] text-ink-soft">{f.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CRÉDITOS */
function Credits() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-cr]").forEach((el) => {
      gsap.fromTo(el, { opacity: 0.15, filter: "blur(4px)" }, { opacity: 1, filter: "blur(0px)", ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "top 55%", scrub: true } });
    });
  });
  return (
    <section ref={ref} aria-labelledby="cr-title" className="bg-ink py-[clamp(120px,15vw,220px)] text-center text-cream">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cream/55">Créditos</p>
      <h2 id="cr-title" className="mt-6 font-display text-[clamp(44px,6vw,96px)] italic leading-none">Con la participación de</h2>
      <ul className="mx-auto mt-16 max-w-[900px] space-y-5 px-5">
        {brands.map((b) => (
          <li key={b} data-cr className="font-display text-[clamp(32px,4.6vw,66px)] leading-none">{b}</li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ DETRÁS DE CÁMARA */
function Behind({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-txt]")!, { type: "words" });
    gsap.fromTo(s.words, { opacity: 0.15 }, { opacity: 1, ease: "none", stagger: 0.05, scrollTrigger: { trigger: root.querySelector("[data-txt]"), start: "top 85%", end: "bottom 65%", scrub: true } });
    gsap.fromTo(root.querySelector("[data-ph]"), { clipPath: "inset(0% 50% 0% 50% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 40px)", ease: "none", scrollTrigger: { trigger: root.querySelector("[data-ph]"), start: "top 90%", end: "center 55%", scrub: true } });
    gsap.fromTo(root.querySelector("[data-ph] img"), { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-ph]"), start: "top bottom", end: "bottom top", scrub: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="b-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(120px,15vw,220px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div data-ph className="relative aspect-[4/5] overflow-hidden" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
          <p className="absolute bottom-6 left-6 rounded-full bg-cream/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] backdrop-blur">Detrás de cámara</p>
        </div>
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="b-title" className="mt-6 font-display text-[clamp(52px,6.4vw,110px)] leading-[0.9] tracking-[-0.02em]">Soy <em className="text-oxblood">Steff.</em></h2>
          <p data-txt className="mt-8 font-display text-[clamp(24px,2.4vw,36px)] leading-[1.25]">
            Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y mucha cercanía.
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="fq-title" className="mx-auto max-w-[1000px] px-5 pb-[clamp(120px,15vw,220px)] sm:px-8">
      <p className={`${kicker} text-center`}>Preguntas</p>
      <h2 id="fq-title" className="mt-6 text-center font-display text-[clamp(48px,6vw,100px)] leading-none">Antes de <em className="text-oxblood">rodar</em></h2>
      <ul className="mt-14">
        {faqs.map((f, i) => (
          <li key={f.q} className="border-t border-ink/15 last:border-b">
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`sq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group flex w-full cursor-pointer items-baseline gap-6 py-7 text-left">
                <span className={`${kicker} w-8 shrink-0`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`flex-1 font-display text-[clamp(24px,2.6vw,36px)] leading-tight transition-colors ${open === i ? "italic text-oxblood" : "group-hover:text-oxblood"}`}>{f.q}</span>
                <span aria-hidden className={`text-[26px] transition-transform duration-500 ${open === i ? "rotate-45 text-oxblood" : ""}`}>+</span>
              </button>
            </h3>
            <div id={`sq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="max-w-[40rem] pb-8 pl-14 text-[17px] leading-relaxed text-ink-soft">{f.a}</p></div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-card]"), { clipPath: "inset(30% 8% 30% 8% round 52px)" }, { clipPath: "inset(0% 0% 0% 0% round 52px)", ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 30%", scrub: true } });
    const s = new SplitText(root.querySelector("[data-big]")!, { type: "words,chars" });
    gsap.from(s.chars, { opacity: 0, filter: "blur(12px)", y: 24, duration: 1.4, ease: "power3.out", stagger: 0.04, scrollTrigger: { trigger: root, start: "top 45%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div data-card className="grain v2-radius relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Escena final</p>
        <h2 id="c-title" className="mt-6"><span data-big className="block font-display text-[clamp(60px,11vw,190px)] leading-[0.88] tracking-[-0.02em]">Rodemos <em className="text-oxblood">juntas.</em></span></h2>
        <button type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
          Escríbeme<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
        </button>
        <p className="mt-6 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4">{done ? "copiado" : "copiar"}</button></p>
        <ul className="mt-8 flex gap-6 text-[11px] font-medium uppercase tracking-[0.24em]">
          {socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-oxblood">{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a></li>)}
        </ul>
        <p className="absolute bottom-6 text-[12px] text-ink-soft">Fin · © 2026 Steff Ramírez</p>
      </div>
    </section>
  );
}

export default function App({ hero, portrait }: P) {
  return (
    <Shell>
      {({ openMenu, openContact }) => (
        <>
          <Hero hero={hero} onMenu={openMenu} onContact={openContact} />
          <Scenes portrait={portrait} />
          <Strip />
          <Credits />
          <Behind portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
