"use client";

import { FormEvent, useState } from "react";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
};

export function AppointmentForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setState("error");
      setMessage(result.error ?? "Başvurunuz gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }

    setForm(initialForm);
    setState("success");
    setMessage(
      "Talebiniz alındı. Uygunluk değerlendirmesi sonrasında sizinle iletişime geçeceğiz.",
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium">
        Ad soyad
        <input
          required
          value={form.fullName}
          onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none ring-[#61d0e5] placeholder:text-[#c5e6ed] focus:ring-2"
          placeholder="Adınız ve soyadınız"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Telefon
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none ring-[#61d0e5] placeholder:text-[#c5e6ed] focus:ring-2"
          placeholder="05XX XXX XX XX"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        E-posta <span className="font-normal text-[#c5e6ed]">(isteğe bağlı)</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none ring-[#61d0e5] placeholder:text-[#c5e6ed] focus:ring-2"
          placeholder="ornek@eposta.com"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Tercih edilen tarih <span className="font-normal text-[#c5e6ed]">(isteğe bağlı)</span>
        <input
          type="date"
          value={form.preferredDate}
          onChange={(event) => setForm({ ...form, preferredDate: event.target.value })}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none ring-[#61d0e5] focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Tercih edilen saat <span className="font-normal text-[#c5e6ed]">(isteğe bağlı)</span>
        <input
          type="time"
          value={form.preferredTime}
          onChange={(event) => setForm({ ...form, preferredTime: event.target.value })}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none ring-[#61d0e5] focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
        Mesajınız <span className="font-normal text-[#c5e6ed]">(isteğe bağlı)</span>
        <textarea
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="min-h-28 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none ring-[#61d0e5] placeholder:text-[#c5e6ed] focus:ring-2"
          placeholder="Kısaca beklentinizi paylaşın."
        />
      </label>
      <div className="sm:col-span-2">
        <button
          disabled={state === "submitting"}
          className="rounded-full bg-[#00a3cd] px-7 py-4 font-semibold text-white transition hover:bg-[#18b8dd] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? "Gönderiliyor..." : "Ön görüşme talebi gönder"}
        </button>
        {message && (
          <p
            role="status"
            className={`mt-4 leading-6 ${state === "error" ? "text-red-200" : "text-[#c9f1f8]"}`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
