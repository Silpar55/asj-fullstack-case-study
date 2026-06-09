import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import { getRates } from "../db/rates";
import { getUsers } from "../db/users";
import { getNormalizedTransactions } from "./normalize";

interface Props {
  name: string;
  value: string;
}

export const getBankOptions = () => {
  return [
    {
      name: "Amex",
      value: "amex",
    },
    {
      name: "BoA",
      value: "boa",
    },
    {
      name: "Chase",
      value: "chase",
    },

    {
      name: "All",
      value: "all",
    },
  ];
};

export const getAuthByOptions = async () => {
  const usersData = await getUsers();
  const options: Props[] = [];
  usersData.users.map((user) => {
    options.push({
      name: user.name,
      value: user.name,
    });
  });

  return options;
};

export const getCurrenciesOptions = async () => {
  const ratesData = await getRates();

  // I could hard coded I prefer keep the logic the same in every get options functions
  const options: Props[] = [];

  Object.keys(ratesData.rates).map((rate) => {
    options.push({
      name: rate,
      value: rate,
    });
  });

  return options;
};

// In this case there is a different logic since I have to handle duplicates
// I use Set to keep track on those acc that are already store in the option array

export const getBankAccOptions = async () => {
  const normalizedTransactions = await getNormalizedTransactions({});

  const seen = new Set<string>();

  const options: Props[] = [];

  for (const t of normalizedTransactions) {
    const parts = t.id.split("-");
    const option = parts[parts.length - 1];

    if (!seen.has(option)) {
      seen.add(option);
      options.push({
        value: option,
        name: option,
      });
    }
  }

  return options;
};
export const getOptions = async () => {
  return {
    bank: getBankOptions(),
    authBy: await getAuthByOptions(),
    currency: await getCurrenciesOptions(),
    bankAcc: await getBankAccOptions(),
  };
};

export const getTransactionsByBank = (
  transactions: NormalizedTransaction[],
  bank: string = "all",
) => {
  if (bank === "all") return transactions;

  return transactions.filter(
    (t) => t.bank.toLowerCase() === bank.toLowerCase(),
  );
};

export const getTransactionsByAuthBy = (
  transactions: NormalizedTransaction[],
  authBy: string = "all",
) => {
  if (authBy === "all") return transactions;

  return transactions.filter(
    (t) => (t.authorizedBy as string).toLowerCase() === authBy.toLowerCase(),
  );
};

export const getTransactionsByBankAcc = (
  transactions: NormalizedTransaction[],
  id: string = "all",
) => {
  if (id === "all") return transactions;

  return transactions.filter((t) => {
    const parts = t.id.split("-");
    const lastIndex = parts.length - 1;

    return parts[lastIndex] === id;
  });
};

export const getTransactionsByDate = (
  transactions: NormalizedTransaction[],
  date: string,
) => {
  if (!date) return transactions;

  return transactions.filter(
    (t) => new Date(t.date).getTime() >= new Date(date).getTime(),
  );
};

export const unifiedCurrencies = async (
  transactions: NormalizedTransaction[],
  currency: "USD" | "CAD" | "EUR" | "GBP" | "all",
) => {
  if (currency === "all") return transactions;

  const { rates } = await getRates();

  /* 
    My idea to unify the currencies is to start from the base of the rates.json
    Since the USD is the based of the rates.json I will normalized the transactions for USD since I know the value of each
    currencies against USD:
    Example: 
      Inter Currency amount * Inter Currency in USD 
      1000 CAD * 0.74USD => 740 USD

    After that we can divide the value given by the currency desired in their value at converting to USD

    For example: 
      Currency desired: GBP
      Transaction => 1000 CAD

      1 Step:
      1000 CAD * .74 USD => 740 USD

      2 Step:
      740 USD / 1.27 GBP => 582.67 GBP

    So the formula is the following

    (amount * rate[from -> USD]) / rate[target -> USD]
  */

  return transactions.map((t) => {
    return {
      ...t,
      currency: currency,
      amount:
        (t.amount * rates[t.currency as "USD" | "CAD" | "EUR" | "GBP"]) /
        rates[currency],
    };
  });
};
