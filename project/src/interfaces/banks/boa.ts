export interface BoaTransaction {
  responseStatus: ResponseStatus;
  accountSummary: AccountSummary;
  transactionList: TransactionList[];
}

export interface ResponseStatus {
  code: number;
  message: string;
  timestamp: string;
  traceId: string;
}

export interface AccountSummary {
  accountNumber: string;
  routingNumber: string;
  productType: string;
  productName: string;
  currencyCode: string;
  ledgerBalance: number;
  availableBalance: number;
  balanceAsOf: string;
}

export interface TransactionList {
  id: string;
  transactionDate: string;
  postedDate: string;
  payee: string;
  description: string;
  amount: number;
  debitCreditMemo: string;
  transactionType: string;
  spendingCategory: string;
  originator: Originator;
  currencyCode: string;
  originalAmount: number;
  runningBalance: number;
  status: string;
}

export interface Originator {
  name: string;
  department: string;
}
