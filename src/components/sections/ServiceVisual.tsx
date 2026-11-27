import type { ServiceSlug } from "@/data/servicePages";

/**
 * Small decorative illustration per service, layered over the hero image.
 * Pure SVG so it stays crisp and themable with the service colour.
 */
export function ServiceVisual({ slug, color }: { slug: ServiceSlug; color: string }) {
  const common = { viewBox: "0 0 320 220", className: "h-full w-full", "aria-hidden": true as const, fill: "none" };
  const lime = "#DDF160";

  if (slug === "web-design")
    return (
      <svg {...common}>
        {/* Browser window with a wireframed page */}
        <rect x="10" y="10" width="300" height="200" rx="16" fill="#0b0b0b" stroke="rgba(255,255,255,.15)" />
        <circle cx="32" cy="30" r="5" fill="#ff5f57" />
        <circle cx="48" cy="30" r="5" fill="#febc2e" />
        <circle cx="64" cy="30" r="5" fill="#28c840" />
        <rect x="88" y="23" width="140" height="14" rx="7" fill="rgba(255,255,255,.08)" />
        <line x1="10" y1="48" x2="310" y2="48" stroke="rgba(255,255,255,.1)" />
        <rect x="30" y="66" width="130" height="14" rx="4" fill="#fff" opacity=".9" />
        <rect x="30" y="88" width="100" height="14" rx="4" fill={lime} />
        <rect x="30" y="114" width="120" height="6" rx="3" fill="rgba(255,255,255,.3)" />
        <rect x="30" y="126" width="96" height="6" rx="3" fill="rgba(255,255,255,.3)" />
        <rect x="30" y="146" width="62" height="20" rx="10" fill={lime} />
        <rect x="180" y="64" width="110" height="104" rx="10" fill={color} opacity=".85" />
        <path d="M196 150l22-28 16 18 12-12 28 22z" fill="rgba(255,255,255,.35)" />
        <circle cx="262" cy="88" r="9" fill="rgba(255,255,255,.5)" />
        <rect x="30" y="180" width="80" height="16" rx="6" fill="rgba(255,255,255,.06)" />
        <rect x="120" y="180" width="80" height="16" rx="6" fill="rgba(255,255,255,.06)" />
        <rect x="210" y="180" width="80" height="16" rx="6" fill="rgba(255,255,255,.06)" />
      </svg>
    );

  if (slug === "logo-design")
    return (
      <svg {...common}>
        {/* Logo construction grid */}
        <rect x="10" y="10" width="300" height="200" rx="16" fill="#0b0b0b" stroke="rgba(255,255,255,.15)" />
        {[50, 90, 130, 170].map((y) => (
          <line key={`h${y}`} x1="10" y1={y} x2="310" y2={y} stroke="rgba(255,255,255,.06)" />
        ))}
        {[70, 120, 160, 200, 250].map((x) => (
          <line key={`v${x}`} x1={x} y1="10" x2={x} y2="210" stroke="rgba(255,255,255,.06)" />
        ))}
        <circle cx="160" cy="110" r="70" stroke="rgba(255,255,255,.18)" strokeDasharray="4 6" />
        <circle cx="134" cy="110" r="44" stroke={lime} strokeWidth="1.2" opacity=".7" />
        <circle cx="186" cy="110" r="44" stroke={lime} strokeWidth="1.2" opacity=".7" />
        <path d="M160 76a44 44 0 0 1 0 68a44 44 0 0 1 0-68z" fill={color} />
        <circle cx="134" cy="110" r="3" fill="#fff" />
        <circle cx="186" cy="110" r="3" fill="#fff" />
        <line x1="90" y1="110" x2="230" y2="110" stroke="rgba(255,255,255,.25)" />
        <line x1="160" y1="40" x2="160" y2="180" stroke="rgba(255,255,255,.25)" />
        {/* Swatches */}
        <rect x="236" y="168" width="18" height="18" rx="4" fill={color} />
        <rect x="258" y="168" width="18" height="18" rx="4" fill={lime} />
        <rect x="280" y="168" width="18" height="18" rx="4" fill="#fff" />
        <text x="26" y="190" fill="rgba(255,255,255,.55)" fontFamily="monospace" fontSize="10">Aa — Display / Serif</text>
      </svg>
    );

  if (slug === "seo")
    return (
      <svg {...common}>
        {/* Search bar + rising ranking chart */}
        <rect x="10" y="10" width="300" height="200" rx="16" fill="#0b0b0b" stroke="rgba(255,255,255,.15)" />
        <rect x="30" y="28" width="260" height="30" rx="15" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.15)" />
        <circle cx="50" cy="43" r="7" stroke={lime} strokeWidth="2" />
        <line x1="55" y1="48" x2="60" y2="53" stroke={lime} strokeWidth="2" strokeLinecap="round" />
        <rect x="70" y="39" width="120" height="8" rx="4" fill="rgba(255,255,255,.35)" />
        <text x="30" y="84" fill={lime} fontFamily="monospace" fontSize="10">#1</text>
        <rect x="52" y="76" width="140" height="8" rx="4" fill="#fff" opacity=".85" />
        <rect x="52" y="90" width="100" height="5" rx="2.5" fill="rgba(255,255,255,.3)" />
        {[60, 100, 140, 180].map((y) => (
          <line key={y} x1="30" y1={y + 50} x2="290" y2={y + 50} stroke="rgba(255,255,255,.05)" />
        ))}
        <path d="M30 196 L80 184 L120 188 L160 166 L200 150 L240 128 L290 108 L290 200 L30 200 Z" fill={color} opacity=".45" />
        <path d="M30 196 L80 184 L120 188 L160 166 L200 150 L240 128 L290 108" stroke={lime} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="290" cy="108" r="5" fill={lime} />
        <text x="232" y="100" fill="#fff" fontFamily="monospace" fontSize="10">+ traffic</text>
      </svg>
    );

  return (
    <svg {...common}>
      {/* Campaign funnel + channel bars */}
      <rect x="10" y="10" width="300" height="200" rx="16" fill="#0b0b0b" stroke="rgba(255,255,255,.15)" />
      <path d="M30 40 H170 L150 80 H50 Z" fill={color} opacity=".95" />
      <path d="M50 88 H150 L134 124 H66 Z" fill={color} opacity=".7" />
      <path d="M66 132 H134 L120 166 H80 Z" fill={color} opacity=".5" />
      <rect x="82" y="174" width="36" height="20" rx="4" fill={lime} />
      <text x="88" y="64" fill="#fff" fontFamily="monospace" fontSize="10">Reach</text>
      <text x="82" y="110" fill="#fff" fontFamily="monospace" fontSize="10">Clicks</text>
      <text x="85" y="153" fill="#fff" fontFamily="monospace" fontSize="10">Leads</text>
      {[
        { y: 52, w: 90, label: "Search" },
        { y: 96, w: 70, label: "Social" },
        { y: 140, w: 56, label: "Email" },
      ].map((b) => (
        <g key={b.label}>
          <text x="194" y={b.y - 6} fill="rgba(255,255,255,.55)" fontFamily="monospace" fontSize="9">
            {b.label}
          </text>
          <rect x="194" y={b.y} width="96" height="10" rx="5" fill="rgba(255,255,255,.08)" />
          <rect x="194" y={b.y} width={b.w} height="10" rx="5" fill={lime} />
        </g>
      ))}
      <text x="194" y="190" fill="#fff" fontFamily="monospace" fontSize="11">ROI ↑</text>
    </svg>
  );
}
