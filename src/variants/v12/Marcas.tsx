import { useRef } from "react";
import { brands } from "../../v2/data";
import { gsap, ScrollTrigger, useMotion } from "../kit";
import { Em, Folio, countUp, h2Mid, headMotion } from "./common";
import { figures } from "./data";

const Slash = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`mx-5 inline-block font-display font-light italic leading-none text-ink/35 sm:mx-9 ${className}`}>
    /
  </span>
);

function Row({ list, alt, hidden }: { list: string[]; alt?: boolean; hidden?: boolean }) {
  const set = (dup: boolean) =>
    list.map((b, i) => (
      <li key={`${dup}${b}`} aria-hidden={dup || undefined} data-dup={dup || undefined} className="flex items-center">
        <span
          className={`font-display leading-[1.08] ${
            alt ? "v12-outline-ink text-[clamp(52px,9vw,104px)]" : `text-[clamp(64px,12vw,168px)] ${i % 2 ? "italic text-oxblood" : "text-ink"}`
          }`}
        >
          {b}
        </span>
        <Slash className={alt ? "text-[40px] sm:text-[60px]" : "text-[64px] sm:text-[100px] lg:text-[140px]"} />
      </li>
    ));
  return (
    <div data-skew className="v12-marquee" aria-hidden={hidden || undefined}>
      <ul data-track className={`v12-track ${alt ? "v12-track--rev" : ""}`}>
        {set(false)}
        {set(true)}
      </ul>
    </div>
  );
}

export function Marcas() {
  const ref = useRef<HTMLElement>(null);
  const a = [...brands];
  const b = [...brands.slice(5), ...brands.slice(0, 5)];

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "mask");
    const at = { trigger: root, start: "top 80%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-fig]"), { opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-figs]"), start: "top 95%", once: true } });
    countUp(root, "[data-count]", "top 95%");
    gsap.from(root.querySelectorAll("[data-skew]"), { opacity: 0, y: 40, duration: 1, stagger: 0.12, ease: "expo.out", scrollTrigger: at });

    /* marquee: GSAP drives the loop; scroll velocity speeds it up and skews it (quickTo-smoothed) */
    const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", root);
    const skews = gsap.utils.toArray<HTMLElement>("[data-skew]", root);
    tracks.forEach((t) => t.classList.add("is-js"));
    const base = [-1.5, 1.25]; // % of the track per second (a row is two identical halves)
    const pos = tracks.map((_, i) => (base[i] < 0 ? 0 : -50));
    const vel = { v: 0 };
    const smooth = gsap.quickTo(vel, "v", { duration: 0.6, ease: "power3.out" });
    const setSkew = skews.map((s) => gsap.quickTo(s, "skewX", { duration: 0.5, ease: "power3.out" }));
    const st = ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top" });
    const tick = () => {
      const v = st.isActive ? st.getVelocity() : 0;
      smooth(v);
      const k = gsap.utils.clamp(-6, 6, vel.v / -260);
      setSkew.forEach((fn) => fn(k));
      const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.1);
      const boost = 1 + Math.min(Math.abs(vel.v) / 450, 7);
      const dir = vel.v < -40 ? -1 : 1; // scrolling up reverses
      tracks.forEach((t, i) => {
        pos[i] += base[i] * dir * boost * dt;
        if (pos[i] <= -50) pos[i] += 50;
        if (pos[i] > 0) pos[i] -= 50;
        gsap.set(t, { xPercent: pos[i] });
      });
    };
    gsap.ticker.add(tick);
    return () => {
      off();
      st.kill();
      gsap.ticker.remove(tick);
      tracks.forEach((t) => {
        t.classList.remove("is-js");
        gsap.set(t, { clearProps: "transform" });
      });
      gsap.set(skews, { clearProps: "transform" });
    };
  });

  return (
    <section ref={ref} id="marcas" aria-labelledby="v12-marcas-h" className="v12-sec v12-tone-cream relative overflow-hidden py-14 sm:py-16 lg:py-20">
      <div className="v12-wrap">
        <Folio n="04">Marcas</Folio>
        <h2 id="v12-marcas-h" data-h2 className={`${h2Mid} max-w-[18ch] sm:max-w-none`}>
          Han confiado en mi <Em>contenido</Em>
        </h2>
      </div>

      <div className="mt-8 space-y-1 sm:mt-10 lg:space-y-2">
        <Row list={a} />
        <Row list={b} alt hidden />
      </div>

      {/* TODO: sustituir por cifras reales */}
      <div className="v12-wrap">
        <dl data-figs className="hair-t mt-10 grid grid-cols-3 pt-8 sm:mt-12 lg:mt-14">
          {figures.map((f, i) => (
            <div key={f.label} data-fig className={`flex flex-col-reverse justify-end gap-2 ${i ? "border-l border-[color:var(--v12-hair)] pl-4 sm:pl-8 lg:pl-12" : ""}`}>
              <dt className="v12-caps text-[11px] leading-snug text-ink-soft sm:text-[12px]">{f.label}</dt>
              <dd className="font-display text-[clamp(38px,9.5vw,64px)] leading-none text-ink lg:text-[clamp(56px,6vw,96px)]">
                {f.prefix && <span className="mr-1 align-[0.5em] text-[0.45em] text-oxblood">{f.prefix}</span>}
                <span data-count={f.value} data-dec={f.dec}>
                  {String(f.value).replace(".", ",")}
                </span>
                {f.suffix && <span className="italic text-oxblood">{f.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
