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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#e2f8fa_0%,#f4fafc_38%,#edf5f8_100%)] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/yonetim" className="inline-flex rounded-full border border-[#b9dce5] bg-white px-4 py-2 text-sm font-bold text-[#28718a] shadow-sm transition hover:bg-[#eaf8fc]">
          ← Hasta yönetimine dön
        </Link>
        <header className="mt-6 overflow-hidden rounded-[2rem] bg-[linear-gradient(115deg,#143f4d_0%,#1a6475_58%,#0d91a9_100%)] p-7 text-white shadow-[0_24px_65px_-32px_rgba(15,80,97,0.7)] sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9de9f3]">
            {stageLabels[patient.patientStage]}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">{patient.fullName}</h1>
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
