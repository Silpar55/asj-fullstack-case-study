/* The idea of normalization would be the following:

    - Create formatters for each bank data
    - Return promise.all to keep them as promise
    - Execute each of them in parallel for better performance

*/
import { AmexTransaction } from "@/interfaces/banks/amex";
import { BoaTransaction } from "@/interfaces/banks/boa";
import { ChaseTransaction } from "@/interfaces/banks/chase";
import { BankType, NormalizedTransaction } from "@/interfaces/banks/normalized";
import { getAmexData, getBoaData, getChaseData } from "@/lib/db/banks";
import { getUsers } from "@/lib/db/users";

interface Props {
  bank?: string;
  authorizedBy?: string;
  amount?: string;
  fromDate?: string;
}

export const formatAmex = (
  data: AmexTransaction,
): Promise<NormalizedTransaction[]> => {
  return Promise.all(
    data.data.charges.map(async (charge) => {
      return {
        id: charge.chargeId,
        date: charge.transactionDate,
        postDate: charge.postDate,
        description: charge.memo || charge.merchant.name,
        amount: charge.amountInCents / 100,
        currency: charge.billingCurrency,
        type: charge.amountInCents >= 0 ? "debit" : "credit",
        category: charge.merchant.category,
        vendor: charge.merchant.name,
        bank: "amex" as BankType,
        authorizedBy: charge.employee.name,
        status: charge.status.toLowerCase() as
          | "pending"
          | "posted"
          | "failed"
          | "other",
        source: charge,
      };
    }),
  );
};

export const formatBoa = (
  data: BoaTransaction,
): Promise<NormalizedTransaction[]> => {
  return Promise.all(
    data.transactionList.map(async (transaction) => {
      return {
        id: transaction.id,
        date: transaction.transactionDate,
        postDate: transaction.postedDate,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currencyCode,
        type: transaction.debitCreditMemo.toLowerCase() as "debit" | "credit",
        category: transaction.spendingCategory,
        vendor: transaction.payee,
        bank: "boa" as BankType,
        authorizedBy: transaction.originator.name,
        status: transaction.status.toLowerCase() as
          | "pending"
          | "posted"
          | "failed"
          | "other",
        balance: transaction.runningBalance,
        source: transaction,
      };
    }),
  );
};

export const formatChase = (
  data: ChaseTransaction,
): Promise<NormalizedTransaction[]> => {
  return Promise.all(
    data.transactions.map(async (transaction) => {
      return {
        id: transaction.transactionId,
        date: transaction.transactionDate,
        postDate: transaction.postingDate,
        description: transaction.description,
        amount:
          (transaction.transactionType.toLowerCase() as "debit" | "credit") ===
          "credit"
            ? transaction.amount
            : -transaction.amount,
        currency: transaction.currency,
        type: transaction.transactionType.toLowerCase() as "debit" | "credit",
        category: transaction.categoryName,
        vendor: transaction.merchantName,
        bank: "chase" as BankType,
        authorizedBy: transaction.initiatedBy.name,
        status: transaction.pending ? "pending" : "posted",
        balance: data.account.currentBalance,
        source: transaction,
      };
    }),
  );
};

export const combineNormalizedTransactions = async (
  amexRaw: AmexTransaction,
  boaRaw: BoaTransaction,
  chaseRaw: ChaseTransaction,
) => {
  const [amex, boa, chase] = await Promise.all([
    formatAmex(amexRaw),
    formatBoa(boaRaw),
    formatChase(chaseRaw),
  ]);

  const combinedTransactions = [...amex, ...boa, ...chase];

  return combinedTransactions;
};

export const sortTransactionsByEarliest = (
  transactions: NormalizedTransaction[],
) => {
  // "Results should always be sorted earliest date first."
  transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return transactions;
};

export const getTransactionsByUserId = async (
  transactions: NormalizedTransaction[],
  userId: string,
) => {
  const usersData = await getUsers();
  // Extract user name by userId

  const user = usersData.users.filter(({ id }) => userId == id);

  if (user.length > 0) {
    const result = transactions.filter(
      (transaction) => transaction.authorizedBy === user[0].name,
    );

    return result;
  } else return transactions;
};

export const getTransactionsByAmount = async (
  transactions: NormalizedTransaction[],
  amount: string,
) => {
  const result = transactions.filter(
    (transaction) => transaction.amount >= +amount,
  );
  return result;
};

export const getTransactionsByFromDate = async (
  transactions: NormalizedTransaction[],
  fromDate: string,
) => {
  const result = transactions.filter(
    (transactions) => new Date(transactions.date) >= new Date(fromDate),
  );

  return result;
};

export const getTransactionById = async (id: string) => {
  const normalizedTransactions = await getNormalizedTransactions({});

  const result = normalizedTransactions.filter(
    (transaction) => transaction.id === id,
  );
  return result;
};

export const getNormalizedTransactions = async ({
  bank = "",
  authorizedBy = "",
  amount = "",
  fromDate = "",
}: Props) => {
  let normalizedTransactions: NormalizedTransaction[];

  // Handling bank query
  switch (bank) {
    case "amex":
      normalizedTransactions = await formatAmex(await getAmexData());
      break;
    case "boa":
      normalizedTransactions = await formatBoa(await getBoaData());
      break;
    case "chase":
      normalizedTransactions = await formatChase(await getChaseData());
      break;
    default:
      // If there is no bank query or the bank name is incorrect, it means we will retrieve all banks
      // Retrieve all 3 banks transactions. For better performance at the same time
      const [amexRaw, boaRaw, chaseRaw] = await Promise.all([
        getAmexData(),
        getBoaData(),
        getChaseData(),
      ]);

      normalizedTransactions = await combineNormalizedTransactions(
        amexRaw,
        boaRaw,
        chaseRaw,
      );
      break;
  }

  // Handling authorizedBy query
  if (authorizedBy)
    normalizedTransactions = await getTransactionsByUserId(
      normalizedTransactions,
      authorizedBy,
    );

  // Handling amount query

  if (amount)
    normalizedTransactions = await getTransactionsByAmount(
      normalizedTransactions,
      amount,
    );

  // Handling fromDate
  if (fromDate)
    normalizedTransactions = await getTransactionsByFromDate(
      normalizedTransactions,
      fromDate,
    );

  // Sort them by earliest date first
  normalizedTransactions = sortTransactionsByEarliest(normalizedTransactions);

  return normalizedTransactions;
};
