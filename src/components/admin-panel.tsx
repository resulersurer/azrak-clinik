"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AppointmentRequest, PatientStage } from "@/lib/appointments";

type PatientDraft = {
  patientStage: PatientStage;
  scheduledAt: string;
  assessmentNotes: string;
  carePlan: string;
  agreedCost: string;
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

function createDraft(patient: AppointmentRequest): PatientDraft {
  return {
    patientStage: patient.patientStage,
    scheduledAt: patient.scheduledAt ? patient.scheduledAt.slice(0, 16) : "",
    assessmentNotes: patient.assessmentNotes ?? "",
    carePlan: patient.carePlan ?? "",
    agreedCost: String(patient.agreedCost || ""),
  };
}

export function AdminPanel() {
  const [patients, setPatients] = useState<AppointmentRequest[]>([]);
  const [drafts, setDrafts] = useState<Record<number, PatientDraft>>({});
  const [authenticated, setAuthenticated] = useState<boolean | undefined>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [paymentInputs, setPaymentInputs] = useState<Record<number, string>>({});
  const [careTaskInputs, setCareTaskInputs] = useState<Record<number, string>>({});
  const [followUpInputs, setFollowUpInputs] = useState<Record<number, string>>({});

  function applyPatients(records: AppointmentRequest[]) {
    setPatients(records);
    setDrafts(Object.fromEntries(records.map((patient) => [patient.id, createDraft(patient)])));
  }

  async function loadPatients() {
    const response = await fetch("/api/admin/appointments");

    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }

    if (!response.ok) {
      setError("Hasta kayıtları yüklenemedi.");
      setAuthenticated(true);
      return;
    }

    applyPatients((await response.json()) as AppointmentRequest[]);
    setAuthenticated(true);
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/admin/appointments", { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401) {
          setAuthenticated(false);
          return;
        }

        if (!response.ok) {
          setError("Hasta kayıtları yüklenemedi.");
          setAuthenticated(true);
          return;
        }

        applyPatients((await response.json()) as AppointmentRequest[]);
        setAuthenticated(true);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError("Hasta kayıtları yüklenemedi.");
        setAuthenticated(true);
      });

    return () => controller.abort();
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError("Parola hatalı veya panel yapılandırılmamış.");
      return;
    }

    setPassword("");
    await loadPatients();
  }

  async function sendAction(id: number, payload: object) {
    setError("");
    const response = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "Hasta kaydı güncellenemedi.");
      return false;
    }

    await loadPatients();
    return true;
  }

  async function savePatient(id: number) {
    const draft = drafts[id];

    await sendAction(id, {
      action: "patient",
      ...draft,
      agreedCost: Number(draft.agreedCost || 0),
    });
  }

  async function addPayment(id: number) {
    const amount = Number(paymentInputs[id]);

    if (
      await sendAction(id, {
        action: "payment",
        amount,
        paidOn: new Date().toISOString().slice(0, 10),
        method: "Tahsilat",
      })
    ) {
      setPaymentInputs({ ...paymentInputs, [id]: "" });
    }
  }

  async function addTask(id: number) {
    const title = careTaskInputs[id]?.trim();

    if (
      await sendAction(id, {
        action: "careTask",
        title,
      })
    ) {
      setCareTaskInputs({ ...careTaskInputs, [id]: "" });
    }
  }

  async function addFollowUp(id: number) {
    const note = followUpInputs[id]?.trim();

    if (
      await sendAction(id, {
        action: "followUp",
        followUpDate: new Date().toISOString().slice(0, 10),
        note,
      })
    ) {
      setFollowUpInputs({ ...followUpInputs, [id]: "" });
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPatients([]);
  }

  const stageCounts = patients.reduce<Record<PatientStage, number>>(
    (counts, patient) => ({ ...counts, [patient.patientStage]: counts[patient.patientStage] + 1 }),
    Object.fromEntries(stages.map((stage) => [stage, 0])) as Record<PatientStage, number>,
  );
  const totalAgreedCost = patients.reduce((total, patient) => total + patient.agreedCost, 0);
  const totalPaid = patients.reduce((total, patient) => total + patient.totalPaid, 0);

  if (authenticated === undefined) {
    return <p className="p-8 text-[#54727d]">Yönetim paneli yükleniyor...</p>;
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eaf8fc] p-6">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
            Azrak Hair Transplant
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Hasta yönetimi girişi</h1>
          <label className="mt-8 grid gap-2 text-sm font-medium">
            Yönetici parolası
            <input
              required
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-[#cbe4ea] px-4 py-3 text-base outline-none ring-[#0097be] focus:ring-2"
            />
          </label>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <button className="mt-6 rounded-full bg-[#0097be] px-6 py-3 font-semibold text-white transition hover:bg-[#00add6]">
            Giriş yap
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4fafc] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
              Azrak Hair Transplant
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Hasta yolculuğu</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#54727d]">
              Başvurudan günlük takibe kadar her hasta kaydını, bakım planını ve
              tahsilat durumunu tek ekrandan yönetin.
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-[#b9dce5] px-5 py-2 text-sm font-semibold transition hover:bg-[#e1f5f9]"
          >
            Çıkış yap
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardMetric label="Aktif hasta" value={String(patients.length)} />
          <DashboardMetric label="Paket toplamı" value={formatCurrency(totalAgreedCost)} />
          <DashboardMetric label="Tahsil edilen" value={formatCurrency(totalPaid)} />
          <DashboardMetric
            label="Kalan bakiye"
            value={formatCurrency(totalAgreedCost - totalPaid)}
          />
        </section>
        <section className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {stages.map((stage) => (
            <div
              key={stage}
              className="min-w-36 rounded-2xl border border-[#d3e7ec] bg-white px-4 py-3"
            >
              <p className="text-xs font-semibold text-[#54727d]">{stageLabels[stage]}</p>
              <p className="mt-1 text-2xl font-semibold">{stageCounts[stage]}</p>
            </div>
          ))}
        </section>

        {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        <section className="mt-8 space-y-6">
          {patients.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-[#54727d]">
              Henüz formdan gelen hasta başvurusu bulunmuyor.
            </p>
          ) : (
            patients.map((patient) => {
              const draft = drafts[patient.id];

              return (
                <article key={patient.id} className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-[#008daf]">
                        {stageLabels[patient.patientStage]}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold">{patient.fullName}</h2>
                      <p className="mt-2 text-[#54727d]">
                        {patient.phone}
                        {patient.email ? ` · ${patient.email}` : ""}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#eaf8fc] px-5 py-3 text-right">
                      <p className="text-xs font-semibold text-[#54727d]">Kalan bakiye</p>
                      <p className="mt-1 text-xl font-semibold text-[#28718a]">
                        {formatCurrency(patient.balance)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <label className="grid gap-2 text-sm font-medium">
                      Hasta aşaması
                      <select
                        value={draft?.patientStage ?? "lead"}
                        onChange={(event) =>
                          setDrafts({
                            ...drafts,
                            [patient.id]: {
                              ...draft,
                              patientStage: event.target.value as PatientStage,
                            },
                          })
                        }
                        className="rounded-xl border border-[#cbe4ea] bg-white px-3 py-3"
                      >
                        {stages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stageLabels[stage]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Randevu tarihi ve saati
                      <input
                        type="datetime-local"
                        value={draft?.scheduledAt ?? ""}
                        onChange={(event) =>
                          setDrafts({
                            ...drafts,
                            [patient.id]: { ...draft, scheduledAt: event.target.value },
                          })
                        }
                        className="rounded-xl border border-[#cbe4ea] px-3 py-3"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Anlaşılan paket bedeli (TL)
                      <input
                        min="0"
                        type="number"
                        inputMode="decimal"
                        value={draft?.agreedCost ?? ""}
                        onChange={(event) =>
                          setDrafts({
                            ...drafts,
                            [patient.id]: { ...draft, agreedCost: event.target.value },
                          })
                        }
                        className="rounded-xl border border-[#cbe4ea] px-3 py-3"
                      />
                    </label>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      Değerlendirme notları
                      <textarea
                        value={draft?.assessmentNotes ?? ""}
                        onChange={(event) =>
                          setDrafts({
                            ...drafts,
                            [patient.id]: { ...draft, assessmentNotes: event.target.value },
                          })
                        }
                        className="min-h-28 rounded-xl border border-[#cbe4ea] px-3 py-3"
                        placeholder="Muayene ve kontrol notları"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Bakım ve uygulama planı
                      <textarea
                        value={draft?.carePlan ?? ""}
                        onChange={(event) =>
                          setDrafts({
                            ...drafts,
                            [patient.id]: { ...draft, carePlan: event.target.value },
                          })
                        }
                        className="min-h-28 rounded-xl border border-[#cbe4ea] px-3 py-3"
                        placeholder="Planlanan bakım, uygulama ve kontrol adımları"
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => void savePatient(patient.id)}
                    className="mt-5 rounded-full bg-[#0097be] px-5 py-3 font-semibold text-white transition hover:bg-[#00add6]"
                  >
                    Hasta planını kaydet
                  </button>

                  <div className="mt-8 grid gap-5 xl:grid-cols-3">
                    <WorkflowPanel title="Tahsilat ve bakiye">
                      <p className="text-sm text-[#54727d]">
                        Paket: {formatCurrency(patient.agreedCost)} · Tahsilat:{" "}
                        {formatCurrency(patient.totalPaid)}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <input
                          min="0"
                          type="number"
                          inputMode="decimal"
                          value={paymentInputs[patient.id] ?? ""}
                          onChange={(event) =>
                            setPaymentInputs({ ...paymentInputs, [patient.id]: event.target.value })
                          }
                          placeholder="Tahsilat tutarı"
                          className="min-w-0 flex-1 rounded-xl border border-[#cbe4ea] px-3 py-2"
                        />
                        <button
                          onClick={() => void addPayment(patient.id)}
                          className="rounded-xl bg-[#e1f5f9] px-3 text-sm font-semibold text-[#28718a]"
                        >
                          Ekle
                        </button>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-[#54727d]">
                        {patient.payments.map((payment) => (
                          <li key={payment.id} className="flex justify-between">
                            <span>{formatDate(payment.paidOn)}</span>
                            <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                          </li>
                        ))}
                      </ul>
                    </WorkflowPanel>

                    <WorkflowPanel title="Bakım görevleri">
                      <div className="flex gap-2">
                        <input
                          value={careTaskInputs[patient.id] ?? ""}
                          onChange={(event) =>
                            setCareTaskInputs({ ...careTaskInputs, [patient.id]: event.target.value })
                          }
                          placeholder="Örn. Kontrol görüşmesi"
                          className="min-w-0 flex-1 rounded-xl border border-[#cbe4ea] px-3 py-2"
                        />
                        <button
                          onClick={() => void addTask(patient.id)}
                          className="rounded-xl bg-[#e1f5f9] px-3 text-sm font-semibold text-[#28718a]"
                        >
                          Ekle
                        </button>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-[#54727d]">
                        {patient.careTasks.map((task) => (
                          <li key={task.id}>
                            <span className="font-medium text-[#355b68]">{task.title}</span>
                            {task.dueDate ? ` · ${formatDate(task.dueDate)}` : ""}
                          </li>
                        ))}
                      </ul>
                    </WorkflowPanel>

                    <WorkflowPanel title="Günlük takip">
                      <div className="flex gap-2">
                        <input
                          value={followUpInputs[patient.id] ?? ""}
                          onChange={(event) =>
                            setFollowUpInputs({ ...followUpInputs, [patient.id]: event.target.value })
                          }
                          placeholder="Bugünkü takip notu"
                          className="min-w-0 flex-1 rounded-xl border border-[#cbe4ea] px-3 py-2"
                        />
                        <button
                          onClick={() => void addFollowUp(patient.id)}
                          className="rounded-xl bg-[#e1f5f9] px-3 text-sm font-semibold text-[#28718a]"
                        >
                          Kaydet
                        </button>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-[#54727d]">
                        {patient.followUps.map((followUp) => (
                          <li key={followUp.id}>
                            <span className="font-medium text-[#355b68]">
                              {formatDate(followUp.followUpDate)}
                            </span>
                            {followUp.note ? ` · ${followUp.note}` : ""}
                          </li>
                        ))}
                      </ul>
                    </WorkflowPanel>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[#54727d]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function WorkflowPanel({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-2xl border border-[#d3e7ec] p-5">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
