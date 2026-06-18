/* Refined, page-specific hero illustrations.
   Shared visual language (ink strokes, gold accent, soft contact shadows,
   two-tone gradient fills, highlight glints) — each page keeps a distinct scene. */

const INK = "#243d35";
const GREEN = "#3f7a5f";
const GREEN_SOFT = "#bfe0cd";
const GREEN_SOFTER = "#dcefe2";
const GOLD = "#c8821e";
const GOLD_SOFT = "#f4d9a8";
const CREAM = "#fbf4e6";
const SKIN = "#e7b48c";
const HAIR = "#3a2c22";

function Svg({ label, children }) {
  return (
    <svg viewBox="0 0 440 360" role="img" aria-label={label} className="h-full w-full">
      {children}
    </svg>
  );
}

/* ---------------- About: a person presenting a clear checklist ---------------- */
export function AboutArt() {
  return (
    <Svg label="A clear, friendly guide to the site">
      <defs>
        <linearGradient id="ab-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6f2ea" />
          <stop offset="100%" stopColor="#cde6d7" />
        </linearGradient>
        <linearGradient id="ab-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f6f2" />
        </linearGradient>
      </defs>

      <circle cx="222" cy="176" r="168" fill="url(#ab-blob)" />
      <circle cx="356" cy="78" r="26" fill={CREAM} opacity="0.85" />
      <circle cx="74" cy="250" r="16" fill={GREEN_SOFT} opacity="0.7" />
      <ellipse cx="220" cy="320" rx="150" ry="18" fill={INK} opacity="0.08" />

      {/* checklist card */}
      <g className="emt-art-rise" style={{ transformOrigin: "150px 300px" }}>
        <rect x="58" y="120" width="184" height="166" rx="20" fill="url(#ab-card)" stroke={INK} strokeWidth="5" />
        <rect x="80" y="142" width="78" height="12" rx="6" fill={GREEN_SOFT} />
        {[178, 208, 238].map((y, i) => (
          <g key={y}>
            <circle cx="92" cy={y} r="11" fill={i === 1 ? GOLD : GREEN} stroke={INK} strokeWidth="4" />
            <path d={`M86 ${y}l4 4 8-8`} fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="114" y={y - 6} width={i === 1 ? 104 : 84} height="12" rx="6" fill={i === 1 ? GOLD_SOFT : "#e4ece8"} />
          </g>
        ))}
      </g>

      {/* magnifier */}
      <g className="emt-float">
        <circle cx="208" cy="206" r="34" fill="#ffffff" opacity="0.55" stroke={GOLD} strokeWidth="6" />
        <circle cx="208" cy="206" r="34" fill="none" stroke={INK} strokeWidth="2" opacity="0.25" />
        <path d="M232 230l22 22" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M232 230l22 22" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M196 196a16 16 0 0 1 16-8" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* person */}
      <g>
        <path d="M312 312v30a7 7 0 0 1-7 7h-10a7 7 0 0 1-7-7v-26Z" fill={INK} />
        <path d="M360 312v30a7 7 0 0 1-7 7h-10a7 7 0 0 1-7-7v-26Z" fill={INK} />
        <path d="M300 232c0-19 15-32 36-32s36 13 36 32v86h-72Z" fill={GREEN} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M336 200c14 0 26 8 32 21-7 4-19 7-32 7s-25-3-32-7c6-13 18-21 32-21Z" fill="#4c8d70" opacity="0.6" />
        <rect x="324" y="172" width="24" height="34" rx="10" fill={SKIN} stroke={INK} strokeWidth="5" />
        <circle cx="336" cy="150" r="31" fill={SKIN} stroke={INK} strokeWidth="5" />
        <path d="M306 147c-2-25 16-42 32-42s32 14 31 39c-10-10-19-13-31-13s-23 6-32 16Z" fill={HAIR} />
        <circle cx="328" cy="150" r="2.6" fill={INK} />
        <circle cx="346" cy="150" r="2.6" fill={INK} />
        <path d="M328 161c4 4 12 4 16 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        {/* gesturing arm */}
        <path d="M300 246c-16 6-30 10-44 8" fill="none" stroke={GREEN} strokeWidth="18" strokeLinecap="round" />
        <circle cx="256" cy="252" r="9" fill={SKIN} stroke={INK} strokeWidth="4" />
      </g>

      {/* floating heart accent */}
      <g className="emt-float" style={{ animationDelay: "0.5s" }}>
        <path d="M388 168c-4-9-18-7-18 3 0 7 12 14 18 18 6-4 18-11 18-18 0-10-14-12-18-3Z" fill={GOLD} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

/* ---------------- Calculators: a calculator device + mini chart ---------------- */
export function CalculatorsArt() {
  return (
    <Svg label="Financial calculators and charts">
      <defs>
        <linearGradient id="ca-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7f0f5" />
          <stop offset="100%" stopColor="#d4e6ef" />
        </linearGradient>
        <linearGradient id="ca-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef3f1" />
        </linearGradient>
        <linearGradient id="ca-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c4a40" />
          <stop offset="100%" stopColor="#1d3128" />
        </linearGradient>
      </defs>

      <circle cx="220" cy="178" r="168" fill="url(#ca-blob)" />
      <circle cx="354" cy="262" r="22" fill={GREEN_SOFTER} opacity="0.8" />
      <ellipse cx="220" cy="322" rx="150" ry="18" fill={INK} opacity="0.08" />

      {/* calculator */}
      <g className="emt-art-rise" style={{ transformOrigin: "164px 320px" }}>
        <rect x="92" y="96" width="148" height="216" rx="22" fill="url(#ca-body)" stroke={INK} strokeWidth="5" />
        <rect x="110" y="116" width="112" height="48" rx="10" fill="url(#ca-screen)" stroke={INK} strokeWidth="4" />
        <rect x="122" y="132" width="58" height="8" rx="4" fill={GREEN_SOFT} opacity="0.55" />
        <rect x="122" y="146" width="88" height="9" rx="4.5" fill={GOLD_SOFT} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const isAccent = r === 0 && c === 2;
            return (
              <rect
                key={`${r}-${c}`}
                x={112 + c * 38}
                y={184 + r * 38}
                width="28"
                height="28"
                rx="8"
                fill={isAccent ? GOLD : "#e7ece9"}
                stroke={INK}
                strokeWidth="3.5"
              />
            );
          })
        )}
      </g>

      {/* mini bar chart card popping out */}
      <g className="emt-float">
        <rect x="206" y="150" width="128" height="104" rx="16" fill="#ffffff" stroke={INK} strokeWidth="5" />
        <rect x="224" y="206" width="18" height="30" rx="3" fill={GREEN_SOFT} stroke={INK} strokeWidth="3" />
        <rect x="252" y="188" width="18" height="48" rx="3" fill={GREEN} stroke={INK} strokeWidth="3" />
        <rect x="280" y="170" width="18" height="66" rx="3" fill={GOLD} stroke={INK} strokeWidth="3" />
        <path className="emt-art-line" d="M226 200l28-16 28-12" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      </g>

      {/* floating coin */}
      <g className="emt-float" style={{ animationDelay: "0.6s" }}>
        <circle cx="338" cy="118" r="22" fill={GOLD_SOFT} stroke={INK} strokeWidth="5" />
        <circle cx="338" cy="118" r="13" fill="none" stroke={INK} strokeWidth="3" opacity="0.4" />
        <text x="338" y="125" textAnchor="middle" fontSize="18" fontWeight="700" fill={GOLD}>%</text>
      </g>
    </Svg>
  );
}

/* ---------------- Blog: an article page with a pen and a sparkle ---------------- */
export function BlogArt() {
  return (
    <Svg label="Short money posts and updates">
      <defs>
        <linearGradient id="bl-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3ecda" />
          <stop offset="100%" stopColor="#ece0c4" />
        </linearGradient>
        <linearGradient id="bl-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f4f7f4" />
        </linearGradient>
      </defs>

      <circle cx="220" cy="178" r="168" fill="url(#bl-blob)" />
      <circle cx="86" cy="98" r="22" fill={GREEN_SOFTER} opacity="0.85" />
      <ellipse cx="220" cy="322" rx="150" ry="18" fill={INK} opacity="0.08" />

      {/* back page */}
      <rect x="150" y="78" width="168" height="208" rx="18" fill="#eef3f0" stroke={INK} strokeWidth="4" transform="rotate(5 234 182)" opacity="0.8" />

      {/* main article page */}
      <g className="emt-art-rise" style={{ transformOrigin: "150px 290px" }}>
        <rect x="118" y="92" width="172" height="206" rx="18" fill="url(#bl-page)" stroke={INK} strokeWidth="5" />
        <rect x="140" y="116" width="58" height="34" rx="8" fill={GOLD_SOFT} stroke={INK} strokeWidth="3.5" />
        <path d="M150 133l5 5 9-10" fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="140" y="166" width="128" height="11" rx="5.5" fill="#cdd8d4" />
        <rect x="140" y="186" width="112" height="11" rx="5.5" fill="#dde5e1" />
        <rect x="140" y="214" width="128" height="9" rx="4.5" fill="#e3ebe7" />
        <rect x="140" y="230" width="118" height="9" rx="4.5" fill="#e3ebe7" />
        <rect x="140" y="246" width="96" height="9" rx="4.5" fill="#e3ebe7" />
      </g>

      {/* pen */}
      <g className="emt-float" style={{ animationDelay: "0.4s" }}>
        <path d="M286 132l78-74a12 12 0 0 1 17 17l-74 78Z" fill={GREEN} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M286 132l21 21-26 7Z" fill={GOLD_SOFT} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M281 160l-6 6" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M349 73l12 12" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* sparkle */}
      <g className="emt-float">
        <path d="M348 196c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20Z" fill={GOLD} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

/* ---------------- Guides: an open book + a path with a destination pin ---------------- */
export function GuidesArt() {
  return (
    <Svg label="Step-by-step money guides">
      <defs>
        <linearGradient id="gu-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9f1ea" />
          <stop offset="100%" stopColor="#d6e7d9" />
        </linearGradient>
        <linearGradient id="gu-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef4f0" />
        </linearGradient>
      </defs>

      <circle cx="220" cy="178" r="168" fill="url(#gu-blob)" />
      <circle cx="360" cy="92" r="24" fill={CREAM} opacity="0.85" />
      <ellipse cx="220" cy="318" rx="156" ry="20" fill={INK} opacity="0.08" />

      {/* open book */}
      <g className="emt-art-rise" style={{ transformOrigin: "220px 300px" }}>
        <path d="M70 226c44-18 80-18 150 0 70-18 106-18 150 0v34c-44-16-80-16-150 0-70-16-106-16-150 0Z" fill={GREEN} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M82 208c40-15 74-15 138 4 64-19 98-19 138-4-40 14-72 16-138 6-66 10-98 8-138-6Z" fill="url(#gu-page)" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M220 218v40" stroke={INK} strokeWidth="4" opacity="0.45" />
        <path d="M108 200c24-7 50-7 86 2M226 202c36-9 62-9 86-2" fill="none" stroke="#cdd8d4" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* dotted path rising to a pin */}
      <path d="M150 196C150 150 226 156 226 120s64-30 80-58" fill="none" stroke={GOLD} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="2 14" />
      <circle cx="150" cy="196" r="7" fill="#ffffff" stroke={INK} strokeWidth="4" />

      {/* destination pin */}
      <g className="emt-float">
        <path d="M306 36c18 0 32 14 32 31 0 22-32 49-32 49s-32-27-32-49c0-17 14-31 32-31Z" fill={GOLD} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <circle cx="306" cy="66" r="12" fill="#ffffff" stroke={INK} strokeWidth="4" />
      </g>

      {/* small compass accent */}
      <g className="emt-float" style={{ animationDelay: "0.5s" }}>
        <circle cx="96" cy="150" r="22" fill="#ffffff" stroke={INK} strokeWidth="5" />
        <path d="M96 138l6 14-6 6-6-6Z" fill={GOLD} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="96" cy="150" r="3" fill={INK} />
      </g>
    </Svg>
  );
}

/* ---------------- Compare: a balance scale weighing two options ---------------- */
export function CompareArt() {
  return (
    <Svg label="Side-by-side money comparisons">
      <defs>
        <linearGradient id="cp-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7f0f5" />
          <stop offset="100%" stopColor="#d3e4ee" />
        </linearGradient>
        <linearGradient id="cp-pan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef3f1" />
        </linearGradient>
      </defs>

      <circle cx="220" cy="178" r="168" fill="url(#cp-blob)" />
      <circle cx="80" cy="110" r="22" fill={GREEN_SOFTER} opacity="0.85" />
      <circle cx="360" cy="252" r="18" fill={CREAM} opacity="0.85" />
      <ellipse cx="220" cy="320" rx="120" ry="18" fill={INK} opacity="0.08" />

      {/* stand */}
      <rect x="210" y="92" width="20" height="206" rx="8" fill={GREEN} stroke={INK} strokeWidth="5" />
      <path d="M176 300h88l-12-14h-64Z" fill={GREEN} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="220" cy="92" r="12" fill={GOLD} stroke={INK} strokeWidth="5" />

      {/* beam (slight tilt) */}
      <g transform="rotate(-5 220 100)">
        <rect x="96" y="94" width="248" height="12" rx="6" fill={INK} />
        {/* left pan: house */}
        <path d="M120 106v18" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M86 168a34 18 0 0 0 68 0Z" fill="url(#cp-pan)" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M120 124l-18 18M120 124l18 18" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <g transform="translate(120 150)">
          <path d="M-16 4 0-12 16 4v14a3 3 0 0 1-3 3h-26a3 3 0 0 1-3-3Z" fill={GREEN_SOFT} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <rect x="-5" y="6" width="10" height="15" rx="2" fill={GOLD_SOFT} stroke={INK} strokeWidth="3" />
        </g>
        {/* right pan: coins */}
        <path d="M320 106v18" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M286 168a34 18 0 0 0 68 0Z" fill="url(#cp-pan)" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M320 124l-18 18M320 124l18 18" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <g transform="translate(320 150)">
          <ellipse cx="0" cy="14" rx="26" ry="9" fill={GOLD_SOFT} stroke={INK} strokeWidth="4" />
          <ellipse cx="0" cy="4" rx="26" ry="9" fill={CREAM} stroke={INK} strokeWidth="4" />
          <ellipse cx="0" cy="-6" rx="26" ry="9" fill={GOLD_SOFT} stroke={INK} strokeWidth="4" />
          <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="700" fill={GOLD}>$</text>
        </g>
      </g>

      {/* vs badge */}
      <g className="emt-float">
        <circle cx="220" cy="206" r="24" fill="#ffffff" stroke={GOLD} strokeWidth="5" />
        <text x="220" y="213" textAnchor="middle" fontSize="17" fontWeight="700" fill={INK}>vs</text>
      </g>
    </Svg>
  );
}

/* ---------------- Contact: an envelope with a paper plane and message bubble ---------------- */
export function ContactArt() {
  return (
    <Svg label="Send feedback and questions">
      <defs>
        <linearGradient id="co-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6f2ea" />
          <stop offset="100%" stopColor="#cde6d7" />
        </linearGradient>
        <linearGradient id="co-env" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef3f1" />
        </linearGradient>
      </defs>

      <circle cx="220" cy="178" r="168" fill="url(#co-blob)" />
      <circle cx="356" cy="96" r="24" fill={CREAM} opacity="0.85" />
      <ellipse cx="220" cy="320" rx="140" ry="18" fill={INK} opacity="0.08" />

      {/* envelope */}
      <g className="emt-art-rise" style={{ transformOrigin: "180px 300px" }}>
        <rect x="84" y="138" width="200" height="146" rx="18" fill="url(#co-env)" stroke={INK} strokeWidth="5" />
        {/* letter peeking */}
        <rect x="104" y="118" width="160" height="100" rx="10" fill="#ffffff" stroke={INK} strokeWidth="4" />
        <rect x="124" y="140" width="86" height="9" rx="4.5" fill={GOLD_SOFT} />
        <rect x="124" y="160" width="120" height="8" rx="4" fill="#dbe4df" />
        <rect x="124" y="176" width="104" height="8" rx="4" fill="#dbe4df" />
        {/* front flap */}
        <path d="M84 156l100 70 100-70v122a6 6 0 0 1-6 6H90a6 6 0 0 1-6-6Z" fill="url(#co-env)" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M84 156l100 70 100-70" fill="none" stroke={INK} strokeWidth="4" opacity="0.3" />
        <path d="M84 284l72-58M284 284l-72-58" stroke={INK} strokeWidth="4" opacity="0.25" strokeLinecap="round" />
      </g>

      {/* paper plane */}
      <g className="emt-float" style={{ animationDelay: "0.3s" }}>
        <path d="M300 92l64 22-36 14-6 30-16-26-22 6Z" fill="#ffffff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M364 114l-36 14-6 30" fill="none" stroke={INK} strokeWidth="4" opacity="0.4" strokeLinejoin="round" />
        <path d="M328 128l36-14" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M252 150c14-8 30-10 44-6" fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 12" />
      </g>

      {/* message bubble */}
      <g className="emt-float">
        <path d="M338 196a26 22 0 0 1 0 44h-30l-14 14v-18a22 22 0 0 1-4-40 26 22 0 0 1 48 0Z" fill={GOLD} stroke={INK} strokeWidth="5" strokeLinejoin="round" transform="translate(-2 0)" />
        <circle cx="312" cy="218" r="3.6" fill="#ffffff" />
        <circle cx="326" cy="218" r="3.6" fill="#ffffff" />
        <circle cx="340" cy="218" r="3.6" fill="#ffffff" />
      </g>
    </Svg>
  );
}
