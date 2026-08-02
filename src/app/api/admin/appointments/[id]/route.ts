import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  type AppointmentStatus,
  updateAppointmentRequest,
} from "@/lib/appointments";

const statuses: AppointmentStatus[] = ["approved", "rejected"];

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/appointments/[id]">,
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const body = await request.json();
  const status = body.status;
  const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : undefined;

  if (!Number.isSafeInteger(id) || id < 1 || !statuses.includes(status)) {
    return NextResponse.json({ error: "Geçersiz randevu güncellemesi." }, { status: 400 });
  }

  if (status === "approved" && (!scheduledAt || Number.isNaN(Date.parse(scheduledAt)))) {
    return NextResponse.json(
      { error: "Onaylanan randevu için tarih ve saat seçin." },
      { status: 400 },
    );
  }

  await updateAppointmentRequest(id, status, scheduledAt);
  return NextResponse.json({ ok: true });
}
