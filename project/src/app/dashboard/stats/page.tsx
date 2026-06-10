"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { inter, barlow } from "@/app/fonts";
import LastUpdated from "@/components/dashboard/LastUpdated";
import { UserLS } from "@/interfaces/auth/userLS";
import { hasAccess } from "@/lib/api/rabc";
import { getUser } from "@/lib/api/auth";
import Spinner from "@/components/dashboard/Spinner";
import CashInCard from "@/components/dashboard/stats/KPI/CashInCard";
import CashOutCard from "@/components/dashboard/stats/KPI/CashOutCard";
import TopCategoriesCard from "@/components/dashboard/stats/KPI/TopCategoriesCard";
import TopVendorsCard from "@/components/dashboard/stats/KPI/TopVendorsCard";

export default function Stats() {
  // RABC Logic
  // Note: putting "use client" in a page breaks the server components principle, however is necessary for local storage
  // The best practice would be the use of cookies and middleware to handle RABC while keeping pages as server components
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user: UserLS = getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    /* We require to know at least one allowed tab is allowed, 
    since login/ and dashboard/ redirects always to transactions tab, 
    we require to handle uses cases when user cannot enter that tab.
    Therefore the easiest solution to redirect to the first allowed tab
  */

    if (!hasAccess(user, "stats")) {
      router.push(`/dashboard/${user.allowedTabs[0]}`);
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // To prevent UI of flashing while checking localStorage
  if (!isAuthorized)
    return (
      <div className="w-full h-screen flex justify-center items-center align-middle">
        <Spinner />
      </div>
    );

  return (
    <main
      className={`${inter.className} text-dashboard-color w-full flex flex-col p-5 gap-10`}
    >
      <div className={`${barlow.className} px-5`}>
        <LastUpdated />
        <h1 className="uppercase text-4xl">Stats</h1>
      </div>

      <section className="w-full flex justify-between gap-5">
        <section className="w-1/2 h-1/5 flex gap-5">
          <CashInCard />
          <CashOutCard />
        </section>
        <section className="w-1/2 flex flex-col gap-5">
          <TopCategoriesCard />
          <TopVendorsCard />
        </section>
      </section>
    </main>
  );
}
