import { useEffect, useRef, useState, type ReactNode } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useCopy, useReduced } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft";
const total = services.reduce((n, s) => n + portfolio[s.id].length, 0);

function Tile({ children, className = "", tone = "bg-[#f8f3ea]" }: { children: ReactNode; className?: string; tone?: string }) {
  return <div data-tile className={`relative overflow-hidden rounded-[28px] p-6 sm:p-8 lg:rounded-[36px] ${tone} ${className}`}>{children}</div>;
}

function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      flanks={false}
      back={
        <>
          <div aria-hidden className="v2-glow" />
          <div aria-hidden className="v2-arch" />
        </>
      }
      front={
        <div className="pointer-events-none absolute inset-x-12 bottom-20 z-30 hidden justify-between lg:flex">
          <p data-in className="b-chip"><span className="font-display text-[26px] leading-none">{total}</span><span>piezas · 4 mundos</span></p>
          <p data-in className="b-chip"><span className="b-dot" />Disponible para colaboraciones</p>
        </div>
      }
    />
  );
}

function Grid({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-tile]"), { opacity: 0, y: 50, scale: 0.94, duration: 1.1, ease: "back.out(1.4)", stagger: { each: 0.07, from: "start" }, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
    const c = count.current;
    if (c) gsap.from(c, { textContent: 0, duration: 1.6, ease: "power2.out", snap: { textContent: 1 }, scrollTrigger: { trigger: c, start: "top 90%", once: true } });
  });
  return (
    <section ref={ref} id="portafolio" aria-labelledby="g-title" className="mx-auto max-w-[1320px] px-3 py-[clamp(90px,11vw,160px)] sm:px-4 lg:px-5">
      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile className="flex flex-col justify-between sm:col-span-2" tone="bg-transparent !p-2 sm:!p-4">
          <p className={kicker}>Portafolio</p>
          <h2 id="g-title" className="mt-6 font-display text-[clamp(48px,6.4vw,104px)] leading-[0.92] tracking-[-0.02em]">Todo, <em className="text-oxblood">en un vistazo.</em></h2>
        </Tile>
        <Tile className="flex flex-col justify-between" tone="bg-oxblood text-cream">
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-cream/60">Piezas</p>
          <p className="font-display text-[clamp(84px,9vw,140px)] leading-[0.8]"><span ref={count}>{total}</span></p>
          <p className="text-[14px] text-cream/75">Verticales 9:16, con subtítulos</p>
        </Tile>
        <Tile className="flex flex-col justify-between">
          <p className={kicker}>Estado</p>
          <p className="flex items-center gap-3 font-display text-[30px] leading-none"><span className="b-dot" />Disponible</p>
          <p className="text-[14px] text-ink-soft">Contenido en español · luz natural</p>
        </Tile>

        {services.map((s, i) => {
          const [lead, ...rest] = portfolio[s.id];
          return (
            <div key={s.id} id={s.id} data-tile className={`group relative min-h-[460px] scroll-mt-24 overflow-hidden rounded-[28px] lg:rounded-[36px] ${i === 0 || i === 3 ? "lg:col-span-2 lg:row-span-2" : "lg:row-span-2"}`}>
              <Shot img={portrait} item={lead} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,14,12,0.65)] via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-cream/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] backdrop-blur">{s.n} · {s.name}</div>
              <div className="absolute inset-x-5 bottom-5 text-cream">
                <p className="font-display text-[clamp(40px,4.4vw,72px)] leading-[0.9]">{i % 2 ? <em>{s.name}</em> : s.name}</p>
                <p className="mt-2 text-[14px] opacity-80">“{lead.hook}” · para {lead.brand}</p>
                <ul className="mt-4 flex gap-2 transition-all duration-500 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                  {rest.map((it) => (
                    <li key={it.brand} className="relative h-[110px] w-[62px] overflow-hidden rounded-xl ring-2 ring-cream/60">
                      <Shot img={portrait} item={it} sizes="70px" className="absolute inset-0" />
                    </li>
                  ))}
                  <li className="self-end text-[11px] uppercase tracking-[0.2em] opacity-80">+{rest.length} piezas</li>
                </ul>
              </div>
            </div>
          );
        })}

        <Tile className="sm:col-span-2">
          <p className={kicker}>Formatos</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {formats.map((f) => <li key={f.name} title={f.note} className="rounded-full border border-ink/15 px-4 py-2.5 font-display text-[18px] transition-colors hover:bg-ink hover:text-cream">{f.name}</li>)}
          </ul>
        </Tile>
        <Tile className="flex flex-col justify-between sm:col-span-2" tone="bg-ink text-cream">
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-cream/60">Han confiado en mí</p>
          <div className="b-fade mt-6 overflow-hidden">
            <div className="b-marquee flex w-max gap-10">
              {[...brands, ...brands].map((b, i) => <span key={i} aria-hidden={i >= brands.length || undefined} className="font-display text-[clamp(28px,3vw,44px)] italic">{b}</span>)}
            </div>
          </div>
          <p className="sr-only">{brands.join(", ")}</p>
        </Tile>
      </div>
    </section>
  );
}

function Steps() {
  const [i, setI] = useState(0);
  const reduced = useReduced();
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reduced) return;
    const el = bar.current;
    if (!el) return;
    const tw = gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: "none", onComplete: () => setI((n) => (n + 1) % steps.length) });
    return () => {
      tw.kill();
    };
  }, [i, reduced]);
  const s = steps[i];
  return (
    <section id="proceso" aria-labelledby="s-title" className="mx-auto max-w-[1320px] px-3 sm:px-4 lg:px-5">
      <div className="grid gap-3 lg:grid-cols-4">
        <Tile className="lg:col-span-1">
          <p className={kicker}>Cómo trabajo</p>
          <h2 id="s-title" className="mt-5 font-display text-[clamp(40px,4vw,64px)] leading-[0.95]">Cuatro <em className="text-oxblood">pasos</em></h2>
          <div role="tablist" aria-label="Pasos" className="mt-8 flex flex-col gap-1.5">
            {steps.map((st, k) => (
              <button key={st.n} role="tab" type="button" aria-selected={k === i} aria-controls="b-step" onClick={() => setI(k)} className={`flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-left transition-colors ${k === i ? "bg-ink text-cream" : "hover:bg-ink/5"}`}>
                <span className="font-display text-[14px] italic opacity-70">{st.n}</span>
                <span className="text-[14px] font-medium">{st.title}</span>
              </button>
            ))}
          </div>
        </Tile>
        <Tile className="flex min-h-[340px] flex-col justify-between lg:col-span-3" tone="bg-[#e9d8c4]">
          <div id="b-step" role="tabpanel" key={i} className="b-swap">
            <p className="font-display text-[clamp(100px,14vw,220px)] italic leading-[0.75] text-oxblood/90">{s.n}</p>
            <h3 className="mt-6 font-display text-[clamp(40px,4.4vw,72px)] leading-none">{s.title}</h3>
            <p className="mt-4 max-w-[34rem] text-[18px] leading-relaxed text-ink-soft">{s.text}</p>
          </div>
          <span className="mt-8 block h-px w-full bg-ink/15"><span ref={bar} className="block h-px origin-left bg-ink" style={{ transform: "scaleX(0)" }} /></span>
        </Tile>
      </div>
    </section>
  );
}

function Brief({ portrait, onContact }: { portrait: Img; onContact: () => void }) {
  const [cat, setCat] = useState<string>(services[0].name);
  const [fmts, setFmts] = useState<string[]>(["Reseña"]);
  const [qty, setQty] = useState(3);
  const [when, setWhen] = useState("En 2 semanas");
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-tile]"), { opacity: 0, y: 50, scale: 0.95, duration: 1.1, ease: "back.out(1.4)", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });
  const toggle = (f: string) => setFmts((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
  const summary = `Hola Steff, me gustaría ${qty} ${qty === 1 ? "video" : "videos"} de ${cat.toLowerCase()} (${fmts.length ? fmts.join(", ").toLowerCase() : "formato a definir"}), ${when.toLowerCase()}.`;
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(`Brief: ${qty} videos de ${cat}`)}&body=${encodeURIComponent(`${summary}\n\nMarca:\nProducto:\nObjetivo:\n`)}`;
  const chip = (on: boolean) => `cursor-pointer rounded-full px-4 py-2.5 text-[14px] transition-colors ${on ? "bg-cream text-ink" : "border border-cream/30 text-cream hover:border-cream"}`;
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="br-title" className="mx-auto max-w-[1320px] px-3 py-3 sm:px-4 lg:px-5">
      <div className="grid gap-3 lg:grid-cols-4">
        <div data-tile className="relative min-h-[420px] overflow-hidden rounded-[28px] lg:row-span-2 lg:rounded-[36px]" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 25vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
        </div>
        <Tile className="lg:col-span-1 lg:row-span-2">
          <p className={kicker}>Sobre mí</p>
          <h2 className="mt-5 font-display text-[clamp(40px,4vw,60px)] leading-[0.95]">Hola, soy <em className="text-oxblood">Steff</em></h2>
          <p className="mt-6 text-[17px] leading-relaxed">Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado con cuidado y mucha cercanía.</p>
        </Tile>
        <div data-tile className="rounded-[28px] bg-oxblood p-6 text-cream sm:p-8 lg:col-span-2 lg:row-span-2 lg:rounded-[36px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-cream/60">Arma tu brief</p>
          <h2 id="br-title" className="mt-4 font-display text-[clamp(36px,3.6vw,56px)] leading-[0.95]">¿Qué <em>necesitas?</em></h2>
          <fieldset className="mt-6">
            <legend className="text-[12px] uppercase tracking-[0.2em] text-cream/60">Mundo</legend>
            <div className="mt-2 flex flex-wrap gap-2">{services.map((s) => <button key={s.id} type="button" aria-pressed={cat === s.name} onClick={() => setCat(s.name)} className={chip(cat === s.name)}>{s.name}</button>)}</div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="text-[12px] uppercase tracking-[0.2em] text-cream/60">Formatos</legend>
            <div className="mt-2 flex flex-wrap gap-2">{formats.slice(0, 6).map((f) => <button key={f.name} type="button" aria-pressed={fmts.includes(f.name)} onClick={() => toggle(f.name)} className={chip(fmts.includes(f.name))}>{f.name}</button>)}</div>
          </fieldset>
          <div className="mt-5 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-cream/60" id="qty-l">Videos</p>
              <div className="mt-2 flex items-center gap-3" role="group" aria-labelledby="qty-l">
                <button type="button" aria-label="Menos videos" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-cream/30 hover:border-cream">−</button>
                <span aria-live="polite" className="w-8 text-center font-display text-[30px]">{qty}</span>
                <button type="button" aria-label="Más videos" onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-cream/30 hover:border-cream">+</button>
              </div>
            </div>
            <fieldset>
              <legend className="text-[12px] uppercase tracking-[0.2em] text-cream/60">Plazo</legend>
              <div className="mt-2 flex flex-wrap gap-2">{["Sin prisa", "En 2 semanas", "Urgente"].map((w) => <button key={w} type="button" aria-pressed={when === w} onClick={() => setWhen(w)} className={chip(when === w)}>{w}</button>)}</div>
            </fieldset>
          </div>
          <p aria-live="polite" className="mt-6 rounded-2xl bg-cream/10 p-4 font-display text-[19px] italic leading-snug">{summary}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={mail} className="inline-flex h-12 items-center gap-3 rounded-full bg-cream px-6 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-sand">Enviar brief ↗</a>
            <button type="button" onClick={onContact} className="h-12 cursor-pointer rounded-full border border-cream/40 px-6 text-[12px] font-medium uppercase tracking-[0.2em] hover:border-cream">Abrir formulario</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[1320px] px-3 pb-3 sm:px-4 lg:px-5">
      <div className="grid gap-3 lg:grid-cols-4">
        <Tile className="flex flex-col justify-between" tone="bg-[#e9d8c4]">
          <p className={kicker}>Preguntas</p>
          <h2 id="f-title" className="font-display text-[clamp(40px,4vw,64px)] leading-[0.95]">Lo que <em className="text-oxblood">quizá</em> te preguntas</h2>
        </Tile>
        <Tile className="lg:col-span-3">
          <ul>
            {faqs.map((f, i) => (
              <li key={f.q} className="border-b border-ink/10 last:border-0">
                <h3>
                  <button type="button" aria-expanded={open === i} aria-controls={`bq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group flex w-full cursor-pointer items-center gap-4 py-5 text-left">
                    <span className={`flex-1 font-display text-[clamp(21px,2vw,28px)] leading-tight ${open === i ? "italic text-oxblood" : "group-hover:text-oxblood"}`}>{f.q}</span>
                    <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 ${open === i ? "rotate-45 bg-oxblood text-cream" : "bg-ink/5"}`}>+</span>
                  </button>
                </h3>
                <div id={`bq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
                  <div><p className="pb-6 pr-12 text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
                </div>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const { copy, done } = useCopy(EMAIL);
  return (
    <section id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <p className={kicker}>Contacto</p>
        <h2 id="c-title" className="mt-6 font-display text-[clamp(60px,11vw,190px)] leading-[0.88] tracking-[-0.02em]">¿Empezamos?</h2>
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
          <Grid portrait={portrait} />
          <Steps />
          <Brief portrait={portrait} onContact={openContact} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
