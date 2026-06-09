"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/formatTime";

export default function LastUpdated() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(
      () => {
        setDate(new Date());
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return <p className="uppercase text-right">{formatDate(date)}</p>;
}
