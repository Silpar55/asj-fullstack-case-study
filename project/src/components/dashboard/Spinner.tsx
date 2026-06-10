import React from "react";

const Spinner = () => {
  return (
    <div
      role="status"
      className="relative animate-spin w-4 h-4 rounded-full bg-red-500"
    >
      <div className="absolute left-[-1.5rem] w-4 h-4 bg-slate-900 rounded-full dark:bg-slate-50"></div>
      <div className="absolute right-[-1.5rem] w-4 h-4 bg-slate-900 rounded-full dark:bg-slate-50"></div>
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Spinner;
