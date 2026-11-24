import type { Img } from "../images";
import { Shell } from "./Shell";
import { Hero } from "./Hero";
import { Servicios } from "./Servicios";
import { Proceso } from "./Proceso";
import { Portfolio } from "./Portfolio";
import { Marcas } from "./Marcas";
import { Testimonios } from "./Testimonios";
import { SobreMi } from "./SobreMi";
import { Reserva } from "./Reserva";
import { Footer } from "./Footer";

type P = { hero: Img; portrait: Img };

export default function App({ hero, portrait }: P) {
  return (
    <Shell>
      {({ openMenu, openContact }) => (
        <>
          <Hero hero={hero} onMenu={openMenu} onContact={openContact} cue="#servicios" />
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
