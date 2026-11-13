"use client";

import { usePathname } from "next/navigation";
import { brands } from "@/data/site";
import type { Brand } from "@/data/types";

export function useBrand() {
  const pathname = usePathname() ?? "/";
  const key: Brand = pathname.startsWith("/decostorepros") ? "deco" : "codeller";
  return { key, brand: brands[key] };
}
