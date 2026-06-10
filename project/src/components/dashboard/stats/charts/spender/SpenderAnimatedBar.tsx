"use client";

import { useEffect, useState } from "react";

interface Props {
  percentages: {
    percentage: number;
    color: string;
  }[];
}

const SpenderAnimatedBar = ({ percentages }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sorted = [...percentages].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="h-2 rounded-full bg-dashboard-color flex overflow-hidden">
      {sorted.map((p, index) => (
        <div
          key={index}
          className={`h-2 transition-all duration-700 ease-out ${p.color}`}
          style={{
            width: mounted ? `${p.percentage}%` : "0%",
          }}
        />
      ))}
    </div>
  );
};

export default SpenderAnimatedBar;
