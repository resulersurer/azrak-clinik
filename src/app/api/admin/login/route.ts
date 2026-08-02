import { NextResponse } from "next/server";
import { createAdminSession, isValidAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const password = typeof body.password === "string" ? body.password : "";

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      { error: "Parola hatalı." },
      { status: 401 },
    );
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
