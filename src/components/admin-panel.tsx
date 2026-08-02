"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ClinicCalendar } from "@/components/clinic-calendar";
import type { AppointmentRequest, PatientStage } from "@/lib/appointments";

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
    return "—";
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

export function AdminPanel() {
  const [patients, setPatients] = useState<AppointmentRequest[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean | undefined>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

    setPatients((await response.json()) as AppointmentRequest[]);
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

        setPatients((await response.json()) as AppointmentRequest[]);
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

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPatients([]);
  }

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("tr-TR");
  const filteredPatients = normalizedQuery
    ? patients.filter((patient) =>
        [patient.fullName, patient.phone, patient.email ?? ""].some((value) =>
          value.toLocaleLowerCase("tr-TR").includes(normalizedQuery),
        ),
      )
    : patients;
  const totalAgreedCost = patients.reduce((total, patient) => total + patient.agreedCost, 0);
  const totalPaid = patients.reduce((total, patient) => total + patient.totalPaid, 0);

  if (authenticated === undefined) {
    return <p className="p-8 text-[#54727d]">Yönetim paneli yükleniyor...</p>;
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#d7f5f8_0%,#f4fafc_42%,#e8f3f7_100%)] p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/95 p-8 shadow-[0_28px_70px_-35px_rgba(21,77,94,0.55)] backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008daf]">
            Azrak Hair Transplant
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Hasta yönetimi</h1>
          <p className="mt-3 text-sm leading-6 text-[#54727d]">Klinik operasyonlarına güvenli erişim.</p>
          <label className="mt-8 grid gap-2 text-sm font-bold text-[#355b68]">
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
          <button className="mt-6 w-full rounded-full bg-[#008daf] px-6 py-3 font-bold text-white shadow-lg shadow-[#008daf]/20 transition hover:bg-[#007b98]">
            Giriş yap
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#e2f8fa_0%,#f4fafc_38%,#edf5f8_100%)] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-5 rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-[0_18px_55px_-38px_rgba(21,77,94,0.5)] backdrop-blur sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008daf]">
              Azrak Hair Transplant
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#173f4d]">Operasyon merkezi</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#54727d]">
              Hastalar, haftalık takvim ve finans durumunu tek merkezden takip edin.
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-[#b9dce5] bg-white px-5 py-2 text-sm font-bold text-[#355b68] transition hover:bg-[#e1f5f9]"
          >
            Çıkış yap
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Toplam hasta" value={String(patients.length)} />
          <Metric label="Paket toplamı" value={formatCurrency(totalAgreedCost)} />
          <Metric label="Tahsil edilen" value={formatCurrency(totalPaid)} />
          <Metric label="Kalan bakiye" value={formatCurrency(totalAgreedCost - totalPaid)} />
        </section>

        <ClinicCalendar />
        {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

        <section className="mt-8 rounded-[2rem] border border-[#deedf0] bg-white p-5 shadow-[0_20px_60px_-38px_rgba(21,77,94,0.5)] sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008daf]">
                Hasta listesi
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#173f4d]">Kayıtlar</h2>
            </div>
            <label className="w-full max-w-md">
              <span className="sr-only">Hasta ara</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ad soyad, telefon veya e-posta ara"
                className="w-full rounded-xl border border-[#cbe4ea] px-4 py-3 outline-none ring-[#0097be] placeholder:text-[#78949d] focus:ring-2"
              />
            </label>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[760px] w-full text-left">
              <thead className="border-b border-[#d3e7ec] bg-[#f7fcfd] text-xs uppercase tracking-wide text-[#54727d]">
                <tr>
                  <th className="px-4 py-3">Hasta</th>
                  <th className="px-4 py-3">Aşama</th>
                  <th className="px-4 py-3">Randevu</th>
                  <th className="px-4 py-3">Bakiye</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-[#edf5f7] transition hover:bg-[#f8fcfd] last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{patient.fullName}</p>
                      <p className="mt-1 text-sm text-[#54727d]">
                        {patient.phone}
                        {patient.email ? ` · ${patient.email}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#e1f5f9] px-3 py-1 text-xs font-semibold text-[#28718a]">
                        {stageLabels[patient.patientStage]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#54727d]">
                      {formatDate(patient.scheduledAt)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#28718a]">
                      {formatCurrency(patient.balance)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/yonetim/hastalar/${patient.id}`}
                        className="inline-flex rounded-full bg-[#008daf] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#007b98]"
                      >
                        Detaylar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPatients.length === 0 && (
            <p className="py-8 text-center text-[#54727d]">
              {patients.length === 0
                ? "Henüz formdan gelen hasta başvurusu bulunmuyor."
                : "Aramanızla eşleşen hasta bulunamadı."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#deedf0] bg-white p-5 shadow-[0_14px_35px_-28px_rgba(21,77,94,0.6)]">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#67848d]">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#173f4d]">{value}</p>
    </div>
  );
}
