// Here I call transactions json to reuse the logic in normalize transactions
import { AmexTransaction } from "@/interfaces/banks/amex";
import { BoaTransaction } from "@/interfaces/banks/boa";
import { ChaseTransaction } from "@/interfaces/banks/chase";

import amexTransactions from "@/../data/transactions/amex.json";
import boaTransactions from "@/../data/transactions/boa.json";
import chaseTransactions from "@/../data/transactions/chase.json";

// In reality, we need asynchronous function for calling database.

export function getBanksNames() {
  return ["amex", "boa", "chase"];
}

export async function getAmexData(): Promise<AmexTransaction> {
  return amexTransactions as AmexTransaction;
}

export async function getBoaData(): Promise<BoaTransaction> {
  return boaTransactions as BoaTransaction;
}

export async function getChaseData(): Promise<ChaseTransaction> {
  return chaseTransactions as ChaseTransaction;
}
