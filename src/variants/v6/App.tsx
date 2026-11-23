import { useMemo, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useCopy } from "../kit";
import { Shell } from "../Shell";
import { EleHero } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft";
const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));
const dot: Record<string, string> = { moda: "#5c1a1f", belleza: "#c98f80", lifestyle: "#b39a73", momlife: "#2a1b16" };
const days = ["L", "M", "X", "J", "V", "S", "D"];

/* ------------------------------------------------------------------ HERO: flip-calendar letters + a week strip */
function Hero({ hero, portrait, onMenu, onContact }: { hero: Img; portrait: Img; onMenu: () => void; onContact: () => void }) {
  const week = [0, 2, 4, 5];
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      flanks={false}
      title={
        <span aria-hidden className="[perspective:900px]">
          {"STEFF".split("").map((c, i) => <span key={i} data-l className="ag-leaf inline-block">{c}</span>)}
        </span>
      }
      back={<><div aria-hidden className="v2-glow" /><div aria-hidden className="v2-arch" /></>}
      front={
        <div data-week aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[64px] z-30 hidden justify-center sm:flex lg:bottom-16">
          <div className="flex gap-1.5 rounded-[22px] bg-cream/80 p-2 shadow-[0_20px_40px_-24px_rgba(42,27,22,0.55)] backdrop-blur-md">
            {days.map((d, i) => {
              const k = week.indexOf(i);
              return (
                <div key={d} data-day className={`flex w-[58px] flex-col items-center gap-1.5 rounded-[16px] p-1.5 ${k >= 0 ? "bg-[#fbf8f2]" : ""}`}>
                  <span className="text-[11px] font-semibold text-ink-soft">{d}</span>
                  {k >= 0 ? (
                    <span data-post className="relative block h-[62px] w-[42px] overflow-hidden rounded-[8px]"><Shot img={portrait} item={all[k * 3].item} sizes="50px" className="absolute inset-0" /></span>
                  ) : (
                    <span className="block h-[62px] w-[42px] rounded-[8px] border border-dashed border-ink/15" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { clipPath: "inset(0% 0% 100% 0% round 52px)", duration: 1.2, ease: "expo.inOut" })
          .from(root.querySelectorAll("[data-l]"), { rotateX: -100, transformOrigin: "50% 0%", opacity: 0, duration: 1.2, ease: "back.out(1.6)", stagger: 0.1 }, 0.5)
          .from(root.querySelector("[data-fig]"), { yPercent: 16, opacity: 0, duration: 1.4 }, 0.8)
          .from(root.querySelector("[data-week]"), { y: 80, opacity: 0, duration: 1 }, 1.3)
          .from(root.querySelectorAll("[data-post]"), { scale: 0, rotate: -12, duration: 0.6, ease: "back.out(2.4)", stagger: 0.15 }, 1.7)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 1.5);
        gsap.to(root.querySelector("[data-week]"), { y: 120, opacity: 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "40% top", scrub: 0.5 } });
        gsap.to(root.querySelector(".v2-title"), { yPercent: -40, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } });
      }}
    />
  );
}

/* ------------------------------------------------------------------ CALENDAR */
const dates = [1, 3, 6, 9, 10, 13, 15, 17, 20, 22, 24, 27];
function Calendar({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState<string>("todo");
  const [sel, setSel] = useState(0);
  const byDate = useMemo(() => new Map(dates.map((d, i) => [d, i])), []);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-cell]"), { opacity: 0, y: 24, scale: 0.9, duration: 0.7, ease: "back.out(1.6)", stagger: { each: 0.02, from: "start" }, scrollTrigger: { trigger: root.querySelector("[data-cal]"), start: "top 80%", once: true } });
  });
  const cur = all[sel];
  return (
    <section ref={ref} id="portafolio" aria-labelledby="c-title" className="mx-auto max-w-[1320px] px-3 py-[clamp(110px,14vw,200px)] sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6 px-2">
        <div>
          <p className={kicker}>Portafolio</p>
          <h2 id="c-title" className="mt-5 max-w-[14ch] font-display text-[clamp(40px,6.4vw,96px)] font-bold leading-[0.95] tracking-[-0.04em]">Un mes de <span className="text-oxblood">contenido</span></h2>
        </div>
        <div role="group" aria-label="Filtrar por mundo" className="flex flex-wrap gap-2">
          {[{ id: "todo", name: "Todo" }, ...services].map((s) => (
            <button key={s.id} id={s.id === "todo" ? undefined : s.id} type="button" aria-pressed={show === s.id} onClick={() => setShow(s.id)} className={`flex scroll-mt-24 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors ${show === s.id ? "bg-ink text-cream" : "bg-[#f8f3ea] hover:bg-sand"}`}>
              {s.id !== "todo" && <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot[s.id] }} />}{s.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div data-cal className="rounded-[28px] bg-[#f8f3ea] p-2 sm:p-4 lg:rounded-[36px]">
          <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-center text-[11px] font-semibold text-ink-soft sm:gap-2">{days.map((d) => <span key={d}>{d}</span>)}</div>
          <ol className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: 28 }).map((_, k) => {
              const d = k + 1;
              const i = byDate.get(d);
              const p = i !== undefined ? all[i] : null;
              const dim = p && show !== "todo" && p.s.id !== show;
              return (
                <li key={d} data-cell className={`relative aspect-[3/4] overflow-hidden rounded-[10px] sm:rounded-[16px] ${p ? "" : "bg-cream/60"}`}>
                  {p ? (
                    <button type="button" onClick={() => setSel(i!)} aria-label={`Día ${d}: ${p.item.hook}, para ${p.item.brand}`} aria-pressed={sel === i} className={`group absolute inset-0 cursor-pointer transition-opacity duration-500 ${dim ? "opacity-20" : ""} ${sel === i ? "ring-2 ring-inset ring-oxblood" : ""}`}>
                      <Shot img={portrait} item={p.item} sizes="140px" className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute left-1 top-1 rounded-full bg-cream/90 px-1.5 text-[10px] font-semibold sm:left-2 sm:top-2 sm:text-[11px]">{d}</span>
                      <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-cream sm:h-2.5 sm:w-2.5" style={{ background: dot[p.s.id] }} />
                    </button>
                  ) : (
                    <span className="absolute left-1.5 top-1.5 text-[10px] font-medium text-ink/30 sm:left-2 sm:top-2 sm:text-[11px]">{d}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <aside aria-live="polite" className="overflow-hidden rounded-[28px] bg-ink text-cream lg:rounded-[36px]">
          <div key={sel} className="ag-swap grid h-full sm:grid-cols-[180px_1fr] lg:grid-cols-1">
            <div className="relative aspect-[4/5] sm:aspect-auto lg:aspect-[4/5]"><Shot img={portrait} item={cur.item} sizes="360px" className="absolute inset-0" /></div>
            <div className="p-6">
              <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/60"><span className="h-2 w-2 rounded-full" style={{ background: dot[cur.s.id] }} />Día {dates[sel]} · {cur.s.name}</p>
              <p className="mt-3 font-display text-[28px] font-bold leading-tight tracking-[-0.02em]">“{cur.item.hook}”</p>
              <p className="mt-2 text-[15px] text-cream/75">para {cur.item.brand} · {cur.item.format} · {cur.item.duration}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ GANTT */
const spans = [[1, 1], [2, 1], [3, 3], [6, 2]];
function Gantt() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-bar]").forEach((b, i) => gsap.fromTo(b, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: b, start: "top 85%", end: "top 55%", scrub: 0.5 }, delay: i * 0.1 }));
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="g-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <p className={kicker}>Cómo trabajo</p>
        <h2 id="g-title" className="mt-5 font-display text-[clamp(40px,6vw,92px)] font-bold leading-[0.95] tracking-[-0.04em]">Tu semana, <span className="text-oxblood">planificada</span></h2>
        <div className="mt-14 overflow-hidden rounded-[28px] bg-[#fbf8f2] p-4 sm:p-8">
          <div className="grid grid-cols-[110px_repeat(7,1fr)] gap-1 text-center text-[11px] font-semibold text-ink-soft sm:grid-cols-[180px_repeat(7,1fr)]">
            <span />{Array.from({ length: 7 }).map((_, d) => <span key={d}><span className="sm:hidden">{d + 1}</span><span className="hidden sm:inline">Día {d + 1}</span></span>)}
          </div>
          <ol className="mt-3 space-y-3">
            {steps.map((s, i) => (
              <li key={s.n} className="grid grid-cols-[110px_repeat(7,1fr)] items-center gap-1 sm:grid-cols-[180px_repeat(7,1fr)]">
                <span className="pr-2 font-display text-[16px] font-bold leading-tight sm:text-[20px]">{s.title}</span>
                <span data-bar className="h-7 origin-left rounded-full bg-oxblood sm:h-12" style={{ gridColumn: `${spans[i][0] + 1} / span ${spans[i][1]}`, opacity: 1 - i * 0.15 }} />
              </li>
            ))}
          </ol>
          <ul className="mt-8 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => <li key={s.n}><p className="font-display text-[15px] font-bold">{s.n} · {s.title}</p><p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{s.text}</p></li>)}
          </ul>
          <p className="mt-6 text-[12px] text-ink-soft">Plazos orientativos: entrega en 5–7 días desde que recibo el producto.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ BOOK a week */
function Book({ onContact }: { onContact: () => void }) {
  const weeks = useMemo(() => {
    const out: { label: string; date: Date }[] = [];
    const d = new Date();
    const monday = new Date(d);
    monday.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
    for (let i = 0; i < 4; i++) {
      const w = new Date(monday);
      w.setDate(monday.getDate() + i * 7);
      out.push({ label: w.toLocaleDateString("es", { day: "numeric", month: "short" }), date: w });
    }
    return out;
  }, []);
  const [w, setW] = useState(0);
  const [cat, setCat] = useState(services[0].name);
  const [n, setN] = useState(3);
  const subject = `Reserva: ${n} videos de ${cat} · semana del ${weeks[w].label}`;
  const body = `Hola Steff:\n\nMe gustaría reservar la semana del ${weeks[w].label} para ${n} videos de ${cat.toLowerCase()}.\n\nMarca:\nProducto:\nObjetivo:\n`;
  const chip = (on: boolean) => `cursor-pointer rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors ${on ? "bg-cream text-ink" : "border border-cream/30 hover:border-cream"}`;
  return (
    <section id="reserva" aria-labelledby="r-title" className="mx-auto max-w-[1200px] px-3 py-[clamp(90px,12vw,160px)] sm:px-6 lg:px-10">
      <div className="grid gap-10 rounded-[36px] bg-oxblood p-6 text-cream sm:p-10 lg:grid-cols-2 lg:p-14">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/60">Reserva</p>
          <h2 id="r-title" className="mt-5 font-display text-[clamp(40px,5vw,76px)] font-bold leading-[0.95] tracking-[-0.04em]">Aparta tu semana</h2>
          <p className="mt-5 max-w-[24rem] text-[16px] text-cream/80">Elige semana, mundo y número de videos. Te preparo el correo para que solo tengas que enviarlo.</p>
        </div>
        <div className="space-y-6">
          <fieldset><legend className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/60">Semana del</legend><div className="mt-3 flex flex-wrap gap-2">{weeks.map((x, i) => <button key={x.label} type="button" aria-pressed={w === i} onClick={() => setW(i)} className={chip(w === i)}>{x.label}</button>)}</div></fieldset>
          <fieldset><legend className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/60">Mundo</legend><div className="mt-3 flex flex-wrap gap-2">{services.map((s) => <button key={s.id} type="button" aria-pressed={cat === s.name} onClick={() => setCat(s.name)} className={chip(cat === s.name)}>{s.name}</button>)}</div></fieldset>
          <fieldset><legend className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/60">Videos</legend><div className="mt-3 flex flex-wrap gap-2">{[1, 3, 5, 8].map((k) => <button key={k} type="button" aria-pressed={n === k} onClick={() => setN(k)} className={chip(n === k)}>{k}</button>)}</div></fieldset>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} className="inline-flex h-12 items-center rounded-full bg-cream px-6 text-[14px] font-semibold text-ink hover:bg-sand">Reservar por email ↗</a>
            <button type="button" onClick={onContact} className="h-12 cursor-pointer rounded-full border border-cream/40 px-6 text-[14px] font-medium hover:border-cream">Abrir formulario</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-ph]"), { clipPath: "inset(0% 0% 100% 0% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 36px)", ease: "none", scrollTrigger: { trigger: root, start: "top 85%", end: "center 55%", scrub: 0.5 } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(90px,12vw,160px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div data-ph className="relative aspect-[4/5] overflow-hidden" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
        </div>
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="a-title" className="mt-5 font-display text-[clamp(40px,5.6vw,84px)] font-bold leading-[0.95] tracking-[-0.04em]">Constante, cercana <span className="text-oxblood">y puntual</span></h2>
          <p className="mt-6 text-[18px] leading-[1.7]">Soy Steff. Planifico cada pieza para que llegue a tiempo y se sienta como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real.</p>
          <p className="mt-6 text-[14px] text-ink-soft">Han confiado en mí: {brands.join(", ")}.</p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[980px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={kicker}>Preguntas</p>
      <h2 id="f-title" className="mt-5 font-display text-[clamp(40px,5.6vw,84px)] font-bold leading-[0.95] tracking-[-0.04em]">Antes de <span className="text-oxblood">agendar</span></h2>
      <ul className="mt-12 space-y-2.5">
        {faqs.map((f, i) => (
          <li key={f.q} className="rounded-[22px] bg-[#f8f3ea]">
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`gq${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center gap-4 p-5 text-left">
                <span className="flex-1 font-display text-[clamp(18px,1.8vw,22px)] font-bold leading-tight tracking-[-0.01em]">{f.q}</span>
                <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 ${open === i ? "rotate-45 bg-oxblood text-cream" : "bg-ink/5"}`}>+</span>
              </button>
            </h3>
            <div id={`gq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="px-5 pb-6 pr-16 text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
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
    <section id="contacto" aria-labelledby="ct-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[78svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="ct-title" className="mt-6 font-display text-[clamp(52px,9vw,150px)] font-bold leading-[0.9] tracking-[-0.05em]">¿Agendamos?</h2>
        <button type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-oxblood">
          Escríbeme<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
        </button>
        <p className="mt-6 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4">{done ? "copiado" : "copiar"}</button></p>
        <ul className="mt-8 flex gap-6 text-[11px] font-semibold uppercase tracking-[0.22em]">
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
          <Calendar portrait={portrait} />
          <Gantt />
          <Book onContact={openContact} />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
