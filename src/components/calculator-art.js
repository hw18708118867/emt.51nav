/* Per-calculator spot illustrations.
   Each slug gets its own scene; unknown slugs fall back to the category art.
   Shared language: ink strokes, gold accent, gradient fills, soft contact shadow. */
import { CategoryArt } from "@/components/spot-art";

const P = {
  ink: "#243d35",
  green: "#3f7a5f",
  greenSoft: "#bfe0cd",
  greenSofter: "#dcefe2",
  gold: "#c8821e",
  goldSoft: "#f4d9a8",
  cream: "#fbf4e6",
  white: "#ffffff"
};

function Frame({ id, label, children }) {
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
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7f0f5" />
          <stop offset="100%" stopColor="#d4e6ef" />
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

function Backdrop({ id, tone = "mint", shadow = true }) {
  return (
    <>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-${tone})`} />
      {shadow ? <ellipse cx="100" cy="166" rx="60" ry="9" fill={P.ink} opacity="0.08" /> : null}
    </>
  );
}

function House({ id }) {
  return (
    <g>
      <path d="M70 100 100 66 130 100v46a4 4 0 0 1-4 4H74a4 4 0 0 1-4-4Z" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M62 104 100 62 138 104" fill="none" stroke={P.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 62 138 104v5L100 68 62 109v-5Z" fill={P.greenSoft} opacity="0.55" />
      <rect x="90" y="120" width="20" height="30" rx="2" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="3.5" />
      <circle cx="105" cy="135" r="1.8" fill={P.ink} />
    </g>
  );
}

function Coin({ id, cx, cy, r = 14, label = "$" }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
      <text x={cx} y={cy + r * 0.34} textAnchor="middle" fontSize={r * 0.95} fontWeight="700" fill="#fff">{label}</text>
    </g>
  );
}

/* 1. Mortgage amortization — balance falling over time */
function MortgageAmortizationArt() {
  const id = "ca-amort";
  return (
    <Frame id={id} label="Mortgage amortization schedule">
      <Backdrop id={id} tone="mint" />
      {[[52, 96], [76, 110], [100, 122], [124, 132], [148, 140]].map(([x, y], i) => (
        <rect key={x} x={x - 9} y={y} width="18" height={150 - y} rx="3" fill={i === 4 ? `url(#${id}-gold)` : P.greenSoft} stroke={P.ink} strokeWidth="3.5" />
      ))}
      <path d="M52 92 76 106l24 12 24 10 24 8" fill="none" stroke={P.gold} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="emt-float">
        <g transform="translate(58 -2) scale(0.46)">
          <House id={id} />
        </g>
      </g>
    </Frame>
  );
}

/* 2. Refinance — swap to a lower rate */
function RefinanceArt() {
  const id = "ca-refi";
  return (
    <Frame id={id} label="Refinance to a lower rate">
      <Backdrop id={id} tone="mint" />
      <g transform="translate(0 6)">
        <House id={id} />
      </g>
      <g className="emt-spin">
        <path d="M58 70a48 48 0 0 1 78-14" fill="none" stroke={P.gold} strokeWidth="5" strokeLinecap="round" />
        <path d="M132 44l8 14-16 2Z" fill={P.gold} stroke={P.ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M142 132a48 48 0 0 1-78 14" fill="none" stroke={P.green} strokeWidth="5" strokeLinecap="round" />
        <path d="M68 158l-8-14 16-2Z" fill={P.green} stroke={P.ink} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <g className="emt-pulse">
        <circle cx="150" cy="64" r="17" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
        <text x="150" y="70" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">%</text>
        <path d="M150 78v8M145 82l5 4 5-4" fill="none" stroke={P.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

/* 3. Home affordability — a budget gauge under a house */
function HomeAffordabilityArt() {
  const id = "ca-afford";
  return (
    <Frame id={id} label="How much house you can afford">
      <Backdrop id={id} tone="mint" />
      <path d="M48 138a52 52 0 0 1 104 0" fill="none" stroke="#cdd8d4" strokeWidth="10" strokeLinecap="round" />
      <path d="M48 138a52 52 0 0 1 70-49" fill="none" stroke={P.gold} strokeWidth="10" strokeLinecap="round" />
      <circle cx="100" cy="138" r="7" fill={P.ink} />
      <path className="emt-sway" style={{ transformOrigin: "0% 100%" }} d="M100 138 124 104" stroke={P.ink} strokeWidth="5" strokeLinecap="round" />
      <g className="emt-float">
        <g transform="translate(0 -34) scale(0.62)" style={{ transformOrigin: "100px 100px" }}>
          <House id={id} />
        </g>
      </g>
    </Frame>
  );
}

/* 4. Rent vs buy — house and a rental sign side by side */
function RentVsBuyArt() {
  const id = "ca-rentbuy";
  return (
    <Frame id={id} label="Rent versus buy">
      <Backdrop id={id} tone="sky" />
      <g transform="translate(-30 8) scale(0.82)">
        <House id={id} />
      </g>
      {/* rental sign */}
      <g className="emt-float" style={{ animationDelay: "0.4s" }}>
        <g transform="translate(118 0)">
          <rect x="6" y="92" width="6" height="58" rx="3" fill={P.ink} />
          <rect x="-14" y="64" width="48" height="34" rx="6" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="4" />
          <rect x="-6" y="74" width="32" height="5" rx="2.5" fill={P.green} />
          <rect x="-6" y="84" width="22" height="5" rx="2.5" fill="#cdd8d4" />
        </g>
      </g>
      <g className="emt-pulse">
        <circle cx="100" cy="150" r="17" fill="#ffffff" stroke={P.gold} strokeWidth="4" />
        <text x="100" y="156" textAnchor="middle" fontSize="13" fontWeight="700" fill={P.ink}>vs</text>
      </g>
    </Frame>
  );
}

/* 5. Extra payment — pay down faster */
function ExtraPaymentArt() {
  const id = "ca-extra";
  return (
    <Frame id={id} label="Extra mortgage payments">
      <Backdrop id={id} tone="mint" />
      <g transform="translate(-6 6) scale(0.9)">
        <House id={id} />
      </g>
      {/* fast-forward chevrons */}
      <path className="emt-pulse" d="M140 70l18 16-18 16M158 70l18 16-18 16" fill="none" stroke={P.gold} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <g className="emt-float">
        <Coin id={id} cx="150" cy="140" r="15" />
      </g>
      <path d="M150 116v10M145 121l5 5 5-5" fill="none" stroke={P.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* 6. Mortgage (base) — house with a coin and sun */
function MortgageBaseArt() {
  const id = "ca-mort";
  return (
    <Frame id={id} label="Mortgage payment">
      <Backdrop id={id} tone="mint" />
      <circle cx="146" cy="62" r="13" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
      <path className="emt-spin" d="M146 40v8M146 76v8M124 62h8M160 62h8M131 47l6 6M161 71l-6-6" stroke={P.gold} strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(-6 8)">
        <House id={id} />
      </g>
      <g className="emt-float">
        <Coin id={id} cx="60" cy="150" r="15" />
      </g>
    </Frame>
  );
}

/* 7. Compound interest — growing coin stacks with an upward curve */
function CompoundInterestArt() {
  const id = "ca-compound";
  return (
    <Frame id={id} label="Compound interest growth">
      <Backdrop id={id} tone="mint" />
      {[[58, 132, 3], [92, 116, 4], [132, 90, 6]].map(([cx, top, n], s) => (
        <g key={cx}>
          {Array.from({ length: n }).map((_, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={150 - i * 11}
              rx="20"
              ry="8"
              fill={i % 2 ? P.cream : P.goldSoft}
              stroke={P.ink}
              strokeWidth="3.5"
            />
          ))}
        </g>
      ))}
      <path d="M50 128 92 104l40-34" fill="none" stroke={P.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M118 64h18v18" fill="none" stroke={P.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path className="emt-twinkle" d="M150 58c1 8 3 10 11 11-8 1-10 3-11 11-1-8-3-10-11-11 8-1 10-3 11-11Z" fill={P.gold} stroke={P.ink} strokeWidth="2.6" strokeLinejoin="round" />
    </Frame>
  );
}

/* 8. Inflation — a dollar balloon drifting up, prices rising */
function InflationArt() {
  const id = "ca-inflation";
  return (
    <Frame id={id} label="Inflation over time">
      <Backdrop id={id} tone="cream" />
      <path d="M100 96c8 0 16 12 16 28s-8 30-16 30-16-14-16-30 8-28 16-28Z" fill="none" />
      <g className="emt-float">
        <ellipse cx="108" cy="78" rx="30" ry="34" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="5" />
        <text x="108" y="86" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff">$</text>
      </g>
      <path d="M108 112c0 14-10 16-10 28" fill="none" stroke={P.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 150l16-16 14 10 18-22" fill="none" stroke={P.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path className="emt-twinkle" d="M86 116l8-8 8 8" fill="none" stroke={P.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* 9. Loan — a banknote, coins and a repayment cycle arrow */
function LoanArt() {
  const id = "ca-loan";
  return (
    <Frame id={id} label="Loan amount and payments">
      <Backdrop id={id} tone="cream" />
      <rect x="50" y="84" width="100" height="56" rx="10" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <g className="emt-pulse">
        <circle cx="100" cy="112" r="15" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
        <text x="100" y="118" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">$</text>
      </g>
      <circle cx="64" cy="98" r="3.4" fill={P.green} />
      <circle cx="136" cy="126" r="3.4" fill={P.green} />
      <path d="M64 150a44 44 0 0 1 72-12" fill="none" stroke={P.gold} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="2 11" />
      <path d="M132 124l6 14 14-7Z" fill={P.gold} stroke={P.ink} strokeWidth="2.6" strokeLinejoin="round" />
    </Frame>
  );
}

/* 10. Retirement — a golden nest egg with a rising sun */
function RetirementCalcArt() {
  const id = "ca-retire";
  return (
    <Frame id={id} label="Retirement nest egg">
      <Backdrop id={id} tone="sky" />
      <path d="M58 90a42 42 0 0 0 84 0" fill="none" stroke={P.gold} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      <path d="M54 92h92M62 78h76M70 64h60" stroke={P.gold} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <circle className="emt-twinkle" cx="100" cy="64" r="14" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
      {/* nest */}
      <path d="M48 132c0-18 23-30 52-30s52 12 52 30c0 14-23 22-52 22s-52-8-52-22Z" fill="#a9743a" opacity="0.18" />
      <path d="M50 130c8-12 30-10 50-10s42-2 50 10c-8 14-30 20-50 20s-42-6-50-20Z" fill={P.green} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
      <ellipse cx="100" cy="120" rx="26" ry="30" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <path d="M86 118a14 18 0 0 1 12-14" fill="none" stroke={P.gold} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </Frame>
  );
}

/* 11. Debt payoff — stepping down to a finish flag */
function DebtPayoffArt() {
  const id = "ca-payoff";
  return (
    <Frame id={id} label="Debt payoff timeline">
      <Backdrop id={id} tone="cream" />
      {[[44, 78], [76, 98], [108, 118], [140, 138]].map(([x, y], i) => (
        <rect key={x} x={x} y={y} width="32" height={156 - y} rx="3" fill={i === 0 ? `url(#${id}-gold)` : P.greenSoft} stroke={P.ink} strokeWidth="4" />
      ))}
      <path d="M60 74 92 94l32 20 32 20" fill="none" stroke={P.gold} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
      {/* finish flag on last step */}
      <g className="emt-sway">
        <g transform="translate(150 96)">
          <rect x="0" y="0" width="5" height="42" rx="2.5" fill={P.ink} />
          <path d="M5 2h26l-7 9 7 9H5Z" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="3" strokeLinejoin="round" />
        </g>
      </g>
      {/* rolling coin */}
      <g className="emt-float">
        <Coin id={id} cx="44" cy="62" r="12" />
      </g>
    </Frame>
  );
}

/* 12. Savings goal — a jar filling toward a flag */
function SavingsGoalArt() {
  const id = "ca-goal";
  return (
    <Frame id={id} label="Savings goal progress">
      <Backdrop id={id} tone="cream" />
      <path d="M68 76h64l-6 70a8 8 0 0 1-8 7H82a8 8 0 0 1-8-7Z" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
      <rect x="62" y="66" width="76" height="14" rx="7" fill={P.greenSoft} stroke={P.ink} strokeWidth="4" />
      {/* fill */}
      <path d="M71 118h58l-4 28a8 8 0 0 1-8 7H83a8 8 0 0 1-8-7Z" fill={P.goldSoft} />
      <g className="emt-float" style={{ animationDelay: "0.5s" }}>
        <ellipse cx="90" cy="128" rx="8" ry="5" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="2.4" />
        <ellipse cx="112" cy="138" rx="8" ry="5" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="2.4" />
      </g>
      {/* goal flag */}
      <g className="emt-sway">
        <g transform="translate(124 34)">
          <rect x="0" y="0" width="5" height="40" rx="2.5" fill={P.ink} />
          <path d="M5 3h24l-6 8 6 8H5Z" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="3" strokeLinejoin="round" />
        </g>
      </g>
    </Frame>
  );
}

/* 13. Budget — donut split with legend dots */
function BudgetCalcArt() {
  const id = "ca-budget";
  return (
    <Frame id={id} label="Monthly budget split">
      <Backdrop id={id} tone="mint" />
      <circle cx="92" cy="100" r="48" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <path d="M92 100 92 52a48 48 0 0 1 42 24Z" fill={P.goldSoft} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M92 100 134 76a48 48 0 0 1-14 66Z" fill={P.greenSoft} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <circle className="emt-pulse" cx="92" cy="100" r="18" fill={`url(#${id}-mint)`} stroke={P.ink} strokeWidth="4" />
      <g>
        <circle className="emt-twinkle" cx="150" cy="74" r="5" fill={P.gold} />
        <circle className="emt-twinkle" style={{ animationDelay: "0.5s" }} cx="150" cy="98" r="5" fill={P.green} />
        <circle className="emt-twinkle" style={{ animationDelay: "1s" }} cx="150" cy="122" r="5" fill={P.greenSoft} stroke={P.ink} strokeWidth="2" />
        <rect x="160" y="71" width="20" height="6" rx="3" fill="#cdd8d4" />
        <rect x="160" y="95" width="16" height="6" rx="3" fill="#cdd8d4" />
        <rect x="160" y="119" width="18" height="6" rx="3" fill="#cdd8d4" />
      </g>
    </Frame>
  );
}

/* 14. Emergency fund — an umbrella sheltering coins */
function EmergencyFundArt() {
  const id = "ca-emergency";
  return (
    <Frame id={id} label="Emergency fund cushion">
      <Backdrop id={id} tone="sky" />
      <g className="emt-sway">
        <path d="M100 50c30 0 54 22 56 50H44c2-28 26-50 56-50Z" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M70 100c2-26 14-46 30-50M130 100c-2-26-14-46-30-50" fill="none" stroke={P.ink} strokeWidth="3" opacity="0.3" />
        <path d="M100 50v8" stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
        <path d="M100 100v40a10 10 0 0 0 18 6" fill="none" stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
      </g>
      <ellipse cx="90" cy="160" rx="16" ry="6" fill={P.goldSoft} stroke={P.ink} strokeWidth="3" />
      <ellipse cx="90" cy="152" rx="16" ry="6" fill={P.cream} stroke={P.ink} strokeWidth="3" />
      <circle cx="146" cy="70" r="3" fill={P.green} />
      <circle cx="54" cy="84" r="3" fill={P.green} />
    </Frame>
  );
}

/* 15. Net worth — assets vs liabilities with a net-up arrow */
function NetWorthArt() {
  const id = "ca-networth";
  return (
    <Frame id={id} label="Net worth balance">
      <Backdrop id={id} tone="mint" />
      <rect x="54" y="72" width="34" height="78" rx="6" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="5" />
      <rect x="112" y="108" width="34" height="42" rx="6" fill={P.greenSoft} stroke={P.ink} strokeWidth="5" />
      <path className="emt-float" d="M71 72V56M64 63l7-7 7 7" fill="none" stroke={P.ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M129 108v-8" stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
      <line x1="44" y1="150" x2="156" y2="150" stroke={P.ink} strokeWidth="5" strokeLinecap="round" />
      <text x="71" y="166" textAnchor="middle" fontSize="11" fontWeight="700" fill={P.ink}>+</text>
      <text x="129" y="166" textAnchor="middle" fontSize="11" fontWeight="700" fill={P.ink}>-</text>
    </Frame>
  );
}

/* 16. ROI — a small coin growing into a larger one along an up arrow */
function RoiArt() {
  const id = "ca-roi";
  return (
    <Frame id={id} label="Return on investment">
      <Backdrop id={id} tone="sky" />
      <g className="emt-float" style={{ animationDelay: "0.3s" }}>
        <Coin id={id} cx="68" cy="130" r="17" />
      </g>
      <g className="emt-float">
        <Coin id={id} cx="120" cy="98" r="24" />
      </g>
      <path d="M56 150 96 112l36-32" fill="none" stroke={P.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M116 70h22v22" fill="none" stroke={P.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="emt-pulse">
        <circle cx="150" cy="58" r="15" fill="#ffffff" stroke={P.gold} strokeWidth="4" />
        <text x="150" y="64" textAnchor="middle" fontSize="14" fontWeight="700" fill={P.ink}>%</text>
      </g>
    </Frame>
  );
}

/* 17. CAGR — a smooth growth curve linking a start dot to an end dot */
function CagrArt() {
  const id = "ca-cagr";
  return (
    <Frame id={id} label="Compound annual growth rate">
      <Backdrop id={id} tone="sky" />
      <path d="M52 150h100M52 150V58" fill="none" stroke="#cdd8d4" strokeWidth="4" strokeLinecap="round" />
      <path d="M56 142C86 140 110 120 150 64L150 150 56 150Z" fill={P.goldSoft} opacity="0.35" />
      <path d="M56 142C86 140 110 120 150 64" fill="none" stroke={P.gold} strokeWidth="5.5" strokeLinecap="round" />
      <circle className="emt-twinkle" cx="88" cy="133" r="3.4" fill={P.green} />
      <circle className="emt-twinkle" style={{ animationDelay: "0.6s" }} cx="120" cy="103" r="3.4" fill={P.green} />
      <circle cx="56" cy="142" r="6" fill="#ffffff" stroke={P.ink} strokeWidth="4" />
      <circle className="emt-pulse" cx="150" cy="64" r="8" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
    </Frame>
  );
}

/* 18. Dividend — a paying coin cycling back into growing stacks */
function DividendArt() {
  const id = "ca-dividend";
  return (
    <Frame id={id} label="Dividend reinvestment">
      <Backdrop id={id} tone="sky" />
      <g className="emt-spin">
        <path d="M128 72a28 28 0 0 1-9 21" fill="none" stroke={P.gold} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M119 97l1-12 11 5Z" fill={P.gold} stroke={P.ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M72 72a28 28 0 0 1 9-21" fill="none" stroke={P.gold} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M81 47l-1 12-11-5Z" fill={P.gold} stroke={P.ink} strokeWidth="2.2" strokeLinejoin="round" />
      </g>
      <g className="emt-pulse">
        <Coin id={id} cx="100" cy="72" r="22" />
      </g>
      {[[70, 2], [100, 3], [130, 4]].map(([cx, n]) => (
        <g key={cx}>
          {Array.from({ length: n }).map((_, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={154 - i * 10}
              rx="16"
              ry="6.5"
              fill={i % 2 ? P.cream : P.goldSoft}
              stroke={P.ink}
              strokeWidth="3"
            />
          ))}
        </g>
      ))}
    </Frame>
  );
}

/* 19. 401(k) — a labeled fund with rising bars and an employer match coin */
function FourOhOneKArt() {
  const id = "ca-401k";
  return (
    <Frame id={id} label="401(k) growth with employer match">
      <Backdrop id={id} tone="sky" />
      {[[50, 128], [78, 110], [106, 92]].map(([x, y]) => (
        <rect key={x} x={x} y={y} width="20" height={150 - y} rx="3" fill={P.greenSoft} stroke={P.ink} strokeWidth="3.5" />
      ))}
      <rect x="96" y="80" width="58" height="70" rx="10" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <rect x="96" y="80" width="58" height="18" rx="9" fill={P.greenSoft} stroke={P.ink} strokeWidth="5" />
      <text x="125" y="132" textAnchor="middle" fontSize="15" fontWeight="700" fill={P.ink}>401k</text>
      <g className="emt-pulse">
        <Coin id={id} cx="125" cy="56" r="14" label="+" />
      </g>
      <path d="M125 72v6" stroke={P.ink} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

/* 20. Roth IRA — a shield with a check, meaning tax-free growth */
function RothIraArt() {
  const id = "ca-roth";
  return (
    <Frame id={id} label="Roth IRA tax-free growth">
      <Backdrop id={id} tone="sky" />
      <path d="M96 48l44 15v36c0 30-22 47-44 56-22-9-44-26-44-56V63Z" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M96 48l44 15v36c0 30-22 47-44 56Z" fill={P.greenSofter} />
      <path className="emt-pulse" d="M78 100l13 13 24-29" fill="none" stroke={P.gold} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <g className="emt-float">
        <Coin id={id} cx="150" cy="58" r="13" />
      </g>
    </Frame>
  );
}

/* 21. Paycheck — a pay envelope/check with coins */
function PaycheckArt() {
  const id = "ca-paycheck";
  return (
    <Frame id={id} label="Take-home paycheck">
      <Backdrop id={id} tone="cream" />
      <rect x="44" y="78" width="112" height="62" rx="8" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <rect x="56" y="92" width="58" height="7" rx="3.5" fill={P.greenSoft} />
      <rect x="56" y="106" width="74" height="6" rx="3" fill="#cdd8d4" />
      <rect x="56" y="120" width="44" height="6" rx="3" fill="#cdd8d4" />
      <g className="emt-pulse">
        <circle cx="138" cy="120" r="16" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
        <text x="138" y="126" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">$</text>
      </g>
      <g className="emt-float" style={{ animationDelay: "0.4s" }}>
        <Coin id={id} cx="64" cy="156" r="12" />
      </g>
    </Frame>
  );
}

/* 22. Salary — clock and calendar with a two-way conversion arrow */
function SalaryArt() {
  const id = "ca-salary";
  return (
    <Frame id={id} label="Hourly to salary conversion">
      <Backdrop id={id} tone="sky" />
      {/* clock */}
      <circle cx="68" cy="92" r="30" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <path className="emt-spin" style={{ transformBox: "view-box", transformOrigin: "68px 92px" }} d="M68 74v18l12 8" fill="none" stroke={P.ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="68" cy="92" r="3.5" fill={P.gold} />
      {/* calendar */}
      <g transform="translate(106 64)">
        <rect x="0" y="6" width="56" height="52" rx="7" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
        <rect x="0" y="6" width="56" height="15" rx="7" fill={P.greenSoft} stroke={P.ink} strokeWidth="5" />
        <rect x="12" y="0" width="5" height="12" rx="2.5" fill={P.ink} />
        <rect x="39" y="0" width="5" height="12" rx="2.5" fill={P.ink} />
        <circle cx="28" cy="40" r="9" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="3.5" />
      </g>
      {/* two-way arrow */}
      <g className="emt-pulse">
        <path d="M70 140h60M70 140l8-7M70 140l8 7M130 140l-8-7M130 140l-8 7" fill="none" stroke={P.gold} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

/* 23. Income tax — a tax form with a % stamp and progressive bars */
function IncomeTaxArt() {
  const id = "ca-income-tax";
  return (
    <Frame id={id} label="Federal income tax estimate">
      <Backdrop id={id} tone="cream" />
      <rect x="52" y="56" width="84" height="108" rx="9" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <rect x="66" y="72" width="44" height="7" rx="3.5" fill={P.greenSoft} />
      {[90, 104, 118].map((y, i) => (
        <rect key={y} x="66" y={y} width={i === 1 ? 56 : 44} height="6" rx="3" fill="#cdd8d4" />
      ))}
      {/* progressive mini bars */}
      {[[70, 150, 8], [82, 144, 14], [94, 138, 20]].map(([x, y, h]) => (
        <rect key={x} x={x} y={y} width="8" height={h} rx="2" fill={P.greenSoft} stroke={P.ink} strokeWidth="2.5" />
      ))}
      {/* % stamp */}
      <g className="emt-pulse">
        <circle cx="132" cy="118" r="20" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
        <text x="132" y="125" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">%</text>
      </g>
    </Frame>
  );
}

/* 24. Sales tax — a price tag with a % badge and a shopping bag */
function SalesTaxArt() {
  const id = "ca-sales-tax";
  return (
    <Frame id={id} label="Sales tax on a purchase">
      <Backdrop id={id} tone="sky" />
      {/* price tag */}
      <g transform="rotate(-12 92 104)">
        <path d="M54 78h44l30 30-46 46-44-44V92a14 14 0 0 1 14-14Z" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
        <circle cx="74" cy="98" r="8" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="4" />
        <text x="104" y="120" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">$</text>
      </g>
      {/* shopping bag */}
      <g className="emt-float">
        <path d="M118 116h36l-5 40a6 6 0 0 1-6 5h-14a6 6 0 0 1-6-5Z" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M127 116a9 9 0 0 1 18 0" fill="none" stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* % badge */}
      <g className="emt-pulse">
        <circle cx="146" cy="70" r="16" fill="#ffffff" stroke={P.gold} strokeWidth="4" />
        <text x="146" y="76" textAnchor="middle" fontSize="14" fontWeight="700" fill={P.ink}>%</text>
      </g>
    </Frame>
  );
}

/* 25. Self-employment tax — a briefcase with a coin */
function SelfEmploymentArt() {
  const id = "ca-se-tax";
  return (
    <Frame id={id} label="Self-employment tax">
      <Backdrop id={id} tone="cream" />
      <rect x="50" y="92" width="100" height="62" rx="10" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <path d="M82 92v-12a8 8 0 0 1 8-8h20a8 8 0 0 1 8 8v12" fill="none" stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
      <rect x="50" y="112" width="100" height="10" fill={P.greenSoft} opacity="0.6" />
      <g className="emt-float">
        <Coin id={id} cx="100" cy="118" r="16" />
      </g>
      <g className="emt-twinkle">
        <path d="M150 64c.8 6 2.2 7.4 8 8-5.8.8-7.2 2.2-8 8-.8-5.8-2.2-7.2-8-8 5.8-.8 7.2-2.2 8-8Z" fill={P.gold} stroke={P.ink} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

/* 26. Debt-to-income — a gauge weighing income against debt */
function DebtToIncomeArt() {
  const id = "ca-dti";
  return (
    <Frame id={id} label="Debt-to-income ratio">
      <Backdrop id={id} tone="cream" />
      <path d="M48 134a52 52 0 0 1 104 0" fill="none" stroke="#cdd8d4" strokeWidth="11" strokeLinecap="round" />
      <path d="M48 134a52 52 0 0 1 62-50" fill="none" stroke={P.gold} strokeWidth="11" strokeLinecap="round" />
      <g className="emt-pulse" style={{ transformBox: "view-box", transformOrigin: "100px 134px" }}>
        <path d="M100 134 70 96" stroke={P.ink} strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="134" r="7" fill={P.ink} />
      </g>
      <text x="62" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill={P.green}>low</text>
      <text x="140" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill={P.gold}>high</text>
      <text x="100" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill={P.ink}>DTI</text>
    </Frame>
  );
}

/* 27. Credit card payoff — a card with a descending balance */
function CreditCardPayoffArt() {
  const id = "ca-ccpayoff";
  return (
    <Frame id={id} label="Credit card payoff">
      <Backdrop id={id} tone="cream" />
      <g transform="rotate(-8 100 92)">
        <rect x="46" y="62" width="108" height="68" rx="10" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="5" />
        <rect x="46" y="78" width="108" height="13" fill={P.ink} opacity="0.85" />
        <rect x="58" y="104" width="34" height="9" rx="2" fill="#ffffff" opacity="0.8" />
        <circle cx="138" cy="112" r="6" fill="#ffffff" opacity="0.55" />
      </g>
      {[[54, 150, 6], [74, 146, 10], [94, 140, 16], [114, 150, 6]].map(([x, y, h], i) => (
        <rect key={x} className="emt-grow-bar" style={{ transformBox: "view-box", transformOrigin: `${x + 6}px 156px`, animationDelay: `${i * 0.12}s` }} x={x} y={y} width="12" height={156 - y} rx="2.5" fill={i === 3 ? P.greenSoft : P.gold} stroke={P.ink} strokeWidth="2.5" />
      ))}
    </Frame>
  );
}

/* 28. Auto loan — a car with a coin */
function AutoLoanArt() {
  const id = "ca-auto";
  return (
    <Frame id={id} label="Auto loan payment">
      <Backdrop id={id} tone="cream" />
      <path d="M40 124l10-26a12 12 0 0 1 11-8h54a12 12 0 0 1 10 6l14 24" fill="none" stroke={P.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 124h120a6 6 0 0 1 6 6v12a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4v-12a6 6 0 0 1 6-6Z" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M52 98h44v18H46Z" fill={P.greenSoft} opacity="0.7" />
      <circle cx="62" cy="148" r="13" fill={P.ink} />
      <circle cx="62" cy="148" r="5" fill="#ffffff" />
      <circle cx="134" cy="148" r="13" fill={P.ink} />
      <circle cx="134" cy="148" r="5" fill="#ffffff" />
      <g className="emt-float">
        <Coin id={id} cx="150" cy="70" r="14" />
      </g>
    </Frame>
  );
}

/* 29. CD — a padlocked deposit growing with a % tag */
function CdArt() {
  const id = "ca-cd";
  return (
    <Frame id={id} label="Certificate of deposit">
      <Backdrop id={id} tone="mint" />
      {[[64, 132, 4], [100, 118, 5], [136, 100, 6]].map(([cx, top, n]) => (
        <g key={cx}>
          {Array.from({ length: n }).map((_, i) => (
            <ellipse key={i} cx={cx} cy={150 - i * 11} rx="20" ry="8" fill={i % 2 ? P.cream : P.goldSoft} stroke={P.ink} strokeWidth="3.5" />
          ))}
        </g>
      ))}
      {/* padlock = locked-in term */}
      <g transform="translate(100 52)">
        <rect x="-18" y="6" width="36" height="28" rx="6" fill={`url(#${id}-gold)`} stroke={P.ink} strokeWidth="4" />
        <path d="M-10 6v-6a10 10 0 0 1 20 0v6" fill="none" stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
        <circle cx="0" cy="19" r="3.4" fill={P.ink} />
      </g>
      <g className="emt-pulse">
        <circle cx="150" cy="74" r="15" fill="#ffffff" stroke={P.gold} strokeWidth="4" />
        <text x="150" y="80" textAnchor="middle" fontSize="13" fontWeight="700" fill={P.ink}>%</text>
      </g>
    </Frame>
  );
}

/* 30. 50/30/20 budget — a donut split into three slices */
function FiftyThirtyTwentyArt() {
  const id = "ca-503020";
  return (
    <Frame id={id} label="50/30/20 budget split">
      <Backdrop id={id} tone="mint" />
      {/* 50% needs (top half), 30% wants, 20% savings — donut */}
      <circle cx="92" cy="100" r="48" fill={`url(#${id}-white)`} stroke={P.ink} strokeWidth="5" />
      <path d="M92 100 92 52a48 48 0 0 1 0 96Z" fill={P.goldSoft} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M92 100 92 148a48 48 0 0 1-41.6-24Z" fill={P.greenSoft} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="92" cy="100" r="19" fill={`url(#${id}-mint)`} stroke={P.ink} strokeWidth="4" />
      <g>
        {[["50", P.gold, 70], ["30", "#cdb074", 96], ["20", P.green, 122]].map(([t, c, y]) => (
          <g key={t}>
            <circle cx="150" cy={y} r="5" fill={c} stroke={P.ink} strokeWidth="1.6" />
            <text x="160" y={y + 4} fontSize="11" fontWeight="700" fill={P.ink}>{t}%</text>
          </g>
        ))}
      </g>
    </Frame>
  );
}

const artBySlug = {
  "mortgage-amortization-calculator": MortgageAmortizationArt,
  "refinance-calculator": RefinanceArt,
  "home-affordability-calculator": HomeAffordabilityArt,
  "rent-vs-buy-calculator": RentVsBuyArt,
  "extra-payment-mortgage-calculator": ExtraPaymentArt,
  "mortgage-calculator": MortgageBaseArt,
  "compound-interest-calculator": CompoundInterestArt,
  "inflation-calculator": InflationArt,
  "loan-calculator": LoanArt,
  "retirement-calculator": RetirementCalcArt,
  "debt-payoff-calculator": DebtPayoffArt,
  "savings-goal-calculator": SavingsGoalArt,
  "budget-calculator": BudgetCalcArt,
  "emergency-fund-calculator": EmergencyFundArt,
  "net-worth-calculator": NetWorthArt,
  "roi-calculator": RoiArt,
  "cagr-calculator": CagrArt,
  "dividend-calculator": DividendArt,
  "401k-calculator": FourOhOneKArt,
  "roth-ira-calculator": RothIraArt,
  "paycheck-calculator": PaycheckArt,
  "salary-calculator": SalaryArt,
  "income-tax-calculator": IncomeTaxArt,
  "sales-tax-calculator": SalesTaxArt,
  "self-employment-tax-calculator": SelfEmploymentArt,
  "debt-to-income-ratio-calculator": DebtToIncomeArt,
  "credit-card-payoff-calculator": CreditCardPayoffArt,
  "auto-loan-calculator": AutoLoanArt,
  "cd-calculator": CdArt,
  "50-30-20-budget-calculator": FiftyThirtyTwentyArt
};

export function CalculatorArt({ slug, category }) {
  const Art = artBySlug[slug];
  if (Art) {
    return <Art />;
  }
  return <CategoryArt category={category} />;
}
