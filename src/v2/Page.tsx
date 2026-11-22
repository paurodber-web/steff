import { useCallback, useEffect, useRef, useState } from "react";
import { Hero, type HeroImage } from "./Hero";
import { MenuOverlay } from "./MenuOverlay";
import { ContactOverlay } from "./ContactOverlay";
import { Manifesto } from "./Manifesto";
import { Feed } from "./Feed";
import { Credits } from "./Credits";
import { Grain, Folio, Cursor } from "./Chrome";
import { useSmoothScroll, scrollToTarget } from "./smooth";
import { Process } from "./Process";
import { About } from "./About";
import { Faq } from "./Faq";
import { Contact } from "./Contact";
import { FloatingBar } from "./FloatingBar";
import { useScenes } from "./anim";

type Overlay = "menu" | "contact" | null;

export default function Page({ image, aboutImage }: { image: HeroImage; aboutImage: HeroImage }) {
  const [active, setActive] = useState<Overlay>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const openOverlay = useCallback((name: Exclude<Overlay, null>) => {
    setActive((cur) => {
      if (cur === null) trigger.current = document.activeElement as HTMLElement | null;
      return name;
    });
  }, []);

  const close = useCallback(() => {
    setActive(null);
    const el = trigger.current;
    trigger.current = null;
    if (el) window.requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);

  const openContact = useCallback(() => openOverlay("contact"), [openOverlay]);
  const openMenu = useCallback(() => openOverlay("menu"), [openOverlay]);

  // page background follows the section in view (cream → sand → cream → warm paper)
  useScenes();
  useSmoothScroll();

  // Close the menu, then smooth-scroll to a section that exists at every breakpoint.
  const navigate = useCallback((id: string) => {
    trigger.current = null;
    setActive(null);
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      scrollToTarget(el);
      history.replaceState(null, "", `#${id}`);
    }, 60);
  }, []);

  // Lock page scroll and hide the page behind from assistive tech while an overlay is open.
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const bg = Array.from(document.querySelectorAll<HTMLElement>("[data-v2-bg]"));
    bg.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      html.style.overflow = prev;
      bg.forEach((el) => el.removeAttribute("inert"));
    };
  }, [active]);

  return (
    <>
      <main data-v2-bg>
        <Hero image={image} onMenu={openMenu} onContact={openContact} />
        <Manifesto portrait={aboutImage} />
        <Feed portrait={aboutImage} />
        <Credits onContact={openContact} />
        <Process />
        <About image={aboutImage} />
        <Faq onContact={openContact} />
        <Contact />
      </main>
      <Grain />
      <Folio />
      <Cursor />
      <FloatingBar onMenu={openMenu} onContact={openContact} hidden={active !== null} />
      <MenuOverlay open={active === "menu"} onClose={close} onNavigate={navigate} onContact={() => openOverlay("contact")} />
      <ContactOverlay open={active === "contact"} onClose={close} />
    </>
  );
}
