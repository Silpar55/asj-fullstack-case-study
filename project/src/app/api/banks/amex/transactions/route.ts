import { getAmexData } from "@/app/lib/banks";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    return NextResponse.json(getAmexData(), {
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
