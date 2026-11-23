import { useRef } from "react";
import { brands } from "../../v2/data";
import { gsap, useMotion } from "../kit";
import { Eyebrow, Panel } from "./common";

function Row({ list, reverse }: { list: string[]; reverse?: boolean }) {
  const set = (hidden: boolean) =>
    list.map((b, i) => (
      <li key={`${hidden}${b}`} aria-hidden={hidden || undefined} className="flex items-center" data-dup={hidden || undefined}>
        <span className={`font-display text-[26px] leading-none sm:text-[32px] lg:text-[38px] ${i % 2 ? "italic text-oxblood" : "text-ink"}`}>{b}</span>
        <span aria-hidden className="mx-6 h-1 w-1 rounded-full bg-ink/25 sm:mx-9" />
      </li>
    ));
  return (
    <div data-row className="v11-marquee">
      <ul className={`v11-track ${reverse ? "v11-track--rev" : ""}`}>
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
    const at = { trigger: root, start: "top 90%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-eyebrow]"), { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-note]"), { opacity: 0, y: 10, duration: 0.6, delay: 0.1, ease: "power2.out", scrollTrigger: at });
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
    rows.forEach((r, i) => gsap.from(r, { xPercent: i ? -14 : 14, opacity: 0, duration: 1, delay: 0.1 + i * 0.12, ease: "expo.out", scrollTrigger: at }));
  });

  return (
    <Panel id="marcas" labelledBy="v11-marcas-h" innerRef={ref} className="!py-9 sm:!py-11 lg:!py-12">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <Eyebrow>Marcas</Eyebrow>
        <h2 id="v11-marcas-h" data-note className="text-[14px] text-ink-soft">
          Han confiado en mi <span className="font-display italic text-oxblood">contenido</span>
        </h2>
      </div>
      <div className="mt-6 space-y-4 sm:space-y-5">
        <Row list={a} />
        <Row list={b} reverse />
      </div>
    </Panel>
  );
}
