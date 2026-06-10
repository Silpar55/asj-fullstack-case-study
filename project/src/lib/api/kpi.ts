// Here I will hold the logic of all the KPI displayed in the stats dashboard

import { getNormalizedTransactions } from "./normalize";
import { unifiedCurrencies } from "./table";

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
