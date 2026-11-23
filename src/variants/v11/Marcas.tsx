import { useRef } from "react";
import { brands } from "../../v2/data";
import { gsap, ScrollTrigger, useMotion } from "../kit";
import { countUp, headMotion } from "./common";
import { figures } from "./data";

const Star = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`mx-6 inline-block leading-none text-oxblood sm:mx-10 ${className}`}>
    ✦
  </span>
);

function Row({ list, alt, hidden }: { list: string[]; alt?: boolean; hidden?: boolean }) {
  const set = (dup: boolean) =>
    list.map((b, i) => (
      <li key={`${dup}${b}`} aria-hidden={dup || undefined} data-dup={dup || undefined} className="flex items-center">
        <span
          className={`font-display leading-[1.08] ${
            alt ? "v11-outline-ink text-[clamp(52px,9vw,104px)]" : `text-[clamp(64px,12vw,168px)] ${i % 2 ? "italic text-oxblood" : "text-ink"}`
          }`}
        >
          {b}
        </span>
        <Star className={alt ? "text-[18px] sm:text-[24px]" : "text-[26px] sm:text-[40px] lg:text-[56px]"} />
      </li>
    ));
  return (
    <div data-skew className="v11-marquee" aria-hidden={hidden || undefined}>
      <ul data-track className={`v11-track ${alt ? "v11-track--rev" : ""}`}>
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
    <section ref={ref} id="marcas" aria-labelledby="v11-marcas-h" className="relative scroll-mt-4 overflow-hidden py-14 sm:py-16 lg:py-16">
      <div className="v11-wrap px-5 text-center sm:px-10">
        <p data-eyebrow className="text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft">
          <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-ink/30" />
          Marcas
          <span className="ml-3 inline-block h-px w-8 translate-y-[-3px] bg-ink/30" />
        </p>
        <h2 id="v11-marcas-h" data-h2 className="mt-4 font-display text-[clamp(30px,6vw,52px)] leading-[1.05] tracking-[-0.01em] text-ink">
          Han confiado en mi <span className="italic text-oxblood">contenido</span>
        </h2>
      </div>

      <div className="mt-8 space-y-1 sm:mt-10 lg:space-y-2">
        <Row list={a} />
        <Row list={b} alt hidden />
      </div>

      {/* TODO: sustituir por cifras reales */}
      <dl data-figs className="v11-wrap mt-10 grid grid-cols-3 gap-2 px-5 sm:mt-12 sm:gap-6 sm:px-10 lg:mt-14">
        {figures.map((f, i) => (
          <div key={f.label} data-fig className={`flex flex-col items-center text-center ${i ? "border-l border-ink/12" : ""}`}>
            <dd className="font-display text-[clamp(34px,9vw,84px)] leading-none text-ink">
              {f.prefix && <span className="mr-1 align-[0.55em] font-sans text-[0.42em] font-normal text-oxblood">{f.prefix}</span>}
              <span data-count={f.value} data-dec={f.dec}>
                {String(f.value).replace(".", ",")}
              </span>
              {f.suffix && <span className="italic text-oxblood">{f.suffix}</span>}
            </dd>
            <dt className="mt-2 text-[10px] uppercase leading-snug tracking-[0.16em] text-ink-soft sm:text-[12px] sm:tracking-[0.2em]">{f.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
