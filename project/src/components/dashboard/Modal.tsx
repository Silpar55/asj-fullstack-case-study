import { AmexTransaction } from "@/interfaces/banks/amex";
import { BoaTransaction } from "@/interfaces/banks/boa";
import { ChaseTransaction } from "@/interfaces/banks/chase";
import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import {
  buildBankAcc,
  formatCurrency,
  formatDate,
} from "@/lib/utils/formatRows";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  transaction: NormalizedTransaction | null;
}

export const Modal = ({ isOpen, onClose, title, transaction }: ModalProps) => {
  if (!isOpen) return null;

  const badgeColor = (status: string = "") => {
    switch (status) {
      case "pending":
        return "bg-orange-500";
      case "posted":
        return "bg-green-500";
      case "failed":
        return "bg-red-700";
      default:
        return "bg-blue-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <section className="max-h-[750px] overflow-y-auto scroll-m-0 bg-nav rounded-xl p-5 w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="uppercase text-white font-bold text-center text-lg tracking-wider">
          {title}
        </h2>

        <div className="flex flex-col justify-center gap-2 p-5 align-middle w-full items-center text-white">
          <div className={`flex justify-end w-full text-xs `}>
            <span
              className={`px-2 p-1 rounded-xl uppercase font-bold ${transaction?.type === "credit" ? "bg-red-700" : "bg-green-700"}`}
            >
              {transaction?.type}
            </span>
          </div>
          <div className="flex gap-1 justify-between w-full">
            <span className="text-xs font-medium">
              <span className="font-semibold"> Posted in </span>
              <span className="font-bold">
                {formatDate(transaction?.postDate || "")}
              </span>
            </span>
            <span className="text-xs font-medium">
              <span className="font-semibold">Initiated in</span>{" "}
              <span className="font-bold">
                {formatDate(transaction?.date || "")}
              </span>
            </span>
          </div>
          <div className="flex w-full justify-between align-middle items-center">
            <div className="flex flex-col">
              <span className="text-xs">
                Authorized By{" "}
                <span className="font-bold">
                  {transaction?.authorizedBy as String}
                </span>
              </span>
              <div className="flex gap-2 ">
                <span className="text-base font-semibold">
                  {transaction?.description}:
                </span>
                <span className="font-bold">
                  {formatCurrency(
                    transaction?.amount as number,
                    transaction?.currency as string,
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col align-middle justify-center items-center gap-1">
              <span className="text-2xl text-blue-400 uppercase">
                {transaction?.bank}
              </span>
              <span
                className={`px-2 text-sm font-medium rounded-full ${badgeColor(transaction?.status as string)}`}
              >
                {transaction?.status || "other"}
              </span>
            </div>
          </div>
          <div className="flex w-full justify-between align-middle items-center">
            <div className="">
              <div className="flex align-middle items-center justify-center gap-2">
                <span className="text-base">Vendor: </span>
                <span className={`text-sm font-bold`}>
                  {transaction?.vendor}
                </span>
              </div>
              <div className="flex align-middle items-center justify-center gap-2">
                <span className="text-base">Category: </span>
                <span className={`text-sm font-bold`}>
                  {transaction?.category}
                </span>
              </div>
            </div>
            <div className="">
              <span className="text-xs">
                Paid with:{" "}
                <span className="font-bold">
                  {buildBankAcc(transaction as NormalizedTransaction)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-dashboard-bg border border-dotted border-gray-600 hover:bg-white/5 text-white uppercase font-bold py-2 px-10 rounded-md transition-all"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
};
