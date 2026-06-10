"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

import LastUpdated from "@/components/dashboard/LastUpdated";
import { inter, barlow } from "@/app/fonts";
import { UserLS } from "@/interfaces/auth/userLS";
import { hasAccess } from "@/lib/api/rabc";
import { getUser } from "@/lib/api/auth";
import { Table } from "@/components/dashboard/transactions/Table";
import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import TableFilters from "@/components/dashboard/transactions/TableFilters";
import {
  getTransactionsByAuthBy,
  getTransactionsByBank,
  getTransactionsByBankAcc,
  getTransactionsByDate,
  unifiedCurrencies,
} from "@/lib/api/table";
import { Modal } from "@/components/dashboard/transactions/Modal";
import Spinner from "@/components/dashboard/Spinner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Transactions() {
  // RABC Logic
  // Note: putting "use client" in a page breaks the server components principle, however is necessary for local storage
  // The best practice would be the use of cookies and middleware to handle RABC while keeping pages as server components
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/transactions", fetcher);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // filters
  const [filters, setFilters] = useState({
    bank: "all",
    authBy: "all",
    currency: "all",
    bankAcc: "all",
    date: "",
  });

  const [filteredTransactions, setFilteredTransactions] = useState<
    NormalizedTransaction[]
  >([]);

  const [transactionToShow, setTransactionToShow] =
    useState<NormalizedTransaction | null>(null);

  useEffect(() => {
    if (!data) {
      setFilteredTransactions([]);
      return;
    }

    const applyFilters = async () => {
      let filteredData: NormalizedTransaction[] = data;

      filteredData = getTransactionsByBank(filteredData, filters.bank);
      filteredData = getTransactionsByAuthBy(filteredData, filters.authBy);
      filteredData = getTransactionsByBankAcc(filteredData, filters.bankAcc);
      filteredData = await unifiedCurrencies(
        filteredData,
        filters.currency as "USD" | "CAD" | "EUR" | "GBP" | "all",
      );
      filteredData = getTransactionsByDate(filteredData, filters.date);

      setFilteredTransactions(filteredData);
    };

    applyFilters();
  }, [data, filters]);

  useEffect(() => {
    const user: UserLS = getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    /* We require to know at least one allowed tab is allowed, 
      since login/ and dashboard/ redirects always to transactions tab, 
      we require to handle uses cases when user cannot enter that tab.
      Therefore the easiest solution to redirect to the first allowed tab
    */

    if (!hasAccess(user, "transactions")) {
      router.push(`/dashboard/${user.allowedTabs[0]}`);
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // To prevent UI of flashing while checking localStorage
  if (!isAuthorized || isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center align-middle">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="w-full h-screen flex justify-center items-center align-middle">
        <h1 className="text-white text-2xl">Error loading transactions</h1>
      </div>
    );

  return (
    <main
      className={`${inter.className} text-dashboard-color w-full flex flex-col p-5`}
    >
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Transaction Details"
        transaction={transactionToShow}
      />

      <div className={`${barlow.className}`}>
        <LastUpdated />
        <h1 className="uppercase text-4xl mb-5">Transactions</h1>
      </div>

      {/* Table filters */}
      <TableFilters
        filters={filters}
        setFilters={setFilters}
        transactions={filteredTransactions as NormalizedTransaction[]}
      />

      {/* Table */}
      <section className="uppercase flex w-full ml-2 mt-5 ">
        <h1 className="w-20 text-center border-b-2 border-accent-blue font-semibold">
          All
        </h1>
        <h1 className="w-32 text-center font-semibold">Starred (97)</h1>
      </section>
      <Table
        transactions={filteredTransactions as NormalizedTransaction[]}
        setTransactionToShow={setTransactionToShow}
        setIsModalOpen={setIsModalOpen}
      />
    </main>
  );
}
