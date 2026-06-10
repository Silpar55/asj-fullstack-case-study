import TopSpender from "../charts/spender/TopSpender";

const TopSpenderCard = () => {
  return (
    <div className="w-full h-full flex flex-col border-2 border-gray-700 rounded-t-md p-5 bg-nav">
      <h1 className="uppercase text-dashboard-color text-xl font-bold">
        Top spender
      </h1>
      <TopSpender />
    </div>
  );
};

export default TopSpenderCard;
