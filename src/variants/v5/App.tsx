import { useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, SplitText, useMotion, useCopy } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";
const roman = ["I", "II", "III", "IV"];

function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      flanks={false}
      back={<div aria-hidden className="v2-glow" />}
      front={
        <>
          <span aria-hidden data-mat className="g-mat pointer-events-none absolute z-[5]" />
          <div data-in className="g-plaque absolute bottom-20 left-12 z-30 hidden max-w-[240px] lg:block">
            <p className="font-display text-[19px] italic leading-tight">Steff Ramírez</p>
            <p className="mt-1 text-[12px] leading-snug text-ink-soft">Contenido UGC, 2026<br />Video vertical 9:16, luz natural</p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-ink-soft">Exposición permanente</p>
          </div>
        </>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { opacity: 0, duration: 1.2 })
          .from(root.querySelector("[data-mat]"), { scale: 1.06, opacity: 0, duration: 2 }, 0.2)
          .from(root.querySelectorAll("[data-l]"), { opacity: 0, y: 30, duration: 2, stagger: 0.12 }, 0.5)
          .from(root.querySelector("[data-fig]"), { opacity: 0, y: 24, duration: 2.2 }, 0.9)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, duration: 1.4, stagger: 0.08 }, 1.6);
        gsap.to(root.querySelector("[data-mat]"), { scale: 0.96, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
      }}
    />
  );
}

function Frame({ img, item, cat, n }: { img: Img; item: VideoItem; cat: string; n: string }) {
  return (
    <figure data-work className="group">
      <div className="g-light" aria-hidden />
      <div className="g-frame transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5">
        <div className="relative aspect-[9/16] overflow-hidden">
          <Shot img={img} item={item} sizes="(min-width:1024px) 24vw, 70vw" className="absolute inset-0 transition-transform duration-[1.4s] group-hover:scale-[1.03]" />
        </div>
      </div>
      <figcaption className="g-label mx-auto mt-7 max-w-[260px]">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-ink-soft">{cat} · Nº {n}</p>
        <p className="mt-2 font-display text-[20px] italic leading-tight">{item.hook}</p>
        <p className="mt-2 text-[12px] leading-snug text-ink-soft">Steff Ramírez, 2026<br />Video vertical, {item.duration} · {item.format}<br />Encargo de {item.brand}</p>
      </figcaption>
    </figure>
  );
}

function Rooms({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const first = portfolio.moda[0];
  useMotion(ref, (root) => {
    // the first piece grows until it fills the screen, then the rooms open
    const intro = root.querySelector<HTMLElement>("[data-intro]")!;
    gsap.timeline({ scrollTrigger: { trigger: intro, start: "top top", end: "+=120%", pin: true, scrub: 0.6 } })
      .fromTo(intro.querySelector("[data-zoom]"), { width: "min(26vw, 280px)", height: "min(46vw, 500px)" }, { width: "100vw", height: "100svh", borderWidth: 0, ease: "none" })
      .to(intro.querySelector("[data-cap]"), { opacity: 0, ease: "none" }, 0)
      .fromTo(intro.querySelector("[data-over]"), { opacity: 0 }, { opacity: 1, ease: "none" }, 0.55);
    root.querySelectorAll<HTMLElement>("[data-work]").forEach((w) => {
      gsap.from(w, { opacity: 0, y: 50, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: w, start: "top 88%", once: true } });
      gsap.from(w.querySelector(".g-light"), { opacity: 0, duration: 2, delay: 0.4, scrollTrigger: { trigger: w, start: "top 88%", once: true } });
    });
  });
  return (
    <section ref={ref} id="portafolio" aria-labelledby="g-title">
      <div data-intro className="relative grid h-[100svh] place-items-center overflow-hidden">
        <div data-cap className="absolute top-[12svh] text-center">
          <p className={kicker}>La colección</p>
          <h2 id="g-title" className="mt-4 font-display text-[clamp(44px,6vw,96px)] leading-[0.95]">Cuatro <em className="text-oxblood">salas</em></h2>
        </div>
        <div data-zoom className="relative overflow-hidden border-[14px] border-[#fbf8f2] shadow-[0_40px_80px_-40px_rgba(42,27,22,0.55)]">
          <Shot img={portrait} item={first} sizes="100vw" className="absolute inset-0" />
          <div data-over className="absolute inset-0 grid place-items-center bg-[rgba(30,14,12,0.35)] text-center text-cream">
            <p className="font-display text-[clamp(44px,7vw,120px)] italic leading-none">“{first.hook}”</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(100px,12vw,180px)] sm:px-8 lg:px-12">
        {services.map((s, i) => (
          <div key={s.id} id={s.id} className="scroll-mt-20 pt-[clamp(100px,12vw,180px)]">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-ink/15 pb-6">
              <div>
                <p className={kicker}>Sala {roman[i]}</p>
                <h3 className="mt-3 font-display text-[clamp(48px,6vw,96px)] leading-[0.9]">{s.name}</h3>
              </div>
              <p className="max-w-[18rem] text-[15px] text-ink-soft">{s.desc}</p>
            </div>
            <div className="grid gap-x-10 gap-y-20 sm:grid-cols-3">
              {portfolio[s.id].map((it, k) => (
                <div key={it.brand} className={k === 1 ? "sm:mt-16" : ""}>
                  <Frame img={portrait} item={it} cat={s.name} n={`${i + 1}.${k + 1}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tour() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-path]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-stops]"), start: "top 70%", end: "bottom 60%", scrub: 0.5 } });
    root.querySelectorAll("[data-stop]").forEach((s) => gsap.from(s, { opacity: 0, x: -20, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 80%", once: true } }));
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="t-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <p className={kicker}>Recorrido guiado</p>
          <h2 id="t-title" className="mt-5 font-display text-[clamp(52px,6.4vw,104px)] leading-[0.92] tracking-[-0.02em]">Cómo se hace <em className="text-oxblood">una pieza</em></h2>
          <ul className="mt-10 space-y-2.5">
            {formats.map((f) => <li key={f.name} className="flex items-baseline gap-3 text-[15px]"><span className="h-px w-5 bg-ink/40" /><span className="font-display text-[19px]">{f.name}</span><span className="text-ink-soft">— {f.note}</span></li>)}
          </ul>
        </div>
        <ol data-stops className="relative lg:col-span-6 lg:col-start-7">
          <span data-path aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px origin-top bg-oxblood/50" />
          {steps.map((s, i) => (
            <li key={s.n} data-stop className="relative flex gap-7 pb-14 last:pb-0">
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-oxblood/40 bg-[#ece3d5] font-display text-[18px] italic text-oxblood">{String(i + 1).padStart(2, "0")}</span>
              <div className="pt-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-ink-soft">Parada {i + 1}</p>
                <h3 className="mt-2 font-display text-[38px] leading-none">{s.title}</h3>
                <p className="mt-3 max-w-[28rem] text-[16px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Patrons() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-p]"), { opacity: 0, letterSpacing: "0.5em", duration: 1.6, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} aria-labelledby="pa-title" className="mx-auto max-w-[1000px] px-5 py-[clamp(110px,14vw,200px)] text-center sm:px-8">
      <p className={kicker}>Con el apoyo de</p>
      <h2 id="pa-title" className="mt-5 font-display text-[clamp(44px,5.4vw,84px)] italic leading-none">Mecenas</h2>
      <span aria-hidden className="mx-auto mt-10 block h-px w-24 bg-oxblood/50" />
      <ul className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {brands.map((b) => <li key={b} data-p className="font-display text-[clamp(20px,2vw,28px)] uppercase tracking-[0.18em]">{b}</li>)}
      </ul>
    </section>
  );
}

function Artist({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelector(".g-frame"), { opacity: 0, y: 40, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    const s = new SplitText(root.querySelector("[data-txt]")!, { type: "lines", mask: "lines" });
    gsap.from(s.lines, { yPercent: 100, duration: 1.3, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.querySelector("[data-txt]"), start: "top 85%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="ar-title" className="mx-auto max-w-[1200px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="g-light" aria-hidden />
          <div className="g-frame">
            <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "#d6c3a9" }}>
              <img src={portrait.src} srcSet={portrait.srcSet} sizes="420px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
            </div>
          </div>
        </div>
        <div>
          <p className={kicker}>Sobre la artista</p>
          <h2 id="ar-title" className="mt-5 font-display text-[clamp(52px,6.4vw,104px)] leading-[0.92]">Steff <em className="text-oxblood">Ramírez</em></h2>
          <p className="mt-3 text-[13px] text-ink-soft">Creadora de contenido UGC · Moda, belleza, lifestyle y momlife</p>
          <p data-txt className="mt-8 text-[19px] leading-[1.75]">Su trabajo se siente como la recomendación de una amiga, no como un anuncio. Graba en casa, con luz natural, con cuidado y mucha cercanía: piezas verticales pensadas para que alguien deje de deslizar.</p>
        </div>
      </div>
    </section>
  );
}

function Info() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="in-title" className="border-t border-ink/15 bg-[#f8f3ea] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <p className={kicker}>Información práctica</p>
        <h2 id="in-title" className="mt-5 font-display text-[clamp(48px,6vw,96px)] leading-[0.95]">Antes de tu <em className="text-oxblood">visita</em></h2>
        <ul className="mt-14">
          {faqs.map((f, i) => (
            <li key={f.q} className="border-t border-ink/15 last:border-b">
              <h3>
                <button type="button" aria-expanded={open === i} aria-controls={`gq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group grid w-full cursor-pointer grid-cols-[48px_1fr_auto] items-baseline py-6 text-left">
                  <span className="font-display text-[15px] italic text-ink-soft">{roman[i] ?? i + 1}{i >= 4 ? "" : ""}</span>
                  <span className={`font-display text-[clamp(22px,2.4vw,32px)] leading-tight transition-colors ${open === i ? "italic text-oxblood" : "group-hover:text-oxblood"}`}>{f.q}</span>
                  <span aria-hidden className={`ml-6 text-[22px] transition-transform duration-500 ${open === i ? "rotate-45 text-oxblood" : ""}`}>+</span>
                </button>
              </h3>
              <div id={`gq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
                <div><p className="max-w-[40rem] pb-7 pl-12 text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Ticket({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-ticket]"), { y: 80, rotate: -3, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="ti-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[88svh] items-center justify-center overflow-hidden px-5 py-24" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <div data-ticket className="g-ticket grid w-full max-w-[860px] overflow-hidden rounded-[22px] bg-[#fbf8f2] shadow-[0_50px_80px_-50px_rgba(42,27,22,0.6)] sm:grid-cols-[1fr_260px]">
          <div className="p-8 sm:p-12">
            <p className={kicker}>Entrada · Colaboración</p>
            <h2 id="ti-title" className="mt-5 font-display text-[clamp(48px,7vw,104px)] leading-[0.9]">Reserva <em className="text-oxblood">tu pieza</em></h2>
            <p className="mt-5 max-w-[26rem] text-[16px] leading-relaxed text-ink-soft">Cuéntame qué quieres contar. Te respondo con ideas, no con plantillas.</p>
            <button type="button" onClick={onContact} className="group mt-8 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
              Escríbeme<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
            </button>
          </div>
          <div className="g-stub flex flex-col justify-between gap-6 p-8 text-center sm:p-10">
            <p className="font-display text-[44px] italic leading-none text-oxblood">Nº 01</p>
            <div className="text-[13px] text-ink-soft">
              <a href={`mailto:${EMAIL}`} className="break-words text-[12px] underline decoration-ink/30 underline-offset-4">{EMAIL}</a>
              <button type="button" onClick={copy} className="mt-2 block w-full cursor-pointer text-[11px] uppercase tracking-[0.22em]">{done ? "copiado" : "copiar"}</button>
            </div>
            <ul className="flex justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.2em]">
              {socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-oxblood">{s.label}<span className="sr-only"> (se abre en una pestaña nueva)</span></a></li>)}
            </ul>
          </div>
        </div>
        <p className="absolute bottom-6 text-[12px] text-ink-soft">© 2026 Steff Ramírez · UGC Creator</p>
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
          <Rooms portrait={portrait} />
          <Tour />
          <Patrons />
          <Artist portrait={portrait} />
          <Info />
          <Ticket onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
