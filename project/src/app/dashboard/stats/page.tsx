"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { inter, barlow } from "@/app/fonts";
import LastUpdated from "@/app/components/LastUpdated";
import { UserLS } from "@/app/interfaces/userLS";
import { hasAccess } from "@/app/lib/rabc";

export default function Stats() {
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

    if (!hasAccess(user, "stats")) {
      router.push(`/dashboard/${user.allowedTabs[0]}`);
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // To prevent UI of flashing while checking localStorage
  if (!isAuthorized) return <p>Loading...</p>;

  return (
    <main
      className={`${inter.className} text-dashboard-color w-full flex flex-col p-2`}
    >
      <div className={`${barlow.className}`}>
        <LastUpdated />
        <h1 className="uppercase text-4xl">Stats</h1>
      </div>
    </main>
  );
}
