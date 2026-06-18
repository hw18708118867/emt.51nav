/* NerdWallet-style friendly spot illustrations: rounded, filled, multi-tone. */

const palette = {
  ink: "#243d35",
  green: "#3f7a5f",
  greenSoft: "#bfe0cd",
  greenSofter: "#dcefe2",
  gold: "#c8821e",
  goldSoft: "#f4d9a8",
  cream: "#fbf4e6",
  white: "#ffffff",
  line: "#243d35"
};

function Frame({ children, label, id }) {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className="h-full w-full">
      <defs>
        <linearGradient id={`${id}-mint`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6f2ea" />
          <stop offset="100%" stopColor="#cfe7d8" />
        </linearGradient>
        <linearGradient id={`${id}-cream`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf4e6" />
          <stop offset="100%" stopColor="#f1e3c6" />
        </linearGradient>
        <linearGradient id={`${id}-white`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef4f0" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0992c" />
          <stop offset="100%" stopColor="#c8821e" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
}

export function MortgageArt() {
  const id = "sa-mortgage";
  return (
    <Frame label="House and mortgage" id={id}>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-mint)`} />
      <ellipse cx="100" cy="168" rx="62" ry="9" fill={palette.ink} opacity="0.08" />
      <path d="M52 96 100 58l48 38v52a6 6 0 0 1-6 6H58a6 6 0 0 1-6-6Z" fill={`url(#${id}-white)`} stroke={palette.line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M44 100 100 56l56 44" fill="none" stroke={palette.line} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 58 148 96v6L100 64 52 102v-6Z" fill={palette.greenSoft} opacity="0.6" />
      <rect x="88" y="118" width="24" height="30" rx="3" fill={`url(#${id}-gold)`} stroke={palette.line} strokeWidth="4" />
      <circle cx="106" cy="134" r="2.4" fill={palette.line} />
      <rect x="116" y="112" width="18" height="16" rx="3" fill={palette.greenSoft} stroke={palette.line} strokeWidth="4" />
      <path d="M118 116l14 8" stroke={palette.white} strokeWidth="2" opacity="0.7" />
      <g className="emt-pulse">
        <circle cx="128" cy="64" r="12" fill={`url(#${id}-gold)`} stroke={palette.line} strokeWidth="4" />
        <path d="M124 64h8M128 60v8" stroke={palette.white} strokeWidth="3" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

export function DebtArt() {
  const id = "sa-debt";
  return (
    <Frame label="Credit cards and debt" id={id}>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-cream)`} />
      <ellipse cx="100" cy="160" rx="58" ry="9" fill={palette.ink} opacity="0.08" />
      <rect x="48" y="84" width="92" height="58" rx="10" fill={palette.green} stroke={palette.line} strokeWidth="5" transform="rotate(-8 94 113)" />
      <rect x="60" y="70" width="92" height="58" rx="10" fill={`url(#${id}-white)`} stroke={palette.line} strokeWidth="5" transform="rotate(6 106 99)" />
      <rect x="68" y="84" width="92" height="12" rx="2" fill={`url(#${id}-gold)`} transform="rotate(6 114 90)" />
      <rect x="70" y="108" width="40" height="6" rx="3" fill="#cdd8d4" transform="rotate(6 90 111)" />
      <circle cx="140" cy="118" r="9" fill={palette.goldSoft} stroke={palette.line} strokeWidth="3" transform="rotate(6 140 118)" />
      <path className="emt-twinkle" d="M70 60l4 10" stroke={palette.gold} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </Frame>
  );
}

export function InvestingArt() {
  const id = "sa-invest";
  return (
    <Frame label="Investing growth" id={id}>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-mint)`} />
      <ellipse cx="100" cy="162" rx="58" ry="9" fill={palette.ink} opacity="0.08" />
      <rect x="54" y="120" width="20" height="34" rx="4" fill={palette.greenSoft} stroke={palette.line} strokeWidth="4" />
      <rect x="86" y="100" width="20" height="54" rx="4" fill={palette.green} stroke={palette.line} strokeWidth="4" />
      <rect x="118" y="78" width="20" height="76" rx="4" fill={`url(#${id}-gold)`} stroke={palette.line} strokeWidth="4" />
      <path d="M54 96 92 74l24 12 36-34" fill="none" stroke={palette.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path className="emt-pulse" d="M138 52h16v16" fill="none" stroke={palette.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="emt-twinkle" cx="92" cy="74" r="5" fill={palette.white} stroke={palette.ink} strokeWidth="3" />
      <circle className="emt-twinkle" style={{ animationDelay: "0.6s" }} cx="116" cy="86" r="5" fill={palette.white} stroke={palette.ink} strokeWidth="3" />
    </Frame>
  );
}

export function RetirementArt() {
  const id = "sa-retire";
  return (
    <Frame label="Retirement planning" id={id}>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-mint)`} />
      <ellipse cx="100" cy="164" rx="52" ry="8" fill={palette.ink} opacity="0.08" />
      <circle cx="100" cy="100" r="50" fill={`url(#${id}-white)`} stroke={palette.line} strokeWidth="5" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="#cdd8d4" strokeWidth="2" />
      <path className="emt-spin" style={{ transformBox: "view-box", transformOrigin: "100px 100px" }} d="M100 70v32l22 14" fill="none" stroke={palette.line} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="6" fill={palette.gold} stroke={palette.line} strokeWidth="2" />
      <path d="M100 38v10M100 152v10M38 100h10M152 100h10" stroke={palette.green} strokeWidth="5" strokeLinecap="round" />
    </Frame>
  );
}

export function SavingsArt() {
  const id = "sa-savings";
  return (
    <Frame label="Savings" id={id}>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-cream)`} />
      <ellipse cx="104" cy="160" rx="56" ry="9" fill={palette.ink} opacity="0.08" />
      <path d="M62 108c0-22 19-38 44-38 26 0 48 14 48 36 0 10-5 19-13 26v14h-17v-9a54 54 0 0 1-36 0v9H74v-14c-7-6-12-14-12-24Z" fill={palette.green} stroke={palette.line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M70 84c8-9 22-14 36-14" fill="none" stroke="#4c8d70" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <circle cx="84" cy="104" r="6" fill={palette.white} />
      <circle cx="84" cy="104" r="2.4" fill={palette.ink} />
      <path d="M150 96c8-2 12-9 11-17" fill="none" stroke={palette.line} strokeWidth="5" strokeLinecap="round" />
      <rect className="emt-float" x="92" y="56" width="34" height="14" rx="7" fill={`url(#${id}-gold)`} stroke={palette.line} strokeWidth="4" />
      <path d="M120 84h14" stroke={palette.white} strokeWidth="5" strokeLinecap="round" />
    </Frame>
  );
}

export function BudgetArt() {
  const id = "sa-budget";
  return (
    <Frame label="Budgeting" id={id}>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-mint)`} />
      <ellipse cx="100" cy="160" rx="52" ry="8" fill={palette.ink} opacity="0.08" />
      <circle cx="100" cy="100" r="52" fill={`url(#${id}-white)`} stroke={palette.line} strokeWidth="5" />
      <path d="M100 100 100 48a52 52 0 0 1 45 26Z" fill={palette.goldSoft} stroke={palette.line} strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 100 145 74a52 52 0 0 1-15 70Z" fill={palette.greenSoft} stroke={palette.line} strokeWidth="4" strokeLinejoin="round" />
      <circle className="emt-pulse" cx="100" cy="100" r="12" fill={`url(#${id}-gold)`} stroke={palette.line} strokeWidth="4" />
      <circle cx="100" cy="100" r="4" fill={palette.white} opacity="0.7" />
    </Frame>
  );
}

export function IncomeTaxArt() {
  const id = "sa-incometax";
  return (
    <Frame label="Income and taxes" id={id}>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-cream)`} />
      <ellipse cx="100" cy="162" rx="56" ry="9" fill={palette.ink} opacity="0.08" />
      {/* tax document */}
      <rect x="54" y="52" width="74" height="100" rx="9" fill={`url(#${id}-white)`} stroke={palette.line} strokeWidth="5" />
      <rect x="66" y="68" width="42" height="8" rx="4" fill={palette.greenSoft} />
      <rect x="66" y="86" width="50" height="6" rx="3" fill="#cdd8d4" />
      <rect x="66" y="100" width="50" height="6" rx="3" fill="#cdd8d4" />
      <rect x="66" y="114" width="34" height="6" rx="3" fill="#cdd8d4" />
      {/* coin */}
      <g className="emt-float">
        <circle cx="118" cy="138" r="16" fill={`url(#${id}-gold)`} stroke={palette.line} strokeWidth="4" />
        <text x="118" y="144" textAnchor="middle" fontSize="15" fontWeight="700" fill={palette.white}>$</text>
      </g>
      {/* % badge */}
      <g className="emt-pulse">
        <circle cx="138" cy="68" r="17" fill="#ffffff" stroke={palette.gold} strokeWidth="4" />
        <text x="138" y="74" textAnchor="middle" fontSize="15" fontWeight="700" fill={palette.ink}>%</text>
      </g>
    </Frame>
  );
}

const categoryArt = {
  Mortgage: MortgageArt,
  Debt: DebtArt,
  "Income & Tax": IncomeTaxArt,
  Investing: InvestingArt,
  Retirement: RetirementArt,
  Savings: SavingsArt,
  Budgeting: BudgetArt
};

export function CategoryArt({ category }) {
  const Art = categoryArt[category] || BudgetArt;
  return <Art />;
}

/* Large hero illustration: a friendly person presenting a growth dashboard. */
export function HeroArt() {
  const ink = "#243d35";
  const skin = "#e7b48c";
  const hair = "#3a2c22";
  const shirt = "#3f7a5f";

  return (
    <svg viewBox="0 0 440 380" role="img" aria-label="Person reviewing growing savings" className="h-full w-full">
      <defs>
        <linearGradient id="heroBlob" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#dcefe2" />
          <stop offset="100%" stopColor="#cfe9d8" />
        </linearGradient>
      </defs>

      <circle cx="220" cy="190" r="176" fill="url(#heroBlob)" />

      {/* Person (behind the card) */}
      <g>
        {/* legs / seat */}
        <path d="M300 300v34a8 8 0 0 1-8 8h-12a8 8 0 0 1-8-8v-30Z" fill={ink} />
        <path d="M356 300v34a8 8 0 0 1-8 8h-12a8 8 0 0 1-8-8v-30Z" fill={ink} />
        {/* torso */}
        <path d="M286 214c0-20 16-34 38-34s38 14 38 34v92h-76Z" fill={shirt} stroke={ink} strokeWidth="5" strokeLinejoin="round" />
        {/* neck */}
        <rect x="312" y="158" width="24" height="34" rx="10" fill={skin} stroke={ink} strokeWidth="5" />
        {/* head */}
        <circle cx="324" cy="138" r="32" fill={skin} stroke={ink} strokeWidth="5" />
        {/* hair */}
        <path d="M293 134c-2-26 16-44 33-44s33 14 32 40c-10-10-20-13-33-13s-23 6-32 17Z" fill={hair} />
        {/* face */}
        <circle cx="316" cy="138" r="2.6" fill={ink} />
        <circle cx="334" cy="138" r="2.6" fill={ink} />
        <path d="M316 150c4 4 12 4 16 0" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Chart card (in front of torso) */}
      <g className="emt-art-rise" style={{ transformOrigin: "150px 280px" }}>
        <rect x="40" y="176" width="206" height="150" rx="18" fill="#ffffff" stroke={ink} strokeWidth="5" />
        <rect x="62" y="270" width="22" height="40" rx="4" fill="#bfe0cd" stroke={ink} strokeWidth="4" />
        <rect x="98" y="248" width="22" height="62" rx="4" fill={shirt} stroke={ink} strokeWidth="4" />
        <rect x="134" y="222" width="22" height="88" rx="4" fill="#f4d9a8" stroke={ink} strokeWidth="4" />
        <rect x="170" y="198" width="22" height="112" rx="4" fill="#c8821e" stroke={ink} strokeWidth="4" />
        <path className="emt-art-line" d="M62 240 109 214l36 12 47-30" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      </g>

      {/* Arm resting on the card, pointing to the chart */}
      <path d="M286 232c-18 4-40 6-58 4" fill="none" stroke={shirt} strokeWidth="20" strokeLinecap="round" />
      <path d="M286 232c-18 4-40 6-58 4" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" opacity="0.18" />
      <circle cx="226" cy="236" r="9" fill={skin} stroke={ink} strokeWidth="4" />

      {/* Coins */}
      <g className="emt-float">
        <ellipse cx="356" cy="252" rx="40" ry="14" fill="#f4d9a8" stroke={ink} strokeWidth="5" />
        <ellipse cx="356" cy="238" rx="40" ry="14" fill="#fbf4e6" stroke={ink} strokeWidth="5" />
        <ellipse cx="356" cy="224" rx="40" ry="14" fill="#f4d9a8" stroke={ink} strokeWidth="5" />
        <text x="356" y="230" textAnchor="middle" fontSize="18" fontWeight="700" fill="#c8821e">$</text>
      </g>

      {/* Floating accent dot */}
      <circle className="emt-float" cx="96" cy="120" r="16" fill="#c8821e" stroke={ink} strokeWidth="5" style={{ animationDelay: "0.6s" }} />
      <path d="M90 120h12M96 114v12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
