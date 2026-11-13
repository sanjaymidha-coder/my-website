export type Brand = "codeller" | "deco";

export interface NavItem {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  name: string;
  image: string;
  url: string;
  tags: string[];
  about: string;
  industry: string;
  services: string;
  audience: string;
  details: string[];
  /** Cursor bubble colours used on hover */
  cursorColor: string;
  cursorText: string;
}

export interface ServiceItem {
  title: string;
  image: string;
  href: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  badge?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Logo {
  name: string;
  src: string;
}

export interface BentoItem {
  title: string;
  image?: string;
}

export interface Stat {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
}
