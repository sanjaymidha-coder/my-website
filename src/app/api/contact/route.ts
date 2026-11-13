import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MIN_SCORE = 0.5;
const RATE_LIMIT_MS = 60_000;
// Best-effort per-instance rate limit (serverless instances don't share memory).
const lastHit = new Map<string, number>();

interface Payload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  budget?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
  brand?: unknown;
  recaptchaToken?: unknown;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function json(status: number, success: boolean, message: string) {
  return NextResponse.json({ success, message }, { status });
}

async function verifyRecaptcha(token: string, ip: string | null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true } as const;
  if (!token) return { ok: false } as const;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", { method: "POST", body });
  const data = (await res.json()) as { success: boolean; score?: number; action?: string };
  const ok = data.success && (data.score ?? 0) >= MIN_SCORE && (!data.action || data.action === "contact");
  return { ok } as const;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  const key = ip ?? "unknown";
  const now = Date.now();
  if (process.env.NODE_ENV === "production" && now - (lastHit.get(key) ?? 0) < RATE_LIMIT_MS) {
    return json(429, false, "Too many requests. Please wait a minute and try again.");
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return json(400, false, "Invalid request.");
  }

  // Bots fill the hidden field — pretend success.
  if (str(body.website, 200)) return json(200, true, "Thanks — we'll be in touch.");

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const subject = str(body.subject, 120) || "General enquiry";
  const budget = str(body.budget, 60) || "Not specified";
  const message = str(body.message, 5000);
  const brand = str(body.brand, 20) === "deco" ? "DecoStorePros" : "Codeller";

  if (name.length < 2) return json(422, false, "Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json(422, false, "Please enter a valid email address.");

  const captcha = await verifyRecaptcha(str(body.recaptchaToken, 4000), ip).catch(() => ({ ok: false }));
  if (!captcha.ok) return json(403, false, "We couldn't verify you're human. Please refresh and try again.");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Website <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not configured");
    return json(500, false, "The contact form isn't configured yet. Please email us directly.");
  }

  lastHit.set(key, now);

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Subject", subject],
    ["Budget", budget],
  ];
  const html = `
    <h2>New ${escapeHtml(brand)} enquiry</h2>
    <table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>
    <p><b>Message</b></p><p>${escapeHtml(message || "(empty)").replace(/\n/g, "<br>")}</p>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${message || "(empty)"}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map((s) => s.trim()),
      replyTo: email,
      subject: `[${brand}] ${subject} — ${name}`,
      html,
      text,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[contact] send failed", err);
    return json(502, false, "We couldn't send your message right now. Please try again later.");
  }

  return json(200, true, "Thanks — your enquiry has been sent. We'll respond within 24 hours.");
}

export function GET() {
  return json(405, false, "Method not allowed.");
}
