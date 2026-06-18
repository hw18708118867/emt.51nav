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
      "extra-payment-mortgage-calculator"
    ]
  },
  {
    title: "Debt",
    slugs: ["loan-calculator", "debt-payoff-calculator"]
  },
  {
    title: "Investing",
    slugs: [
      "compound-interest-calculator",
      "roi-calculator",
      "cagr-calculator",
      "dividend-calculator",
      "inflation-calculator"
    ]
  },
  {
    title: "Retirement",
    slugs: ["retirement-calculator", "401k-calculator", "roth-ira-calculator"]
  },
  {
    title: "Savings",
    slugs: ["savings-goal-calculator", "emergency-fund-calculator"]
  },
  {
    title: "Budgeting",
    slugs: ["budget-calculator", "net-worth-calculator"]
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
