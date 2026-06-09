import useSWR from "swr";
import { barlow } from "@/app/fonts";
import { getOptions } from "@/lib/api/table";

const fetcher = () => getOptions();
const TableFilters = () => {
  const { data, error, isLoading } = useSWR("table-filters", fetcher);

  return (
    <section
      className={`${barlow.className} flex justify-end gap-5 w-max min-w-full`}
    >
      <div className="relative w-fit">
        <select
          id="bankSelect"
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="">Bank</option>
          {data?.bank.map((option) => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <img src="/down-arrow.svg" alt="▼" />
        </span>
      </div>
      <div className="relative w-fit">
        <select
          id="authBySelect"
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="">auth. by</option>
          {data?.authBy.map((option) => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <img src="/down-arrow.svg" alt="▼" />
        </span>
      </div>

      <div className="relative w-fit">
        <select
          name="currencySelect"
          id=""
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="">show currenty in</option>
          {data?.currency.map((option) => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <img src="/down-arrow.svg" alt="▼" />
        </span>
      </div>
      <div className="relative w-fit">
        <select
          name="bankAccSelect"
          id=""
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="">bank acc.</option>
          {data?.bankAcc.map((option) => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <img src="/down-arrow.svg" alt="▼" />
        </span>
      </div>

      <button className="flex justify-center items-center align-middle uppercase text-sm font-normal bg-black text-white border border-slate-50 border-opacity-20 p-1 px-3 gap-2 rounded-md">
        <img src="/down-arrow-csv.svg" className="w-3" alt="" />{" "}
        <span className="">csv</span>
      </button>
      <button className="flex justify-center items-center align-middle uppercase text-sm font-normal bg-black text-white border border-slate-50 border-opacity-20 p-1 px-3 gap-2 rounded-md">
        <img src="/calendar.svg" className="w-3" alt="" />{" "}
        <span className="">09-11-2024</span>
      </button>
    </section>
  );
};

export default TableFilters;
