import CashFlow from "../charts/cashflow/CashFlow";

const CashFlowCard = () => {
  return (
    <div className="w-full h-full flex flex-col border-2 border-gray-700 rounded-t-md p-5">
      <div className="flex w-full justify-center items-center mb-2">
        <h1 className="uppercase text-dashboard-color text-2xl text-center">
          Money In Vs Money Out
        </h1>
      </div>

      <CashFlow />
    </div>
  );
};

export default CashFlowCard;
