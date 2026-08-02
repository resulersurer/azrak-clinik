import { neon } from "@neondatabase/serverless";

export type AppointmentStatus = "pending" | "approved" | "rejected";

export type AppointmentRequest = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  status: AppointmentStatus;
  scheduledAt: string | null;
  createdAt: string;
};

export type PublicAppointment = {
  scheduledAt: string;
};

let schemaPromise: Promise<void> | undefined;

function database() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(connectionString);
}

async function ensureSchema() {
  if (!schemaPromise) {
    const sql = database();
    schemaPromise = sql`
      CREATE TABLE IF NOT EXISTS appointment_requests (
        id BIGSERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        preferred_date DATE,
        preferred_time TEXT,
        message TEXT,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'approved', 'rejected')),
        scheduled_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined);
  }

  await schemaPromise;
}

export async function createAppointmentRequest(input: {
  fullName: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}) {
  await ensureSchema();
  const sql = database();

  await sql`
    INSERT INTO appointment_requests (
      full_name,
      phone,
      email,
      preferred_date,
      preferred_time,
      message
    )
    VALUES (
      ${input.fullName},
      ${input.phone},
      ${input.email || null},
      ${input.preferredDate || null},
      ${input.preferredTime || null},
      ${input.message || null}
    )
  `;
}

export async function getAppointmentRequests(): Promise<AppointmentRequest[]> {
  await ensureSchema();
  const sql = database();
  const rows = await sql`
    SELECT
      id,
      full_name AS "fullName",
      phone,
      email,
      preferred_date::TEXT AS "preferredDate",
      preferred_time AS "preferredTime",
      message,
      status,
      scheduled_at::TEXT AS "scheduledAt",
      created_at::TEXT AS "createdAt"
    FROM appointment_requests
    ORDER BY
      CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
      created_at DESC
  `;

  return rows as AppointmentRequest[];
}

export async function updateAppointmentRequest(
  id: number,
  status: AppointmentStatus,
  scheduledAt?: string,
) {
  await ensureSchema();
  const sql = database();

  if (status === "approved") {
    if (!scheduledAt) {
      throw new Error("An approved appointment requires a scheduled time.");
    }

    await sql`
      UPDATE appointment_requests
      SET status = 'approved', scheduled_at = ${scheduledAt}::timestamptz
      WHERE id = ${id}
    `;
    return;
  }

  await sql`
    UPDATE appointment_requests
    SET status = ${status}, scheduled_at = NULL
    WHERE id = ${id}
  `;
}

export async function getPublicAppointments(): Promise<PublicAppointment[]> {
  await ensureSchema();
  const sql = database();
  const rows = await sql`
    SELECT scheduled_at::TEXT AS "scheduledAt"
    FROM appointment_requests
    WHERE status = 'approved' AND scheduled_at >= NOW()
    ORDER BY scheduled_at ASC
    LIMIT 12
  `;

  return rows as PublicAppointment[];
}
