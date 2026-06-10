"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getUser } from "@/lib/api/auth";
import Spinner from "@/components/dashboard/Spinner";

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.push("/login");
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
  return redirect("/dashboard/transactions");
}
