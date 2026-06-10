import React from "react";

const BankAccBalanceCard = () => {
  return (
    <div className="w-full h-full flex flex-col border-2 border-gray-700 rounded-t-md p-5">
      <div className="flex w-full justify-between items-center">
        <h1 className="uppercase text-dashboard-color text-2xl text-center">
          Bank account balance
        </h1>
        <div className="relative w-fit">
          <select
            id="bank"
            // value={filters.bank}
            // onChange={handleChange}
            className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
          >
            <option value="all">Bank</option>
            {/* {data?.bank.map((option) => (
              <option value={option.value} key={option.value}>
                {option.name}
              </option>
            ))} */}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <img src="/down-arrow.svg" alt="▼" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BankAccBalanceCard;
