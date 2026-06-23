import {
  formatCurrency,
  formatCurrencyPrecise,
  formatNumber,
  formatPercent,
  formatYearsAndMonths
} from "@/lib/formatters";

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function paymentForLoan(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  return (
    (principal * monthlyRate * (1 + monthlyRate) ** numberOfPayments) /
    ((1 + monthlyRate) ** numberOfPayments - 1)
  );
}

// 2025 federal brackets and standard deductions (estimate; state tax excluded).
const FEDERAL_BRACKETS_2025 = {
  single: [
    [0, 0.1],
    [11925, 0.12],
    [48475, 0.22],
    [103350, 0.24],
    [197300, 0.32],
    [250525, 0.35],
    [626350, 0.37]
  ],
  married: [
    [0, 0.1],
    [23850, 0.12],
    [96950, 0.22],
    [206700, 0.24],
    [394600, 0.32],
    [501050, 0.35],
    [751600, 0.37]
  ]
};

const STANDARD_DEDUCTION_2025 = { single: 15000, married: 30000 };
const SOCIAL_SECURITY_WAGE_BASE_2025 = 176100;

function federalIncomeTax(taxableIncome, status = "single") {
  const brackets = FEDERAL_BRACKETS_2025[status] || FEDERAL_BRACKETS_2025.single;
  const income = Math.max(0, taxableIncome);
  let tax = 0;

  for (let i = 0; i < brackets.length; i += 1) {
    const [floor, rate] = brackets[i];
    const ceiling = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity;

    if (income > floor) {
      tax += (Math.min(income, ceiling) - floor) * rate;
    } else {
      break;
    }
  }

  return tax;
}

function ficaTax(gross) {
  const wages = Math.max(0, gross);
  const socialSecurity = Math.min(wages, SOCIAL_SECURITY_WAGE_BASE_2025) * 0.062;
  const medicare = wages * 0.0145;
  return { socialSecurity, medicare, total: socialSecurity + medicare };
}

function buildBalanceSeries({ openingBalance, months, monthlyRate, monthlyContribution = 0 }) {
  let balance = openingBalance;
  const series = [];

  for (let month = 1; month <= months; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;

    if (month % 12 === 0 || month === months) {
      series.push({
        label: `Year ${Math.ceil(month / 12)}`,
        amount: roundCurrency(balance)
      });
    }
  }

  return series;
}

function buildStartDelayComparison({ openingBalance, monthlyContribution, monthlyRate, months, delayMonths }) {
  if (months <= 12 || delayMonths <= 0 || delayMonths >= months) {
    return null;
  }

  let startNowBalance = openingBalance;
  let waitBalance = openingBalance;
  const series = [];

  for (let month = 1; month <= months; month += 1) {
    startNowBalance = startNowBalance * (1 + monthlyRate) + monthlyContribution;
    waitBalance = waitBalance * (1 + monthlyRate) + (month > delayMonths ? monthlyContribution : 0);

    if (month % 12 === 0 || month === months) {
      series.push({
        label: `Year ${Math.ceil(month / 12)}`,
        currentAmount: roundCurrency(startNowBalance),
        delayedAmount: roundCurrency(waitBalance)
      });
    }
  }

  return {
    title: "Start now vs wait",
    currentLabel: "Start now",
    delayedLabel: `Wait ${formatYearsAndMonths(delayMonths)}`,
    differenceLabel: "Gap created by waiting",
    differenceValue: roundCurrency(startNowBalance - waitBalance),
    series
  };
}

function buildAmortizationSeries({ principal, annualRate, years, payment }) {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  let balance = principal;
  const series = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = payment - interest;
    balance = Math.max(0, balance - principalPaid);

    if (month % 12 === 0 || balance === 0) {
      series.push({
        label: `Year ${Math.ceil(month / 12)}`,
        amount: roundCurrency(balance)
      });
    }

    if (balance === 0) {
      break;
    }
  }

  return series;
}

function buildAmortizationTable({ principal, annualRate, years, payment }) {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  let balance = principal;
  let interestYear = 0;
  let principalYear = 0;
  const rows = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    const openingBalance = balance;
    const interest = openingBalance * monthlyRate;
    const principalPaid = Math.min(payment - interest, openingBalance);
    balance = Math.max(0, openingBalance - principalPaid);
    interestYear += interest;
    principalYear += principalPaid;

    if (month % 12 === 0 || balance === 0) {
      rows.push({
        period: `Year ${Math.ceil(month / 12)}`,
        payment: roundCurrency((interestYear + principalYear) / Math.max(month % 12 || 12, 1)),
        principalPaid: roundCurrency(principalYear),
        interestPaid: roundCurrency(interestYear),
        endingBalance: roundCurrency(balance)
      });
      interestYear = 0;
      principalYear = 0;
    }

    if (balance === 0) {
      break;
    }
  }

  return rows;
}

function buildLoanBreakdown({ principal, totalPaid, totalInterest, years, payment }) {
  const totalMonths = years * 12;
  const firstYearPaid = Math.min(totalPaid, payment * Math.min(12, totalMonths));

  return {
    breakdown: [
      { label: "Principal", amount: roundCurrency(principal) },
      { label: "Interest", amount: roundCurrency(totalInterest) }
    ],
    milestones: [
      { label: "Monthly payment", value: formatCurrencyPrecise(payment) },
      { label: "First-year cash outflow", value: formatCurrency(firstYearPaid) },
      { label: "Loan lifetime payments", value: formatCurrency(totalPaid) }
    ]
  };
}

function buildPayoffSeries({ balance, annualRate, payment }) {
  const monthlyRate = annualRate / 100 / 12;
  let currentBalance = balance;
  let month = 0;
  let totalInterest = 0;
  const series = [];

  if (payment <= currentBalance * monthlyRate) {
    return {
      warning: "Your monthly payment is too low to cover the interest charge.",
      months: null,
      totalInterest: null,
      series: []
    };
  }

  while (currentBalance > 0 && month < 600) {
    month += 1;
    const interest = currentBalance * monthlyRate;
    const principalPaid = payment - interest;
    totalInterest += interest;
    currentBalance = Math.max(0, currentBalance - principalPaid);

    if (month % 12 === 0 || currentBalance === 0) {
      series.push({
        label: `Year ${Math.ceil(month / 12)}`,
        amount: roundCurrency(currentBalance)
      });
    }
  }

  return {
    months: month,
    totalInterest,
    warning: null,
    series
  };
}

function amortizeWithExtra({ principal, annualRate, years, extraMonthly = 0 }) {
  const monthlyRate = annualRate / 100 / 12;
  const scheduledMonths = years * 12;
  const basePayment = paymentForLoan(principal, annualRate, years);
  let balance = principal;
  let month = 0;
  let totalInterest = 0;
  const series = [];

  while (balance > 0 && month < scheduledMonths + 1) {
    month += 1;
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(basePayment + extraMonthly - interest, balance);

    if (principalPaid <= 0) {
      return { months: null, totalInterest: null, basePayment, series: [], warning: "Payment does not cover monthly interest." };
    }

    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;

    if (month % 12 === 0 || balance === 0) {
      series.push({ label: `Year ${Math.ceil(month / 12)}`, amount: roundCurrency(balance) });
    }

    if (balance === 0) {
      break;
    }
  }

  return { months: month, totalInterest, basePayment, series, warning: null };
}

function buildRentBuyProjection({
  homePrice,
  downPayment,
  annualRate,
  years,
  annualPropertyTaxRate,
  annualMaintenanceRate,
  annualHomeAppreciation,
  monthlyRent,
  annualRentIncrease
}) {
  const loanYears = 30;
  const principal = Math.max(0, homePrice - downPayment);
  const payment = paymentForLoan(principal, annualRate, loanYears);
  const monthlyRate = annualRate / 100 / 12;

  let balance = principal;
  let buyOutflow = downPayment;
  let rentOutflow = 0;
  let rent = monthlyRent;
  let homeValue = homePrice;
  const series = [];

  for (let month = 1; month <= years * 12; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);

    const monthlyTax = (homeValue * (annualPropertyTaxRate / 100)) / 12;
    const monthlyMaintenance = (homeValue * (annualMaintenanceRate / 100)) / 12;
    buyOutflow += payment + monthlyTax + monthlyMaintenance;
    rentOutflow += rent;

    if (month % 12 === 0) {
      homeValue *= 1 + annualHomeAppreciation / 100;
      rent *= 1 + annualRentIncrease / 100;
      const homeEquity = homeValue - balance;
      const buyNetCost = buyOutflow - homeEquity;
      series.push({
        label: `Year ${month / 12}`,
        currentAmount: roundCurrency(rentOutflow),
        delayedAmount: roundCurrency(buyNetCost)
      });
    }
  }

  const finalEquity = homeValue - balance;
  const buyNetCost = buyOutflow - finalEquity;

  return {
    payment,
    rentTotal: rentOutflow,
    buyOutflow,
    finalEquity,
    buyNetCost,
    homeValue,
    series
  };
}

export const calculatorRegistry = [
  {
    slug: "mortgage-amortization-calculator",
    name: "Mortgage Amortization Calculator",
    category: "Mortgage",
    ogImagePath: "/og/calculators/mortgage-amortization-calculator.svg",
    description: "See a full year-by-year amortization schedule showing how each mortgage payment splits between principal and interest.",
    intro:
      "Enter your loan amount, rate, and term to build a complete amortization table and watch how the principal share of every payment grows over time.",
    keywords: [
      "mortgage amortization calculator",
      "amortization schedule with extra payments",
      "how much of my mortgage payment goes to principal"
    ],
    defaults: {
      loanAmount: 360000,
      annualRate: 6.4,
      years: 30
    },
    inputs: [
      { name: "loanAmount", label: "Loan amount", prefix: "$", min: 10000, step: 5000 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Loan term", suffix: "years", min: 5, step: 5 }
    ],
    presets: true,
    example: "Early in a 30-year loan most of each payment is interest, but the principal share climbs steadily as the balance falls.",
    sections: [
      {
        title: "What an amortization schedule shows",
        body:
          "Amortization is the process of paying off a loan with fixed payments over time. Each payment covers the interest charged that month first, and whatever is left reduces the principal. The schedule below tracks that split year by year."
      },
      {
        title: "Why early payments feel slow",
        body:
          "At the start the balance is large, so the interest portion of each payment is high and principal moves slowly. As the balance shrinks, less interest is charged and more of every payment attacks the principal, which is why payoff accelerates near the end."
      },
      {
        title: "Reading the schedule",
        body:
          "Use the yearly table to see the ending balance, principal paid, and interest paid for each year. This is the clearest way to understand the true cost of the loan and the point where you finally cross the halfway mark on principal."
      }
    ],
    faqs: [
      {
        question: "Why is so much of my early payment interest?",
        answer: "Interest is charged on the outstanding balance, which is highest at the start. As you pay the balance down, the interest portion shrinks and the principal portion grows automatically."
      },
      {
        question: "When does principal overtake interest in a payment?",
        answer: "For a typical 30-year loan near 6 to 7 percent, the principal portion usually passes the interest portion somewhere in the middle third of the loan, though the exact crossover depends on your rate and term."
      }
    ],
    related: ["mortgage-calculator", "extra-payment-mortgage-calculator", "refinance-calculator"],
    compute(values) {
      const principal = Number(values.loanAmount);
      const payment = paymentForLoan(principal, Number(values.annualRate), Number(values.years));
      const totalPaid = payment * Number(values.years) * 12;
      const totalInterest = totalPaid - principal;
      const table = buildAmortizationTable({
        principal,
        annualRate: Number(values.annualRate),
        years: Number(values.years),
        payment
      });

      return {
        summary: [
          { label: "Monthly payment", value: formatCurrencyPrecise(payment) },
          { label: "Total interest", value: formatCurrency(totalInterest) },
          { label: "Total of payments", value: formatCurrency(totalPaid) }
        ],
        details: [
          { label: "Loan amount", value: formatCurrency(principal) },
          { label: "Interest rate", value: formatPercent(values.annualRate) },
          { label: "Loan term", value: `${values.years} years` },
          { label: "Interest as share of payments", value: formatPercent((totalInterest / totalPaid) * 100 || 0) }
        ],
        timeline: buildAmortizationSeries({
          principal,
          annualRate: Number(values.annualRate),
          years: Number(values.years),
          payment
        }),
        amortizationTable: table,
        breakdown: [
          { label: "Principal", amount: roundCurrency(principal) },
          { label: "Interest", amount: roundCurrency(totalInterest) }
        ],
        note: "This schedule assumes a fixed rate and the same payment every month for the full term."
      };
    }
  },
  {
    slug: "refinance-calculator",
    name: "Refinance Calculator",
    category: "Mortgage",
    ogImagePath: "/og/calculators/refinance-calculator.svg",
    description: "Compare your current mortgage with a new refinanced loan to see the monthly savings and how long it takes to break even on closing costs.",
    intro:
      "Enter your existing loan and a new rate to estimate the monthly payment change, the break-even point on closing costs, and whether refinancing is likely worth it.",
    keywords: [
      "refinance calculator break even",
      "is it worth refinancing my mortgage",
      "mortgage refinance savings calculator"
    ],
    defaults: {
      currentBalance: 320000,
      currentRate: 7.5,
      remainingYears: 27,
      newRate: 6.1,
      newTerm: 30,
      closingCosts: 6000
    },
    inputs: [
      { name: "currentBalance", label: "Remaining balance", prefix: "$", min: 10000, step: 5000 },
      { name: "currentRate", label: "Current rate", suffix: "%", min: 0, step: 0.1 },
      { name: "remainingYears", label: "Years left", suffix: "years", min: 1, step: 1 },
      { name: "newRate", label: "New rate", suffix: "%", min: 0, step: 0.1 }
    ],
    advancedInputs: [
      { name: "newTerm", label: "New loan term", suffix: "years", min: 5, step: 5 },
      { name: "closingCosts", label: "Closing costs", prefix: "$", min: 0, step: 250 }
    ],
    presets: true,
    example: "Dropping from 7.5% to 6.1% can cut a few hundred dollars off the monthly payment, but closing costs may take a couple of years to recover.",
    sections: [
      {
        title: "How refinancing math works",
        body:
          "Refinancing replaces your current loan with a new one, ideally at a lower rate. The savings come from the smaller monthly payment, but you usually pay closing costs to get the new loan. The key question is how long it takes the monthly savings to repay those costs."
      },
      {
        title: "The break-even point",
        body:
          "Break-even is closing costs divided by monthly savings. If you plan to stay in the home well past that point, refinancing often makes sense. If you may move or refinance again before then, the upfront cost may not pay off."
      },
      {
        title: "Watch the loan term",
        body:
          "Resetting a 27-year balance into a fresh 30-year loan can lower the payment while quietly increasing total interest because you stretch the balance over more years. Compare lifetime interest, not just the monthly number."
      }
    ],
    faqs: [
      {
        question: "What is a good break-even period for refinancing?",
        answer: "Many people look for a break-even under two to three years, but it depends on how long you plan to keep the home. The longer you stay past break-even, the more the refinance saves."
      },
      {
        question: "Does refinancing reset my loan term?",
        answer: "Usually yes. A new 30-year loan restarts the clock, which can raise total interest even at a lower rate. Choosing a shorter new term avoids that, though the payment savings will be smaller."
      }
    ],
    related: ["mortgage-calculator", "mortgage-amortization-calculator", "extra-payment-mortgage-calculator"],
    compute(values) {
      const balance = Number(values.currentBalance);
      const currentPayment = paymentForLoan(balance, Number(values.currentRate), Number(values.remainingYears));
      const newTerm = Number(values.newTerm) || Number(values.remainingYears);
      const newPayment = paymentForLoan(balance, Number(values.newRate), newTerm);
      const monthlySavings = currentPayment - newPayment;
      const closingCosts = Number(values.closingCosts);
      const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : null;

      const currentTotal = currentPayment * Number(values.remainingYears) * 12;
      const newTotal = newPayment * newTerm * 12 + closingCosts;
      const lifetimeDifference = currentTotal - newTotal;

      return {
        summary: [
          { label: "New monthly payment", value: formatCurrencyPrecise(newPayment) },
          { label: "Monthly savings", value: monthlySavings > 0 ? formatCurrencyPrecise(monthlySavings) : "No monthly savings" },
          {
            label: "Break-even point",
            value: breakEvenMonths ? formatYearsAndMonths(breakEvenMonths) : "Does not break even"
          }
        ],
        details: [
          { label: "Current payment", value: formatCurrencyPrecise(currentPayment) },
          { label: "Closing costs", value: formatCurrency(closingCosts) },
          { label: "New rate", value: formatPercent(values.newRate) },
          { label: "Lifetime cost change", value: formatCurrency(lifetimeDifference) }
        ],
        timeline: buildAmortizationSeries({
          principal: balance,
          annualRate: Number(values.newRate),
          years: newTerm,
          payment: newPayment
        }),
        breakdown: [
          { label: "Current total", amount: roundCurrency(currentTotal) },
          { label: "New total", amount: roundCurrency(newTotal) }
        ],
        milestones: [
          { label: "Current monthly payment", value: formatCurrencyPrecise(currentPayment) },
          { label: "Refinanced monthly payment", value: formatCurrencyPrecise(newPayment) },
          { label: breakEvenMonths ? "Time to recover closing costs" : "Break-even", value: breakEvenMonths ? formatYearsAndMonths(breakEvenMonths) : "Not reached" }
        ],
        note: "Lifetime comparison assumes you keep each loan to the end of its term. Refinancing into a longer term can raise total interest even at a lower rate."
      };
    }
  },
  {
    slug: "home-affordability-calculator",
    name: "Home Affordability Calculator",
    category: "Mortgage",
    ogImagePath: "/og/calculators/home-affordability-calculator.svg",
    description: "Estimate how much house you can afford based on your income, monthly debts, down payment, and current mortgage rates.",
    intro:
      "Enter your income, existing debt payments, and down payment to estimate a realistic home price range using a standard debt-to-income guideline.",
    keywords: [
      "home affordability calculator",
      "how much house can i afford",
      "house i can afford based on salary"
    ],
    defaults: {
      annualIncome: 120000,
      monthlyDebts: 600,
      downPayment: 60000,
      annualRate: 6.4,
      years: 30
    },
    inputs: [
      { name: "annualIncome", label: "Annual income", prefix: "$", min: 20000, step: 1000 },
      { name: "monthlyDebts", label: "Monthly debt payments", prefix: "$", min: 0, step: 50 },
      { name: "downPayment", label: "Down payment", prefix: "$", min: 0, step: 5000 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 }
    ],
    advancedInputs: [
      { name: "years", label: "Loan term", suffix: "years", min: 5, step: 5 }
    ],
    presets: true,
    example: "A higher down payment and lower existing debt both push the affordable price up, often more than a small change in interest rate.",
    sections: [
      {
        title: "How affordability is estimated",
        body:
          "Lenders generally want your total monthly debts, including the new mortgage, to stay under about 36% of your gross monthly income. This calculator uses that guideline to back into the largest mortgage payment you can carry, then converts it into a home price."
      },
      {
        title: "Why your other debts matter",
        body:
          "Car loans, student loans, and credit card minimums all count against the same income limit. Reducing those monthly payments frees up room in your budget and can raise the price you qualify for without earning a dollar more."
      },
      {
        title: "Affordable is not the same as comfortable",
        body:
          "The maximum a lender allows is not always a payment you will enjoy living with. Leave room for savings, maintenance, and the rest of your life before borrowing all the way to the limit."
      }
    ],
    faqs: [
      {
        question: "What debt-to-income ratio do lenders use?",
        answer: "A common guideline keeps total monthly debt payments, including the mortgage, at or below 36% of gross monthly income, though some loan programs allow higher. This tool uses the 36% guideline as a planning baseline."
      },
      {
        question: "Does this include taxes and insurance?",
        answer: "This estimate focuses on principal and interest to keep the price approachable. Property taxes, insurance, and HOA dues will reduce the home price you can actually afford, so treat the result as an upper estimate."
      }
    ],
    related: ["mortgage-calculator", "rent-vs-buy-calculator", "debt-to-income-ratio-calculator"],
    compute(values) {
      const grossMonthly = Number(values.annualIncome) / 12;
      const maxTotalDebt = grossMonthly * 0.36;
      const availableForMortgage = Math.max(0, maxTotalDebt - Number(values.monthlyDebts));
      const years = Number(values.years) || 30;
      const monthlyRate = Number(values.annualRate) / 100 / 12;
      const months = years * 12;

      const maxLoan = monthlyRate === 0
        ? availableForMortgage * months
        : (availableForMortgage * (1 - (1 + monthlyRate) ** -months)) / monthlyRate;
      const maxHomePrice = maxLoan + Number(values.downPayment);

      return {
        summary: [
          { label: "Estimated home price", value: formatCurrency(maxHomePrice) },
          { label: "Maximum mortgage payment", value: formatCurrencyPrecise(availableForMortgage) },
          { label: "Supported loan amount", value: formatCurrency(maxLoan) }
        ],
        details: [
          { label: "Gross monthly income", value: formatCurrencyPrecise(grossMonthly) },
          { label: "Existing monthly debts", value: formatCurrency(values.monthlyDebts) },
          { label: "Down payment", value: formatCurrency(values.downPayment) },
          { label: "Debt-to-income limit used", value: "36%" }
        ],
        timeline: [],
        breakdown: [
          { label: "Down payment", amount: roundCurrency(Number(values.downPayment)) },
          { label: "Mortgage loan", amount: roundCurrency(maxLoan) }
        ],
        milestones: [
          { label: "Affordable home price", value: formatCurrency(maxHomePrice) },
          { label: "Monthly housing budget", value: formatCurrencyPrecise(availableForMortgage) },
          { label: "Down payment share", value: formatPercent((Number(values.downPayment) / Math.max(maxHomePrice, 1)) * 100) }
        ],
        note: "This is a principal-and-interest estimate using a 36% debt-to-income guideline. Taxes, insurance, and HOA will lower the price you can truly afford."
      };
    }
  },
  {
    slug: "rent-vs-buy-calculator",
    name: "Rent vs Buy Calculator",
    category: "Mortgage",
    ogImagePath: "/og/calculators/rent-vs-buy-calculator.svg",
    description: "Compare the long-term net cost of renting versus buying a home over the years you plan to stay, including equity, taxes, and maintenance.",
    intro:
      "Enter a home price, rent, and how long you plan to stay to see which option costs less once equity, appreciation, and ownership costs are included.",
    keywords: [
      "rent vs buy calculator",
      "is it cheaper to rent or buy",
      "renting vs buying a house calculator"
    ],
    defaults: {
      homePrice: 450000,
      downPayment: 90000,
      annualRate: 6.4,
      monthlyRent: 2200,
      years: 7
    },
    inputs: [
      { name: "homePrice", label: "Home price", prefix: "$", min: 50000, step: 5000 },
      { name: "downPayment", label: "Down payment", prefix: "$", min: 0, step: 5000 },
      { name: "annualRate", label: "Mortgage rate", suffix: "%", min: 0, step: 0.1 },
      { name: "monthlyRent", label: "Monthly rent", prefix: "$", min: 200, step: 50 }
    ],
    advancedInputs: [
      { name: "years", label: "Years you will stay", suffix: "years", min: 1, step: 1 }
    ],
    presets: true,
    example: "Buying tends to win the longer you stay, because each year builds equity while rent payments keep leaving for good.",
    sections: [
      {
        title: "Why the timeline decides it",
        body:
          "Buying carries large upfront costs like the down payment and a payment that is mostly interest at first. The longer you stay, the more equity and appreciation work in your favor, which is why a short stay usually favors renting and a long stay usually favors buying."
      },
      {
        title: "What this comparison includes",
        body:
          "The buy side adds up mortgage payments, property tax, and maintenance, then subtracts the equity and appreciation you would own at the end. The rent side totals rent payments that rise each year. The chart shows the running net cost of each path."
      },
      {
        title: "Costs this model simplifies",
        body:
          "Real decisions also involve closing costs, selling fees, insurance, investment returns on the down payment, and lifestyle factors. Use this as a directional guide and confirm the big assumptions before acting."
      }
    ],
    faqs: [
      {
        question: "How many years until buying beats renting?",
        answer: "It varies with price, rent, and rates, but a common rule of thumb is around five years. Use the chart to find the year where the buy net cost drops below the rent total for your own numbers."
      },
      {
        question: "Does buying always build wealth?",
        answer: "Not automatically. If you move before building meaningful equity, transaction costs can erase the benefit. Equity grows slowly at first because early payments are mostly interest."
      }
    ],
    related: ["mortgage-calculator", "home-affordability-calculator", "extra-payment-mortgage-calculator"],
    compute(values) {
      const projection = buildRentBuyProjection({
        homePrice: Number(values.homePrice),
        downPayment: Number(values.downPayment),
        annualRate: Number(values.annualRate),
        years: Number(values.years) || 7,
        annualPropertyTaxRate: 1.1,
        annualMaintenanceRate: 1,
        annualHomeAppreciation: 3,
        monthlyRent: Number(values.monthlyRent),
        annualRentIncrease: 3
      });

      const cheaper = projection.buyNetCost < projection.rentTotal ? "Buying" : "Renting";
      const difference = Math.abs(projection.buyNetCost - projection.rentTotal);

      return {
        summary: [
          { label: "Lower net cost", value: cheaper },
          { label: "Cost difference", value: formatCurrency(difference) },
          { label: "Equity if you buy", value: formatCurrency(projection.finalEquity) }
        ],
        details: [
          { label: "Total rent paid", value: formatCurrency(projection.rentTotal) },
          { label: "Net cost of buying", value: formatCurrency(projection.buyNetCost) },
          { label: "Monthly payment", value: formatCurrencyPrecise(projection.payment) },
          { label: "Projected home value", value: formatCurrency(projection.homeValue) }
        ],
        timeline: [],
        comparison: {
          title: "Running net cost: rent vs buy",
          currentLabel: "Total rent paid",
          delayedLabel: "Net cost of buying",
          differenceLabel: cheaper === "Buying" ? "Buying saves" : "Renting saves",
          differenceValue: roundCurrency(difference),
          series: projection.series
        },
        note: "Assumes 3% yearly home appreciation, 3% rent growth, 1.1% property tax, and 1% maintenance. Closing and selling costs are excluded."
      };
    }
  },
  {
    slug: "extra-payment-mortgage-calculator",
    name: "Extra Payment Mortgage Calculator",
    category: "Mortgage",
    ogImagePath: "/og/calculators/extra-payment-mortgage-calculator.svg",
    description: "See how much interest you can save and how many years you can cut off your mortgage by adding an extra amount to each monthly payment.",
    intro:
      "Add an extra monthly amount to your mortgage and see the new payoff date plus the total interest you avoid over the life of the loan.",
    keywords: [
      "extra mortgage payment calculator",
      "pay off mortgage early calculator",
      "how much can i save paying extra on mortgage"
    ],
    defaults: {
      loanAmount: 360000,
      annualRate: 6.4,
      years: 30,
      extraMonthly: 300
    },
    inputs: [
      { name: "loanAmount", label: "Loan amount", prefix: "$", min: 10000, step: 5000 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Loan term", suffix: "years", min: 5, step: 5 },
      { name: "extraMonthly", label: "Extra monthly payment", prefix: "$", min: 0, step: 25 }
    ],
    presets: true,
    example: "Adding a few hundred dollars a month can shave years off a 30-year mortgage and save tens of thousands in interest.",
    sections: [
      {
        title: "Why extra payments work so well",
        body:
          "Every extra dollar goes straight to principal, which immediately reduces the balance that interest is charged on. That lowers next month's interest, so each extra payment quietly makes the following payments more effective too."
      },
      {
        title: "Time saved versus interest saved",
        body:
          "Extra payments produce two wins at once: the loan ends sooner and the total interest drops. The earlier in the loan you start adding extra, the larger both effects become because there is more balance and more time for the savings to compound."
      },
      {
        title: "Make sure it fits the plan",
        body:
          "Paying a mortgage down early is powerful, but it locks money into the home. Keep an emergency fund and weigh higher-interest debt or employer retirement matches before committing every spare dollar to the mortgage."
      }
    ],
    faqs: [
      {
        question: "Is it better to pay extra monthly or make one lump sum?",
        answer: "Both help. Consistent extra monthly payments are easy to automate and start saving interest right away, while a lump sum makes a large one-time dent. Starting earlier matters more than the exact method."
      },
      {
        question: "Should I pay off my mortgage early or invest?",
        answer: "It depends on your mortgage rate and risk tolerance. Paying extra is a guaranteed return equal to your rate, while investing may earn more but carries risk. Many people do some of both."
      }
    ],
    related: ["mortgage-calculator", "mortgage-amortization-calculator", "refinance-calculator"],
    compute(values) {
      const principal = Number(values.loanAmount);
      const baseline = amortizeWithExtra({
        principal,
        annualRate: Number(values.annualRate),
        years: Number(values.years),
        extraMonthly: 0
      });
      const accelerated = amortizeWithExtra({
        principal,
        annualRate: Number(values.annualRate),
        years: Number(values.years),
        extraMonthly: Number(values.extraMonthly)
      });

      const baseInterest = baseline.totalInterest ?? 0;
      const newInterest = accelerated.totalInterest ?? baseInterest;
      const interestSaved = Math.max(0, baseInterest - newInterest);
      const monthsSaved = (baseline.months ?? 0) - (accelerated.months ?? 0);

      return {
        summary: [
          { label: "Interest saved", value: formatCurrency(interestSaved) },
          { label: "Time saved", value: monthsSaved > 0 ? formatYearsAndMonths(monthsSaved) : "No change" },
          { label: "New payoff time", value: accelerated.months ? formatYearsAndMonths(accelerated.months) : "—" }
        ],
        details: [
          { label: "Base monthly payment", value: formatCurrencyPrecise(accelerated.basePayment) },
          { label: "Extra monthly payment", value: formatCurrency(values.extraMonthly) },
          { label: "Total payment with extra", value: formatCurrencyPrecise(accelerated.basePayment + Number(values.extraMonthly)) },
          { label: "Interest without extra", value: formatCurrency(baseInterest) }
        ],
        timeline: accelerated.series,
        breakdown: [
          { label: "Interest with extra", amount: roundCurrency(newInterest) },
          { label: "Interest saved", amount: roundCurrency(interestSaved) }
        ],
        milestones: [
          { label: "Payoff without extra", value: baseline.months ? formatYearsAndMonths(baseline.months) : "—" },
          { label: "Payoff with extra", value: accelerated.months ? formatYearsAndMonths(accelerated.months) : "—" },
          { label: "Interest saved", value: formatCurrency(interestSaved) }
        ],
        note: "Assumes the extra amount is applied to principal every month for the life of the loan."
      };
    }
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "Investing",
    ogImagePath: "/og/calculators/compound-interest-calculator.svg",
    description: "Estimate how a starting balance and steady monthly investing can grow over time through compound returns.",
    intro:
      "Model long-term portfolio growth, compare contribution habits, and see how time changes the result more than most people expect.",
    keywords: [
      "compound interest calculator with monthly contributions",
      "how much will 1000 grow in 20 years",
      "compound interest calculator 10 years"
    ],
    defaults: {
      initialAmount: 10000,
      monthlyContribution: 500,
      annualRate: 8,
      years: 20
    },
    inputs: [
      { name: "initialAmount", label: "Initial amount", prefix: "$", min: 0, step: 500 },
      { name: "monthlyContribution", label: "Monthly contribution", prefix: "$", min: 0, step: 50 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Years", min: 1, step: 1 }
    ],
    presets: true,
    example: "$500 per month for 20 years at 8% can build a portfolio much larger than your raw contributions alone.",
    sections: [
      {
        title: "What is compound interest?",
        body:
          "Compound growth means your money can earn returns on both the original balance and the gains that build up over time. The longer the timeline, the more noticeable that snowball effect becomes."
      },
      {
        title: "How compound interest works",
        body:
          "This calculator applies a monthly growth rate to the current balance and then adds the recurring contribution you entered. Repeating that process over many months is what makes long-term investing look very different from simple addition."
      },
      {
        title: "Why starting early matters",
        body:
          "More time in the market often does more work than trying to find a slightly higher return later. Starting earlier gives every future contribution more time to compound."
      }
    ],
    faqs: [
      {
        question: "Is compound interest monthly or yearly?",
        answer: "Compounding can happen daily, monthly, quarterly, or yearly depending on the account. Monthly compounding is a useful planning baseline because it lines up well with recurring contributions."
      },
      {
        question: "What is a good return rate?",
        answer: "Many long-term stock-heavy scenarios use something in the 6% to 10% range before inflation, but there is no guaranteed return. It is better to test conservative, middle, and optimistic scenarios than rely on one number."
      }
    ],
    related: ["retirement-calculator", "inflation-calculator", "savings-goal-calculator"],
    compute(values) {
      const months = Number(values.years) * 12;
      const monthlyRate = Number(values.annualRate) / 100 / 12;
      const delayMonths = Math.min(Math.max(12, Math.floor(Number(values.years) / 4) * 12 || 12), Math.max(months - 12, 0));
      const series = buildBalanceSeries({
        openingBalance: Number(values.initialAmount),
        months,
        monthlyRate,
        monthlyContribution: Number(values.monthlyContribution)
      });
      const finalBalance = series.at(-1)?.amount ?? Number(values.initialAmount);
      const totalContributions = Number(values.initialAmount) + Number(values.monthlyContribution) * months;
      const totalInterest = finalBalance - totalContributions;

      return {
        summary: [
          { label: "Final balance", value: formatCurrency(finalBalance) },
          { label: "Total contributions", value: formatCurrency(totalContributions) },
          { label: "Investment growth", value: formatCurrency(totalInterest) }
        ],
        details: [
          { label: "Average annual return used", value: formatPercent(values.annualRate) },
          { label: "Time horizon", value: `${values.years} years` },
          { label: "Monthly contribution", value: formatCurrency(values.monthlyContribution) }
        ],
        timeline: series,
        comparison: buildStartDelayComparison({
          openingBalance: Number(values.initialAmount),
          monthlyContribution: Number(values.monthlyContribution),
          monthlyRate,
          months,
          delayMonths
        }),
        note: "This projection assumes a steady return rate and monthly compounding."
      };
    }
  },
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "Mortgage",
    ogImagePath: "/og/calculators/mortgage-calculator.svg",
    description: "Estimate a mortgage payment, total interest cost, and the full monthly housing picture before you commit to a home price.",
    intro:
      "Test home prices, down payments, loan terms, and rate assumptions before you decide what payment actually fits your budget.",
    keywords: [
      "mortgage calculator monthly payment",
      "how much mortgage can i afford",
      "mortgage calculator with interest"
    ],
    defaults: {
      homePrice: 450000,
      downPayment: 90000,
      annualRate: 6.4,
      years: 30,
      annualPropertyTax: 0,
      annualInsurance: 0,
      monthlyHoa: 0
    },
    inputs: [
      { name: "homePrice", label: "Home price", prefix: "$", min: 50000, step: 5000 },
      { name: "downPayment", label: "Down payment", prefix: "$", min: 0, step: 5000 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Loan term", suffix: "years", min: 5, step: 5 }
    ],
    advancedInputs: [
      { name: "annualPropertyTax", label: "Annual property tax", prefix: "$", min: 0, step: 100 },
      { name: "annualInsurance", label: "Annual insurance", prefix: "$", min: 0, step: 100 },
      { name: "monthlyHoa", label: "Monthly HOA", prefix: "$", min: 0, step: 25 }
    ],
    presets: true,
    example: "A lower rate can save tens of thousands of dollars over a 30-year mortgage even when the monthly change looks small.",
    sections: [
      {
        title: "What counts in a mortgage payment",
        body:
          "The headline mortgage payment usually refers to principal and interest, but the real monthly housing number can be much higher once property taxes, homeowners insurance, and HOA dues are included."
      },
      {
        title: "Why term length changes affordability",
        body:
          "A longer term can make the payment easier to carry each month, but it usually means paying much more interest over time. A shorter term costs more now and less later."
      },
      {
        title: "Check this against your budget",
        body:
          "Mortgage math is only one part of the decision. You still need to test the payment against savings goals, repair costs, moving expenses, and the amount of buffer left in your monthly plan."
      }
    ],
    faqs: [
      {
        question: "Does this include taxes and insurance?",
        answer: "Principal and interest are always included. Property taxes, insurance, and HOA can also be added here so you can get closer to an all-in monthly housing estimate."
      },
      {
        question: "Should I use 15 years or 30 years?",
        answer: "Use the term that still leaves room for savings, repairs, and normal life expenses after the payment clears. The cheaper total loan is not always the safer monthly choice."
      }
    ],
    related: ["loan-calculator", "budget-calculator", "emergency-fund-calculator"],
    compute(values) {
      const principal = Math.max(0, Number(values.homePrice) - Number(values.downPayment));
      const payment = paymentForLoan(principal, Number(values.annualRate), Number(values.years));
      const totalPaid = payment * Number(values.years) * 12;
      const totalInterest = totalPaid - principal;
      const monthlyPropertyTax = Number(values.annualPropertyTax) / 12;
      const monthlyInsurance = Number(values.annualInsurance) / 12;
      const monthlyHoa = Number(values.monthlyHoa);
      const allInMonthly = payment + monthlyPropertyTax + monthlyInsurance + monthlyHoa;
      const hasAdvancedCosts = monthlyPropertyTax > 0 || monthlyInsurance > 0 || monthlyHoa > 0;
      const breakdownData = buildLoanBreakdown({
        principal,
        totalPaid,
        totalInterest,
        years: Number(values.years),
        payment
      });

      return {
        summary: [
          { label: "Loan amount", value: formatCurrency(principal) },
          { label: "Principal and interest", value: formatCurrencyPrecise(payment) },
          {
            label: hasAdvancedCosts ? "All-in monthly housing cost" : "Total interest",
            value: hasAdvancedCosts ? formatCurrencyPrecise(allInMonthly) : formatCurrency(totalInterest)
          }
        ],
        details: [
          { label: "Total paid over loan life", value: formatCurrency(totalPaid) },
          { label: "Down payment share", value: formatPercent((Number(values.downPayment) / Number(values.homePrice)) * 100 || 0) },
          { label: "Loan term", value: `${values.years} years` },
          ...(hasAdvancedCosts
            ? [
                { label: "Monthly property tax", value: formatCurrencyPrecise(monthlyPropertyTax) },
                { label: "Monthly insurance", value: formatCurrencyPrecise(monthlyInsurance) },
                { label: "Monthly HOA", value: formatCurrencyPrecise(monthlyHoa) }
              ]
            : [])
        ],
        timeline: buildAmortizationSeries({
          principal,
          annualRate: Number(values.annualRate),
          years: Number(values.years),
          payment
        }),
        amortizationTable: buildAmortizationTable({
          principal,
          annualRate: Number(values.annualRate),
          years: Number(values.years),
          payment
        }),
        breakdown: breakdownData.breakdown,
        milestones: hasAdvancedCosts
          ? [
              { label: "Principal and interest", value: formatCurrencyPrecise(payment) },
              { label: "All-in monthly housing", value: formatCurrencyPrecise(allInMonthly) },
              { label: "First-year housing outflow", value: formatCurrency((allInMonthly || 0) * 12) }
            ]
          : breakdownData.milestones,
        note: hasAdvancedCosts
          ? "All-in housing cost includes principal, interest, property tax, insurance, and HOA. Maintenance and repairs are still excluded."
          : "This estimate excludes taxes, insurance, and maintenance."
      };
    }
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "Debt",
    description: "Estimate a monthly loan payment, full repayment cost, and interest expense for common installment loans.",
    intro:
      "Compare loan offers, test term lengths, and see how a lower payment can still mean a more expensive deal overall.",
    keywords: [
      "loan payment calculator",
      "personal loan calculator",
      "car loan monthly payment"
    ],
    defaults: {
      loanAmount: 25000,
      annualRate: 7.9,
      years: 5
    },
    inputs: [
      { name: "loanAmount", label: "Loan amount", prefix: "$", min: 1000, step: 500 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Years", min: 1, step: 1 }
    ],
    presets: true,
    example: "Extending a loan term can shrink the monthly payment while making the total cost materially worse.",
    sections: [
      {
        title: "Use loan math to compare offers",
        body:
          "APR, term length, and fees all shape the true cost of borrowing. A monthly payment that looks comfortable can still hide a much larger total repayment amount."
      },
      {
        title: "Shorter loans cost less",
        body:
          "In most cases, the shortest loan that still fits your budget reduces total interest because the balance has less time to work against you."
      },
      {
        title: "Monthly affordability is not enough",
        body:
          "Always compare the total paid, not just the monthly number shown in an ad, dealership promotion, or lender prequalification screen."
      }
    ],
    faqs: [
      {
        question: "Should I choose the lowest monthly payment?",
        answer: "Not by default. A lower payment often comes from stretching the loan over more months, which usually raises the total interest cost."
      },
      {
        question: "Can I use this for auto loans?",
        answer: "Yes. The same payment formula works for auto loans, personal loans, and most other standard fixed-payment installment debt."
      }
    ],
    related: ["debt-payoff-calculator", "budget-calculator", "mortgage-calculator"],
    compute(values) {
      const payment = paymentForLoan(Number(values.loanAmount), Number(values.annualRate), Number(values.years));
      const totalPaid = payment * Number(values.years) * 12;
      const totalInterest = totalPaid - Number(values.loanAmount);
      const breakdownData = buildLoanBreakdown({
        principal: Number(values.loanAmount),
        totalPaid,
        totalInterest,
        years: Number(values.years),
        payment
      });

      return {
        summary: [
          { label: "Monthly payment", value: formatCurrencyPrecise(payment) },
          { label: "Total paid", value: formatCurrency(totalPaid) },
          { label: "Interest cost", value: formatCurrency(totalInterest) }
        ],
        details: [
          { label: "Borrowed amount", value: formatCurrency(values.loanAmount) },
          { label: "APR used", value: formatPercent(values.annualRate) },
          { label: "Loan term", value: `${values.years} years` }
        ],
        timeline: buildAmortizationSeries({
          principal: Number(values.loanAmount),
          annualRate: Number(values.annualRate),
          years: Number(values.years),
          payment
        }),
        amortizationTable: buildAmortizationTable({
          principal: Number(values.loanAmount),
          annualRate: Number(values.annualRate),
          years: Number(values.years),
          payment
        }),
        breakdown: breakdownData.breakdown,
        milestones: breakdownData.milestones,
        note: "Fees, taxes, and dealer add-ons are not included here."
      };
    }
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    category: "Retirement",
    description: "Project future retirement savings based on your current balance, ongoing contributions, and an assumed long-term return.",
    intro:
      "Test whether your current saving pace is likely to support the retirement timeline and lifestyle you are aiming for.",
    keywords: [
      "retirement calculator how much do i need",
      "retirement savings projection",
      "401k growth calculator"
    ],
    defaults: {
      currentSavings: 75000,
      monthlyContribution: 900,
      annualReturn: 7,
      yearsToRetirement: 25
    },
    inputs: [
      { name: "currentSavings", label: "Current savings", prefix: "$", min: 0, step: 1000 },
      { name: "monthlyContribution", label: "Monthly contribution", prefix: "$", min: 0, step: 50 },
      { name: "annualReturn", label: "Expected return", suffix: "%", min: 0, step: 0.1 },
      { name: "yearsToRetirement", label: "Years to retirement", min: 1, step: 1 }
    ],
    presets: true,
    example: "Retirement readiness improves dramatically when you increase both time in the market and contribution rate.",
    sections: [
      {
        title: "Retirement projections are scenarios",
        body:
          "A retirement projection is not a promise about the market or your future account balance. It is a planning scenario that helps you test whether your current habits are in the right range."
      },
      {
        title: "Contribution rate matters",
        body:
          "If you want a meaningfully larger retirement balance, raising your recurring contribution is usually more realistic than assuming an unusually high investment return."
      },
      {
        title: "Plan for income, not just assets",
        body:
          "A large balance only matters if it can support your future spending. Think beyond the headline number and consider what kind of yearly income that balance may realistically produce."
      }
    ],
    faqs: [
      {
        question: "Is a 7% return assumption realistic?",
        answer: "It is a common long-term planning assumption for diversified stock-heavy portfolios, but actual returns will move around and may differ a lot from any single estimate."
      },
      {
        question: "How much retirement income does this estimate?",
        answer: "This tool includes a simple 4% rule style estimate for first-year withdrawals. It is a rough planning shortcut, not a withdrawal guarantee."
      }
    ],
    related: ["compound-interest-calculator", "inflation-calculator", "net-worth-calculator"],
    compute(values) {
      const months = Number(values.yearsToRetirement) * 12;
      const monthlyRate = Number(values.annualReturn) / 100 / 12;
      const delayMonths = Math.min(
        Math.max(12, Math.floor(Number(values.yearsToRetirement) / 5) * 12 || 12),
        Math.max(months - 12, 0)
      );
      const series = buildBalanceSeries({
        openingBalance: Number(values.currentSavings),
        months,
        monthlyRate,
        monthlyContribution: Number(values.monthlyContribution)
      });
      const futureValue = series.at(-1)?.amount ?? Number(values.currentSavings);
      const annualIncome = futureValue * 0.04;

      return {
        summary: [
          { label: "Projected retirement balance", value: formatCurrency(futureValue) },
          { label: "Estimated first-year income", value: formatCurrency(annualIncome) },
          { label: "Monthly investing", value: formatCurrency(values.monthlyContribution) }
        ],
        details: [
          { label: "Current savings", value: formatCurrency(values.currentSavings) },
          { label: "Expected return", value: formatPercent(values.annualReturn) },
          { label: "Time to retirement", value: `${values.yearsToRetirement} years` }
        ],
        timeline: series,
        comparison: buildStartDelayComparison({
          openingBalance: Number(values.currentSavings),
          monthlyContribution: Number(values.monthlyContribution),
          monthlyRate,
          months,
          delayMonths
        }),
        note: "The income estimate uses a simple 4% withdrawal rule heuristic."
      };
    }
  },
  {
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    category: "Investing",
    description: "Estimate how inflation can raise future costs and reduce the buying power of your money over time.",
    intro:
      "See how today's prices may change over time and why long-term goals often need a larger target than they first appear to require.",
    keywords: [
      "inflation calculator future value",
      "buying power calculator",
      "how much will prices rise in 10 years"
    ],
    defaults: {
      amount: 1000,
      inflationRate: 3,
      years: 10
    },
    inputs: [
      { name: "amount", label: "Current amount", prefix: "$", min: 1, step: 50 },
      { name: "inflationRate", label: "Inflation rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Years", min: 1, step: 1 }
    ],
    presets: true,
    example: "A modest inflation rate can still cut purchasing power heavily over long periods such as retirement.",
    sections: [
      {
        title: "Inflation works quietly",
        body:
          "Inflation often feels small in the short run, but over many years it can materially change what the same amount of money can buy."
      },
      {
        title: "Why inflation matters for investing",
        body:
          "Your real return is what remains after inflation. If your investments grow but your cost of living rises too, the gap between the two matters more than the nominal return alone."
      },
      {
        title: "Use real dollars when planning",
        body:
          "If a future target looks large in nominal dollars but weak in real purchasing power, your savings goal may need to be higher than you first assumed."
      }
    ],
    faqs: [
      {
        question: "Why does inflation matter for retirement?",
        answer: "Because retirement can last decades. Even modest inflation can make the same lifestyle much more expensive over a long spending timeline."
      },
      {
        question: "Is 2% inflation still a safe assumption?",
        answer: "It may be too low for conservative planning depending on the goal. Many people test 2%, 3%, and 4% scenarios to see how sensitive the result is."
      }
    ],
    related: ["compound-interest-calculator", "retirement-calculator", "savings-goal-calculator"],
    compute(values) {
      const futureCost = Number(values.amount) * (1 + Number(values.inflationRate) / 100) ** Number(values.years);
      const futureBuyingPower = Number(values.amount) / (1 + Number(values.inflationRate) / 100) ** Number(values.years);
      const timeline = Array.from({ length: Number(values.years) }, (_, index) => ({
        label: `Year ${index + 1}`,
        amount: roundCurrency(Number(values.amount) * (1 + Number(values.inflationRate) / 100) ** (index + 1))
      }));

      return {
        summary: [
          { label: "Future cost", value: formatCurrency(futureCost) },
          { label: "Buying power in today's dollars", value: formatCurrency(futureBuyingPower) },
          { label: "Inflation assumption", value: formatPercent(values.inflationRate) }
        ],
        details: [
          { label: "Starting amount", value: formatCurrency(values.amount) },
          { label: "Time horizon", value: `${values.years} years` },
          { label: "Lost purchasing power", value: formatCurrency(Number(values.amount) - futureBuyingPower) }
        ],
        timeline,
        note: "This assumes a steady inflation rate, which is rarely true in real life."
      };
    }
  },
  {
    slug: "debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    category: "Debt",
    description: "Estimate how long debt payoff may take based on your balance, APR, and monthly payment strategy.",
    intro:
      "See whether your payment is actually moving the balance down and how much time and interest you may save by paying more each month.",
    keywords: [
      "debt payoff calculator",
      "how fast can i pay off my loan",
      "credit card payoff calculator"
    ],
    defaults: {
      balance: 12000,
      annualRate: 18.9,
      monthlyPayment: 350
    },
    inputs: [
      { name: "balance", label: "Current balance", prefix: "$", min: 100, step: 100 },
      { name: "annualRate", label: "APR", suffix: "%", min: 0, step: 0.1 },
      { name: "monthlyPayment", label: "Monthly payment", prefix: "$", min: 10, step: 10 }
    ],
    presets: true,
    example: "Small increases in monthly payment often remove several months of payoff time because less interest accumulates every cycle.",
    sections: [
      {
        title: "The danger of minimum payments",
        body:
          "High-interest balances can linger for years when the payment barely clears the monthly interest. That is why even small payment increases can matter more than they first seem."
      },
      {
        title: "Check the math before choosing a strategy",
        body:
          "This calculator helps you understand the payoff math first. Once you know the timeline and cost, it is easier to decide whether avalanche, snowball, or refinancing deserves a closer look."
      },
      {
        title: "Cash flow still matters",
        body:
          "Aggressive debt payoff should not wipe out all savings. If one unexpected bill pushes you back onto a credit card, the payoff plan may be too fragile."
      }
    ],
    faqs: [
      {
        question: "What if my payment does not cover interest?",
        answer: "The balance will not fall in a meaningful way. You need a larger payment, a lower rate, or both before the payoff timeline becomes realistic."
      },
      {
        question: "Should I pay off debt or save first?",
        answer: "For many households, the answer is both: keep a small emergency cushion while paying down high-interest debt aggressively."
      }
    ],
    related: ["loan-calculator", "budget-calculator", "emergency-fund-calculator"],
    compute(values) {
      const result = buildPayoffSeries({
        balance: Number(values.balance),
        annualRate: Number(values.annualRate),
        payment: Number(values.monthlyPayment)
      });

      if (result.warning) {
        return {
          summary: [
            { label: "Status", value: "Payment too low" },
            { label: "Monthly interest", value: formatCurrency((Number(values.balance) * Number(values.annualRate)) / 1200) },
            { label: "Recommended next step", value: "Increase payment or reduce APR" }
          ],
          details: [
            { label: "Current payment", value: formatCurrency(values.monthlyPayment) },
            { label: "Balance", value: formatCurrency(values.balance) },
            { label: "APR", value: formatPercent(values.annualRate) }
          ],
          milestones: [
            { label: "Interest due each month", value: formatCurrency((Number(values.balance) * Number(values.annualRate)) / 1200) },
            { label: "Current payment", value: formatCurrency(values.monthlyPayment) },
            { label: "Gap to break even", value: formatCurrency((Number(values.balance) * Number(values.annualRate)) / 1200 - Number(values.monthlyPayment)) }
          ],
          timeline: [],
          note: result.warning
        };
      }

      return {
        summary: [
          { label: "Time to payoff", value: formatYearsAndMonths(result.months) },
          { label: "Total interest", value: formatCurrency(result.totalInterest) },
          { label: "Monthly payment", value: formatCurrency(values.monthlyPayment) }
        ],
        details: [
          { label: "Starting balance", value: formatCurrency(values.balance) },
          { label: "APR", value: formatPercent(values.annualRate) },
          { label: "Payment frequency", value: "Monthly" }
        ],
        breakdown: [
          { label: "Principal", amount: Number(values.balance) },
          { label: "Interest", amount: roundCurrency(result.totalInterest) }
        ],
        milestones: [
          { label: "Estimated payoff length", value: formatYearsAndMonths(result.months) },
          { label: "Monthly payment", value: formatCurrency(values.monthlyPayment) },
          { label: "Total interest paid", value: formatCurrency(result.totalInterest) }
        ],
        timeline: result.series,
        note: "Assumes a fixed interest rate and a consistent monthly payment."
      };
    }
  },
  {
    slug: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    category: "Savings",
    description: "Estimate how long it may take to reach a savings goal with a starting balance, monthly deposits, and a savings rate.",
    intro:
      "Use it when you know the amount you want to reach and need a clearer picture of the monthly effort and timeline required to get there.",
    keywords: [
      "savings goal calculator",
      "how long to save 10000",
      "monthly savings target calculator"
    ],
    defaults: {
      targetAmount: 20000,
      currentSavings: 3000,
      monthlySavings: 500,
      annualRate: 4
    },
    inputs: [
      { name: "targetAmount", label: "Savings goal", prefix: "$", min: 100, step: 100 },
      { name: "currentSavings", label: "Current savings", prefix: "$", min: 0, step: 100 },
      { name: "monthlySavings", label: "Monthly savings", prefix: "$", min: 0, step: 25 },
      { name: "annualRate", label: "Savings rate", suffix: "%", min: 0, step: 0.1 }
    ],
    presets: true,
    example: "A small interest rate helps, but the monthly savings habit is still the main lever for most short- and mid-term goals.",
    sections: [
      {
        title: "The goal should have a timeline",
        body:
          "Savings goals work better when they have both a target amount and a target date. Once those two pieces are defined, the monthly requirement becomes easier to judge."
      },
      {
        title: "Automate the contribution",
        body:
          "The easiest way to stay on track is to remove as much decision friction as possible. Treat the savings amount like a bill that gets paid first."
      },
      {
        title: "Separate goal money from spending cash",
        body:
          "A dedicated savings bucket makes progress easier to see and lowers the chance that goal money gets absorbed into everyday spending."
      }
    ],
    faqs: [
      {
        question: "Does the savings rate matter a lot?",
        answer: "It matters, but for short- and mid-term goals the monthly contribution amount is usually the bigger lever."
      },
      {
        question: "What if I already have a starting balance?",
        answer: "Enter it as current savings so the calculator measures only the gap you still need to close."
      }
    ],
    related: ["emergency-fund-calculator", "budget-calculator", "compound-interest-calculator"],
    compute(values) {
      const monthlyRate = Number(values.annualRate) / 100 / 12;
      let balance = Number(values.currentSavings);
      let months = 0;
      const timeline = [];

      while (balance < Number(values.targetAmount) && months < 600) {
        months += 1;
        balance = balance * (1 + monthlyRate) + Number(values.monthlySavings);

        if (months % 12 === 0 || balance >= Number(values.targetAmount)) {
          timeline.push({
            label: `Year ${Math.ceil(months / 12)}`,
            amount: roundCurrency(balance)
          });
        }
      }

      const remainingGap = Math.max(0, Number(values.targetAmount) - Number(values.currentSavings));
      return {
        summary: [
          { label: "Time to goal", value: formatYearsAndMonths(months) },
          { label: "Goal amount", value: formatCurrency(values.targetAmount) },
          { label: "Current gap", value: formatCurrency(remainingGap) }
        ],
        details: [
          { label: "Starting savings", value: formatCurrency(values.currentSavings) },
          { label: "Monthly savings", value: formatCurrency(values.monthlySavings) },
          { label: "Interest assumption", value: formatPercent(values.annualRate) }
        ],
        timeline,
        note: "This estimate assumes the same monthly deposit and rate every month."
      };
    }
  },
  {
    slug: "budget-calculator",
    name: "Budget Calculator",
    category: "Budgeting",
    ogImagePath: "/og/calculators/budget-calculator.svg",
    description: "Estimate how much room is left in your monthly plan after housing, debt payments, essentials, and savings.",
    intro:
      "Test whether your current monthly plan leaves enough room for flexibility, savings, and unexpected costs.",
    keywords: [
      "budget calculator monthly",
      "50 30 20 budget calculator",
      "how much can i spend each month"
    ],
    defaults: {
      monthlyIncome: 6000,
      housing: 1800,
      debt: 500,
      essentials: 1200,
      savings: 700
    },
    inputs: [
      { name: "monthlyIncome", label: "Monthly take-home income", prefix: "$", min: 1000, step: 100 },
      { name: "housing", label: "Housing", prefix: "$", min: 0, step: 50 },
      { name: "debt", label: "Debt payments", prefix: "$", min: 0, step: 50 },
      { name: "essentials", label: "Other essentials", prefix: "$", min: 0, step: 50 },
      { name: "savings", label: "Savings and investing", prefix: "$", min: 0, step: 50 }
    ],
    presets: true,
    example: "A budget becomes more useful when it highlights tradeoffs, not just expense categories.",
    sections: [
      {
        title: "Budgeting is about allocation",
        body:
          "A useful budget shows how much of your take-home pay is already committed and how much flexibility you still have before the month starts to feel tight."
      },
      {
        title: "The 50/30/20 rule is a benchmark",
        body:
          "The 50/30/20 framework is not a rule you must follow. It is better used as a quick benchmark to spot whether your plan may be too stretched or too loose in certain areas."
      },
      {
        title: "Track what you actually spend",
        body:
          "Budget accuracy improves once you replace guesses with actual spending history, especially for groceries, subscriptions, travel, and irregular bills."
      }
    ],
    faqs: [
      {
        question: "Should savings be included in a budget?",
        answer: "Yes. Savings should be treated as a planned use of money, not just whatever happens to remain at the end of the month."
      },
      {
        question: "What if my leftover number is negative?",
        answer: "That usually means the current plan is overallocated. You either need lower spending, higher income, or a different timing for some goals."
      }
    ],
    related: ["emergency-fund-calculator", "debt-payoff-calculator", "mortgage-calculator"],
    compute(values) {
      const needs = Number(values.housing) + Number(values.debt) + Number(values.essentials);
      const savings = Number(values.savings);
      const leftover = Number(values.monthlyIncome) - needs - savings;

      return {
        summary: [
          { label: "Leftover cash flow", value: formatCurrency(leftover) },
          { label: "Needs ratio", value: formatPercent((needs / Number(values.monthlyIncome)) * 100 || 0) },
          { label: "Savings ratio", value: formatPercent((savings / Number(values.monthlyIncome)) * 100 || 0) }
        ],
        details: [
          { label: "Income", value: formatCurrency(values.monthlyIncome) },
          { label: "Needs spending", value: formatCurrency(needs) },
          { label: "Planned savings", value: formatCurrency(values.savings) }
        ],
        timeline: [
          { label: "Housing", amount: Number(values.housing) },
          { label: "Debt", amount: Number(values.debt) },
          { label: "Essentials", amount: Number(values.essentials) },
          { label: "Savings", amount: Number(values.savings) },
          { label: "Leftover", amount: Math.max(leftover, 0) }
        ],
        note: leftover < 0 ? "Your plan is overspending the income entered." : "Use the leftover amount as a buffer for wants, true expenses, and surprises."
      };
    }
  },
  {
    slug: "emergency-fund-calculator",
    name: "Emergency Fund Calculator",
    category: "Savings",
    ogImagePath: "/og/calculators/emergency-fund-calculator.svg",
    description: "Estimate how large an emergency fund may need to be and how long it could take to build it.",
    intro:
      "Set a cash target based on essential expenses and see how long it may take to fully fund it.",
    keywords: [
      "emergency fund calculator",
      "best emergency fund size",
      "how much emergency savings do i need"
    ],
    defaults: {
      monthlyExpenses: 3500,
      targetMonths: 6,
      currentSavings: 4000,
      monthlyContribution: 400
    },
    inputs: [
      { name: "monthlyExpenses", label: "Monthly essential expenses", prefix: "$", min: 500, step: 100 },
      { name: "targetMonths", label: "Coverage target", suffix: "months", min: 1, step: 1 },
      { name: "currentSavings", label: "Current emergency savings", prefix: "$", min: 0, step: 100 },
      { name: "monthlyContribution", label: "Monthly contribution", prefix: "$", min: 0, step: 25 }
    ],
    presets: true,
    example: "Three months may be enough for dual-income households with stable jobs, while six months or more may fit riskier income situations better.",
    sections: [
      {
        title: "An emergency fund protects the rest of your plan",
        body:
          "The point of an emergency fund is not growth. It is protecting the rest of your financial plan when a job loss, medical bill, or repair shows up at the wrong time."
      },
      {
        title: "Target size depends on risk",
        body:
          "A variable-income household, a single earner, or someone supporting dependents may need a deeper cushion than a generic three-month rule suggests."
      },
      {
        title: "Build in layers",
        body:
          "Many households build emergency savings in stages: first a starter cushion, then a few months of expenses, then a larger reserve once higher-interest debt is under control."
      }
    ],
    faqs: [
      {
        question: "Should my emergency fund be invested?",
        answer: "Usually not. Emergency savings should generally stay liquid and stable so the money is there when you need it."
      },
      {
        question: "Do I count all expenses?",
        answer: "Base the target on essential monthly costs such as housing, food, utilities, insurance, and minimum debt payments rather than every discretionary category."
      }
    ],
    related: ["budget-calculator", "savings-goal-calculator", "debt-payoff-calculator"],
    compute(values) {
      const target = Number(values.monthlyExpenses) * Number(values.targetMonths);
      const gap = Math.max(0, target - Number(values.currentSavings));
      const months = Number(values.monthlyContribution) > 0 ? Math.ceil(gap / Number(values.monthlyContribution)) : 0;
      const timeline = [];

      for (let month = 1; month <= months; month += 1) {
        const amount = Math.min(target, Number(values.currentSavings) + Number(values.monthlyContribution) * month);

        if (month % 6 === 0 || month === months) {
          timeline.push({
            label: `Month ${month}`,
            amount
          });
        }
      }

      return {
        summary: [
          { label: "Recommended fund size", value: formatCurrency(target) },
          { label: "Remaining gap", value: formatCurrency(gap) },
          { label: "Time to target", value: months === 0 && gap > 0 ? "No progress" : months === 0 ? "Already funded" : formatYearsAndMonths(months) }
        ],
        details: [
          { label: "Coverage goal", value: `${values.targetMonths} months` },
          { label: "Current emergency fund", value: formatCurrency(values.currentSavings) },
          { label: "Monthly contribution", value: formatCurrency(values.monthlyContribution) }
        ],
        timeline,
        note: "Keep emergency savings liquid and easy to access."
      };
    }
  },
  {
    slug: "net-worth-calculator",
    name: "Net Worth Calculator",
    category: "Budgeting",
    description: "Add up your assets and liabilities to estimate your current net worth and see where your balance sheet is strongest or weakest.",
    intro:
      "Get a clean snapshot of what you own, what you owe, and how your balance sheet is changing over time.",
    keywords: [
      "net worth calculator",
      "personal balance sheet calculator",
      "how to calculate net worth"
    ],
    defaults: {
      cash: 15000,
      investments: 40000,
      retirement: 85000,
      homeEquity: 30000,
      loans: 22000,
      creditCards: 4500
    },
    inputs: [
      { name: "cash", label: "Cash and savings", prefix: "$", min: 0, step: 500 },
      { name: "investments", label: "Brokerage investments", prefix: "$", min: 0, step: 500 },
      { name: "retirement", label: "Retirement accounts", prefix: "$", min: 0, step: 1000 },
      { name: "homeEquity", label: "Home equity", prefix: "$", min: 0, step: 1000 },
      { name: "loans", label: "Loans owed", prefix: "$", min: 0, step: 500 },
      { name: "creditCards", label: "Credit card debt", prefix: "$", min: 0, step: 100 }
    ],
    presets: true,
    example: "Net worth is not about comparison. It is a scoreboard for whether your assets are growing faster than your liabilities.",
    sections: [
      {
        title: "Net worth is a snapshot",
        body:
          "Net worth is a snapshot, not a complete picture of your financial life. Even so, it is one of the clearest ways to measure long-term progress over time."
      },
      {
        title: "Why the mix matters",
        body:
          "Two people can report the same net worth with very different balance sheets. Liquidity, debt load, and concentration all matter when you look beyond the headline number."
      },
      {
        title: "Track trend, not just one number",
        body:
          "A single check is less useful than a recurring habit of tracking the trend every quarter or a couple of times per year. Direction often matters more than precision."
      }
    ],
    faqs: [
      {
        question: "Should I include retirement accounts?",
        answer: "Yes. Retirement accounts are still assets even if access is restricted or tax consequences apply before retirement age."
      },
      {
        question: "Do I include my home value or home equity?",
        answer: "Use home equity rather than the full home value if you want a cleaner estimate. Home equity reflects the portion you actually own after debt is considered."
      }
    ],
    related: ["retirement-calculator", "budget-calculator", "compound-interest-calculator"],
    compute(values) {
      const assets =
        Number(values.cash) + Number(values.investments) + Number(values.retirement) + Number(values.homeEquity);
      const liabilities = Number(values.loans) + Number(values.creditCards);
      const netWorth = assets - liabilities;

      return {
        summary: [
          { label: "Net worth", value: formatCurrency(netWorth) },
          { label: "Total assets", value: formatCurrency(assets) },
          { label: "Total liabilities", value: formatCurrency(liabilities) }
        ],
        details: [
          { label: "Liquid assets", value: formatCurrency(Number(values.cash) + Number(values.investments)) },
          { label: "Retirement assets", value: formatCurrency(values.retirement) },
          { label: "Debt load", value: formatCurrency(liabilities) }
        ],
        timeline: [
          { label: "Cash", amount: Number(values.cash) },
          { label: "Investments", amount: Number(values.investments) },
          { label: "Retirement", amount: Number(values.retirement) },
          { label: "Home equity", amount: Number(values.homeEquity) },
          { label: "Liabilities", amount: liabilities }
        ],
        note: "Track net worth periodically so the direction matters more than the exact number."
      };
    }
  },
  {
    slug: "roi-calculator",
    name: "ROI Calculator",
    category: "Investing",
    description: "Calculate the return on an investment, including total ROI, net profit, and the annualized rate of return over your holding period.",
    intro:
      "Enter what you put in, what it is worth now, and how long you held it to see both the total return and the smoother annualized rate.",
    keywords: [
      "roi calculator",
      "return on investment calculator",
      "annualized return calculator"
    ],
    defaults: {
      initialInvestment: 10000,
      finalValue: 18000,
      years: 5
    },
    inputs: [
      { name: "initialInvestment", label: "Amount invested", prefix: "$", min: 100, step: 100 },
      { name: "finalValue", label: "Current or final value", prefix: "$", min: 0, step: 100 },
      { name: "years", label: "Holding period", suffix: "years", min: 1, step: 1 }
    ],
    presets: true,
    example: "Turning $10,000 into $18,000 over five years is an 80% total return, but only about a 12.5% annualized return.",
    sections: [
      {
        title: "Total ROI versus annualized return",
        body:
          "Total ROI is the full percentage gain from start to finish. Annualized return spreads that gain evenly across each year you held the investment, which makes it the fairer way to compare deals with different time spans."
      },
      {
        title: "Why time changes the story",
        body:
          "A 50% total return sounds great, but it is very different over one year than over ten. The annualized figure shown here lets you line up a quick flip and a long hold on the same scale."
      },
      {
        title: "What ROI leaves out",
        body:
          "Simple ROI ignores taxes, trading fees, and any money you added or withdrew partway through. For investments with ongoing contributions, a compound growth or CAGR view will describe the result more accurately."
      }
    ],
    faqs: [
      {
        question: "What is a good ROI?",
        answer: "It depends on risk and time horizon. Broad stock market averages have historically landed somewhere around 7% to 10% annualized over long periods, so comparing your annualized return to that range is more useful than judging total ROI alone."
      },
      {
        question: "Is ROI the same as annualized return?",
        answer: "No. ROI is the total percentage gain over the whole period, while annualized return is the equivalent steady yearly rate. This calculator shows both so short and long holds can be compared fairly."
      }
    ],
    related: ["cagr-calculator", "compound-interest-calculator", "dividend-calculator"],
    compute(values) {
      const initial = Number(values.initialInvestment);
      const finalValue = Number(values.finalValue);
      const years = Number(values.years);
      const gain = finalValue - initial;
      const roi = initial > 0 ? (gain / initial) * 100 : 0;
      const annualized = initial > 0 && years > 0 ? ((finalValue / initial) ** (1 / years) - 1) * 100 : 0;
      const timeline = Array.from({ length: years }, (_, index) => ({
        label: `Year ${index + 1}`,
        amount: roundCurrency(initial * (1 + annualized / 100) ** (index + 1))
      }));

      return {
        summary: [
          { label: "Total ROI", value: formatPercent(roi) },
          { label: "Net profit", value: formatCurrency(gain) },
          { label: "Annualized return", value: formatPercent(annualized) }
        ],
        details: [
          { label: "Amount invested", value: formatCurrency(initial) },
          { label: "Final value", value: formatCurrency(finalValue) },
          { label: "Holding period", value: `${years} years` }
        ],
        timeline,
        breakdown: [
          { label: "Invested", amount: roundCurrency(initial) },
          { label: gain >= 0 ? "Gain" : "Loss", amount: roundCurrency(Math.abs(gain)) }
        ],
        milestones: [
          { label: "Total return", value: formatPercent(roi) },
          { label: "Annualized return", value: formatPercent(annualized) },
          { label: "Value multiple", value: `${(initial > 0 ? finalValue / initial : 0).toFixed(2)}x` }
        ],
        note: "ROI ignores taxes, fees, and the timing of any cash added or withdrawn along the way."
      };
    }
  },
  {
    slug: "cagr-calculator",
    name: "CAGR Calculator",
    category: "Investing",
    description: "Calculate the compound annual growth rate (CAGR) that connects a starting value and an ending value over a number of years.",
    intro:
      "Enter a beginning value, an ending value, and the number of years to find the steady annual rate that links them together.",
    keywords: [
      "cagr calculator",
      "compound annual growth rate calculator",
      "average annual growth rate"
    ],
    defaults: {
      beginningValue: 10000,
      endingValue: 25000,
      years: 8
    },
    inputs: [
      { name: "beginningValue", label: "Beginning value", prefix: "$", min: 1, step: 100 },
      { name: "endingValue", label: "Ending value", prefix: "$", min: 0, step: 100 },
      { name: "years", label: "Number of years", suffix: "years", min: 1, step: 1 }
    ],
    presets: true,
    example: "Growing $10,000 into $25,000 over eight years works out to a CAGR of roughly 12.1% per year.",
    sections: [
      {
        title: "What CAGR measures",
        body:
          "CAGR is the single steady growth rate that would take the beginning value to the ending value over the period, as if it grew the same amount every year. It smooths out the bumps so different investments can be compared on equal footing."
      },
      {
        title: "Why it beats a simple average",
        body:
          "Averaging yearly returns can be misleading because gains and losses compound on each other. CAGR accounts for that compounding, so it reflects the real path from start to finish rather than a naive average."
      },
      {
        title: "Where CAGR can mislead",
        body:
          "Because CAGR only looks at the first and last values, it hides the volatility in between. Two investments can share a CAGR while one took a calm path and the other swung wildly. Use it alongside a sense of the risk involved."
      }
    ],
    faqs: [
      {
        question: "What is the difference between CAGR and average return?",
        answer: "A simple average just adds the yearly returns and divides by the number of years. CAGR accounts for compounding, so it reflects the actual rate that connects the starting and ending values, which is usually lower than a simple average when returns are volatile."
      },
      {
        question: "Can CAGR be negative?",
        answer: "Yes. If the ending value is lower than the beginning value, CAGR is negative, describing the steady annual rate of decline over the period."
      }
    ],
    related: ["roi-calculator", "compound-interest-calculator", "inflation-calculator"],
    compute(values) {
      const begin = Number(values.beginningValue);
      const end = Number(values.endingValue);
      const years = Number(values.years);
      const cagr = begin > 0 && years > 0 ? ((end / begin) ** (1 / years) - 1) * 100 : 0;
      const totalGrowth = begin > 0 ? ((end - begin) / begin) * 100 : 0;
      const timeline = Array.from({ length: years }, (_, index) => ({
        label: `Year ${index + 1}`,
        amount: roundCurrency(begin * (1 + cagr / 100) ** (index + 1))
      }));

      return {
        summary: [
          { label: "CAGR", value: formatPercent(cagr) },
          { label: "Total growth", value: formatPercent(totalGrowth) },
          { label: "Ending value", value: formatCurrency(end) }
        ],
        details: [
          { label: "Beginning value", value: formatCurrency(begin) },
          { label: "Ending value", value: formatCurrency(end) },
          { label: "Period", value: `${years} years` }
        ],
        timeline,
        breakdown: [
          { label: "Starting", amount: roundCurrency(begin) },
          { label: end >= begin ? "Growth" : "Decline", amount: roundCurrency(Math.abs(end - begin)) }
        ],
        milestones: [
          { label: "Annual growth rate", value: formatPercent(cagr) },
          { label: "Total change", value: formatPercent(totalGrowth) },
          { label: "Value multiple", value: `${(begin > 0 ? end / begin : 0).toFixed(2)}x` }
        ],
        note: "CAGR describes the smooth annual rate that connects the start and end values. Real year-to-year returns are usually bumpier."
      };
    }
  },
  {
    slug: "dividend-calculator",
    name: "Dividend Calculator",
    category: "Investing",
    description: "Estimate dividend income and long-term portfolio growth when dividends are reinvested each year through a DRIP.",
    intro:
      "Enter an investment, a dividend yield, and an expected price growth rate to see your first-year income and how reinvested dividends compound over time.",
    keywords: [
      "dividend calculator",
      "dividend reinvestment calculator",
      "drip calculator"
    ],
    defaults: {
      investmentAmount: 50000,
      dividendYield: 3.5,
      annualPriceGrowth: 4,
      years: 20
    },
    inputs: [
      { name: "investmentAmount", label: "Amount invested", prefix: "$", min: 100, step: 500 },
      { name: "dividendYield", label: "Dividend yield", suffix: "%", min: 0, step: 0.1 },
      { name: "annualPriceGrowth", label: "Annual price growth", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Years reinvested", suffix: "years", min: 1, step: 1 }
    ],
    presets: true,
    example: "A $50,000 portfolio yielding 3.5% pays about $1,750 in the first year, and reinvesting those dividends speeds up the growth from there.",
    sections: [
      {
        title: "How dividend reinvestment compounds",
        body:
          "When dividends are reinvested, each payout buys more shares, and those shares then pay their own dividends. Over many years this loop can turn a steady yield into a meaningfully larger portfolio than price growth alone would produce."
      },
      {
        title: "Yield is not the whole return",
        body:
          "Total return combines the dividend yield with any change in share price. A high yield with falling prices can lag a modest yield paired with steady growth, so it helps to look at both numbers together."
      },
      {
        title: "What this model simplifies",
        body:
          "This estimate assumes a constant yield, steady price growth, and dividends reinvested once a year. Real dividends can be cut or raised, prices move unevenly, and taxes on dividends in a regular account will lower the net result."
      }
    ],
    faqs: [
      {
        question: "What is a DRIP?",
        answer: "A DRIP, or dividend reinvestment plan, automatically uses each dividend payment to buy more shares instead of paying you cash. It is a simple way to keep compounding without having to act on every payout."
      },
      {
        question: "Are reinvested dividends taxed?",
        answer: "In a regular taxable account, dividends are generally taxable in the year they are paid even if you reinvest them. In tax-advantaged accounts like an IRA, that yearly tax is deferred or avoided. This tool does not subtract taxes."
      }
    ],
    related: ["compound-interest-calculator", "roi-calculator", "retirement-calculator"],
    compute(values) {
      const principal = Number(values.investmentAmount);
      const dividendRate = Number(values.dividendYield) / 100;
      const growthRate = Number(values.annualPriceGrowth) / 100;
      const years = Number(values.years);
      let value = principal;
      let totalDividends = 0;
      const timeline = [];

      for (let year = 1; year <= years; year += 1) {
        const dividend = value * dividendRate;
        totalDividends += dividend;
        value = value * (1 + growthRate) + dividend;
        timeline.push({ label: `Year ${year}`, amount: roundCurrency(value) });
      }

      const firstYearIncome = principal * dividendRate;
      const priceGrowthPortion = value - principal - totalDividends;

      return {
        summary: [
          { label: "Final portfolio value", value: formatCurrency(value) },
          { label: "Total dividends earned", value: formatCurrency(totalDividends) },
          { label: "First-year income", value: formatCurrency(firstYearIncome) }
        ],
        details: [
          { label: "Amount invested", value: formatCurrency(principal) },
          { label: "Dividend yield", value: formatPercent(values.dividendYield) },
          { label: "Annual price growth", value: formatPercent(values.annualPriceGrowth) },
          { label: "Years reinvested", value: `${years} years` }
        ],
        timeline,
        breakdown: [
          { label: "Invested", amount: roundCurrency(principal) },
          { label: "Dividends", amount: roundCurrency(totalDividends) },
          { label: "Price growth", amount: roundCurrency(Math.max(0, priceGrowthPortion)) }
        ],
        milestones: [
          { label: "First-year income", value: formatCurrency(firstYearIncome) },
          { label: "Total dividends", value: formatCurrency(totalDividends) },
          { label: "Ending value", value: formatCurrency(value) }
        ],
        note: "Assumes dividends are reinvested once a year and that the yield and growth rates stay constant. Taxes are not included."
      };
    }
  },
  {
    slug: "401k-calculator",
    name: "401(k) Calculator",
    category: "Retirement",
    description: "Project your 401(k) balance at retirement, including your contributions, the employer match, and long-term investment growth.",
    intro:
      "Enter your salary, contribution rate, and employer match to see how much your 401(k) could grow and how much of it is free matching money.",
    keywords: [
      "401k calculator",
      "401k growth calculator",
      "employer match calculator"
    ],
    defaults: {
      currentBalance: 40000,
      annualSalary: 75000,
      contributionPercent: 8,
      employerMatchPercent: 4,
      annualReturn: 7,
      years: 30
    },
    inputs: [
      { name: "currentBalance", label: "Current 401(k) balance", prefix: "$", min: 0, step: 1000 },
      { name: "annualSalary", label: "Annual salary", prefix: "$", min: 10000, step: 1000 },
      { name: "contributionPercent", label: "Your contribution", suffix: "%", min: 0, step: 0.5 },
      { name: "employerMatchPercent", label: "Employer match cap", suffix: "%", min: 0, step: 0.5 }
    ],
    advancedInputs: [
      { name: "annualReturn", label: "Expected return", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Years to retirement", suffix: "years", min: 1, step: 1 }
    ],
    presets: true,
    example: "Contributing 8% on a $75,000 salary with a 4% match means thousands of dollars in free employer money added every year.",
    sections: [
      {
        title: "The employer match is free money",
        body:
          "Most employers match a portion of what you contribute, commonly dollar for dollar up to a few percent of your salary. Contributing at least enough to capture the full match is one of the most reliable returns in personal finance."
      },
      {
        title: "Why starting early matters so much",
        body:
          "Because 401(k) money compounds for decades, contributions made in your twenties and thirties do far more heavy lifting than the same dollars added later. Time in the market is the largest single driver of the final balance."
      },
      {
        title: "What this projection assumes",
        body:
          "This model holds your salary, contribution rate, and return steady, and treats the match as dollar for dollar up to the cap you set. Raises, contribution limit changes, and market swings will all move the real outcome."
      }
    ],
    faqs: [
      {
        question: "How much should I contribute to my 401(k)?",
        answer: "A common starting point is to contribute at least enough to get the full employer match, then work toward 10% to 15% of your salary including the match. The right number depends on your budget and other goals."
      },
      {
        question: "How does the employer match work?",
        answer: "Employers typically match your contributions up to a percentage of your salary. This calculator models a dollar-for-dollar match up to the cap you enter, so if you contribute less than the cap, the match shrinks to match your rate."
      }
    ],
    related: ["roth-ira-calculator", "retirement-calculator", "compound-interest-calculator"],
    compute(values) {
      const years = Number(values.years) || 30;
      const months = years * 12;
      const monthlyRate = Number(values.annualReturn) / 100 / 12;
      const salary = Number(values.annualSalary);
      const contribRate = Number(values.contributionPercent) / 100;
      const matchRate = Math.min(Number(values.contributionPercent), Number(values.employerMatchPercent)) / 100;
      const employeeMonthly = (salary * contribRate) / 12;
      const employerMonthly = (salary * matchRate) / 12;
      const series = buildBalanceSeries({
        openingBalance: Number(values.currentBalance),
        months,
        monthlyRate,
        monthlyContribution: employeeMonthly + employerMonthly
      });
      const finalBalance = series.at(-1)?.amount ?? Number(values.currentBalance);
      const employeeTotal = employeeMonthly * months;
      const employerTotal = employerMonthly * months;
      const totalContributions = Number(values.currentBalance) + employeeTotal + employerTotal;
      const growth = finalBalance - totalContributions;

      return {
        summary: [
          { label: "Projected 401(k) balance", value: formatCurrency(finalBalance) },
          { label: "Employer match added", value: formatCurrency(employerTotal) },
          { label: "Investment growth", value: formatCurrency(growth) }
        ],
        details: [
          { label: "Current balance", value: formatCurrency(values.currentBalance) },
          { label: "Your yearly contribution", value: formatCurrency(salary * contribRate) },
          { label: "Employer yearly match", value: formatCurrency(salary * matchRate) },
          { label: "Expected return", value: formatPercent(values.annualReturn) }
        ],
        timeline: series,
        breakdown: [
          { label: "Your money", amount: roundCurrency(Number(values.currentBalance) + employeeTotal) },
          { label: "Employer match", amount: roundCurrency(employerTotal) },
          { label: "Growth", amount: roundCurrency(Math.max(0, growth)) }
        ],
        milestones: [
          { label: "Your contributions", value: formatCurrency(employeeTotal) },
          { label: "Employer match", value: formatCurrency(employerTotal) },
          { label: "Free match each year", value: formatCurrency(salary * matchRate) }
        ],
        note: "Employer match is modeled as a dollar-for-dollar match up to the cap you set. Salary growth and contribution limits are not modeled."
      };
    }
  },
  {
    slug: "roth-ira-calculator",
    name: "Roth IRA Calculator",
    category: "Retirement",
    description: "Project the tax-free balance a Roth IRA could reach at retirement based on your contributions and expected return.",
    intro:
      "Enter your current balance, yearly contribution, and time horizon to estimate the tax-free nest egg a Roth IRA could build.",
    keywords: [
      "roth ira calculator",
      "roth ira growth calculator",
      "tax free retirement calculator"
    ],
    defaults: {
      currentBalance: 15000,
      annualContribution: 7000,
      annualReturn: 7,
      years: 30
    },
    inputs: [
      { name: "currentBalance", label: "Current balance", prefix: "$", min: 0, step: 500 },
      { name: "annualContribution", label: "Annual contribution", prefix: "$", min: 0, step: 500 },
      { name: "annualReturn", label: "Expected return", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Years invested", suffix: "years", min: 1, step: 1 }
    ],
    presets: true,
    example: "Contributing $7,000 a year for 30 years at 7% can grow into a sizable balance you can generally withdraw tax-free in retirement.",
    sections: [
      {
        title: "Why tax-free growth matters",
        body:
          "Roth IRA contributions are made with money you have already paid tax on. In exchange, qualified withdrawals in retirement, including all the growth, are generally tax-free. Over decades, that untaxed growth can be worth a great deal."
      },
      {
        title: "Roth versus traditional",
        body:
          "A traditional account gives you a tax break now and taxes withdrawals later, while a Roth does the opposite. A Roth often wins if you expect to be in a similar or higher tax bracket in retirement, or simply value predictable tax-free income."
      },
      {
        title: "Contribution limits and rules",
        body:
          "Roth IRAs have annual contribution limits and income eligibility rules that change over time. This calculator does not enforce those limits, so confirm the current year's caps before planning your contributions."
      }
    ],
    faqs: [
      {
        question: "How much can I contribute to a Roth IRA?",
        answer: "Annual contribution limits are set each year and are higher for savers age 50 and over. Eligibility also phases out at higher incomes. Check the current year's official limits, since this tool does not cap the amount you enter."
      },
      {
        question: "When can I withdraw from a Roth IRA tax-free?",
        answer: "Qualified withdrawals are generally tax-free once the account has been open at least five years and you are age 59 and a half or older. Contributions can usually be withdrawn at any time, but earnings have stricter rules."
      }
    ],
    related: ["401k-calculator", "retirement-calculator", "compound-interest-calculator"],
    compute(values) {
      const years = Number(values.years);
      const months = years * 12;
      const monthlyRate = Number(values.annualReturn) / 100 / 12;
      const monthlyContribution = Number(values.annualContribution) / 12;
      const series = buildBalanceSeries({
        openingBalance: Number(values.currentBalance),
        months,
        monthlyRate,
        monthlyContribution
      });
      const finalBalance = series.at(-1)?.amount ?? Number(values.currentBalance);
      const totalContributions = Number(values.currentBalance) + Number(values.annualContribution) * years;
      const growth = finalBalance - totalContributions;

      return {
        summary: [
          { label: "Tax-free balance at retirement", value: formatCurrency(finalBalance) },
          { label: "Total contributions", value: formatCurrency(totalContributions) },
          { label: "Tax-free growth", value: formatCurrency(growth) }
        ],
        details: [
          { label: "Current balance", value: formatCurrency(values.currentBalance) },
          { label: "Annual contribution", value: formatCurrency(values.annualContribution) },
          { label: "Expected return", value: formatPercent(values.annualReturn) },
          { label: "Years invested", value: `${years} years` }
        ],
        timeline: series,
        breakdown: [
          { label: "Contributions", amount: roundCurrency(totalContributions) },
          { label: "Growth", amount: roundCurrency(Math.max(0, growth)) }
        ],
        milestones: [
          { label: "Total contributed", value: formatCurrency(totalContributions) },
          { label: "Tax-free growth", value: formatCurrency(growth) },
          { label: "Ending balance", value: formatCurrency(finalBalance) }
        ],
        note: "Roth contributions are made with after-tax money, so qualified withdrawals in retirement are generally tax-free. Annual limits are not enforced here."
      };
    }
  },
  {
    slug: "paycheck-calculator",
    name: "Paycheck Calculator",
    category: "Income & Tax",
    description: "Estimate your take-home pay after federal income tax withholding, Social Security, Medicare, and pre-tax deductions.",
    intro:
      "Enter your salary and pre-tax contributions to estimate the federal portion of each paycheck and what actually lands in your account.",
    keywords: [
      "paycheck calculator",
      "take home pay calculator",
      "net pay after taxes"
    ],
    defaults: {
      annualSalary: 60000,
      preTaxDeductions: 3000,
      payPeriods: 26,
      filingStatus: 0
    },
    inputs: [
      { name: "annualSalary", label: "Annual salary", prefix: "$", min: 0, step: 1000 },
      { name: "preTaxDeductions", label: "Annual pre-tax deductions", prefix: "$", min: 0, step: 500 },
      { name: "payPeriods", label: "Pay periods per year", min: 1, max: 52, step: 1 }
    ],
    advancedInputs: [
      { name: "filingStatus", label: "Filing (0 single, 1 married)", min: 0, max: 1, step: 1 }
    ],
    presets: true,
    example: "On a $60,000 salary, federal income tax plus FICA can take a meaningful slice before pre-tax 401(k) or health deductions are even counted.",
    sections: [
      {
        title: "What comes out of a paycheck",
        body:
          "Gross pay is reduced by pre-tax deductions like 401(k) and health premiums, then by federal income tax withholding and FICA taxes for Social Security and Medicare. What remains is your take-home, or net, pay."
      },
      {
        title: "Why pre-tax deductions help twice",
        body:
          "Money you route into pre-tax accounts lowers the income that federal tax is calculated on, so a dollar saved there costs you less than a dollar in take-home pay. That is part of why workplace retirement and HSA contributions are efficient."
      },
      {
        title: "What this estimate leaves out",
        body:
          "This is a federal-level estimate. It does not include state or local income tax, and real withholding depends on your W-4, credits, and other details. Treat it as a planning baseline, not an exact paystub."
      }
    ],
    faqs: [
      {
        question: "Does this include state taxes?",
        answer: "No. This calculator estimates federal income tax withholding plus Social Security and Medicare only. State and local income taxes vary widely and are not included, so your actual take-home may be lower."
      },
      {
        question: "Why is my real paycheck different?",
        answer: "Actual withholding depends on your W-4 elections, tax credits, additional withholding, and benefit choices. This tool uses 2025 federal brackets and the standard deduction as a simplified baseline."
      }
    ],
    related: ["income-tax-calculator", "salary-calculator", "budget-calculator"],
    compute(values) {
      const salary = Number(values.annualSalary);
      const preTax = Math.min(Number(values.preTaxDeductions), salary);
      const status = Number(values.filingStatus) === 1 ? "married" : "single";
      const periods = Math.max(1, Number(values.payPeriods));
      const deduction = STANDARD_DEDUCTION_2025[status];
      const taxable = Math.max(0, salary - preTax - deduction);
      const incomeTax = federalIncomeTax(taxable, status);
      const fica = ficaTax(salary - preTax);
      const totalTax = incomeTax + fica.total;
      const netAnnual = salary - preTax - totalTax;
      const effectiveRate = salary > 0 ? (totalTax / salary) * 100 : 0;

      return {
        summary: [
          { label: "Take-home per paycheck", value: formatCurrencyPrecise(netAnnual / periods) },
          { label: "Annual take-home", value: formatCurrency(netAnnual) },
          { label: "Effective tax rate", value: formatPercent(effectiveRate) }
        ],
        details: [
          { label: "Gross salary", value: formatCurrency(salary) },
          { label: "Pre-tax deductions", value: formatCurrency(preTax) },
          { label: "Federal income tax", value: formatCurrency(incomeTax) },
          { label: "Social Security + Medicare", value: formatCurrency(fica.total) }
        ],
        timeline: [],
        breakdown: [
          { label: "Take-home", amount: roundCurrency(netAnnual) },
          { label: "Income tax", amount: roundCurrency(incomeTax) },
          { label: "FICA", amount: roundCurrency(fica.total) },
          { label: "Pre-tax", amount: roundCurrency(preTax) }
        ],
        milestones: [
          { label: "Per paycheck", value: formatCurrencyPrecise(netAnnual / periods) },
          { label: "Monthly take-home", value: formatCurrency(netAnnual / 12) },
          { label: "Total federal tax", value: formatCurrency(totalTax) }
        ],
        note: "Federal estimate only, using 2025 brackets and the standard deduction. State and local taxes are not included."
      };
    }
  },
  {
    slug: "salary-calculator",
    name: "Salary Calculator",
    category: "Income & Tax",
    description: "Convert an hourly wage into weekly, monthly, and annual pay, or work back from a salary to an hourly rate.",
    intro:
      "Enter an hourly wage and your usual schedule to see what it adds up to across a week, month, and year before taxes.",
    keywords: [
      "salary calculator",
      "hourly to salary calculator",
      "hourly wage to annual income"
    ],
    defaults: {
      hourlyRate: 25,
      hoursPerWeek: 40,
      weeksPerYear: 52
    },
    inputs: [
      { name: "hourlyRate", label: "Hourly rate", prefix: "$", min: 0, step: 0.5 },
      { name: "hoursPerWeek", label: "Hours per week", min: 1, max: 80, step: 1 },
      { name: "weeksPerYear", label: "Weeks worked per year", min: 1, max: 52, step: 1 }
    ],
    presets: true,
    example: "At $25 an hour for a standard 40-hour week, the annual figure lands around $52,000 before taxes.",
    sections: [
      {
        title: "Hourly and salary are two views of the same pay",
        body:
          "An hourly rate becomes an annual salary once you multiply by the hours you work each week and the weeks you work each year. Going the other direction, a salary divided by those same hours gives an effective hourly rate."
      },
      {
        title: "Watch the weeks and hours assumptions",
        body:
          "A full year is 52 weeks, but unpaid time off, part-time schedules, or overtime all change the real total. Adjusting weeks worked and hours per week is what makes the comparison match your actual situation."
      },
      {
        title: "This is gross, not take-home",
        body:
          "These figures are before taxes and deductions. To see what actually reaches your bank account, run the result through a paycheck or income tax estimate."
      }
    ],
    faqs: [
      {
        question: "How do I convert hourly pay to a yearly salary?",
        answer: "Multiply your hourly rate by hours worked per week, then by weeks worked per year. For example, $25 times 40 hours times 52 weeks is $52,000 per year before taxes."
      },
      {
        question: "Is this before or after taxes?",
        answer: "These amounts are gross pay, before income tax and other deductions. Use the paycheck calculator to estimate take-home pay."
      }
    ],
    related: ["paycheck-calculator", "income-tax-calculator", "budget-calculator"],
    compute(values) {
      const rate = Number(values.hourlyRate);
      const hours = Number(values.hoursPerWeek);
      const weeks = Number(values.weeksPerYear);
      const weekly = rate * hours;
      const annual = weekly * weeks;
      const monthly = annual / 12;
      const daily = rate * (hours / 5);

      return {
        summary: [
          { label: "Annual salary", value: formatCurrency(annual) },
          { label: "Monthly pay", value: formatCurrency(monthly) },
          { label: "Weekly pay", value: formatCurrency(weekly) }
        ],
        details: [
          { label: "Hourly rate", value: formatCurrencyPrecise(rate) },
          { label: "Hours per week", value: `${hours} hours` },
          { label: "Weeks per year", value: `${weeks} weeks` },
          { label: "Estimated daily pay", value: formatCurrencyPrecise(daily) }
        ],
        timeline: [],
        breakdown: [
          { label: "Weekly", amount: roundCurrency(weekly) },
          { label: "Monthly", amount: roundCurrency(monthly) },
          { label: "Annual", amount: roundCurrency(annual) }
        ],
        milestones: [
          { label: "Per week", value: formatCurrency(weekly) },
          { label: "Per month", value: formatCurrency(monthly) },
          { label: "Per year", value: formatCurrency(annual) }
        ],
        note: "These amounts are gross pay before taxes and deductions."
      };
    }
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    category: "Income & Tax",
    description: "Estimate your federal income tax, effective tax rate, and after-tax income using 2025 brackets and the standard deduction.",
    intro:
      "Enter your income and filing status to estimate federal income tax, your marginal and effective rates, and what is left after tax.",
    keywords: [
      "income tax calculator",
      "federal income tax estimator",
      "effective tax rate calculator"
    ],
    defaults: {
      annualIncome: 75000,
      filingStatus: 0
    },
    inputs: [
      { name: "annualIncome", label: "Annual income", prefix: "$", min: 0, step: 1000 },
      { name: "filingStatus", label: "Filing (0 single, 1 married)", min: 0, max: 1, step: 1 }
    ],
    presets: true,
    example: "On $75,000 of income, the standard deduction lowers the taxable amount before the bracket rates ever apply, so the effective rate is well below the top bracket.",
    sections: [
      {
        title: "Marginal versus effective tax rate",
        body:
          "Your marginal rate is the bracket your last dollar falls into; your effective rate is total tax divided by total income. Because the system is progressive, the effective rate is always lower than the marginal rate."
      },
      {
        title: "The standard deduction comes first",
        body:
          "Most filers subtract the standard deduction before any bracket applies. That means a chunk of income is taxed at zero, which is why the first dollars of salary are not taxed at your top rate."
      },
      {
        title: "What this estimate excludes",
        body:
          "This tool models federal income tax with the standard deduction only. It does not include credits, itemized deductions, capital gains rates, the additional Medicare tax, or any state tax, so treat it as a planning estimate."
      }
    ],
    faqs: [
      {
        question: "What is the difference between marginal and effective rate?",
        answer: "The marginal rate is the tax on your next dollar of income, set by your top bracket. The effective rate is your total tax divided by total income, which is lower because earlier income is taxed at lower bracket rates."
      },
      {
        question: "Does this include the standard deduction?",
        answer: "Yes. This estimate subtracts the 2025 standard deduction for your filing status before applying the brackets. It does not model itemized deductions, credits, or state taxes."
      }
    ],
    related: ["paycheck-calculator", "salary-calculator", "self-employment-tax-calculator"],
    compute(values) {
      const income = Number(values.annualIncome);
      const status = Number(values.filingStatus) === 1 ? "married" : "single";
      const deduction = STANDARD_DEDUCTION_2025[status];
      const taxable = Math.max(0, income - deduction);
      const tax = federalIncomeTax(taxable, status);
      const afterTax = income - tax;
      const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
      const brackets = FEDERAL_BRACKETS_2025[status];
      let marginalRate = brackets[0][1];
      for (let i = 0; i < brackets.length; i += 1) {
        if (taxable > brackets[i][0]) {
          marginalRate = brackets[i][1];
        }
      }

      return {
        summary: [
          { label: "Federal income tax", value: formatCurrency(tax) },
          { label: "After-tax income", value: formatCurrency(afterTax) },
          { label: "Effective rate", value: formatPercent(effectiveRate) }
        ],
        details: [
          { label: "Gross income", value: formatCurrency(income) },
          { label: "Standard deduction", value: formatCurrency(deduction) },
          { label: "Taxable income", value: formatCurrency(taxable) },
          { label: "Marginal bracket", value: formatPercent(marginalRate * 100) }
        ],
        timeline: [],
        breakdown: [
          { label: "After-tax income", amount: roundCurrency(afterTax) },
          { label: "Federal tax", amount: roundCurrency(tax) }
        ],
        milestones: [
          { label: "Total federal tax", value: formatCurrency(tax) },
          { label: "Effective rate", value: formatPercent(effectiveRate) },
          { label: "Marginal rate", value: formatPercent(marginalRate * 100) }
        ],
        note: "Federal estimate using 2025 brackets and the standard deduction. Credits, itemized deductions, and state taxes are not included."
      };
    }
  },
  {
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    category: "Income & Tax",
    description: "Add sales tax to a price to get the total, or work backward from a total to find the pre-tax price and tax amount.",
    intro:
      "Enter a price and a sales tax rate to see the tax and final total, or reverse it to pull the pre-tax price out of a receipt total.",
    keywords: [
      "sales tax calculator",
      "reverse sales tax calculator",
      "price plus tax calculator"
    ],
    defaults: {
      amount: 100,
      taxRate: 7.25,
      mode: 0
    },
    inputs: [
      { name: "amount", label: "Amount", prefix: "$", min: 0, step: 1 },
      { name: "taxRate", label: "Sales tax rate", suffix: "%", min: 0, step: 0.05 }
    ],
    advancedInputs: [
      { name: "mode", label: "Mode (0 add tax, 1 remove tax)", min: 0, max: 1, step: 1 }
    ],
    presets: true,
    example: "A $100 purchase at a 7.25% sales tax rate comes to $107.25, with $7.25 going to tax.",
    sections: [
      {
        title: "Adding tax versus removing tax",
        body:
          "Adding tax multiplies the price by one plus the rate. Removing tax does the reverse: it divides a tax-included total by one plus the rate to recover the original pre-tax price, which is useful for expense reports and reconciling receipts."
      },
      {
        title: "Rates vary a lot by location",
        body:
          "Combined state and local sales tax rates differ widely and some items are exempt. Enter the rate that applies where the purchase happens rather than assuming a single national number."
      },
      {
        title: "Sales tax is separate from income tax",
        body:
          "Sales tax is charged at the point of purchase on goods and some services. It is unrelated to the income tax taken from your paycheck, even though both reduce what your money ultimately buys."
      }
    ],
    faqs: [
      {
        question: "How do I calculate the pre-tax price from a total?",
        answer: "Divide the tax-included total by one plus the tax rate. For example, a $107.25 total at 7.25% divided by 1.0725 gives a $100 pre-tax price. Switch this calculator to remove-tax mode to do it automatically."
      },
      {
        question: "Why is sales tax different where I shop?",
        answer: "Sales tax combines state, county, and city rates, which vary by location, and some categories like groceries may be taxed differently or exempt. Always use the local combined rate."
      }
    ],
    related: ["income-tax-calculator", "budget-calculator", "paycheck-calculator"],
    compute(values) {
      const amount = Number(values.amount);
      const rate = Number(values.taxRate) / 100;
      const removeMode = Number(values.mode) === 1;
      const preTax = removeMode ? amount / (1 + rate) : amount;
      const taxAmount = removeMode ? amount - preTax : amount * rate;
      const total = removeMode ? amount : amount + taxAmount;

      return {
        summary: [
          { label: removeMode ? "Pre-tax price" : "Total with tax", value: formatCurrencyPrecise(removeMode ? preTax : total) },
          { label: "Sales tax", value: formatCurrencyPrecise(taxAmount) },
          { label: "Tax rate", value: formatPercent(Number(values.taxRate)) }
        ],
        details: [
          { label: "Pre-tax price", value: formatCurrencyPrecise(preTax) },
          { label: "Tax amount", value: formatCurrencyPrecise(taxAmount) },
          { label: "Total", value: formatCurrencyPrecise(total) },
          { label: "Mode", value: removeMode ? "Remove tax from total" : "Add tax to price" }
        ],
        timeline: [],
        breakdown: [
          { label: "Pre-tax", amount: roundCurrency(preTax) },
          { label: "Tax", amount: roundCurrency(taxAmount) }
        ],
        milestones: [
          { label: "Pre-tax price", value: formatCurrencyPrecise(preTax) },
          { label: "Tax", value: formatCurrencyPrecise(taxAmount) },
          { label: "Total", value: formatCurrencyPrecise(total) }
        ],
        note: "Enter the combined state and local rate for the purchase location. Item exemptions are not modeled."
      };
    }
  },
  {
    slug: "self-employment-tax-calculator",
    name: "Self-Employment Tax Calculator",
    category: "Income & Tax",
    description: "Estimate the self-employment tax you owe on freelance or business net earnings, including the Social Security and Medicare portions.",
    intro:
      "Enter your net self-employment earnings to estimate the 15.3% self-employment tax and the deductible employer-equivalent half.",
    keywords: [
      "self employment tax calculator",
      "1099 tax calculator",
      "freelance tax calculator"
    ],
    defaults: {
      netEarnings: 50000
    },
    inputs: [
      { name: "netEarnings", label: "Net self-employment earnings", prefix: "$", min: 0, step: 1000 }
    ],
    presets: true,
    example: "On $50,000 of net earnings, self-employment tax is calculated on 92.35% of that amount at a combined 15.3% rate.",
    sections: [
      {
        title: "What self-employment tax covers",
        body:
          "When you work for yourself, you pay both the employee and employer share of Social Security and Medicare. That combined 15.3% is the self-employment tax, charged on 92.35% of your net business earnings."
      },
      {
        title: "Half of it is deductible",
        body:
          "You can deduct the employer-equivalent half of self-employment tax when figuring your income tax. It does not reduce the self-employment tax itself, but it lowers the income that your federal income tax is based on."
      },
      {
        title: "Plan for quarterly payments",
        body:
          "Because no employer withholds taxes for you, self-employment tax and income tax are usually paid through quarterly estimated payments. Setting money aside as you earn it avoids a large bill and potential penalties at filing time."
      }
    ],
    faqs: [
      {
        question: "What is the self-employment tax rate?",
        answer: "It is 15.3% total: 12.4% for Social Security on earnings up to the annual wage base, plus 2.9% for Medicare with no cap. It applies to 92.35% of your net self-employment earnings."
      },
      {
        question: "Is this the same as income tax?",
        answer: "No. Self-employment tax funds Social Security and Medicare and is separate from federal income tax. A self-employed person generally owes both on the same earnings, which is why setting money aside matters."
      }
    ],
    related: ["income-tax-calculator", "paycheck-calculator", "budget-calculator"],
    compute(values) {
      const net = Number(values.netEarnings);
      const taxableBase = net * 0.9235;
      const socialSecurity = Math.min(taxableBase, SOCIAL_SECURITY_WAGE_BASE_2025) * 0.124;
      const medicare = taxableBase * 0.029;
      const seTax = socialSecurity + medicare;
      const deductibleHalf = seTax / 2;
      const effectiveRate = net > 0 ? (seTax / net) * 100 : 0;

      return {
        summary: [
          { label: "Self-employment tax", value: formatCurrency(seTax) },
          { label: "Deductible half", value: formatCurrency(deductibleHalf) },
          { label: "Effective rate", value: formatPercent(effectiveRate) }
        ],
        details: [
          { label: "Net earnings", value: formatCurrency(net) },
          { label: "Taxable base (92.35%)", value: formatCurrency(taxableBase) },
          { label: "Social Security portion", value: formatCurrency(socialSecurity) },
          { label: "Medicare portion", value: formatCurrency(medicare) }
        ],
        timeline: [],
        breakdown: [
          { label: "Social Security", amount: roundCurrency(socialSecurity) },
          { label: "Medicare", amount: roundCurrency(medicare) }
        ],
        milestones: [
          { label: "Total SE tax", value: formatCurrency(seTax) },
          { label: "Deductible half", value: formatCurrency(deductibleHalf) },
          { label: "Set aside per quarter", value: formatCurrency(seTax / 4) }
        ],
        note: "Estimate of self-employment tax only, using the 15.3% combined rate on 92.35% of net earnings. Federal and state income taxes are separate."
      };
    }
  },
  {
    slug: "debt-to-income-ratio-calculator",
    name: "Debt-to-Income Ratio Calculator",
    category: "Debt",
    description: "Calculate your front-end and back-end debt-to-income ratios to see how lenders are likely to view your monthly obligations.",
    intro:
      "Enter your gross monthly income, housing payment, and other debt payments to see the ratios lenders use to judge how much room is left in your budget.",
    keywords: [
      "debt to income ratio calculator",
      "dti calculator",
      "how to calculate debt to income"
    ],
    defaults: {
      grossMonthlyIncome: 7000,
      housingPayment: 1800,
      otherDebtPayments: 600
    },
    inputs: [
      { name: "grossMonthlyIncome", label: "Gross monthly income", prefix: "$", min: 0, step: 100 },
      { name: "housingPayment", label: "Housing payment", prefix: "$", min: 0, step: 50 },
      { name: "otherDebtPayments", label: "Other monthly debt", prefix: "$", min: 0, step: 50 }
    ],
    presets: true,
    example: "A $7,000 monthly income with $1,800 housing and $600 other debt gives a back-end DTI around 34%, which most lenders view as healthy.",
    sections: [
      {
        title: "Front-end versus back-end DTI",
        body:
          "Front-end DTI is your housing payment divided by gross monthly income. Back-end DTI adds all other required debt payments. Lenders care most about the back-end number because it captures your full monthly obligation."
      },
      {
        title: "The guidelines lenders use",
        body:
          "A common benchmark keeps back-end DTI at or below 36%, though many mortgage programs allow up to 43% or higher with strong credit and reserves. Lower is safer and usually unlocks better terms."
      },
      {
        title: "Lowering your ratio",
        body:
          "Because DTI is a ratio, you can improve it by raising income or by reducing the monthly payments that count against it. Paying off a small loan often helps more than its size suggests, since it removes the whole monthly payment."
      }
    ],
    faqs: [
      {
        question: "What is a good debt-to-income ratio?",
        answer: "Many lenders look for a back-end DTI at or below 36%. Some mortgage programs allow up to 43% or more, but a lower ratio generally means easier approval and better rates."
      },
      {
        question: "What counts as debt in DTI?",
        answer: "Required monthly payments like rent or mortgage, auto loans, student loans, minimum credit card payments, and other installment loans. Everyday expenses like groceries and utilities are not included."
      }
    ],
    related: ["home-affordability-calculator", "budget-calculator", "debt-payoff-calculator"],
    compute(values) {
      const income = Number(values.grossMonthlyIncome);
      const housing = Number(values.housingPayment);
      const otherDebts = Number(values.otherDebtPayments);
      const frontEnd = income > 0 ? (housing / income) * 100 : 0;
      const backEnd = income > 0 ? ((housing + otherDebts) / income) * 100 : 0;
      const room = Math.max(0, income * 0.36 - housing - otherDebts);
      const rating = backEnd <= 36 ? "Healthy" : backEnd <= 43 ? "Manageable" : "High";

      return {
        summary: [
          { label: "Back-end DTI", value: formatPercent(backEnd) },
          { label: "Front-end DTI", value: formatPercent(frontEnd) },
          { label: "Lender view", value: rating }
        ],
        details: [
          { label: "Gross monthly income", value: formatCurrency(income) },
          { label: "Housing payment", value: formatCurrency(housing) },
          { label: "Other debt payments", value: formatCurrency(otherDebts) },
          { label: "Room under 36% guideline", value: formatCurrencyPrecise(room) }
        ],
        timeline: [],
        breakdown: [
          { label: "Housing", amount: roundCurrency(housing) },
          { label: "Other debt", amount: roundCurrency(otherDebts) },
          { label: "Free income", amount: roundCurrency(Math.max(0, income - housing - otherDebts)) }
        ],
        milestones: [
          { label: "Front-end (housing) DTI", value: formatPercent(frontEnd) },
          { label: "Back-end (total) DTI", value: formatPercent(backEnd) },
          { label: "Common limit", value: "36% to 43%" }
        ],
        note: "DTI uses gross (pre-tax) income and required debt payments only. Everyday spending like groceries and utilities is not counted."
      };
    }
  },
  {
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    category: "Debt",
    description: "See how long it takes to clear a credit card balance and how much interest you pay based on your APR and monthly payment.",
    intro:
      "Enter your balance, APR, and a fixed monthly payment to see the payoff timeline and the total interest a high rate quietly adds.",
    keywords: [
      "credit card payoff calculator",
      "how long to pay off credit card",
      "credit card interest calculator"
    ],
    defaults: {
      balance: 6000,
      annualRate: 22.9,
      monthlyPayment: 250
    },
    inputs: [
      { name: "balance", label: "Card balance", prefix: "$", min: 0, step: 100 },
      { name: "annualRate", label: "APR", suffix: "%", min: 0, step: 0.1 },
      { name: "monthlyPayment", label: "Monthly payment", prefix: "$", min: 0, step: 10 }
    ],
    presets: true,
    example: "On a $6,000 balance at 22.9% APR, paying $250 a month takes well over two years and adds hundreds of dollars in interest.",
    sections: [
      {
        title: "Why credit card interest is so costly",
        body:
          "Credit card APRs are far higher than most loans, and interest is charged on the remaining balance every month. When the payment is low, a large share goes to interest and the balance barely moves."
      },
      {
        title: "The power of paying more than the minimum",
        body:
          "Minimum payments are designed to stretch repayment out for years. Adding even a modest fixed amount above the minimum can cut the payoff time dramatically and save a large chunk of interest."
      },
      {
        title: "When the payment is too low",
        body:
          "If the monthly payment does not exceed the interest charged that month, the balance never falls. In that case the only fixes are a larger payment, a lower rate, or a balance transfer."
      }
    ],
    faqs: [
      {
        question: "Should I pay more than the minimum?",
        answer: "Almost always yes. Minimum payments keep you in debt far longer and maximize interest. A fixed payment above the minimum shortens the timeline and lowers total cost significantly."
      },
      {
        question: "Does a balance transfer help?",
        answer: "A lower-rate or 0% introductory balance transfer can let more of each payment hit principal, but watch for transfer fees and the rate after the promotional period ends."
      }
    ],
    related: ["debt-payoff-calculator", "debt-to-income-ratio-calculator", "budget-calculator"],
    compute(values) {
      const balance = Number(values.balance);
      const annualRate = Number(values.annualRate);
      const payment = Number(values.monthlyPayment);
      const result = buildPayoffSeries({ balance, annualRate, payment });

      if (result.warning) {
        const monthlyInterest = (balance * annualRate) / 1200;
        return {
          summary: [
            { label: "Status", value: "Payment too low" },
            { label: "Monthly interest", value: formatCurrencyPrecise(monthlyInterest) },
            { label: "Next step", value: "Raise payment or rate" }
          ],
          details: [
            { label: "Balance", value: formatCurrency(balance) },
            { label: "APR", value: formatPercent(annualRate) },
            { label: "Current payment", value: formatCurrency(payment) },
            { label: "Interest each month", value: formatCurrencyPrecise(monthlyInterest) }
          ],
          timeline: [],
          milestones: [
            { label: "Interest due monthly", value: formatCurrencyPrecise(monthlyInterest) },
            { label: "Current payment", value: formatCurrency(payment) },
            { label: "Shortfall", value: formatCurrencyPrecise(monthlyInterest - payment) }
          ],
          note: result.warning
        };
      }

      return {
        summary: [
          { label: "Time to payoff", value: formatYearsAndMonths(result.months) },
          { label: "Total interest", value: formatCurrency(result.totalInterest) },
          { label: "Total paid", value: formatCurrency(balance + result.totalInterest) }
        ],
        details: [
          { label: "Starting balance", value: formatCurrency(balance) },
          { label: "APR", value: formatPercent(annualRate) },
          { label: "Monthly payment", value: formatCurrency(payment) },
          { label: "Interest as share of balance", value: formatPercent((result.totalInterest / Math.max(balance, 1)) * 100) }
        ],
        timeline: result.series,
        breakdown: [
          { label: "Principal", amount: roundCurrency(balance) },
          { label: "Interest", amount: roundCurrency(result.totalInterest) }
        ],
        milestones: [
          { label: "Payoff length", value: formatYearsAndMonths(result.months) },
          { label: "Monthly payment", value: formatCurrency(payment) },
          { label: "Total interest", value: formatCurrency(result.totalInterest) }
        ],
        note: "Assumes a fixed monthly payment and no new charges on the card."
      };
    }
  },
  {
    slug: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    category: "Debt",
    description: "Estimate a car loan payment and total cost from the vehicle price, down payment, trade-in, rate, and term.",
    intro:
      "Enter the price, what you put down, and the rate to see the monthly payment and how much interest the loan adds over its term.",
    keywords: [
      "auto loan calculator",
      "car payment calculator",
      "car loan monthly payment"
    ],
    defaults: {
      vehiclePrice: 32000,
      downPayment: 4000,
      tradeIn: 0,
      annualRate: 7.5,
      years: 5,
      salesTaxRate: 0
    },
    inputs: [
      { name: "vehiclePrice", label: "Vehicle price", prefix: "$", min: 0, step: 500 },
      { name: "downPayment", label: "Down payment", prefix: "$", min: 0, step: 500 },
      { name: "tradeIn", label: "Trade-in value", prefix: "$", min: 0, step: 500 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 }
    ],
    advancedInputs: [
      { name: "years", label: "Loan term", suffix: "years", min: 1, step: 1 },
      { name: "salesTaxRate", label: "Sales tax rate", suffix: "%", min: 0, step: 0.1 }
    ],
    presets: true,
    example: "On a $32,000 car with $4,000 down at 7.5% over five years, the monthly payment lands in the mid-$500s before taxes.",
    sections: [
      {
        title: "What goes into a car payment",
        body:
          "The loan amount is the price plus any sales tax, minus your down payment and trade-in. That amount, your rate, and the term set the monthly payment. A bigger down payment or trade-in lowers both the payment and total interest."
      },
      {
        title: "Term length is a trap to watch",
        body:
          "Longer car loans lower the monthly payment but raise total interest and increase the time you may owe more than the car is worth. The shortest term you can comfortably afford usually costs the least overall."
      },
      {
        title: "Look past the monthly number",
        body:
          "Dealers often negotiate around a monthly payment, which can hide a long term or a high rate. Compare the total paid and the interest cost, not just the payment that fits your budget."
      }
    ],
    faqs: [
      {
        question: "How much should I put down on a car?",
        answer: "A larger down payment lowers your loan, payment, and interest, and reduces the risk of owing more than the car is worth. Many buyers aim for around 10% to 20% down, but more is better if affordable."
      },
      {
        question: "Is a longer car loan a good idea?",
        answer: "It lowers the monthly payment but increases total interest and the time spent underwater on the loan. Choose the shortest term whose payment still fits comfortably in your budget."
      }
    ],
    related: ["loan-calculator", "debt-to-income-ratio-calculator", "budget-calculator"],
    compute(values) {
      const price = Number(values.vehiclePrice);
      const down = Number(values.downPayment);
      const tradeIn = Number(values.tradeIn);
      const years = Number(values.years) || 5;
      const salesTax = Math.max(0, price - tradeIn) * (Number(values.salesTaxRate) / 100);
      const loanAmount = Math.max(0, price + salesTax - down - tradeIn);
      const payment = paymentForLoan(loanAmount, Number(values.annualRate), years);
      const totalPaid = payment * years * 12;
      const totalInterest = totalPaid - loanAmount;
      const breakdownData = buildLoanBreakdown({
        principal: loanAmount,
        totalPaid,
        totalInterest,
        years,
        payment
      });

      return {
        summary: [
          { label: "Monthly payment", value: formatCurrencyPrecise(payment) },
          { label: "Loan amount", value: formatCurrency(loanAmount) },
          { label: "Total interest", value: formatCurrency(totalInterest) }
        ],
        details: [
          { label: "Vehicle price", value: formatCurrency(price) },
          { label: "Down payment", value: formatCurrency(down) },
          { label: "Trade-in", value: formatCurrency(tradeIn) },
          ...(salesTax > 0 ? [{ label: "Sales tax added", value: formatCurrencyPrecise(salesTax) }] : []),
          { label: "Total of payments", value: formatCurrency(totalPaid) }
        ],
        timeline: buildAmortizationSeries({
          principal: loanAmount,
          annualRate: Number(values.annualRate),
          years,
          payment
        }),
        breakdown: breakdownData.breakdown,
        milestones: breakdownData.milestones,
        note: "Sales tax handling varies by state and is optional here. Title, registration, and dealer fees are not included."
      };
    }
  },
  {
    slug: "cd-calculator",
    name: "CD Calculator",
    category: "Savings",
    description: "Estimate the maturity value and interest earned on a certificate of deposit based on the rate, term, and compounding.",
    intro:
      "Enter a deposit, rate, and term to see what a CD grows to at maturity and the effective annual yield behind the headline rate.",
    keywords: [
      "cd calculator",
      "certificate of deposit calculator",
      "cd interest calculator"
    ],
    defaults: {
      deposit: 10000,
      annualRate: 4.5,
      years: 2,
      compoundingPerYear: 12
    },
    inputs: [
      { name: "deposit", label: "Initial deposit", prefix: "$", min: 0, step: 500 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.05 },
      { name: "years", label: "Term", suffix: "years", min: 1, step: 1 }
    ],
    advancedInputs: [
      { name: "compoundingPerYear", label: "Compounds per year", min: 1, max: 365, step: 1 }
    ],
    presets: true,
    example: "A $10,000 CD at 4.5% compounded monthly for two years grows to roughly $10,940 at maturity.",
    sections: [
      {
        title: "How a CD grows",
        body:
          "A certificate of deposit pays a fixed rate for a set term. Interest compounds on a schedule, often monthly or daily, so the effective annual yield is slightly higher than the stated rate. At maturity you get your deposit back plus the interest."
      },
      {
        title: "Rate, APY, and the lock-up tradeoff",
        body:
          "The APY reflects compounding and is the fairer number to compare across banks. In exchange for a fixed rate, your money is locked for the term, and withdrawing early usually triggers a penalty."
      },
      {
        title: "Where a CD fits",
        body:
          "CDs suit money you will not need until a known date and want kept safe and predictable. For an emergency fund you may want easier access, and for long-term growth, investing has historically outpaced CD rates."
      }
    ],
    faqs: [
      {
        question: "What is the difference between rate and APY?",
        answer: "The interest rate is the base figure, while APY (annual percentage yield) includes the effect of compounding over a year. APY is the better number for comparing CDs across banks."
      },
      {
        question: "What happens if I withdraw early?",
        answer: "Most CDs charge an early-withdrawal penalty, often several months of interest, if you take the money out before the term ends. This calculator assumes you hold the CD to maturity."
      }
    ],
    related: ["savings-goal-calculator", "compound-interest-calculator", "emergency-fund-calculator"],
    compute(values) {
      const deposit = Number(values.deposit);
      const rate = Number(values.annualRate) / 100;
      const years = Number(values.years);
      const n = Math.max(1, Number(values.compoundingPerYear) || 12);
      const maturity = deposit * (1 + rate / n) ** (n * years);
      const interest = maturity - deposit;
      const apy = ((1 + rate / n) ** n - 1) * 100;
      const timeline = Array.from({ length: years }, (_, index) => ({
        label: `Year ${index + 1}`,
        amount: roundCurrency(deposit * (1 + rate / n) ** (n * (index + 1)))
      }));

      return {
        summary: [
          { label: "Value at maturity", value: formatCurrency(maturity) },
          { label: "Interest earned", value: formatCurrency(interest) },
          { label: "Effective APY", value: formatPercent(apy) }
        ],
        details: [
          { label: "Initial deposit", value: formatCurrency(deposit) },
          { label: "Stated rate", value: formatPercent(values.annualRate) },
          { label: "Term", value: `${years} years` },
          { label: "Compounding", value: `${n} times per year` }
        ],
        timeline,
        breakdown: [
          { label: "Deposit", amount: roundCurrency(deposit) },
          { label: "Interest", amount: roundCurrency(interest) }
        ],
        milestones: [
          { label: "Maturity value", value: formatCurrency(maturity) },
          { label: "Interest earned", value: formatCurrency(interest) },
          { label: "Effective APY", value: formatPercent(apy) }
        ],
        note: "Assumes the CD is held to maturity at a fixed rate. Early withdrawal penalties are not modeled."
      };
    }
  },
  {
    slug: "50-30-20-budget-calculator",
    name: "50/30/20 Budget Calculator",
    category: "Budgeting",
    description: "Split your monthly take-home pay into needs, wants, and savings using the popular 50/30/20 budgeting rule.",
    intro:
      "Enter your monthly take-home pay to see the 50/30/20 targets for needs, wants, and savings, and use them as a quick budget benchmark.",
    keywords: [
      "50 30 20 budget calculator",
      "50/30/20 rule calculator",
      "budget rule calculator"
    ],
    defaults: {
      monthlyIncome: 5000
    },
    inputs: [
      { name: "monthlyIncome", label: "Monthly take-home pay", prefix: "$", min: 0, step: 100 }
    ],
    presets: true,
    example: "On $5,000 of take-home pay, the 50/30/20 rule points to $2,500 for needs, $1,500 for wants, and $1,000 for savings.",
    sections: [
      {
        title: "What the 50/30/20 rule means",
        body:
          "The rule splits after-tax income into three buckets: 50% for needs like housing, food, and minimum debt payments, 30% for wants, and 20% for savings and extra debt payoff. It is a starting framework, not a strict law."
      },
      {
        title: "Why it works as a benchmark",
        body:
          "The appeal is simplicity. Instead of tracking dozens of categories, you check whether each broad bucket is roughly in range. If needs blow past 50%, that is a signal your fixed costs may be too high for your income."
      },
      {
        title: "Adjusting the percentages",
        body:
          "High cost-of-living areas often push needs above 50%, while aggressive savers may flip toward more than 20%. Treat the split as a target to bend around your goals rather than a rule to obey exactly."
      }
    ],
    faqs: [
      {
        question: "Does 50/30/20 use gross or take-home pay?",
        answer: "It uses take-home (after-tax) pay. The percentages apply to the money that actually lands in your account, since that is what you allocate each month."
      },
      {
        question: "What if my needs are more than 50%?",
        answer: "That is common in expensive areas. It signals that fixed costs are high relative to income, so the savings or wants buckets get squeezed. Lowering large fixed costs is usually the most effective fix."
      }
    ],
    related: ["budget-calculator", "savings-goal-calculator", "emergency-fund-calculator"],
    compute(values) {
      const income = Number(values.monthlyIncome);
      const needs = income * 0.5;
      const wants = income * 0.3;
      const savings = income * 0.2;

      return {
        summary: [
          { label: "Needs (50%)", value: formatCurrency(needs) },
          { label: "Wants (30%)", value: formatCurrency(wants) },
          { label: "Savings (20%)", value: formatCurrency(savings) }
        ],
        details: [
          { label: "Monthly take-home pay", value: formatCurrency(income) },
          { label: "Needs budget", value: formatCurrency(needs) },
          { label: "Wants budget", value: formatCurrency(wants) },
          { label: "Savings target", value: formatCurrency(savings) }
        ],
        timeline: [
          { label: "Needs", amount: roundCurrency(needs) },
          { label: "Wants", amount: roundCurrency(wants) },
          { label: "Savings", amount: roundCurrency(savings) }
        ],
        breakdown: [
          { label: "Needs", amount: roundCurrency(needs) },
          { label: "Wants", amount: roundCurrency(wants) },
          { label: "Savings", amount: roundCurrency(savings) }
        ],
        milestones: [
          { label: "Yearly savings at 20%", value: formatCurrency(savings * 12) },
          { label: "Needs ceiling", value: formatCurrency(needs) },
          { label: "Wants allowance", value: formatCurrency(wants) }
        ],
        note: "The 50/30/20 split applies to take-home pay and is a benchmark, not a strict rule. Adjust the buckets to fit your goals and cost of living."
      };
    }
  },
  {
    slug: "pmi-calculator",
    name: "PMI Calculator",
    category: "Mortgage",
    description: "Calculate private mortgage insurance costs and see how much you need to put down to avoid PMI altogether.",
    intro:
      "Enter your home price, down payment, and loan details to estimate your monthly PMI cost and when you can cancel it.",
    keywords: [
      "pmi calculator",
      "private mortgage insurance calculator",
      "how to avoid pmi",
      "pmi removal calculator"
    ],
    defaults: {
      homePrice: 400000,
      downPayment: 40000,
      annualRate: 6.5,
      years: 30,
      pmiRate: 0.5,
      creditScore: 720
    },
    inputs: [
      { name: "homePrice", label: "Home price", prefix: "$", min: 50000, step: 5000 },
      { name: "downPayment", label: "Down payment", prefix: "$", min: 0, step: 5000 },
      { name: "annualRate", label: "Mortgage rate", suffix: "%", min: 0, step: 0.1 }
    ],
    advancedInputs: [
      { name: "years", label: "Loan term", suffix: "years", min: 5, max: 40, step: 5 },
      { name: "pmiRate", label: "PMI rate", suffix: "%", min: 0.1, max: 2, step: 0.05 },
      { name: "creditScore", label: "Credit score", min: 500, max: 850, step: 5 }
    ],
    presets: true,
    example: "On a $400,000 home with 10% down, PMI could add around $150 to your monthly payment until you reach 20% equity.",
    sections: [
      {
        title: "What PMI is and when you need it",
        body:
          "Private Mortgage Insurance protects the lender if you default. It is usually required when your down payment is less than 20% of the home price. The cost varies by credit score and loan type but typically ranges from 0.3% to 1.5% of the loan amount annually."
      },
      {
        title: "How to get rid of PMI",
        body:
          "You can request PMI cancellation when you reach 20% equity through payments or home value appreciation. By law, PMI must automatically terminate at 22% equity based on the original amortization schedule if you are current on payments."
      },
      {
        title: "Alternatives to paying PMI",
        body:
          "Options include putting 20% down, getting a piggyback second mortgage, using lender-paid PMI, or choosing certain government loans that have different insurance requirements. Each tradeoff deserves a close look."
      }
    ],
    faqs: [
      {
        question: "When can I cancel PMI?",
        answer: "You can request cancellation when you reach 20% equity, either through payments, home appreciation, or a combination. Automatic termination happens at 22% equity based on the original schedule if you are current on payments."
      },
      {
        question: "Is PMI tax deductible?",
        answer: "The tax deductibility of PMI has changed several times. Check current IRS guidelines or consult a tax professional for the latest rules and whether you qualify based on your income."
      }
    ],
    related: ["mortgage-calculator", "mortgage-amortization-calculator", "home-affordability-calculator"],
    compute(values) {
      const homePrice = Number(values.homePrice);
      const downPayment = Number(values.downPayment);
      const loanAmount = Math.max(0, homePrice - downPayment);
      const downPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
      const pmiRate = Number(values.pmiRate) / 100;
      const years = Number(values.years) || 30;
      const annualRate = Number(values.annualRate);
      const needsPmi = downPercent < 20;

      const monthlyPmi = needsPmi ? (loanAmount * pmiRate) / 12 : 0;
      const annualPmi = monthlyPmi * 12;

      const targetEquityForRemoval = homePrice * 0.2;
      const additionalDownNeeded = Math.max(0, targetEquityForRemoval - downPayment);

      const payment = paymentForLoan(loanAmount, annualRate, years);
      const amortization = buildAmortizationTable({ principal: loanAmount, annualRate, years, payment });
      const monthsTo20Percent = needsPmi ? (() => {
        const targetBalance = loanAmount - targetEquityForRemoval;
        let months = 0;
        let balance = loanAmount;
        const monthlyRate = annualRate / 100 / 12;
        while (balance > targetBalance && months < years * 12) {
          const interest = balance * monthlyRate;
          const principalPaid = payment - interest;
          balance -= principalPaid;
          months++;
        }
        return months;
      })() : 0;

      const totalPmi = needsPmi && monthsTo20Percent > 0 ? monthlyPmi * monthsTo20Percent : 0;

      return {
        summary: [
          { label: "Monthly PMI", value: needsPmi ? formatCurrencyPrecise(monthlyPmi) : "Not required" },
          { label: "Down payment percentage", value: formatPercent(downPercent) },
          { label: "PMI cancellation timeline", value: needsPmi ? formatYearsAndMonths(monthsTo20Percent) : "Not needed" }
        ],
        details: [
          { label: "Home price", value: formatCurrency(homePrice) },
          { label: "Down payment", value: formatCurrency(downPayment) },
          { label: "Loan amount", value: formatCurrency(loanAmount) },
          { label: "PMI rate used", value: formatPercent(values.pmiRate) },
          { label: "Additional down to avoid PMI", value: formatCurrency(additionalDownNeeded) }
        ],
        timeline: needsPmi ? [
          { label: "Year 1", amount: roundCurrency(annualPmi) },
          { label: "Year 2", amount: roundCurrency(annualPmi) },
          { label: "Year 3", amount: roundCurrency(annualPmi) },
          { label: "Year 4", amount: roundCurrency(annualPmi) },
          { label: "Year 5", amount: roundCurrency(annualPmi) }
        ] : [],
        breakdown: needsPmi ? [
          { label: "Monthly PMI cost", amount: roundCurrency(monthlyPmi) },
          { label: "Annual PMI cost", amount: roundCurrency(annualPmi) },
          { label: "Total PMI until removal", amount: roundCurrency(totalPmi) }
        ] : [
          { label: "Down payment", amount: roundCurrency(downPayment) },
          { label: "Equity at purchase", amount: roundCurrency(downPayment) }
        ],
        milestones: needsPmi ? [
          { label: "Monthly PMI cost", value: formatCurrencyPrecise(monthlyPmi) },
          { label: "Additional down to avoid PMI", value: formatCurrency(additionalDownNeeded) },
          { label: "Estimated total PMI paid", value: formatCurrency(totalPmi) }
        ] : [
          { label: "PMI status", value: "Not required" },
          { label: "Equity at purchase", value: formatPercent(downPercent) },
          { label: "Savings vs PMI loan", value: formatCurrency(annualPmi * 7) }
        ],
        note: needsPmi ? "PMI is required with less than 20% down. Your actual PMI rate may vary by credit score, loan type, and lender." : "With 20% or more down, PMI is not required, saving you thousands over the life of the loan."
      };
    }
  },
  {
    slug: "student-loan-calculator",
    name: "Student Loan Calculator",
    category: "Debt",
    description: "Estimate your student loan monthly payment, total interest cost, and see how extra payments can save you money.",
    intro:
      "Enter your student loan details to see your monthly payment, total cost, and how making extra payments can shorten your repayment.",
    keywords: [
      "student loan calculator",
      "student loan payment calculator",
      "student loan interest calculator",
      "college loan calculator"
    ],
    defaults: {
      loanAmount: 35000,
      annualRate: 5.5,
      years: 10,
      extraMonthly: 0
    },
    inputs: [
      { name: "loanAmount", label: "Loan amount", prefix: "$", min: 1000, step: 1000 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Repayment term", suffix: "years", min: 1, max: 30, step: 1 }
    ],
    advancedInputs: [
      { name: "extraMonthly", label: "Extra monthly payment", prefix: "$", min: 0, step: 25 }
    ],
    presets: true,
    example: "On $35,000 of student loans at 5.5% over 10 years, the monthly payment would be around $380, with total interest near $10,500.",
    sections: [
      {
        title: "Understanding student loan repayment",
        body:
          "Your monthly payment depends on your total borrowed, interest rate, and repayment term. Federal loans offer standard 10-year repayment or income-driven plans that adjust payments based on your income and family size."
      },
      {
        title: "The impact of extra payments",
        body:
          "Even small extra payments applied to principal can save thousands in interest and shave years off your repayment. Prioritize higher-interest loans first for maximum savings using the avalanche method."
      },
      {
        title: "Refinancing considerations",
        body:
          "Refinancing federal loans with a private lender can lower your rate but means giving up federal protections like income-driven repayment, forgiveness programs, and forbearance options. The tradeoff deserves careful thought."
      }
    ],
    faqs: [
      {
        question: "Should I refinance my student loans?",
        answer: "Refinancing can make sense if you have good credit and a stable income, but you lose federal loan protections. Compare rates and consider whether you might need income-driven repayment or forgiveness before refinancing federal loans."
      },
      {
        question: "How do extra payments help?",
        answer: "Extra payments go directly to principal, reducing the balance that accrues interest each month. This saves money over time and shortens your repayment period, often significantly if you start early."
      }
    ],
    related: ["loan-calculator", "debt-payoff-calculator", "debt-to-income-ratio-calculator"],
    compute(values) {
      const loanAmount = Number(values.loanAmount);
      const annualRate = Number(values.annualRate);
      const years = Number(values.years) || 10;
      const extraMonthly = Number(values.extraMonthly) || 0;

      const basePayment = paymentForLoan(loanAmount, annualRate, years);
      const baseTotalPaid = basePayment * years * 12;
      const baseTotalInterest = baseTotalPaid - loanAmount;

      let acceleratedResult = null;
      if (extraMonthly > 0) {
        acceleratedResult = amortizeWithExtra({ principal: loanAmount, annualRate, years, extraMonthly });
      }

      return {
        summary: [
          { label: "Monthly payment", value: formatCurrencyPrecise(basePayment) },
          { label: "Total interest", value: formatCurrency(baseTotalInterest) },
          { label: "Total paid over term", value: formatCurrency(baseTotalPaid) }
        ],
        details: [
          { label: "Loan amount", value: formatCurrency(loanAmount) },
          { label: "Interest rate", value: formatPercent(annualRate) },
          { label: "Repayment term", value: `${years} years` },
          { label: "Interest as percentage of principal", value: formatPercent((baseTotalInterest / loanAmount) * 100) }
        ],
        timeline: buildAmortizationSeries({ principal: loanAmount, annualRate, years, payment: basePayment }),
        breakdown: [
          { label: "Principal", amount: roundCurrency(loanAmount) },
          { label: "Interest", amount: roundCurrency(baseTotalInterest) }
        ],
        milestones: extraMonthly > 0 && acceleratedResult ? [
          { label: "Base monthly payment", value: formatCurrencyPrecise(basePayment) },
          { label: "Time saved with extra payments", value: formatYearsAndMonths(years * 12 - (acceleratedResult.months || 0)) },
          { label: "Interest saved", value: formatCurrency(baseTotalInterest - (acceleratedResult.totalInterest || 0)) }
        ] : [
          { label: "Monthly payment", value: formatCurrencyPrecise(basePayment) },
          { label: "First year interest", value: formatCurrency((loanAmount * annualRate) / 100) },
          { label: "Total interest paid", value: formatCurrency(baseTotalInterest) }
        ],
        note: extraMonthly > 0 ? "Extra payments are assumed to be applied to principal each month. Your loan servicer may require specifying how extra payments are applied." : "This is a standard amortization calculation. Actual repayment may vary if you switch plans or pause payments."
      };
    }
  },
  {
    slug: "capital-gains-tax-calculator",
    name: "Capital Gains Tax Calculator",
    category: "Income & Tax",
    description: "Calculate your estimated capital gains tax based on your income, filing status, and how long you held the investment.",
    intro:
      "Enter your investment details and income to estimate the capital gains tax you might owe and see the benefit of holding investments longer than one year.",
    keywords: [
      "capital gains tax calculator",
      "capital gains calculator",
      "stock tax calculator",
      "investment tax calculator"
    ],
    defaults: {
      purchasePrice: 10000,
      salePrice: 18000,
      yearsHeld: 2,
      annualIncome: 85000,
      filingStatus: 0
    },
    inputs: [
      { name: "purchasePrice", label: "Purchase price", prefix: "$", min: 0, step: 100 },
      { name: "salePrice", label: "Sale price", prefix: "$", min: 0, step: 100 },
      { name: "annualIncome", label: "Your annual income", prefix: "$", min: 0, step: 1000 }
    ],
    advancedInputs: [
      { name: "yearsHeld", label: "Years held", min: 0, max: 50, step: 0.5 },
      { name: "filingStatus", label: "Filing (0 single, 1 married)", min: 0, max: 1, step: 1 }
    ],
    presets: true,
    example: "Selling an investment for $18,000 that you bought for $10,000 would realize an $8,000 gain. Holding for over a year means lower long-term capital gains rates.",
    sections: [
      {
        title: "Short-term vs long-term capital gains",
        body:
          "Gains on investments held for one year or less are taxed as ordinary income, like your salary. Gains on investments held for more than one year qualify for lower long-term capital gains rates, which can be 0%, 15%, or 20% depending on your income."
      },
      {
        title: "How tax brackets affect your gains",
        body:
          "Your capital gains stack on top of your ordinary income. This means some of your gains could be taxed at 0% if they fall within the lowest brackets, then 15% in the middle, and 20% at the highest income levels."
      },
      {
        title: "Tax-loss harvesting strategy",
        body:
          "You can offset capital gains with capital losses in the same year. This strategy, called tax-loss harvesting, can reduce or eliminate the tax you owe on your investment gains. Any unused losses can carry forward to future years."
      }
    ],
    faqs: [
      {
        question: "What is the capital gains tax rate?",
        answer: "Long-term capital gains rates are 0%, 15%, or 20% depending on your income and filing status. Short-term gains are taxed at your ordinary income tax rates, which can be significantly higher."
      },
      {
        question: "Can capital losses offset gains?",
        answer: "Yes, you can use capital losses to offset capital gains. If you have more losses than gains, you can deduct up to $3,000 against ordinary income and carry forward the rest to future years."
      }
    ],
    related: ["roi-calculator", "cagr-calculator", "income-tax-calculator"],
    compute(values) {
      const purchasePrice = Number(values.purchasePrice);
      const salePrice = Number(values.salePrice);
      const annualIncome = Number(values.annualIncome);
      const yearsHeld = Number(values.yearsHeld) || 0;
      const isMarried = Number(values.filingStatus) === 1;
      const isLongTerm = yearsHeld > 1;

      const gain = Math.max(0, salePrice - purchasePrice);
      const loss = purchasePrice > salePrice ? purchasePrice - salePrice : 0;

      const longTermBrackets = isMarried
        ? { zero: 89250, fifteen: 553850 }
        : { zero: 44625, fifteen: 492300 };

      const standardDeduction = isMarried ? STANDARD_DEDUCTION_2025.married : STANDARD_DEDUCTION_2025.single;
      const taxableIncome = Math.max(0, annualIncome - standardDeduction);

      let estimatedTax = 0;
      let taxRate = 0;

      if (gain > 0) {
        if (isLongTerm) {
          const spaceInZeroBracket = Math.max(0, longTermBrackets.zero - taxableIncome);
          const gainInZero = Math.min(spaceInZeroBracket, gain);
          const remainingGain = gain - gainInZero;

          if (remainingGain > 0) {
            const spaceInFifteenBracket = Math.max(0, longTermBrackets.fifteen - Math.max(taxableIncome, longTermBrackets.zero));
            const gainInFifteen = Math.min(spaceInFifteenBracket, remainingGain);
            const gainInTwenty = Math.max(0, remainingGain - gainInFifteen);

            estimatedTax = gainInFifteen * 0.15 + gainInTwenty * 0.2;
            taxRate = (estimatedTax / gain) * 100;
          }
        } else {
          const effectiveOrdinaryRate = federalIncomeTax(taxableIncome + gain, isMarried ? "married" : "single") - federalIncomeTax(taxableIncome, isMarried ? "married" : "single");
          estimatedTax = Math.max(effectiveOrdinaryRate, gain * 0.22);
          taxRate = (estimatedTax / gain) * 100;
        }
      }

      const taxSavingsWithLongTerm = isLongTerm ? 0 : gain > 0 ? estimatedTax - (gain * 0.15) : 0;

      return {
        summary: [
          { label: "Capital gain", value: gain > 0 ? formatCurrency(gain) : (loss > 0 ? `-${formatCurrency(loss)} loss` : "No gain or loss") },
          { label: "Estimated tax", value: gain > 0 ? formatCurrency(estimatedTax) : "No tax owed" },
          { label: "Holding status", value: isLongTerm ? "Long-term" : "Short-term" }
        ],
        details: [
          { label: "Purchase price", value: formatCurrency(purchasePrice) },
          { label: "Sale price", value: formatCurrency(salePrice) },
          { label: "Years held", value: `${yearsHeld} years` },
          { label: "Effective tax rate on gain", value: gain > 0 ? formatPercent(taxRate) : "N/A" }
        ],
        timeline: gain > 0 ? [
          { label: "Gain", amount: roundCurrency(gain) },
          { label: "Estimated tax", amount: roundCurrency(estimatedTax) },
          { label: "After-tax proceeds", amount: roundCurrency(salePrice - estimatedTax) }
        ] : [],
        breakdown: gain > 0 ? [
          { label: "Capital gain", amount: roundCurrency(gain) },
          { label: "Estimated tax", amount: roundCurrency(estimatedTax) },
          { label: "Net after tax", amount: roundCurrency(gain - estimatedTax) }
        ] : loss > 0 ? [
          { label: "Capital loss", amount: roundCurrency(loss) },
          { label: "Max deductible this year", amount: roundCurrency(Math.min(loss, 3000)) },
          { label: "Carryforward", amount: roundCurrency(Math.max(0, loss - 3000)) }
        ] : [],
        milestones: gain > 0 ? [
          { label: "After-tax sale proceeds", value: formatCurrency(salePrice - estimatedTax) },
          { label: "Tax savings by holding 1+ year", value: !isLongTerm && taxSavingsWithLongTerm > 0 ? formatCurrency(taxSavingsWithLongTerm) : "Already long-term" },
          { label: "Total return after tax", value: formatPercent(((salePrice - estimatedTax - purchasePrice) / purchasePrice) * 100) }
        ] : loss > 0 ? [
          { label: "Capital loss realized", value: formatCurrency(loss) },
          { label: "Can offset gains up to", value: formatCurrency(loss) },
          { label: "Excess carries forward", value: formatCurrency(Math.max(0, loss - 3000)) }
        ] : [],
        note: "This is an estimate only. Actual tax depends on many factors including state taxes, other income, deductions, and specific circumstances. Consult a tax professional for personalized advice."
      };
    }
  },
  {
    slug: "life-insurance-calculator",
    name: "Life Insurance Calculator",
    category: "Budgeting",
    description: "Estimate how much life insurance coverage you need by considering your income, debts, dependents, and future goals.",
    intro:
      "Enter your financial details to estimate how much life insurance might be right for your family's protection and peace of mind.",
    keywords: [
      "life insurance calculator",
      "how much life insurance do i need",
      "term life insurance calculator",
      "life insurance needs calculator"
    ],
    defaults: {
      annualIncome: 90000,
      yearsOfIncome: 10,
      mortgageBalance: 250000,
      otherDebts: 25000,
      childrenEducation: 100000,
      existingSavings: 50000,
      existingCoverage: 50000
    },
    inputs: [
      { name: "annualIncome", label: "Annual income", prefix: "$", min: 0, step: 5000 },
      { name: "yearsOfIncome", label: "Years to replace", suffix: "years", min: 0, max: 40, step: 1 },
      { name: "mortgageBalance", label: "Mortgage balance", prefix: "$", min: 0, step: 5000 },
      { name: "otherDebts", label: "Other debts", prefix: "$", min: 0, step: 1000 }
    ],
    advancedInputs: [
      { name: "childrenEducation", label: "Education goal", prefix: "$", min: 0, step: 5000 },
      { name: "existingSavings", label: "Existing savings", prefix: "$", min: 0, step: 5000 },
      { name: "existingCoverage", label: "Existing coverage", prefix: "$", min: 0, step: 5000 }
    ],
    presets: true,
    example: "For a family earning $90,000 with a $250,000 mortgage and children to educate, a $1 million+ policy is often recommended to cover both income replacement and debt payoff.",
    sections: [
      {
        title: "How to think about life insurance needs",
        body:
          "A good starting point is 10-12 times your annual income, plus debts, plus future goals like college expenses. This helps ensure your family can maintain their lifestyle, pay off debts, and meet important financial goals if you are no longer there."
      },
      {
        title: "Term vs permanent insurance",
        body:
          "Term life covers you for a set period like 10, 20, or 30 years and is generally affordable. Permanent life covers you for life and builds cash value but is significantly more expensive. For most families, term insurance provides the best protection per dollar."
      },
      {
        title: "What about stay-at-home parents?",
        body:
          "Stay-at-home parents need coverage too. The cost of replacing childcare, housekeeping, and other household services can be substantial. Consider what it would cost to hire help for those responsibilities over many years."
      }
    ],
    faqs: [
      {
        question: "How much life insurance do I really need?",
        answer: "A common guideline is 10-12 times your income plus debts and future goals like college. The exact amount depends on your specific situation, including savings, other income sources, and your family's needs."
      },
      {
        question: "Is term life insurance enough?",
        answer: "For most families, term life insurance provides excellent protection at an affordable cost. It covers your peak earning years when your family is most dependent on your income and when your debts are highest."
      }
    ],
    related: ["budget-calculator", "retirement-calculator", "debt-payoff-calculator"],
    compute(values) {
      const annualIncome = Number(values.annualIncome);
      const yearsOfIncome = Number(values.yearsOfIncome) || 10;
      const mortgageBalance = Number(values.mortgageBalance);
      const otherDebts = Number(values.otherDebts);
      const childrenEducation = Number(values.childrenEducation);
      const existingSavings = Number(values.existingSavings);
      const existingCoverage = Number(values.existingCoverage);

      const incomeReplacement = annualIncome * yearsOfIncome;
      const totalNeeds = incomeReplacement + mortgageBalance + otherDebts + childrenEducation;
      const resourcesAvailable = existingSavings + existingCoverage;
      const recommendedCoverage = Math.max(0, totalNeeds - resourcesAvailable);

      const estimatedMonthlyTermPremium = (() => {
        const baseRatePerThousand = 0.6;
        const coverageThousands = recommendedCoverage / 1000;
        return coverageThousands * baseRatePerThousand;
      })();

      const lowEndCoverage = Math.max(0, annualIncome * 7 + mortgageBalance - existingSavings);
      const highEndCoverage = Math.max(0, annualIncome * 15 + mortgageBalance + otherDebts + childrenEducation * 1.5 - existingSavings);

      return {
        summary: [
          { label: "Recommended coverage", value: formatCurrency(recommendedCoverage) },
          { label: "Est. monthly term premium", value: recommendedCoverage > 0 ? formatCurrencyPrecise(estimatedMonthlyTermPremium) : "N/A" },
          { label: "Income replacement need", value: formatCurrency(incomeReplacement) }
        ],
        details: [
          { label: "Income replacement (10x)", value: formatCurrency(incomeReplacement) },
          { label: "Mortgage payoff", value: formatCurrency(mortgageBalance) },
          { label: "Other debts", value: formatCurrency(otherDebts) },
          { label: "Education goal", value: formatCurrency(childrenEducation) },
          { label: "Existing resources", value: formatCurrency(resourcesAvailable) }
        ],
        timeline: [
          { label: "Conservative estimate", amount: roundCurrency(lowEndCoverage) },
          { label: "Recommended", amount: roundCurrency(recommendedCoverage) },
          { label: "Comprehensive", amount: roundCurrency(highEndCoverage) }
        ],
        breakdown: [
          { label: "Income replacement", amount: roundCurrency(incomeReplacement) },
          { label: "Debt payoff", amount: roundCurrency(mortgageBalance + otherDebts) },
          { label: "Future goals", amount: roundCurrency(childrenEducation) },
          { label: "Minus existing resources", amount: -roundCurrency(resourcesAvailable) }
        ],
        milestones: [
          { label: "Range of coverage", value: `${formatCurrency(lowEndCoverage)} - ${formatCurrency(highEndCoverage)}` },
          { label: "Est. annual premium", value: recommendedCoverage > 0 ? formatCurrency(estimatedMonthlyTermPremium * 12) : "N/A" },
          { label: "Existing coverage gap", value: formatCurrency(Math.max(0, recommendedCoverage - existingCoverage)) }
        ],
        note: "This is an estimate only. Actual insurance needs depend on your specific situation. Premium estimates are approximate and vary by age, health, term length, and insurance company."
      };
    }
  },
  {
    slug: "car-affordability-calculator",
    name: "Car Affordability Calculator",
    category: "Debt",
    description: "Estimate how much car you can comfortably afford based on your income, budget, and other financial obligations.",
    intro:
      "Enter your income and budget details to see a realistic car price range that fits comfortably within your overall financial picture.",
    keywords: [
      "car affordability calculator",
      "how much car can i afford",
      "auto loan affordability calculator",
      "vehicle affordability calculator"
    ],
    defaults: {
      annualIncome: 75000,
      downPayment: 5000,
      tradeInValue: 0,
      annualRate: 6.5,
      years: 6,
      monthlyBudget: 500,
      otherCarExpenses: 200
    },
    inputs: [
      { name: "annualIncome", label: "Annual income", prefix: "$", min: 0, step: 5000 },
      { name: "monthlyBudget", label: "Max monthly car payment", prefix: "$", min: 0, step: 25 },
      { name: "downPayment", label: "Down payment", prefix: "$", min: 0, step: 500 }
    ],
    advancedInputs: [
      { name: "tradeInValue", label: "Trade-in value", prefix: "$", min: 0, step: 500 },
      { name: "annualRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 },
      { name: "years", label: "Loan term", suffix: "years", min: 1, max: 8, step: 1 },
      { name: "otherCarExpenses", label: "Other car costs/month", prefix: "$", min: 0, step: 25 }
    ],
    presets: true,
    example: "With a $75,000 income and a $500 monthly budget, you can comfortably afford a car in the $30,000-$35,000 range with a reasonable down payment.",
    sections: [
      {
        title: "The 15-20 rule for car buying",
        body:
          "A common guideline is to spend no more than 15-20% of your monthly take-home pay on total car costs, including the payment, insurance, gas, and maintenance. This helps prevent car expenses from crowding out other important financial goals."
      },
      {
        title: "The real cost of car ownership",
        body:
          "The monthly payment is only part of the picture. Insurance, gas, maintenance, repairs, registration, and depreciation add up significantly. A good rule of thumb is that these additional costs can equal or exceed the payment itself."
      },
      {
        title: "Why a larger down payment helps",
        body:
          "Putting more money down reduces your loan amount, monthly payment, and total interest. It also lowers the risk of being underwater on the loan, where you owe more than the car is worth."
      }
    ],
    faqs: [
      {
        question: "What percentage of my income should go to a car?",
        answer: "A common guideline is 10-15% of take-home pay for the car payment, and no more than 15-20% for total car costs including insurance, gas, and maintenance. Your situation may vary based on other obligations."
      },
      {
        question: "How long should I finance a car?",
        answer: "Ideally 48-60 months or less. Longer terms lower the payment but cost more in interest and leave you at risk of negative equity for longer. Choose the shortest term that leaves you with a comfortable payment."
      }
    ],
    related: ["auto-loan-calculator", "loan-calculator", "budget-calculator"],
    compute(values) {
      const annualIncome = Number(values.annualIncome);
      const monthlyIncome = annualIncome / 12;
      const monthlyBudget = Number(values.monthlyBudget);
      const downPayment = Number(values.downPayment);
      const tradeInValue = Number(values.tradeInValue);
      const annualRate = Number(values.annualRate);
      const years = Number(values.years) || 6;
      const otherCarExpenses = Number(values.otherCarExpenses);

      const totalDown = downPayment + tradeInValue;
      const monthlyRate = annualRate / 100 / 12;
      const numPayments = years * 12;

      const maxLoanAmount = monthlyRate > 0
        ? monthlyBudget * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate)
        : monthlyBudget * numPayments;

      const affordableCarPrice = maxLoanAmount + totalDown;

      const conservativeBudget = monthlyIncome * 0.1;
      const moderateBudget = monthlyIncome * 0.15;
      const aggressiveBudget = monthlyIncome * 0.2;

      const conservativeCar = conservativeBudget * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate) + totalDown;
      const moderateCar = moderateBudget * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate) + totalDown;
      const aggressiveCar = aggressiveBudget * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate) + totalDown;

      const monthlyPaymentCheck = paymentForLoan(maxLoanAmount, annualRate, years);
      const totalInterest = (monthlyPaymentCheck * numPayments) - maxLoanAmount;

      const totalMonthlyCarCost = monthlyBudget + otherCarExpenses;
      const percentOfIncome = monthlyIncome > 0 ? (totalMonthlyCarCost / monthlyIncome) * 100 : 0;

      return {
        summary: [
          { label: "Affordable car price", value: formatCurrency(affordableCarPrice) },
          { label: "Max monthly payment", value: formatCurrencyPrecise(monthlyBudget) },
          { label: "Total monthly car costs", value: formatCurrencyPrecise(totalMonthlyCarCost) }
        ],
        details: [
          { label: "Annual income", value: formatCurrency(annualIncome) },
          { label: "Down payment + trade-in", value: formatCurrency(totalDown) },
          { label: "Loan amount", value: formatCurrency(maxLoanAmount) },
          { label: "Total interest over term", value: formatCurrency(totalInterest) },
          { label: "Car costs as % of income", value: formatPercent(percentOfIncome) }
        ],
        timeline: [
          { label: "Conservative (10%)", amount: roundCurrency(conservativeCar) },
          { label: "Moderate (15%)", amount: roundCurrency(moderateCar) },
          { label: "Aggressive (20%)", amount: roundCurrency(aggressiveCar) }
        ],
        breakdown: [
          { label: "Vehicle price", amount: roundCurrency(affordableCarPrice) },
          { label: "Down payment + trade", amount: -roundCurrency(totalDown) },
          { label: "Loan amount", amount: roundCurrency(maxLoanAmount) },
          { label: "Total interest", amount: roundCurrency(totalInterest) }
        ],
        milestones: [
          { label: "Affordable price range", value: `${formatCurrency(conservativeCar)} - ${formatCurrency(moderateCar)}` },
          { label: "Monthly payment", value: formatCurrencyPrecise(monthlyBudget) },
          { label: "Payment + insurance/gas", value: formatCurrencyPrecise(totalMonthlyCarCost) }
        ],
        note: "This is an estimate assuming your other financial obligations are manageable. Consider your full budget, emergency fund, and other goals before committing to a car payment."
      };
    }
  },
  {
    slug: "debt-snowball-calculator",
    name: "Debt Snowball Calculator",
    category: "Debt",
    description: "Use the debt snowball method to pay off your smallest debts first for quick wins and psychological momentum.",
    intro:
      "Enter your debts to see how the snowball method works, paying off small balances first while making minimum payments on everything else.",
    keywords: [
      "debt snowball calculator",
      "snowball method calculator",
      "debt payoff calculator snowball",
      "pay off debt calculator"
    ],
    defaults: {
      debt1Balance: 3000,
      debt1Rate: 18,
      debt1Payment: 150,
      debt2Balance: 6000,
      debt2Rate: 22,
      debt2Payment: 200,
      debt3Balance: 12000,
      debt3Rate: 7,
      debt3Payment: 300,
      extraMonthly: 200
    },
    inputs: [
      { name: "debt1Balance", label: "Debt 1 balance", prefix: "$", min: 0, step: 100 },
      { name: "debt1Rate", label: "Debt 1 APR", suffix: "%", min: 0, step: 0.1 },
      { name: "debt1Payment", label: "Debt 1 min payment", prefix: "$", min: 0, step: 10 },
      { name: "debt2Balance", label: "Debt 2 balance", prefix: "$", min: 0, step: 100 },
      { name: "debt2Rate", label: "Debt 2 APR", suffix: "%", min: 0, step: 0.1 },
      { name: "debt2Payment", label: "Debt 2 min payment", prefix: "$", min: 0, step: 10 }
    ],
    advancedInputs: [
      { name: "debt3Balance", label: "Debt 3 balance", prefix: "$", min: 0, step: 100 },
      { name: "debt3Rate", label: "Debt 3 APR", suffix: "%", min: 0, step: 0.1 },
      { name: "debt3Payment", label: "Debt 3 min payment", prefix: "$", min: 0, step: 10 },
      { name: "extraMonthly", label: "Extra monthly payment", prefix: "$", min: 0, step: 25 }
    ],
    presets: true,
    example: "The snowball method pays off the $3,000 debt first for a quick win, then rolls that payment into the next one, building momentum as each debt is eliminated.",
    sections: [
      {
        title: "How the debt snowball works",
        body:
          "List your debts from smallest balance to largest, regardless of interest rate. Make minimum payments on everything, then put all extra money toward the smallest debt. When it's paid off, roll that payment into the next smallest, creating a 'snowball' effect."
      },
      {
        title: "Psychological vs mathematical optimization",
        body:
          "The snowball prioritizes quick wins and psychological momentum over mathematical optimization (that's the avalanche method). For many people, seeing debts disappear keeps them motivated to stick with the plan long-term."
      },
      {
        title: "Is the snowball right for you?",
        body:
          "If you've struggled to stay motivated with debt payoff in the past, the snowball might work better even if it costs slightly more in interest. If you're purely focused on minimizing interest and can stay motivated, consider the avalanche method instead."
      }
    ],
    faqs: [
      {
        question: "Why pay smaller debts first?",
        answer: "Quick wins build motivation. Checking debts off your list feels good and makes it easier to stick with the plan. The psychological boost often outweighs the extra interest compared to other methods."
      },
      {
        question: "What's the difference between snowball and avalanche?",
        answer: "Snowball pays smallest balances first for psychological wins. Avalanche pays highest interest rates first to minimize total interest. We have calculators for both so you can compare!"
      }
    ],
    related: ["debt-avalanche-calculator", "debt-payoff-calculator", "debt-to-income-ratio-calculator"],
    compute(values) {
      const debts = [
        { balance: Number(values.debt1Balance), rate: Number(values.debt1Rate), payment: Number(values.debt1Payment), name: "Debt 1" },
        { balance: Number(values.debt2Balance), rate: Number(values.debt2Rate), payment: Number(values.debt2Payment), name: "Debt 2" },
        { balance: Number(values.debt3Balance), rate: Number(values.debt3Rate), payment: Number(values.debt3Payment), name: "Debt 3" }
      ].filter(d => d.balance > 0 && d.payment > 0);

      const extraMonthly = Number(values.extraMonthly) || 0;

      debts.sort((a, b) => a.balance - b.balance);

      const totalMinimumPayment = debts.reduce((sum, d) => sum + d.payment, 0);
      const totalMonthlyPayment = totalMinimumPayment + extraMonthly;

      let months = 0;
      let totalInterest = 0;
      const payoffOrder = [];
      const remainingDebts = debts.map(d => ({ ...d, remaining: d.balance }));

      while (remainingDebts.some(d => d.remaining > 0) && months < 600) {
        months++;
        let availableForExtra = extraMonthly;

        for (let i = 0; i < remainingDebts.length; i++) {
          if (remainingDebts[i].remaining <= 0) continue;

          const monthlyRate = remainingDebts[i].rate / 100 / 12;
          const interest = remainingDebts[i].remaining * monthlyRate;
          totalInterest += interest;

          let payment = remainingDebts[i].payment;

          if (availableForExtra > 0) {
            const firstUnpaidIndex = remainingDebts.findIndex(d => d.remaining > 0);
            if (i === firstUnpaidIndex) {
              payment += availableForExtra;
              availableForExtra = 0;
            }
          }

          const newBalance = remainingDebts[i].remaining + interest - payment;

          if (newBalance <= 0) {
            const payoffAmount = remainingDebts[i].remaining + interest;
            remainingDebts[i].remaining = 0;
            if (!payoffOrder.includes(i)) {
              payoffOrder.push(i);
            }
          } else {
            remainingDebts[i].remaining = newBalance;
          }
        }
      }

      const avalancheComparison = (() => {
        const avalancheDebts = [...debts].sort((a, b) => b.rate - a.rate);
        let avalancheMonths = 0;
        let avalancheInterest = 0;
        const remaining = avalancheDebts.map(d => ({ ...d, remaining: d.balance }));

        while (remaining.some(d => d.remaining > 0) && avalancheMonths < 600) {
          avalancheMonths++;
          let availableForExtra = extraMonthly;

          for (let i = 0; i < remaining.length; i++) {
            if (remaining[i].remaining <= 0) continue;

            const monthlyRate = remaining[i].rate / 100 / 12;
            const interest = remaining[i].remaining * monthlyRate;
            avalancheInterest += interest;

            let payment = remaining[i].payment;

            if (availableForExtra > 0) {
              const firstUnpaidIndex = remaining.findIndex(d => d.remaining > 0);
              if (i === firstUnpaidIndex) {
                payment += availableForExtra;
                availableForExtra = 0;
              }
            }

            const newBalance = remaining[i].remaining + interest - payment;
            remaining[i].remaining = Math.max(0, newBalance);
          }
        }

        return { months: avalancheMonths, interest: avalancheInterest };
      })();

      const interestDifference = avalancheComparison.interest - totalInterest;
      const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
      const totalPaid = totalDebt + totalInterest;

      return {
        summary: [
          { label: "Time to payoff", value: formatYearsAndMonths(months) },
          { label: "Total interest", value: formatCurrency(totalInterest) },
          { label: "Monthly payment", value: formatCurrencyPrecise(totalMonthlyPayment) }
        ],
        details: [
          { label: "Total debt", value: formatCurrency(totalDebt) },
          { label: "Minimum payments", value: formatCurrencyPrecise(totalMinimumPayment) },
          { label: "Extra payment", value: formatCurrencyPrecise(extraMonthly) },
          { label: "Interest difference vs avalanche", value: interestDifference > 0 ? `+$${formatCurrency(interestDifference)}` : "About the same" }
        ],
        timeline: [
          { label: "Snowball total interest", amount: roundCurrency(totalInterest) },
          { label: "Avalanche total interest", amount: roundCurrency(avalancheComparison.interest) }
        ],
        breakdown: [
          { label: "Total principal", amount: roundCurrency(totalDebt) },
          { label: "Total interest", amount: roundCurrency(totalInterest) },
          { label: "Total paid", amount: roundCurrency(totalPaid) }
        ],
        milestones: [
          { label: "Payoff order", value: payoffOrder.map(i => debts[i].name).join(" → ") || "Add debts to see" },
          { label: "Snowball time", value: formatYearsAndMonths(months) },
          { label: "Total interest cost", value: formatCurrency(totalInterest) }
        ],
        note: "Snowball focuses on psychological wins. The avalanche method may save interest. Compare both to see what works best for you!"
      };
    }
  },
  {
    slug: "debt-avalanche-calculator",
    name: "Debt Avalanche Calculator",
    category: "Debt",
    description: "Use the debt avalanche method to pay off your highest interest debts first and minimize total interest costs.",
    intro:
      "Enter your debts to see how the avalanche method works, targeting high-interest debt first while making minimum payments on everything else.",
    keywords: [
      "debt avalanche calculator",
      "avalanche method calculator",
      "debt payoff calculator interest first",
      "highest interest debt first"
    ],
    defaults: {
      debt1Balance: 3000,
      debt1Rate: 18,
      debt1Payment: 150,
      debt2Balance: 6000,
      debt2Rate: 22,
      debt2Payment: 200,
      debt3Balance: 12000,
      debt3Rate: 7,
      debt3Payment: 300,
      extraMonthly: 200
    },
    inputs: [
      { name: "debt1Balance", label: "Debt 1 balance", prefix: "$", min: 0, step: 100 },
      { name: "debt1Rate", label: "Debt 1 APR", suffix: "%", min: 0, step: 0.1 },
      { name: "debt1Payment", label: "Debt 1 min payment", prefix: "$", min: 0, step: 10 },
      { name: "debt2Balance", label: "Debt 2 balance", prefix: "$", min: 0, step: 100 },
      { name: "debt2Rate", label: "Debt 2 APR", suffix: "%", min: 0, step: 0.1 },
      { name: "debt2Payment", label: "Debt 2 min payment", prefix: "$", min: 0, step: 10 }
    ],
    advancedInputs: [
      { name: "debt3Balance", label: "Debt 3 balance", prefix: "$", min: 0, step: 100 },
      { name: "debt3Rate", label: "Debt 3 APR", suffix: "%", min: 0, step: 0.1 },
      { name: "debt3Payment", label: "Debt 3 min payment", prefix: "$", min: 0, step: 10 },
      { name: "extraMonthly", label: "Extra monthly payment", prefix: "$", min: 0, step: 25 }
    ],
    presets: true,
    example: "The avalanche method targets the 22% debt first, then the 18% debt, saving the most money in interest compared to other methods.",
    sections: [
      {
        title: "How the debt avalanche works",
        body:
          "List your debts from highest interest rate to lowest, regardless of balance. Make minimum payments on everything, then put all extra money toward the highest interest debt. When it's paid off, roll that payment into the next one."
      },
      {
        title: "Mathematical optimization",
        body:
          "The avalanche is mathematically optimal—it will almost always save you the most money in interest. This makes sense if you can stay motivated without the quick wins that the snowball method provides."
      },
      {
        title: "Can you combine both methods?",
        body:
          "Absolutely! Some people use a hybrid approach. If you have one very small debt, pay it off first for a quick win, then switch to avalanche for the rest. The best method is the one you'll actually stick with."
      }
    ],
    faqs: [
      {
        question: "Why pay highest interest first?",
        answer: "Higher interest debts cost you more each month. Eliminating them first reduces the total interest you pay over time and frees up more money for other goals."
      },
      {
        question: "Should I choose avalanche or snowball?",
        answer: "Choose avalanche if you want to minimize interest and can stay motivated. Choose snowball if you need quick wins to stay on track. We have calculators for both so you can compare the difference!"
      }
    ],
    related: ["debt-snowball-calculator", "debt-payoff-calculator", "debt-to-income-ratio-calculator"],
    compute(values) {
      const debts = [
        { balance: Number(values.debt1Balance), rate: Number(values.debt1Rate), payment: Number(values.debt1Payment), name: "Debt 1" },
        { balance: Number(values.debt2Balance), rate: Number(values.debt2Rate), payment: Number(values.debt2Payment), name: "Debt 2" },
        { balance: Number(values.debt3Balance), rate: Number(values.debt3Rate), payment: Number(values.debt3Payment), name: "Debt 3" }
      ].filter(d => d.balance > 0 && d.payment > 0);

      const extraMonthly = Number(values.extraMonthly) || 0;

      debts.sort((a, b) => b.rate - a.rate);

      const totalMinimumPayment = debts.reduce((sum, d) => sum + d.payment, 0);
      const totalMonthlyPayment = totalMinimumPayment + extraMonthly;

      let months = 0;
      let totalInterest = 0;
      const payoffOrder = [];
      const remainingDebts = debts.map(d => ({ ...d, remaining: d.balance }));

      while (remainingDebts.some(d => d.remaining > 0) && months < 600) {
        months++;
        let availableForExtra = extraMonthly;

        for (let i = 0; i < remainingDebts.length; i++) {
          if (remainingDebts[i].remaining <= 0) continue;

          const monthlyRate = remainingDebts[i].rate / 100 / 12;
          const interest = remainingDebts[i].remaining * monthlyRate;
          totalInterest += interest;

          let payment = remainingDebts[i].payment;

          if (availableForExtra > 0) {
            const firstUnpaidIndex = remainingDebts.findIndex(d => d.remaining > 0);
            if (i === firstUnpaidIndex) {
              payment += availableForExtra;
              availableForExtra = 0;
            }
          }

          const newBalance = remainingDebts[i].remaining + interest - payment;

          if (newBalance <= 0) {
            remainingDebts[i].remaining = 0;
            if (!payoffOrder.includes(i)) {
              payoffOrder.push(i);
            }
          } else {
            remainingDebts[i].remaining = newBalance;
          }
        }
      }

      const snowballComparison = (() => {
        const snowballDebts = [...debts].sort((a, b) => a.balance - b.balance);
        let snowballMonths = 0;
        let snowballInterest = 0;
        const remaining = snowballDebts.map(d => ({ ...d, remaining: d.balance }));

        while (remaining.some(d => d.remaining > 0) && snowballMonths < 600) {
          snowballMonths++;
          let availableForExtra = extraMonthly;

          for (let i = 0; i < remaining.length; i++) {
            if (remaining[i].remaining <= 0) continue;

            const monthlyRate = remaining[i].rate / 100 / 12;
            const interest = remaining[i].remaining * monthlyRate;
            snowballInterest += interest;

            let payment = remaining[i].payment;

            if (availableForExtra > 0) {
              const firstUnpaidIndex = remaining.findIndex(d => d.remaining > 0);
              if (i === firstUnpaidIndex) {
                payment += availableForExtra;
                availableForExtra = 0;
              }
            }

            const newBalance = remaining[i].remaining + interest - payment;
            remaining[i].remaining = Math.max(0, newBalance);
          }
        }

        return { months: snowballMonths, interest: snowballInterest };
      })();

      const interestSavings = snowballComparison.interest - totalInterest;
      const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
      const totalPaid = totalDebt + totalInterest;

      return {
        summary: [
          { label: "Time to payoff", value: formatYearsAndMonths(months) },
          { label: "Total interest", value: formatCurrency(totalInterest) },
          { label: "Interest saved vs snowball", value: interestSavings > 0 ? formatCurrency(interestSavings) : "About the same" }
        ],
        details: [
          { label: "Total debt", value: formatCurrency(totalDebt) },
          { label: "Minimum payments", value: formatCurrencyPrecise(totalMinimumPayment) },
          { label: "Extra payment", value: formatCurrencyPrecise(extraMonthly) },
          { label: "Monthly total payment", value: formatCurrencyPrecise(totalMonthlyPayment) }
        ],
        timeline: [
          { label: "Avalanche total interest", amount: roundCurrency(totalInterest) },
          { label: "Snowball total interest", amount: roundCurrency(snowballComparison.interest) }
        ],
        breakdown: [
          { label: "Total principal", amount: roundCurrency(totalDebt) },
          { label: "Total interest", amount: roundCurrency(totalInterest) },
          { label: "Total paid", amount: roundCurrency(totalPaid) }
        ],
        milestones: [
          { label: "Payoff order", value: payoffOrder.map(i => debts[i].name).join(" → ") || "Add debts to see" },
          { label: "Avalanche time", value: formatYearsAndMonths(months) },
          { label: "Interest saved vs snowball", value: interestSavings > 0 ? formatCurrency(interestSavings) : "About the same" }
        ],
        note: "Avalanche is mathematically optimal for saving interest. But the best method is the one you'll actually stick with long-term!"
      };
    }
  },
  {
    slug: "rule-of-72-calculator",
    name: "Rule of 72 Calculator",
    category: "Investing",
    description: "Quickly estimate how long it takes for your money to double using the Rule of 72, plus see the exact calculation.",
    intro:
      "Enter an interest or growth rate to see the Rule of 72 estimate and the exact calculation for doubling your money.",
    keywords: [
      "rule of 72 calculator",
      "how long to double money",
      "double investment calculator",
      "rule of 72 compound interest"
    ],
    defaults: {
      annualRate: 7,
      initialAmount: 10000,
      compareRate: 5
    },
    inputs: [
      { name: "annualRate", label: "Annual rate of return", suffix: "%", min: 0, max: 50, step: 0.1 },
      { name: "initialAmount", label: "Initial amount", prefix: "$", min: 0, step: 1000 }
    ],
    advancedInputs: [
      { name: "compareRate", label: "Compare with rate", suffix: "%", min: 0, max: 50, step: 0.1 }
    ],
    presets: true,
    example: "At 7%, your money doubles about every 10.3 years using the Rule of 72. The exact calculation shows 10.24 years—very close!",
    sections: [
      {
        title: "What is the Rule of 72?",
        body:
          "The Rule of 72 is a quick mental shortcut to estimate how long it takes for money to double. Simply divide 72 by the annual growth rate to get the approximate number of years. It works for interest rates, inflation, or any growth scenario."
      },
      {
        title: "Why 72 works so well",
        body:
          "72 is chosen because it's easily divisible by many common numbers (2, 3, 4, 6, 8, 9, 12), making mental math easy. It's most accurate around 7-10%, but works reasonably well across a wide range of rates."
      },
      {
        title: "The Rule of 72 in reverse",
        body:
          "You can also use it in reverse: if you want to double your money in 8 years, what rate do you need? 72 ÷ 8 = 9%. It's great for setting realistic expectations about investment growth."
      }
    ],
    faqs: [
      {
        question: "How accurate is the Rule of 72?",
        answer: "It's very accurate for rates between 6-10%. For lower rates, you might use 70, and for higher rates, 74 or 76. But 72 is excellent as a general rule of thumb."
      },
      {
        question: "Can I use the Rule of 72 for anything else?",
        answer: "Absolutely! It works for inflation (how long until money halves in value), GDP growth, population growth, or anything that compounds. Just remember it's an estimate."
      }
    ],
    related: ["compound-interest-calculator", "roi-calculator", "cagr-calculator"],
    compute(values) {
      const annualRate = Number(values.annualRate);
      const initialAmount = Number(values.initialAmount);
      const compareRate = Number(values.compareRate);

      const ruleOf72Years = annualRate > 0 ? 72 / annualRate : 0;
      const exactYears = annualRate > 0 ? Math.log(2) / Math.log(1 + annualRate / 100) : 0;
      const difference = Math.abs(ruleOf72Years - exactYears);

      const ruleOf72Compare = compareRate > 0 ? 72 / compareRate : 0;
      const exactCompare = compareRate > 0 ? Math.log(2) / Math.log(1 + compareRate / 100) : 0;

      const futureValueAtDouble = initialAmount * 2;

      const quadrupleRuleYears = ruleOf72Years * 2;
      const quadrupleExactYears = exactYears * 2;

      const timelineData = [];
      let amount = initialAmount;
      let years = 0;
      while (amount < futureValueAtDouble * 2 && years < 100) {
        amount = amount * (1 + annualRate / 100);
        years++;
        if (years % 5 === 0 || amount >= futureValueAtDouble) {
          timelineData.push({ label: `Year ${years}`, amount: roundCurrency(amount) });
        }
        if (amount >= futureValueAtDouble * 2) break;
      }

      return {
        summary: [
          { label: "Rule of 72 estimate", value: `${ruleOf72Years.toFixed(1)} years` },
          { label: "Exact calculation", value: `${exactYears.toFixed(2)} years` },
          { label: "Doubled amount", value: formatCurrency(futureValueAtDouble) }
        ],
        details: [
          { label: "At this rate", value: formatPercent(annualRate) },
          { label: "Rule of 72", value: `72 ÷ ${annualRate} = ${ruleOf72Years.toFixed(1)} years` },
          { label: "Exact formula", value: `ln(2) ÷ ln(1 + r) = ${exactYears.toFixed(2)} years` },
          { label: "Difference", value: difference < 0.5 ? "Very close!" : `About ${difference.toFixed(1)} years off` }
        ],
        timeline: timelineData.length > 0 ? timelineData : [
          { label: "Year 0", amount: roundCurrency(initialAmount) },
          { label: "Double", amount: roundCurrency(futureValueAtDouble) },
          { label: "Quadruple", amount: roundCurrency(futureValueAtDouble * 2) }
        ],
        breakdown: [
          { label: "Time to double", amount: roundCurrency(exactYears) },
          { label: "Time to quadruple", amount: roundCurrency(quadrupleExactYears) }
        ],
        milestones: compareRate > 0 ? [
          { label: `At ${annualRate}%`, value: `${ruleOf72Years.toFixed(1)} years to double` },
          { label: `At ${compareRate}%`, value: `${ruleOf72Compare.toFixed(1)} years to double` },
          { label: "Difference", value: `${Math.abs(ruleOf72Years - ruleOf72Compare).toFixed(1)} years` }
        ] : [
          { label: "Time to double", value: `${ruleOf72Years.toFixed(1)} years` },
          { label: "Time to quadruple", value: `${quadrupleRuleYears.toFixed(1)} years` },
          { label: "Time to 8x", value: `${(ruleOf72Years * 3).toFixed(1)} years` }
        ],
        note: "The Rule of 72 is a great estimate! Use our compound interest calculator for more detailed projections."
      };
    }
  },
  {
    slug: "apy-calculator",
    name: "APY Calculator",
    category: "Savings",
    description: "Calculate the Annual Percentage Yield (APY) from an interest rate and compounding frequency.",
    intro:
      "Enter an interest rate and how often it compounds to see the APY—the effective annual rate you'll actually earn.",
    keywords: [
      "apy calculator",
      "annual percentage yield calculator",
      "interest rate to apy",
      "compound interest apy"
    ],
    defaults: {
      annualRate: 4.5,
      compounding: 12,
      initialDeposit: 10000,
      years: 1
    },
    inputs: [
      { name: "annualRate", label: "Interest rate (APR)", suffix: "%", min: 0, max: 25, step: 0.01 },
      { name: "initialDeposit", label: "Initial deposit", prefix: "$", min: 0, step: 1000 }
    ],
    advancedInputs: [
      { name: "compounding", label: "Compounds per year", min: 1, max: 365, step: 1 },
      { name: "years", label: "Time period", suffix: "years", min: 1, max: 40, step: 1 }
    ],
    presets: true,
    example: "A 4.5% interest rate compounded monthly gives an APY of about 4.59%, meaning you'll earn $459 on a $10,000 deposit in one year.",
    sections: [
      {
        title: "APY vs APR—what's the difference?",
        body:
          "APR (Annual Percentage Rate) is the base interest rate. APY (Annual Percentage Yield) includes the effect of compounding. The more frequently interest compounds, the higher the APY will be compared to the APR."
      },
      {
        title: "Why compounding frequency matters",
        body:
          "Compounding means you earn interest on interest. Monthly compounding is better than annual, and daily is better than monthly. The difference adds up over time, especially with larger balances."
      },
      {
        title: "Comparing APYs across accounts",
        body:
          "When comparing savings accounts, CDs, or money market accounts, always compare APYs, not APRs. APY lets you compare accounts with different compounding frequencies on an equal basis."
      }
    ],
    faqs: [
      {
        question: "What's the formula for APY?",
        answer: "APY = (1 + r/n)^n - 1, where r is the annual interest rate and n is the number of compounding periods per year. We calculate this automatically for you!"
      },
      {
        question: "Is higher compounding always better?",
        answer: "Yes, for the same APR. Daily compounding will give you slightly more than monthly, which gives more than annual. But if one account has a higher APR but less frequent compounding, compare the APYs!"
      }
    ],
    related: ["compound-interest-calculator", "cd-calculator", "savings-goal-calculator"],
    compute(values) {
      const annualRate = Number(values.annualRate);
      const initialDeposit = Number(values.initialDeposit);
      const compounding = Number(values.compounding) || 12;
      const years = Number(values.years) || 1;

      const periodicRate = annualRate / 100 / compounding;
      const apy = Math.pow(1 + periodicRate, compounding) - 1;
      const apyPercent = apy * 100;

      const futureValue = initialDeposit * Math.pow(1 + periodicRate, compounding * years);
      const totalInterest = futureValue - initialDeposit;

      const simpleInterest = initialDeposit * (annualRate / 100) * years;
      const compoundingBenefit = totalInterest - simpleInterest;

      const annualCompoundingApy = Math.pow(1 + annualRate / 100, 1) - 1;
      const dailyCompoundingApy = Math.pow(1 + annualRate / 100 / 365, 365) - 1;

      const timeline = [];
      for (let year = 1; year <= Math.min(years, 10); year++) {
        const value = initialDeposit * Math.pow(1 + periodicRate, compounding * year);
        timeline.push({ label: `Year ${year}`, amount: roundCurrency(value) });
      }

      return {
        summary: [
          { label: "Annual Percentage Yield", value: formatPercent(apyPercent) },
          { label: "Interest earned", value: formatCurrency(totalInterest) },
          { label: "Future value", value: formatCurrency(futureValue) }
        ],
        details: [
          { label: "Stated APR", value: formatPercent(annualRate) },
          { label: "Compounding", value: `${compounding} times per year` },
          { label: "Compounding benefit", value: formatCurrency(compoundingBenefit) },
          { label: "Periodic rate", value: formatPercent((periodicRate * 100)) }
        ],
        timeline,
        breakdown: [
          { label: "Initial deposit", amount: roundCurrency(initialDeposit) },
          { label: "Interest earned", amount: roundCurrency(totalInterest) },
          { label: "Future value", amount: roundCurrency(futureValue) }
        ],
        milestones: [
          { label: "With annual compounding", value: formatPercent(annualCompoundingApy * 100) },
          { label: "With monthly compounding", value: formatPercent(apyPercent) },
          { label: "With daily compounding", value: formatPercent(dailyCompoundingApy * 100) }
        ],
        note: "APY is the effective annual rate that includes compounding. Use it to compare accounts on an equal basis!"
      };
    }
  },
  {
    slug: "rental-property-calculator",
    name: "Rental Property Calculator",
    category: "Investing",
    description: "Calculate cash flow, cash-on-cash return, cap rate, and other key metrics for a rental property investment.",
    intro:
      "Enter property details, income, and expenses to analyze if a rental property is a good investment for you.",
    keywords: [
      "rental property calculator",
      "real estate investment calculator",
      "cash flow calculator",
      "cap rate calculator",
      "rental cash flow"
    ],
    defaults: {
      propertyValue: 400000,
      downPayment: 80000,
      interestRate: 6.5,
      loanTerm: 30,
      monthlyRent: 2500,
      propertyTax: 400,
      insurance: 100,
      maintenance: 200,
      vacancyRate: 5,
      otherExpenses: 100
    },
    inputs: [
      { name: "propertyValue", label: "Property value", prefix: "$", min: 0, step: 10000 },
      { name: "downPayment", label: "Down payment", prefix: "$", min: 0, step: 5000 },
      { name: "monthlyRent", label: "Monthly rent", prefix: "$", min: 0, step: 100 },
      { name: "interestRate", label: "Interest rate", suffix: "%", min: 0, step: 0.1 }
    ],
    advancedInputs: [
      { name: "loanTerm", label: "Loan term", suffix: "years", min: 5, max: 40, step: 5 },
      { name: "propertyTax", label: "Property tax/month", prefix: "$", min: 0, step: 50 },
      { name: "insurance", label: "Insurance/month", prefix: "$", min: 0, step: 25 },
      { name: "maintenance", label: "Maintenance/month", prefix: "$", min: 0, step: 25 },
      { name: "vacancyRate", label: "Vacancy rate", suffix: "%", min: 0, max: 30, step: 1 },
      { name: "otherExpenses", label: "Other expenses/month", prefix: "$", min: 0, step: 50 }
    ],
    presets: true,
    example: "A $400,000 property with 20% down renting for $2,500/month should cash flow positively if expenses are managed well.",
    sections: [
      {
        title: "Understanding key rental metrics",
        body:
          "Cash flow is income minus expenses. Cash-on-cash return measures annual cash flow against your down payment. Cap rate is net operating income divided by property value, useful for comparing properties."
      },
      {
        title: "Don't forget vacancy and maintenance",
        body:
          "New investors often underestimate vacancy costs and maintenance. A good rule of thumb is 5-10% for vacancy and 1-2% of property value annually for maintenance."
      },
      {
        title: "The 1% rule as a quick check",
        body:
          "A quick screening test: the monthly rent should be at least 1% of the purchase price. It's not perfect, but it helps filter properties worth analyzing more deeply."
      }
    ],
    faqs: [
      {
        question: "What's a good cash-on-cash return?",
        answer: "Many investors look for 8-12% or more, depending on the market and risk. Higher is better, but make sure your assumptions about rent and expenses are realistic."
      },
      {
        question: "What's cap rate?",
        answer: "Cap rate is net operating income divided by property value. It measures return if you bought the property all cash, making it great for comparing properties across different markets."
      }
    ],
    related: ["mortgage-calculator", "roi-calculator", "compound-interest-calculator"],
    compute(values) {
      const propertyValue = Number(values.propertyValue);
      const downPayment = Number(values.downPayment);
      const loanAmount = Math.max(0, propertyValue - downPayment);
      const interestRate = Number(values.interestRate);
      const loanTerm = Number(values.loanTerm) || 30;
      const monthlyRent = Number(values.monthlyRent);
      const propertyTax = Number(values.propertyTax);
      const insurance = Number(values.insurance);
      const maintenance = Number(values.maintenance);
      const vacancyRate = Number(values.vacancyRate) / 100;
      const otherExpenses = Number(values.otherExpenses);

      const monthlyMortgage = loanAmount > 0 ? paymentForLoan(loanAmount, interestRate, loanTerm) : 0;

      const annualRent = monthlyRent * 12;
      const vacancyLoss = annualRent * vacancyRate;
      const effectiveGrossIncome = annualRent - vacancyLoss;

      const annualPropertyTax = propertyTax * 12;
      const annualInsurance = insurance * 12;
      const annualMaintenance = maintenance * 12;
      const annualOther = otherExpenses * 12;

      const annualOperatingExpenses = annualPropertyTax + annualInsurance + annualMaintenance + annualOther;
      const netOperatingIncome = effectiveGrossIncome - annualOperatingExpenses;

      const annualMortgagePayment = monthlyMortgage * 12;
      const annualCashFlow = netOperatingIncome - annualMortgagePayment;
      const monthlyCashFlow = annualCashFlow / 12;

      const capRate = propertyValue > 0 ? (netOperatingIncome / propertyValue) * 100 : 0;
      const cashOnCashReturn = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;

      const onePercentRule = (monthlyRent / propertyValue) * 100;
      const meetsOnePercent = onePercentRule >= 1;

      const grossRentMultiplier = propertyValue > 0 ? propertyValue / annualRent : 0;

      const breakEvenRatio = annualOperatingExpenses + annualMortgagePayment;
      const breakEvenPercent = annualRent > 0 ? (breakEvenRatio / annualRent) * 100 : 0;

      return {
        summary: [
          { label: "Monthly cash flow", value: monthlyCashFlow >= 0 ? formatCurrencyPrecise(monthlyCashFlow) : `-$${formatCurrencyPrecise(Math.abs(monthlyCashFlow))}` },
          { label: "Cash-on-cash return", value: formatPercent(cashOnCashReturn) },
          { label: "Cap rate", value: formatPercent(capRate) }
        ],
        details: [
          { label: "Annual rent", value: formatCurrency(annualRent) },
          { label: "Net operating income", value: formatCurrency(netOperatingIncome) },
          { label: "Annual mortgage", value: formatCurrency(annualMortgagePayment) },
          { label: "Down payment", value: formatCurrency(downPayment) }
        ],
        timeline: [
          { label: "Annual cash flow", amount: roundCurrency(annualCashFlow) },
          { label: "5-year cash flow", amount: roundCurrency(annualCashFlow * 5) },
          { label: "10-year cash flow", amount: roundCurrency(annualCashFlow * 10) }
        ],
        breakdown: [
          { label: "Annual rent", amount: roundCurrency(annualRent) },
          { label: "Less vacancy", amount: -roundCurrency(vacancyLoss) },
          { label: "Less expenses", amount: -roundCurrency(annualOperatingExpenses) },
          { label: "Less debt service", amount: -roundCurrency(annualMortgagePayment) },
          { label: "Cash flow", amount: roundCurrency(annualCashFlow) }
        ],
        milestones: [
          { label: "1% rule check", value: meetsOnePercent ? "Meets 1% rule" : "Below 1% rule" },
          { label: "GRM (gross rent multiplier)", value: grossRentMultiplier.toFixed(1) },
          { label: "Break-even occupancy", value: formatPercent(breakEvenPercent) }
        ],
        note: "This is an estimate. Run conservative numbers—vacancy and maintenance are often higher than new investors expect."
      };
    }
  }
];

export const calculatorIndex = Object.fromEntries(calculatorRegistry.map((calculator) => [calculator.slug, calculator]));

export const calculatorCategories = [
  {
    title: "Mortgage",
    slugs: [
      "mortgage-calculator",
      "mortgage-amortization-calculator",
      "refinance-calculator",
      "home-affordability-calculator",
      "rent-vs-buy-calculator",
      "extra-payment-mortgage-calculator",
      "pmi-calculator"
    ]
  },
  {
    title: "Debt",
    slugs: [
      "loan-calculator",
      "debt-payoff-calculator",
      "credit-card-payoff-calculator",
      "auto-loan-calculator",
      "debt-to-income-ratio-calculator",
      "student-loan-calculator",
      "car-affordability-calculator",
      "debt-snowball-calculator",
      "debt-avalanche-calculator"
    ]
  },
  {
    title: "Income & Tax",
    slugs: [
      "paycheck-calculator",
      "salary-calculator",
      "income-tax-calculator",
      "sales-tax-calculator",
      "self-employment-tax-calculator",
      "capital-gains-tax-calculator"
    ]
  },
  {
    title: "Investing",
    slugs: [
      "compound-interest-calculator",
      "roi-calculator",
      "cagr-calculator",
      "dividend-calculator",
      "inflation-calculator",
      "rule-of-72-calculator",
      "rental-property-calculator"
    ]
  },
  {
    title: "Retirement",
    slugs: ["retirement-calculator", "401k-calculator", "roth-ira-calculator"]
  },
  {
    title: "Savings",
    slugs: ["savings-goal-calculator", "emergency-fund-calculator", "cd-calculator", "apy-calculator"]
  },
  {
    title: "Budgeting",
    slugs: ["budget-calculator", "net-worth-calculator", "50-30-20-budget-calculator", "life-insurance-calculator"]
  }
];

export function getCalculatorBySlug(slug) {
  return calculatorIndex[slug];
}

export function getCalculatorsBySlugs(slugs) {
  return slugs.map((slug) => calculatorIndex[slug]).filter(Boolean);
}

export function getFeaturedCalculators() {
  return getCalculatorsBySlugs([
    "compound-interest-calculator",
    "mortgage-calculator",
    "budget-calculator",
    "emergency-fund-calculator"
  ]);
}
