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

const categoryIcons = {
  Mortgage: MortgageIcon,
  Debt: DebtIcon,
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
