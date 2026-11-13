"use client";

import { useEffect, useState } from "react";

/**
 * Tiny global flag that flips once the preloader has finished, so intro
 * animations (e.g. the hero headline) can wait for it.
 */
let loaded = false;
const listeners = new Set<() => void>();

export function markLoaded() {
  if (loaded) return;
  loaded = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function useSiteLoaded(): boolean {
  const [isLoaded, setLoaded] = useState(loaded);
  useEffect(() => {
    if (loaded) {
      setLoaded(true);
      return;
    }
    const fn = () => setLoaded(true);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return isLoaded;
}
