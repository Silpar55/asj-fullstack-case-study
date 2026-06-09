import { getAmexData, getBoaData, getChaseData } from "../db/banks";
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
      value: user.name.split(" ").join("_"),
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
