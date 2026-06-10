import { barlow } from "@/app/fonts";
import { getTotalCashIn } from "@/lib/api/kpi";
import { formatCash } from "@/lib/utils/formatStats";
import useSWR from "swr";

const fetcher = () => getTotalCashIn();

const CashInCard = () => {
  const { data, error, isLoading } = useSWR("get-total-cash-in", fetcher);

  return (
    <div
      className={`p-3 bg-nav w-1/2 rounded-lg text-center flex flex-col justify-center ${barlow.className}`}
    >
      {!error && (
        <>
          <h1 className="text-5xl text-green-700 font-light">
            {!isLoading && formatCash(data as number)}
            {error && "- -"}
          </h1>
          <p className="text-xl mt-5 uppercase font-bold">Cash In</p>
        </>
      )}
    </div>
  );
};

export default CashInCard;
