import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PatientWorkflow } from "@/components/patient-workflow";
import { hasAdminSession } from "@/lib/admin-auth";
import { getAppointmentRequest, type PatientStage } from "@/lib/appointments";

type PatientDetailPageProps = {
  params: Promise<{ id: string }>;
};

const stageLabels: Record<PatientStage, string> = {
  lead: "Yeni başvuru",
  scheduled: "Randevu planlandı",
  assessment: "Değerlendirme",
  care_plan: "Bakım planı",
  treatment: "Uygulamada",
  follow_up: "Günlük takip",
  completed: "Tamamlandı",
  closed: "Kapandı",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Belirtilmedi";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
    timeZone: "Europe/Istanbul",
  }).format(new Date(value));
}

export const metadata = {
  title: "Hasta Kaydı",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  if (!(await hasAdminSession())) {
    redirect("/yonetim");
  }

  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isSafeInteger(id) || id < 1) {
    notFound();
  }

  const patient = await getAppointmentRequest(id);

  if (!patient) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f4fafc] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/yonetim" className="text-sm font-semibold text-[#008daf] hover:underline">
          ← Hasta yönetimine dön
        </Link>
        <header className="mt-6 rounded-3xl bg-[#294b58] p-7 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fdded]">
            {stageLabels[patient.patientStage]}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{patient.fullName}</h1>
          <p className="mt-4 text-[#d5eef4]">
            {patient.phone}
            {patient.email ? ` · ${patient.email}` : ""}
          </p>
          <p className="mt-2 text-sm text-[#bce7f0]">
            Randevu: {formatDate(patient.scheduledAt)}
          </p>
        </header>

        <PatientWorkflow initialPatient={patient} />
      </div>
    </main>
  );
}
