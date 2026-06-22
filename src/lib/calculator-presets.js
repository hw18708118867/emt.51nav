export const calculatorPresets = {
  "mortgage-amortization-calculator": [
    {
      label: "Starter home",
      description: "$240k at 6.1%, 30 years",
      values: { loanAmount: 240000, annualRate: 6.1, years: 30 }
    },
    {
      label: "Typical",
      description: "$360k at 6.4%, 30 years",
      values: { loanAmount: 360000, annualRate: 6.4, years: 30 }
    },
    {
      label: "15-year",
      description: "$360k at 5.9%, 15 years",
      values: { loanAmount: 360000, annualRate: 5.9, years: 15 }
    }
  ],
  "refinance-calculator": [
    {
      label: "Small drop",
      description: "7.5% to 6.9%",
      values: { currentBalance: 320000, currentRate: 7.5, remainingYears: 27, newRate: 6.9, newTerm: 30, closingCosts: 6000 }
    },
    {
      label: "Big drop",
      description: "7.5% to 6.1%",
      values: { currentBalance: 320000, currentRate: 7.5, remainingYears: 27, newRate: 6.1, newTerm: 30, closingCosts: 6000 }
    },
    {
      label: "Shorter term",
      description: "Refi into 15 years",
      values: { currentBalance: 320000, currentRate: 7.5, remainingYears: 27, newRate: 5.9, newTerm: 15, closingCosts: 6000 }
    }
  ],
  "home-affordability-calculator": [
    {
      label: "Conservative",
      description: "Low debt, big down payment",
      values: { annualIncome: 120000, monthlyDebts: 300, downPayment: 90000, annualRate: 6.4, years: 30 }
    },
    {
      label: "Typical",
      description: "$120k income, $600 debts",
      values: { annualIncome: 120000, monthlyDebts: 600, downPayment: 60000, annualRate: 6.4, years: 30 }
    },
    {
      label: "Stretch",
      description: "Higher debt, smaller down",
      values: { annualIncome: 120000, monthlyDebts: 1000, downPayment: 30000, annualRate: 6.9, years: 30 }
    }
  ],
  "rent-vs-buy-calculator": [
    {
      label: "Short stay",
      description: "3 years, renting often wins",
      values: { homePrice: 450000, downPayment: 90000, annualRate: 6.4, monthlyRent: 2200, years: 3 }
    },
    {
      label: "Medium stay",
      description: "7 years in the home",
      values: { homePrice: 450000, downPayment: 90000, annualRate: 6.4, monthlyRent: 2200, years: 7 }
    },
    {
      label: "Long stay",
      description: "12 years, buying often wins",
      values: { homePrice: 450000, downPayment: 90000, annualRate: 6.4, monthlyRent: 2200, years: 12 }
    }
  ],
  "extra-payment-mortgage-calculator": [
    {
      label: "Modest extra",
      description: "$150 extra per month",
      values: { loanAmount: 360000, annualRate: 6.4, years: 30, extraMonthly: 150 }
    },
    {
      label: "Steady extra",
      description: "$300 extra per month",
      values: { loanAmount: 360000, annualRate: 6.4, years: 30, extraMonthly: 300 }
    },
    {
      label: "Aggressive",
      description: "$600 extra per month",
      values: { loanAmount: 360000, annualRate: 6.4, years: 30, extraMonthly: 600 }
    }
  ],
  "compound-interest-calculator": [
    {
      label: "Starter",
      description: "$5k start, $250 monthly",
      values: {
        initialAmount: 5000,
        monthlyContribution: 250,
        annualRate: 7,
        years: 15
      }
    },
    {
      label: "Balanced",
      description: "$10k start, $500 monthly",
      values: {
        initialAmount: 10000,
        monthlyContribution: 500,
        annualRate: 8,
        years: 20
      }
    },
    {
      label: "Aggressive",
      description: "$25k start, $1000 monthly",
      values: {
        initialAmount: 25000,
        monthlyContribution: 1000,
        annualRate: 9,
        years: 25
      }
    }
  ],
  "mortgage-calculator": [
    {
      label: "Conservative",
      description: "Lower price, bigger down payment",
      values: {
        homePrice: 325000,
        downPayment: 97500,
        annualRate: 6.1,
        years: 15
      }
    },
    {
      label: "Typical",
      description: "30-year fixed baseline",
      values: {
        homePrice: 450000,
        downPayment: 90000,
        annualRate: 6.4,
        years: 30
      }
    },
    {
      label: "Stretch",
      description: "Higher price, lower down payment",
      values: {
        homePrice: 650000,
        downPayment: 65000,
        annualRate: 6.9,
        years: 30
      }
    }
  ],
  "loan-calculator": [
    {
      label: "Short term",
      description: "$15k over 3 years",
      values: {
        loanAmount: 15000,
        annualRate: 6.5,
        years: 3
      }
    },
    {
      label: "Standard",
      description: "$25k over 5 years",
      values: {
        loanAmount: 25000,
        annualRate: 7.9,
        years: 5
      }
    },
    {
      label: "Extended",
      description: "$40k over 7 years",
      values: {
        loanAmount: 40000,
        annualRate: 9.2,
        years: 7
      }
    }
  ],
  "retirement-calculator": [
    {
      label: "Catch-up",
      description: "Later start, higher savings",
      values: {
        currentSavings: 30000,
        monthlyContribution: 1200,
        annualReturn: 7,
        yearsToRetirement: 20
      }
    },
    {
      label: "Steady",
      description: "Mid-career baseline",
      values: {
        currentSavings: 75000,
        monthlyContribution: 900,
        annualReturn: 7,
        yearsToRetirement: 25
      }
    },
    {
      label: "Early builder",
      description: "Long runway compounding",
      values: {
        currentSavings: 20000,
        monthlyContribution: 700,
        annualReturn: 8,
        yearsToRetirement: 35
      }
    }
  ],
  "inflation-calculator": [
    {
      label: "Low inflation",
      description: "2% over 10 years",
      values: {
        amount: 1000,
        inflationRate: 2,
        years: 10
      }
    },
    {
      label: "Baseline",
      description: "3% over 10 years",
      values: {
        amount: 1000,
        inflationRate: 3,
        years: 10
      }
    },
    {
      label: "Hot cycle",
      description: "4.5% over 15 years",
      values: {
        amount: 1000,
        inflationRate: 4.5,
        years: 15
      }
    }
  ],
  "debt-payoff-calculator": [
    {
      label: "Minimum-ish",
      description: "Slow payoff pressure",
      values: {
        balance: 12000,
        annualRate: 18.9,
        monthlyPayment: 275
      }
    },
    {
      label: "Baseline",
      description: "Current default case",
      values: {
        balance: 12000,
        annualRate: 18.9,
        monthlyPayment: 350
      }
    },
    {
      label: "Accelerated",
      description: "Faster payoff push",
      values: {
        balance: 12000,
        annualRate: 18.9,
        monthlyPayment: 500
      }
    }
  ],
  "savings-goal-calculator": [
    {
      label: "Vacation",
      description: "$5k target",
      values: {
        targetAmount: 5000,
        currentSavings: 1000,
        monthlySavings: 300,
        annualRate: 3
      }
    },
    {
      label: "Emergency tier",
      description: "$20k target",
      values: {
        targetAmount: 20000,
        currentSavings: 3000,
        monthlySavings: 500,
        annualRate: 4
      }
    },
    {
      label: "Big purchase",
      description: "$40k target",
      values: {
        targetAmount: 40000,
        currentSavings: 5000,
        monthlySavings: 900,
        annualRate: 4.5
      }
    }
  ],
  "budget-calculator": [
    {
      label: "Lean",
      description: "Tight but workable",
      values: {
        monthlyIncome: 4500,
        housing: 1450,
        debt: 350,
        essentials: 1050,
        savings: 500
      }
    },
    {
      label: "Balanced",
      description: "Default planning case",
      values: {
        monthlyIncome: 6000,
        housing: 1800,
        debt: 500,
        essentials: 1200,
        savings: 700
      }
    },
    {
      label: "House-poor",
      description: "Stress-test housing load",
      values: {
        monthlyIncome: 6000,
        housing: 2600,
        debt: 650,
        essentials: 1350,
        savings: 500
      }
    }
  ],
  "emergency-fund-calculator": [
    {
      label: "3 months",
      description: "Starter cushion",
      values: {
        monthlyExpenses: 3000,
        targetMonths: 3,
        currentSavings: 2000,
        monthlyContribution: 300
      }
    },
    {
      label: "6 months",
      description: "Standard reserve",
      values: {
        monthlyExpenses: 3500,
        targetMonths: 6,
        currentSavings: 4000,
        monthlyContribution: 400
      }
    },
    {
      label: "High risk",
      description: "Deeper safety buffer",
      values: {
        monthlyExpenses: 5000,
        targetMonths: 9,
        currentSavings: 6000,
        monthlyContribution: 700
      }
    }
  ],
  "net-worth-calculator": [
    {
      label: "Early career",
      description: "Assets still building",
      values: {
        cash: 8000,
        investments: 12000,
        retirement: 18000,
        homeEquity: 0,
        loans: 28000,
        creditCards: 2500
      }
    },
    {
      label: "Mid-career",
      description: "Default baseline",
      values: {
        cash: 15000,
        investments: 40000,
        retirement: 85000,
        homeEquity: 30000,
        loans: 22000,
        creditCards: 4500
      }
    },
    {
      label: "Asset heavy",
      description: "Higher invested base",
      values: {
        cash: 25000,
        investments: 120000,
        retirement: 240000,
        homeEquity: 110000,
        loans: 18000,
        creditCards: 1500
      }
    }
  ],
  "roi-calculator": [
    {
      label: "Quick flip",
      description: "$10k to $13k in 2 years",
      values: { initialInvestment: 10000, finalValue: 13000, years: 2 }
    },
    {
      label: "Steady hold",
      description: "$10k to $18k in 5 years",
      values: { initialInvestment: 10000, finalValue: 18000, years: 5 }
    },
    {
      label: "Long hold",
      description: "$10k to $30k in 10 years",
      values: { initialInvestment: 10000, finalValue: 30000, years: 10 }
    }
  ],
  "cagr-calculator": [
    {
      label: "Modest",
      description: "$10k to $16k in 6 years",
      values: { beginningValue: 10000, endingValue: 16000, years: 6 }
    },
    {
      label: "Strong",
      description: "$10k to $25k in 8 years",
      values: { beginningValue: 10000, endingValue: 25000, years: 8 }
    },
    {
      label: "Aggressive",
      description: "$10k to $40k in 10 years",
      values: { beginningValue: 10000, endingValue: 40000, years: 10 }
    }
  ],
  "dividend-calculator": [
    {
      label: "Income tilt",
      description: "5% yield, slow growth",
      values: { investmentAmount: 50000, dividendYield: 5, annualPriceGrowth: 2, years: 20 }
    },
    {
      label: "Balanced",
      description: "3.5% yield, 4% growth",
      values: { investmentAmount: 50000, dividendYield: 3.5, annualPriceGrowth: 4, years: 20 }
    },
    {
      label: "Growth tilt",
      description: "2% yield, 7% growth",
      values: { investmentAmount: 50000, dividendYield: 2, annualPriceGrowth: 7, years: 20 }
    }
  ],
  "401k-calculator": [
    {
      label: "Match only",
      description: "Capture the 4% match",
      values: { currentBalance: 40000, annualSalary: 75000, contributionPercent: 4, employerMatchPercent: 4, annualReturn: 7, years: 30 }
    },
    {
      label: "Steady saver",
      description: "8% with 4% match",
      values: { currentBalance: 40000, annualSalary: 75000, contributionPercent: 8, employerMatchPercent: 4, annualReturn: 7, years: 30 }
    },
    {
      label: "Max effort",
      description: "15% with 5% match",
      values: { currentBalance: 40000, annualSalary: 75000, contributionPercent: 15, employerMatchPercent: 5, annualReturn: 7, years: 30 }
    }
  ],
  "roth-ira-calculator": [
    {
      label: "Catch-up",
      description: "Later start, max contribution",
      values: { currentBalance: 10000, annualContribution: 8000, annualReturn: 7, years: 20 }
    },
    {
      label: "Steady",
      description: "$7k a year for 30 years",
      values: { currentBalance: 15000, annualContribution: 7000, annualReturn: 7, years: 30 }
    },
    {
      label: "Early start",
      description: "Long runway, $6k a year",
      values: { currentBalance: 5000, annualContribution: 6000, annualReturn: 8, years: 40 }
    }
  ],
  "paycheck-calculator": [
    {
      label: "Entry level",
      description: "$45k, biweekly",
      values: { annualSalary: 45000, preTaxDeductions: 1500, payPeriods: 26, filingStatus: 0 }
    },
    {
      label: "Typical",
      description: "$60k, biweekly",
      values: { annualSalary: 60000, preTaxDeductions: 3000, payPeriods: 26, filingStatus: 0 }
    },
    {
      label: "Married, higher",
      description: "$120k household earner",
      values: { annualSalary: 120000, preTaxDeductions: 12000, payPeriods: 26, filingStatus: 1 }
    }
  ],
  "salary-calculator": [
    {
      label: "Part-time",
      description: "$18/hr, 25 hrs",
      values: { hourlyRate: 18, hoursPerWeek: 25, weeksPerYear: 50 }
    },
    {
      label: "Full-time",
      description: "$25/hr, 40 hrs",
      values: { hourlyRate: 25, hoursPerWeek: 40, weeksPerYear: 52 }
    },
    {
      label: "Skilled trade",
      description: "$42/hr, 40 hrs",
      values: { hourlyRate: 42, hoursPerWeek: 40, weeksPerYear: 50 }
    }
  ],
  "income-tax-calculator": [
    {
      label: "Single, $55k",
      description: "Common single filer",
      values: { annualIncome: 55000, filingStatus: 0 }
    },
    {
      label: "Single, $90k",
      description: "Higher single earner",
      values: { annualIncome: 90000, filingStatus: 0 }
    },
    {
      label: "Married, $150k",
      description: "Joint filers",
      values: { annualIncome: 150000, filingStatus: 1 }
    }
  ],
  "sales-tax-calculator": [
    {
      label: "Add tax",
      description: "$100 at 7.25%",
      values: { amount: 100, taxRate: 7.25, mode: 0 }
    },
    {
      label: "Big purchase",
      description: "$2,500 at 8.5%",
      values: { amount: 2500, taxRate: 8.5, mode: 0 }
    },
    {
      label: "Reverse from total",
      description: "$107.25 back to pre-tax",
      values: { amount: 107.25, taxRate: 7.25, mode: 1 }
    }
  ],
  "self-employment-tax-calculator": [
    {
      label: "Side gig",
      description: "$20k net earnings",
      values: { netEarnings: 20000 }
    },
    {
      label: "Full-time freelance",
      description: "$50k net earnings",
      values: { netEarnings: 50000 }
    },
    {
      label: "Established",
      description: "$100k net earnings",
      values: { netEarnings: 100000 }
    }
  ],
  "debt-to-income-ratio-calculator": [
    {
      label: "Healthy",
      description: "Low debt load",
      values: { grossMonthlyIncome: 7000, housingPayment: 1500, otherDebtPayments: 300 }
    },
    {
      label: "Typical",
      description: "Mid-range obligations",
      values: { grossMonthlyIncome: 7000, housingPayment: 1800, otherDebtPayments: 600 }
    },
    {
      label: "Stretched",
      description: "High monthly debt",
      values: { grossMonthlyIncome: 7000, housingPayment: 2300, otherDebtPayments: 1100 }
    }
  ],
  "credit-card-payoff-calculator": [
    {
      label: "Minimum-ish",
      description: "Slow payoff",
      values: { balance: 6000, annualRate: 22.9, monthlyPayment: 150 }
    },
    {
      label: "Steady",
      description: "$250 a month",
      values: { balance: 6000, annualRate: 22.9, monthlyPayment: 250 }
    },
    {
      label: "Aggressive",
      description: "$450 a month",
      values: { balance: 6000, annualRate: 22.9, monthlyPayment: 450 }
    }
  ],
  "auto-loan-calculator": [
    {
      label: "Used car",
      description: "$18k, 4 years",
      values: { vehiclePrice: 18000, downPayment: 2000, tradeIn: 0, annualRate: 8.5, years: 4, salesTaxRate: 0 }
    },
    {
      label: "New car",
      description: "$32k, 5 years",
      values: { vehiclePrice: 32000, downPayment: 4000, tradeIn: 0, annualRate: 7.5, years: 5, salesTaxRate: 0 }
    },
    {
      label: "With trade-in",
      description: "$40k, trade + tax",
      values: { vehiclePrice: 40000, downPayment: 3000, tradeIn: 8000, annualRate: 6.9, years: 6, salesTaxRate: 6 }
    }
  ],
  "cd-calculator": [
    {
      label: "1-year",
      description: "$10k at 5%",
      values: { deposit: 10000, annualRate: 5, years: 1, compoundingPerYear: 12 }
    },
    {
      label: "2-year",
      description: "$10k at 4.5%",
      values: { deposit: 10000, annualRate: 4.5, years: 2, compoundingPerYear: 12 }
    },
    {
      label: "5-year",
      description: "$25k at 4%",
      values: { deposit: 25000, annualRate: 4, years: 5, compoundingPerYear: 12 }
    }
  ],
  "50-30-20-budget-calculator": [
    {
      label: "Lower income",
      description: "$3,500 take-home",
      values: { monthlyIncome: 3500 }
    },
    {
      label: "Typical",
      description: "$5,000 take-home",
      values: { monthlyIncome: 5000 }
    },
    {
      label: "Higher income",
      description: "$8,000 take-home",
      values: { monthlyIncome: 8000 }
    }
  ]
};

export function getCalculatorPresets(slug) {
  return calculatorPresets[slug] || [];
}
