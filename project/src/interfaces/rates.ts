export interface RatesData {
  note: string;
  base: string;
  asOf: string;
  rates: Rates;
}

export interface Rates {
  USD: number;
  EUR: number;
  GBP: number;
  CAD: number;
}
