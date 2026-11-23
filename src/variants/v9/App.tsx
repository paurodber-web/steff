import { useCallback, useEffect, useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, useMotion, useCopy, useFinePointer, reg } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft";
const ago = ["ahora", "2 min", "5 min", "12 min"];

function Note({ img, item, title, body, time, className = "" }: { img?: Img; item?: VideoItem; title: string; body: string; time: string; className?: string }) {
  return (
    <div className={`nt-glass flex items-center gap-3 rounded-[22px] p-3 pr-4 ${className}`}>
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-ink font-display text-[18px] font-semibold text-cream">
        {img && item ? <Shot img={img} item={item} sizes="48px" className="absolute inset-0" /> : "S"}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="flex items-baseline justify-between gap-2"><span className="truncate text-[14px] font-semibold">{title}</span><span className="shrink-0 text-[12px] text-ink-soft">{time}</span></span>
        <span className="mt-0.5 block truncate text-[14px] text-ink/80">{body}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ HERO: lock screen */
function Hero({ hero, portrait, onMenu, onContact }: { hero: Img; portrait: Img; onMenu: () => void; onContact: () => void }) {
  const notes = [
    { t: "Steff Ramírez", b: "Tu video está listo para publicar ✨", i: 0 },
    { t: "Nueva idea", b: "“3 looks con un solo blazer”", i: 0 },
    { t: "Entrega", b: "Vertical 9:16 · con subtítulos", i: 4 },
  ];
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      flanks={false}
      title={<Letters />}
      back={<><div aria-hidden className="v2-glow" /><div aria-hidden className="v2-arch" /></>}
      front={
        <>
          <p data-in aria-hidden className="absolute inset-x-0 top-[96px] z-30 hidden text-center text-[13px] font-semibold text-ink/70 lg:block">{new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</p>
          <div aria-hidden className="absolute inset-x-0 bottom-[76px] z-30 mx-auto flex w-[min(92%,380px)] flex-col gap-2 lg:bottom-20">
            {notes.map((n, k) => (
              <div key={k} data-note><Note img={k ? portrait : undefined} item={k ? portfolio.moda[0] : undefined} title={n.t} body={n.b} time={ago[k]} /></div>
            ))}
          </div>
        </>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { filter: "blur(30px) brightness(1.4)", scale: 1.06, duration: 1.4 })
          .from(root.querySelectorAll("[data-l]"), { yPercent: -60, opacity: 0, duration: 1.1, stagger: 0.05 }, 0.3)
          .from(root.querySelector("[data-fig]"), { yPercent: 12, opacity: 0, duration: 1.4 }, 0.5)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 0.9);
        root.querySelectorAll("[data-note]").forEach((n, k) => {
          tl.from(n, { y: -240, opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.5)" }, 1.5 + k * 0.55);
        });
        root.querySelectorAll("[data-note]").forEach((n, k) => gsap.to(n, { x: (k % 2 ? 1 : -1) * 400, rotate: (k % 2 ? 1 : -1) * 10, opacity: 0, ease: "none", scrollTrigger: { trigger: root, start: `${k * 6}% top`, end: "45% top", scrub: 0.5 } }));
      }}
    />
  );
}

/* ------------------------------------------------------------------ grouped notifications per world + bottom sheet */
function Groups({ portrait, onOpen }: { portrait: Img; onOpen: (s: number, k: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string[]>([services[0].id]);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-group]"), { y: 60, opacity: 0, duration: 1, ease: "back.out(1.4)", stagger: 0.1, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });
  return (
    <section ref={ref} id="portafolio" aria-labelledby="g-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-[1fr_520px] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className={kicker}>Portafolio</p>
          <h2 id="g-title" className="mt-5 font-display text-[clamp(44px,6.4vw,96px)] font-semibold leading-[0.95] tracking-[-0.04em]">Tienes <span className="text-oxblood">12 notificaciones</span></h2>
          <p className="mt-5 max-w-[26rem] text-[17px] leading-relaxed text-ink-soft">Agrupadas por mundo. Toca un grupo para desplegarlo y una notificación para ver el video.</p>
        </div>
        <div className="space-y-4">
          {services.map((s, si) => {
            const isOpen = open.includes(s.id);
            const items = portfolio[s.id];
            return (
              <div key={s.id} id={s.id} data-group className="scroll-mt-24">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{s.name}</h3>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== s.id) : [...o, s.id]))} className="cursor-pointer rounded-full bg-ink/5 px-3 py-1.5 text-[13px] font-medium hover:bg-ink/10">{isOpen ? "Mostrar menos" : `Ver ${items.length}`}</button>
                </div>
                <ul className={`nt-group relative ${isOpen ? "is-open" : ""}`} style={{ ["--n" as string]: items.length }}>
                  {items.map((it, k) => (
                    <li key={it.brand} className="nt-item" style={{ ["--k" as string]: k }}>
                      <button type="button" tabIndex={isOpen || k === 0 ? 0 : -1} onClick={() => (isOpen ? onOpen(si, k) : setOpen((o) => [...o, s.id]))} className="block w-full cursor-pointer text-left" aria-label={isOpen ? `Ver video: ${it.hook}, para ${it.brand}` : `Desplegar ${s.name}`}>
                        <Note img={portrait} item={it} title={`${it.brand} · ${it.format}`} body={`“${it.hook}”`} time={it.duration} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Sheet({ img, at, onClose }: { img: Img; at: [number, number]; onClose: () => void }) {
  const s = services[at[0]];
  const it = portfolio[s.id][at[1]];
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={`${it.brand}: ${it.hook}`} className="fixed inset-0 z-[200] flex items-end justify-center bg-[rgba(30,14,12,0.55)] backdrop-blur-sm sm:items-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="nt-sheet w-full max-w-[460px] overflow-hidden rounded-t-[32px] bg-[#fbf8f2] sm:rounded-[32px]">
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <span className="mx-auto h-1.5 w-12 rounded-full bg-ink/15 sm:hidden" aria-hidden />
        </div>
        <div className="flex items-center justify-between px-5">
          <p className="text-[14px] font-semibold">{s.name} · {it.format}</p>
          <button ref={close} type="button" onClick={onClose} aria-label="Cerrar" className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-ink/5 text-[20px] hover:bg-ink/10">×</button>
        </div>
        <div className="p-5">
          <div className="relative mx-auto aspect-[9/16] max-h-[56svh] overflow-hidden rounded-[22px]">
            <Shot img={img} item={it} sizes="420px" className="absolute inset-0" />
            <p className="absolute inset-x-4 top-[20%] text-center"><span className="box-decoration-clone rounded-md bg-cream px-2 py-1 text-[16px] font-semibold leading-[1.8] text-ink">{it.hook}</span></p>
          </div>
          <p className="mt-4 text-center text-[15px]">para <strong>{it.brand}</strong> · {it.duration}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ reminders that tick themselves off */
function Reminders() {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    reg();
    const el = ref.current?.querySelector("[data-list]");
    if (!el) return;
    const st = ScrollTrigger.create({ trigger: el, start: "top 75%", end: "bottom 45%", onUpdate: (s) => setN(Math.round(s.progress * steps.length)) });
    return () => st.kill();
  }, []);
  return (
    <section ref={ref} id="proceso" aria-labelledby="r-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className={kicker}>Cómo trabajo</p>
          <h2 id="r-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] font-semibold leading-[0.95] tracking-[-0.04em]">Recordatorios <span className="text-oxblood">de tu campaña</span></h2>
          <p className="mt-5 max-w-[26rem] text-[17px] leading-relaxed text-ink-soft">Se van completando mientras bajas. Así de claro es trabajar conmigo.</p>
        </div>
        <div data-list className="rounded-[28px] bg-[#fbf8f2] p-3 shadow-[0_40px_70px_-50px_rgba(42,27,22,0.6)]">
          <p className="px-3 pb-2 pt-2 font-display text-[22px] font-semibold tracking-[-0.02em] text-oxblood">Campaña · {n}/{steps.length}</p>
          <ul>
            {steps.map((s, i) => {
              const done = i < n;
              return (
                <li key={s.n} className="flex gap-4 border-t border-ink/8 p-3">
                  <span aria-hidden className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-500 ${done ? "border-oxblood bg-oxblood text-cream" : "border-ink/25"}`}>{done && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
                  <div>
                    <p className={`text-[17px] font-semibold transition-colors ${done ? "text-ink/45 line-through decoration-oxblood/50" : ""}`}>{s.title}<span className="sr-only">{done ? " (completado)" : ""}</span></p>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Widgets({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-w]"), { scale: 0.85, opacity: 0, duration: 0.9, ease: "back.out(1.6)", stagger: 0.07, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="w-title" className="mx-auto max-w-[1100px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={kicker}>Sobre mí</p>
      <h2 id="w-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] font-semibold leading-[0.95] tracking-[-0.04em]">Mis <span className="text-oxblood">widgets</span></h2>
      <div className="mt-12 grid auto-rows-[minmax(160px,auto)] grid-cols-2 gap-3 lg:grid-cols-4">
        <div data-w className="relative col-span-2 row-span-2 overflow-hidden rounded-[28px]" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
          <div className="nt-glass absolute inset-x-3 bottom-3 rounded-[22px] p-4">
            <p className="font-display text-[22px] font-semibold tracking-[-0.02em]">Steff Ramírez</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink/80">Contenido que se siente como la recomendación de una amiga, no como un anuncio.</p>
          </div>
        </div>
        <div data-w className="flex flex-col justify-between rounded-[28px] bg-oxblood p-5 text-cream"><p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/60">Idioma</p><p className="font-display text-[34px] font-semibold leading-none">Español</p></div>
        <div data-w className="flex flex-col justify-between rounded-[28px] bg-[#f8f3ea] p-5"><p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Formato</p><p className="font-display text-[34px] font-semibold leading-none">9:16</p></div>
        <div data-w className="col-span-2 rounded-[28px] bg-ink p-5 text-cream">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/60">Marcas</p>
          <p className="mt-3 text-[15px] leading-relaxed">{brands.join(" · ")}</p>
        </div>
        <div data-w className="col-span-2 rounded-[28px] bg-[#ecd7cb] p-5 lg:col-span-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Formatos</p>
          <ul className="mt-3 flex flex-wrap gap-2">{formats.map((f) => <li key={f.name} title={f.note} className="rounded-full bg-cream px-3.5 py-2 text-[14px] font-medium">{f.name}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function Settings() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[760px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={kicker}>Ajustes</p>
      <h2 id="f-title" className="mt-5 font-display text-[clamp(44px,6vw,88px)] font-semibold leading-[0.95] tracking-[-0.04em]">Preguntas <span className="text-oxblood">frecuentes</span></h2>
      <ul className="mt-10 overflow-hidden rounded-[24px] bg-[#f8f3ea]">
        {faqs.map((f, i) => (
          <li key={f.q} className="border-b border-ink/8 last:border-0">
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`sq${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left hover:bg-ink/[0.03]">
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] text-[14px] font-semibold text-cream" style={{ background: ["#5c1a1f", "#b46a5e", "#8a6f4e", "#2a1b16", "#c98f80", "#5b4a3f"][i] }}>{i + 1}</span>
                <span className="flex-1 text-[16px] font-medium">{f.q}</span>
                <span aria-hidden className={`text-[20px] text-ink/40 transition-transform duration-300 ${open === i ? "rotate-90" : ""}`}>›</span>
              </button>
            </h3>
            <div id={`sq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="px-4 pb-5 pl-[60px] text-[15px] leading-relaxed text-ink-soft">{f.a}</p></div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ slide to write */
function Unlock({ onContact }: { onContact: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLButtonElement>(null);
  const fine = useFinePointer();
  const { copy, done } = useCopy(EMAIL);
  useEffect(() => {
    const t = track.current;
    const k = knob.current;
    if (!t || !k) return;
    gsap.registerPlugin(Draggable);
    const [d] = Draggable.create(k, {
      type: "x",
      bounds: t,
      onRelease() {
        const max = t.clientWidth - k.offsetWidth - 12;
        if (this.x > max * 0.8) {
          gsap.to(k, { x: max, duration: 0.2, onComplete: () => { onContact(); gsap.to(k, { x: 0, delay: 0.6, duration: 0.5 }); } });
        } else gsap.to(k, { x: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
      },
    });
    return () => d.kill();
  }, [onContact, fine]);
  return (
    <section id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="c-title" className="mt-6 font-display text-[clamp(52px,9vw,150px)] font-semibold leading-[0.9] tracking-[-0.05em]">Activa <span className="text-oxblood">tu campaña</span></h2>
        <div ref={track} className="nt-glass relative mt-10 flex h-[64px] w-full max-w-[380px] items-center rounded-full p-1.5">
          <button ref={knob} type="button" onClick={onContact} aria-label="Escribirme" className="relative z-10 grid h-[52px] w-[52px] cursor-grab place-items-center rounded-full bg-ink text-cream active:cursor-grabbing">→</button>
          <span aria-hidden className="nt-shine pointer-events-none absolute inset-0 grid place-items-center pl-10 text-[15px] font-semibold text-ink/70">desliza para escribirme</span>
        </div>
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
  const [sheet, setSheet] = useState<[number, number] | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback((s: number, k: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setSheet([s, k]);
  }, []);
  const close = useCallback(() => {
    setSheet(null);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);
  return (
    <>
      <Shell>
        {({ openMenu, openContact }) => (
          <>
            <Hero hero={hero} portrait={portrait} onMenu={openMenu} onContact={openContact} />
            <Groups portrait={portrait} onOpen={open} />
            <Reminders />
            <Widgets portrait={portrait} />
            <Settings />
            <Unlock onContact={openContact} />
          </>
        )}
      </Shell>
      {sheet && <Sheet img={portrait} at={sheet} onClose={close} />}
    </>
  );
}
