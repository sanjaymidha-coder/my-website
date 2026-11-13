"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type Consent = { essential: true; analytics: boolean; marketing: boolean; functional: boolean };
const KEY = "cookie-consent-v2";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const CATEGORIES: { key: keyof Omit<Consent, "essential">; title: string; body: string }[] = [
  { key: "analytics", title: "Analytics", body: "Enables tracking of performance." },
  { key: "marketing", title: "Marketing", body: "Enables ads personalization and tracking." },
  { key: "functional", title: "Functional", body: "Enables ads personalization and tracking." },
];

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

/** Cookie banner + preferences. Google Analytics only loads after analytics consent. */
export function CookieBanner() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, marketing: false, functional: false });

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setConsent(stored);
      setDraft({ analytics: stored.analytics, marketing: stored.marketing, functional: stored.functional });
    } else {
      const t = setTimeout(() => setVisible(true), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const open = () => {
      setVisible(true);
      setCustomize(true);
    };
    window.addEventListener("cookie:open", open);
    return () => window.removeEventListener("cookie:open", open);
  }, []);

  const save = (c: Omit<Consent, "essential">) => {
    const value: Consent = { essential: true, ...c };
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* storage unavailable — keep in memory only */
    }
    setConsent(value);
    setVisible(false);
    setCustomize(false);
  };

  return (
    <>
      {GA_ID && consent?.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {visible && (
        <div role="dialog" aria-modal="false" aria-labelledby="cookie-title" className="fixed inset-x-4 bottom-4 z-[85] md:left-auto md:right-6 md:bottom-6 md:w-[420px]">
          <div className="glass !bg-black/70 p-6">
            <h2 id="cookie-title" className="mb-2 text-xl font-semibold">
              Cookie <em className="accent text-lime">Settings</em>
            </h2>
            <p className="text-sm text-white/65">
              We use cookies to enhance your experience, analyze site traffic and deliver personalized content.
            </p>

            {customize && (
              <ul className="mt-5 grid gap-3">
                <li className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 p-4">
                  <div>
                    <h4 className="text-sm font-semibold">Essential</h4>
                    <p className="text-xs text-white/55">Enables security and basic functionality.</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-lime">Always on</span>
                </li>
                {CATEGORIES.map((c) => (
                  <li key={c.key} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 p-4">
                    <div>
                      <h4 className="text-sm font-semibold">{c.title}</h4>
                      <p className="text-xs text-white/55">{c.body}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={draft[c.key]}
                        onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.checked }))}
                        aria-label={c.title}
                      />
                      <span className="h-6 w-11 rounded-full bg-white/15 transition peer-checked:bg-lime" />
                      <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5 peer-checked:bg-black" />
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="btn-ghost !px-4 !py-2.5 text-sm" onClick={() => save({ analytics: false, marketing: false, functional: false })}>
                Reject All
              </button>
              {customize ? (
                <button type="button" className="btn-ghost !px-4 !py-2.5 text-sm" onClick={() => save(draft)}>
                  Save Preferences
                </button>
              ) : (
                <button type="button" className="btn-ghost !px-4 !py-2.5 text-sm" onClick={() => setCustomize(true)}>
                  Customize
                </button>
              )}
              <button type="button" className="btn-primary !px-4 !py-2.5 text-sm" onClick={() => save({ analytics: true, marketing: true, functional: true })}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
