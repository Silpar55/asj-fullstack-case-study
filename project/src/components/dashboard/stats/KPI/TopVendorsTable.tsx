import { getTopVendors } from "@/lib/api/kpi";
import useSWR from "swr";
import Spinner from "../../Spinner";
import { formatDate } from "@/lib/utils/formatRows";
import { formatCash } from "@/lib/utils/formatStats";

const TopVendorsTable = () => {
  const { data, isLoading } = useSWR("vendors", () => getTopVendors());

  if (isLoading) return <Spinner />;

  return (
    <section className="p-5 w-full">
      <table className="w-full">
        <thead>
          <tr className="text-left uppercase text-md font-bold border-b border-gray-500">
            <th className="">Vendor</th>
            <th className="text-center">Last Transaction</th>
            <th className="text-center">Total</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((vendor) => (
            <tr key={vendor[0]} className="text-sm border-b border-gray-500">
              <td className="py-3 uppercase">{vendor[0]}</td>

              <td className="py-3 text-center">
                {formatDate(vendor[1].transactionDate)}
              </td>

              <td className="py-3 text-center">
                USD ${formatCash(vendor[1].amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TopVendorsTable;
