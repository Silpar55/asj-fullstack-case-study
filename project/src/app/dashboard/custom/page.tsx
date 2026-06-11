"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { inter, barlow } from "@/app/fonts";
import LastUpdated from "@/components/dashboard/LastUpdated";
import Spinner from "@/components/dashboard/Spinner";
import { UserLS } from "@/interfaces/auth/userLS";
import { hasAccess } from "@/lib/api/rabc";
import { getUser } from "@/lib/api/auth";
import {
  getCashFlowByYear,
  getCategoriesByYear,
  getProjections,
} from "@/lib/api/custom";
import { SliderCard } from "@/components/dashboard/custom/SliderCard";
import { ProjectionKPICard } from "@/components/dashboard/custom/ProjectionKPICard";
import { CashFlowChart } from "@/components/dashboard/custom/CashFlowChart";
import { YearOverYearTable } from "@/components/dashboard/custom/YearOverYearTable";
import { CategoryPieChart } from "@/components/dashboard/custom/CategoryPieChart";
import { MethodologyNote } from "@/components/dashboard/custom/MethodologyNote";

const computeRate = (prev: number, curr: number) =>
  prev ? Math.round(((curr - prev) / prev) * 1000) / 10 : 0;

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

  const { data: cashFlowData, isLoading: cashFlowLoading } = useSWR(
    "cashflow-by-year",
    getCashFlowByYear,
  );
  const { data: categoriesData, isLoading: categoriesLoading } = useSWR(
    "categories-by-year",
    getCategoriesByYear,
  );

  if (!isAuthorized || cashFlowLoading || categoriesLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  const historical = (cashFlowData ?? []).map(([period, { cashIn, cashOut }]) => ({
    period,
    cashIn: Math.round(cashIn),
    cashOut: Math.round(cashOut),
  }));

  const base = historical[historical.length - 1];
  const { proj2026, proj2027 } = base
    ? getProjections(base, revenueGrowth, expenseGrowth)
    : { proj2026: { cashIn: 0, cashOut: 0 }, proj2027: { cashIn: 0, cashOut: 0 } };

  const net2026 = proj2026.cashIn - proj2026.cashOut;

  const chartData = [
    ...historical.slice(0, -1).map((r) => ({
      period: r.period,
      cashIn: r.cashIn,
      cashOut: r.cashOut,
    })),
    ...(base
      ? [
          {
            period: base.period,
            cashIn: base.cashIn,
            cashOut: base.cashOut,
            cashInProj: base.cashIn,
            cashOutProj: base.cashOut,
          },
        ]
      : []),
    { period: "2026", cashInProj: proj2026.cashIn, cashOutProj: proj2026.cashOut },
    { period: "2027", cashInProj: proj2027.cashIn, cashOutProj: proj2027.cashOut },
  ];

  const tableRows = [
    ...historical.map((r) => ({ ...r, net: r.cashIn - r.cashOut, projected: false })),
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

  const observedGrowth = (categoriesData ?? []).map(({ name, byYear }) => ({
    name,
    amount: byYear["2025"] ?? 0,
    rate2324: computeRate(byYear["2023"] ?? 0, byYear["2024"] ?? 0),
    rate2425: computeRate(byYear["2024"] ?? 0, byYear["2025"] ?? 0),
  }));

  const projCategories = observedGrowth.map((c) => ({
    ...c,
    projected: Math.round(c.amount * (1 + expenseGrowth / 100)),
  }));

  return (
    <main
      className={`${inter.className} text-dashboard-color w-full flex flex-col p-5 gap-8`}
    >
      <div className={`${barlow.className} px-5`}>
        <LastUpdated />
        <h1 className="uppercase text-4xl">Predictions</h1>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider">
          Historical · {historical[0]?.period} – {base?.period} &nbsp;·&nbsp;
          Adjust the sliders to model future scenarios
        </p>
      </div>

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
          sublabel={`+${revenueGrowth}% from ${base?.period ?? "last year"}`}
          valueColor="text-green-400"
        />
        <ProjectionKPICard
          label="Cash Out — 2026"
          value={proj2026.cashOut}
          sublabel={`+${expenseGrowth}% from ${base?.period ?? "last year"}`}
          valueColor="text-red-400"
        />
      </section>

      <section className="w-full flex gap-5 items-start">
        <div className="w-3/5 flex flex-col gap-5">
          <CashFlowChart data={chartData} />
          <YearOverYearTable rows={tableRows} />
        </div>
        <div className="w-2/5 flex flex-col gap-5">
          <CategoryPieChart categories={projCategories} expenseGrowth={expenseGrowth} />
          <MethodologyNote />
        </div>
      </section>
    </main>
  );
}
