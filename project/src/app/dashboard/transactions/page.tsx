import LastUpdated from "@/app/components/LastUpdated";
import { inter, barlow } from "@/app/fonts";

export default function Transactions() {
  return (
    <main
      className={`${inter.className} text-dashboard-color w-full flex flex-col p-2`}
    >
      <div className={`${barlow.className}`}>
        <LastUpdated />
        <h1 className="uppercase text-4xl">Transactions</h1>
      </div>
    </main>
  );
}
