import { cn } from "./cn";
import { ArrowUpRight } from "./Icons";

type Props = { className?: string; children: string; onClick?: () => void };

/** Pill CTA: dark ink, cream arrow badge, hover fills from the top. Opens an overlay (button, not link). */
export function CtaButton({ className, children, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative inline-flex h-14 cursor-pointer items-center justify-between gap-5 overflow-hidden rounded-full bg-ink pl-7 pr-2 text-cream shadow-[0_14px_30px_-14px_rgba(42,27,22,0.7)] transition-shadow duration-500 hover:shadow-[0_18px_36px_-14px_rgba(42,27,22,0.85)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-y-full bg-[#4a3328] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] group-hover:translate-y-0 group-active:translate-y-0 group-focus-visible:translate-y-0"
      />
      <span className="relative whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.22em]">{children}</span>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-active:rotate-45 group-focus-visible:rotate-45">
        <ArrowUpRight className="h-[15px] w-[15px]" />
      </span>
    </button>
  );
}
