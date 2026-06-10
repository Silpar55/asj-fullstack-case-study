"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import { getUsers } from "@/lib/db/users";
import { formatRows } from "@/lib/utils/formatRows";
import ToolTip from "./ToolTip";
import Spinner from "@/components/dashboard/Spinner";

const PAGE_SIZE = 30;

interface Props {
  transactions: NormalizedTransaction[];
  setTransactionToShow: (t: NormalizedTransaction) => void;
  setIsModalOpen: (open: boolean) => void;
  starredIds: Set<string>;
  toggleStar: (id: string) => void;
}

const fetcher = () => getUsers();

export const Table = ({
  transactions,
  setTransactionToShow,
  setIsModalOpen,
  starredIds,
  toggleStar,
}: Props) => {
  const { data, isLoading } = useSWR("get-users", fetcher);
  const [page, setPage] = useState(0);

  // Reset to page 0 whenever the transaction list changes (filter applied / tab switched)
  useEffect(() => {
    setPage(0);
  }, [transactions]);

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = transactions.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );
  const formattedRows = formatRows(paginated);

  const findUserByName = (name: string) =>
    data?.users.find((u) => u.name === name) ?? null;

  if (isLoading) {
    return (
      <section className="max-h-[750px] min-h-[750px] flex items-center justify-center bg-nav rounded-xl p-5 w-max min-w-full">
        <Spinner />
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="max-h-[750px] min-h-[750px] flex items-center justify-center bg-nav rounded-xl p-5 w-max min-w-full">
        <p className="text-gray-500 text-sm uppercase tracking-widest">
          No transactions found
        </p>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="max-h-[680px] min-h-[680px] overflow-y-auto scroll-m-0 bg-nav rounded-xl p-5 w-max min-w-full">
        <table className="text-center mx-auto w-full">
          <thead>
            <tr className="grid grid-cols-[50px_.75fr_.5fr_.5fr_.5fr_.5fr_.5fr_.5fr] items-center uppercase text-white font-bold mb-2">
              <th></th>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Bank Acc.</th>
              <th>Authorized By</th>
              <th>Vendor</th>
            </tr>
          </thead>
          <tbody>
            {formattedRows.map((t, index) => {
              const raw = paginated[index];
              const isStarred = starredIds.has(raw.id);

              return (
                <tr
                  key={t.id}
                  onClick={() => {
                    setTransactionToShow(raw);
                    setIsModalOpen(true);
                  }}
                  className="cursor-pointer grid grid-cols-[50px_.75fr_.5fr_.5fr_.5fr_.5fr_.5fr_.5fr] items-center bg-dashboard-bg py-4 rounded-md border-b border-dotted"
                >
                  <th
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(raw.id);
                    }}
                    className="flex justify-end"
                  >
                    {isStarred ? (
                      <svg
                        className="w-5 h-5 text-yellow-400 transition-colors"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-500 hover:text-yellow-400 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    )}
                  </th>

                  <td>{t.title}</td>
                  <td>
                    {t.currency} {t.amount}
                  </td>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td className="uppercase">{t.bankAcc}</td>
                  <td className="relative group">
                    <span>{t.authorizedBy as string}</span>
                    <ToolTip user={findUserByName(t.authorizedBy)} />
                  </td>
                  <td>{t.vendor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-sm text-gray-400">
          <span className="text-xs">
            {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, transactions.length)} of{" "}
            {transactions.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded border border-gray-700 disabled:opacity-30 hover:bg-white/5 transition-colors uppercase text-xs font-semibold"
            >
              Prev
            </button>
            <span className="text-xs">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 rounded border border-gray-700 disabled:opacity-30 hover:bg-white/5 transition-colors uppercase text-xs font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
