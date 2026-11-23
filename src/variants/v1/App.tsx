import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, useMotion, useCopy, reg } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft";
const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));

/* ------------------------------------------------------------------ HERO */
function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      back={<><div aria-hidden className="v2-glow" /><div aria-hidden data-arch className="v2-arch" /></>}
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(root, { clipPath: "inset(40% 28% 40% 28% round 80px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" })
          .from(root.querySelectorAll("[data-l]"), { scale: 2.6, opacity: 0, filter: "blur(24px)", yPercent: -30, duration: 1.3, stagger: 0.07 }, 0.9)
          .from(root.querySelector("[data-arch]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.6 }, 1)
          .from(root.querySelector("[data-fig]"), { yPercent: 25, scale: 1.12, opacity: 0, duration: 1.8 }, 1.05)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -14, duration: 1, stagger: 0.05 }, 1.7);
        gsap.to(root.querySelector(".v2-title"), { yPercent: -35, opacity: 0.2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } });
        gsap.to(root.querySelector("[data-fig]"), { scale: 1.08, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } });
      }}
    />
  );
}

/* ------------------------------------------------------------------ the hero shrinks into a phone and becomes the feed */
const SWIPE = 60; // svh of scroll per clip
function Reels({ hero, portrait }: { hero: Img; portrait: Img }) {
  const track = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const side = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0); // 0 = cover, 1..N = clips
  const N = all.length;
  const starts = services.map((s) => all.findIndex((a) => a.s.id === s.id));

  useEffect(() => {
    reg();
    const el = track.current;
    const sc = screen.current;
    const st = strip.current;
    if (!el || !sc || !st) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = -1;
    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const vh = window.innerHeight;
        const vw = document.documentElement.clientWidth;
        const px = self.progress * (el.offsetHeight - vh);
        const lg = vw >= 1024;
        const ph = lg ? Math.min(vh * 0.76, 780) : Math.min(vh - 220, 640, ((vw - 48) * 16) / 9);
        const pw = (ph * 9) / 16;
        const m = reduce ? 1 : Math.min(Math.max(px / (vh * 0.9), 0), 1);
        const e = 1 - Math.pow(1 - m, 3);
        const frame = vw >= 1024 ? 20 : vw >= 640 ? 16 : 12;
        sc.style.width = `${(vw - frame * 2) + (pw - (vw - frame * 2)) * e}px`;
        sc.style.height = `${(vh - frame * 2) + (ph - (vh - frame * 2)) * e}px`;
        sc.style.borderRadius = `${(lg ? 52 : 28) + ((lg ? 44 : 32) - (lg ? 52 : 28)) * e}px`;
        if (side.current) side.current.style.opacity = String(Math.max(0, (m - 0.75) / 0.25));
        const v = Math.min(Math.max((px - vh) / ((SWIPE / 100) * vh), 0), N);
        const base = Math.floor(v);
        const f = v - base;
        const t = Math.min(Math.max((f - 0.55) / 0.45, 0), 1);
        const pos = Math.min(base + t * t * (3 - 2 * t), N);
        st.style.transform = `translate3d(0, ${(-pos * 100) / (N + 1)}%, 0)`;
        const idx = Math.round(pos);
        if (idx !== last) {
          last = idx;
          setActive(idx);
        }
      },
    });
    return () => trig.kill();
  }, [N]);

  const cur = active > 0 ? all[active - 1] : null;
  return (
    <section id="portafolio" aria-labelledby="r-title" className="relative">
      <h2 id="r-title" className="sr-only">Portafolio de videos</h2>
      <div ref={track} className="relative" style={{ height: `calc(${100 + 90 + N * SWIPE}svh)` }}>
        {services.map((s, i) => (
          <span key={s.id} id={s.id} aria-hidden className="absolute left-0 h-px w-px" style={{ top: `calc(${90 + (starts[i] + 0.6) * SWIPE}svh)` }} />
        ))}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div ref={screen} className="r-screen absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
            <div ref={strip} className="absolute inset-x-0 top-0 will-change-transform" style={{ height: `${(N + 1) * 100}%` }}>
              <div className="relative overflow-hidden" style={{ height: `${100 / (N + 1)}%`, background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
                <p aria-hidden className="r-cover-title absolute inset-x-0 top-[8%] text-center font-display leading-none tracking-[-0.03em] text-ink">Mi feed</p>
                <img src={hero.src} srcSet={hero.srcSet} sizes="600px" alt="" className="absolute bottom-0 left-1/2 h-[74%] w-auto max-w-none -translate-x-1/2" />
              </div>
              {all.map(({ s, item }, i) => (
                <div key={item.brand} className="relative overflow-hidden" style={{ height: `${100 / (N + 1)}%` }}>
                  <Shot img={portrait} item={item} sizes="460px" className="absolute inset-0" />
                  <p className="absolute inset-x-5 top-[22%] text-center"><span className="box-decoration-clone rounded-md bg-cream px-2 py-1 text-[15px] font-semibold leading-[1.8] text-ink">{item.hook}</span></p>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(30,14,12,0.7)] to-transparent p-5 pt-16 text-cream">
                    <p className="text-[12px] font-semibold">@stefframirez</p>
                    <p className="mt-1 font-display text-[22px] leading-tight"><em className="opacity-75">para</em> {item.brand}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.22em] opacity-80">{s.name} · {item.format} · {item.duration}</p>
                  </div>
                  <span className="r-bar absolute inset-x-0 bottom-0 h-[2px] origin-left bg-cream" data-on={active === i + 1} />
                </div>
              ))}
            </div>
          </div>

          <div ref={side} className="pointer-events-none absolute inset-0 opacity-0">
            {/* phones: one line above, one below the screen */}
            <p className={`${kicker} absolute inset-x-0 top-[64px] text-center lg:hidden`}>{cur ? `${cur.s.n} / 04 · ${cur.s.name}` : "Desliza · 12 reels"}</p>
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 lg:hidden">
              <p className="font-display text-[30px] italic leading-none tabular-nums">{String(active).padStart(2, "0")}<span className="text-[0.45em] not-italic text-ink-soft"> / {N}</span></p>
              {cur && <p key={active} className="r-swap max-w-[60%] truncate text-right font-display text-[17px]">“{cur.item.hook}”</p>}
            </div>
            {/* desktop: category left, clip right */}
            <div className="mx-auto hidden h-full max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center px-12 lg:grid">
              <div>
                <p className={kicker}>{cur ? `${cur.s.n} / 04` : "Desliza"}</p>
                <p key={cur?.s.id ?? "x"} className="r-swap mt-2 font-display text-[clamp(48px,5.6vw,96px)] leading-none tracking-[-0.02em]">{cur ? cur.s.name : "12 reels"}</p>
                <p className="mt-3 max-w-[18rem] text-[15px] text-ink-soft">{cur ? cur.s.desc : "Moda, belleza, lifestyle y momlife."}</p>
              </div>
              <div className="col-start-3 justify-self-end text-right">
                <p className="font-display text-[clamp(40px,4vw,64px)] italic leading-none tabular-nums">{String(active).padStart(2, "0")}<span className="text-[0.4em] not-italic text-ink-soft"> / {N}</span></p>
                {cur && (
                  <div key={active} className="r-swap mt-6">
                    <p className="font-display text-[clamp(20px,1.8vw,26px)] leading-tight">“{cur.item.hook}”</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-soft">{cur.item.format} · {cur.item.duration}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className="sr-only">{all.map(({ s, item }) => <li key={item.brand}>{s.name}: “{item.hook}”, para {item.brand}, {item.format}, {item.duration}</li>)}</ul>
    </section>
  );
}

/* ------------------------------------------------------------------ formats: cards that stack */
function Stack({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (next) gsap.to(c.firstElementChild, { scale: 0.92, filter: "brightness(0.9)", ease: "none", scrollTrigger: { trigger: next, start: "top 85%", end: "top 20%", scrub: true } });
    });
  });
  return (
    <section ref={ref} aria-labelledby="f-title" className="mx-auto max-w-[1100px] px-5 pb-[clamp(80px,10vw,140px)] pt-[clamp(110px,14vw,200px)] sm:px-8">
      <div className="text-center">
        <p className={kicker}>Qué puedo crear para ti</p>
        <h2 id="f-title" className="mx-auto mt-5 max-w-[14ch] font-display text-[clamp(44px,7vw,104px)] leading-[0.95] tracking-[-0.02em]">Siete formatos, <em className="text-oxblood">un mismo cuidado</em></h2>
      </div>
      <ol className="mt-16">
        {formats.map((f, i) => {
          const it = all[(i * 2) % all.length].item;
          return (
            <li key={f.name} data-card className="sticky mb-[10vh] last:mb-0" style={{ top: `calc(12svh + ${i * 14}px)` }}>
              <div className="r-card grid origin-top items-center gap-6 rounded-[32px] p-5 sm:grid-cols-[1fr_auto] sm:p-8" style={{ background: i % 2 ? "#ecd7cb" : "#f8f3ea" }}>
                <div className="sm:pl-4">
                  <p className="font-display text-[18px] italic text-oxblood">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-display text-[clamp(38px,5.4vw,76px)] leading-[0.95] tracking-[-0.02em]">{f.name}</h3>
                  <p className="mt-3 text-[17px] text-ink-soft">{f.note}</p>
                </div>
                <div className="relative mx-auto aspect-[9/16] w-[140px] overflow-hidden rounded-[20px] sm:w-[160px]">
                  <Shot img={portrait} item={it} sizes="160px" className="absolute inset-0" />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ process: images grow as each step arrives */
function Grow({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-step]").forEach((s) => {
      gsap.fromTo(s.querySelector("[data-pic]"), { clipPath: "inset(22% 30% 22% 30% round 200px)" }, { clipPath: "inset(0% 0% 0% 0% round 32px)", ease: "none", scrollTrigger: { trigger: s, start: "top 90%", end: "center 55%", scrub: 0.5 } });
      gsap.fromTo(s.querySelector("[data-pic] img"), { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: s, start: "top 90%", end: "center 55%", scrub: 0.5 } });
      gsap.from(s.querySelectorAll("[data-tx]"), { y: 30, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: s, start: "top 70%", once: true } });
    });
  });
  const pics = [all[0].item, all[4].item, all[6].item, all[10].item];
  return (
    <section ref={ref} id="proceso" aria-labelledby="p-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <p className={kicker}>Cómo trabajo</p>
        <h2 id="p-title" className="mt-5 max-w-[14ch] font-display text-[clamp(44px,7vw,104px)] leading-[0.95] tracking-[-0.02em]">De la idea <em className="text-oxblood">a tu feed</em></h2>
        <ol className="mt-16 space-y-[clamp(56px,8vw,110px)]">
          {steps.map((s, i) => (
            <li key={s.n} data-step className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div data-pic className="relative aspect-[4/3] overflow-hidden rounded-[32px]">
                <Shot img={portrait} item={pics[i]} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0" />
              </div>
              <div>
                <p data-tx className="font-display text-[clamp(64px,8vw,120px)] italic leading-[0.8] text-oxblood">{s.n}</p>
                <h3 data-tx className="mt-5 font-display text-[clamp(34px,4vw,56px)] leading-none">{s.title}</h3>
                <p data-tx className="mt-4 max-w-[30rem] text-[18px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-circle]"), { clipPath: "circle(16% at 50% 38%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "none", scrollTrigger: { trigger: root, start: "top 80%", end: "center 50%", scrub: 0.6 } });
    gsap.from(root.querySelectorAll("[data-tx]"), { y: 30, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root, start: "top 55%", once: true } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-circle className="relative aspect-[4/5] overflow-hidden rounded-[36px]" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
        </div>
        <div>
          <p data-tx className={kicker}>Sobre mí</p>
          <h2 id="a-title" data-tx className="mt-5 font-display text-[clamp(48px,6vw,96px)] leading-[0.95] tracking-[-0.02em]">Hola, soy <em className="text-oxblood">Steff</em></h2>
          <p data-tx className="mt-6 text-[19px] leading-[1.7]">Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y mucha cercanía.</p>
          <dl data-tx className="mt-10 grid grid-cols-3 gap-3">
            {[[String(all.length), "reels"], ["4", "mundos"], ["9:16", "formato"]].map(([n, l]) => (
              <div key={l} className="rounded-[20px] bg-[#f8f3ea] p-4"><dd className="font-display text-[32px] leading-none">{n}</dd><dt className="mt-1 text-[12px] text-ink-soft">{l}</dt></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ as quick replies */
function Faq() {
  const [i, setI] = useState(0);
  return (
    <section id="faq" aria-labelledby="q-title" className="mx-auto max-w-[1000px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <div className="text-center">
        <p className={kicker}>Respuestas rápidas</p>
        <h2 id="q-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] leading-[0.95] tracking-[-0.02em]">Toca una <em className="text-oxblood">pregunta</em></h2>
      </div>
      <div role="group" aria-label="Preguntas" className="mt-12 flex flex-wrap justify-center gap-2.5">
        {faqs.map((f, k) => (
          <button key={f.q} type="button" aria-pressed={i === k} aria-controls="r-answer" onClick={() => setI(k)} className={`cursor-pointer rounded-full px-5 py-3 text-[15px] transition-all duration-300 ${i === k ? "bg-ink text-cream" : "bg-[#f8f3ea] hover:-translate-y-0.5 hover:bg-sand"}`}>{f.q}</button>
        ))}
      </div>
      <div id="r-answer" aria-live="polite" className="mx-auto mt-8 max-w-[720px]">
        <div key={i} className="r-pop rounded-[32px] bg-oxblood p-7 text-cream sm:p-10">
          <p className="font-display text-[clamp(24px,2.6vw,34px)] italic leading-tight">{faqs[i].q}</p>
          <p className="mt-4 text-[17px] leading-relaxed text-cream/85">{faqs[i].a}</p>
        </div>
      </div>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-card]"), { clipPath: "inset(18% 12% 18% 12% round 120px)" }, { clipPath: "inset(0% 0% 0% 0% round 52px)", ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 30%", scrub: 0.5 } });
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div data-card className="grain v2-radius relative flex min-h-[86svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="c-title" className="mt-6 font-display text-[clamp(56px,10vw,170px)] leading-[0.9] tracking-[-0.03em]">Tu próximo <em className="text-oxblood">reel</em></h2>
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
          <Reels hero={hero} portrait={portrait} />
          <Stack portrait={portrait} />
          <Grow portrait={portrait} />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
