"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AppointmentRequest, AppointmentStatus } from "@/lib/appointments";

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

function statusLabel(status: AppointmentStatus) {
  return {
    pending: "Bekliyor",
    approved: "Onaylandı",
    rejected: "Reddedildi",
  }[status];
}

export function AdminPanel() {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean | undefined>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scheduleInputs, setScheduleInputs] = useState<Record<number, string>>({});

  async function loadRequests() {
    const response = await fetch("/api/admin/appointments");

    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }

    if (!response.ok) {
      setError("Başvurular yüklenemedi.");
      return;
    }

    setRequests((await response.json()) as AppointmentRequest[]);
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
          setError("Başvurular yüklenemedi.");
          setAuthenticated(true);
          return;
        }

        setRequests((await response.json()) as AppointmentRequest[]);
        setAuthenticated(true);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError("Başvurular yüklenemedi.");
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
    await loadRequests();
  }

  async function updateRequest(id: number, status: "approved" | "rejected") {
    setError("");
    const response = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, scheduledAt: scheduleInputs[id] }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "Başvuru güncellenemedi.");
      return;
    }

    await loadRequests();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setRequests([]);
  }

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
            Azrak Klinik
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Yönetim girişi</h1>
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
    <main className="min-h-screen bg-[#f4fafc] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
              Azrak Klinik
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Randevu yönetimi</h1>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-[#b9dce5] px-5 py-2 text-sm font-semibold transition hover:bg-[#e1f5f9]"
          >
            Çıkış yap
          </button>
        </header>
        <p className="mt-5 max-w-2xl leading-7 text-[#54727d]">
          Onaylarken görüşme tarihini ve saatini seçin. Onaylanan saatler ana
          sayfada yalnızca dolu olarak görünür; kişi bilgileri yayınlanmaz.
        </p>
        {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="mt-10 space-y-5">
          {requests.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-[#54727d]">
              Henüz başvuru bulunmuyor.
            </p>
          ) : (
            requests.map((request) => (
              <article key={request.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#008daf]">
                      {statusLabel(request.status)}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold">{request.fullName}</h2>
                    <p className="mt-2 text-[#54727d]">{request.phone}</p>
                    {request.email && <p className="text-[#54727d]">{request.email}</p>}
                  </div>
                  <p className="text-sm text-[#54727d]">
                    Talep: {formatDate(request.preferredDate)}
                    {request.preferredTime ? `, ${request.preferredTime}` : ""}
                  </p>
                </div>
                {request.message && (
                  <p className="mt-5 rounded-2xl bg-[#edf8fb] p-4 leading-7 text-[#52727d]">
                    {request.message}
                  </p>
                )}
                {request.status === "pending" ? (
                  <div className="mt-6 flex flex-wrap items-end gap-3">
                    <label className="grid gap-2 text-sm font-medium">
                      Görüşme tarihi ve saati
                      <input
                        required
                        type="datetime-local"
                        value={scheduleInputs[request.id] ?? ""}
                        onChange={(event) =>
                          setScheduleInputs({
                            ...scheduleInputs,
                            [request.id]: event.target.value,
                          })
                        }
                        className="rounded-xl border border-[#cbe4ea] px-4 py-3 text-base"
                      />
                    </label>
                    <button
                      onClick={() => void updateRequest(request.id, "approved")}
                      className="rounded-full bg-[#0097be] px-5 py-3 font-semibold text-white transition hover:bg-[#00add6]"
                    >
                      Onayla ve takvime ekle
                    </button>
                    <button
                      onClick={() => void updateRequest(request.id, "rejected")}
                      className="rounded-full border border-[#9acbd8] px-5 py-3 font-semibold text-[#28718a] transition hover:bg-[#e1f5f9]"
                    >
                      Reddet
                    </button>
                  </div>
                ) : (
                  <p className="mt-6 text-sm font-medium text-[#54727d]">
                    {request.status === "approved"
                      ? `Takvim: ${formatDate(request.scheduledAt)}`
                      : "Bu başvuru reddedildi."}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
