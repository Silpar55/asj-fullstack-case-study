import useSWR from "swr";
import { barlow } from "@/app/fonts";
import { getOptions } from "@/lib/api/table";

interface Props {
  filters: {
    bank: string;
    authBy: string;
    currency: string;
    bankAcc: string;
  };
  setFilters: any;
}
const fetcher = () => getOptions();
const TableFilters = ({ filters, setFilters }: Props) => {
  const { data, error, isLoading } = useSWR("table-filters", fetcher);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, id } = e.target;

    setFilters((prev: Props) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <section
      className={`${barlow.className} flex justify-end gap-5 w-max min-w-full`}
    >
      <div className="relative w-fit">
        <select
          id="bank"
          value={filters.bank}
          onChange={handleChange}
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="all">Bank</option>
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
          id="authBy"
          value={filters.authBy}
          onChange={handleChange}
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="all">auth. by</option>
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
          id="currency"
          value={filters.currency}
          onChange={handleChange}
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="all">show currenty in</option>
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
          id="bankAcc"
          value={filters.bankAcc}
          onChange={handleChange}
          className="appearance-none pr-7 pl-3 py-2 uppercase text-sm font-normal  bg-black text-white border border-slate-50 border-opacity-20 p-1 rounded-md"
        >
          <option value="all">bank acc.</option>
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
