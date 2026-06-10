// Here I will hold the logic of all the KPI displayed in the stats dashboard

import { TransactionList } from "@/interfaces/banks/boa";
import { getNormalizedTransactions } from "./normalize";
import { unifiedCurrencies } from "./table";
import { getAmexData, getChaseData } from "../db/banks";

// Total cash in
export const getTotalCashIn = async () => {
  // Get only transactions that are positive (Credit type)
  let transactions = await getNormalizedTransactions({ amount: "0" });

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  return transactions.reduce((curr, t) => curr + t.amount, 0);
};

// Total cash out
export const getTotalCashOut = async () => {
  // Get all transactions to filter and get only the negative ones
  const transactions = await getNormalizedTransactions({});
  let negTransactions = transactions.filter((t) => t.amount <= 0);

  // Convert all amount in USD
  negTransactions = await unifiedCurrencies(negTransactions, "USD");

  return negTransactions.reduce((curr, t) => curr + t.amount, 0);
};

export const getNetCashFlow = async () => {
  // To avoid calling twice getNormalizedTransactions we can retrieve everything and sum up every amount
  let transactions = await getNormalizedTransactions({});

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  return transactions.reduce((curr, t) => curr + t.amount, 0).toFixed(0);
};

export const getTopVendors = async () => {
  // To get top vendors we can create a hashmap that allow us to sum up amounts based on the vendor
  // Then we can also vendor's last transaction

  let transactions = await getNormalizedTransactions({});

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  const vendors: Map<
    string,
    {
      amount: number;
      transactionDate: string;
    }
  > = new Map();

  transactions.forEach((t) => {
    const current = vendors.get(t.vendor) ?? {
      amount: 0,
      transactionDate: "",
    };

    let latestTransaction: string = current.transactionDate;
    // Check if the new transaction's date is earliest than current
    if (
      !current.transactionDate ||
      new Date(t.date).getDate() < new Date(current.transactionDate).getDate()
    )
      latestTransaction = t.date;

    vendors.set(t.vendor, {
      amount: current.amount + t.amount,
      transactionDate: latestTransaction,
    });
  });

  // Then convert into array, sort by highest value and get top vendors

  const vendorsArray: [string, { amount: number; transactionDate: string }][] =
    Array.from(vendors);
  const sorted = vendorsArray.sort((a, b) => b[1].amount - a[1].amount);

  const topVendors = sorted.slice(0, 5);

  return topVendors;
};

export const getTopSpenders = async () => {
  // Here we need to join the total spending (either cashIn or cashOut) to know which person
  // has been the one that flow the most cash

  let transactions = await getNormalizedTransactions({});

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  const spender = new Map();

  transactions.forEach((t) => {
    spender.set(
      t.authorizedBy,
      (spender.get(t.authorizedBy) ?? 0) + Math.abs(t.amount),
    );
  });

  // Then convert into array, sort by highest value and get top spender

  const spenderArray: [string, number][] = Array.from(spender);
  const sorted = spenderArray.sort((a, b) => b[1] - a[1]);

  const topSpender = sorted; // We want to display all spender for better look

  return topSpender;
};
export const getTopCategories = async () => {
  // Same approach as vendor but for category

  let transactions = await getNormalizedTransactions({});

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  const categories = new Map();

  transactions.forEach((t) => {
    categories.set(t.category, (categories.get(t.category) ?? 0) + t.amount);
  });

  // Then convert into array, sort by highest value and get top categories

  const categoriesArray: [string, number][] = Array.from(categories);
  const sorted = categoriesArray.sort((a, b) => b[1] - a[1]);

  const topCategories = sorted.slice(0, 5);

  return topCategories;
};

export const getVendorCount = async () => {
  // In this case we can use Set because automatically ignore duplicates and then we return its size

  const transactions = await getNormalizedTransactions({});
  const vendors = new Set();

  transactions.forEach((t) => {
    vendors.add(t.vendor);
  });

  return vendors.size;
};

export const getBankAccountBalance = async (bank: string) => {
  /*
    To get bank account balance is different for each bank

    - BoA is easier to implement because it has runningBalance in each of the transactions
      so we only require to get the latest transaction's date of that month and get the running balance

    - Amex has no per-transaction balance, but the full response carries
      `statementPeriod.closingBalance` (the amount owed after the statement
      period closes). We use it as an base data to subtract the total net flow
      across all months to derive the balance before the first transaction,
      then accumulate forward month by month.

    - Chase has no per-transaction balance either. Same approach using
      `account.currentBalance`.
  */

  let transactions = await getNormalizedTransactions({ bank });

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  // BoA
  // Real running balance is available per transaction in source, no need to accumulate manually
  if (bank === "boa") {
    const monthlyEndBalance = new Map<string, number>();
    const monthlyFlow = new Map<string, number>();

    transactions.forEach((t) => {
      const yearMonth = t.date.slice(0, 7); // YYYY-MM
      const src = t.source as unknown as TransactionList;

      // Capture the first occurrence per month
      // to get the end-of-month running balance.
      if (!monthlyEndBalance.has(yearMonth)) {
        monthlyEndBalance.set(yearMonth, src.runningBalance);
      }

      // BoA amounts are always positive so we need to know the type
      const signedAmount = t.type === "credit" ? t.amount : -t.amount;
      monthlyFlow.set(
        yearMonth,
        (monthlyFlow.get(yearMonth) ?? 0) + signedAmount,
      );
    });

    return Array.from(monthlyEndBalance.keys())
      .sort()
      .map((month) => ({
        month,
        balance: monthlyEndBalance.get(month)!,
        monthlyFlow: monthlyFlow.get(month) ?? 0,
      }));
  }

  // Amex & Chase
  const monthlyFlow = new Map<string, number>();

  transactions.forEach((t) => {
    const yearMonth = t.date.slice(0, 7); // YYYY-MM
    monthlyFlow.set(yearMonth, (monthlyFlow.get(yearMonth) ?? 0) + t.amount);
  });

  const months = Array.from(monthlyFlow.keys()).sort();
  const totalFlow = months.reduce(
    (sum, m) => sum + (monthlyFlow.get(m) ?? 0),
    0,
  );

  // Fetch the bank's reported final balance to use as the anchor point
  let seedBalance = 0;

  if (bank === "amex") {
    const raw = await getAmexData();
    seedBalance = raw.statementPeriod.closingBalance;
  } else if (bank === "chase") {
    const raw = await getChaseData();
    seedBalance = raw.account.currentBalance;
  }

  // Work backwards from the known ending balance to find where we started,
  // then roll forward month by month.
  let balance = seedBalance - totalFlow;

  return months.map((month) => {
    const flow = monthlyFlow.get(month) ?? 0;
    balance += flow;
    return {
      month,
      balance,
      monthlyFlow: flow,
    };
  });
};

export const getCashFlow = async () => {
  // Here we store all debit and all credit type happend in the month with every transaction

  let transactions = await getNormalizedTransactions({});

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  const debit = new Map();
  const credit = new Map();

  transactions.forEach((t) => {
    const yearMonth = t.date.slice(0, 7); // YYYY-MM

    if (t.type === "debit")
      debit.set(yearMonth, (debit.get(yearMonth) ?? 0) + t.amount);

    if (t.type === "credit")
      credit.set(yearMonth, (credit.get(yearMonth) ?? 0) + t.amount);
  });

  return {
    debit: Array.from(debit),
    credit: Array.from(credit),
  };
};
