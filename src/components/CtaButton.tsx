import { cn } from "../utils/cn";
import { ArrowUpRight } from "./Icons";

type Props = {
  className?: string;
  tone?: "dark" | "light";
  onClick?: () => void;
};

/** Pill CTA: dark ink, cream arrow badge, hover fills from the top. */
export function CtaButton({ className, tone = "dark", onClick }: Props) {
  const dark = tone === "dark";
  return (
    <a
      href="#contacto"
      onClick={onClick}
      className={cn(
        "group relative inline-flex h-14 items-center justify-between gap-5 overflow-hidden rounded-full pl-7 pr-2 transition-shadow duration-500",
        dark
          ? "bg-ink text-cream shadow-[0_14px_30px_-14px_rgba(42,27,22,0.7)] hover:shadow-[0_18px_36px_-14px_rgba(42,27,22,0.85)]"
          : "bg-cream text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] group-hover:translate-y-0",
          dark ? "bg-[#4a3328]" : "bg-[#e4d6c0]",
        )}
      />
      <span className="relative text-[11px] font-medium uppercase tracking-[0.26em] whitespace-nowrap">
        Quiero contratarte
      </span>
      <span
        className={cn(
          "relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45",
          dark ? "bg-cream text-ink" : "bg-ink text-cream",
        )}
      >
        <ArrowUpRight className="h-[15px] w-[15px]" />
      </span>
    </a>
  );
}
