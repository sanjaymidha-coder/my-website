"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "@/components/ui/Icons";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (key: string, opts: { action: string }) => Promise<string>;
    };
  }
}

async function getToken(): Promise<string | undefined> {
  if (!SITE_KEY || !window.grecaptcha) return undefined;
  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!.execute(SITE_KEY, { action: "contact" }).then(resolve, () => resolve(undefined));
    });
  });
}

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

export function ContactForm({ subjects, budgets, brand, defaultSubject }: { subjects: string[]; budgets: string[]; brand: string; defaultSubject?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus({ kind: "sending" });
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const token = await getToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, brand, recaptchaToken: token }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(json.message || "Something went wrong. Please try again.");
      setStatus({ kind: "ok", message: json.message || "Thanks — we'll be in touch within 24 hours." });
      form.reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <>
      {SITE_KEY && <Script src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`} strategy="lazyOnload" />}
      <form onSubmit={onSubmit} noValidate aria-labelledby="contact-form-title" className="glass grid gap-4 p-6 md:p-10">
        <h3 id="contact-form-title" className="sr-only">
          Contact form
        </h3>
        {/* Honeypot */}
        <div className="hidden" aria-hidden>
          <label>
            Leave this empty <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="eyebrow">Name *</span>
            <input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Enter your full name" className="input" />
          </label>
          <label className="grid gap-2">
            <span className="eyebrow">Your Email *</span>
            <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="Enter a valid email address" className="input" />
          </label>
          <label className="grid gap-2">
            <span className="eyebrow">Enquiry Subject</span>
            <select name="subject" defaultValue={defaultSubject ?? ""} className="input appearance-none">
              <option value="" disabled className="bg-black">
                Select Option
              </option>
              {subjects.map((s) => (
                <option key={s} value={s} className="bg-black">
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="eyebrow">Project Budget</span>
            <select name="budget" defaultValue="" className="input appearance-none">
              <option value="" disabled className="bg-black">
                Select Option
              </option>
              {budgets.map((b) => (
                <option key={b} value={b} className="bg-black">
                  {b}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-2">
          <span className="eyebrow">Message</span>
          <textarea name="message" rows={5} maxLength={5000} placeholder="Tell us about your project" className="input resize-y" />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="max-w-sm text-xs text-white/40">
            {SITE_KEY ? "Protected by reCAPTCHA — Google's Privacy Policy and Terms apply." : " "}
          </p>
          <button type="submit" disabled={status.kind === "sending"} className="btn-primary disabled:opacity-60">
            {status.kind === "sending" ? "Sending…" : "Send Enquiry"} <ArrowUpRight />
          </button>
        </div>
        <p role="status" aria-live="polite" className={`text-sm ${status.kind === "error" ? "text-pink" : "text-lime"}`}>
          {status.kind === "ok" || status.kind === "error" ? status.message : ""}
        </p>
      </form>
    </>
  );
}
