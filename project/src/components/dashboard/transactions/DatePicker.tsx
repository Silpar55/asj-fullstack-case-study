// This component is made by AI. I don't like the UI from date picker browsers
// and to save time I asked claudeCode to create this component

"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (date: string) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DatePicker = ({ value, onChange }: Props) => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    value ? new Date(value + "T00:00:00").getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value ? new Date(value + "T00:00:00").getMonth() : today.getMonth(),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const handleDayClick = (day: number) => {
    const month = String(viewMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    onChange(`${viewYear}-${month}-${dayStr}`);
    setOpen(false);
  };

  const displayDate = value ? value.split("-").reverse().join("-") : "Date";

  const selectedDay = value
    ? (() => {
        const d = new Date(value + "T00:00:00");
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth
          ? d.getDate()
          : null;
      })()
    : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex justify-center items-center uppercase text-sm font-normal bg-black text-white border border-slate-50 border-opacity-20 p-2 px-3 gap-2 rounded-md"
      >
        <img src="/calendar.svg" className="w-3" alt="" />
        <span>{displayDate}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-black border border-slate-50 border-opacity-20 rounded-md p-3 w-60 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={prevMonth}
              className="text-dashboard-color hover:text-white px-2 text-lg leading-none"
            >
              ‹
            </button>
            <span className="text-white text-xs font-semibold uppercase tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="text-dashboard-color hover:text-white px-2 text-lg leading-none"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-center text-xs text-dashboard-color uppercase py-1"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <span key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`text-center text-xs py-1 rounded transition-colors hover:bg-accent-blue hover:text-white
                  ${selectedDay === day ? "bg-accent-blue text-white" : "text-dashboard-color"}`}
              >
                {day}
              </button>
            ))}
          </div>

          {value && (
            <div className="mt-2 pt-2 border-t border-slate-50 border-opacity-20">
              <button
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="w-full text-xs text-dashboard-color uppercase hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
