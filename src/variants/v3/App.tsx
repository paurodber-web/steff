import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, useMotion, useCopy, reg } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.24em] text-ink-soft";
const secs = (d: string) => Number(d.split(":")[0]) * 60 + Number(d.split(":")[1]);
const tc = (t: number) => `00:${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}:${String(Math.floor((t % 1) * 24)).padStart(2, "0")}`;

/* sequence: the four worlds play one after another; each clip keeps its real length */
const seq = (() => {
  let t = 0;
  return services.flatMap((s, track) =>
    portfolio[s.id].map((item) => {
      const d = secs(item.duration);
      const c = { s, track, item, start: t, dur: d };
      t += d;
      return c;
    }),
  );
})();
const TOTAL = seq.reduce((n, c) => n + c.dur, 0);

/* ------------------------------------------------------------------ HERO: the preview monitor */
function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      back={<div aria-hidden className="v2-glow" />}
      front={
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[35]">
          <div data-guides className="ed-guides absolute inset-[6%]" />
          <span data-guides className="ed-safe absolute inset-[11%]" />
          {["left-4 top-4", "right-4 top-4 rotate-90", "bottom-4 right-4 rotate-180", "bottom-4 left-4 -rotate-90"].map((p) => <span key={p} data-corner className={`ed-corner absolute ${p}`} />)}
          <p data-guides className="absolute bottom-[68px] left-1/2 -translate-x-1/2 rounded-md bg-[rgba(30,14,12,0.72)] px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-cream lg:bottom-16">● REC {tc(0)}</p>
        </div>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { scale: 0.86, filter: "brightness(0.6) saturate(0)", duration: 1.4, ease: "expo.inOut" })
          .from(root.querySelectorAll("[data-corner]"), { scale: 2.4, opacity: 0, duration: 0.8, stagger: 0.05 }, 0.3)
          .from(root.querySelectorAll("[data-guides]"), { opacity: 0, duration: 0.6 }, 0.6)
          // keyframe-style arrivals: overshoot, settle
          .from(root.querySelectorAll("[data-l]"), { scale: 0, rotate: (i) => [-18, 12, -8, 14, -12][i % 5], duration: 1, ease: "back.out(2.2)", stagger: 0.08 }, 0.8)
          .from(root.querySelector("[data-fig]"), { xPercent: -30, opacity: 0, duration: 1.3, ease: "back.out(1.4)" }, 1.1)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 1.6)
          .to(root.querySelectorAll("[data-guides]"), { opacity: 0, duration: 1.2 }, 2.8);
        gsap.to(root, { scale: 0.9, borderRadius: 72, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } });
      }}
    />
  );
}

/* ------------------------------------------------------------------ TIMELINE: scroll is the playhead */
function Timeline({ portrait }: { portrait: Img }) {
  const track = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [cur, setCur] = useState(0);
  useEffect(() => {
    reg();
    const el = track.current;
    if (!el) return;
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const t = self.progress * TOTAL;
        if (head.current) head.current.style.left = `${self.progress * 100}%`;
        if (clock.current) clock.current.textContent = tc(t);
        let i = seq.findIndex((c) => t >= c.start && t < c.start + c.dur);
        if (i < 0) i = seq.length - 1;
        if (i !== last) {
          last = i;
          setCur(i);
        }
      },
    });
    return () => st.kill();
  }, []);
  const c = seq[cur];
  const firstOf = services.map((s) => seq.findIndex((x) => x.s.id === s.id));
  return (
    <section id="portafolio" aria-labelledby="t-title">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
        <p className={kicker}>Portafolio · {tc(TOTAL).slice(3, 8)} de contenido</p>
        <h2 id="t-title" className="mt-5 max-w-[16ch] font-display text-[clamp(44px,7vw,108px)] font-semibold leading-[0.92] tracking-[-0.04em]">Baja y <span className="text-oxblood">reproduce</span> mi timeline</h2>
      </div>
      <div ref={track} className="relative" style={{ height: "520svh" }}>
        {services.map((s, i) => <span key={s.id} id={s.id} aria-hidden className="absolute left-0 h-px w-px" style={{ top: `${(seq[firstOf[i]].start / TOTAL) * 420 + 2}svh` }} />)}
        <div className="sticky top-0 flex h-[100svh] flex-col gap-4 px-3 pb-4 pt-20 sm:px-4 lg:px-5 lg:pt-24">
          {/* monitor */}
          <div className="ed-panel grid min-h-0 flex-1 grid-cols-1 gap-4 rounded-[28px] p-3 sm:p-4 md:grid-cols-[1fr_auto_1fr] lg:rounded-[40px]">
            <div className="hidden flex-col justify-between p-4 md:flex">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream/55">Pista {c.track + 1} · {c.s.name}</p>
              <div key={cur} className="ed-swap">
                <p className="font-display text-[clamp(32px,3.6vw,60px)] font-semibold leading-[0.95] tracking-[-0.03em] text-cream">“{c.item.hook}”</p>
                <p className="mt-3 text-[14px] text-cream/70">para {c.item.brand} · {c.item.format}</p>
              </div>
            </div>
            <div className="relative mx-auto aspect-[9/16] h-full max-h-full overflow-hidden rounded-[18px] bg-ink">
              <Shot key={cur} img={portrait} item={c.item} sizes="360px" className="ed-cut absolute inset-0" />
              <p className="absolute inset-x-3 top-[22%] text-center"><span className="box-decoration-clone rounded bg-cream px-1.5 py-0.5 text-[13px] font-semibold leading-[1.75] text-ink">{c.item.hook}</span></p>
              <span className="absolute left-2 top-2 rounded bg-[rgba(30,14,12,0.7)] px-1.5 py-0.5 font-mono text-[10px] text-cream"><span ref={clock}>{tc(0)}</span></span>
            </div>
            <div className="hidden flex-col items-end justify-between p-4 text-right md:flex">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream/55">Clip {String(cur + 1).padStart(2, "0")} / {seq.length}</p>
              <dl className="space-y-3 font-mono text-[12px] text-cream/80">
                <div><dt className="text-cream/45">Duración</dt><dd>{c.item.duration}</dd></div>
                <div><dt className="text-cream/45">Formato</dt><dd>{c.item.format}</dd></div>
                <div><dt className="text-cream/45">Relación</dt><dd>9:16 · subtítulos</dd></div>
              </dl>
            </div>
          </div>
          {/* timeline */}
          <div className="ed-panel relative rounded-[22px] p-3 sm:p-4 lg:rounded-[28px]">
            <div className="relative ml-[64px] sm:ml-[92px]">
              <div aria-hidden className="ed-ruler mb-2 h-4" />
              <div className="space-y-1.5">
                {services.map((s, ti) => (
                  <div key={s.id} className="relative h-8 rounded-md bg-cream/5 sm:h-10">
                    <span className={`absolute -left-[64px] top-1/2 w-[58px] -translate-y-1/2 truncate font-mono text-[10px] uppercase sm:-left-[92px] sm:w-[84px] sm:text-[11px] ${c.track === ti ? "text-cream" : "text-cream/45"}`}>{s.name}</span>
                    {seq.filter((x) => x.track === ti).map((x) => {
                      const on = seq[cur] === x;
                      return (
                        <span key={x.item.brand} className={`absolute top-0 h-full overflow-hidden rounded-md border transition-colors ${on ? "border-cream" : "border-transparent"}`} style={{ left: `${(x.start / TOTAL) * 100}%`, width: `calc(${(x.dur / TOTAL) * 100}% - 2px)`, background: x.item.tone === "oxblood" ? "#7a2a2f" : "#cdb592" }}>
                          <span className="absolute inset-y-0 left-0 w-8 opacity-80"><Shot img={portrait} item={x.item} sizes="40px" className="absolute inset-0" /></span>
                          <span className={`absolute inset-y-0 left-9 hidden items-center truncate text-[11px] font-medium lg:flex ${x.item.tone === "oxblood" ? "text-cream" : "text-ink"}`}>{x.item.brand}</span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <span ref={head} aria-hidden className="ed-head absolute -bottom-1 -top-1 w-px bg-[#e9a596]" />
            </div>
          </div>
        </div>
      </div>
      <ul className="sr-only">{seq.map((x) => <li key={x.item.brand}>{x.s.name}: “{x.item.hook}”, para {x.item.brand}, {x.item.format}, {x.item.duration}</li>)}</ul>
    </section>
  );
}

/* ------------------------------------------------------------------ PROCESS: an export bar */
function Export() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    reg();
    const el = ref.current?.querySelector<HTMLElement>("[data-run]");
    if (!el) return;
    const st = ScrollTrigger.create({ trigger: el, start: "top 70%", end: "bottom 50%", onUpdate: (s) => setP(s.progress) });
    return () => st.kill();
  }, []);
  const step = Math.min(steps.length - 1, Math.floor(p * steps.length));
  return (
    <section ref={ref} id="proceso" aria-labelledby="e-title" className="mx-auto max-w-[1100px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={kicker}>Cómo trabajo</p>
      <h2 id="e-title" className="mt-5 font-display text-[clamp(44px,6.4vw,100px)] font-semibold leading-[0.95] tracking-[-0.04em]">Exportando <span className="text-oxblood">tu video</span>…</h2>
      <div data-run className="relative mt-14" style={{ height: "160svh" }}>
        <div className="sticky top-[18svh] rounded-[28px] bg-[#f8f3ea] p-6 shadow-[0_40px_70px_-50px_rgba(42,27,22,0.6)] sm:p-10">
          <div className="flex items-baseline justify-between font-mono text-[13px]">
            <span>Paso {step + 1} de {steps.length} · {steps[step].title}</span>
            <span className="tabular-nums">{Math.round(p * 100)}%</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} aria-label="Progreso del proceso">
            <div className="h-full rounded-full bg-oxblood transition-[width] duration-150" style={{ width: `${p * 100}%` }} />
          </div>
          <ol className="mt-8 grid gap-4 sm:grid-cols-4">
            {steps.map((s, k) => (
              <li key={s.n} className={`rounded-[20px] p-5 transition-all duration-500 ${k <= step ? "bg-ink text-cream" : "bg-cream text-ink/45"} ${k === step ? "" : "hidden sm:block"}`}>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] opacity-70">{k < step ? "✓ Listo" : k === step ? "En curso" : "En cola"}</p>
                <h3 className="mt-3 font-display text-[26px] font-semibold leading-none tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed opacity-80">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Presets() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-p]"), { y: 50, opacity: 0, scale: 0.94, duration: 1, ease: "back.out(1.5)", stagger: 0.06, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });
  return (
    <section ref={ref} aria-labelledby="pr-title" className="bg-ink py-[clamp(100px,12vw,170px)] text-cream">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cream/55">Plantillas</p>
        <h2 id="pr-title" className="mt-5 font-display text-[clamp(40px,5.4vw,80px)] font-semibold leading-[0.95] tracking-[-0.04em]">Formatos listos <span className="text-[#e9a596]">para tu marca</span></h2>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map((f, i) => (
            <li key={f.name} data-p className="group rounded-[22px] border border-cream/12 bg-cream/[0.04] p-5 transition-colors hover:bg-cream hover:text-ink">
              <p className="font-mono text-[11px] text-cream/50 group-hover:text-ink/50">.preset {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-6 font-display text-[28px] font-semibold leading-none tracking-[-0.02em]">{f.name}</p>
              <p className="mt-2 text-[14px] opacity-75">{f.note}</p>
            </li>
          ))}
          <li data-p className="rounded-[22px] bg-oxblood p-5">
            <p className="font-mono text-[11px] text-cream/60">.marcas</p>
            <p className="mt-6 text-[14px] leading-relaxed">{brands.join(" · ")}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-mon]"), { clipPath: "inset(48% 0% 48% 0% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: root, start: "top 85%", end: "center 55%", scrub: 0.5 } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div data-mon className="ed-panel relative aspect-[4/5] overflow-hidden rounded-[24px] p-3">
          <div className="relative h-full w-full overflow-hidden rounded-[16px]" style={{ background: "#d6c3a9" }}>
            <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
            <span className="ed-guides absolute inset-[8%] opacity-60" />
          </div>
        </div>
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="a-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] font-semibold leading-[0.95] tracking-[-0.04em]">Directora, actriz <span className="text-oxblood">y editora</span></h2>
          <p className="mt-6 text-[19px] leading-[1.7]">Soy Steff. Escribo, grabo y edito contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, con luz natural y mucha cercanía.</p>
          <dl className="mt-8 grid grid-cols-2 gap-3 font-mono text-[13px] sm:grid-cols-4">
            {[["Idioma", "Español"], ["Luz", "Natural"], ["Formato", "9:16"], ["Extras", "Subtítulos"]].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[#f8f3ea] p-3"><dt className="text-ink-soft">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Shortcuts() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[980px] px-5 sm:px-8">
        <p className={kicker}>Atajos</p>
        <h2 id="f-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] font-semibold leading-[0.95] tracking-[-0.04em]">Respuestas <span className="text-oxblood">rápidas</span></h2>
        <ul className="mt-12 space-y-2.5">
          {faqs.map((f, i) => (
            <li key={f.q} className="overflow-hidden rounded-[20px] bg-[#f8f3ea]">
              <h3>
                <button type="button" aria-expanded={open === i} aria-controls={`eq${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center gap-4 p-4 text-left sm:p-5">
                  <kbd className={`grid h-9 min-w-9 place-items-center rounded-lg border-b-2 px-2 font-mono text-[13px] transition-colors ${open === i ? "border-[#3a0f13] bg-oxblood text-cream" : "border-ink/25 bg-cream"}`}>{i + 1}</kbd>
                  <span className="flex-1 font-display text-[clamp(19px,2vw,24px)] font-medium leading-tight tracking-[-0.01em]">{f.q}</span>
                  <span aria-hidden className={`font-mono text-[18px] transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
              </h3>
              <div id={`eq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
                <div><p className="px-5 pb-6 pl-[68px] text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
              </div>
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
    <section id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="c-title" className="mt-6 font-display text-[clamp(52px,9vw,150px)] font-semibold leading-[0.9] tracking-[-0.05em]">Nuevo <span className="text-oxblood">proyecto</span></h2>
        <button type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
          Empezar a grabar<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink"><span className="block h-3 w-3 rounded-full bg-[#b3261e] transition-transform group-hover:scale-125" /></span>
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
          <Timeline portrait={portrait} />
          <Export />
          <Presets />
          <About portrait={portrait} />
          <Shortcuts />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
