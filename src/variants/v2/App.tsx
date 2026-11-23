import { useCallback, useEffect, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { EMAIL, socials, services, portfolio, brands, steps, faqs } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useCopy, useReduced } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

gsap.registerPlugin(Flip);

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft";
const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));

/* ------------------------------------------------------------------ HERO: tiles reveal, then it becomes the avatar */
function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      back={<><div aria-hidden className="v2-glow" /><div aria-hidden data-arch className="v2-arch" /></>}
      front={
        <div aria-hidden data-tiles className="pointer-events-none absolute inset-0 z-[60] grid grid-cols-4 grid-rows-3 gap-[3px] p-[3px]">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} className="rounded-[14px] bg-cream" style={{ transform: "scale(0)" }} />)}
        </div>
      }
      motion={(root) => {
        const tiles = root.querySelectorAll("[data-tiles] > span");
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.set(tiles, { scale: 1 })
          .to(tiles, { scale: 0, borderRadius: 999, duration: 1.1, ease: "expo.inOut", stagger: { each: 0.05, grid: [3, 4], from: "center" } }, 0.15)
          .from(root.querySelectorAll("[data-l]"), { yPercent: 100, opacity: 0, duration: 1.2, stagger: 0.06 }, 0.75)
          .from(root.querySelector("[data-arch]"), { scale: 0.7, opacity: 0, duration: 1.4 }, 0.8)
          .from(root.querySelector("[data-fig]"), { yPercent: 18, opacity: 0, duration: 1.5 }, 0.9)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 1.4);
        gsap.fromTo(root, { clipPath: "inset(0% 0% 0% 0% round 52px)" }, { clipPath: "inset(18% 34% 18% 34% round 999px)", ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } });
      }}
    />
  );
}

/* ------------------------------------------------------------------ post modal (grows from the tile) */
function Post({ img, index, onClose, onMove }: { img: Img; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const { s, item } = all[index];
  useEffect(() => {
    close.current?.focus();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [onClose, onMove]);
  return (
    <div role="dialog" aria-modal="true" aria-label={`Publicación: ${item.hook}`} className="pf-modal fixed inset-0 z-[200] grid place-items-center bg-[rgba(30,14,12,0.78)] p-3 backdrop-blur-sm sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="grid max-h-[94svh] w-full max-w-[980px] overflow-y-auto overscroll-contain rounded-[28px] bg-[#fbf8f2] md:grid-cols-[minmax(0,1fr)_360px] md:overflow-hidden">
        <div data-flip-id={`post-${index}`} className="relative aspect-[4/5] w-full shrink-0 md:aspect-[9/16] md:max-h-[90svh]">
          <Shot img={img} item={item} sizes="560px" className="absolute inset-0" />
          <p className="absolute inset-x-6 top-[22%] text-center"><span className="box-decoration-clone rounded-md bg-cream px-2 py-1 text-[17px] font-semibold leading-[1.8] text-ink">{item.hook}</span></p>
        </div>
        <div className="flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 p-4">
            <p className="text-[14px] font-semibold">stefframirez <span className="font-normal text-ink-soft">· {s.name}</span></p>
            <button ref={close} type="button" onClick={onClose} aria-label="Cerrar publicación" className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-[22px] hover:bg-ink/5">×</button>
          </div>
          <div className="flex-1 space-y-4 p-5">
            <p className="font-display text-[28px] leading-tight">“{item.hook}”</p>
            <p className="text-[15px] leading-relaxed text-ink-soft">Video {item.format.toLowerCase()} de {s.name.toLowerCase()} para <strong className="font-semibold text-ink">{item.brand}</strong>. Grabado en casa con luz natural, vertical 9:16 y con subtítulos.</p>
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[["Formato", item.format], ["Duración", item.duration], ["Mundo", s.name]].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-cream p-3"><dt className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">{k}</dt><dd className="mt-1 text-[14px] font-medium">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="flex justify-between border-t border-ink/10 p-4">
            <button type="button" onClick={() => onMove(-1)} className="h-11 cursor-pointer rounded-full border border-ink/15 px-5 text-[12px] font-medium uppercase tracking-[0.18em] hover:border-ink">← Anterior</button>
            <button type="button" onClick={() => onMove(1)} className="h-11 cursor-pointer rounded-full bg-ink px-5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream hover:bg-oxblood">Siguiente →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ profile header */
function Profile({ portrait, filter, setFilter, onContact }: { portrait: Img; filter: string; setFilter: (f: string) => void; onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 75%", once: true } });
    tl.from(root.querySelector("[data-avatar]"), { scale: 0.4, opacity: 0, duration: 1.1, ease: "back.out(1.6)" })
      .from(root.querySelectorAll("[data-tx]"), { y: 24, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }, 0.2)
      .from(root.querySelectorAll("[data-hl]"), { scale: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.07 }, 0.5);
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="pf-title" className="mx-auto max-w-[940px] px-5 pt-[clamp(80px,10vw,140px)] sm:px-8">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-14">
        <span data-avatar className="pf-ring grid h-[150px] w-[150px] shrink-0 place-items-center rounded-full p-[4px] sm:h-[180px] sm:w-[180px]">
          <span className="relative block h-full w-full overflow-hidden rounded-full border-4 border-cream" style={{ background: "#d6c3a9" }}>
            <img src={portrait.src} srcSet={portrait.srcSet} sizes="180px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full scale-[1.9] object-cover object-top mix-blend-multiply" style={{ transformOrigin: "50% 14%" }} />
          </span>
        </span>
        <div className="w-full text-center sm:text-left">
          <div data-tx className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap">
            <h2 id="pf-title" className="font-display text-[clamp(36px,4.6vw,56px)] leading-none">Steff Ramírez</h2>
            <div className="flex gap-2">
              <button type="button" onClick={onContact} className="h-10 cursor-pointer rounded-full bg-ink px-5 text-[13px] font-medium text-cream hover:bg-oxblood">Enviar mensaje</button>
              <a href="#proceso" className="inline-flex h-10 items-center rounded-full bg-ink/5 px-5 text-[13px] font-medium hover:bg-ink/10">Cómo trabajo</a>
            </div>
          </div>
          <dl data-tx className="mt-5 flex justify-center gap-8 sm:justify-start">
            {[[all.length, "reels"], [services.length, "mundos"], [brands.length, "marcas"]].map(([n, l]) => (
              <div key={l as string} className="flex items-baseline gap-1.5"><dd className="font-display text-[24px] leading-none">{n}</dd><dt className="text-[14px] text-ink-soft">{l}</dt></div>
            ))}
          </dl>
          <p data-tx className="mt-4 text-[15px] font-semibold">UGC Creator · Moda, belleza, lifestyle y momlife</p>
          <p data-tx className="mt-1 max-w-[34rem] text-[16px] leading-relaxed text-ink-soft">Contenido que se siente como la recomendación de una amiga, no como un anuncio. Grabado en casa, con luz natural y mucha cercanía.</p>
        </div>
      </div>
      <div role="group" aria-label="Destacados: filtrar por mundo" className="mt-12 flex justify-center gap-5 overflow-x-auto pb-2 sm:justify-start sm:gap-8">
        {[{ id: "todo", name: "Todo", n: "" }, ...services].map((s) => {
          const item = s.id === "todo" ? all[0].item : portfolio[s.id as keyof typeof portfolio][0];
          const on = filter === s.id;
          return (
            <button key={s.id} id={s.id === "todo" ? undefined : s.id} data-hl type="button" aria-pressed={on} onClick={() => setFilter(s.id)} className="group flex shrink-0 scroll-mt-24 cursor-pointer flex-col items-center gap-2">
              <span className={`grid h-[74px] w-[74px] place-items-center rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105 ${on ? "pf-ring" : "bg-ink/15"}`}>
                <span className="relative block h-full w-full overflow-hidden rounded-full border-[3px] border-cream"><Shot img={portrait} item={item} sizes="80px" className="absolute inset-0" /></span>
              </span>
              <span className={`text-[13px] ${on ? "font-semibold" : "text-ink-soft"}`}>{s.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the grid */
function Grid({ portrait, filter, onOpen }: { portrait: Img; filter: string; onOpen: (i: number, el: HTMLElement) => void }) {
  const ref = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const state = useRef<Flip.FlipState | null>(null);
  const prev = useRef(filter);
  const reduced = useReduced();
  if (prev.current !== filter && grid.current && !reduced) {
    state.current = Flip.getState(grid.current.querySelectorAll("[data-tile]"));
    prev.current = filter;
  }
  useEffect(() => {
    if (!state.current) return;
    Flip.from(state.current, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.02,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.4 }),
    });
    state.current = null;
  }, [filter]);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-tile]"), { opacity: 0, scale: 0.88, y: 40, duration: 1, ease: "expo.out", stagger: { each: 0.05, grid: "auto", from: "start" }, scrollTrigger: { trigger: root, start: "top 80%", once: true } });
  });
  const shown = all.map((a, i) => ({ ...a, i })).filter((a) => filter === "todo" || a.s.id === filter);
  return (
    <section ref={ref} id="portafolio" aria-labelledby="g-title" className="mx-auto max-w-[940px] px-2 pb-[clamp(110px,14vw,200px)] pt-8 sm:px-8">
      <div role="tablist" aria-label="Vistas" className="flex justify-center gap-10 border-t border-ink/15">
        <span role="tab" aria-selected="true" className="-mt-px border-t-2 border-ink pt-3 text-[11px] font-semibold uppercase tracking-[0.22em]">Reels</span>
      </div>
      <h2 id="g-title" className="sr-only">Reels</h2>
      <ul ref={grid} className="mt-3 grid grid-cols-3 gap-[3px] sm:gap-1.5">
        {shown.map(({ s, item, i }) => (
          <li key={item.brand} data-tile data-flip-id={item.brand}>
            <button type="button" onClick={(e) => onOpen(i, e.currentTarget)} aria-label={`Abrir: ${item.hook}, para ${item.brand}`} className="group relative block aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-[4px] sm:rounded-[10px]" data-flip-id={`post-${i}`}>
              <Shot img={portrait} item={item} sizes="(min-width:640px) 300px, 33vw" className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(30,14,12,0.5)] p-3 text-center text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="font-display text-[clamp(14px,1.8vw,20px)] leading-tight">“{item.hook}”</span>
                <span className="text-[10px] uppercase tracking-[0.2em]">{s.name}</span>
              </span>
              <svg aria-hidden viewBox="0 0 24 24" className="absolute right-2 top-2 h-4 w-4 text-cream drop-shadow"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ process as a carousel post */
function Carousel() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const go = (n: number) => {
    const t = track.current;
    if (!t) return;
    const k = Math.max(0, Math.min(steps.length - 1, n));
    t.scrollTo({ left: k * t.clientWidth, behavior: "smooth" });
  };
  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-post]"), { y: 80, rotate: -2, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="c-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p className={kicker}>Cómo trabajo</p>
          <h2 id="c-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] leading-[0.95] tracking-[-0.02em]">Mi proceso, <em className="text-oxblood">en un carrusel</em></h2>
          <p className="mt-5 max-w-[26rem] text-[17px] leading-relaxed text-ink-soft">Desliza las diapositivas. Cuatro pasos, sin fricciones, desde el brief hasta que publicas.</p>
        </div>
        <article data-post className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] bg-[#fbf8f2] shadow-[0_40px_70px_-45px_rgba(42,27,22,0.55)]">
          <header className="flex items-center gap-3 p-4">
            <span className="pf-ring grid h-9 w-9 place-items-center rounded-full p-[2px]"><span className="block h-full w-full rounded-full bg-sand" /></span>
            <p className="text-[14px] font-semibold">stefframirez</p>
            <p className="ml-auto text-[12px] text-ink-soft tabular-nums">{i + 1}/{steps.length}</p>
          </header>
          <div ref={track} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto" aria-roledescription="carrusel">
            {steps.map((s, k) => (
              <div key={s.n} className="flex aspect-square w-full shrink-0 snap-center flex-col justify-between p-8" style={{ background: ["#f4eee3", "#ecd7cb", "#e3d1b8", "#5c1a1f"][k], color: k === 3 ? "#f4eee3" : "#2a1b16" }} aria-label={`Paso ${k + 1} de ${steps.length}`}>
                <p className="font-display text-[clamp(80px,12vw,140px)] italic leading-[0.8]">{s.n}</p>
                <div>
                  <h3 className="font-display text-[38px] leading-none">{s.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed opacity-85">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <footer className="flex items-center justify-between p-4">
            <button type="button" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Diapositiva anterior" className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-ink/5 disabled:opacity-30">←</button>
            <div className="flex gap-1.5">{steps.map((s, k) => <span key={s.n} className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-5 bg-oxblood" : "w-1.5 bg-ink/25"}`} />)}</div>
            <button type="button" onClick={() => go(i + 1)} disabled={i === steps.length - 1} aria-label="Diapositiva siguiente" className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-ink/5 disabled:opacity-30">→</button>
          </footer>
        </article>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ as a comment thread */
function Comments() {
  const [open, setOpen] = useState<number[]>([0]);
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-c]"), { x: -30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} id="faq" aria-labelledby="cm-title" className="mx-auto max-w-[760px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={kicker}>Comentarios</p>
      <h2 id="cm-title" className="mt-5 font-display text-[clamp(44px,6vw,88px)] leading-[0.95] tracking-[-0.02em]">Lo que <em className="text-oxblood">me preguntan</em></h2>
      <ul className="mt-12 space-y-7">
        {faqs.map((f, i) => {
          const on = open.includes(i);
          return (
            <li key={f.q} data-c>
              <div className="flex gap-3">
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-[12px] font-semibold">M</span>
                <div className="min-w-0">
                  <p className="text-[15px] leading-relaxed"><span className="font-semibold">una_marca</span> {f.q}</p>
                  <button type="button" aria-expanded={on} aria-controls={`cr${i}`} onClick={() => setOpen((cur) => (on ? cur.filter((x) => x !== i) : [...cur, i]))} className="mt-1.5 cursor-pointer text-[13px] font-medium text-ink-soft hover:text-ink">
                    <span aria-hidden className="mr-2 inline-block h-px w-6 bg-ink/30 align-middle" />{on ? "Ocultar respuesta" : "Ver respuesta (1)"}
                  </button>
                  <div id={`cr${i}`} role="region" className="faq-panel" data-open={on} inert={!on}>
                    <div>
                      <div className="mt-4 flex gap-3">
                        <span aria-hidden className="pf-ring grid h-8 w-8 shrink-0 place-items-center rounded-full p-[2px]"><span className="block h-full w-full rounded-full bg-oxblood" /></span>
                        <p className="text-[15px] leading-relaxed"><span className="font-semibold">stefframirez</span> <span className="ml-1 rounded bg-oxblood/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-oxblood">Creadora</span><br />{f.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Tagged() {
  return (
    <section aria-labelledby="t-title" className="bg-ink py-[clamp(90px,11vw,150px)] text-cream">
      <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-cream/60">Etiquetada por</p>
        <h2 id="t-title" className="mt-5 font-display text-[clamp(40px,5vw,72px)] italic leading-none">Marcas con las que he trabajado</h2>
        <ul className="mt-12 flex flex-wrap justify-center gap-2.5">
          {brands.map((b) => (
            <li key={b} className="flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2.5 text-[15px] transition-colors hover:bg-cream hover:text-ink">
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M3 11.5V4a1 1 0 0 1 1-1h7.5l9.2 9.2a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0zM7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" /></svg>{b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const { copy, done } = useCopy(EMAIL);
  return (
    <section id="contacto" aria-labelledby="ct-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="ct-title" className="mt-6 font-display text-[clamp(56px,9.6vw,160px)] leading-[0.9] tracking-[-0.03em]">Sígueme… <em className="text-oxblood">o mejor, escríbeme</em></h2>
        <button type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
          Enviar mensaje<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
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
  const [filter, setFilter] = useState("todo");
  const [post, setPost] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const reduced = useReduced();
  const open = useCallback((i: number, el: HTMLElement) => {
    opener.current = el;
    const st = reduced ? null : Flip.getState(el);
    setPost(i);
    if (st) requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`.pf-modal [data-flip-id="post-${i}"]`);
      if (target) Flip.from(st, { targets: target, duration: 0.7, ease: "expo.inOut", scale: true });
    });
  }, [reduced]);
  const close = useCallback(() => {
    setPost(null);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);
  const move = useCallback((d: number) => setPost((p) => (p === null ? p : (p + d + all.length) % all.length)), []);
  return (
    <>
      <Shell>
        {({ openMenu, openContact }) => (
          <>
            <Hero hero={hero} onMenu={openMenu} onContact={openContact} />
            <Profile portrait={portrait} filter={filter} setFilter={setFilter} onContact={openContact} />
            <Grid portrait={portrait} filter={filter} onOpen={open} />
            <Carousel />
            <Tagged />
            <Comments />
            <Contact onContact={openContact} />
          </>
        )}
      </Shell>
      {post !== null && <Post img={portrait} index={post} onClose={close} onMove={move} />}
    </>
  );
}
