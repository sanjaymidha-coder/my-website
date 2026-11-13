import type { Logo } from "./types";

export const clientLogos: Logo[] = [
  { name: "CostSaver", src: "/assets/images/costsaver.svg" },
  { name: "Trafalgar", src: "/assets/images/trafalgar.svg" },
  { name: "FatJoe", src: "/assets/images/fj.svg" },
  { name: "Midland", src: "/assets/images/midland.svg" },
  { name: "Mxology", src: "/assets/images/mxology.svg" },
  { name: "Revo", src: "/assets/images/revo.svg" },
];

/** Partnership fan-out cards (same order as the original page). */
export const partnershipFrames: string[] = [4, 2, 3, 1, 5, 3, 4].map(
  (n) => `/assets/images/partnerships/frame-${n}.webp`,
);
