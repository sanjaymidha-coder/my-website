"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget, useLenis } from "./SmoothScroll";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate>(() => {});

export function useTransitionNavigate() {
  return useContext(TransitionContext);
}

function splitHref(href: string) {
  const url = new URL(href, "http://x");
  return { pathname: url.pathname, hash: url.hash };
}

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const navigate = useCallback<Navigate>(
    (href) => {
      const { pathname: to, hash } = splitHref(href);

      // Same page: just scroll.
      if (to === pathname) {
        if (hash) {
          history.replaceState(null, "", hash);
          scrollToTarget(lenis, hash);
        } else scrollToTarget(lenis, 0);
        return;
      }

      if (busy.current) return;
      pending.current = hash || null;

      const el = curtain.current;
      if (!el || prefersReducedMotion()) {
        router.push(href, { scroll: true });
        return;
      }

      busy.current = true;
      router.prefetch(to);
      gsap
        .timeline()
        .set(el, { display: "block" })
        .fromTo(
          el.children,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6, ease: "power4.inOut", stagger: 0.08 },
        )
        .add(() => router.push(href, { scroll: false }));
    },
    [lenis, pathname, router],
  );

  // On route change: reset scroll, reveal page, jump to hash if any.
  useEffect(() => {
    const el = curtain.current;
    const hash = pending.current ?? (typeof window !== "undefined" ? window.location.hash : "");
    pending.current = null;

    scrollToTarget(lenis, 0, true);
    lenis?.resize();

    const finish = () => {
      ScrollTrigger.refresh();
      if (hash) requestAnimationFrame(() => scrollToTarget(lenis, hash, true));
    };

    if (!el || !busy.current) {
      // Initial load / back-forward without curtain.
      const t = setTimeout(finish, 50);
      return () => clearTimeout(t);
    }

    const tl = gsap
      .timeline({
        delay: 0.1,
        onComplete: () => {
          gsap.set(el, { display: "none" });
          busy.current = false;
        },
      })
      .add(finish)
      .to(el.children, { yPercent: -100, duration: 0.7, ease: "power4.inOut", stagger: 0.08 });
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div ref={curtain} aria-hidden className="pointer-events-none fixed inset-0 z-[9990] hidden">
        <div className="absolute inset-0 bg-lime" />
        <div className="absolute inset-0 grid place-items-center bg-navy">
          <span className="font-display text-4xl font-semibold tracking-tight text-white/90 md:text-6xl">
            <em className="accent text-lime">loading</em>…
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Omit<LinkProps, "href"> & { href: string; children: ReactNode };

/** next/link that runs the curtain transition for internal routes. */
export function TransitionLink({ href, onClick, children, ...rest }: TLinkProps) {
  const navigate = useTransitionNavigate();
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || isExternal) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  if (isExternal) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
