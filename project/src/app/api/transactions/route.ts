import { NextResponse, NextRequest } from "next/server";
import { getNormalizedTransactions } from "@/lib/api/normalize";

export async function GET(request: NextRequest) {
  try {
    // Extract queries
    const searchParams = request.nextUrl.searchParams;

    const bank = searchParams.get("bank") || "";
    const authorizedBy = searchParams.get("authorizedBy") || "";
    const amount = searchParams.get("amount") || "";
    const fromDate = searchParams.get("fromDate") || "";

    const normalizedTransactions = await getNormalizedTransactions({
      bank,
      authorizedBy,
      amount,
      fromDate,
    });

    return NextResponse.json(normalizedTransactions, { status: 200 });
  } catch (error) {
    console.error("Error processing transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error while normalizing transactions" },
      { status: 500 },
    );
  }
}
