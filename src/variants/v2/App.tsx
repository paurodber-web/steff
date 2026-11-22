import { useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, SplitText, useMotion, useCopy } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";

/* ------------------------------------------------------------------ HERO: the cover */
function Cover({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  const lines = [
    { k: "Moda", t: "3 looks con un solo blazer" },
    { k: "Belleza", t: "Mi piel en 5 minutos" },
    { k: "Lifestyle", t: "Un martes cualquiera" },
    { k: "Momlife", t: "Lo que nadie te cuenta" },
  ];
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      flanks={false}
      title={<Letters />}
      back={<div aria-hidden className="v2-glow" />}
      front={
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
          <div className="absolute left-12 top-[44%] flex w-[19vw] max-w-[260px] flex-col gap-7">
            {lines.slice(0, 2).map((l) => (
              <p key={l.k} data-in className="e-line">
                <span className={kicker}>{l.k}</span>
                <span className="mt-2 block font-display text-[clamp(20px,1.7vw,26px)] italic leading-[1.1] text-ink">{l.t}</span>
              </p>
            ))}
          </div>
          <div className="absolute right-12 top-[44%] flex w-[19vw] max-w-[260px] flex-col gap-7 text-right">
            {lines.slice(2).map((l) => (
              <p key={l.k} data-in className="e-line e-line--r">
                <span className={kicker}>{l.k}</span>
                <span className="mt-2 block font-display text-[clamp(20px,1.7vw,26px)] italic leading-[1.1] text-ink">{l.t}</span>
              </p>
            ))}
          </div>
          <p data-in className={`${kicker} absolute left-12 top-[30%]`}>Nº 12 — Edición para marcas</p>
          <svg data-in viewBox="0 0 120 40" className="absolute bottom-16 right-12 h-10 w-[120px] text-ink/70">
            {Array.from({ length: 38 }).map((_, i) => (
              <rect key={i} x={i * 3.1} y="0" width={i % 3 ? 1 : 2} height={i % 5 ? 30 : 34} fill="currentColor" />
            ))}
          </svg>
        </div>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { clipPath: "inset(0 0 100% 0 round 52px)", duration: 1.3, ease: "expo.inOut" })
          .from(root.querySelectorAll("[data-l]"), { yPercent: -40, opacity: 0, duration: 1.3, stagger: 0.07 }, 0.5)
          .from(root.querySelector("[data-fig]"), { clipPath: "inset(0 0 100% 0)", duration: 1.6 }, 0.8)
          .from(root.querySelectorAll(".e-line:not(.e-line--r)"), { x: -40, opacity: 0, duration: 1.1, stagger: 0.1 }, 1.4)
          .from(root.querySelectorAll(".e-line--r"), { x: 40, opacity: 0, duration: 1.1, stagger: 0.1 }, 1.4)
          .from(root.querySelectorAll("[data-in]:not(.e-line)"), { opacity: 0, y: -10, duration: 0.9, stagger: 0.05 }, 1.6);
        gsap.to(root.querySelector("[data-fig]"), { yPercent: 6, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
        gsap.to(root.querySelector(".v2-title"), { yPercent: -30, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
      }}
    />
  );
}

/* ------------------------------------------------------------------ SUMARIO */
function Contents() {
  const ref = useRef<HTMLElement>(null);
  const items = [
    ["portafolio", "Reportajes", "Moda, belleza, lifestyle y momlife", "04"],
    ["proceso", "Método", "Del brief a la publicación", "12"],
    ["sobre-mi", "Entrevista", "Quién está detrás de la cámara", "18"],
    ["faq", "Consultorio", "Derechos, envíos y tarifas", "22"],
    ["contacto", "Contraportada", "Escríbeme", "24"],
  ];
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-row]"), { opacity: 0, y: -16, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });
  return (
    <section ref={ref} aria-labelledby="sum-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className={kicker}>En este número</p>
          <h2 id="sum-title" className="mt-5 font-display text-[clamp(56px,7vw,110px)] leading-[0.92] tracking-[-0.02em]">Sumario</h2>
          <p className="mt-6 max-w-[20rem] text-[16px] leading-relaxed text-ink-soft">Contenido que se siente real, para marcas que quieren conectar sin parecer publicidad.</p>
        </div>
        <ol className="lg:col-span-8">
          {items.map(([id, t, d, n]) => (
            <li key={id} data-row>
              <a href={`#${id}`} className="group flex items-baseline gap-5 border-b border-ink/15 py-6">
                <span className="font-display text-[22px] italic text-oxblood">{n}</span>
                <span className="font-display text-[clamp(30px,3.4vw,48px)] leading-none transition-transform duration-500 group-hover:translate-x-2 group-hover:italic">{t}</span>
                <span className="e-leader hidden flex-1 sm:block" aria-hidden />
                <span className="ml-auto text-right text-[14px] text-ink-soft sm:ml-0">{d}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ REPORTAJES: spreads with page turn */
function Spreads({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      root.querySelectorAll<HTMLElement>("[data-spread]").forEach((sp) => {
        gsap.fromTo(sp.querySelector("[data-page]"), { rotateY: (i, el) => ((el as HTMLElement).classList.contains("e-page--r") ? 92 : -92), filter: "brightness(0.8)" }, { rotateY: 0, filter: "brightness(1)", ease: "none", scrollTrigger: { trigger: sp, start: "top 85%", end: "top 25%", scrub: 0.6 } });
        gsap.fromTo(sp.querySelector("[data-big] img"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: sp, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
    });
    mm.add("(max-width: 1023px)", () => {
      root.querySelectorAll<HTMLElement>("[data-spread]").forEach((sp) => gsap.from(sp.querySelectorAll("[data-big], [data-page]"), { opacity: 0, y: -30, duration: 1.2, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: sp, start: "top 80%", once: true } }));
    });
    return () => mm.revert();
  });
  return (
    <section ref={ref} id="portafolio" aria-labelledby="rep-title" className="px-3 pb-[clamp(80px,10vw,160px)] sm:px-4 lg:px-5">
      <div className="mx-auto max-w-[1200px] px-2 pb-14 text-center sm:px-4">
        <p className={kicker}>Reportajes · p. 04</p>
        <h2 id="rep-title" className="mt-5 font-display text-[clamp(52px,8vw,128px)] leading-[0.92] tracking-[-0.02em]">Cuatro <em className="text-oxblood">historias</em></h2>
      </div>
      <div className="space-y-[clamp(40px,6vw,96px)]">
        {services.map((s, i) => {
          const items = portfolio[s.id];
          const lead = items[0];
          return (
            <article key={s.id} id={s.id} data-spread aria-labelledby={`sp-${s.id}`} className="mx-auto grid max-w-[1440px] scroll-mt-20 overflow-hidden rounded-[28px] bg-[#f8f3ea] shadow-[0_40px_80px_-60px_rgba(42,27,22,0.6)] [perspective:2200px] sm:rounded-[40px] lg:min-h-[86svh] lg:grid-cols-2 lg:rounded-[52px]">
              <div data-big className={`relative min-h-[60svh] overflow-hidden ${i % 2 ? "lg:order-2" : ""}`}>
                <Shot img={portrait} item={lead} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0" />
                <p className="absolute bottom-6 left-6 rounded-full bg-cream/90 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] backdrop-blur">para {lead.brand} · {lead.format}</p>
              </div>
              <div data-page className={`e-page relative flex flex-col justify-between gap-10 bg-[#f8f3ea] p-7 sm:p-12 lg:p-16 ${i % 2 ? "e-page--r lg:order-1" : ""}`}>
                <div className="flex items-baseline justify-between">
                  <p className={kicker}>Reportaje · {s.name}</p>
                  <p className="font-display text-[18px] italic text-ink-soft">p. {String(4 + i * 2).padStart(2, "0")}</p>
                </div>
                <div>
                  <h3 id={`sp-${s.id}`} className="font-display text-[clamp(56px,6.6vw,110px)] leading-[0.9] tracking-[-0.02em]">{i % 2 ? <em>{s.name}</em> : s.name}</h3>
                  <blockquote className="mt-8 border-l-2 border-oxblood pl-6 font-display text-[clamp(24px,2.4vw,34px)] italic leading-[1.2] text-oxblood">“{lead.hook}”</blockquote>
                  <p className="mt-6 max-w-[28rem] text-[16px] leading-relaxed text-ink-soft">{s.desc}. Tres piezas grabadas en casa, con luz natural y el tono de una amiga que te lo recomienda.</p>
                </div>
                <ul className="grid grid-cols-3 gap-3">
                  {items.map((it) => (
                    <li key={it.brand}>
                      <div className="relative aspect-[9/16] overflow-hidden rounded-[14px]">
                        <Shot img={portrait} item={it} sizes="160px" className="absolute inset-0 transition-transform duration-700 hover:scale-105" />
                      </div>
                      <p className="mt-2 font-display text-[16px] leading-tight">{it.brand}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">{it.format} · {it.duration}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ MÉTODO: magazine columns */
function Method() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-rule]"), { scaleY: 0, transformOrigin: "top", duration: 1.4, ease: "expo.inOut", stagger: 0.1, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    gsap.from(root.querySelectorAll("[data-col]"), { opacity: 0, y: -20, duration: 1.2, ease: "expo.out", stagger: 0.12, delay: 0.3, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="m-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <p className={kicker}>Método · p. 12</p>
      <h2 id="m-title" className="mt-5 max-w-[14ch] font-display text-[clamp(52px,7vw,116px)] leading-[0.92] tracking-[-0.02em]">Del brief <em className="text-oxblood">a tu feed</em></h2>
      <ol className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.n} className="relative py-6 sm:px-6 lg:first:pl-0">
            {i > 0 && <span data-rule aria-hidden className="absolute bottom-0 left-0 top-0 hidden w-px bg-ink/20 sm:block" />}
            <div data-col>
              <p className="font-display text-[88px] italic leading-[0.8] text-oxblood">{s.n}</p>
              <h3 className="mt-6 font-display text-[34px] leading-none">{s.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-20 rounded-[28px] bg-[#f8f3ea] p-7 sm:p-10">
        <p className={kicker}>Formatos</p>
        <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
          {formats.map((f) => (
            <li key={f.name} className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-3.5">
              <span className="font-display text-[22px]">{f.name}</span>
              <span className="text-right text-[13px] text-ink-soft">{f.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ AGRADECIMIENTOS */
function Thanks() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-txt]")!, { type: "words" });
    gsap.fromTo(s.words, { opacity: 0.15 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
    return () => s.revert();
  });
  return (
    <section ref={ref} aria-labelledby="t-title" className="bg-ink py-[clamp(110px,14vw,200px)] text-cream">
      <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <h2 id="t-title" className="text-[11px] font-medium uppercase tracking-[0.28em] text-cream/55">Agradecimientos</h2>
        <p data-txt className="mt-10 font-display text-[clamp(32px,4.6vw,68px)] leading-[1.2]">
          Este número no existiría sin {brands.slice(0, -1).join(", ")} y {brands[brands.length - 1]}.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ ENTREVISTA */
function Interview({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-ph]"), { clipPath: "inset(10% 10% 10% 10% round 999px 999px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)", ease: "none", scrollTrigger: { trigger: root.querySelector("[data-ph]"), start: "top 90%", end: "center 55%", scrub: 0.6 } });
    gsap.from(root.querySelectorAll("[data-qa]"), { opacity: 0, y: -16, duration: 1.1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: root, start: "top 65%", once: true } });
  });
  const qa = [
    ["¿Quién eres?", "Soy Steff, creadora de contenido UGC. Grabo moda, belleza, lifestyle y el día a día de una mamá real."],
    ["¿Qué hace diferente tu contenido?", "Que se siente como la recomendación de una amiga, no como un anuncio. Esa confianza es lo que hace que la gente pare el scroll."],
    ["¿Cómo grabas?", "En casa, con luz natural, con cuidado y mucha cercanía. Formato vertical 9:16 y subtítulos incluidos."],
  ];
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="i-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-start gap-14 lg:grid-cols-12">
        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <div data-ph className="relative mx-auto aspect-[3/4] max-w-[440px] overflow-hidden rounded-t-full" style={{ background: "#d6c3a9" }}>
            <img src={portrait.src} srcSet={portrait.srcSet} sizes="460px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className={kicker}>Entrevista · p. 18</p>
          <h2 id="i-title" className="mt-5 font-display text-[clamp(48px,6vw,96px)] leading-[0.95] tracking-[-0.02em]">“Grabo como <em className="text-oxblood">le hablo a una amiga.</em>”</h2>
          <dl className="mt-12 space-y-10">
            {qa.map(([q, a]) => (
              <div key={q} data-qa>
                <dt className="font-display text-[24px] italic text-oxblood">{q}</dt>
                <dd className="mt-3 text-[18px] leading-relaxed text-ink">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CONSULTORIO */
function Advice() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <p className={kicker}>Consultorio · p. 22</p>
        <h2 id="f-title" className="mt-5 font-display text-[clamp(52px,6.4vw,104px)] leading-[0.92] tracking-[-0.02em]">Lo que <em className="text-oxblood">me preguntan</em></h2>
        <ul className="mt-14 grid gap-x-12 lg:grid-cols-2">
          {faqs.map((f, i) => (
            <li key={f.q} className="border-t border-ink/20">
              <h3>
                <button type="button" aria-expanded={open === i} aria-controls={`eq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group flex w-full cursor-pointer items-start gap-4 py-6 text-left">
                  <span className="pt-1 font-display text-[15px] italic text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`flex-1 font-display text-[clamp(22px,2vw,28px)] leading-tight transition-colors ${open === i ? "italic text-oxblood" : "group-hover:text-oxblood"}`}>{f.q}</span>
                  <span aria-hidden className={`mt-1 text-[22px] transition-transform duration-500 ${open === i ? "rotate-45 text-oxblood" : ""}`}>+</span>
                </button>
              </h3>
              <div id={`eq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
                <div><p className="pb-7 pl-9 text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CONTRAPORTADA */
function Back({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-big]")!, { type: "words,chars" });
    gsap.from(s.chars, { yPercent: -60, opacity: 0, filter: "blur(8px)", duration: 1.2, ease: "expo.out", stagger: 0.04, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="b-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[88svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contraportada · p. 24</p>
        <h2 id="b-title" className="mt-6"><span data-big className="block font-display text-[clamp(64px,12vw,200px)] leading-[0.9] tracking-[-0.02em]">Tu marca, <em className="text-oxblood">aquí.</em></span></h2>
        <p className="mt-8 max-w-[28rem] text-[17px] leading-relaxed text-ink-soft">Cuéntame qué quieres contar y te respondo con ideas, no con plantillas.</p>
        <button type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
          Escríbeme<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
        </button>
        <p className="mt-6 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{done ? "copiado" : "copiar"}</button></p>
        <ul className="mt-10 flex gap-6 text-[11px] font-medium uppercase tracking-[0.24em]">
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
          <Cover hero={hero} onMenu={openMenu} onContact={openContact} />
          <Contents />
          <Spreads portrait={portrait} />
          <Method />
          <Thanks />
          <Interview portrait={portrait} />
          <Advice />
          <Back onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
