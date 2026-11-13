"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Client-only: the canvas never renders on the server.
const Particles = dynamic(() => import("./Particles").then((m) => m.Particles), { ssr: false });

// Same pages as the original site (index.html and decostorepros.html).
const ROUTES = new Set(["/", "/decostorepros"]);

export function ParticlesLoader() {
  const pathname = usePathname() ?? "/";
  return ROUTES.has(pathname) ? <Particles /> : null;
}
