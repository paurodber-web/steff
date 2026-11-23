import { useEffect, useRef } from "react";
import type { Img } from "../images";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Servicios } from "./Servicios";
import { Proceso } from "./Proceso";
import { Portfolio } from "./Portfolio";
import { Marcas } from "./Marcas";
import { Testimonios } from "./Testimonios";
import { SobreMi } from "./SobreMi";
import { Reserva } from "./Reserva";
import { Footer } from "./Footer";

type P = { hero: Img; portrait: Img };

/** Thin oxblood reading-progress bar fixed at the top. */
function Progress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden className="v11-progress">
      <span ref={bar} />
    </div>
  );
}

export default function App({ hero, portrait }: P) {
  return (
    <Shell>
      {({ openMenu, openContact }) => (
        <>
          <Progress />
          <EleHero hero={hero} onMenu={openMenu} onContact={openContact} title={<Letters />} cue="#servicios" />
          <Servicios portrait={portrait} />
          <Proceso />
          <Portfolio portrait={portrait} />
          <Marcas />
          <Testimonios />
          <SobreMi portrait={portrait} />
          <Reserva />
          <Footer />
        </>
      )}
    </Shell>
  );
}
