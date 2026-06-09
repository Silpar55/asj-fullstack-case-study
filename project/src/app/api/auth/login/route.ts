import { NextResponse } from "next/server";

import usersData from "../../../../../data/users/user.json";
import { User } from "@/app/interfaces/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user in mocked data (in real life, find the user in the database)
    const user = usersData.users.find((u: User) => u.email === email);

    // Validate credentials (in reality, compare hashed passwords)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // DTO

    const userResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
      allowedTabs: user.allowedTabs,
    };

    return NextResponse.json(userResponse, { status: 200 });
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
