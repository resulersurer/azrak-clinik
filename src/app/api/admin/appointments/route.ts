import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAppointmentRequests } from "@/lib/appointments";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  return NextResponse.json(await getAppointmentRequests());
}
