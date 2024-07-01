"use server";

import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: Request, res: NextResponse) {
  console.log("jaam", req);
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Token fetched:", token);
  return NextResponse.json({ token }, { status: 200 });
}
