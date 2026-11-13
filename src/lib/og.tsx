import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Fetch a Google Font (only the glyphs needed) for next/og.
 * Falls back to the built-in font if the network is unavailable at build time.
 */
async function loadGoogleFont(family: string, text: string, opts = "wght@700"): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:${opts}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Branded 1200×630 Open Graph image: dark background, lime accent, Bricolage Grotesque title. */
export async function renderOg({
  eyebrow,
  title,
  accent,
  brand = "CODELLER",
  tagline = "UX · Web Design · Product Design",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  brand?: string;
  tagline?: string;
}) {
  const allText = `${eyebrow.toUpperCase()}${title}${accent ?? ""}${brand}${tagline}`;
  const [display, serif] = await Promise.all([
    loadGoogleFont("Bricolage+Grotesque", allText),
    accent ? loadGoogleFont("Instrument+Serif", accent, "ital@1") : Promise.resolve(null),
  ]);
  const fonts = [
    ...(display ? [{ name: "Display", data: display, weight: 700 as const, style: "normal" as const }] : []),
    ...(serif ? [{ name: "Serif", data: serif, weight: 400 as const, style: "italic" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(37,54,222,0.55), transparent 45%), radial-gradient(circle at 88% 10%, rgba(0,212,255,0.35), transparent 40%), radial-gradient(circle at 60% 110%, rgba(221,241,96,0.35), transparent 45%)",
          color: "#f5f5f0",
          fontFamily: display ? "Display" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 6, color: "rgba(255,255,255,0.7)" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#DDF160" }} />
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, lineHeight: 1.02, letterSpacing: -2, maxWidth: 1050 }}>
          <span>{title}</span>
          {accent && (
            <span style={{ fontFamily: serif ? "Serif" : "serif", fontStyle: "italic", color: "#DDF160", marginLeft: 18, fontWeight: 400 }}>
              {accent}
            </span>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30 }}>
          <span style={{ letterSpacing: 2 }}>{brand}</span>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.6)" }}>{tagline}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
