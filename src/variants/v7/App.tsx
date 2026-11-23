import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, useMotion, useCopy, reg } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft";
const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));

/* ------------------------------------------------------------------ HERO: a deck is dealt, the top card becomes the cover */
function Hero({ hero, portrait, onMenu, onContact }: { hero: Img; portrait: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <div className="relative">
      <div aria-hidden data-deck className="pointer-events-none fixed inset-0 z-[70] grid place-items-center">
        {[0, 3, 6, 9].map((k, i) => (
          <div key={k} data-dc className="absolute aspect-[9/16] w-[min(40vw,230px)] overflow-hidden rounded-[22px] shadow-[0_40px_60px_-30px_rgba(42,27,22,0.6)]" style={{ zIndex: 4 - i, opacity: 0 }}>
            <Shot img={portrait} item={all[k].item} sizes="230px" className="absolute inset-0" />
          </div>
        ))}
      </div>
      <EleHero
        hero={hero}
        onMenu={onMenu}
        onContact={onContact}
        title={<Letters />}
        back={<><div aria-hidden className="v2-glow" /><div aria-hidden data-arch className="v2-arch" /></>}
        motion={(root) => {
          const deck = document.querySelector("[data-deck]");
          const cards = deck ? Array.from(deck.querySelectorAll<HTMLElement>("[data-dc]")) : [];
          const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => deck?.remove() });
          tl.set(cards, { opacity: 1 })
            .set(root, { clipPath: "inset(50% 50% 50% 50% round 22px)" })
            .from(cards, { y: 300, rotate: (i) => [-14, 9, -5, 12][i], duration: 0.9, stagger: 0.08 })
            .to(cards, { x: (i) => [-1, 1, -1, 1][i] * (innerWidth * 0.32), y: (i) => [-1, -1, 1, 1][i] * (innerHeight * 0.22), rotate: (i) => [-24, 18, -12, 22][i], duration: 0.9, ease: "expo.inOut" }, 0.9)
            .to(root, { clipPath: "inset(0% 0% 0% 0% round 52px)", duration: 1.3, ease: "expo.inOut" }, 1.25)
            .to(cards, { x: (i) => [-1, 1, -1, 1][i] * innerWidth, y: (i) => [-1, -1, 1, 1][i] * innerHeight * 0.8, rotate: (i) => [-60, 50, -40, 55][i], opacity: 0, duration: 1.1, ease: "power3.in" }, 1.45)
            .from(root.querySelectorAll("[data-l]"), { yPercent: 90, opacity: 0, duration: 1.1, stagger: 0.06 }, 1.9)
            .from(root.querySelector("[data-arch]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.2 }, 1.9)
            .from(root.querySelector("[data-fig]"), { yPercent: 18, opacity: 0, duration: 1.3 }, 2)
            .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 2.3);
          gsap.to(root.querySelector("[data-fig]"), { scale: 1.25, yPercent: 8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } });
          gsap.to(root.querySelector(".v2-title"), { scale: 1.5, opacity: 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "70% top", scrub: 0.5 } });
          return () => deck?.remove();
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ PILE: each card is thrown off the deck */
const STEP = 45;
function Pile({ portrait }: { portrait: Img }) {
  const track = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  const N = all.length;
  useEffect(() => {
    reg();
    const el = track.current;
    const d = deck.current;
    if (!el || !d) return;
    const cards = Array.from(d.querySelectorAll<HTMLElement>("[data-c]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const v = self.progress * (N - 1);
        cards.forEach((c, i) => {
          const t = Math.min(Math.max(v - i, 0), 1); // how far this card has been thrown
          const depth = Math.max(i - v, 0); // cards below the top
          const dir = i % 2 ? 1 : -1;
          if (reduce) {
            c.style.opacity = i === Math.round(v) ? "1" : "0";
            return;
          }
          c.style.transform = `translate3d(${dir * t * 115}vw, ${-t * 30 + Math.min(depth, 3) * 14}px, 0) rotate(${dir * t * 28 + (depth > 0 ? (i % 3) - 1 : 0) * Math.min(depth, 1) * 3}deg) scale(${1 - Math.min(depth, 3) * 0.05})`;
          c.style.opacity = t >= 1 || depth > 3.5 ? "0" : "1";
        });
        const idx = Math.min(N - 1, Math.round(v));
        if (idx !== last) {
          last = idx;
          setTop(idx);
        }
      },
    });
    return () => st.kill();
  }, [N]);
  const cur = all[top];
  const firstOf = services.map((s) => all.findIndex((a) => a.s.id === s.id));
  return (
    <section id="portafolio" aria-labelledby="p-title">
      <div className="mx-auto max-w-[1200px] px-5 pb-8 pt-[clamp(110px,14vw,200px)] text-center sm:px-8">
        <p className={kicker}>Portafolio</p>
        <h2 id="p-title" className="mx-auto mt-5 max-w-[14ch] font-display text-[clamp(44px,7vw,112px)] leading-[0.95]">Doce cartas, <span className="text-oxblood">una baraja</span></h2>
      </div>
      <div ref={track} className="relative" style={{ height: `calc(${N * STEP}svh + 100svh)` }}>
        {services.map((s, i) => <span key={s.id} id={s.id} aria-hidden className="absolute left-0 h-px w-px" style={{ top: `${firstOf[i] * STEP}svh` }} />)}
        <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-5">
          <div className="grid w-full max-w-[1200px] items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
            <div className="hidden text-right lg:block">
              <p className={kicker}>{cur.s.n} / 04</p>
              <p key={cur.s.id} className="st-swap mt-3 font-display text-[clamp(48px,5vw,88px)] leading-none">{cur.s.name}</p>
              <p className="mt-3 text-[15px] text-ink-soft">{cur.s.desc}</p>
            </div>
            <div ref={deck} className="relative mx-auto aspect-[9/16] h-[min(66svh,600px)]">
              {all.map(({ item }, i) => (
                <figure key={item.brand} data-c className="absolute inset-0 will-change-transform" style={{ zIndex: N - i }}>
                  <div className="relative h-full w-full overflow-hidden rounded-[26px] shadow-[0_40px_60px_-34px_rgba(42,27,22,0.6)] ring-[6px] ring-[#fbf8f2]">
                    <Shot img={portrait} item={item} sizes="360px" className="absolute inset-0" />
                    <p className="absolute inset-x-5 top-[20%] text-center"><span className="box-decoration-clone rounded-md bg-cream px-2 py-1 text-[15px] font-semibold leading-[1.8] text-ink">{item.hook}</span></p>
                  </div>
                </figure>
              ))}
            </div>
            <div className="text-center lg:text-left">
              <p className="font-display text-[clamp(34px,3.6vw,56px)] leading-none tabular-nums">{String(top + 1).padStart(2, "0")}<span className="text-[0.45em] text-ink-soft"> / {N}</span></p>
              <p key={top} className="st-swap mt-3 text-[16px]"><span className="lg:hidden">{cur.s.name} · </span>para <strong className="font-semibold">{cur.item.brand}</strong> · {cur.item.format} · {cur.item.duration}</p>
            </div>
          </div>
        </div>
      </div>
      <ul className="sr-only">{all.map(({ s, item }) => <li key={item.brand}>{s.name}: “{item.hook}”, para {item.brand}, {item.format}, {item.duration}</li>)}</ul>
    </section>
  );
}

/* ------------------------------------------------------------------ an image grows to fill the screen */
function Grow({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "+=120%", pin: true, scrub: 0.6 } })
      .fromTo(root.querySelector("[data-g]"), { clipPath: "inset(12% 38% 46% 38% round 26px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" })
      .fromTo(root.querySelector("[data-g] img"), { scale: 1.35, transformOrigin: "50% 28%" }, { scale: 1, ease: "none" }, 0)
      .fromTo(root.querySelector("[data-q]"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: "none" }, 0.55);
  });
  return (
    <section ref={ref} aria-label="Contenido que se siente real" className="relative h-[100svh] overflow-hidden">
      <div data-g className="absolute inset-0" style={{ background: "#d6c3a9" }}>
        <img src={portrait.src} srcSet={portrait.srcSet} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_12%] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,14,12,0.65)] via-transparent to-transparent" />
      </div>
      <p data-q className="absolute inset-x-0 bottom-[10%] px-5 text-center font-display text-[clamp(48px,8vw,140px)] leading-[0.95] text-cream">Contenido que<br />se siente <span className="text-[#e6b3a6]">real</span></p>
    </section>
  );
}

function Steps() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-s]"));
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (next) gsap.to(c.firstElementChild, { scale: 0.9, rotate: i % 2 ? 2 : -2, ease: "none", scrollTrigger: { trigger: next, start: "top 85%", end: "top 18%", scrub: true } });
    });
  });
  const bg = ["#f8f3ea", "#ecd7cb", "#e3d1b8", "#5c1a1f"];
  return (
    <section ref={ref} id="proceso" aria-labelledby="s-title" className="mx-auto max-w-[1000px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Cómo trabajo</p>
      <h2 id="s-title" className="mt-5 text-center font-display text-[clamp(44px,6.4vw,96px)] leading-[0.95]">Paso a paso, <span className="text-oxblood">carta a carta</span></h2>
      <ol className="mt-16">
        {steps.map((s, i) => (
          <li key={s.n} data-s className="sticky mb-[14vh] last:mb-0" style={{ top: `calc(14svh + ${i * 16}px)` }}>
            <div className="flex min-h-[340px] flex-col justify-between rounded-[36px] p-8 shadow-[0_-24px_50px_-34px_rgba(42,27,22,0.45)] sm:p-12" style={{ background: bg[i], color: i === 3 ? "#f4eee3" : "#2a1b16" }}>
              <div className="flex items-start justify-between">
                <p className="font-display text-[clamp(80px,10vw,150px)] leading-[0.8]">{s.n}</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.26em] opacity-60">Paso {i + 1} de {steps.length}</p>
              </div>
              <div>
                <h3 className="font-display text-[clamp(36px,4vw,60px)] leading-none">{s.title}</h3>
                <p className="mt-3 max-w-[32rem] text-[17px] leading-relaxed opacity-85">{s.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Brands() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-row]").forEach((r, i) => gsap.fromTo(r, { xPercent: i ? -25 : 0 }, { xPercent: i ? 0 : -25, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 } }));
  });
  return (
    <section ref={ref} aria-labelledby="b-title" className="overflow-hidden bg-ink py-[clamp(90px,11vw,150px)] text-cream">
      <h2 id="b-title" className="px-5 text-center text-[11px] font-medium uppercase tracking-[0.26em] text-cream/60">Marcas con las que he trabajado · Formatos</h2>
      <p className="sr-only">{brands.join(", ")}</p>
      {[brands, formats.map((f) => f.name)].map((row, i) => (
        <div key={i} data-row aria-hidden className="mt-8 flex w-max gap-3">
          {[...row, ...row].map((b, k) => (
            <span key={k} className={`rounded-[18px] px-6 py-4 font-display text-[clamp(26px,3vw,44px)] leading-none ${i ? "bg-oxblood" : "bg-cream/10"}`}>{b}</span>
          ))}
        </div>
      ))}
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-ph]"), { y: 120, rotate: (i) => [-10, 6, 12][i], opacity: 0, duration: 1.2, ease: "back.out(1.4)", stagger: 0.12, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto h-[min(110vw,520px)] w-full max-w-[460px]">
          {[{ c: "left-0 top-6 -rotate-6", i: 4 }, { c: "right-0 top-0 rotate-6", i: 7 }].map((p) => (
            <div key={p.i} data-ph className={`absolute aspect-[9/16] w-[46%] overflow-hidden rounded-[22px] ring-[6px] ring-[#fbf8f2] ${p.c}`}><Shot img={portrait} item={all[p.i].item} sizes="220px" className="absolute inset-0" /></div>
          ))}
          <div data-ph className="absolute bottom-0 left-1/2 aspect-[4/5] w-[64%] -translate-x-1/2 overflow-hidden rounded-[26px] ring-[6px] ring-[#fbf8f2]" style={{ background: "#d6c3a9" }}>
            <img src={portrait.src} srcSet={portrait.srcSet} sizes="300px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
          </div>
        </div>
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="a-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] leading-[0.95]">Hola, soy <span className="text-oxblood">Steff</span></h2>
          <p className="mt-6 text-[19px] leading-[1.7]">Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y mucha cercanía.</p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[980px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Preguntas</p>
      <h2 id="f-title" className="mt-5 text-center font-display text-[clamp(44px,6vw,88px)] leading-[0.95]">Antes de <span className="text-oxblood">barajar</span></h2>
      <ul className="mt-12 space-y-3">
        {faqs.map((f, i) => (
          <li key={f.q} className={`rounded-[26px] transition-all duration-500 ${open === i ? "bg-oxblood text-cream" : "bg-[#f8f3ea] hover:-translate-y-0.5"}`}>
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`pq${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center gap-4 p-5 text-left sm:p-6">
                <span className="flex-1 font-display text-[clamp(20px,2.2vw,28px)] leading-tight">{f.q}</span>
                <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform duration-500 ${open === i ? "rotate-45 bg-cream text-oxblood" : "bg-ink/5"}`}>+</span>
              </button>
            </h3>
            <div id={`pq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="px-5 pb-6 pr-16 text-[16px] leading-relaxed opacity-85 sm:px-6">{f.a}</p></div>
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
        <h2 id="c-title" className="mt-6 font-display text-[clamp(56px,9.6vw,160px)] leading-[0.9]">Tu carta, <span className="text-oxblood">la siguiente</span></h2>
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
          <Pile portrait={portrait} />
          <Grow portrait={portrait} />
          <Steps />
          <Brands />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
