// formatRows.ts

import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import { TransactionRow } from "@/interfaces/banks/transactionRow";

const currencyFormatters = {
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }),
  CAD: new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }),
  EUR: new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }),
  GBP: new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }),
};

export const formatCurrency = (amount: number, currency: string) => {
  const formatter =
    currencyFormatters[currency as keyof typeof currencyFormatters];

  if (!formatter) {
    return `${currency} ${amount.toFixed(2)}`;
  }

  return formatter.format(amount);
};

const formatAuthorizedBy = (
  authorizedBy: NormalizedTransaction["authorizedBy"],
) => {
  if (!authorizedBy) return "Unknown";

  if (typeof authorizedBy === "string") {
    return authorizedBy;
  }

  return authorizedBy.name;
};

export const formatDate = (date: string) => {
  const newDate = new Date(date + "T00:00:00");

  const formatted = newDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return formatted;
};

const getOrdinal = (n: number) => {
  if (n > 3 && n < 21) return "th";

  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const buildBankAcc = (transaction: NormalizedTransaction) => {
  const lastDigits = transaction.id.split("-");
  const lastIndex = lastDigits.length - 1;

  return `${transaction.bank}  ****${lastDigits[lastIndex]}`;
};

const formatRow = (transaction: NormalizedTransaction): TransactionRow => {
  return {
    id: transaction.id,
    title: `${transaction.type.toUpperCase()} ${transaction.vendor}`,
    currency: transaction.currency,
    amount: formatCurrency(transaction.amount, transaction.currency),
    date: formatDate(transaction.date),
    category: transaction.category,
    bankAcc: buildBankAcc(transaction),
    authorizedBy: formatAuthorizedBy(transaction.authorizedBy),
    vendor: transaction.vendor,
  };
};

export const formatRows = (
  transactions: NormalizedTransaction[],
): TransactionRow[] => {
  return transactions.map(formatRow);
};
