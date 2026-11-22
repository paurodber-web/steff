import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";
import { services } from "../data";
import { CloseIcon } from "./Icons";
import { CtaButton } from "./CtaButton";

type Props = { open: boolean; onClose: () => void };

export function MenuOverlay({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeRef.current?.focus(), 500);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const item = (i: number) => ({
    className: cn(
      "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
      open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
    ),
    style: { transitionDelay: open ? `${350 + i * 80}ms` : "0ms" },
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      inert={!open}
      className={cn(
        "absolute inset-0 z-50 flex flex-col bg-ink text-cream transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)]",
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
      )}
    >
      {/* top bar — mirrors the main header */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 pt-4 sm:px-8 sm:pt-7 lg:px-12 lg:pt-8">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-3 justify-self-start rounded-full border border-cream/25 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-500 hover:bg-cream hover:text-ink sm:w-auto sm:px-5"
        >
          <CloseIcon className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-90" />
          <span className="hidden sm:inline">Cerrar</span>
        </button>

        <div className="text-center">
          <span className="block text-[11px] font-semibold uppercase leading-none tracking-[0.3em] sm:text-xs sm:tracking-[0.34em]">
            Steff Ramírez
          </span>
          <span className="mt-2 block text-[8.5px] font-medium uppercase leading-none tracking-[0.34em] text-cream/55 sm:text-[9.5px]">
            UGC Creator
          </span>
        </div>
        <span />
      </div>

      {/* links */}
      <nav className="flex min-h-0 flex-1 items-center px-4 sm:px-8 lg:px-12">
        <ul className="mx-auto w-full max-w-3xl">
          {services.map((s, i) => (
            <li key={s.id} {...item(i)} className={cn(item(i).className, "border-b border-cream/10 first:border-t")}>
              <a
                href={`#${s.id}`}
                onClick={onClose}
                className="group flex flex-wrap items-baseline gap-x-4 py-[clamp(10px,2.2vh,22px)] transition-[padding] duration-500 hover:pl-3"
              >
                <span className="w-6 font-display text-sm italic text-cream/45">{s.n}</span>
                <span className="font-display text-[clamp(34px,6.6vh,64px)] font-normal leading-none tracking-[-0.01em] transition-colors duration-500 group-hover:italic">
                  {s.name}
                </span>
                <span className="basis-full pl-10 pt-1.5 text-[13px] text-cream/55 sm:basis-auto sm:pl-0 sm:pt-0 sm:ml-auto">
                  {s.desc}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* footer */}
      <div {...item(5)} className={cn(item(5).className, "mx-auto w-full max-w-3xl px-4 pb-4 sm:px-0 sm:pb-8 lg:pb-10")}>
        {/* Temporarily hidden at the user's request; keep the CTA code for now. */}
        <div className="invisible">
          <CtaButton tone="light" onClick={onClose} className="w-full sm:w-auto sm:self-start" />
        </div>
      </div>
    </div>
  );
}
