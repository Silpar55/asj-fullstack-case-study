export interface AmexTransaction {
  cardMember: CardMember;
  statementPeriod: StatementPeriod;
  data: Data;
}

export interface CardMember {
  accountToken: string;
  cardType: string;
  last5: string;
  memberSince: string;
  currency: string;
  cardholderName: string;
  companyName: string;
}

export interface StatementPeriod {
  start: string;
  end: string;
  closingBalance: number;
  minimumPaymentDue: number;
  paymentDueDate: string;
}

export interface Data {
  charges: Charge[];
}

export interface Charge {
  chargeId: string;
  transactionDate: string;
  postDate: string;
  merchant: Merchant;
  amountInCents: number;
  amountDisplay: string;
  type: string;
  status: string;
  rewardEligible: boolean;
  memo: string;
  employee: Employee;
  billingCurrency: string;
  originalAmountInCents: number;
}

export interface Merchant {
  name: string;
  category: string;
  categoryCode: string;
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  name: string;
  department: string;
}
