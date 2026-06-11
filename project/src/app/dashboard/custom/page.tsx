"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inter, barlow } from "@/app/fonts";
import LastUpdated from "@/components/dashboard/LastUpdated";
import Spinner from "@/components/dashboard/Spinner";
import { UserLS } from "@/interfaces/auth/userLS";
import { hasAccess } from "@/lib/api/rabc";
import { getUser } from "@/lib/api/auth";
import { SliderCard } from "@/components/dashboard/custom/SliderCard";
import { ProjectionKPICard } from "@/components/dashboard/custom/ProjectionKPICard";
import { CashFlowChart } from "@/components/dashboard/custom/CashFlowChart";
import { YearOverYearTable } from "@/components/dashboard/custom/YearOverYearTable";
import { CategoryPieChart } from "@/components/dashboard/custom/CategoryPieChart";
import { MethodologyNote } from "@/components/dashboard/custom/MethodologyNote";

// ── Mock data ─────────────────────────────────────────────────────────────────
const HISTORICAL = [
  { period: "2023", cashIn: 842500, cashOut: 614200 },
  { period: "2024", cashIn: 1243800, cashOut: 891600 },
  { period: "2025", cashIn: 1578400, cashOut: 1122000 },
];

const HISTORICAL_CATEGORIES = [
  { name: "Software", y2023: 198400, y2024: 251200, y2025: 312400 },
  { name: "Marketing", y2023: 201300, y2024: 239800, y2025: 284900 },
  { name: "Payroll", y2023: 162100, y2024: 178900, y2025: 198700 },
  { name: "Travel", y2023: 98700, y2024: 118500, y2025: 142300 },
  { name: "Infrastructure", y2023: 74200, y2024: 84300, y2025: 98500 },
];

// Observed YoY growth rates derived from the data above
const observedGrowth = HISTORICAL_CATEGORIES.map((c) => ({
  name: c.name,
  amount: c.y2025,
  rate2324: Math.round(((c.y2024 - c.y2023) / c.y2023) * 1000) / 10,
  rate2425: Math.round(((c.y2025 - c.y2024) / c.y2024) * 1000) / 10,
}));

export default function Custom() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [revenueGrowth, setRevenueGrowth] = useState(15);
  const [expenseGrowth, setExpenseGrowth] = useState(10);

  useEffect(() => {
    const user: UserLS = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!hasAccess(user, "custom")) {
      router.push(`/dashboard/${user.allowedTabs[0]}`);
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  // ── Derive projections ────────────────────────────────────────────
  const base = HISTORICAL[HISTORICAL.length - 1]; // 2025

  const proj2026 = {
    cashIn: Math.round(base.cashIn * (1 + revenueGrowth / 100)),
    cashOut: Math.round(base.cashOut * (1 + expenseGrowth / 100)),
  };
  const proj2027 = {
    cashIn: Math.round(proj2026.cashIn * (1 + revenueGrowth / 100)),
    cashOut: Math.round(proj2026.cashOut * (1 + expenseGrowth / 100)),
  };

  const net2026 = proj2026.cashIn - proj2026.cashOut;

  const chartData = [
    { period: "2023", cashIn: 842500, cashOut: 614200 },
    { period: "2024", cashIn: 1243800, cashOut: 891600 },
    {
      period: "2025",
      cashIn: base.cashIn,
      cashOut: base.cashOut,
      cashInProj: base.cashIn,
      cashOutProj: base.cashOut,
    },
    {
      period: "2026",
      cashInProj: proj2026.cashIn,
      cashOutProj: proj2026.cashOut,
    },
    {
      period: "2027",
      cashInProj: proj2027.cashIn,
      cashOutProj: proj2027.cashOut,
    },
  ];

  const tableRows = [
    ...HISTORICAL.map((r) => ({
      ...r,
      net: r.cashIn - r.cashOut,
      projected: false,
    })),
    {
      period: "2026",
      cashIn: proj2026.cashIn,
      cashOut: proj2026.cashOut,
      net: net2026,
      projected: true,
    },
    {
      period: "2027",
      cashIn: proj2027.cashIn,
      cashOut: proj2027.cashOut,
      net: proj2027.cashIn - proj2027.cashOut,
      projected: true,
    },
  ];

  const projCategories = observedGrowth.map((c) => ({
    ...c,
    projected: Math.round(c.amount * (1 + expenseGrowth / 100)),
  }));

  return (
    <main
      className={`${inter.className} text-dashboard-color w-full flex flex-col p-5 gap-8`}
    >
      {/* Header */}
      <div className={`${barlow.className} px-5`}>
        <LastUpdated />
        <h1 className="uppercase text-4xl">Predictions</h1>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider">
          Historical · 2023 – 2025 &nbsp;·&nbsp; Adjust the sliders to model
          future scenarios
        </p>
      </div>

      {/* Assumption controls + KPI cards */}
      <section className="flex gap-5">
        <SliderCard
          label="Revenue Growth"
          sublabel="YoY cash in"
          value={revenueGrowth}
          onChange={setRevenueGrowth}
          color="text-green-400"
        />
        <SliderCard
          label="Expense Growth"
          sublabel="YoY cash out"
          value={expenseGrowth}
          onChange={setExpenseGrowth}
          color="text-red-400"
        />
        <ProjectionKPICard
          label="Net Flow — 2026"
          value={net2026}
          sublabel="Cash In minus Cash Out"
          valueColor={net2026 >= 0 ? "text-green-400" : "text-red-400"}
        />
        <ProjectionKPICard
          label="Cash In — 2026"
          value={proj2026.cashIn}
          sublabel={`+${revenueGrowth}% from 2025`}
          valueColor="text-green-400"
        />
        <ProjectionKPICard
          label="Cash Out — 2026"
          value={proj2026.cashOut}
          sublabel={`+${expenseGrowth}% from 2025`}
          valueColor="text-red-400"
        />
      </section>

      {/* Main content */}
      <section className="w-full flex gap-5 items-start">
        {/* Left — chart + table */}
        <div className="w-3/5 flex flex-col gap-5">
          <CashFlowChart data={chartData} />
          <YearOverYearTable rows={tableRows} />
        </div>

        {/* Right — pie + methodology */}
        <div className="w-2/5 flex flex-col gap-5">
          <CategoryPieChart
            categories={projCategories}
            expenseGrowth={expenseGrowth}
          />
          <MethodologyNote />
        </div>
      </section>
    </main>
  );
}
