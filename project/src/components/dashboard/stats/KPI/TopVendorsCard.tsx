import TopVendorsTable from "./TopVendorsTable";

const TopVendorsCard = () => {
  return (
    <div className="w-full  flex flex-col border-2 border-gray-700 rounded-t-md p-5">
      <h1 className="uppercase text-dashboard-color text-2xl font-semibold">
        Top 4 paid vendors
      </h1>
      <TopVendorsTable />
    </div>
  );
};

export default TopVendorsCard;
