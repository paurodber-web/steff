import type { CSSProperties } from "react";
import { cn } from "./cn";
import { MailIcon } from "./Icons";
import { EMAIL } from "./data";

const pill =
  "inline-flex h-11 items-center justify-center gap-3 rounded-full border border-ink/15 bg-white/25 text-[11px] font-medium uppercase tracking-[0.2em] text-ink backdrop-blur-md transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream active:border-ink active:bg-ink active:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function Header({ onMenu, onContact }: { onMenu: () => void; onContact: () => void }) {
  return (
    <header className="relative z-40 lg:absolute lg:inset-x-0 lg:top-0 grid grid-cols-[1fr_auto_1fr] items-center px-4 pb-3 pt-4 sm:px-8 sm:pb-6 sm:pt-7 lg:px-12 lg:pb-0 lg:pt-8">
      <div className="anim-down justify-self-start" style={d(1.5)}>
        <button
          type="button"
          onClick={onMenu}
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          className={cn(pill, "group w-11 cursor-pointer px-0 sm:w-auto sm:px-5")}
        >
          <span className="relative block h-[7px] w-[18px]" aria-hidden>
            <span className="absolute left-0 top-0 h-px w-full bg-current" />
            <span className="absolute bottom-0 left-0 h-px w-[60%] bg-current transition-all duration-500 group-hover:w-full group-active:w-full" />
          </span>
          <span className="hidden sm:inline">Menú</span>
        </button>
      </div>

      <a
        href="#top"
        className="anim-down rounded-md px-1 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        style={d(1.4)}
      >
        <span className="block whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.2em] text-ink sm:text-xs sm:tracking-[0.3em]">
          Steff Ramírez
        </span>
        <span className="mt-2 flex items-center justify-center gap-2 whitespace-nowrap text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-ink-soft sm:tracking-[0.3em]">
          <span aria-hidden className="h-px w-3 bg-ink/30" />
          UGC Creator
          <span aria-hidden className="h-px w-3 bg-ink/30" />
        </span>
      </a>

      <div className="anim-down justify-self-end" style={d(1.6)}>
        <button
          type="button"
          onClick={onContact}
          aria-label={`Escribir a ${EMAIL}`}
          aria-haspopup="dialog"
          className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-4 rounded-full border border-ink/15 bg-white/25 p-1.5 text-ink backdrop-blur-md transition-colors duration-300 hover:border-ink/40 active:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink min-[540px]:w-auto min-[540px]:justify-between min-[540px]:pl-5 min-[540px]:pr-1.5"
        >
          <span className="hidden whitespace-nowrap text-[12px] font-medium tracking-[0.01em] min-[540px]:inline">{EMAIL}</span>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:scale-105 group-active:scale-95">
            <MailIcon className="h-[17px] w-[17px]" />
          </span>
        </button>
      </div>
    </header>
  );
}
