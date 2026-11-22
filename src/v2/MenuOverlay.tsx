import { useRef } from "react";
import { cn } from "./cn";
import { menuItems, socials, EMAIL } from "./data";
import { CloseIcon } from "./Icons";
import { useOverlay } from "./useOverlay";

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onContact: () => void;
};

export function MenuOverlay({ open, onClose, onNavigate, onContact }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useOverlay(open, onClose, closeRef);

  const item = (i: number) => ({
    className: cn(
      "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
      open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
    ),
    style: { transitionDelay: open ? `${350 + i * 70}ms` : "0ms" },
  });

  const rowCls =
    "group flex w-full cursor-pointer flex-wrap items-baseline gap-x-4 py-[clamp(6px,1.5svh,20px)] text-left transition-[padding] duration-300 hover:pl-3 active:pl-3 focus-visible:pl-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream";
  const nameCls =
    "font-display text-[clamp(30px,5.2svh,60px)] font-normal leading-none tracking-[-0.01em] transition-colors duration-300 group-hover:italic group-active:italic group-focus-visible:italic";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      inert={!open}
      className={cn(
        "v2-overlay flex flex-col overflow-y-auto bg-ink text-cream transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)]",
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 pt-4 sm:px-8 sm:pt-7 lg:px-12 lg:pt-8">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-3 justify-self-start rounded-full border border-cream/25 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-cream hover:text-ink active:bg-cream active:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream sm:w-auto sm:px-5"
        >
          <CloseIcon className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-90" />
          <span className="hidden sm:inline">Cerrar</span>
        </button>
        <div className="text-center">
          <span className="block whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.2em] sm:text-xs sm:tracking-[0.3em]">
            Steff Ramírez
          </span>
          <span className="mt-2 block text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-cream/60 sm:tracking-[0.3em]">
            UGC Creator
          </span>
        </div>
        <span />
      </div>

      <nav aria-label="Menú principal" className="flex min-h-0 flex-1 items-center px-4 py-4 sm:px-8 lg:px-12">
        <ul className="mx-auto w-full max-w-3xl">
          {menuItems.map((m, i) => (
            <li key={m.id} {...item(i)} className={cn(item(i).className, "border-b border-cream/10 first:border-t")}>
              {m.kind === "anchor" ? (
                <a
                  href={`#${m.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(m.id);
                  }}
                  className={rowCls}
                >
                  <span className="w-6 font-display text-sm italic text-cream/50">{m.n}</span>
                  <span className={nameCls}>{m.name}</span>
                  <span className="basis-full pl-10 pt-1.5 text-[13px] text-cream/60 sm:ml-auto sm:basis-auto sm:pl-0 sm:pt-0">{m.desc}</span>
                </a>
              ) : (
                <button type="button" onClick={onContact} className={rowCls}>
                  <span className="w-6 font-display text-sm italic text-cream/50">{m.n}</span>
                  <span className={nameCls}>{m.name}</span>
                  <span className="basis-full pl-10 pt-1.5 text-[13px] text-cream/60 sm:ml-auto sm:basis-auto sm:pl-0 sm:pt-0">{m.desc}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div {...item(7)} className={cn(item(7).className, "mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-8 lg:pb-10")}>
        <a href={`mailto:${EMAIL}`} className="rounded-sm text-[14px] underline decoration-cream/35 underline-offset-4 hover:decoration-cream active:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
          {EMAIL}
        </a>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-cream active:text-cream focus-visible:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                {s.label}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
