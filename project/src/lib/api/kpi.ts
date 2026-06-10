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

export const getTopVendor = async () => {
  // To get top vendors we can create a hashmap that allow us to sum up amounts based on the vendor

  let transactions = await getNormalizedTransactions({});

  // Convert all amount in USD
  transactions = await unifiedCurrencies(transactions, "USD");

  const vendors = new Map();

  transactions.forEach((t) => {
    vendors.set(t.vendor, (vendors.get(t.vendor) ?? 0) + t.amount);
  });

  // Then convert into array, sort by highest value and get top vendors

  const vendorsArray: [string, number][] = Array.from(vendors);
  const sorted = vendorsArray.sort((a, b) => b[1] - a[1]);

  const topVendors = sorted.slice(0, 5);

  return topVendors;
};

export const getTopCategory = async () => {
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
