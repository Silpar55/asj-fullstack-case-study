"use client";
import { getCashFlow } from "@/lib/api/kpi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";

const formatMonthYear = (yearMonth: string) => {
  const [year, month] = yearMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatAxisDollar = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const formatFullDollar = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const CustomTick = (props: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) => {
  const { x = 0, y = 0, payload } = props;
  if (!payload?.value) return null;

  const [year, month] = payload.value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  const monthLabel = date.toLocaleDateString("en-US", { month: "short" });

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#9ca3af" fontSize={11}>
        <tspan x={0} dy={0}>
          {monthLabel}
        </tspan>
        <tspan x={0} dy={14}>
          {year}
        </tspan>
      </text>
    </g>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="bg-nav border border-gray-700 rounded-lg px-4 py-3 shadow-xl text-xs min-w-[180px]">
      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-2">
        {formatMonthYear(label)}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex justify-between gap-6 mb-1 last:mb-0"
        >
          <span style={{ color: entry.color }} className="font-medium">
            {entry.dataKey === "cashIn" ? "Cash In" : "Cash Out"}
          </span>
          <span className="font-bold text-white">
            {formatFullDollar(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// Merge the two [month, amount][] arrays into one flat array recharts can consume.
const mergeData = (debit: [string, number][], credit: [string, number][]) => {
  const monthMap = new Map<string, { cashIn: number; cashOut: number }>();

  credit.forEach(([month, amount]) => {
    const entry = monthMap.get(month) ?? { cashIn: 0, cashOut: 0 };
    entry.cashIn = Math.abs(amount);
    monthMap.set(month, entry);
  });

  debit.forEach(([month, amount]) => {
    const entry = monthMap.get(month) ?? { cashIn: 0, cashOut: 0 };
    entry.cashOut = Math.abs(amount);
    monthMap.set(month, entry);
  });

  return Array.from(monthMap.keys())
    .sort()
    .map((month) => ({ month, ...monthMap.get(month)! }));
};

const CashFlow = () => {
  const { data, isLoading } = useSWR("cashflow", () => getCashFlow());

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 text-sm">
        Loading…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  const chartData = mergeData(data.debit, data.credit);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 16, right: 24, left: 10, bottom: 0 }}
        barCategoryGap="30%"
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#374151"
          vertical={false}
        />

        <XAxis
          xAxisId={0}
          dataKey="month"
          tick={<CustomTick />}
          tickMargin={10}
          axisLine={{ stroke: "#374151" }}
          tickLine={false}
          interval="preserveStartEnd"
        />

        <XAxis xAxisId={1} dataKey="month" hide />

        <YAxis
          tickFormatter={formatAxisDollar}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={72}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />

        <Legend
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "12px",
            color: "#9ca3af",
          }}
          formatter={(value: string) =>
            value === "cashIn" ? "Cash In" : "Cash Out"
          }
        />

        <Bar
          xAxisId={0}
          dataKey="cashIn"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
          barSize={10}
        />

        <Bar
          xAxisId={0}
          dataKey="cashOut"
          fill="#dc2626"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
          barSize={10}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashFlow;
