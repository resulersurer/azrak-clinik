import { neon } from "@neondatabase/serverless";

export type AppointmentStatus = "pending" | "approved" | "rejected";
export type PatientStage =
  | "lead"
  | "scheduled"
  | "assessment"
  | "care_plan"
  | "treatment"
  | "follow_up"
  | "completed"
  | "closed";

export type PatientPayment = {
  id: number;
  amount: number;
  paidOn: string;
  method: string | null;
  note: string | null;
};

export type CareTask = {
  id: number;
  title: string;
  dueDate: string | null;
  completed: boolean;
  note: string | null;
};

export type DailyFollowUp = {
  id: number;
  followUpDate: string;
  completed: boolean;
  note: string | null;
};

export type AppointmentRequest = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  status: AppointmentStatus;
  patientStage: PatientStage;
  scheduledAt: string | null;
  assessmentNotes: string | null;
  carePlan: string | null;
  agreedCost: number;
  totalPaid: number;
  balance: number;
  payments: PatientPayment[];
  careTasks: CareTask[];
  followUps: DailyFollowUp[];
  createdAt: string;
};

export type PublicAppointment = {
  scheduledAt: string;
};

export type CalendarEvent = {
  id: string;
  appointmentId: number;
  patientName: string;
  title: string;
  startsAt: string;
  kind: "appointment" | "care_task" | "follow_up";
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
    schemaPromise = (async () => {
      await sql`
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
      `;
      await sql`
        ALTER TABLE appointment_requests
          ADD COLUMN IF NOT EXISTS patient_stage TEXT NOT NULL DEFAULT 'lead'
            CHECK (patient_stage IN (
              'lead', 'scheduled', 'assessment', 'care_plan',
              'treatment', 'follow_up', 'completed', 'closed'
            )),
          ADD COLUMN IF NOT EXISTS assessment_notes TEXT,
          ADD COLUMN IF NOT EXISTS care_plan TEXT,
          ADD COLUMN IF NOT EXISTS agreed_cost NUMERIC(12, 2) NOT NULL DEFAULT 0
      `;
      await sql`
        UPDATE appointment_requests
        SET patient_stage = CASE
          WHEN status = 'approved' THEN 'scheduled'
          WHEN status = 'rejected' THEN 'closed'
          ELSE 'lead'
        END
        WHERE patient_stage = 'lead' AND status <> 'pending'
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS patient_payments (
          id BIGSERIAL PRIMARY KEY,
          appointment_id BIGINT NOT NULL REFERENCES appointment_requests(id) ON DELETE CASCADE,
          amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
          paid_on DATE NOT NULL,
          method TEXT,
          note TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS care_tasks (
          id BIGSERIAL PRIMARY KEY,
          appointment_id BIGINT NOT NULL REFERENCES appointment_requests(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          due_date DATE,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          note TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS daily_follow_ups (
          id BIGSERIAL PRIMARY KEY,
          appointment_id BIGINT NOT NULL REFERENCES appointment_requests(id) ON DELETE CASCADE,
          follow_up_date DATE NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          note TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })();
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
      full_name, phone, email, preferred_date, preferred_time, message
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

type AppointmentRow = Omit<
  AppointmentRequest,
  "agreedCost" | "totalPaid" | "balance" | "payments" | "careTasks" | "followUps"
> & {
  agreedCost: string;
};

export async function getAppointmentRequests(): Promise<AppointmentRequest[]> {
  await ensureSchema();
  const sql = database();
  const rows = (await sql`
    SELECT
      id,
      full_name AS "fullName",
      phone,
      email,
      preferred_date::TEXT AS "preferredDate",
      preferred_time AS "preferredTime",
      message,
      status,
      patient_stage AS "patientStage",
      scheduled_at::TEXT AS "scheduledAt",
      assessment_notes AS "assessmentNotes",
      care_plan AS "carePlan",
      agreed_cost::TEXT AS "agreedCost",
      created_at::TEXT AS "createdAt"
    FROM appointment_requests
    ORDER BY
      CASE patient_stage
        WHEN 'lead' THEN 0
        WHEN 'scheduled' THEN 1
        WHEN 'assessment' THEN 2
        WHEN 'care_plan' THEN 3
        WHEN 'treatment' THEN 4
        WHEN 'follow_up' THEN 5
        ELSE 6
      END,
      created_at DESC
  `) as AppointmentRow[];

  return Promise.all(
    rows.map(async (row) => {
      const patientId = Number(row.id);
      const [payments, careTasks, followUps] = await Promise.all([
        sql`
          SELECT
            id,
            amount::TEXT AS amount,
            paid_on::TEXT AS "paidOn",
            method,
            note
          FROM patient_payments
          WHERE appointment_id = ${patientId}
          ORDER BY paid_on DESC, id DESC
        `,
        sql`
          SELECT
            id,
            title,
            due_date::TEXT AS "dueDate",
            completed,
            note
          FROM care_tasks
          WHERE appointment_id = ${patientId}
          ORDER BY completed ASC, due_date ASC NULLS LAST, id DESC
        `,
        sql`
          SELECT
            id,
            follow_up_date::TEXT AS "followUpDate",
            completed,
            note
          FROM daily_follow_ups
          WHERE appointment_id = ${patientId}
          ORDER BY follow_up_date DESC, id DESC
        `,
      ]);
      const normalizedPayments = (payments as Array<Omit<PatientPayment, "amount"> & { amount: string }>).map(
        (payment) => ({ ...payment, amount: Number(payment.amount) }),
      );
      const totalPaid = normalizedPayments.reduce((total, payment) => total + payment.amount, 0);
      const agreedCost = Number(row.agreedCost);

      return {
        ...row,
        id: patientId,
        agreedCost,
        totalPaid,
        balance: agreedCost - totalPaid,
        payments: normalizedPayments,
        careTasks: careTasks as CareTask[],
        followUps: followUps as DailyFollowUp[],
      };
    }),
  );
}

export async function getAppointmentRequest(id: number) {
  const patients = await getAppointmentRequests();
  return patients.find((patient) => patient.id === id);
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const patients = await getAppointmentRequests();

  return patients.flatMap((patient) => [
    ...(patient.scheduledAt
      ? [
          {
            id: `appointment-${patient.id}`,
            appointmentId: patient.id,
            patientName: patient.fullName,
            title: "Randevu",
            startsAt: patient.scheduledAt,
            kind: "appointment" as const,
          },
        ]
      : []),
    ...patient.careTasks.flatMap((task) =>
      task.dueDate
        ? [
            {
              id: `task-${task.id}`,
              appointmentId: patient.id,
              patientName: patient.fullName,
              title: task.title,
              startsAt: `${task.dueDate}T09:00:00`,
              kind: "care_task" as const,
            },
          ]
        : [],
    ),
    ...patient.followUps.map((followUp) => ({
      id: `follow-up-${followUp.id}`,
      appointmentId: patient.id,
      patientName: patient.fullName,
      title: "Günlük takip",
      startsAt: `${followUp.followUpDate}T10:00:00`,
      kind: "follow_up" as const,
    })),
  ]);
}

export async function updatePatientRecord(
  id: number,
  input: {
    patientStage: PatientStage;
    scheduledAt?: string;
    assessmentNotes?: string;
    carePlan?: string;
    agreedCost: number;
  },
) {
  await ensureSchema();
  const sql = database();
  const status: AppointmentStatus =
    input.patientStage === "lead"
      ? "pending"
      : input.patientStage === "closed"
        ? "rejected"
        : "approved";

  await sql`
    UPDATE appointment_requests
    SET
      status = ${status},
      patient_stage = ${input.patientStage},
      scheduled_at = ${input.scheduledAt || null}::timestamptz,
      assessment_notes = ${input.assessmentNotes || null},
      care_plan = ${input.carePlan || null},
      agreed_cost = ${input.agreedCost}
    WHERE id = ${id}
  `;
}

export async function addPatientPayment(
  appointmentId: number,
  input: { amount: number; paidOn: string; method?: string; note?: string },
) {
  await ensureSchema();
  const sql = database();

  await sql`
    INSERT INTO patient_payments (appointment_id, amount, paid_on, method, note)
    VALUES (
      ${appointmentId},
      ${input.amount},
      ${input.paidOn}::date,
      ${input.method || null},
      ${input.note || null}
    )
  `;
}

export async function addCareTask(
  appointmentId: number,
  input: { title: string; dueDate?: string; note?: string },
) {
  await ensureSchema();
  const sql = database();

  await sql`
    INSERT INTO care_tasks (appointment_id, title, due_date, note)
    VALUES (
      ${appointmentId},
      ${input.title},
      ${input.dueDate || null}::date,
      ${input.note || null}
    )
  `;
}

export async function addDailyFollowUp(
  appointmentId: number,
  input: { followUpDate: string; note?: string },
) {
  await ensureSchema();
  const sql = database();

  await sql`
    INSERT INTO daily_follow_ups (appointment_id, follow_up_date, note)
    VALUES (
      ${appointmentId},
      ${input.followUpDate}::date,
      ${input.note || null}
    )
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
