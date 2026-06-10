import { getTopCategories, getTotalCashIn } from "@/lib/api/kpi";
import useSWR from "swr";
import Spinner from "../../../Spinner";
import AnimatedBar from "./AnimatedBar";
import { formatCash } from "@/lib/utils/formatStats";

const TopCategories = () => {
  const { data: categories, isLoading: categoriesLoading } = useSWR(
    "get-top-categories",
    () => getTopCategories(),
  );
  const { data: cashIn, isLoading: cashInLoading } = useSWR("cash-in", () =>
    getTotalCashIn(),
  );

  const calculatePercentage = (total: number, spend: number) => {
    if (!total) return 0;
    return (spend / total) * 100;
  };

  if (cashInLoading || categoriesLoading) return <Spinner />;

  return (
    <section className="mt-5 flex flex-col gap-4">
      {categories?.map((cat) => {
        const percentage = calculatePercentage(cashIn as number, cat[1]);

        return (
          <div key={cat[0]}>
            <div className="flex justify-between items-end">
              <h2 className="text-lg font-semibold">{cat[0]}</h2>
              <h2 className="text-sm font-semibold text-green-300">
                {formatCash(cat[1])}
              </h2>
            </div>
            <AnimatedBar percentage={percentage} />
          </div>
        );
      })}
    </section>
  );
};

export default TopCategories;
