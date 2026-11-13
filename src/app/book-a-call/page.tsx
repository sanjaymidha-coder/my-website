import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StepCards } from "@/components/sections/Misc";
import { Contact } from "@/components/sections/Contact";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { brands } from "@/data/site";
import { bookCallSteps } from "@/data/process";

export const metadata: Metadata = {
  title: { absolute: "Book a Call | Codeller" },
  description: "The first call is a chance to learn about your goals and see if our approach is the right fit.",
};

export default function BookACallPage() {
  return (
    <>
      <Hero
        compact
        eyebrow="Book a call"
        title="Let’s talk about how design can create *impact*"
        body="The first call is a chance to learn about your goals and see if our approach is the right fit. This is not a sales call. It’s an opportunity to explore whether our approach aligns with your needs. We want the experience of working with Codeller to feel clear from the start."
        primary={{ label: "Book a Call", href: "/book-a-call#contact" }}
      />

      <StepCards eyebrow="The first call" title="What you’ll get from the *initial* call" steps={bookCallSteps} />

      <section className="section pt-0">
        <div className="container">
          <div className="glass grid gap-10 p-8 md:grid-cols-2 md:p-14">
            <SectionTitle
              eyebrow="Privacy"
              title="Your time and privacy *matter* to us"
              titleClassName="!text-[clamp(2rem,4vw,3.5rem)]"
            />
            <div className="space-y-5 text-white/70 md:text-lg">
              <p>There’s no obligation to move forward. It’s simply a conversation to explore how design could add value to your work.</p>
              <p>
                We understand that some conversations involve sensitive information. We’re happy to sign a confidentiality agreement before we talk. The goal of the call is to understand your challenges and see whether our approach is a good fit for your organisation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Contact brandKey="codeller" brand={brands.codeller} defaultSubject="Consultation" title="Request your *call*" />
    </>
  );
}
