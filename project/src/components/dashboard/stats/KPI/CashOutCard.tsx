import { barlow } from "@/app/fonts";
import { getTotalCashOut } from "@/lib/api/kpi";
import { formatCash } from "@/lib/utils/formatStats";
import useSWR from "swr";

const fetcher = () => getTotalCashOut();

const CashOutCard = () => {
  const { data, error, isLoading } = useSWR("get-total-cash-out", fetcher);

  return (
    <div
      className={`p-3 bg-nav w-1/2 rounded-lg text-center ${barlow.className}`}
    >
      {!error && (
        <>
          <h1 className="text-5xl text-red-700 font-light">
            {!isLoading && formatCash(data as number)}
            {error && "- -"}
          </h1>
          <p className="text-xl mt-5 uppercase font-bold">Cash Out</p>
        </>
      )}
    </div>
  );
};

export default CashOutCard;
