import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import { formatCurrency, formatDate } from "./formatRows";

const escapeCSV = (value: any) => {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);

  // Escape quotes by doubling them
  const escaped = stringValue.replace(/"/g, '""');

  // Wrap in quotes if it contains comma, quote, or newline
  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }

  return escaped;
};

export const exportCSV = (
  transactions: NormalizedTransaction[],
  fileName: string,
) => {
  const downloadCSV = () => {
    // Convert the transactions array into a CSV string
    const csvString = [
      [
        "Transaction",
        "Amount",
        "Date",
        "Category",
        "Bank Acc.",
        "Authorized By",
        "Vendor",
      ],
      ...transactions.map((t) => [
        escapeCSV(t.description),
        escapeCSV(formatCurrency(t.amount, t.currency)),
        escapeCSV(formatDate(t.date)),
        escapeCSV(t.category),
        escapeCSV(t.bank.toUpperCase()),
        escapeCSV(t.authorizedBy),
        escapeCSV(t.vendor),
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
