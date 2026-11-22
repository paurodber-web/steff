import { useEffect, useRef, type FormEvent } from "react";
import { cn } from "../utils/cn";
import { EMAIL } from "../data";
import { CloseIcon } from "./Icons";

type Props = { open: boolean; onClose: () => void };

export function ContactOverlay({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 500);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const subject = encodeURIComponent(`Nueva colaboración de ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const item = (index: number) => ({
    className: cn(
      "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
      open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
    ),
    style: { transitionDelay: open ? `${350 + index * 80}ms` : "0ms" },
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contacto"
      inert={!open}
      className={cn(
        "absolute inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-cream transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)]",
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 pt-4 sm:px-8 sm:pt-7 lg:px-12 lg:pt-8">
        <span />
        <div className="text-center">
          <span className="block text-[11px] font-semibold uppercase leading-none tracking-[0.3em] sm:text-xs sm:tracking-[0.34em]">
            Steff Ramírez
          </span>
          <span className="mt-2 block text-[8.5px] font-medium uppercase leading-none tracking-[0.34em] text-cream/55 sm:text-[9.5px]">
            UGC Creator
          </span>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar contacto"
          className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-3 justify-self-end rounded-full border border-cream/25 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-500 hover:bg-cream hover:text-ink sm:w-auto sm:px-5"
        >
          <span className="hidden sm:inline">Cerrar</span>
          <CloseIcon className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-90" />
        </button>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div {...item(0)}>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-cream/50">Contacto</p>
          <h1 className="mt-4 font-display text-[clamp(42px,7vw,76px)] leading-[0.95] tracking-[-0.02em]">
            Hablemos de tu <span className="italic">proyecto.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-cream/65 sm:text-base">
            Cuéntame qué tienes en mente y te responderé lo antes posible.
          </p>
          <a
            className="mt-3 inline-block text-sm text-cream underline decoration-cream/35 underline-offset-4 transition-colors hover:decoration-cream"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
        </div>

        <form {...item(1)} onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2">
          <label className="grid gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/55">
            Nombre
            <input
              required
              autoComplete="name"
              name="name"
              className="h-12 border-b border-cream/25 bg-transparent text-base font-normal normal-case tracking-normal text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-cream"
              placeholder="Tu nombre"
            />
          </label>
          <label className="grid gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/55">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              name="email"
              className="h-12 border-b border-cream/25 bg-transparent text-base font-normal normal-case tracking-normal text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-cream"
              placeholder="tu@email.com"
            />
          </label>
          <label className="grid gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/55 sm:col-span-2">
            Cuéntame sobre tu proyecto
            <textarea
              required
              name="message"
              rows={3}
              className="resize-y border-b border-cream/25 bg-transparent py-3 text-base font-normal normal-case tracking-normal text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-cream"
              placeholder="Marca, idea, fechas…"
            />
          </label>
          <button
            type="submit"
            className="mt-1 inline-flex h-12 cursor-pointer items-center justify-center gap-5 self-start rounded-full bg-cream px-6 text-[10px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white sm:col-span-2"
          >
            Enviar mensaje <span aria-hidden>↗</span>
          </button>
        </form>
      </main>
    </div>
  );
}
