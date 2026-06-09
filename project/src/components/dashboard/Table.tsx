import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import { formatRows } from "@/lib/utils/formatRows";

interface Props {
  transactions: NormalizedTransaction[];
}

export const Table = ({ transactions }: Props) => {
  const formattedTransactions = formatRows(transactions);

  return (
    <section className="max-h-[750px] overflow-y-auto scroll-m-0 h-full bg-nav rounded-xl p-5 w-max min-w-full">
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
        <tbody className="">
          {formattedTransactions.map((t) => (
            <tr
              key={t.id}
              className="grid grid-cols-[50px_.75fr_.5fr_.5fr_.5fr_.5fr_.5fr_.5fr] items-center  bg-dashboard-bg py-4 rounded-md border-b border-dotted"
            >
              <th className="flex justify-end">
                <img src="/star.svg" alt="" className="w-6" />
              </th>
              <td>{t.title}</td>
              <td>
                {t.currency} {t.amount}
              </td>
              <td>{t.date}</td>
              <td>{t.category}</td>
              <td className="uppercase">{t.bankAcc}</td>
              <td>{t.authorizedBy as string}</td>
              <td>{t.vendor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
