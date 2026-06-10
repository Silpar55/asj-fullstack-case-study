/* 
File created by AI at combining the following: 
    - amex, boa and chase transaction type extracted from their json files 
    - minimun requirements for the normalized transaction
*/

import { AmexTransaction, Charge } from "./amex";
import { BoaTransaction, TransactionList } from "./boa";
import { ChaseTransaction, Transaction } from "./chase";

// Define the Bank Enum/Type for strict type checking
export type BankType = "chase" | "boa" | "amex";

// Define the Transaction Type for money in vs money out
export type TransactionType = "debit" | "credit";

// Represents the schema of the users stored in user.json
export interface User {
  id: string;
  name: string;
  department?: string;
  email?: string;
}

// The union type of all possible raw transaction sources
export type RawTransactionSource = Charge | TransactionList | Transaction;

export interface NormalizedTransaction {
  /** A unique identifier for the transaction */
  id: string;

  /** The date the transaction was initiated */
  date: string;

  /** What the transaction was for (memo/description) */
  description: string;

  /** The value of the transaction (typically as an absolute value or decimal) */
  amount: number;

  /** The original 3-letter currency code (e.g. "USD", "EUR") */
  currency: string;

  /** Whether the transaction is money out (debit) or money in (credit) */
  type: TransactionType;

  /** The standardized spending category (e.g. "Software", "Payroll") */
  category: string;

  /** The merchant or payee name */
  vendor: string;

  /** Which bank this transaction originated from */
  bank: BankType;

  /** The user who initiated the transaction (resolved from user.json) */
  authorizedBy: User | null | string;

  /** The original raw object from the bank (used for the detail modal) */
  source: Transaction | TransactionList | Charge;

  // --- Recommended Additions ---

  /** * The date the transaction actually posted/cleared the account.
   * Useful because reconciliation relies on post dates, not just transaction dates.
   */
  postDate?: string;

  balance?: number;

  /** * The current status of the transaction.
   * Useful for UIs to grey-out or flag 'pending' transactions vs 'posted' ones.
   */
  status: "pending" | "posted" | "failed" | "other";
}
