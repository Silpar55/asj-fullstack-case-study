"use client";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

export interface TableRow {
  period: string;
  cashIn: number;
  cashOut: number;
  net: number;
  projected: boolean;
}

interface Props {
  rows: TableRow[];
}

export const YearOverYearTable = ({ rows }: Props) => (
  <div className="bg-nav border-2 border-gray-700 rounded-t-md p-5">
    <h2 className="uppercase text-dashboard-color text-xl font-semibold mb-4">
      Year-over-Year Summary
    </h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="grid grid-cols-[80px_1fr_1fr_1fr] text-gray-400 uppercase text-xs font-semibold border-b border-gray-700 pb-2 mb-1">
          <th className="text-left">Year</th>
          <th className="text-right">Cash In</th>
          <th className="text-right">Cash Out</th>
          <th className="text-right">Net Flow</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.period}
            className={`grid grid-cols-[80px_1fr_1fr_1fr] py-3 border-b border-dotted border-gray-700 last:border-0 ${
              row.projected ? "opacity-70" : ""
            }`}
          >
            <td className="text-left font-semibold flex items-center gap-2">
              {row.period}
              {row.projected && (
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-yellow-500/20 text-yellow-400 font-bold">
                  EST
                </span>
              )}
            </td>
            <td className="text-right text-green-400 font-medium">{fmt(row.cashIn)}</td>
            <td className="text-right text-red-400 font-medium">{fmt(row.cashOut)}</td>
            <td className={`text-right font-bold ${row.net >= 0 ? "text-blue-400" : "text-red-500"}`}>
              {fmt(row.net)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
