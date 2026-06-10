import { getTopSpenders, getTotalCashIn, getTotalCashOut } from "@/lib/api/kpi";
import useSWR from "swr";
import SpenderAnimatedBar from "./SpenderAnimatedBar";
import Spinner from "@/components/dashboard/Spinner";

const colors = [
  { bg: "bg-green-500", text: "text-green-500" },
  { bg: "bg-purple-500", text: "text-purple-500" },
  { bg: "bg-orange-500", text: "text-orange-500" },
  { bg: "bg-yellow-500", text: "text-yellow-500" },
  { bg: "bg-blue-500", text: "text-blue-500" },
  { bg: "bg-indigo-500", text: "text-indigo-500" },
];
const TopSpender = () => {
  const { data: cashIn, isLoading: cashInIsLoading } = useSWR("cash-in", () =>
    getTotalCashIn(),
  );
  const { data: cashOut, isLoading: cashOutIsLoading } = useSWR(
    "cash-out",
    () => getTotalCashOut(),
  );
  const { data: spenders, isLoading: spenderIsLoading } = useSWR(
    "spenders",
    () => getTopSpenders(),
  );

  const totalSpending = (cashIn as number) - (cashOut as number);
  let percentages: {
    percentage: number;
    color: string;
  }[] = [];

  const accPercentages = (amount: number, color: string) => {
    if (!totalSpending) return 0;

    percentages.push({
      percentage: (amount / totalSpending) * 100,
      color,
    });
  };

  if (cashInIsLoading || cashOutIsLoading || spenderIsLoading) {
    return <Spinner />;
  }
  return (
    <section className="mt-2">
      <SpenderAnimatedBar percentages={percentages} />
      <div className="flex gap-3 mt-2">
        {spenders?.map((spender, index) => {
          accPercentages(spender[1], colors[index % colors.length].bg);
          return (
            <div key={spender[0]} className="flex gap-2 items-center">
              <span
                className={`h-3 w-3 rounded-full ${colors[index % colors.length].bg}`}
              ></span>
              <span className={`${colors[index % colors.length].text} text-sm`}>
                {spender[0].split(" ")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopSpender;
