import { NextResponse } from "next/server";
import {
  createAppointmentRequest,
  getPublicAppointments,
} from "@/lib/appointments";

export async function GET() {
  return NextResponse.json(await getPublicAppointments());
}

export async function POST(request: Request) {
  const body = await request.json();
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const preferredDate =
    typeof body.preferredDate === "string" ? body.preferredDate : "";
  const preferredTime =
    typeof body.preferredTime === "string" ? body.preferredTime : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (fullName.length < 2 || fullName.length > 120 || phone.length < 7 || phone.length > 32) {
    return NextResponse.json(
      { error: "Lütfen ad soyad ve geçerli telefon numarası girin." },
      { status: 400 },
    );
  }

  if (email && (!email.includes("@") || email.length > 160)) {
    return NextResponse.json(
      { error: "Lütfen geçerli bir e-posta adresi girin." },
      { status: 400 },
    );
  }

  if (message.length > 2000) {
    return NextResponse.json(
      { error: "Mesaj en fazla 2000 karakter olabilir." },
      { status: 400 },
    );
  }

  await createAppointmentRequest({
    fullName,
    phone,
    email,
    preferredDate,
    preferredTime,
    message,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
