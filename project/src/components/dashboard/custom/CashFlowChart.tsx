"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartRow {
  period: string;
  cashIn?: number;
  cashOut?: number;
  cashInProj?: number;
  cashOutProj?: number;
}

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const fmtAxis = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length || !label) return null;
  const isProj = ["2026", "2027"].includes(label);
  return (
    <div className="bg-nav border border-gray-700 rounded-lg px-4 py-3 shadow-xl text-xs min-w-[200px]">
      <p className="text-gray-400 font-semibold uppercase tracking-wider mb-2">
        {label}
        {isProj && (
          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-yellow-500/20 text-yellow-400 font-bold">
            PROJECTED
          </span>
        )}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex justify-between gap-6 mb-1 last:mb-0"
        >
          <span style={{ color: entry.color }} className="font-medium">
            {entry.name}
          </span>
          <span className="font-bold text-white">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

interface Props {
  data: ChartRow[];
}

export const CashFlowChart = ({ data }: Props) => (
  <div className="bg-nav border-2 border-gray-700 rounded-t-md p-5">
    <h2 className="uppercase text-dashboard-color text-xl font-semibold mb-1">
      Cash Flow — Historical vs Projected
    </h2>
    <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">
      Solid = actual &nbsp;·&nbsp; Faded = projected
    </p>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          barCategoryGap="5%"
          barGap={4}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            vertical={false}
          />
          <XAxis
            xAxisId={0}
            dataKey="period"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={false}
            interval={0}
            allowDuplicatedCategory={false}
            padding={{ left: 20, right: 10 }}
          />
          <XAxis xAxisId={1} dataKey="period" hide />
          <YAxis
            tickFormatter={fmtAxis}
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
              fontSize: "11px",
              paddingTop: "12px",
              color: "#9ca3af",
            }}
          />
          <ReferenceLine
            x="2026"
            stroke="#6b7280"
            strokeDasharray="4 2"
            label={{
              value: "← Projected",
              fill: "#9ca3af",
              fontSize: 10,
              position: "insideTopLeft",
            }}
          />

          {/* Historical */}
          <Bar
            xAxisId={0}
            dataKey="cashIn"
            name="Cash In"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            xAxisId={0}
            dataKey="cashOut"
            name="Cash Out"
            fill="#dc2626"
            radius={[4, 4, 0, 0]}
          />

          {/* Projected — same hues, faded */}
          <Bar
            xAxisId={1}
            dataKey="cashInProj"
            name="Proj. Cash In"
            fill="#10b981"
            fillOpacity={0.4}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            xAxisId={1}
            dataKey="cashOutProj"
            name="Proj. Cash Out"
            fill="#dc2626"
            fillOpacity={0.4}
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
