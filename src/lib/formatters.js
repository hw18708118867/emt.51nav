export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCurrencyPrecise(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value) {
  return `${Number(value).toFixed(1)}%`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatYearsAndMonths(months) {
  const wholeYears = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);

  if (wholeYears === 0) {
    return `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return `${wholeYears} years`;
  }

  return `${wholeYears} years ${remainingMonths} months`;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
