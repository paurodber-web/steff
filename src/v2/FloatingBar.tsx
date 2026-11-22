import { useEffect, useState } from "react";
import { cn } from "./cn";
import { MailIcon } from "./Icons";
import { EMAIL } from "./data";

const pill =
  "inline-flex h-11 items-center justify-center rounded-full border border-ink/10 bg-cream/85 text-ink shadow-[0_10px_30px_-18px_rgba(42,27,22,0.55)] backdrop-blur-md transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/**
 * Compact header that appears once the hero is gone: hides while reading downwards,
 * comes back as soon as the visitor scrolls up, so menu and contact are always one gesture away.
 */
export function FloatingBar({ onMenu, onContact, hidden }: { onMenu: () => void; onContact: () => void; hidden?: boolean }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const hero = document.getElementById("top");
      const past = y > (hero ? hero.offsetHeight * 0.85 : 600);
      const nearEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 4;
      const delta = y - lastY;
      if (!past) setShown(false);
      else if (delta < -6 || nearEnd) setShown(true);
      else if (delta > 6) setShown(false);
      if (Math.abs(delta) > 6) lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      inert={!shown || hidden}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:px-8 sm:pt-5 lg:px-12",
        shown ? "translate-y-0 opacity-100" : "-translate-y-[130%] opacity-0",
      )}
    >
      <button type="button" onClick={onMenu} aria-label="Abrir menú" aria-haspopup="dialog" className={cn(pill, "group pointer-events-auto w-11 cursor-pointer gap-3 sm:w-auto sm:px-5")}>
        <span className="relative block h-[7px] w-[18px]" aria-hidden>
          <span className="absolute left-0 top-0 h-px w-full bg-current" />
          <span className="absolute bottom-0 left-0 h-px w-[60%] bg-current transition-all duration-500 group-hover:w-full" />
        </span>
        <span className="hidden text-[11px] font-medium uppercase tracking-[0.2em] sm:inline">Menú</span>
      </button>

      <a href="#top" className={cn(pill, "pointer-events-auto hidden px-5 text-[11px] font-semibold uppercase tracking-[0.24em] md:inline-flex")}>
        Steff Ramírez
      </a>

      <button
        type="button"
        onClick={onContact}
        aria-label={`Escribir a ${EMAIL}`}
        aria-haspopup="dialog"
        className={cn(pill, "pointer-events-auto w-11 cursor-pointer gap-3 sm:w-auto sm:pl-5 sm:pr-1.5")}
      >
        <span className="hidden text-[11px] font-medium uppercase tracking-[0.2em] sm:inline">Escríbeme</span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-cream sm:h-8 sm:w-8">
          <MailIcon className="h-[16px] w-[16px]" />
        </span>
      </button>
    </div>
  );
}
