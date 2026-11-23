import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useCopy, useReduced } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft";

/* ------------------------------------------------------------------ HERO: messages arrive around the figure */
const heroMsgs = [
  { t: "¿Hacemos un video?", cls: "left-[5%] top-[38%] lg:left-[16%] lg:top-[30%]", me: false },
  { t: "¡Claro! Cuéntame tu producto ✨", cls: "right-[4%] top-[48%] lg:right-[15%] lg:top-[38%]", me: true },
  { t: "Moda · Belleza · Lifestyle · Momlife", cls: "left-[6%] bottom-[18%] lg:left-[19%] lg:bottom-[24%]", me: true },
];
function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      flanks={false}
      title={<Letters />}
      back={<><div aria-hidden className="v2-glow" /><div aria-hidden data-arch className="v2-arch" /></>}
      front={
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
          {heroMsgs.map((m, i) => (
            <div key={i} data-msg className={`absolute max-w-[60%] ${m.cls}`}>
              <div data-float className={`cv-bubble rounded-[20px] px-4 py-3 text-[14px] font-medium shadow-[0_18px_40px_-22px_rgba(42,27,22,0.6)] sm:text-[15px] ${m.me ? "rounded-br-md bg-oxblood text-cream" : "rounded-bl-md bg-cream text-ink"}`}>
                <span data-dots className="cv-dots"><i /><i /><i /></span>
                <span data-text className="block">{m.t}</span>
              </div>
            </div>
          ))}
        </div>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(root, { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)" }, { clipPath: "polygon(0% 0%, 200% 0%, 0% 200%, 0% 100%)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" }, 0)
          .from(root.querySelectorAll("[data-l]"), { yPercent: 110, opacity: 0, rotate: 6, duration: 1.2, stagger: 0.06 }, 0.6)
          .from(root.querySelector("[data-arch]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.4 }, 0.7)
          .from(root.querySelector("[data-fig]"), { yPercent: 20, opacity: 0, duration: 1.5 }, 0.8)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 0.9, stagger: 0.05 }, 1.3);
        root.querySelectorAll<HTMLElement>("[data-msg]").forEach((m, i) => {
          const at = 1.6 + i * 0.9;
          tl.from(m, { scale: 0.5, opacity: 0, y: 20, duration: 0.6, ease: "back.out(2)" }, at)
            .from(m.querySelector("[data-text]"), { display: "none", duration: 0.01 }, at)
            .to(m.querySelector("[data-dots]"), { display: "none", duration: 0.01 }, at + 0.7);
        });
        root.querySelectorAll("[data-float]").forEach((f, i) => gsap.to(f, { y: i % 2 ? -8 : 8, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 }));
        root.querySelectorAll("[data-msg]").forEach((m, i) => gsap.to(m, { yPercent: -120 - i * 60, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.5 } }));
      }}
    />
  );
}

/* ------------------------------------------------------------------ STACKS that fan out */
function Stacks({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-stack]").forEach((st) => {
      const cards = st.querySelectorAll<HTMLElement>("[data-card]");
      gsap.fromTo(cards, { xPercent: 0, rotate: (i) => [-2, 2, 0][i], yPercent: (i) => i * -3 }, { xPercent: (i) => [-1, 1, 0][i] * (window.innerWidth < 640 ? 38 : 58), rotate: (i) => [-9, 9, 0][i], yPercent: (i) => [8, 8, 0][i], ease: "none", scrollTrigger: { trigger: st, start: "top 90%", end: "center 55%", scrub: 0.6 } });
    });
  });
  return (
    <section ref={ref} id="portafolio" aria-labelledby="s-title" className="overflow-hidden py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1200px] px-5 text-center sm:px-8">
        <p className={kicker}>Portafolio</p>
        <h2 id="s-title" className="mx-auto mt-5 max-w-[16ch] font-display text-[clamp(44px,7vw,108px)] leading-[0.95] tracking-[-0.01em]">Cuatro mundos, <span className="text-oxblood">doce historias</span></h2>
      </div>
      <div className="mx-auto mt-[clamp(56px,8vw,110px)] grid max-w-[1200px] gap-y-28 px-5 sm:px-8 md:grid-cols-2 md:gap-x-8 lg:px-12">
        {services.map((s) => {
          const items = portfolio[s.id];
          return (
            <div key={s.id} id={s.id} data-stack className="scroll-mt-24">
              <div className="relative mx-auto h-[min(110vw,460px)] w-[min(52vw,240px)]">
                {[0, 1, 2].map((k) => {
                  const it = items[k];
                  return (
                    <figure key={it.brand} data-card className="absolute inset-0" style={{ zIndex: k === 2 ? 3 : k + 1 }}>
                      <div className="relative h-full w-full overflow-hidden rounded-[22px] shadow-[0_30px_50px_-28px_rgba(42,27,22,0.6)] ring-4 ring-[#f8f3ea]">
                        <Shot img={portrait} item={it} sizes="240px" className="absolute inset-0" />
                        <p className="absolute inset-x-3 top-[20%] text-center"><span className="box-decoration-clone rounded bg-cream px-1.5 py-0.5 text-[12px] font-semibold leading-[1.75] text-ink">{it.hook}</span></p>
                        <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(30,14,12,0.7)] to-transparent p-3 pt-10 text-[11px] text-cream"><span className="font-display text-[17px]">{it.brand}</span><br /><span className="uppercase tracking-[0.18em] opacity-80">{it.format} · {it.duration}</span></p>
                      </div>
                    </figure>
                  );
                })}
              </div>
              <div className="mt-10 text-center">
                <p className="font-display text-[15px] text-oxblood">{s.n}</p>
                <h3 className="mt-1 font-display text-[clamp(34px,4vw,56px)] leading-none">{s.name}</h3>
                <p className="mt-2 text-[15px] text-ink-soft">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ steps slide in */
function Steps() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-step]").forEach((c, i) => {
      gsap.fromTo(c, { xPercent: i % 2 ? 40 : -40, opacity: 0, rotate: i % 2 ? 3 : -3 }, { xPercent: 0, opacity: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: c, start: "top 95%", end: "top 60%", scrub: 0.6 } });
    });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="p-title" className="overflow-hidden bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
        <p className={kicker}>Cómo trabajo</p>
        <h2 id="p-title" className="mt-5 font-display text-[clamp(44px,6.4vw,96px)] leading-[0.95]">Así de <span className="text-oxblood">fácil</span></h2>
        <ol className="mt-14 space-y-4">
          {steps.map((s, i) => (
            <li key={s.n} data-step className={`flex max-w-[640px] gap-5 rounded-[28px] p-6 sm:p-8 ${i % 2 ? "ml-auto bg-oxblood text-cream" : "bg-[#fbf8f2]"}`}>
              <span className="font-display text-[48px] leading-none opacity-80">{s.n}</span>
              <div>
                <h3 className="font-display text-[30px] leading-none">{s.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed opacity-85">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ interactive brief chat */
type Msg = { me: boolean; t: string };
const flow = [
  { q: "¡Hola! Soy Steff 👋 ¿Qué tipo de contenido necesitas?", opts: services.map((s) => s.name) },
  { q: "¡Me encanta! ¿Qué formato tienes en mente?", opts: formats.slice(0, 6).map((f) => f.name) },
  { q: "¿Cuántos videos te gustaría?", opts: ["1 video", "3 videos", "5 videos", "Un pack mensual"] },
  { q: "¿Y para cuándo lo necesitas?", opts: ["Sin prisa", "En 2 semanas", "Es urgente"] },
];
function BriefChat({ onContact }: { onContact: () => void }) {
  const reduced = useReduced();
  const [msgs, setMsgs] = useState<Msg[]>([{ me: false, t: flow[0].q }]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [msgs, typing, reduced]);
  const pick = (o: string) => {
    const next = [...answers, o];
    setAnswers(next);
    setMsgs((m) => [...m, { me: true, t: o }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      if (step + 1 < flow.length) setMsgs((m) => [...m, { me: false, t: flow[step + 1].q }]);
      else setMsgs((m) => [...m, { me: false, t: `¡Perfecto! Te propongo ${next[2].toLowerCase()} de ${next[0].toLowerCase()} en formato ${next[1].toLowerCase()}, ${next[3].toLowerCase()}. Te dejo el brief listo para enviar 👇` }]);
      setStep(step + 1);
    }, reduced ? 0 : 900);
  };
  const reset = () => {
    setMsgs([{ me: false, t: flow[0].q }]);
    setStep(0);
    setAnswers([]);
  };
  const done = step >= flow.length;
  const body = done ? `Hola Steff:\n\nMe gustaría ${answers[2]?.toLowerCase()} de ${answers[0]?.toLowerCase()} (${answers[1]?.toLowerCase()}), ${answers[3]?.toLowerCase()}.\n\nMarca:\nProducto:\nObjetivo:\n` : "";
  return (
    <section id="brief" aria-labelledby="b-title" className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:grid-cols-2 lg:px-12">
      <div>
        <p className={kicker}>Arma tu brief</p>
        <h2 id="b-title" className="mt-5 font-display text-[clamp(44px,6.4vw,96px)] leading-[0.95]">Hablemos <span className="text-oxblood">ahora mismo</span></h2>
        <p className="mt-5 max-w-[26rem] text-[17px] leading-relaxed text-ink-soft">Responde cuatro preguntas tocando las opciones y te preparo el brief para que me lo envíes en un clic.</p>
      </div>
      <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[32px] bg-[#fbf8f2] shadow-[0_50px_80px_-50px_rgba(42,27,22,0.6)]">
        <header className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-[18px] text-cream">S</span>
          <div><p className="text-[15px] font-semibold leading-none">Steff Ramírez</p><p className="mt-1 text-[12px] text-[#3f7d4a]">● en línea</p></div>
        </header>
        <div ref={log} role="log" aria-live="polite" className="h-[360px] space-y-3 overflow-y-auto px-4 py-5">
          {msgs.map((m, i) => (
            <p key={i} className={`cv-in w-fit max-w-[82%] rounded-[20px] px-4 py-3 text-[15px] leading-relaxed ${m.me ? "ml-auto rounded-br-md bg-oxblood text-cream" : "rounded-bl-md bg-cream"}`}>{m.t}</p>
          ))}
          {typing && <p aria-label="Steff está escribiendo" className="w-fit rounded-[20px] rounded-bl-md bg-cream px-4 py-3"><span className="cv-dots"><i /><i /><i /></span></p>}
        </div>
        <div className="border-t border-ink/10 p-4">
          {!done ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Respuestas">
              {flow[step].opts.map((o) => (
                <button key={o} type="button" disabled={typing} onClick={() => pick(o)} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2.5 text-[14px] transition-colors hover:border-oxblood hover:bg-oxblood hover:text-cream disabled:opacity-40">{o}</button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Brief: ${answers[2]} de ${answers[0]}`)}&body=${encodeURIComponent(body)}`} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-cream hover:bg-oxblood">Enviar brief ↗</a>
              <button type="button" onClick={onContact} className="h-11 cursor-pointer rounded-full border border-ink/15 px-5 text-[13px] font-medium hover:border-ink">Abrir formulario</button>
              <button type="button" onClick={reset} className="h-11 cursor-pointer rounded-full px-4 text-[13px] text-ink-soft hover:text-ink">Empezar de nuevo</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-ph]"), { scale: 0.6, rotate: -6, borderRadius: 200 }, { scale: 1, rotate: 0, borderRadius: 36, ease: "none", scrollTrigger: { trigger: root, start: "top 85%", end: "center 55%", scrub: 0.6 } });
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="bg-ink py-[clamp(110px,14vw,200px)] text-cream">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div data-ph className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="460px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-cream/55">Sobre mí</p>
          <h2 id="a-title" className="mt-5 font-display text-[clamp(44px,6vw,92px)] leading-[0.95]">La amiga que <span className="text-[#e6b3a6]">te lo recomienda</span></h2>
          <p className="mt-6 text-[18px] leading-[1.7] text-cream/85">Soy Steff. Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural.</p>
          <p className="mt-8 text-[13px] uppercase tracking-[0.2em] text-cream/55">Han confiado en mí</p>
          <p className="mt-3 font-display text-[20px] leading-relaxed text-cream/90">{brands.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ inside a chat */
function AskMe() {
  const reduced = useReduced();
  const [thread, setThread] = useState<{ q: string; a: string; shown: boolean }[]>([]);
  const ask = (i: number) => {
    const { q, a } = faqs[i];
    setThread((t) => [...t, { q, a, shown: reduced }]);
    if (!reduced) window.setTimeout(() => setThread((t) => t.map((x, k) => (k === t.length - 1 ? { ...x, shown: true } : x))), 800);
  };
  const asked = new Set(thread.map((t) => t.q));
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[820px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Pregúntame</p>
      <h2 id="f-title" className="mt-5 text-center font-display text-[clamp(44px,6vw,88px)] leading-[0.95]">Dudas <span className="text-oxblood">frecuentes</span></h2>
      <div role="log" aria-live="polite" className="mt-12 space-y-3">
        {thread.length === 0 && <p className="text-center text-[15px] text-ink-soft">Toca una pregunta y te respondo aquí.</p>}
        {thread.map((t, i) => (
          <div key={i} className="space-y-3">
            <p className="cv-in ml-auto w-fit max-w-[82%] rounded-[20px] rounded-br-md bg-ink px-4 py-3 text-[15px] text-cream">{t.q}</p>
            {t.shown ? <p className="cv-in w-fit max-w-[82%] rounded-[20px] rounded-bl-md bg-oxblood px-4 py-3 text-[15px] leading-relaxed text-cream">{t.a}</p> : <p className="w-fit rounded-[20px] rounded-bl-md bg-oxblood px-4 py-3 text-cream"><span className="cv-dots"><i /><i /><i /></span></p>}
          </div>
        ))}
      </div>
      <div role="group" aria-label="Preguntas" className="mt-8 flex flex-wrap justify-center gap-2">
        {faqs.map((f, i) => (
          <button key={f.q} type="button" disabled={asked.has(f.q)} onClick={() => ask(i)} className="cursor-pointer rounded-full bg-[#f8f3ea] px-4 py-2.5 text-[14px] transition-colors hover:bg-sand disabled:cursor-default disabled:opacity-35">{f.q}</button>
        ))}
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
        <h2 id="c-title" className="mt-6 font-display text-[clamp(56px,9.6vw,160px)] leading-[0.9]">Te leo <span className="text-oxblood">pronto</span></h2>
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
          <Stacks portrait={portrait} />
          <Steps />
          <BriefChat onContact={openContact} />
          <About portrait={portrait} />
          <AskMe />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
