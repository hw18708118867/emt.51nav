const iconBase = "emt-icon h-7 w-7";
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

function MortgageIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconBase} aria-hidden="true" {...stroke}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function DebtIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconBase} aria-hidden="true" {...stroke}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 14.5h3" />
    </svg>
  );
}

function InvestingIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconBase} aria-hidden="true" {...stroke}>
      <path d="M4 16.5 9.5 11l3 3L20 6.5" />
      <path d="M15.5 6.5H20V11" />
    </svg>
  );
}

function RetirementIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconBase} aria-hidden="true" {...stroke}>
      <path d="M5 20c0-4.5 3-7.5 7-7.5s7 3 7 7.5" />
      <circle cx="12" cy="7" r="3" />
    </svg>
  );
}

function SavingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconBase} aria-hidden="true" {...stroke}>
      <path d="M4 12.5c0-3 2.8-5 6.5-5 4 0 7.5 2 7.5 5.5 0 1.6-.8 3-2 4v2h-2.5v-1.4a8 8 0 0 1-6 0V18H5v-2.2A4.7 4.7 0 0 1 4 12.5Z" />
      <path d="M4.5 11.5C3.7 11.3 3 10.6 3 9.8" />
      <circle cx="9" cy="11" r="0.8" fill="currentColor" stroke="none" />
      <path d="M11 7.6c.3-1 1.2-1.6 2.2-1.6" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconBase} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v8l5 3" />
    </svg>
  );
}

function IncomeTaxIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconBase} aria-hidden="true" {...stroke}>
      <path d="M7 3h7l4 4v14H7Z" />
      <path d="M14 3v4h4" />
      <path d="M10.5 12.5 14 16" />
      <circle cx="10.5" cy="12.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14" cy="16" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

const categoryIcons = {
  Mortgage: MortgageIcon,
  Debt: DebtIcon,
  "Income & Tax": IncomeTaxIcon,
  Investing: InvestingIcon,
  Retirement: RetirementIcon,
  Savings: SavingsIcon,
  Budgeting: BudgetIcon
};

export function CategoryIcon({ category }) {
  const Icon = categoryIcons[category] || BudgetIcon;
  return <Icon />;
}

export function HeroGrowthChart() {
  const points = [
    [10, 150],
    [50, 138],
    [90, 142],
    [130, 120],
    [170, 124],
    [210, 96],
    [250, 84],
    [290, 58],
    [330, 40],
    [360, 24]
  ];
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const area = `${line} L 360 170 L 10 170 Z`;
  const bars = [
    [40, 120],
    [95, 132],
    [150, 108],
    [205, 88],
    [260, 70],
    [315, 44]
  ];

  return (
    <svg
      viewBox="0 0 380 190"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of savings growing over time"
    >
      <defs>
        <linearGradient id="heroArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3f5950" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3f5950" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="heroLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#3f5950" />
          <stop offset="100%" stopColor="#c8821e" />
        </linearGradient>
      </defs>

      {[150, 110, 70, 30].map((y) => (
        <line key={y} x1="10" x2="370" y1={y} y2={y} stroke="#1d3128" strokeOpacity="0.06" strokeDasharray="4 8" />
      ))}

      {bars.map(([x, y], i) => (
        <rect
          key={x}
          className="emt-hero-bar"
          x={x}
          y={y}
          width="14"
          height={170 - y}
          rx="4"
          fill="#c9d6cf"
          fillOpacity="0.7"
          style={{ animationDelay: `${0.3 + i * 0.12}s` }}
        />
      ))}

      <path className="emt-hero-area" d={area} fill="url(#heroArea)" pathLength="1" />
      <path className="emt-hero-line" d={line} fill="none" stroke="url(#heroLine)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />

      {points.map(([x, y], i) => {
        const isLast = i === points.length - 1;
        return (
          <circle
            key={x}
            className="emt-hero-dot"
            cx={x}
            cy={y}
            r={isLast ? 5.5 : 4}
            fill={isLast ? "#c8821e" : "#fcfcfb"}
            stroke={isLast ? "#a86a12" : "#3f5950"}
            strokeWidth="2.5"
            style={{ animationDelay: `${1 + i * 0.07}s` }}
          />
        );
      })}
    </svg>
  );
}

/* Large, friendly spot illustrations keyed by category. */

const artBase = "h-full w-full";

function ArtFrame({ label, id, children }) {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className={artBase}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6f2ea" />
          <stop offset="100%" stopColor="#cfe7d8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill={`url(#${id}-bg)`} />
      <ellipse cx="100" cy="166" rx="56" ry="9" fill="#243d35" opacity="0.08" />
      {children}
    </svg>
  );
}

function MortgageArt() {
  return (
    <ArtFrame label="House and mortgage" id="art-mortgage">
      <path d="M52 98 100 60l48 38v54a6 6 0 0 1-6 6H58a6 6 0 0 1-6-6Z" fill="#ffffff" stroke="#243d35" strokeWidth="5" strokeLinejoin="round" />
      <path d="M44 102 100 58l56 44" fill="none" stroke="#243d35" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="88" y="120" width="24" height="32" rx="3" fill="#c8821e" stroke="#243d35" strokeWidth="4" />
      <circle cx="130" cy="66" r="12" fill="#c8821e" stroke="#243d35" strokeWidth="4" />
      <path d="M126 66h8M130 62v8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </ArtFrame>
  );
}

function DebtArt() {
  return (
    <ArtFrame label="Credit cards and debt" id="art-debt">
      <rect x="48" y="84" width="92" height="58" rx="10" fill="#3f7a5f" stroke="#243d35" strokeWidth="5" transform="rotate(-8 94 113)" />
      <rect x="60" y="70" width="92" height="58" rx="10" fill="#ffffff" stroke="#243d35" strokeWidth="5" transform="rotate(6 106 99)" />
      <rect x="68" y="84" width="92" height="12" rx="2" fill="#c8821e" transform="rotate(6 114 90)" />
      <circle cx="140" cy="118" r="9" fill="#f4d9a8" stroke="#243d35" strokeWidth="3" transform="rotate(6 140 118)" />
    </ArtFrame>
  );
}

function InvestingArt() {
  return (
    <ArtFrame label="Investing growth" id="art-invest">
      <rect x="54" y="120" width="20" height="34" rx="4" fill="#bfe0cd" stroke="#243d35" strokeWidth="4" />
      <rect x="86" y="100" width="20" height="54" rx="4" fill="#3f7a5f" stroke="#243d35" strokeWidth="4" />
      <rect x="118" y="78" width="20" height="76" rx="4" fill="#c8821e" stroke="#243d35" strokeWidth="4" />
      <path d="M54 96 92 74l24 12 36-34" fill="none" stroke="#c8821e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M138 52h16v16" fill="none" stroke="#c8821e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </ArtFrame>
  );
}

function RetirementArt() {
  return (
    <ArtFrame label="Retirement planning" id="art-retire">
      <circle cx="100" cy="100" r="50" fill="#ffffff" stroke="#243d35" strokeWidth="5" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="#cdd8d4" strokeWidth="2" />
      <path d="M100 70v32l22 14" fill="none" stroke="#243d35" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="6" fill="#c8821e" stroke="#243d35" strokeWidth="2" />
      <path d="M100 38v10M100 152v10M38 100h10M152 100h10" stroke="#3f7a5f" strokeWidth="5" strokeLinecap="round" />
    </ArtFrame>
  );
}

function SavingsArt() {
  return (
    <ArtFrame label="Savings" id="art-savings">
      <path d="M62 108c0-22 19-38 44-38 26 0 48 14 48 36 0 10-5 19-13 26v14h-17v-9a54 54 0 0 1-36 0v9H74v-14c-7-6-12-14-12-24Z" fill="#3f7a5f" stroke="#243d35" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="84" cy="104" r="6" fill="#ffffff" />
      <circle cx="84" cy="104" r="2.4" fill="#243d35" />
      <rect x="92" y="56" width="34" height="14" rx="7" fill="#c8821e" stroke="#243d35" strokeWidth="4" />
    </ArtFrame>
  );
}

function BudgetArt() {
  return (
    <ArtFrame label="Budgeting" id="art-budget">
      <circle cx="100" cy="100" r="52" fill="#ffffff" stroke="#243d35" strokeWidth="5" />
      <path d="M100 100 100 48a52 52 0 0 1 45 26Z" fill="#f4d9a8" stroke="#243d35" strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 100 145 74a52 52 0 0 1-15 70Z" fill="#bfe0cd" stroke="#243d35" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="12" fill="#c8821e" stroke="#243d35" strokeWidth="4" />
    </ArtFrame>
  );
}

function IncomeTaxArt() {
  return (
    <ArtFrame label="Income and taxes" id="art-incometax">
      <rect x="54" y="52" width="74" height="100" rx="9" fill="#ffffff" stroke="#243d35" strokeWidth="5" />
      <rect x="66" y="68" width="42" height="8" rx="4" fill="#bfe0cd" />
      <rect x="66" y="86" width="50" height="6" rx="3" fill="#cdd8d4" />
      <rect x="66" y="100" width="50" height="6" rx="3" fill="#cdd8d4" />
      <rect x="66" y="114" width="34" height="6" rx="3" fill="#cdd8d4" />
      <circle cx="138" cy="68" r="17" fill="#ffffff" stroke="#c8821e" strokeWidth="4" />
      <text x="138" y="74" textAnchor="middle" fontSize="15" fontWeight="700" fill="#243d35">%</text>
      <circle cx="118" cy="138" r="16" fill="#c8821e" stroke="#243d35" strokeWidth="4" />
      <text x="118" y="144" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ffffff">$</text>
    </ArtFrame>
  );
}

function InsuranceArt() {
  return (
    <ArtFrame label="Insurance shield" id="art-insurance">
      <path d="M100 44 148 64v44c0 34-22 58-48 68-26-10-48-34-48-68V64Z" fill="#ffffff" stroke="#243d35" strokeWidth="5" strokeLinejoin="round" />
      <path d="M100 44 148 64v44c0 34-22 58-48 68-26-10-48-34-48-68V64Z" fill="#bfe0cd" opacity="0.4" />
      <path d="M80 102l14 14 28-30" fill="none" stroke="#3f7a5f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#f4d9a8" strokeWidth="3" opacity="0.6" />
    </ArtFrame>
  );
}

function CreditArt() {
  return (
    <ArtFrame label="Credit score" id="art-credit">
      <rect x="58" y="46" width="84" height="108" rx="12" fill="#ffffff" stroke="#243d35" strokeWidth="5" />
      <rect x="70" y="64" width="36" height="24" rx="5" fill="#bfe0cd" stroke="#243d35" strokeWidth="3" />
      <path d="M74 76 82 68l6 6 8-10 6 8" fill="none" stroke="#3f7a5f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="70" y="100" width="60" height="7" rx="3.5" fill="#cdd8d4" />
      <rect x="70" y="114" width="60" height="7" rx="3.5" fill="#cdd8d4" />
      <rect x="70" y="128" width="40" height="7" rx="3.5" fill="#cdd8d4" />
      <circle cx="138" cy="62" r="16" fill="#c8821e" stroke="#243d35" strokeWidth="4" />
      <text x="138" y="68" textAnchor="middle" fontSize="16" fontWeight="700" fill="#ffffff">★</text>
    </ArtFrame>
  );
}

const categoryArt = {
  Mortgage: MortgageArt,
  Debt: DebtArt,
  "Income & Tax": IncomeTaxArt,
  Investing: InvestingArt,
  Retirement: RetirementArt,
  Savings: SavingsArt,
  Saving: SavingsArt,
  Budgeting: BudgetArt,
  Insurance: InsuranceArt,
  Credit: CreditArt
};

export function CategoryArt({ category }) {
  const Art = categoryArt[category] || BudgetArt;
  return <Art />;
}

/* Animated concept diagrams that explain a hard-to-read passage.
   Pure SVG + the existing CSS keyframe classes (emt-art-line, emt-pulse,
   emt-float) so they animate on static export and respect reduced-motion. */

export function RentVsBuyDiagram() {
  const own = [[50, 215], [90, 210], [130, 200], [170, 180], [210, 150], [250, 115], [290, 80], [330, 55], [370, 40]];
  const rent = [[50, 160], [90, 153], [130, 147], [170, 141], [210, 135], [250, 129], [290, 123], [330, 117], [370, 111]];
  const line = (pts) => pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <figure className="my-10">
      <div className="w-full rounded-[2rem] border border-line bg-surface p-6 shadow-[0_18px_40px_-34px_rgba(33,53,48,0.2)]">
        <svg viewBox="0 0 400 290" className="h-auto w-full" role="img" aria-label="Net financial position of owning versus renting over time, crossing at the break-even year">
          <line x1="40" x2="380" y1="250" y2="250" stroke="#243d35" strokeOpacity="0.18" />
          {[60, 110, 160, 210].map((y) => (
            <line key={y} x1="40" x2="380" y1={y} y2={y} stroke="#243d35" strokeOpacity="0.06" strokeDasharray="4 8" />
          ))}
          <rect x="44" y="20" width="14" height="14" rx="4" fill="#3f7a5f" />
          <text x="64" y="31" fontSize="13" fill="#243d35">Owning</text>
          <rect x="150" y="20" width="14" height="14" rx="4" fill="#c8821e" />
          <text x="170" y="31" fontSize="13" fill="#243d35">Renting</text>
          <path className="emt-art-line" pathLength="1" d={line(own)} fill="none" stroke="#3f7a5f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path className="emt-art-line" pathLength="1" d={line(rent)} fill="none" stroke="#c8821e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle className="emt-pulse" cx="232" cy="132" r="7" fill="#c8821e" stroke="#a86a12" strokeWidth="2" />
          <text x="244" y="120" fontSize="13" fontWeight="700" fill="#243d35">Break-even ≈ 5–6 yr</text>
          <text x="40" y="272" fontSize="12" fill="#5b6b66">Years you stay</text>
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-500">Owning starts behind because of the down payment and closing costs, then pulls ahead as equity builds. The crossing point is your break-even year.</figcaption>
    </figure>
  );
}

export function RefinanceDiagram() {
  const current = [[50, 40], [110, 75], [170, 110], [230, 145], [290, 180], [370, 210]];
  const refi = [[50, 80], [110, 100], [170, 120], [230, 140], [290, 160], [370, 180]];
  const line = (pts) => pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <figure className="my-10">
      <div className="w-full rounded-[2rem] border border-line bg-surface p-6 shadow-[0_18px_40px_-34px_rgba(33,53,48,0.2)]">
        <svg viewBox="0 0 400 290" className="h-auto w-full" role="img" aria-label="Cumulative cost of the current versus refinanced loan, crossing at the break-even month">
          <line x1="40" x2="380" y1="250" y2="250" stroke="#243d35" strokeOpacity="0.18" />
          {[60, 110, 160, 210].map((y) => (
            <line key={y} x1="40" x2="380" y1={y} y2={y} stroke="#243d35" strokeOpacity="0.06" strokeDasharray="4 8" />
          ))}
          <rect x="44" y="20" width="14" height="14" rx="4" fill="#9fb3ab" />
          <text x="64" y="31" fontSize="13" fill="#243d35">Current loan</text>
          <rect x="170" y="20" width="14" height="14" rx="4" fill="#c8821e" />
          <text x="190" y="31" fontSize="13" fill="#243d35">Refinanced loan</text>
          <path className="emt-art-line" pathLength="1" d={line(current)} fill="none" stroke="#9fb3ab" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path className="emt-art-line" pathLength="1" d={line(refi)} fill="none" stroke="#c8821e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle className="emt-pulse" cx="215" cy="143" r="7" fill="#c8821e" stroke="#a86a12" strokeWidth="2" />
          <text x="227" y="131" fontSize="13" fontWeight="700" fill="#243d35">Break-even ≈ 25 mo</text>
          <text x="40" y="272" fontSize="12" fill="#5b6b66">Months you stay</text>
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-500">The refinanced loan costs more at first because of closing costs, then saves every month. Where it drops below the current loan is your break-even.</figcaption>
    </figure>
  );
}

export function StudentLoanDiagram() {
  const bars = [
    { x: 60, h: 160, rate: "12%", color: "#c8821e", pulse: true },
    { x: 140, h: 130, rate: "8%", color: "#3f7a5f" },
    { x: 220, h: 100, rate: "6%", color: "#3f7a5f" },
    { x: 300, h: 70, rate: "4%", color: "#3f7a5f" }
  ];
  const baseY = 210;
  return (
    <figure className="my-10">
      <div className="w-full rounded-[2rem] border border-line bg-surface p-6 shadow-[0_18px_40px_-34px_rgba(33,53,48,0.2)]">
        <svg viewBox="0 0 400 270" className="h-auto w-full" role="img" aria-label="Loan balances by interest rate, with the highest rate marked to pay first">
          <line x1="40" x2="370" y1={baseY} y2={baseY} stroke="#243d35" strokeOpacity="0.18" />
          {bars.map((b, i) => (
            <g key={i}>
              <rect className={b.pulse ? "emt-pulse" : "emt-grow-bar"} x={b.x} y={baseY - b.h} width="46" height={b.h} rx="6" fill={b.color} />
              <text x={b.x + 23} y={baseY - b.h - 10} fontSize="14" fontWeight="700" fill="#243d35" textAnchor="middle">{b.rate}</text>
            </g>
          ))}
          <g className="emt-float">
            <rect x="38" y="28" width="92" height="26" rx="13" fill="#c8821e" />
            <text x="84" y="46" fontSize="13" fontWeight="700" fill="#ffffff" textAnchor="middle">Pay first</text>
          </g>
          <text x="200" y="248" fontSize="12" fill="#5b6b66" textAnchor="middle">Loan balances — avalanche attacks the highest rate</text>
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-500">Avalanche pays the highest rate first (orange). Snowball would pick the smallest balance instead. Same effort, different interest saved.</figcaption>
    </figure>
  );
}

export function LifeInsuranceDiagram() {
  return (
    <figure className="my-10">
      <div className="w-full rounded-[2rem] border border-line bg-surface p-6 shadow-[0_18px_40px_-34px_rgba(33,53,48,0.2)]">
        <svg viewBox="0 0 400 270" className="h-auto w-full" role="img" aria-label="Coverage need equals income gap plus debts minus savings">
          <rect x="34" y="96" width="62" height="84" rx="8" fill="#3f7a5f" />
          <text x="65" y="132" fontSize="12" fill="#ffffff" textAnchor="middle">Income</text>
          <text x="65" y="148" fontSize="12" fill="#ffffff" textAnchor="middle">gap</text>
          <rect x="104" y="96" width="50" height="84" rx="8" fill="#243d35" />
          <text x="129" y="132" fontSize="12" fill="#ffffff" textAnchor="middle">Mort-</text>
          <text x="129" y="148" fontSize="12" fill="#ffffff" textAnchor="middle">gage</text>
          <rect x="162" y="96" width="44" height="84" rx="8" fill="#3f7a5f" />
          <text x="184" y="132" fontSize="12" fill="#ffffff" textAnchor="middle">Other</text>
          <text x="184" y="148" fontSize="12" fill="#ffffff" textAnchor="middle">debt</text>
          <rect x="220" y="108" width="50" height="60" rx="8" fill="#cdd8d4" />
          <text x="245" y="142" fontSize="12" fill="#243d35" textAnchor="middle">Saved</text>
          <g className="emt-float">
            <path d="M286 136h26" stroke="#243d35" strokeWidth="3" strokeLinecap="round" />
            <path d="M308 128l10 8-10 8" fill="none" stroke="#243d35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <rect className="emt-pulse" x="332" y="82" width="50" height="104" rx="8" fill="#c8821e" />
          <text x="357" y="130" fontSize="12" fill="#ffffff" textAnchor="middle">Cover-</text>
          <text x="357" y="146" fontSize="12" fill="#ffffff" textAnchor="middle">age</text>
          <text x="200" y="214" fontSize="12" fill="#5b6b66" textAnchor="middle">Add what your family would lose and owe, subtract what you have saved</text>
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-500">Add the income your family would lose and your debts, subtract what you already have saved, and the remainder is the amount to insure.</figcaption>
    </figure>
  );
}
