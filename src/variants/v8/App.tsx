import { useCallback, useEffect, useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import { EMAIL, socials, services, portfolio, brands, steps, faqs } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useCopy, useReduced, useFinePointer } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";
const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));

/* ------------------------------------------------------------------ story circle */
function Bubble({ img, i, onOpen, size = 76 }: { img: Img; i: number; onOpen: (i: number) => void; size?: number }) {
  const s = services[i];
  return (
    <button type="button" onClick={() => onOpen(i)} className="group flex cursor-pointer flex-col items-center gap-2" aria-label={`Ver historias de ${s.name}`}>
      <span className="st-ring grid place-items-center rounded-full p-[3px] transition-transform duration-500 group-hover:scale-105" style={{ width: size, height: size }}>
        <span className="relative block h-full w-full overflow-hidden rounded-full border-[3px] border-cream">
          <Shot img={img} item={portfolio[s.id][0]} sizes="90px" className="absolute inset-0" />
        </span>
      </span>
      <span className="text-[12px] font-medium">{s.name}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ story viewer */
function Viewer({ img, start, onClose }: { img: Img; start: number; onClose: () => void }) {
  const [cat, setCat] = useState(start);
  const [k, setK] = useState(0);
  const reduced = useReduced();
  const bar = useRef<HTMLSpanElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const items = portfolio[services[cat].id];

  const next = useCallback(() => {
    if (k < items.length - 1) setK(k + 1);
    else if (cat < services.length - 1) {
      setCat(cat + 1);
      setK(0);
    } else onClose();
  }, [k, cat, items.length, onClose]);
  const prev = useCallback(() => {
    if (k > 0) setK(k - 1);
    else if (cat > 0) {
      setCat(cat - 1);
      setK(portfolio[services[cat - 1].id].length - 1);
    }
  }, [k, cat]);

  useEffect(() => {
    close.current?.focus();
    const html = document.documentElement;
    const prevOv = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOv;
    };
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [next, prev, onClose]);
  useEffect(() => {
    if (reduced || !bar.current) return;
    const tw = gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 5, ease: "none", onComplete: next });
    return () => {
      tw.kill();
    };
  }, [cat, k, reduced, next]);

  const it = items[k];
  return (
    <div role="dialog" aria-modal="true" aria-label={`Historias de ${services[cat].name}`} className="st-viewer fixed inset-0 z-[200] grid place-items-center bg-[rgba(30,14,12,0.92)] p-3 backdrop-blur-md">
      <div className="relative aspect-[9/16] h-[min(92svh,820px)] max-w-full overflow-hidden rounded-[24px] bg-ink">
        <Shot key={`${cat}-${k}`} img={img} item={it} sizes="460px" className="st-in absolute inset-0" />
        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[rgba(30,14,12,0.6)] to-transparent p-3 pb-10">
          <div className="flex gap-1">
            {items.map((x, j) => (
              <span key={x.brand} className="h-[3px] flex-1 overflow-hidden rounded-full bg-cream/35">
                {j < k && <span className="block h-full w-full bg-cream" />}
                {j === k && <span ref={bar} className="block h-full w-full origin-left bg-cream" style={{ transform: reduced ? "none" : "scaleX(0)" }} />}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-cream">
            <p className="text-[13px] font-semibold">@stefframirez · <span className="font-normal opacity-80">{services[cat].name}</span></p>
            <button ref={close} type="button" onClick={onClose} aria-label="Cerrar historias" className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-[22px] hover:bg-cream/15">×</button>
          </div>
        </div>
        <p className="absolute inset-x-6 top-[26%] z-20 text-center"><span className="box-decoration-clone rounded-md bg-cream px-2 py-1 text-[17px] font-semibold leading-[1.8] text-ink">{it.hook}</span></p>
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[rgba(30,14,12,0.7)] to-transparent p-5 pt-16 text-cream">
          <p className="font-display text-[26px] leading-none"><em className="opacity-75">para</em> {it.brand}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] opacity-80">{it.format} · {it.duration}</p>
        </div>
        <button type="button" aria-label="Historia anterior" onClick={prev} className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-w-resize" />
        <button type="button" aria-label="Historia siguiente" onClick={next} className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-e-resize" />
      </div>
    </div>
  );
}

function Hero({ hero, portrait, onMenu, onContact, onStory }: { hero: Img; portrait: Img; onMenu: () => void; onContact: () => void; onStory: (i: number) => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      flanks={false}
      title={<Letters />}
      back={<><div aria-hidden className="v2-glow" /><div aria-hidden className="v2-arch" /></>}
      front={
        <div className="absolute inset-x-0 bottom-16 z-30 hidden justify-center gap-6 lg:flex">
          {services.map((s, i) => <div key={s.id} data-in><Bubble img={portrait} i={i} onOpen={onStory} size={70} /></div>)}
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ highlights + swipe deck */
function Deck({ portrait, onStory }: { portrait: Img; onStory: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  const fine = useFinePointer();
  const reduced = useReduced();
  const fling = useCallback((dir: 1 | -1) => {
    const card = stack.current?.querySelector<HTMLElement>(`[data-i="${top}"]`);
    const go = () => setTop((t) => (dir === 1 ? (t + 1) % all.length : (t - 1 + all.length) % all.length));
    if (!card || reduced || dir === -1) return go();
    gsap.to(card, { x: dir * 600, rotate: dir * 24, opacity: 0, duration: 0.5, ease: "power3.in", onComplete: () => { gsap.set(card, { x: 0, rotate: 0, opacity: 1 }); go(); } });
  }, [top, reduced]);

  useEffect(() => {
    const card = stack.current?.querySelector<HTMLElement>(`[data-i="${top}"]`);
    if (!card) return;
    gsap.registerPlugin(Draggable);
    const [d] = Draggable.create(card, {
      type: "x",
      onDrag() { gsap.set(card, { rotate: this.x / 18 }); },
      onRelease() {
        if (Math.abs(this.x) > 120) fling(this.x > 0 ? 1 : 1);
        else gsap.to(card, { x: 0, rotate: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
      },
    });
    return () => d.kill();
  }, [top, fling, fine]);

  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-b]"), { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(2)", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });

  const order = Array.from({ length: 4 }, (_, j) => (top + j) % all.length);
  const cur = all[top];
  return (
    <section ref={ref} id="portafolio" aria-labelledby="d-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="text-center">
        <p className={kicker}>Historias destacadas</p>
        <h2 id="d-title" className="mt-5 font-display text-[clamp(52px,7.6vw,124px)] leading-[0.92] tracking-[-0.02em]">Mi feed, <em className="text-oxblood">en tus manos</em></h2>
        <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-10">
          {services.map((s, i) => <div key={s.id} id={s.id} data-b className="scroll-mt-24"><Bubble img={portrait} i={i} onOpen={onStory} size={96} /></div>)}
        </div>
      </div>
      <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
        <div ref={stack} className="relative mx-auto aspect-[9/16] w-[min(78vw,360px)]">
          {order.slice().reverse().map((idx, j) => {
            const depth = order.length - 1 - j;
            const { s, item } = all[idx];
            return (
              <div key={idx} data-i={idx} className={`absolute inset-0 overflow-hidden rounded-[26px] shadow-[0_40px_60px_-30px_rgba(42,27,22,0.55)] ${depth === 0 ? "cursor-grab active:cursor-grabbing" : ""}`} style={{ transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.05}) rotate(${depth ? (depth % 2 ? 3 : -3) : 0}deg)`, zIndex: 10 - depth, transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }} aria-hidden={depth !== 0}>
                <Shot img={portrait} item={item} sizes="360px" className="absolute inset-0" />
                <p className="absolute inset-x-4 top-[24%] text-center"><span className="box-decoration-clone rounded-md bg-cream px-2 py-0.5 text-[15px] font-semibold leading-[1.8] text-ink">{item.hook}</span></p>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(30,14,12,0.7)] to-transparent p-5 pt-14 text-cream">
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-80">{s.name} · {item.format}</p>
                  <p className="mt-1 font-display text-[24px] leading-none">{item.brand}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center lg:text-left">
          <p className={kicker}>{String(top + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")} · {cur.s.name}</p>
          <p className="mt-4 font-display text-[clamp(32px,3.6vw,54px)] italic leading-[1.05]">“{cur.item.hook}”</p>
          <p className="mt-3 text-[16px] text-ink-soft">para {cur.item.brand} · {cur.item.format} · {cur.item.duration}</p>
          <p className="mt-6 text-[14px] text-ink-soft">{fine ? "Arrastra la tarjeta a un lado para ver la siguiente." : "Desliza la tarjeta o usa los botones."}</p>
          <div className="mt-6 flex justify-center gap-3 lg:justify-start">
            <button type="button" onClick={() => fling(-1)} className="h-12 cursor-pointer rounded-full border border-ink/20 px-6 text-[12px] font-medium uppercase tracking-[0.2em] hover:border-ink">Anterior</button>
            <button type="button" onClick={() => fling(1)} className="h-12 cursor-pointer rounded-full bg-ink px-6 text-[12px] font-medium uppercase tracking-[0.2em] text-cream hover:bg-oxblood">Siguiente</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ process as a chat */
function Chat() {
  const ref = useRef<HTMLElement>(null);
  const asks = ["Hola Steff, tenemos un producto nuevo y queremos videos que no parezcan anuncio.", "¿Y cómo lo planteamos?", "¿Lo grabas tú?", "¿Qué recibimos al final?"];
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-msg]").forEach((m) => {
      const typing = m.querySelector("[data-typing]");
      const body = m.querySelector("[data-body]");
      const tl = gsap.timeline({ scrollTrigger: { trigger: m, start: "top 82%", once: true } });
      tl.from(m, { y: 24, opacity: 0, scale: 0.96, duration: 0.6, ease: "back.out(1.8)" });
      if (typing && body) tl.from(body, { opacity: 0, duration: 0.01 }, 0.9).to(typing, { display: "none", duration: 0.01 }, 0.9);
    });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="ch-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[760px] px-5 sm:px-8">
        <p className={`${kicker} text-center`}>Cómo trabajo</p>
        <h2 id="ch-title" className="mt-5 text-center font-display text-[clamp(48px,6.4vw,100px)] leading-[0.95]">Así <em className="text-oxblood">hablamos</em></h2>
        <ol className="mt-14 space-y-4">
          {steps.map((s, i) => (
            <li key={s.n} className="space-y-4">
              <div data-msg className="flex items-end gap-3">
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand text-[12px] font-semibold">TM</span>
                <p className="max-w-[80%] rounded-[22px] rounded-bl-md bg-[#fbf8f2] px-5 py-3.5 text-[16px] leading-relaxed shadow-sm"><span className="sr-only">Marca: </span>{asks[i]}</p>
              </div>
              <div data-msg className="flex items-end justify-end gap-3">
                <div className="max-w-[80%] rounded-[22px] rounded-br-md bg-oxblood px-5 py-3.5 text-cream shadow-sm">
                  <span data-typing aria-hidden className="st-typing"><i /><i /><i /></span>
                  <div data-body>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream/65"><span className="sr-only">Steff, paso </span>{s.n} · {s.title}</p>
                    <p className="mt-1 text-[16px] leading-relaxed">{s.text}</p>
                  </div>
                </div>
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-display text-[15px] italic text-cream">S</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Profile({ portrait, onStory }: { portrait: Img; onStory: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-card]"), { y: 60, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    gsap.from(root.querySelectorAll("[data-brand]"), { scale: 0.5, opacity: 0, duration: 0.7, ease: "back.out(2)", stagger: 0.05, scrollTrigger: { trigger: root.querySelector("[data-brands]"), start: "top 85%", once: true } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="pf-title" className="mx-auto max-w-[1100px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8">
      <div data-card className="rounded-[36px] bg-[#fbf8f2] p-7 shadow-[0_40px_80px_-60px_rgba(42,27,22,0.6)] sm:p-12">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <span className="st-ring grid h-[148px] w-[148px] shrink-0 place-items-center rounded-full p-[4px]">
            <span className="relative block h-full w-full overflow-hidden rounded-full border-4 border-[#fbf8f2]" style={{ background: "#d6c3a9" }}>
              <img src={portrait.src} srcSet={portrait.srcSet} sizes="150px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full scale-[1.8] object-cover object-top mix-blend-multiply" style={{ transformOrigin: "50% 15%" }} />
            </span>
          </span>
          <div className="text-center sm:text-left">
            <p className={kicker}>Sobre mí</p>
            <h2 id="pf-title" className="mt-3 font-display text-[clamp(40px,5vw,72px)] leading-none">Steff <em className="text-oxblood">Ramírez</em></h2>
            <p className="mt-1 text-[14px] text-ink-soft">@stefframirez · UGC Creator</p>
            <dl className="mt-5 flex justify-center gap-8 sm:justify-start">
              {[[all.length, "piezas"], [services.length, "mundos"], [brands.length, "marcas"]].map(([n, l]) => (
                <div key={l as string}><dt className="sr-only">{l}</dt><dd><span className="block font-display text-[30px] leading-none">{n}</span><span className="text-[12px] text-ink-soft">{l}</span></dd></div>
              ))}
            </dl>
            <p className="mt-6 max-w-[34rem] text-[18px] leading-relaxed">Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado con cuidado y mucha cercanía.</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-6 border-t border-ink/10 pt-8 sm:justify-start">
          {services.map((s, i) => <Bubble key={s.id} img={portrait} i={i} onOpen={onStory} size={64} />)}
        </div>
        <div data-brands className="mt-10 border-t border-ink/10 pt-8">
          <p className={kicker}>Marcas con las que he trabajado</p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {brands.map((b) => (
              <li key={b} data-brand className="flex items-center gap-2 rounded-full bg-cream px-3 py-2">
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-sand text-[11px] font-semibold">{b.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                <span className="text-[14px]">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="fq-title" className="mx-auto max-w-[760px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Preguntas</p>
      <h2 id="fq-title" className="mt-5 text-center font-display text-[clamp(44px,6vw,92px)] leading-[0.95]">Lo que <em className="text-oxblood">me escriben</em></h2>
      <ul className="mt-12 space-y-3">
        {faqs.map((f, i) => (
          <li key={f.q}>
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`cq${i}`} onClick={() => setOpen(open === i ? null : i)} className={`ml-auto flex max-w-[85%] cursor-pointer items-center gap-3 rounded-[22px] rounded-br-md px-5 py-3.5 text-left text-[16px] transition-colors ${open === i ? "bg-ink text-cream" : "bg-[#fbf8f2] hover:bg-sand"}`}>
                {f.q}<span aria-hidden className={`transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
            </h3>
            <div id={`cq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="mt-3 max-w-[85%] rounded-[22px] rounded-bl-md bg-oxblood px-5 py-3.5 text-[16px] leading-relaxed text-cream">{f.a}</p></div>
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
        <h2 id="c-title" className="mt-6 font-display text-[clamp(60px,10vw,170px)] leading-[0.9] tracking-[-0.02em]">Envíame <em className="text-oxblood">un DM</em></h2>
        <button type="button" onClick={onContact} className="group mt-10 flex w-full max-w-[520px] cursor-text items-center justify-between gap-4 rounded-full border border-ink/20 bg-[#fbf8f2] py-2 pl-6 pr-2 text-left text-[16px] text-ink-soft shadow-sm transition-colors hover:border-ink">
          Escribe un mensaje…
          <span className="grid h-11 w-11 place-items-center rounded-full bg-oxblood text-cream transition-transform duration-500 group-hover:rotate-45">↗</span>
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
  const [story, setStory] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const openStory = useCallback((i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setStory(i);
  }, []);
  const closeStory = useCallback(() => {
    setStory(null);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);
  return (
    <>
      <Shell>
        {({ openMenu, openContact }) => (
          <>
            <Hero hero={hero} portrait={portrait} onMenu={openMenu} onContact={openContact} onStory={openStory} />
            <Deck portrait={portrait} onStory={openStory} />
            <Chat />
            <Profile portrait={portrait} onStory={openStory} />
            <Faq />
            <Contact onContact={openContact} />
          </>
        )}
      </Shell>
      {story !== null && <Viewer img={portrait} start={story} onClose={closeStory} />}
    </>
  );
}
