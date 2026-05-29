"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { clamp, formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import { getCalculatorPresets } from "@/lib/calculator-presets";
import { getCalculatorBySlug } from "@/lib/calculator-registry";

const EMPTY_INPUTS = [];

function getAllInputs(calculator) {
  return [...(calculator.inputs || []), ...(calculator.advancedInputs || [])];
}

function normalizeDefaults(calculator) {
  return Object.fromEntries(getAllInputs(calculator).map((input) => [input.name, calculator.defaults[input.name] ?? 0]));
}

function parseInitialValues(calculator, initialQuery = {}) {
  const defaults = normalizeDefaults(calculator);
  return Object.fromEntries(
    getAllInputs(calculator).map((input) => {
      const rawValue = initialQuery[input.name];
      const parsedValue = rawValue !== undefined ? Number(rawValue) : defaults[input.name];
      return [input.name, Number.isFinite(parsedValue) ? parsedValue : defaults[input.name]];
    })
  );
}

function deriveSliderRange(input, currentValue) {
  if (typeof input.max === "number") {
    return { min: input.min ?? 0, max: input.max };
  }

  const min = input.min ?? 0;
  const step = input.step ?? 1;
  const name = input.name.toLowerCase();
  const baseline = Math.max(Number(currentValue) || 0, Number(input.min) || 0, Number(step) || 1);

  if (name.includes("rate") || name.includes("apr") || name.includes("return")) {
    return { min, max: Math.max(12, Math.ceil(baseline / 5) * 5 + 10) };
  }

  if (name.includes("year")) {
    return { min, max: Math.max(10, Math.ceil(baseline / 5) * 5 + 10) };
  }

  if (name.includes("month")) {
    return { min, max: Math.max(min + step * 12, Math.ceil(baseline / 250) * 250 + 1000) };
  }

  const padded = Math.ceil(baseline * 1.8);
  const rounded = Math.ceil(padded / Math.max(step, 1)) * Math.max(step, 1);
  return { min, max: Math.max(min + step * 10, rounded) };
}

function formatInputValue(input, value) {
  if (input.suffix === "%") {
    return formatPercent(value);
  }

  if (input.prefix === "$") {
    return formatCurrency(value);
  }

  return formatNumber(value);
}

function buildChartPath(points, width, height) {
  if (!points.length) {
    return "";
  }

  const max = Math.max(...points.map((point) => point.amount), 1);
  const min = Math.min(...points.map((point) => point.amount), 0);
  const range = Math.max(max - min, 1);

  return points
    .map((point, index) => {
      const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
      const y = height - ((point.amount - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(points, width, height) {
  if (!points.length) {
    return "";
  }

  const max = Math.max(...points.map((point) => point.amount), 1);
  const min = Math.min(...points.map((point) => point.amount), 0);
  const range = Math.max(max - min, 1);

  const top = points.map((point, index) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
    const y = height - ((point.amount - min) / range) * height;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return `${top.join(" ")} L ${width} ${height} L 0 ${height} Z`;
}

function buildComparisonPath(series, width, height, key, min, max) {
  if (!series?.length) {
    return "";
  }

  const range = Math.max(max - min, 1);

  return series
    .map((point, index) => {
      const x = series.length === 1 ? width / 2 : (index / (series.length - 1)) * width;
      const y = height - ((point[key] - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function getTimelineMode(timeline) {
  if (timeline.length >= 4 && timeline.every((point) => /^Year|^Month/.test(point.label))) {
    return "line";
  }

  return "bar";
}

function summarizeChange(timeline) {
  if (timeline.length < 2) {
    return null;
  }

  const start = timeline[0].amount;
  const end = timeline[timeline.length - 1].amount;
  const delta = end - start;
  const direction = delta >= 0 ? "up" : "down";

  return {
    direction,
    delta,
    percent: start !== 0 ? (delta / Math.abs(start)) * 100 : null
  };
}

function getResultNarrative(calculator, values, result) {
  const change = summarizeChange(result.timeline);

  switch (calculator.slug) {
    case "compound-interest-calculator":
    case "retirement-calculator": {
      const horizonName = calculator.slug === "compound-interest-calculator" ? "years" : "yearsToRetirement";
      const baseAmount = calculator.slug === "compound-interest-calculator" ? Number(values.initialAmount) : Number(values.currentSavings);
      const months = Number(values[horizonName]) * 12;
      const contributions = Number(values.monthlyContribution) * months + baseAmount;
      const ending = result.timeline.at(-1)?.amount ?? contributions;
      const growthShare = ending > 0 ? Math.max(0, (ending - contributions) / ending) : 0;

      return [
        {
          title: "Growth engine",
          body: `${formatPercent(growthShare * 100)} of the projected ending balance comes from returns rather than direct deposits.`
        },
        {
          title: "Planning cue",
          body: `At the current pace, ${formatCurrency(Number(values.monthlyContribution))} per month compounds over ${formatNumber(values[horizonName])} years into a materially larger outcome.`
        }
      ];
    }

    case "mortgage-calculator":
    case "loan-calculator": {
      const principal =
        calculator.slug === "mortgage-calculator"
          ? Math.max(0, Number(values.homePrice) - Number(values.downPayment))
          : Number(values.loanAmount);
      const ending = result.timeline.at(-1)?.amount ?? 0;
      const payoffShare = principal > 0 ? 1 - ending / principal : 1;

      return [
        {
          title: "Paydown progress",
          body: `${formatPercent(payoffShare * 100)} of the original balance is gone by the last point shown on the payoff path.`
        },
        {
          title: "Cost pressure",
          body: `The payment works best if it still leaves enough room for savings and irregular expenses after the loan clears each month.`
        }
      ];
    }

    case "debt-payoff-calculator":
      return [
        {
          title: "Timeline reading",
          body: result.timeline.length
            ? "The balance trend falls as each payment chips away at principal after covering interest."
            : "The current payment is too low to create reliable payoff progress."
        },
        {
          title: "Planning cue",
          body: "Even a modest payment increase can shorten the timeline because less interest keeps recycling into the balance."
        }
      ];

    case "inflation-calculator":
      return [
        {
          title: "Purchasing power",
          body: "Inflation compounds quietly. The future-cost line shows what today's spending target could become if prices keep climbing."
        },
        {
          title: "Planning cue",
          body: "Read this alongside savings and retirement projections so your target is set in real, not just nominal, dollars."
        }
      ];

    case "budget-calculator": {
      const income = Number(values.monthlyIncome) || 1;
      const leftover =
        Number(values.monthlyIncome) - Number(values.housing) - Number(values.debt) - Number(values.essentials) - Number(values.savings);
      return [
        {
          title: "Cash-flow buffer",
          body: `${formatCurrency(leftover)} remains after planned allocations, or ${formatPercent((leftover / income) * 100)} of take-home pay.`
        },
        {
          title: "Planning cue",
          body:
            leftover < 0
              ? "The plan is overallocated. Reduce fixed spending or savings targets before treating the budget as workable."
              : "A positive leftover buffer gives the month room for irregular bills and spending drift."
        }
      ];
    }

    case "emergency-fund-calculator":
      return [
        {
          title: "Coverage goal",
          body: "The target is sized from essential expenses, which is the right base for a job loss or income shock scenario."
        },
        {
          title: "Planning cue",
          body: "Treat the monthly contribution like a fixed bill so the fund builds automatically instead of relying on leftover cash."
        }
      ];

    case "net-worth-calculator":
      return [
        {
          title: "Balance sheet read",
          body: "Net worth improves when assets rise faster than liabilities. The bar view helps show where the largest concentrations sit today."
        },
        {
          title: "Planning cue",
          body: "Track this every quarter or twice a year. Trend matters more than one isolated snapshot."
        }
      ];

    default:
      return [
        {
          title: "Result reading",
          body: change
            ? `The visual trend is moving ${change.direction}, with an approximate change of ${formatCurrency(change.delta)} across the period shown.`
            : result.note
        },
        {
          title: "Planning cue",
          body: "Use the output as a scenario test rather than a promise. Small input changes can materially change the result."
        }
      ];
  }
}

function TrendChart({ timeline }) {
  const width = 520;
  const height = 180;
  const linePath = buildChartPath(timeline, width, height);
  const areaPath = buildAreaPath(timeline, width, height);
  const max = Math.max(...timeline.map((point) => point.amount), 1);
  const min = Math.min(...timeline.map((point) => point.amount), 0);
  const mode = getTimelineMode(timeline);

  if (!timeline.length) {
    return <p className="mt-4 text-sm leading-7 text-slate-300">No timeline is available for the current inputs.</p>;
  }

  if (mode === "bar") {
    return (
      <div className="mt-4 space-y-3">
        {timeline.map((point) => (
          <div key={point.label} className="grid grid-cols-[92px_1fr_auto] items-center gap-3">
            <span className="text-sm text-slate-300">{point.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-sky-200 to-slate-100"
                style={{
                  width: `${Math.max(6, Math.min(100, (Math.abs(point.amount) / Math.max(Math.abs(max), Math.abs(min), 1)) * 100))}%`
                }}
              />
            </div>
            <span className="text-sm font-medium text-white">{formatCurrency(point.amount)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
      <svg viewBox={`0 0 ${width} ${height + 24}`} className="h-56 w-full" role="img" aria-label="Projection chart">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(133,161,149,0.2)" />
            <stop offset="100%" stopColor="rgba(133,161,149,0.02)" />
          </linearGradient>
          <linearGradient id="chartLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#8ba79b" />
            <stop offset="50%" stopColor="#9bafbd" />
            <stop offset="100%" stopColor="#d8dde1" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1="0"
            x2={width}
            y1={(height * fraction).toFixed(2)}
            y2={(height * fraction).toFixed(2)}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="5 7"
          />
        ))}
        <path d={areaPath} fill="url(#chartFill)" transform="translate(0 8)" />
        <path d={linePath} fill="none" stroke="url(#chartLine)" strokeWidth="4" strokeLinecap="round" transform="translate(0 8)" />
        {timeline.map((point, index) => {
          const x = timeline.length === 1 ? width / 2 : (index / (timeline.length - 1)) * width;
          const y = height - ((point.amount - min) / Math.max(max - min, 1)) * height + 8;

          return (
            <g key={point.label}>
              <circle cx={x} cy={y} r="5" fill="#f6f7f5" stroke="#7f998e" strokeWidth="3" />
              <text
                x={x}
                y={height + 22}
                fill="rgba(255,255,255,0.72)"
                fontSize="12"
                textAnchor={index === 0 ? "start" : index === timeline.length - 1 ? "end" : "middle"}
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ComparisonChart({ comparison }) {
  if (!comparison?.series?.length) {
    return null;
  }

  const width = 520;
  const height = 180;
  const max = Math.max(...comparison.series.map((point) => Math.max(point.currentAmount, point.delayedAmount)), 1);
  const min = Math.min(...comparison.series.map((point) => Math.min(point.currentAmount, point.delayedAmount)), 0);
  const currentPath = buildComparisonPath(comparison.series, width, height, "currentAmount", min, max);
  const delayedPath = buildComparisonPath(comparison.series, width, height, "delayedAmount", min, max);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">{comparison.title}</p>
        <p className="text-sm font-medium text-[#c4d2db]">
          {comparison.differenceLabel}: {formatCurrency(comparison.differenceValue)}
        </p>
      </div>
      <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-2 text-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8ba79b]" />
            {comparison.currentLabel}
          </span>
          <span className="inline-flex items-center gap-2 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-[#a7bac6]" />
            {comparison.delayedLabel}
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height + 24}`} className="h-56 w-full" role="img" aria-label="Comparison chart">
          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              x2={width}
              y1={(height * fraction).toFixed(2)}
              y2={(height * fraction).toFixed(2)}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="5 7"
            />
          ))}
          <path d={currentPath} fill="none" stroke="#86efac" strokeWidth="4" strokeLinecap="round" transform="translate(0 8)" />
          <path d={delayedPath} fill="none" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8" transform="translate(0 8)" />
          {comparison.series.map((point, index) => {
            const x = comparison.series.length === 1 ? width / 2 : (index / (comparison.series.length - 1)) * width;
            return (
              <text
                key={point.label}
                x={x}
                y={height + 22}
                fill="rgba(255,255,255,0.72)"
                fontSize="12"
                textAnchor={index === 0 ? "start" : index === comparison.series.length - 1 ? "end" : "middle"}
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function BreakdownBars({ items }) {
  if (!items?.length) {
    return null;
  }

  const max = Math.max(...items.map((item) => Math.abs(item.amount)), 1);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">Breakdown</p>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cost mix</p>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[92px_1fr_auto] items-center gap-3">
            <span className="text-sm text-slate-300">{item.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-300 via-emerald-300 to-slate-100"
                style={{
                  width: `${Math.max(8, Math.min(100, (Math.abs(item.amount) / max) * 100))}%`
                }}
              />
            </div>
            <span className="text-sm font-medium text-white">{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AmortizationTable({ rows }) {
  if (!rows?.length) {
    return null;
  }

  return (
    <details className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white">
        <span>Amortization schedule</span>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Yearly view</span>
      </summary>
      <div className="overflow-x-auto border-t border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-5 py-3 font-medium">Period</th>
              <th className="px-5 py-3 font-medium">Avg payment</th>
              <th className="px-5 py-3 font-medium">Principal paid</th>
              <th className="px-5 py-3 font-medium">Interest paid</th>
              <th className="px-5 py-3 font-medium">Ending balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period} className="border-t border-white/10 text-slate-200">
                <td className="px-5 py-3">{row.period}</td>
                <td className="px-5 py-3">{formatCurrency(row.payment)}</td>
                <td className="px-5 py-3">{formatCurrency(row.principalPaid)}</td>
                <td className="px-5 py-3">{formatCurrency(row.interestPaid)}</td>
                <td className="px-5 py-3">{formatCurrency(row.endingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function InputGroup({ input, value, onChange }) {
  const [draftValue, setDraftValue] = useState(value);
  const commitTimerRef = useRef(null);
  const sliderRange = deriveSliderRange(input, draftValue);
  const sliderValue = clamp(Number(draftValue) || 0, sliderRange.min, sliderRange.max);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) {
        window.clearTimeout(commitTimerRef.current);
      }
    };
  }, []);

  function commitValue(nextValue) {
    if (commitTimerRef.current) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }

    onChange(nextValue);
  }

  function scheduleCommit(nextValue) {
    if (commitTimerRef.current) {
      window.clearTimeout(commitTimerRef.current);
    }

    commitTimerRef.current = window.setTimeout(() => {
      onChange(nextValue);
      commitTimerRef.current = null;
    }, 90);
  }

  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-4 text-sm font-medium text-[#51675d]">
        <span>{input.label}</span>
        <span className="font-semibold text-[#1d3128]">{formatInputValue(input, draftValue)}</span>
      </span>
      <div className="flex items-center rounded-2xl border border-[#d0d9d8] bg-[#f6f8f7] px-4 py-3 focus-within:border-[#8d9ca5] focus-within:bg-[#fcfcfb]">
        {input.prefix ? <span className="mr-2 text-[#73837a]">{input.prefix}</span> : null}
        <input
          type="number"
          min={input.min}
          step={input.step}
          value={draftValue}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            setDraftValue(nextValue);
            commitValue(nextValue);
          }}
          className="w-full bg-transparent text-lg font-medium text-[#1d3128] outline-none"
        />
        {input.suffix ? <span className="ml-2 text-[#73837a]">{input.suffix}</span> : null}
      </div>
      <input
        type="range"
        min={sliderRange.min}
        max={sliderRange.max}
        step={input.step ?? 1}
        value={sliderValue}
        onInput={(event) => {
          const nextValue = Number(event.currentTarget.value);
          setDraftValue(nextValue);
          scheduleCommit(nextValue);
        }}
        onPointerUp={(event) => commitValue(Number(event.currentTarget.value))}
        onKeyUp={(event) => {
          if (event.key.startsWith("Arrow") || event.key === "Home" || event.key === "End" || event.key === "PageUp" || event.key === "PageDown") {
            commitValue(Number(event.currentTarget.value));
          }
        }}
        className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#dee4e2] accent-[#4b665d]"
      />
    </label>
  );
}

export function CalculatorForm({ calculatorSlug }) {
  const calculator = getCalculatorBySlug(calculatorSlug);
  const presets = getCalculatorPresets(calculatorSlug);
  const [values, setValues] = useState(() => normalizeDefaults(calculator));
  const advancedInputs = calculator.advancedInputs || EMPTY_INPUTS;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const queryReadyRef = useRef(false);
  const deferredValues = useDeferredValue(values);

  const result = useMemo(() => calculator.compute(deferredValues), [calculator, deferredValues]);
  const narrative = useMemo(() => getResultNarrative(calculator, deferredValues, result), [calculator, result, deferredValues]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentQuery = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const nextValues = parseInitialValues(calculator, currentQuery);
    const nextShowAdvanced = advancedInputs.some((input) => Number(currentQuery[input.name] ?? 0) > 0);

    setValues((current) => {
      const changed = getAllInputs(calculator).some((input) => Number(current[input.name]) !== Number(nextValues[input.name]));
      return changed ? nextValues : current;
    });
    setShowAdvanced(nextShowAdvanced);
    queryReadyRef.current = true;
  }, [calculator]);

  useEffect(() => {
    if (!queryReadyRef.current || typeof window === "undefined") {
      return;
    }

    const currentQuery = new URLSearchParams(window.location.search);
    const nextParams = new URLSearchParams();

    getAllInputs(calculator).forEach((input) => {
      const currentValue = Number(values[input.name]);
      const defaultValue = Number(calculator.defaults[input.name] ?? 0);
      if (currentValue !== defaultValue) {
        nextParams.set(input.name, String(currentValue));
      }
    });

    if (nextParams.toString() === currentQuery.toString()) {
      return;
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [calculator, values]);


  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)] sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">{calculator.category}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d3128]">Try the calculator</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setValues(normalizeDefaults(calculator));
              setShowAdvanced(false);
            }}
            className="rounded-full border border-[#d0d9d8] px-4 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#8d9ca5] hover:text-[#556874]"
          >
            Reset
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {(calculator.inputs || []).map((input) => (
            <InputGroup
              key={input.name}
              input={input}
              value={values[input.name]}
              onChange={(nextValue) =>
                startTransition(() => {
                  setValues((current) => ({
                    ...current,
                    [input.name]: nextValue
                  }));
                })
              }
            />
          ))}
        </div>

        {advancedInputs.length ? (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#1d3128]">Advanced housing costs</p>
              <button
                type="button"
                onClick={() => setShowAdvanced((current) => !current)}
                className="rounded-full border border-[#d0d9d8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#61746b] transition hover:border-[#8d9ca5] hover:text-[#556874]"
              >
                {showAdvanced ? "Hide extras" : "Add taxes and fees"}
              </button>
            </div>
            {showAdvanced ? (
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {advancedInputs.map((input) => (
                  <InputGroup
                    key={input.name}
                    input={input}
                    value={values[input.name]}
                    onChange={(nextValue) =>
                      startTransition(() => {
                        setValues((current) => ({
                          ...current,
                          [input.name]: nextValue
                        }));
                      })
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {presets.length ? (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#1d3128]">Scenario presets</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#73837a]">Quick compare</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setValues((current) => ({ ...current, ...preset.values }));
                    if (advancedInputs.length) {
                      setShowAdvanced(advancedInputs.some((input) => Number(preset.values[input.name] ?? 0) > 0));
                    }
                  }}
                  className="rounded-[1.25rem] border border-[#dde3e5] bg-[#f3f6f7] px-4 py-4 text-left transition hover:border-[#bec8ce] hover:bg-[#fcfcfb]"
                >
                  <p className="text-sm font-semibold text-[#1d3128]">{preset.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#5d7067]">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 rounded-[1.75rem] border border-[#d8e1dd] bg-[#edf2f0] p-5">
          <p className="text-sm font-semibold text-[#1d3128]">Example</p>
          <p className="mt-2 text-base leading-7 text-[#556a61]">{calculator.example}</p>
        </div>
      </section>

      <section className="rounded-[2rem] bg-[#223832] p-6 text-white shadow-[0_18px_42px_-30px_rgba(34,56,50,0.34)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8cbc3]">Results</p>
        <div className="mt-6 grid gap-4">
          {result.summary.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          {result.details.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 border-b border-white/10 py-3 text-sm">
              <span className="text-slate-300">{item.label}</span>
              <span className="font-medium text-white">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-white">Projection</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {getTimelineMode(result.timeline) === "line" ? "Trend view" : "Distribution view"}
            </p>
          </div>
          <TrendChart timeline={result.timeline} />
        </div>

        {result.milestones?.length ? (
          <div className="mt-8 grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white">Milestones</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Decision cues</p>
            </div>
            {result.milestones.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 text-sm">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        <BreakdownBars items={result.breakdown} />
        <AmortizationTable rows={result.amortizationTable} />
        <ComparisonChart comparison={result.comparison} />

        <div className="mt-8 grid gap-4">
          {narrative.map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-7 text-slate-300">{result.note}</p>
      </section>
    </div>
  );
}
