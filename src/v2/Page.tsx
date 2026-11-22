import { useCallback, useEffect, useRef, useState } from "react";
import { Hero, type HeroImage } from "./Hero";
import { InfoSection, SiteFooter } from "./InfoSection";
import { MenuOverlay } from "./MenuOverlay";
import { ContactOverlay } from "./ContactOverlay";

type Overlay = "menu" | "contact" | null;

export default function Page({ image }: { image: HeroImage }) {
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

  // Close the menu, then smooth-scroll to a section that exists at every breakpoint.
  const navigate = useCallback((id: string) => {
    trigger.current = null;
    setActive(null);
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
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
        <Hero image={image} onMenu={() => openOverlay("menu")} onContact={() => openOverlay("contact")} />
        <InfoSection onContact={() => openOverlay("contact")} />
      </main>
      <div data-v2-bg>
        <SiteFooter />
      </div>
      <MenuOverlay open={active === "menu"} onClose={close} onNavigate={navigate} onContact={() => openOverlay("contact")} />
      <ContactOverlay open={active === "contact"} onClose={close} />
    </>
  );
}
