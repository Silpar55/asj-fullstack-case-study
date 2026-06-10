import { Rates } from "@/interfaces/rates";

export const convertRates = (
  from: "USD" | "CAD" | "EUR" | "GBP",
  to: "USD" | "CAD" | "EUR" | "GBP",
  amount: number,
  rates: Rates,
) => {
  return (amount * rates[from]) / rates[to];
};
