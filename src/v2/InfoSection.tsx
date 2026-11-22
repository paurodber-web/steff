import { services, socials, EMAIL } from "./data";
import { CtaButton } from "./CtaButton";

const linkCls =
  "rounded-sm underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink active:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export function InfoSection({ onContact }: { onContact: () => void }) {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-title" className="scroll-mt-4 px-5 pb-[clamp(40px,6vw,64px)] pt-[clamp(64px,10vw,140px)] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8">
        <div className="lg:col-span-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft sm:tracking-[0.28em]">
          UGC Creator · Contenido para marcas
        </p>
        <h2
          id="sobre-mi-title"
          className="mt-6 max-w-[14ch] font-display text-[clamp(44px,8.5vw,96px)] lg:text-[clamp(60px,6.6vw,96px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink"
        >
          Contenido que se siente <em className="italic">real</em>.
        </h2>
        </div>
        <div className="lg:col-span-5 lg:pb-3">
        <p className="mt-6 max-w-[34rem] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-ink-soft sm:mt-8 lg:mt-0">
          Creo videos UGC de moda, belleza, lifestyle y maternidad para marcas que quieren conectar con su audiencia sin parecer publicidad.
        </p>
        <div className="mt-8 hidden flex-wrap items-center gap-x-8 gap-y-4 lg:flex">
          <CtaButton onClick={onContact} className="shrink-0">Escríbeme</CtaButton>
          <a href={`mailto:${EMAIL}`} className={`${linkCls} text-[15px] text-ink`}>
            {EMAIL}
          </a>
        </div>
        </div>
        </div>

        <div id="servicios" className="mt-[clamp(40px,6vw,64px)] scroll-mt-4">
          <h3 className="sr-only">Servicios</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
            {services.map((s) => (
              <li key={s.id} id={s.id} className="scroll-mt-4 border-t border-ink/15 py-6 sm:py-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[22px] italic leading-none text-ink-soft">{s.n}</span>
                  <h4 className="text-[13px] font-semibold uppercase leading-none tracking-[0.2em] text-ink">{s.name}</h4>
                </div>
                <p className="mt-3 text-[15px] leading-snug text-ink-soft">{s.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[clamp(32px,5vw,48px)] flex flex-col lg:hidden items-stretch gap-5 sm:flex-row sm:items-center sm:gap-8">
          <CtaButton onClick={onContact} className="sm:self-start">
            Escríbeme
          </CtaButton>
          <a href={`mailto:${EMAIL}`} className={`${linkCls} self-start text-[15px] text-ink sm:self-auto`}>
            {EMAIL}
          </a>
        </div>

        <ul className="mt-[clamp(40px,6vw,64px)] grid grid-cols-2 gap-3 sm:flex sm:flex-wrap lg:hidden" aria-label="Redes sociales">
          {socials.map((s) => (
            <li key={s.label} className="flex">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 w-full flex-col justify-center gap-1 rounded-2xl border border-ink/15 px-5 py-3 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream active:border-ink active:bg-ink active:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:min-w-[200px]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">{s.label}</span>
                <span className="text-[13px] opacity-70">{s.handle}</span>
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-16 hidden flex-wrap gap-x-12 gap-y-2 lg:flex" aria-label="Redes sociales">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-baseline gap-3 rounded-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <span className="text-[12px] font-semibold uppercase tracking-[0.2em]">{s.label}</span>
                <span className="text-[15px] text-ink-soft underline decoration-ink/30 underline-offset-4 transition-colors group-hover:decoration-ink group-active:decoration-ink">{s.handle}</span>
                <span aria-hidden>↗</span>
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-5 pb-[clamp(24px,4vw,40px)] sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-ink/15 pt-6 text-[13px] text-ink-soft">
        <span>© 2026 Steff Ramírez</span>
        <ul className="flex gap-x-5">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkCls} inline-flex min-h-11 items-center`}
              >
                {s.label}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
