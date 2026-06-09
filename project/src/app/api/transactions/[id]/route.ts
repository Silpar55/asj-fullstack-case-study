import { NormalizedTransaction } from "@/interfaces/banks/normalized";
import { getTransactionById } from "@/lib/api/normalize";
import { NextResponse, NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const normalizedTransaction: NormalizedTransaction[] =
      await getTransactionById(id);

    if (normalizedTransaction.length === 0) {
      return NextResponse.json(
        { error: "No transaction found" },
        { status: 404 },
      );
    }

    return NextResponse.json(normalizedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error processing transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error while normalizing transactions" },
      { status: 500 },
    );
  }
}
