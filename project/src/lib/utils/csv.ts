import { NormalizedTransaction } from "@/interfaces/banks/normalized";

export const exportCSV = (
  transactions: NormalizedTransaction[],
  fileName: string,
) => {
  const downloadCSV = () => {
    // Convert the transactions array into a CSV string
    const csvString = [
      [
        "Starred",
        "Transaction",
        "Amount",
        "Date",
        "Category",
        "Bank Acc.",
        "Authorized By",
        "Vendor",
      ],
      ...transactions.map((t) => [
        "True",
        t.description,
        t.amount,
        t.date,
        t.category,
        t.bank,
        t.authorizedBy,
        t.vendor,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv" });

    // Generate a download link and initiate the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  downloadCSV();
};
