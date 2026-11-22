import { useEffect, useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats } from "../../v2/data";
import type { Img } from "../images";
import { gsap, SplitText, useMotion, useCopy, useFinePointer } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";

/** Slow-drifting light behind the whole page; one halo follows the pointer. */
function Ambient() {
  const halo = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  useEffect(() => {
    if (!fine || !halo.current) return;
    const x = gsap.quickTo(halo.current, "x", { duration: 1.6, ease: "power3.out" });
    const y = gsap.quickTo(halo.current, "y", { duration: 1.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [fine]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span className="l-blob l-blob--a" />
      <span className="l-blob l-blob--b" />
      <span className="l-blob l-blob--c" />
      {fine && <div ref={halo} className="l-halo" />}
    </div>
  );
}

/** Blur-to-sharp for anything marked [data-soft] inside root. */
function soften(root: Element) {
  root.querySelectorAll<HTMLElement>("[data-soft]").forEach((el) => {
    gsap.fromTo(el, { filter: "blur(18px)", opacity: 0, y: 30 }, { filter: "blur(0px)", opacity: 1, y: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
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
          <div aria-hidden className="l-sun" />
          <div aria-hidden className="v2-arch" data-arch />
        </>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { opacity: 0, scale: 0.97, filter: "blur(20px)", duration: 1.6 })
          .from(root.querySelector(".l-sun"), { scale: 0.3, opacity: 0, duration: 2.4 }, 0.3)
          .from(root.querySelectorAll("[data-l]"), { opacity: 0, filter: "blur(24px)", scale: 1.15, duration: 1.8, stagger: 0.1 }, 0.5)
          .from(root.querySelector("[data-arch]"), { opacity: 0, scaleY: 0.6, transformOrigin: "bottom", duration: 2 }, 0.7)
          .from(root.querySelector("[data-fig]"), { opacity: 0, filter: "blur(20px)", y: 30, duration: 2 }, 0.9)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, filter: "blur(8px)", duration: 1.2, stagger: 0.06 }, 1.5);
        gsap.to(root.querySelector(".l-sun"), { scale: 1.12, opacity: 0.85, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(root.querySelector(".v2-title"), { filter: "blur(10px)", opacity: 0.3, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } });
      }}
    />
  );
}

function Portfolio({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  useMotion(ref, (root) => {
    soften(root);
    root.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
      gsap.fromTo(c, { y: 60 + (i % 3) * 30, filter: "blur(14px)", opacity: 0 }, { y: 0, filter: "blur(0px)", opacity: 1, ease: "none", scrollTrigger: { trigger: c, start: "top 98%", end: "top 65%", scrub: 0.6 } });
    });
  });
  // soft 3D tilt on fine pointers
  useEffect(() => {
    const root = ref.current;
    if (!root || !fine) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]"));
    const offs = cards.map((c) => {
      const rx = gsap.quickTo(c, "rotateX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(c, "rotateY", { duration: 0.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
      };
      const leave = () => {
        rx(0);
        ry(0);
      };
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", leave);
      return () => {
        c.removeEventListener("pointermove", move);
        c.removeEventListener("pointerleave", leave);
      };
    });
    return () => offs.forEach((f) => f());
  }, [fine]);

  return (
    <section ref={ref} id="portafolio" aria-labelledby="p-title" className="mx-auto max-w-[1280px] px-5 py-[clamp(120px,15vw,220px)] sm:px-8 lg:px-12">
      <div data-soft className="text-center">
        <p className={kicker}>Portafolio</p>
        <h2 id="p-title" className="mx-auto mt-6 max-w-[14ch] font-display text-[clamp(52px,8.4vw,136px)] leading-[0.92] tracking-[-0.02em]">Contenido con <em className="text-oxblood">luz propia</em></h2>
        <p className="mx-auto mt-6 max-w-[30rem] text-[17px] text-ink-soft">Grabado en casa con luz natural. Doce piezas, cuatro mundos.</p>
      </div>
      <div className="mt-24 space-y-28">
        {services.map((s, i) => (
          <div key={s.id} id={s.id} className="scroll-mt-24">
            <div data-soft className={`l-glass mx-auto flex max-w-[560px] items-center justify-between gap-6 rounded-full px-6 py-4 sm:px-8 ${i % 2 ? "lg:ml-auto lg:mr-0" : "lg:ml-0"}`}>
              <span className="font-display text-[15px] italic text-ink-soft">{s.n}</span>
              <h3 className="font-display text-[clamp(30px,3.6vw,48px)] leading-none">{s.name}</h3>
              <span className="text-right text-[13px] text-ink-soft">{s.desc}</span>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-6 [perspective:1200px] sm:grid-cols-3">
              {portfolio[s.id].map((it, k) => (
                <li key={it.brand} data-card className={k === 1 ? "sm:translate-y-12" : ""}>
                  <div data-tilt className="l-glass rounded-[32px] p-2.5 [transform-style:preserve-3d]">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-[24px]">
                      <Shot img={portrait} item={it} sizes="(min-width:640px) 30vw, 90vw" className="absolute inset-0" />
                      <p className="absolute inset-x-4 top-[22%] text-center"><span className="box-decoration-clone rounded-md bg-cream/90 px-2 py-0.5 text-[14px] font-semibold leading-[1.75] text-ink">{it.hook}</span></p>
                      <div className="l-glass absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl px-4 py-3">
                        <span className="font-display text-[19px] leading-none">{it.brand}</span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft">{it.format} · {it.duration}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    soften(root);
    root.querySelectorAll("[data-float]").forEach((el, i) => gsap.to(el, { y: i % 2 ? -10 : 10, duration: 3 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 }));
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="pr-title" className="mx-auto max-w-[1280px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div data-soft className="max-w-[40rem]">
        <p className={kicker}>Cómo trabajo</p>
        <h2 id="pr-title" className="mt-6 font-display text-[clamp(52px,7.4vw,120px)] leading-[0.92] tracking-[-0.02em]">Ligero, <em className="text-oxblood">claro</em> y a tu ritmo</h2>
      </div>
      <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.n} data-soft>
            <div data-float className="l-glass flex h-full min-h-[300px] flex-col justify-between rounded-[32px] p-7" style={{ marginTop: `${[0, 40, 10, 50][i]}px` }}>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-oxblood font-display text-[18px] italic text-cream">{s.n}</span>
              <div>
                <h3 className="font-display text-[36px] leading-none">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <ul data-soft className="mt-20 flex flex-wrap justify-center gap-3">
        {formats.map((f) => (
          <li key={f.name} title={f.note} className="l-glass rounded-full px-5 py-3 font-display text-[19px] transition-colors hover:bg-oxblood hover:text-cream">{f.name}</li>
        ))}
      </ul>
    </section>
  );
}

function Brands() {
  return (
    <section aria-labelledby="b-title" className="py-[clamp(80px,10vw,140px)]">
      <h2 id="b-title" className={`${kicker} text-center`}>Marcas con las que he trabajado</h2>
      <div className="l-fade mt-10 overflow-hidden">
        <div className="l-marquee flex w-max gap-14">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} aria-hidden={i >= brands.length || undefined} className="font-display text-[clamp(34px,4.4vw,64px)] italic text-ink/80">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    soften(root);
    const s = new SplitText(root.querySelector("[data-txt]")!, { type: "words" });
    gsap.fromTo(s.words, { filter: "blur(8px)", opacity: 0.2 }, { filter: "blur(0px)", opacity: 1, ease: "none", stagger: 0.08, scrollTrigger: { trigger: root.querySelector("[data-txt]"), start: "top 85%", end: "bottom 65%", scrub: 0.5 } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="a-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div data-soft className="relative mx-auto w-full max-w-[460px]">
          <div className="l-morph relative aspect-[4/5] overflow-hidden" style={{ background: "#d6c3a9" }}>
            <img src={portrait.src} srcSet={portrait.srcSet} sizes="460px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" />
          </div>
          <div className="l-glass absolute -bottom-6 -right-2 rounded-2xl px-5 py-4 sm:-right-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-ink-soft">Grabado con</p>
            <p className="font-display text-[24px] italic leading-none">luz natural</p>
          </div>
        </div>
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="a-title" className="mt-6 font-display text-[clamp(52px,6.4vw,104px)] leading-[0.92] tracking-[-0.02em]">Hola, soy <em className="text-oxblood">Steff</em></h2>
          <p data-txt className="mt-8 font-display text-[clamp(24px,2.4vw,34px)] leading-[1.3]">
            Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado con cuidado y mucha cercanía.
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="f-title" className="mx-auto max-w-[900px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8">
      <p className={`${kicker} text-center`}>Preguntas frecuentes</p>
      <h2 id="f-title" className="mt-6 text-center font-display text-[clamp(48px,6vw,96px)] leading-[0.95]">Lo que <em className="text-oxblood">quizá</em> te preguntas</h2>
      <ul className="mt-14 space-y-3">
        {faqs.map((f, i) => (
          <li key={f.q} className={`l-glass rounded-[28px] transition-colors ${open === i ? "bg-cream/70" : ""}`}>
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`lq${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center gap-5 px-6 py-5 text-left sm:px-8">
                <span className="flex-1 font-display text-[clamp(21px,2.2vw,28px)] leading-tight">{f.q}</span>
                <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-500 ${open === i ? "rotate-45 border-oxblood bg-oxblood text-cream" : ""}`}>+</span>
              </button>
            </h3>
            <div id={`lq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
              <div><p className="px-6 pb-6 text-[16px] leading-relaxed text-ink-soft sm:px-8">{f.a}</p></div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => soften(root));
  useEffect(() => {
    const c = card.current;
    if (!c || !fine) return;
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
      c.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    c.addEventListener("pointermove", move);
    return () => c.removeEventListener("pointermove", move);
  }, [fine]);
  return (
    <section ref={ref} id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div ref={card} className="l-contact grain v2-radius relative flex min-h-[86svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
        <p data-soft className={kicker}>Contacto</p>
        <h2 id="c-title" data-soft className="mt-6 font-display text-[clamp(64px,12vw,200px)] leading-[0.9] tracking-[-0.02em]">Hablemos <em className="text-oxblood">bonito</em></h2>
        <button data-soft type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
          Escríbeme<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
        </button>
        <p className="mt-6 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4">{done ? "copiado" : "copiar"}</button></p>
        <ul className="mt-8 flex gap-3">
          {socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" className="l-glass inline-flex rounded-full px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em]">{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a></li>)}
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
          <Ambient />
          <Hero hero={hero} onMenu={openMenu} onContact={openContact} />
          <Portfolio portrait={portrait} />
          <Brands />
          <Process />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
