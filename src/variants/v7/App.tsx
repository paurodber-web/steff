import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, SplitText, useMotion, useCopy, useReduced, reg } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";
const verbs = ["se siente real", "conecta", "vende", "enamora"];

function Rotator() {
  const [i, setI] = useState(0);
  const reduced = useReduced();
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % verbs.length), 2200);
    return () => window.clearInterval(id);
  }, [reduced]);
  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
      <span key={i} className="k-roll block italic text-oxblood">{verbs[i]}</span>
    </span>
  );
}

function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      back={<div aria-hidden className="v2-glow" />}
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        const ls = root.querySelectorAll("[data-l]");
        tl.from(root, { clipPath: "inset(0 0 100% 0 round 52px)", duration: 1.3, ease: "expo.inOut" })
          .from(ls, { yPercent: (i) => (i % 2 ? 120 : -120), rotate: (i) => (i % 2 ? 8 : -8), opacity: 0, duration: 1.4, stagger: 0.06 }, 0.5)
          .from(root.querySelector("[data-fig]"), { clipPath: "inset(0 0 100% 0)", duration: 1.6 }, 0.8)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 1, stagger: 0.06 }, 1.5);
        // letters scatter at different speeds as you leave
        ls.forEach((l, i) => gsap.to(l, { yPercent: [-40, 30, -70, 50, -25][i % 5], ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } }));
      }}
    />
  );
}

/* ------------------------------------------------------------------ MUNDOS: sticky kinetic stage */
const spots = [
  "left-[5%] top-[20%] lg:left-[10%] lg:top-[16%] -rotate-6",
  "right-[5%] top-[30%] lg:right-[12%] lg:top-[24%] rotate-6",
  "left-[34%] bottom-[5%] lg:left-[38%] lg:bottom-[4%] rotate-2",
];
function Worlds({ portrait }: { portrait: Img }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    reg();
    const el = track.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setActive(Math.min(services.length - 1, Math.floor(self.progress * services.length))),
    });
    return () => st.kill();
  }, []);
  return (
    <section id="portafolio" aria-labelledby="w-title">
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-[clamp(120px,15vw,220px)] text-center sm:px-8">
        <p className={kicker}>Portafolio</p>
        <h2 id="w-title" className="mt-6 font-display text-[clamp(52px,8vw,132px)] leading-[0.95] tracking-[-0.02em]">Contenido que<br /><Rotator /></h2>
      </div>
      <div ref={track} className="relative" style={{ height: `${services.length * 110}svh` }}>
        {services.map((s, i) => (
          <span key={s.id} id={s.id} aria-hidden className="absolute left-0 h-px w-px" style={{ top: `${i * 110}svh` }} />
        ))}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
            <div className="relative h-[1em] w-full overflow-hidden text-center font-display text-[clamp(72px,17vw,300px)] leading-none tracking-[-0.03em]">
              {services.map((s, i) => (
                <span key={s.id} aria-hidden={i !== active} className="k-word absolute inset-x-0 top-0" data-state={i === active ? "on" : i < active ? "past" : "next"}>
                  {i % 2 ? <em className="text-oxblood">{s.name}</em> : s.name}
                </span>
              ))}
            </div>
          </div>
          <p className={`${kicker} absolute inset-x-0 top-[16%] text-center lg:top-[10%]`}>{services[active].n} / 04 · {services[active].desc}</p>
          {services.map((s, i) =>
            portfolio[s.id].map((it, k) => (
              <figure key={it.brand} className={`k-clip absolute z-0 w-[28vw] max-w-[210px] lg:w-[12vw] ${spots[k]}`} data-state={i === active ? "on" : i < active ? "past" : "next"} style={{ transitionDelay: i === active ? `${k * 0.09}s` : "0s" }}>
                <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] shadow-[0_40px_60px_-30px_rgba(42,27,22,0.6)]">
                  <Shot img={portrait} item={it} sizes="230px" className="absolute inset-0" />
                </div>
                <figcaption className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-ink-soft">{it.brand} · {it.format}</figcaption>
              </figure>
            )),
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FORMATS: rows that travel with the scroll */
function Rows() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const rows = root.querySelectorAll<HTMLElement>("[data-row]");
    rows.forEach((r, i) => gsap.fromTo(r, { xPercent: i % 2 ? -30 : 0 }, { xPercent: i % 2 ? 0 : -30, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.4 } }));
    const skew = Array.from(rows).map((r) => gsap.quickTo(r, "skewX", { duration: 0.5, ease: "power3.out" }));
    const st = ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onUpdate: (self) => skew.forEach((q) => q(gsap.utils.clamp(-8, 8, self.getVelocity() / -260))) });
    return () => st.kill();
  });
  const names = formats.map((f) => f.name);
  return (
    <section ref={ref} aria-label="Formatos" className="overflow-hidden py-[clamp(80px,10vw,140px)]">
      {[0, 1].map((r) => (
        <div key={r} data-row aria-hidden className="flex w-max items-center gap-10 whitespace-nowrap py-2">
          {[...names, ...names].map((n, i) => (
            <span key={i} className={`font-display text-[clamp(52px,8vw,140px)] leading-none ${(i + r) % 2 ? "italic text-oxblood" : "text-ink"}`}>{n} <span className="mx-4 text-[0.4em] text-ink/30">✦</span></span>
          ))}
        </div>
      ))}
      <ul className="sr-only">{formats.map((f) => <li key={f.name}>{f.name}: {f.note}</li>)}</ul>
    </section>
  );
}

function Process() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-step]").forEach((r) => {
      gsap.fromTo(r.querySelector("[data-t]"), { scale: 0.55, opacity: 0.25, transformOrigin: "0% 50%" }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: r, start: "top 90%", end: "top 45%", scrub: 0.5 } });
    });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="pr-title" className="mx-auto max-w-[1280px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <p className={kicker}>Cómo trabajo</p>
      <h2 id="pr-title" className="sr-only">Cómo trabajo</h2>
      <ol className="mt-8">
        {steps.map((s) => (
          <li key={s.n} data-step className="grid items-end gap-4 border-b border-ink/15 py-8 lg:grid-cols-12">
            <span className="font-display text-[18px] italic text-oxblood lg:col-span-1">{s.n}</span>
            <h3 data-t className="font-display text-[clamp(64px,11vw,190px)] leading-[0.85] tracking-[-0.03em] lg:col-span-7">{s.title}</h3>
            <p className="max-w-[24rem] text-[16px] leading-relaxed text-ink-soft lg:col-span-4">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Ring() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-ring]"), { rotate: -60 }, { rotate: 240, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } });
  });
  const text = brands.join("  ✦  ") + "  ✦  ";
  return (
    <section ref={ref} aria-labelledby="ri-title" className="relative grid place-items-center overflow-hidden bg-ink py-[clamp(80px,10vw,140px)] text-cream">
      <div className="relative aspect-square w-[min(92vw,760px)]">
        <svg data-ring aria-hidden viewBox="0 0 600 600" className="absolute inset-0 h-full w-full">
          <defs><path id="k-ring" d="M300,300 m-250,0 a250,250 0 1,1 500,0 a250,250 0 1,1 -500,0" /></defs>
          <text className="fill-current font-display" style={{ fontSize: 23.5, letterSpacing: "0.04em" }}><textPath href="#k-ring">{text}</textPath></text>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cream/60">{brands.length} marcas</p>
            <h2 id="ri-title" className="mt-4 font-display text-[clamp(40px,6vw,88px)] italic leading-[0.95]">Han confiado<br />en mí</h2>
          </div>
        </div>
      </div>
      <p className="sr-only">{brands.join(", ")}</p>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-txt]")!, { type: "words" });
    gsap.fromTo(s.words, { opacity: 0.15, scale: 0.7, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, ease: "none", stagger: 0.06, scrollTrigger: { trigger: root.querySelector("[data-txt]"), start: "top 85%", end: "bottom 60%", scrub: 0.5 } });
    gsap.fromTo(root.querySelector("[data-ph]"), { rotate: -8, scale: 0.8 }, { rotate: 4, scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1100px] px-5 py-[clamp(110px,14vw,200px)] text-center sm:px-8">
      <div data-ph className="relative mx-auto aspect-[3/4] w-[min(52vw,240px)] overflow-hidden rounded-t-full" style={{ background: "#d6c3a9" }}>
        <img src={portrait.src} srcSet={portrait.srcSet} sizes="240px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
      </div>
      <p className={`${kicker} mt-10`}>Sobre mí</p>
      <h2 id="a-title" className="sr-only">Sobre Steff</h2>
      <p data-txt className="mt-6 font-display text-[clamp(30px,4.2vw,62px)] leading-[1.15] tracking-[-0.01em]">
        Soy Steff. Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real.
      </p>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[1100px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <h2 id="f-title" className="font-display text-[clamp(52px,7vw,120px)] leading-[0.9] tracking-[-0.02em]">Pre<em className="text-oxblood">guntas</em></h2>
      <ul className="mt-12">
        {faqs.map((f, i) => (
          <li key={f.q} className="border-t border-ink/15 last:border-b">
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`kq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group flex w-full cursor-pointer items-baseline gap-5 py-6 text-left">
                <span className={`flex-1 font-display text-[clamp(24px,3vw,44px)] leading-tight transition-all duration-500 group-hover:translate-x-3 ${open === i ? "italic text-oxblood" : ""}`}>{f.q}</span>
                <span aria-hidden className={`text-[26px] transition-transform duration-500 ${open === i ? "rotate-45 text-oxblood" : ""}`}>+</span>
              </button>
            </h3>
            <div id={`kq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="max-w-[40rem] pb-7 text-[17px] leading-relaxed text-ink-soft">{f.a}</p></div>
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
    gsap.fromTo(root.querySelector("[data-run]"), { xPercent: 0 }, { xPercent: -40, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 } });
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[88svh] flex-col justify-center overflow-hidden py-24" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={`${kicker} text-center`}>Contacto</p>
        <h2 id="c-title" className="sr-only">Escríbeme</h2>
        <div data-run aria-hidden className="mt-6 flex w-max gap-8 whitespace-nowrap font-display text-[clamp(80px,15vw,260px)] leading-[0.9] tracking-[-0.03em]">
          {Array.from({ length: 4 }).map((_, i) => <span key={i}>escríbeme <em className="text-oxblood">✦</em></span>)}
        </div>
        <div className="mt-10 flex flex-col items-center px-5 text-center">
          <button type="button" onClick={onContact} className="group inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
            Cuéntame tu idea<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
          </button>
          <p className="mt-6 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4">{done ? "copiado" : "copiar"}</button></p>
          <ul className="mt-8 flex gap-6 text-[11px] font-medium uppercase tracking-[0.24em]">
            {socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-oxblood">{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a></li>)}
          </ul>
        </div>
        <p className="absolute inset-x-0 bottom-6 text-center text-[12px] text-ink-soft">© 2026 Steff Ramírez · UGC Creator</p>
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
          <Worlds portrait={portrait} />
          <Rows />
          <Process />
          <Ring />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
