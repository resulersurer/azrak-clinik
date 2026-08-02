import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  addCareTask,
  addDailyFollowUp,
  addPatientPayment,
  getAppointmentRequest,
  type PatientStage,
  updatePatientRecord,
} from "@/lib/appointments";

const patientStages: PatientStage[] = [
  "lead",
  "scheduled",
  "assessment",
  "care_plan",
  "treatment",
  "follow_up",
  "completed",
  "closed",
];

function isValidId(id: number) {
  return Number.isSafeInteger(id) && id > 0;
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/admin/appointments/[id]">,
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Geçersiz hasta kaydı." }, { status: 400 });
  }

  const patient = await getAppointmentRequest(id);

  if (!patient) {
    return NextResponse.json({ error: "Hasta kaydı bulunamadı." }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/appointments/[id]">,
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Geçersiz hasta kaydı." }, { status: 400 });
  }

  const body = await request.json();

  if (body.action === "patient") {
    const patientStage = body.patientStage;
    const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : "";
    const assessmentNotes =
      typeof body.assessmentNotes === "string" ? body.assessmentNotes.trim() : "";
    const carePlan = typeof body.carePlan === "string" ? body.carePlan.trim() : "";
    const agreedCost = Number(body.agreedCost);

    if (!patientStages.includes(patientStage) || !Number.isFinite(agreedCost) || agreedCost < 0) {
      return NextResponse.json({ error: "Hasta kaydı geçersiz." }, { status: 400 });
    }

    if (scheduledAt && Number.isNaN(Date.parse(scheduledAt))) {
      return NextResponse.json({ error: "Randevu tarihi geçersiz." }, { status: 400 });
    }

    if (assessmentNotes.length > 5000 || carePlan.length > 5000) {
      return NextResponse.json(
        { error: "Değerlendirme ve bakım notları en fazla 5000 karakter olabilir." },
        { status: 400 },
      );
    }

    await updatePatientRecord(id, {
      patientStage,
      scheduledAt,
      assessmentNotes,
      carePlan,
      agreedCost,
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "payment") {
    const amount = Number(body.amount);
    const paidOn = typeof body.paidOn === "string" ? body.paidOn : "";
    const method = typeof body.method === "string" ? body.method.trim() : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (!Number.isFinite(amount) || amount <= 0 || !paidOn || Number.isNaN(Date.parse(paidOn))) {
      return NextResponse.json({ error: "Tahsilat bilgileri geçersiz." }, { status: 400 });
    }

    await addPatientPayment(id, { amount, paidOn, method, note });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "careTask") {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const dueDate = typeof body.dueDate === "string" ? body.dueDate : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (!title || title.length > 240 || (dueDate && Number.isNaN(Date.parse(dueDate)))) {
      return NextResponse.json({ error: "Bakım görevi bilgileri geçersiz." }, { status: 400 });
    }

    await addCareTask(id, { title, dueDate, note });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "followUp") {
    const followUpDate = typeof body.followUpDate === "string" ? body.followUpDate : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (!followUpDate || Number.isNaN(Date.parse(followUpDate)) || note.length > 5000) {
      return NextResponse.json({ error: "Günlük takip bilgileri geçersiz." }, { status: 400 });
    }

    await addDailyFollowUp(id, { followUpDate, note });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Bilinmeyen işlem." }, { status: 400 });
}
