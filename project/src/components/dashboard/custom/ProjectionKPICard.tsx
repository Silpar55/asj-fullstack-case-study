"use client";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

interface Props {
  label: string;
  value: number;
  sublabel: string;
  valueColor: string;
}

export const ProjectionKPICard = ({ label, value, sublabel, valueColor }: Props) => (
  <div className="flex-1 bg-nav rounded-xl p-5 border border-gray-700 flex flex-col justify-center items-center gap-2">
    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{label}</p>
    <span className={`text-3xl font-bold ${valueColor}`}>{fmt(value)}</span>
    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{sublabel}</p>
  </div>
);
