import { NextResponse } from "next/server";
import { getBoaData } from "@/lib/db/banks";

export async function GET(request: Request) {
  try {
    return NextResponse.json(getBoaData(), {
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
