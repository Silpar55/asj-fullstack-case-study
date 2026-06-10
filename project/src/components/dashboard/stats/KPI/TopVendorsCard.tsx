import { getTopVendors } from "@/lib/api/kpi";
import useSWR from "swr";
import Spinner from "../../Spinner";
import { formatDate } from "@/lib/utils/formatRows";
import { formatCash } from "@/lib/utils/formatStats";

const TopVendorsCard = () => {
  const { data, error, isLoading } = useSWR("vendors", () => getTopVendors());

  console.log(data);

  return (
    <div className="w-full h-full flex flex-col border-2 border-gray-700 rounded-t-md p-5">
      <h1 className="uppercase text-dashboard-color text-2xl font-semibold">
        Top 4 paid vendors
      </h1>

      {isLoading && <Spinner />}
      {!isLoading && (
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
                <tr
                  key={vendor[0]}
                  className="text-sm border-b border-gray-500"
                >
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
      )}
    </div>
  );
};

export default TopVendorsCard;
