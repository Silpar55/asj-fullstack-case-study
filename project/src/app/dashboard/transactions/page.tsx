"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

import LastUpdated from "@/components/dashboard/LastUpdated";
import { inter, barlow } from "@/app/fonts";
import { UserLS } from "@/interfaces/auth/userLS";
import { hasAccess } from "@/lib/api/rabc";
import { getUser } from "@/lib/api/auth";
import { Table } from "@/components/dashboard/Table";
import { NormalizedTransaction } from "@/interfaces/banks/normalized";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Transactions() {
  // RABC Logic
  // Note: putting "use client" in a page breaks the server components principle, however is necessary for local storage
  // The best practice would be the use of cookies and middleware to handle RABC while keeping pages as server components
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/transactions", fetcher);
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

    if (!hasAccess(user, "transactions")) {
      router.push(`/dashboard/${user.allowedTabs[0]}`);
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // To prevent UI of flashing while checking localStorage
  if (!isAuthorized) return <p className="text-white">Loading...</p>;

  if (isLoading) return <p className="text-white">Loading...</p>;

  if (error) return <p className="text-white">Error loading transactions</p>;

  return (
    <main
      className={`${inter.className} text-dashboard-color w-full flex flex-col p-5`}
    >
      <div className={`${barlow.className}`}>
        <LastUpdated />
        <h1 className="uppercase text-4xl mb-5">Transactions</h1>
      </div>

      {/* Table filters */}
      <section
        className={`${barlow.className} flex justify-end gap-5 w-max min-w-full`}
      >
        <div className="relative w-fit">
          <select
            name=""
            id=""
            className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
          >
            <option value="">auth. by</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <img src="/down-arrow.svg" alt="▼" />
          </span>
        </div>
        <div className="relative w-fit">
          <select
            name=""
            id=""
            className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
          >
            <option value="">show currenty in</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <img src="/down-arrow.svg" alt="▼" />
          </span>
        </div>
        <div className="relative w-fit">
          <select
            name=""
            id=""
            className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
          >
            <option value="">bank acc.</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <img src="/down-arrow.svg" alt="▼" />
          </span>
        </div>

        <button className="flex justify-center items-center align-middle uppercase text-sm font-normal bg-black text-white border border-slate-50 border-opacity-20 p-1 px-3 gap-2 rounded-md">
          <img src="/down-arrow-csv.svg" className="w-3" alt="" />{" "}
          <span className="">csv</span>
        </button>
        <button className="flex justify-center items-center align-middle uppercase text-sm font-normal bg-black text-white border border-slate-50 border-opacity-20 p-1 px-3 gap-2 rounded-md">
          <img src="/calendar.svg" className="w-3" alt="" />{" "}
          <span className="">09-11-2024</span>
        </button>
      </section>

      {/* Table */}
      <section className="uppercase flex w-full ml-2 mt-5 ">
        <h1 className="w-20 text-center border-b-2 border-accent-blue font-semibold">
          All
        </h1>
        <h1 className="w-32 text-center font-semibold">Starred (97)</h1>
      </section>
      <Table transactions={data as NormalizedTransaction[]} />
    </main>
  );
}
