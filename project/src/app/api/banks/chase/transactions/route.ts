import { NextResponse } from "next/server";

import { getChaseData } from "@/app/lib/banks";

export async function GET(request: Request) {
  try {
    return NextResponse.json(getChaseData(), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
