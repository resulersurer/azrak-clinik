import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);
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

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric label="Paket bedeli" value={formatCurrency(patient.agreedCost)} />
          <Metric label="Tahsil edilen" value={formatCurrency(patient.totalPaid)} />
          <Metric label="Kalan bakiye" value={formatCurrency(patient.balance)} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <DetailCard title="Değerlendirme notları">
            {patient.assessmentNotes ?? "Henüz değerlendirme notu eklenmedi."}
          </DetailCard>
          <DetailCard title="Bakım ve uygulama planı">
            {patient.carePlan ?? "Henüz bakım planı eklenmedi."}
          </DetailCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <ListCard title="Tahsilatlar">
            {patient.payments.length === 0 ? (
              <p>Henüz tahsilat kaydı yok.</p>
            ) : (
              patient.payments.map((payment) => (
                <p key={payment.id}>
                  {formatDate(payment.paidOn)} · {formatCurrency(payment.amount)}
                </p>
              ))
            )}
          </ListCard>
          <ListCard title="Bakım görevleri">
            {patient.careTasks.length === 0 ? (
              <p>Henüz bakım görevi yok.</p>
            ) : (
              patient.careTasks.map((task) => (
                <p key={task.id}>
                  {task.title}
                  {task.dueDate ? ` · ${formatDate(task.dueDate)}` : ""}
                </p>
              ))
            )}
          </ListCard>
          <ListCard title="Günlük takip">
            {patient.followUps.length === 0 ? (
              <p>Henüz günlük takip kaydı yok.</p>
            ) : (
              patient.followUps.map((followUp) => (
                <p key={followUp.id}>
                  {formatDate(followUp.followUpDate)}
                  {followUp.note ? ` · ${followUp.note}` : ""}
                </p>
              ))
            )}
          </ListCard>
        </section>

        <Link
          href="/yonetim"
          className="mt-8 inline-flex rounded-full bg-[#0097be] px-6 py-3 font-semibold text-white transition hover:bg-[#00add6]"
        >
          Kayıt üzerinde çalışmak için yönetime dön
        </Link>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-[#54727d]">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function DetailCard({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-4 whitespace-pre-wrap leading-7 text-[#52727d]">{children}</p>
    </section>
  );
}

function ListCard({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3 leading-7 text-[#52727d]">{children}</div>
    </section>
  );
}
