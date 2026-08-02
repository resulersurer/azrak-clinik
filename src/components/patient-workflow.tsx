"use client";

import { FormEvent, useState } from "react";
import type { AppointmentRequest, PatientStage } from "@/lib/appointments";

type PatientDraft = {
  patientStage: PatientStage;
  scheduledAt: string;
  assessmentNotes: string;
  carePlan: string;
  agreedCost: string;
};

type PaymentDraft = {
  amount: string;
  paidOn: string;
  method: string;
  note: string;
};

type CareTaskDraft = {
  title: string;
  dueDate: string;
  note: string;
};

type FollowUpDraft = {
  followUpDate: string;
  note: string;
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

const stages = Object.keys(stageLabels) as PatientStage[];

function createPatientDraft(patient: AppointmentRequest): PatientDraft {
  return {
    patientStage: patient.patientStage,
    scheduledAt: patient.scheduledAt ? patient.scheduledAt.slice(0, 16) : "",
    assessmentNotes: patient.assessmentNotes ?? "",
    carePlan: patient.carePlan ?? "",
    agreedCost: String(patient.agreedCost || ""),
  };
}

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

export function PatientWorkflow({ initialPatient }: { initialPatient: AppointmentRequest }) {
  const [patient, setPatient] = useState(initialPatient);
  const [draft, setDraft] = useState(() => createPatientDraft(initialPatient));
  const [payment, setPayment] = useState<PaymentDraft>({
    amount: "",
    paidOn: "",
    method: "",
    note: "",
  });
  const [careTask, setCareTask] = useState<CareTaskDraft>({ title: "", dueDate: "", note: "" });
  const [followUp, setFollowUp] = useState<FollowUpDraft>({ followUpDate: "", note: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const currentStageIndex = stages.indexOf(draft.patientStage);

  async function refreshPatient() {
    const response = await fetch(`/api/admin/appointments/${patient.id}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Hasta kaydı yenilenemedi.");
    }

    setPatient((await response.json()) as AppointmentRequest);
  }

  async function sendAction(payload: object, successMessage: string) {
    setError("");
    setNotice("");
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/appointments/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Hasta kaydı güncellenemedi.");
      }

      await refreshPatient();
      setNotice(successMessage);
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Hasta kaydı güncellenemedi.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function savePatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendAction(
      { action: "patient", ...draft, agreedCost: Number(draft.agreedCost || 0) },
      "Hasta planı kaydedildi.",
    );
  }

  async function addPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      await sendAction(
        { action: "payment", ...payment, amount: Number(payment.amount) },
        "Tahsilat kaydedildi.",
      )
    ) {
      setPayment({ amount: "", paidOn: "", method: "", note: "" });
    }
  }

  async function addCareTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await sendAction({ action: "careTask", ...careTask }, "Bakım görevi eklendi.")) {
      setCareTask({ title: "", dueDate: "", note: "" });
    }
  }

  async function addFollowUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await sendAction({ action: "followUp", ...followUp }, "Günlük takip kaydedildi.")) {
      setFollowUp({ followUpDate: "", note: "" });
    }
  }

  return (
    <div className="patient-workflow pb-10">
      <section className="mt-6 overflow-hidden rounded-[2rem] border border-[#d6edf1] bg-[linear-gradient(115deg,#143f4d_0%,#1a6475_58%,#0d91a9_100%)] p-6 text-white shadow-[0_20px_55px_-30px_rgba(15,80,97,0.65)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9e9f3]">Hasta yolculuğu</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Tedavi ve bakım durumu</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d2f0f4]">
              Klinik ekibi için plan, takip ve mali durum aynı çalışma alanında.
            </p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
            {stageLabels[draft.patientStage]}
          </span>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {stages.map((stage, index) => (
            <div key={stage} className="relative">
              <div className={`h-1 rounded-full ${index <= currentStageIndex ? "bg-[#79dfec]" : "bg-white/20"}`} />
              <p className={`mt-2 text-[10px] font-bold leading-4 ${index === currentStageIndex ? "text-white" : "text-[#b8dde3]"}`}>
                {stageLabels[stage]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Paket bedeli" value={formatCurrency(patient.agreedCost)} />
        <Metric label="Tahsil edilen" value={formatCurrency(patient.totalPaid)} />
        <Metric label="Kalan bakiye" value={formatCurrency(patient.balance)} />
      </section>

      {(error || notice) && (
        <p className={`mt-6 rounded-xl p-4 ${error ? "bg-red-50 text-red-700" : "bg-[#e1f5f9] text-[#28718a]"}`}>
          {error || notice}
        </p>
      )}

      <form onSubmit={savePatient} className="mt-6 rounded-[2rem] border border-[#deedf0] bg-white p-6 shadow-[0_18px_50px_-34px_rgba(21,77,94,0.45)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008daf]">Tedavi yönetimi</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#173f4d]">Hasta planı</h2>
          </div>
          <button disabled={saving} className="rounded-full bg-[#008daf] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#008daf]/20 transition hover:bg-[#007b98] disabled:cursor-not-allowed disabled:opacity-60">
            Planı kaydet
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Field label="Hasta aşaması">
            <select value={draft.patientStage} onChange={(event) => setDraft({ ...draft, patientStage: event.target.value as PatientStage })}>
              {stages.map((stage) => <option key={stage} value={stage}>{stageLabels[stage]}</option>)}
            </select>
          </Field>
          <Field label="Randevu tarihi ve saati">
            <input type="datetime-local" value={draft.scheduledAt} onChange={(event) => setDraft({ ...draft, scheduledAt: event.target.value })} />
          </Field>
          <Field label="Anlaşılan paket bedeli (TL)">
            <input min="0" type="number" inputMode="decimal" value={draft.agreedCost} onChange={(event) => setDraft({ ...draft, agreedCost: event.target.value })} />
          </Field>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Değerlendirme notları">
            <textarea value={draft.assessmentNotes} onChange={(event) => setDraft({ ...draft, assessmentNotes: event.target.value })} placeholder="Muayene, kontrol ve uygunluk notları" />
          </Field>
          <Field label="Bakım ve uygulama planı">
            <textarea value={draft.carePlan} onChange={(event) => setDraft({ ...draft, carePlan: event.target.value })} placeholder="Planlanan uygulama, bakım ve kontrol adımları" />
          </Field>
        </div>
      </form>

      <section className="mt-6 grid gap-5 xl:grid-cols-3">
        <WorkflowCard title="Tahsilat">
          <p className="text-sm text-[#54727d]">Kalan bakiye: <strong className="text-[#28718a]">{formatCurrency(patient.balance)}</strong></p>
          <form onSubmit={addPayment} className="mt-4 grid gap-3">
            <input required min="0.01" step="0.01" type="number" inputMode="decimal" value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} placeholder="Tahsilat tutarı (TL)" />
            <input required type="date" value={payment.paidOn} onChange={(event) => setPayment({ ...payment, paidOn: event.target.value })} />
            <input value={payment.method} onChange={(event) => setPayment({ ...payment, method: event.target.value })} placeholder="Ödeme yöntemi" />
            <textarea value={payment.note} onChange={(event) => setPayment({ ...payment, note: event.target.value })} placeholder="Tahsilat notu (isteğe bağlı)" />
            <ActionButton disabled={saving}>Tahsilat ekle</ActionButton>
          </form>
          <RecordList>
            {patient.payments.length === 0 ? <p>Henüz tahsilat kaydı yok.</p> : patient.payments.map((item) => (
              <li key={item.id}><strong>{formatCurrency(item.amount)}</strong><span>{formatDate(item.paidOn)}{item.method ? ` · ${item.method}` : ""}{item.note ? ` · ${item.note}` : ""}</span></li>
            ))}
          </RecordList>
        </WorkflowCard>

        <WorkflowCard title="Bakım görevleri">
          <form onSubmit={addCareTask} className="grid gap-3">
            <input required maxLength={240} value={careTask.title} onChange={(event) => setCareTask({ ...careTask, title: event.target.value })} placeholder="Görev başlığı" />
            <input type="date" value={careTask.dueDate} onChange={(event) => setCareTask({ ...careTask, dueDate: event.target.value })} />
            <textarea value={careTask.note} onChange={(event) => setCareTask({ ...careTask, note: event.target.value })} placeholder="Görev notu (isteğe bağlı)" />
            <ActionButton disabled={saving}>Görev ekle</ActionButton>
          </form>
          <RecordList>
            {patient.careTasks.length === 0 ? <p>Henüz bakım görevi yok.</p> : patient.careTasks.map((item) => (
              <li key={item.id}>
                <label className="flex items-start gap-2"><input type="checkbox" checked={item.completed} disabled={saving} onChange={(event) => void sendAction({ action: "careTaskStatus", taskId: item.id, completed: event.target.checked }, "Bakım görevi güncellendi.")} /><span className={item.completed ? "line-through opacity-60" : ""}><strong>{item.title}</strong><br />{item.dueDate ? formatDate(item.dueDate) : "Tarih belirtilmedi"}{item.note ? ` · ${item.note}` : ""}</span></label>
              </li>
            ))}
          </RecordList>
        </WorkflowCard>

        <WorkflowCard title="Günlük takip">
          <form onSubmit={addFollowUp} className="grid gap-3">
            <input required type="date" value={followUp.followUpDate} onChange={(event) => setFollowUp({ ...followUp, followUpDate: event.target.value })} />
            <textarea value={followUp.note} onChange={(event) => setFollowUp({ ...followUp, note: event.target.value })} placeholder="Günlük takip notu" />
            <ActionButton disabled={saving}>Takip kaydı ekle</ActionButton>
          </form>
          <RecordList>
            {patient.followUps.length === 0 ? <p>Henüz günlük takip kaydı yok.</p> : patient.followUps.map((item) => (
              <li key={item.id}>
                <label className="flex items-start gap-2"><input type="checkbox" checked={item.completed} disabled={saving} onChange={(event) => void sendAction({ action: "followUpStatus", followUpId: item.id, completed: event.target.checked }, "Günlük takip güncellendi.")} /><span className={item.completed ? "line-through opacity-60" : ""}><strong>{formatDate(item.followUpDate)}</strong>{item.note ? ` · ${item.note}` : ""}</span></label>
              </li>
            ))}
          </RecordList>
        </WorkflowCard>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#deedf0] bg-white p-5 shadow-[0_14px_35px_-28px_rgba(21,77,94,0.6)]">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#67848d]">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-[#173f4d]">{value}</p>
    </div>
  );
}

function Field({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return <label className="grid gap-2 text-sm font-bold text-[#355b68]">{label}{children}</label>;
}

function WorkflowCard({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-[1.75rem] border border-[#deedf0] bg-white p-6 shadow-[0_18px_50px_-34px_rgba(21,77,94,0.45)]">
      <h2 className="text-xl font-bold tracking-tight text-[#173f4d]">{title}</h2>
      {children}
    </section>
  );
}

function ActionButton({ children, disabled }: Readonly<{ children: React.ReactNode; disabled: boolean }>) {
  return (
    <button disabled={disabled} className="rounded-xl bg-[#e1f5f9] px-4 py-3 text-sm font-bold text-[#146d82] transition hover:bg-[#c9edf4] disabled:cursor-not-allowed disabled:opacity-60">
      {children}
    </button>
  );
}

function RecordList({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ul className="mt-5 space-y-3 border-t border-[#e5f1f4] pt-4 text-sm leading-6 text-[#54727d]">{children}</ul>;
}
