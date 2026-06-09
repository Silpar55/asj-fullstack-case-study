export interface ChaseTransaction {
  status: string;
  requestId: string;
  account: Account;
  transactions: Transaction[];
  pagination: Pagination;
}

export interface Account {
  accountId: string;
  accountType: string;
  maskedAccountNumber: string;
  displayName: string;
  currency: string;
  currentBalance: number;
  availableBalance: number;
  asOfDate: string;
}

export interface Transaction {
  transactionId: string;
  postingDate: string;
  transactionDate: string;
  description: string;
  amount: number;
  transactionType: string;
  categoryCode: string;
  categoryName: string;
  merchantName: string;
  initiatedBy: InitiatedBy;
  pending: boolean;
  currency: string;
  originalAmount: number;
}

export interface InitiatedBy {
  name: string;
  department: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}
