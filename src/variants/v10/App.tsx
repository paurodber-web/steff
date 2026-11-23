import { useMemo, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useCopy } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft";
const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));
const norm = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const Glass = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);

/* ------------------------------------------------------------------ HERO: a search types the name, the cover is the result */
function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      back={<><div aria-hidden className="v2-glow" /><div aria-hidden data-arch className="v2-arch" /></>}
      front={
        <div aria-hidden data-search className="pointer-events-none absolute inset-x-0 top-[42%] z-[45] mx-auto flex w-[min(88%,460px)] items-center gap-3 rounded-full bg-cream/90 px-5 py-4 shadow-[0_30px_60px_-30px_rgba(42,27,22,0.6)] backdrop-blur-md">
          <Glass />
          <span data-typed className="flex-1 text-[17px] font-medium" />
          <span className="ex-caret h-5 w-px bg-ink" />
        </div>
      }
      motion={(root) => {
        const typed = root.querySelector<HTMLElement>("[data-typed]")!;
        const bar = root.querySelector("[data-search]");
        const text = "Steff Ramírez";
        const o = { n: 0 };
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.set(root.querySelectorAll("[data-l], [data-fig], [data-arch]"), { opacity: 0 })
          .from(bar, { y: 30, opacity: 0, scale: 0.9, duration: 0.7 }, 0.2)
          .to(o, { n: text.length, duration: 1, ease: "none", onUpdate: () => (typed.textContent = text.slice(0, Math.round(o.n))) }, 0.6)
          .to(bar, { top: "6%", scale: 0.8, opacity: 0, duration: 0.8, ease: "expo.inOut" }, 1.9)
          .fromTo(root.querySelectorAll("[data-l]"), { opacity: 0, yPercent: 40, scale: 0.6 }, { opacity: 1, yPercent: 0, scale: 1, duration: 1.1, stagger: 0.06 }, 2.1)
          .fromTo(root.querySelector("[data-arch]"), { opacity: 0, scaleY: 0, transformOrigin: "50% 100%" }, { opacity: 1, scaleY: 1, duration: 1.3 }, 2.2)
          .fromTo(root.querySelector("[data-fig]"), { opacity: 0, yPercent: 15 }, { opacity: 1, yPercent: 0, duration: 1.4 }, 2.3)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 2.4);
        gsap.to(root.querySelector(".v2-title"), { scale: 0.7, yPercent: -30, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } });
        return () => (typed.textContent = text);
      }}
    />
  );
}

/* ------------------------------------------------------------------ EXPLORE: real search + masonry */
function Explore({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const results = useMemo(() => {
    const n = norm(q.trim());
    return all.filter(({ s, item }) => (!tag || s.id === tag) && (!n || norm(`${s.name} ${item.brand} ${item.format} ${item.hook}`).includes(n)));
  }, [q, tag]);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-tile]").forEach((t) => {
      gsap.fromTo(t, { scale: 0.82, opacity: 0.4 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: t, start: "top 98%", end: "top 70%", scrub: 0.4 } });
    });
  }, [results.length]);
  const heights = ["aspect-[9/16]", "aspect-[4/5]", "aspect-[3/4]", "aspect-[9/14]"];
  return (
    <section ref={ref} id="portafolio" aria-labelledby="e-title" className="mx-auto max-w-[1320px] px-3 py-[clamp(110px,14vw,200px)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[760px] text-center">
        <p className={kicker}>Explorar</p>
        <h2 id="e-title" className="mt-5 font-display text-[clamp(44px,7vw,108px)] leading-[0.95] tracking-[-0.02em]">Busca lo que <span className="text-oxblood">tu marca necesita</span></h2>
        <label className="mt-10 flex items-center gap-3 rounded-full bg-[#fbf8f2] px-5 py-4 shadow-[0_24px_50px_-34px_rgba(42,27,22,0.6)] ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-oxblood">
          <Glass />
          <span className="sr-only">Buscar en el portafolio</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Prueba: unboxing, rutina, blazer…" className="flex-1 bg-transparent text-[17px] outline-none placeholder:text-ink/40" />
          {q && <button type="button" onClick={() => setQ("")} className="cursor-pointer text-[14px] text-ink-soft hover:text-ink">Borrar</button>}
        </label>
        <div role="group" aria-label="Filtrar por mundo" className="mt-4 flex flex-wrap justify-center gap-2">
          {services.map((s) => (
            <button key={s.id} id={s.id} type="button" aria-pressed={tag === s.id} onClick={() => setTag(tag === s.id ? null : s.id)} className={`scroll-mt-24 cursor-pointer rounded-full px-4 py-2 text-[14px] transition-colors ${tag === s.id ? "bg-ink text-cream" : "bg-[#f8f3ea] hover:bg-sand"}`}>#{s.name.toLowerCase()}</button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 text-[14px] text-ink-soft">{results.length} {results.length === 1 ? "resultado" : "resultados"}</p>
      </div>
      {results.length ? (
        <ul className="mt-10 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {results.map(({ s, item }, i) => (
            <li key={item.brand} data-tile className="mb-3 break-inside-avoid">
              <div className={`group relative overflow-hidden rounded-[22px] ${heights[i % heights.length]}`}>
                <Shot img={portrait} item={item} sizes="(min-width:1024px) 25vw, 50vw" className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                <p className="absolute inset-x-3 top-[16%] text-center"><span className="box-decoration-clone rounded bg-cream px-1.5 py-0.5 text-[12px] font-semibold leading-[1.75] text-ink sm:text-[13px]">{item.hook}</span></p>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(30,14,12,0.7)] to-transparent p-3 pt-10 text-cream">
                  <p className="font-display text-[18px] leading-tight">{item.brand}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">#{s.name.toLowerCase()} · {item.format} · {item.duration}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-12 max-w-[420px] rounded-[28px] bg-[#f8f3ea] p-8 text-center">
          <p className="font-display text-[26px]">Aún no lo he grabado…</p>
          <p className="mt-2 text-[15px] text-ink-soft">¿Sería tu marca la primera? Escríbeme y lo hacemos.</p>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ GUIDE: horizontal track driven by vertical scroll */
function Guide() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const track = root.querySelector<HTMLElement>("[data-track]")!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.to(track, { x: () => -(track.scrollWidth - track.parentElement!.clientWidth), ease: "none", scrollTrigger: { trigger: root.querySelector("[data-pin]"), start: "top 15%", end: () => `+=${track.scrollWidth}`, pin: true, scrub: 0.6, invalidateOnRefresh: true } });
    });
    return () => mm.revert();
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="g-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <p className={kicker}>Cómo trabajo</p>
        <h2 id="g-title" className="mt-5 font-display text-[clamp(44px,6.4vw,96px)] leading-[0.95] tracking-[-0.02em]">Guía <span className="text-oxblood">rápida</span></h2>
      </div>
      <div data-pin className="mt-12 overflow-hidden">
        <ol data-track className="flex flex-col gap-4 px-5 sm:px-8 md:w-max md:flex-row md:gap-5 lg:px-12">
          {steps.map((s, i) => (
            <li key={s.n} className="flex min-h-[320px] flex-col justify-between rounded-[32px] p-8 md:h-[56svh] md:w-[min(64vw,560px)]" style={{ background: ["#fbf8f2", "#ecd7cb", "#e3d1b8", "#5c1a1f"][i], color: i === 3 ? "#f4eee3" : "#2a1b16" }}>
              <p className="font-display text-[clamp(72px,9vw,140px)] leading-[0.8]">{s.n}</p>
              <div>
                <h3 className="font-display text-[clamp(34px,3.6vw,52px)] leading-none">{s.title}</h3>
                <p className="mt-3 max-w-[28rem] text-[17px] leading-relaxed opacity-85">{s.text}</p>
              </div>
            </li>
          ))}
          <li className="flex min-h-[200px] flex-col justify-center rounded-[32px] bg-ink p-8 text-cream md:h-[56svh] md:w-[min(64vw,460px)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cream/55">Formatos</p>
            <ul className="mt-4 flex flex-wrap gap-2">{formats.map((f) => <li key={f.name} title={f.note} className="rounded-full border border-cream/20 px-3.5 py-2 text-[14px]">{f.name}</li>)}</ul>
          </li>
        </ol>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-ph]"), { clipPath: "circle(12% at 50% 35%)" }, { clipPath: "circle(80% at 50% 50%)", ease: "none", scrollTrigger: { trigger: root, start: "top 85%", end: "center 55%", scrub: 0.5 } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div data-ph className="relative aspect-[4/5] overflow-hidden rounded-[36px]" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
        </div>
        <div>
          <p className={kicker}>Cuenta destacada</p>
          <h2 id="a-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] leading-[0.95] tracking-[-0.02em]">Hola, soy <span className="text-oxblood">Steff</span></h2>
          <p className="mt-6 text-[19px] leading-[1.7]">Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural.</p>
          <p className="mt-8 text-[12px] uppercase tracking-[0.22em] text-ink-soft">Han confiado en mí</p>
          <ul className="mt-3 flex flex-wrap gap-2">{brands.map((b) => <li key={b} className="rounded-full bg-[#f8f3ea] px-3.5 py-2 text-[14px]">{b}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const list = faqs.map((f, i) => ({ ...f, i })).filter((f) => !q.trim() || norm(`${f.q} ${f.a}`).includes(norm(q.trim())));
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[860px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Ayuda</p>
      <h2 id="f-title" className="mt-5 text-center font-display text-[clamp(44px,6vw,88px)] leading-[0.95]">¿Tienes <span className="text-oxblood">una duda?</span></h2>
      <label className="mx-auto mt-10 flex max-w-[560px] items-center gap-3 rounded-full bg-[#fbf8f2] px-5 py-3.5 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-oxblood">
        <Glass /><span className="sr-only">Buscar en las preguntas</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca: derechos, envío, precio…" className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-ink/40" />
      </label>
      <ul className="mt-8 space-y-2.5">
        {list.map((f) => (
          <li key={f.q} className="rounded-[24px] bg-[#f8f3ea]">
            <h3>
              <button type="button" aria-expanded={open === f.i} aria-controls={`xq${f.i}`} onClick={() => setOpen(open === f.i ? null : f.i)} className="flex w-full cursor-pointer items-center gap-4 p-5 text-left">
                <span className="flex-1 font-display text-[clamp(19px,2vw,24px)] leading-tight">{f.q}</span>
                <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 ${open === f.i ? "rotate-45 bg-oxblood text-cream" : "bg-ink/5"}`}>+</span>
              </button>
            </h3>
            <div id={`xq${f.i}`} role="region" className="faq-panel" data-open={open === f.i} inert={open !== f.i}>
              <div><p className="px-5 pb-6 pr-16 text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
            </div>
          </li>
        ))}
        {!list.length && <li className="rounded-[24px] bg-[#f8f3ea] p-6 text-center text-[15px] text-ink-soft">No encuentro esa pregunta. Escríbeme y te respondo personalmente.</li>}
      </ul>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const { copy, done } = useCopy(EMAIL);
  return (
    <section id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="c-title" className="mt-6 font-display text-[clamp(56px,9.6vw,160px)] leading-[0.9] tracking-[-0.02em]">¿Lo encontraste? <span className="text-oxblood">Hablemos</span></h2>
        <button type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
          Escríbeme<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
        </button>
        <p className="mt-6 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4">{done ? "copiado" : "copiar"}</button></p>
        <ul className="mt-8 flex gap-6 text-[11px] font-medium uppercase tracking-[0.24em]">
          {socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-oxblood">{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a></li>)}
        </ul>
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
          <Explore portrait={portrait} />
          <Guide />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
