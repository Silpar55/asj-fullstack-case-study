"use client";
import { getBanksNames } from "@/lib/db/banks";
import { useState } from "react";
import BankAccBalance from "../charts/bankBalance/BankAccBalance";

const BankAccBalanceCard = () => {
  const banks = getBanksNames();
  const [bank, setBank] = useState(banks.length > 0 ? banks[0] : "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBank(e.target.value);
  };

  return (
    <div className="w-full h-full flex flex-col border-2 border-gray-700 rounded-t-md p-5">
      <div className="flex w-full justify-between items-center mb-2">
        <h1 className="uppercase text-dashboard-color text-2xl text-center">
          Bank account balance
        </h1>

        <div className="relative w-fit">
          <select
            id="bank"
            value={bank}
            onChange={handleChange}
            className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal bg-black text-white border border-slate-50 border-opacity-20 rounded-md cursor-pointer"
          >
            {banks.map((name) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <img src="/down-arrow.svg" alt="▼" />
          </span>
        </div>
      </div>

      <BankAccBalance bank={bank} />
    </div>
  );
};

export default BankAccBalanceCard;
