import { useEffect, useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useCopy, useFinePointer } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft";

/* ------------------------------------------------------------------ HERO: clips land around the figure */
const fly = [
  { k: "moda", i: 0, cls: "left-[3%] top-[22%] w-[18vw] max-w-[150px] -rotate-6 lg:left-[6%] lg:top-[16%]" },
  { k: "belleza", i: 0, cls: "right-[3%] top-[18%] w-[16vw] max-w-[140px] rotate-6 lg:right-[7%] lg:top-[14%]" },
  { k: "lifestyle", i: 1, cls: "left-[8%] bottom-[10%] w-[15vw] max-w-[130px] rotate-3 hidden sm:block lg:left-[14%]" },
  { k: "momlife", i: 1, cls: "right-[7%] bottom-[12%] w-[15vw] max-w-[130px] -rotate-3 hidden sm:block lg:right-[14%]" },
] as const;
function Hero({ hero, portrait, onMenu, onContact }: { hero: Img; portrait: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      flanks={false}
      title={<Letters />}
      back={
        <>
          <div aria-hidden className="v2-glow" />
          <div aria-hidden className="mb-grid absolute inset-0 -z-10" />
        </>
      }
      front={
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[15]">
          {fly.map((f) => (
            <div key={f.k} data-fly className={`absolute ${f.cls}`}>
              <div className="relative aspect-[9/16] overflow-hidden rounded-[14px] shadow-[0_24px_40px_-20px_rgba(42,27,22,0.55)] ring-[5px] ring-[#fbf8f2]">
                <Shot img={portrait} item={portfolio[f.k][f.i]} sizes="150px" className="absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { scale: 0.92, opacity: 0, duration: 1.1 })
          .from(root.querySelectorAll("[data-l]"), { yPercent: 70, opacity: 0, duration: 1.2, stagger: 0.06 }, 0.3)
          .from(root.querySelector("[data-fig]"), { yPercent: 15, opacity: 0, duration: 1.4 }, 0.5)
          .from(root.querySelectorAll("[data-fly]"), { x: (i) => (i % 2 ? 500 : -500), y: (i) => (i < 2 ? -300 : 300), rotate: (i) => (i % 2 ? 40 : -40), opacity: 0, duration: 1.4, ease: "back.out(1.2)", stagger: 0.12 }, 0.7)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 1.4);
        root.querySelectorAll("[data-fly]").forEach((f, i) => gsap.to(f, { x: (i % 2 ? 1 : -1) * 220, y: i < 2 ? -80 : 120, rotate: (i % 2 ? 1 : -1) * 14, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } }));
      }}
    />
  );
}

/* ------------------------------------------------------------------ the canvas */
const W = 2200;
const H = 1400;
const clusters: Record<string, { x: number; y: number }> = { moda: { x: 140, y: 120 }, belleza: { x: 1220, y: 90 }, lifestyle: { x: 240, y: 760 }, momlife: { x: 1300, y: 740 } };
const offs = [{ x: 0, y: 150, r: -3 }, { x: 260, y: 100, r: 2 }, { x: 520, y: 170, r: -1.5 }];

function Card({ img, item }: { img: Img; item: VideoItem }) {
  return (
    <figure className="group w-[220px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] bg-cream shadow-[0_30px_50px_-30px_rgba(42,27,22,0.6)] ring-1 ring-ink/10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
        <Shot img={img} item={item} sizes="220px" className="absolute inset-0" />
        <p className="absolute inset-x-3 top-[20%] text-center"><span className="box-decoration-clone rounded bg-cream px-1.5 py-0.5 text-[12px] font-semibold leading-[1.75] text-ink">{item.hook}</span></p>
      </div>
      <figcaption className="mt-2 flex justify-between gap-2 px-1 text-[12px]"><span className="font-medium">{item.brand}</span><span className="text-ink-soft">{item.format} · {item.duration}</span></figcaption>
    </figure>
  );
}

function Board({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const pointer = useFinePointer();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const fine = pointer && wide;
  const [pos, setPos] = useState({ x: 0, y: 0, vw: 1, vh: 1 });
  const drag = useRef<Draggable | null>(null);

  useEffect(() => {
    const v = view.current;
    const c = canvas.current;
    if (!fine || !v || !c) return;
    gsap.registerPlugin(Draggable);
    const sync = () => setPos({ x: -Number(gsap.getProperty(c, "x")), y: -Number(gsap.getProperty(c, "y")), vw: v.clientWidth, vh: v.clientHeight });
    gsap.set(c, { x: -(W - v.clientWidth) / 2 + 200, y: -(H - v.clientHeight) / 2 });
    const [d] = Draggable.create(c, { type: "x,y", bounds: v, edgeResistance: 0.85, onDrag: sync, onThrowUpdate: sync, cursor: "grab", activeCursor: "grabbing" });
    drag.current = d;
    sync();
    return () => d.kill();
  }, [fine]);

  const goTo = (id: string) => {
    const v = view.current;
    const c = canvas.current;
    if (!v || !c) return;
    const p = clusters[id];
    const x = Math.min(0, Math.max(v.clientWidth - W, -(p.x + 390 - v.clientWidth / 2)));
    const y = Math.min(0, Math.max(v.clientHeight - H, -(p.y + 260 - v.clientHeight / 2)));
    gsap.to(c, { x, y, duration: 1.1, ease: "expo.inOut", onUpdate: () => setPos({ x: -x, y: -y, vw: v.clientWidth, vh: v.clientHeight }), onComplete: () => drag.current?.update() });
  };

  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-pin]"), { scale: 0.6, opacity: 0, rotate: () => gsap.utils.random(-14, 14), duration: 1, ease: "back.out(1.6)", stagger: 0.05, scrollTrigger: { trigger: root.querySelector("[data-view]"), start: "top 75%", once: true } });
  });

  return (
    <section ref={ref} id="portafolio" aria-labelledby="b-title" className="py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <div>
          <p className={kicker}>Portafolio</p>
          <h2 id="b-title" className="mt-5 max-w-[14ch] font-display text-[clamp(44px,7vw,108px)] leading-[0.95] tracking-[-0.02em]">Mi tablero <em className="text-oxblood">de trabajo</em></h2>
        </div>
        <p className="max-w-[20rem] text-[15px] text-ink-soft">{fine ? "Arrastra el tablero para explorarlo o salta a un mundo." : "Desliza cada mundo para ver sus piezas."}</p>
      </div>

      {fine ? (
        <div className="relative mt-12 px-3 sm:px-4 lg:px-5">
          <div ref={view} data-view className="mb-grid relative h-[78svh] min-h-[520px] overflow-hidden rounded-[40px] bg-[#f8f3ea] ring-1 ring-ink/10 lg:rounded-[52px]">
            <div ref={canvas} className="absolute left-0 top-0" style={{ width: W, height: H }}>
              {services.map((s) => {
                const c = clusters[s.id];
                return (
                  <div key={s.id} id={s.id}>
                    <div data-pin className="absolute rounded-[18px] bg-ink px-5 py-4 text-cream shadow-lg" style={{ left: c.x, top: c.y - 10 }}>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-cream/60">{s.n} · {portfolio[s.id].length} piezas</p>
                      <h3 className="mt-1 font-display text-[34px] leading-none">{s.name}</h3>
                    </div>
                    {portfolio[s.id].map((it, k) => (
                      <div key={it.brand} data-pin className="absolute" style={{ left: c.x + offs[k].x, top: c.y + offs[k].y, rotate: `${offs[k].r}deg` }}>
                        <Card img={portrait} item={it} />
                      </div>
                    ))}
                  </div>
                );
              })}
              <div data-pin className="absolute w-[300px] rounded-[18px] bg-oxblood p-5 text-cream" style={{ left: 920, top: 640, rotate: "2deg" }}>
                <p className="text-[10px] uppercase tracking-[0.24em] text-cream/60">Formatos</p>
                <p className="mt-2 font-display text-[20px] leading-snug">{formats.map((f) => f.name).join(" · ")}</p>
              </div>
            </div>
            {/* minimap */}
            <div className="absolute bottom-4 right-4 w-[200px] rounded-[18px] bg-cream/90 p-3 shadow-lg backdrop-blur">
              <div className="relative overflow-hidden rounded-lg bg-[#ece3d5]" style={{ aspectRatio: `${W}/${H}` }}>
                {services.map((s) => (
                  <button key={s.id} type="button" onClick={() => goTo(s.id)} aria-label={`Ir a ${s.name}`} className="absolute rounded bg-ink/25 hover:bg-oxblood" style={{ left: `${(clusters[s.id].x / W) * 100}%`, top: `${(clusters[s.id].y / H) * 100}%`, width: `${(760 / W) * 100}%`, height: `${(560 / H) * 100}%` }} />
                ))}
                <span aria-hidden className="pointer-events-none absolute rounded border-2 border-oxblood" style={{ left: `${(pos.x / W) * 100}%`, top: `${(pos.y / H) * 100}%`, width: `${(pos.vw / W) * 100}%`, height: `${(pos.vh / H) * 100}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {services.map((s) => <button key={s.id} type="button" onClick={() => goTo(s.id)} className="cursor-pointer rounded-full bg-ink/5 px-2.5 py-1 text-[11px] hover:bg-ink hover:text-cream">{s.name}</button>)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div data-view className="mt-10 space-y-12">
          {services.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-20">
              <div className="flex items-baseline justify-between px-5 sm:px-8"><h3 className="font-display text-[36px] leading-none">{s.name}</h3><p className="text-[13px] text-ink-soft">{s.desc}</p></div>
              <ul className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 sm:px-8">
                {portfolio[s.id].map((it) => <li key={it.brand} data-pin className="shrink-0 snap-start"><Card img={portrait} item={it} /></li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ process: notes joined by a drawn thread */
function Thread() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-thread]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-notes]"), start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
    gsap.from(root.querySelectorAll("[data-note]"), { y: 60, opacity: 0, rotate: (i) => (i % 2 ? 6 : -6), duration: 1.1, ease: "back.out(1.5)", stagger: 0.12, scrollTrigger: { trigger: root.querySelector("[data-notes]"), start: "top 75%", once: true } });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="t-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <p className={kicker}>Cómo trabajo</p>
        <h2 id="t-title" className="mt-5 font-display text-[clamp(44px,6.4vw,96px)] leading-[0.95] tracking-[-0.02em]">Del tablero <em className="text-oxblood">a tu feed</em></h2>
        <div data-notes className="relative mt-16">
          <svg aria-hidden viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute left-0 top-[18%] hidden h-[160px] w-full lg:block">
            <path data-thread d="M60,120 C200,10 300,190 420,90 S640,20 720,120 S900,170 960,70" fill="none" stroke="#5c1a1f" strokeWidth="1.5" strokeDasharray="1" pathLength={1} strokeLinecap="round" />
          </svg>
          <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n} data-note className="rounded-[24px] bg-[#fbf8f2] p-6 shadow-[0_30px_50px_-34px_rgba(42,27,22,0.55)]" style={{ marginTop: `${[0, 70, 20, 90][i]}px` }}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-oxblood font-display text-[18px] italic text-cream">{s.n}</span>
                <h3 className="mt-5 font-display text-[30px] leading-none">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-ph]"), { clipPath: "inset(30% 20% 30% 20% round 30px)", rotate: -4 }, { clipPath: "inset(0% 0% 0% 0% round 30px)", rotate: 0, ease: "none", scrollTrigger: { trigger: root, start: "top 85%", end: "center 55%", scrub: 0.5 } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div data-ph className="relative aspect-[4/5] overflow-hidden" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
        </div>
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="a-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] leading-[0.95] tracking-[-0.02em]">La mente <em className="text-oxblood">detrás del tablero</em></h2>
          <p className="mt-6 text-[19px] leading-[1.7]">Soy Steff. Pienso cada pieza antes de grabarla: idea, gancho, estructura. Contenido que se siente como la recomendación de una amiga, no como un anuncio.</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {brands.map((b) => <li key={b} className="rounded-full border border-ink/15 px-3.5 py-2 text-[14px]">{b}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[1000px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Notas</p>
      <h2 id="f-title" className="mt-5 text-center font-display text-[clamp(44px,6vw,88px)] leading-[0.95]">Antes de <em className="text-oxblood">empezar</em></h2>
      <ul className="mt-12 grid gap-3 md:grid-cols-2">
        {faqs.map((f, i) => (
          <li key={f.q} className={`rounded-[24px] transition-colors ${open === i ? "bg-ink text-cream" : "bg-[#f8f3ea]"}`}>
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`nq${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-start gap-4 p-5 text-left sm:p-6">
                <span className="flex-1 font-display text-[clamp(20px,2vw,26px)] leading-tight">{f.q}</span>
                <span aria-hidden className={`mt-1 transition-transform duration-500 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
            </h3>
            <div id={`nq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="px-5 pb-6 text-[16px] leading-relaxed opacity-85 sm:px-6">{f.a}</p></div>
            </div>
          </li>
        ))}
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
        <h2 id="c-title" className="mt-6 font-display text-[clamp(56px,9.6vw,160px)] leading-[0.9] tracking-[-0.02em]">Añade tu marca <em className="text-oxblood">al tablero</em></h2>
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
          <Hero hero={hero} portrait={portrait} onMenu={openMenu} onContact={openContact} />
          <Board portrait={portrait} />
          <Thread />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
