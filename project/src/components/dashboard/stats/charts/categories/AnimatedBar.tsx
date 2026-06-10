"use client";
import { useEffect, useState } from "react";

const AnimatedBar = ({ percentage }: { percentage: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="h-2 rounded-full bg-dashboard-color">
      <div
        className="h-2 rounded-full bg-green-800 transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default AnimatedBar;
