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

export const calculatorRegistry = [
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
    category: "Debt",
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
    category: "Investing",
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
    category: "Budgeting",
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
    category: "Budgeting",
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
  }
];

export const calculatorIndex = Object.fromEntries(calculatorRegistry.map((calculator) => [calculator.slug, calculator]));

export const calculatorCategories = [
  {
    title: "Investing",
    slugs: ["compound-interest-calculator", "retirement-calculator", "inflation-calculator"]
  },
  {
    title: "Debt",
    slugs: ["mortgage-calculator", "loan-calculator", "debt-payoff-calculator"]
  },
  {
    title: "Budgeting",
    slugs: ["savings-goal-calculator", "budget-calculator", "emergency-fund-calculator", "net-worth-calculator"]
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
