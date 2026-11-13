import type { Metadata } from "next";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowUpRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[90svh] items-center overflow-hidden pt-32">
      <div className="glow left-1/2 top-1/3 h-[480px] w-[640px] -translate-x-1/2 bg-lime/25" />
      <div className="container">
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="h-display max-w-[14ch] text-[clamp(3rem,9vw,8rem)]">
          This page took a <em className="accent text-lime">wrong</em> turn.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-white/65">
          The page you’re looking for doesn’t exist or has moved. Try one of these instead:
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <TransitionLink href="/" className="btn-primary">
            Back to home <ArrowUpRight />
          </TransitionLink>
          <TransitionLink href="/work" className="btn-ghost">
            See our work
          </TransitionLink>
          <TransitionLink href="/services" className="btn-ghost">
            Our services
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
