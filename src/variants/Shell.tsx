import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MenuOverlay } from "../v2/MenuOverlay";
import { ContactOverlay } from "../v2/ContactOverlay";
import { FloatingBar } from "../v2/FloatingBar";
import { useSmoothScroll, scrollToTarget } from "../v2/smooth";

export type ShellApi = { openMenu: () => void; openContact: () => void };

/**
 * Everything the live homepage does around the content: the real menu and contact panels,
 * the floating bar after the hero, smooth scrolling, focus return and background inerting.
 */
export function Shell({ children }: { children: (api: ShellApi) => ReactNode }) {
  const [active, setActive] = useState<"menu" | "contact" | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useSmoothScroll();

  const open = useCallback((name: "menu" | "contact") => {
    setActive((cur) => {
      if (cur === null) trigger.current = document.activeElement as HTMLElement | null;
      return name;
    });
  }, []);
  const openMenu = useCallback(() => open("menu"), [open]);
  const openContact = useCallback(() => open("contact"), [open]);

  const close = useCallback(() => {
    setActive(null);
    const el = trigger.current;
    trigger.current = null;
    if (el) requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);

  const navigate = useCallback((id: string) => {
    trigger.current = null;
    setActive(null);
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) scrollToTarget(el);
    }, 60);
  }, []);

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
      <main data-v2-bg className="overflow-x-clip">{children({ openMenu, openContact })}</main>
      <FloatingBar onMenu={openMenu} onContact={openContact} hidden={active !== null} />
      <MenuOverlay open={active === "menu"} onClose={close} onNavigate={navigate} onContact={openContact} />
      <ContactOverlay open={active === "contact"} onClose={close} />
    </>
  );
}
