"use client";

import { useState } from "react";
import {
  Pie,
  PieChart,
  PieSectorShapeProps,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

export interface ProjCategory {
  name: string;
  amount: number;
  rate2324: number;
  rate2425: number;
  projected: number;
}

const PIE_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: {
    payload: ProjCategory;
  }[];
}) => {
  if (!active || !payload?.length) return null;
  const { name, projected, amount, rate2324, rate2425 } = payload[0].payload;
  return (
    <div className="bg-nav border border-gray-700 rounded-lg px-4 py-3 shadow-xl text-xs min-w-[200px]">
      <p className="text-white font-bold uppercase tracking-wider mb-2">
        {name}
      </p>
      <div className="flex justify-between gap-6 mb-1">
        <span className="text-gray-400">Projected 2026</span>
        <span className="font-bold text-blue-400">{fmt(projected)}</span>
      </div>
      <div className="flex justify-between gap-6 mb-1">
        <span className="text-gray-400">Actual 2025</span>
        <span className="font-medium text-gray-300">{fmt(amount)}</span>
      </div>
      <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between gap-6 mb-1">
        <span className="text-gray-500">Growth 23→24</span>
        <span className="text-gray-400">+{rate2324}%</span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-gray-500">Growth 24→25</span>
        <span
          className={rate2425 > rate2324 ? "text-green-400" : "text-yellow-400"}
        >
          +{rate2425}%
        </span>
      </div>
    </div>
  );
};

interface Props {
  categories: ProjCategory[];
  expenseGrowth: number;
}

export const CategoryPieChart = ({ categories, expenseGrowth }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pieData = categories.map((item, i) => ({
    ...item,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));
  return (
    <div className="bg-nav border-2 border-gray-700 rounded-t-md p-5">
      <h2 className="uppercase text-dashboard-color text-xl font-semibold mb-1">
        Projected Spend by Category
      </h2>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
        2026 estimate &nbsp;·&nbsp; +{expenseGrowth}% expense growth applied
      </p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="projected"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              label={({ name }) => name}
              shape={(props: PieSectorShapeProps) => {
                const {
                  cx,
                  cy,
                  innerRadius,
                  outerRadius,
                  startAngle,
                  endAngle,
                  fill,
                  isActive,
                } = props;
                return (
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={isActive ? outerRadius + 10 : outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                  />
                );
              }}
            />
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with observed growth rates */}
      <div className="flex flex-col gap-2.5 mt-3">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-[10px] uppercase tracking-wider text-gray-600 font-semibold border-b border-gray-800 pb-1.5">
          <span>Category</span>
          <span className="text-right">23→24</span>
          <span className="text-right">24→25</span>
          <span className="text-right">Proj. 2026</span>
        </div>

        {categories.map((cat, i) => {
          const accelerating = cat.rate2425 > cat.rate2324;
          return (
            <div
              key={cat.name}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center text-xs cursor-pointer"
              onMouseEnter={() => setActiveIndex(i)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="uppercase tracking-wide font-semibold">
                  {cat.name}
                </span>
              </div>
              <span className="text-right text-gray-500">+{cat.rate2324}%</span>
              <span
                className={`text-right font-semibold ${accelerating ? "text-green-400" : "text-yellow-400"}`}
              >
                +{cat.rate2425}%
                <span className="ml-0.5 text-[9px]">
                  {accelerating ? "↑" : "↓"}
                </span>
              </span>
              <span className="text-right font-bold text-white">
                {fmt(cat.projected)}
              </span>
            </div>
          );
        })}

        <p className="text-[10px] text-gray-600 pt-1 border-t border-gray-800">
          24→25 in <span className="text-green-400">green</span> = accelerating
          · <span className="text-yellow-400">yellow</span> = decelerating
        </p>
      </div>
    </div>
  );
};
