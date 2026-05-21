export const calculatorPresets = {
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
  ]
};

export function getCalculatorPresets(slug) {
  return calculatorPresets[slug] || [];
}
