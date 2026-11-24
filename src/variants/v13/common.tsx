import type { ReactNode } from "react";

export const EASE = "expo.out";

/** Italic accent word. */
export const Em = ({ children }: { children: ReactNode }) => <span className="italic text-oxblood">{children}</span>;
export const Gold = ({ children }: { children: ReactNode }) => <span className="v13-gold italic">{children}</span>;

export const WRAP = "v13-wrap";

/** True when GSAP-driven (non CSS) motion is allowed. */
export const motionOk = () => typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
