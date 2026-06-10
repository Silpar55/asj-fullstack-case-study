"use client";
import { getBankAccountBalance } from "@/lib/api/kpi";
import useSWR from "swr";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addAngleAxis } from "recharts/types/state/polarAxisSlice";

interface Props {
  bank: string;
}

const formatMonthYear = (yearMonth: string) => {
  console.log(yearMonth);
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

const CustomTick = (props: any) => {
  const { x, y, payload } = props;

  const [year, month] = payload.value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
  const yearLabel = date.getFullYear();

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#9ca3af" fontSize={11}>
        <tspan x={0} dy={0}>
          {monthLabel}
        </tspan>
        <tspan x={0} dy={14}>
          {yearLabel}
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
      <p className="text-gray-400 font-semibold uppercase break-words tracking-wider mb-2">
        {formatMonthYear(label)}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex justify-between gap-6 mb-1 last:mb-0"
        >
          <span style={{ color: entry.color }} className="font-medium">
            {entry.dataKey === "monthlyFlow" ? "Monthly Flow" : "Balance"}
          </span>
          <span className="font-bold text-white">
            {formatFullDollar(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const BankAccBalance = ({ bank }: Props) => {
  // Include bank in the SWR key so the chart refetches when the dropdown changes
  const { data, isLoading } = useSWR(["balance", bank], () =>
    getBankAccountBalance(bank),
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 text-sm">
        Loading…
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  // Used AI for improving visualization of the charts for not to do an extensive research in how to style it perfect using recharts
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 16, right: 24, left: 10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#374151"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={<CustomTick />}
          tickMargin={10}
          axisLine={{ stroke: "#374151" }}
          tickLine={false}
          interval="preserveStartEnd"
        />

        <YAxis
          tickFormatter={formatAxisDollar}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={72}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "12px",

            color: "#9ca3af",
          }}
          formatter={(value: string) =>
            value === "monthlyFlow" ? "Monthly Flow" : "Balance"
          }
        />

        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 2" />

        <Line
          type="monotone"
          dataKey="balance"
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: "#2563eb", strokeWidth: 0 }}
        />

        <Line
          type="monotone"
          dataKey="monthlyFlow"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BankAccBalance;
