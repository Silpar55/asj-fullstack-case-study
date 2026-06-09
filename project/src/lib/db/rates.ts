import ratesData from "@/../data/rates.json";
import { RatesData } from "@/interfaces/rates";

export const getRates = async (): Promise<RatesData> => {
  return ratesData as RatesData;
};
