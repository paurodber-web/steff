import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, useMotion, useCopy, useFinePointer, reg } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";
const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));

function TextRing({ text, className, id }: { text: string; className?: string; id: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className={className}>
      <defs><path id={id} d="M200,200 m-180,0 a180,180 0 1,1 360,0 a180,180 0 1,1 -360,0" /></defs>
      <text className="fill-current" style={{ fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 500 }}><textPath href={`#${id}`}>{text}</textPath></text>
    </svg>
  );
}

function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      back={
        <>
          <div aria-hidden className="v2-glow" />
          <div aria-hidden className="o-orbit"><TextRing id="o-hero" className="o-spin h-full w-full text-ink/45" text="UGC Creator · Moda · Belleza · Lifestyle · Momlife · Contenido que se siente real · " /><span className="o-moon" /></div>
        </>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { clipPath: "circle(0% at 50% 60%)", duration: 1.6, ease: "expo.inOut" })
          .from(root.querySelector(".o-orbit"), { scale: 0.4, opacity: 0, rotate: -90, duration: 2 }, 0.6)
          .from(root.querySelectorAll("[data-l]"), { opacity: 0, scale: 0.6, duration: 1.4, stagger: 0.07 }, 0.8)
          .from(root.querySelector("[data-fig]"), { opacity: 0, y: 30, duration: 1.8 }, 1)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 1, stagger: 0.06 }, 1.6);
        gsap.to(root.querySelector(".o-orbit"), { rotate: 120, scale: 1.2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
      }}
    />
  );
}

/* ------------------------------------------------------------------ 3D ring carousel driven by scroll */
function Carousel({ portrait }: { portrait: Img }) {
  const track = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const N = all.length;
  const step = 360 / N;
  useEffect(() => {
    reg();
    const el = track.current;
    const r = ring.current;
    if (!el || !r) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const deg = self.progress * (360 - step);
        if (!reduce) r.style.transform = `translateZ(calc(var(--o-r) * -1)) rotateY(${-deg}deg)`;
        const idx = Math.round(deg / step) % N;
        if (idx !== last) {
          last = idx;
          setActive(idx);
        }
      },
    });
    return () => st.kill();
  }, [N, step]);
  const cur = all[active];
  const starts = services.map((s) => all.findIndex((a) => a.s.id === s.id));
  return (
    <section id="portafolio" aria-labelledby="o-title">
      <div className="mx-auto max-w-[1200px] px-5 pb-6 pt-[clamp(120px,15vw,220px)] text-center sm:px-8">
        <p className={kicker}>Portafolio</p>
        <h2 id="o-title" className="mt-6 font-display text-[clamp(52px,8vw,132px)] leading-[0.92] tracking-[-0.02em]">Todo gira <em className="text-oxblood">alrededor</em> de tu marca</h2>
      </div>
      <div ref={track} className="relative" style={{ height: `${N * 32 + 100}svh` }}>
        {services.map((s, i) => <span key={s.id} id={s.id} aria-hidden className="absolute left-0 h-px w-px" style={{ top: `${(starts[i] / (N - 1)) * N * 32}svh` }} />)}
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
          <div className="o-stage">
            <div ref={ring} className="o-ring">
              {all.map(({ s, item }, i) => (
                <figure key={item.brand} className="o-card" style={{ transform: `rotateY(${i * step}deg) translateZ(var(--o-r))` }} data-on={i === active}>
                  <div className="relative h-full w-full overflow-hidden rounded-[18px] shadow-[0_30px_50px_-30px_rgba(42,27,22,0.6)]">
                    <Shot img={portrait} item={item} sizes="220px" className="absolute inset-0" />
                    <span className="absolute left-2 top-2 rounded-full bg-cream/85 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em]">{s.name}</span>
                  </div>
                </figure>
              ))}
            </div>
          </div>
          <div key={active} className="o-swap mt-6 px-5 text-center">
            <p className={kicker}>{String(active + 1).padStart(2, "0")} / {N} · {cur.s.name}</p>
            <p className="mt-3 font-display text-[clamp(26px,3vw,44px)] italic leading-tight">“{cur.item.hook}”</p>
            <p className="mt-2 text-[14px] text-ink-soft">para {cur.item.brand} · {cur.item.format} · {cur.item.duration}</p>
          </div>
        </div>
      </div>
      <ul className="sr-only">{all.map(({ s, item }) => <li key={item.brand}>{s.name}: {item.hook}, para {item.brand} ({item.format}, {item.duration})</li>)}</ul>
    </section>
  );
}

/* ------------------------------------------------------------------ process dial */
function Dial() {
  const track = useRef<HTMLDivElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    reg();
    const el = track.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (arc.current) arc.current.style.strokeDashoffset = String(1 - self.progress);
        setI(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
      },
    });
    return () => st.kill();
  }, []);
  const s = steps[i];
  return (
    <section id="proceso" aria-labelledby="d-title" className="bg-[#ece3d5]">
      <div ref={track} className="relative" style={{ height: "300svh" }}>
        <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-5">
          <div className="relative aspect-square w-[min(84vw,620px)]">
            <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(42,27,22,0.12)" strokeWidth="0.6" />
              <circle ref={arc} cx="100" cy="100" r="92" fill="none" stroke="#5c1a1f" strokeWidth="1.2" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
            </svg>
            {steps.map((st, k) => {
              const a = (k / steps.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <span key={st.n} aria-hidden className={`absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-[16px] italic transition-colors duration-500 ${k <= i ? "bg-oxblood text-cream" : "bg-[#f8f3ea] text-ink"}`} style={{ left: `${50 + Math.cos(a) * 46}%`, top: `${50 + Math.sin(a) * 46}%` }}>{st.n}</span>
              );
            })}
            <div key={i} className="o-swap absolute inset-[16%] flex flex-col items-center justify-center text-center">
              <p className={kicker}>Cómo trabajo · paso {i + 1} de {steps.length}</p>
              <h2 id="d-title" className="mt-3 font-display text-[clamp(44px,7vw,96px)] leading-none">{s.title}</h2>
              <p className="mt-4 max-w-[22rem] text-[clamp(14px,1.4vw,17px)] leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          </div>
        </div>
      </div>
      <ol className="sr-only">{steps.map((st) => <li key={st.n}>{st.title}: {st.text}</li>)}</ol>
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-3 px-5 pb-24">
        {formats.map((f) => <span key={f.name} title={f.note} className="rounded-full border border-ink/15 px-5 py-2.5 font-display text-[18px]">{f.name}</span>)}
      </div>
    </section>
  );
}

function Constellation() {
  const n = brands.length;
  return (
    <section aria-labelledby="cn-title" className="relative grid place-items-center overflow-hidden bg-ink py-[clamp(100px,12vw,160px)] text-cream">
      <div className="relative aspect-square w-[min(92vw,680px)]">
        <div className="o-slow absolute inset-0">
          {brands.map((b, k) => {
            const a = (k / n) * Math.PI * 2;
            return (
              <span key={b} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + Math.cos(a) * 42}%`, top: `${50 + Math.sin(a) * 42}%` }}>
                <span className="o-upright block whitespace-nowrap font-display text-[clamp(15px,1.8vw,22px)] italic">{b}</span>
              </span>
            );
          })}
        </div>
        <div className="absolute inset-[24%] grid place-items-center rounded-full border border-cream/20 text-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cream/60">{n} marcas</p>
            <h2 id="cn-title" className="mt-3 font-display text-[clamp(30px,4.6vw,64px)] leading-[0.95]">Han confiado <em className="text-[#e6b3a6]">en mí</em></h2>
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
    gsap.fromTo(root.querySelector("[data-circle]"), { clipPath: "circle(10% at 50% 40%)" }, { clipPath: "circle(70% at 50% 50%)", ease: "none", scrollTrigger: { trigger: root, start: "top 85%", end: "center 55%", scrub: 0.6 } });
    gsap.fromTo(root.querySelector("[data-rot]"), { rotate: -90 }, { rotate: 180, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="ab-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-[460px]">
          <div data-rot className="absolute inset-0"><TextRing id="o-about" className="h-full w-full text-oxblood/70" text="Steff Ramírez · creadora UGC · luz natural · español · 9:16 · " /></div>
          <div data-circle className="absolute inset-[10%] overflow-hidden rounded-full" style={{ background: "#d6c3a9" }}>
            <img src={portrait.src} srcSet={portrait.srcSet} sizes="380px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
          </div>
        </div>
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="ab-title" className="mt-6 font-display text-[clamp(52px,6.4vw,104px)] leading-[0.92] tracking-[-0.02em]">El centro <em className="text-oxblood">soy yo</em></h2>
          <p className="mt-8 text-[19px] leading-[1.75]">Soy Steff. Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y mucha cercanía.</p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="fq-title" className="mx-auto max-w-[1000px] px-5 pb-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Preguntas</p>
      <h2 id="fq-title" className="mt-6 text-center font-display text-[clamp(48px,6vw,96px)] leading-[0.95]">Lo que <em className="text-oxblood">quizá</em> te preguntas</h2>
      <ul className="mt-14">
        {faqs.map((f, i) => (
          <li key={f.q} className="border-t border-ink/15 last:border-b">
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`oq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group flex w-full cursor-pointer items-center gap-5 py-6 text-left">
                <span aria-hidden className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${open === i ? "border-oxblood bg-oxblood text-cream" : "border-ink/25"}`}>
                  <span className="absolute h-px w-3.5 bg-current" /><span className={`absolute h-3.5 w-px bg-current transition-transform duration-500 ${open === i ? "scale-y-0" : ""}`} />
                </span>
                <span className={`flex-1 font-display text-[clamp(22px,2.4vw,32px)] leading-tight ${open === i ? "italic text-oxblood" : "group-hover:text-oxblood"}`}>{f.q}</span>
              </button>
            </h3>
            <div id={`oq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="max-w-[40rem] pb-7 pl-[60px] text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);
  const fine = useFinePointer();
  const { copy, done } = useCopy(EMAIL);
  useEffect(() => {
    const el = btn.current;
    if (!el || !fine) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.3);
      y((e.clientY - (r.top + r.height / 2)) * 0.3);
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,0.4)" });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [fine]);
  return (
    <section id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="c-title" className="mt-6 font-display text-[clamp(56px,9vw,150px)] leading-[0.9] tracking-[-0.02em]">Cerremos <em className="text-oxblood">el círculo</em></h2>
        <div className="relative mt-12 grid place-items-center">
          <TextRing id="o-cta" className="o-spin absolute h-[260px] w-[260px] text-ink/50" text="Escríbeme · cuéntame tu idea · Escríbeme · cuéntame tu idea · " />
          <button ref={btn} type="button" onClick={onContact} className="relative grid h-[180px] w-[180px] cursor-pointer place-items-center rounded-full bg-ink text-[12px] font-medium uppercase tracking-[0.24em] text-cream transition-colors hover:bg-oxblood">Escríbeme ↗</button>
        </div>
        <p className="mt-12 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4">{done ? "copiado" : "copiar"}</button></p>
        <ul className="mt-6 flex gap-6 text-[11px] font-medium uppercase tracking-[0.24em]">
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
          <Carousel portrait={portrait} />
          <Dial />
          <Constellation />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
