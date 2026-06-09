// Here I call transactions json to reuse the logic in normalize transactions
import { AmexTransaction } from "@/app/interfaces/amex";
import { BoaTransaction } from "@/app/interfaces/boa";
import { ChaseTransaction } from "@/app/interfaces/chase";

import amexTransactions from "@/../data/transactions/amex.json";
import boaTransactions from "@/../data/transactions/boa.json";
import chaseTransactions from "@/../data/transactions/chase.json";

// In reality, we need asynchronous function for calling database.

export async function getAmexData(): Promise<AmexTransaction> {
  return amexTransactions as AmexTransaction;
}

export async function getBoaData(): Promise<BoaTransaction> {
  return boaTransactions as BoaTransaction;
}

export async function getChaseData(): Promise<ChaseTransaction> {
  return chaseTransactions as ChaseTransaction;
}
