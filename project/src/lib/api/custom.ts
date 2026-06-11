import { getNormalizedTransactions } from "./normalize";
import { unifiedCurrencies } from "./table";

export const getCashFlowByYear = async () => {
  let transactions = await getNormalizedTransactions({});
  transactions = await unifiedCurrencies(transactions, "USD");

  const cashFlow = new Map<string, { cashIn: number; cashOut: number }>();

  transactions.forEach((t) => {
    const year = t.date.split("-")[0];
    const current = cashFlow.get(year) ?? { cashIn: 0, cashOut: 0 };

    if (t.type === "credit") {
      cashFlow.set(year, {
        ...current,
        cashIn: current.cashIn + Math.abs(t.amount),
      });
    } else {
      cashFlow.set(year, {
        ...current,
        cashOut: current.cashOut + Math.abs(t.amount),
      });
    }
  });

  return Array.from(cashFlow).sort((a, b) => +a[0] - +b[0]);
};

export const getCategoriesByYear = async () => {
  // Here we get first the category and then we get accumulate the category spent during years

  let transactions = await getNormalizedTransactions({});

  transactions = transactions.filter((t) => t.type === "debit");

  transactions = await unifiedCurrencies(transactions, "USD");

  const byCategory = new Map<string, Map<string, number>>();

  transactions.forEach((t) => {
    const year = t.date.split("-")[0];

    if (!byCategory.has(t.category)) byCategory.set(t.category, new Map());

    const years = byCategory.get(t.category)!;

    years.set(year, (years.get(year) ?? 0) + Math.abs(t.amount));
  });

  return Array.from(byCategory.entries())
    .map(([name, years]) => ({
      name,
      total: Array.from(years.values()).reduce((s, v) => s + v, 0),
      byYear: Object.fromEntries(years) as Record<string, number>,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(({ name, byYear }) => ({ name, byYear }));
};

export const getProjections = (
  base: { cashIn: number; cashOut: number },
  revenueGrowth: number,
  expenseGrowth: number,
) => {
  const proj2026 = {
    cashIn: Math.round(base.cashIn * (1 + revenueGrowth / 100)),
    cashOut: Math.round(base.cashOut * (1 + expenseGrowth / 100)),
  };
  const proj2027 = {
    cashIn: Math.round(proj2026.cashIn * (1 + revenueGrowth / 100)),
    cashOut: Math.round(proj2026.cashOut * (1 + expenseGrowth / 100)),
  };
  return { proj2026, proj2027 };
};
