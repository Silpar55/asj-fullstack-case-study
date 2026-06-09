"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // To prevent UI of flashing while checking localStorage
  if (!isAuthorized) return <p>Loading...</p>;

  return redirect("/dashboard/transactions");
}
