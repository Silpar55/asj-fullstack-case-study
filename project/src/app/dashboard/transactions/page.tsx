"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LastUpdated from "@/app/components/LastUpdated";
import { inter, barlow } from "@/app/fonts";
import { UserLS } from "@/app/interfaces/userLS";
import { hasAccess } from "@/app/lib/rabc";

export default function Transactions() {
  // RABC Logic
  // Note: putting "use client" in a page breaks the server components principle, however is necessary for local storage
  // The best practice would be the use of cookies and middleware to handle RABC while keeping pages as server components
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user: UserLS = JSON.parse(storedUser);

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
  if (!isAuthorized) return <p>Loading...</p>;

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
      <section className="max-h-full h-full bg-nav rounded-xl p-5 w-max min-w-full ">
        <table className="text-center mx-auto w-full">
          <thead>
            <tr className="grid grid-cols-[50px_2fr_1fr_1.5fr_1fr_1.5fr_1.5fr_1fr] items-center uppercase text-white font-bold mb-2">
              <th></th>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Bank Acc.</th>
              <th>Authorized By</th>
              <th>Vendor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="grid grid-cols-[50px_2.0fr_1fr_1.5fr_1fr_1.5fr_1.5fr_1fr] items-center  bg-dashboard-bg py-4 rounded-md border-b border-dotted">
              <th className="flex justify-end">
                <img src="/star.svg" alt="" className="w-6" />
              </th>
              <td>Cloud Infrastructure Renewal</td>
              <td>USD $12,480.00</td>
              <td>Sep 12, 2024</td>
              <td>Software</td>
              <td>BOA ****4521</td>
              <td>Maria Chen</td>
              <td>AWS</td>
            </tr>
            <tr className="grid grid-cols-[50px_2.0fr_1fr_1.5fr_1fr_1.5fr_1.5fr_1fr] items-center  bg-dashboard-bg py-4 rounded-md border-b border-dotted">
              <th className="flex justify-end">
                <img src="/star-blue.svg" alt="" className="w-6" />
              </th>
              <td>Cloud Infrastructure Renewal</td>
              <td>USD $12,480.00</td>
              <td>Sep 12, 2024</td>
              <td>Software</td>
              <td>BOA ****4521</td>
              <td>Maria Chen</td>
              <td>AWS</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
