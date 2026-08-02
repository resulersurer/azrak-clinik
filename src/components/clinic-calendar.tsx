"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/lib/appointments";

const hours = Array.from({ length: 12 }, (_, index) => index + 8);

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function dayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(date);
}

function eventTime(event: CalendarEvent) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(event.startsAt));
}

function eventHour(event: CalendarEvent) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: "Europe/Istanbul",
    }).format(new Date(event.startsAt)),
  );
}

const eventColors = {
  appointment: "bg-[#0097be] text-white",
  care_task: "bg-[#dff4f8] text-[#28718a]",
  follow_up: "bg-[#e9eef9] text-[#405b9a]",
};

export function ClinicCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/admin/calendar", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          setError("Takvim verileri yüklenemedi.");
          return;
        }

        setEvents((await response.json()) as CalendarEvent[]);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError("Takvim verileri yüklenemedi.");
      });

    return () => controller.abort();
  }, []);

  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
  const eventsBySlot = useMemo(() => {
    return events.reduce<Record<string, CalendarEvent[]>>((slots, event) => {
      const date = new Date(event.startsAt);
      const key = `${dayKey(date)}-${eventHour(event)}`;
      return { ...slots, [key]: [...(slots[key] ?? []), event] };
    }, {});
  }, [events]);

  return (
    <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
            Operasyon takvimi
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Haftalık saat planı</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekStart((current) => addDays(current, -7))}
            className="rounded-xl border border-[#cbe4ea] px-3 py-2 text-sm font-semibold"
          >
            ← Önceki
          </button>
          <button
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="rounded-xl bg-[#e1f5f9] px-3 py-2 text-sm font-semibold text-[#28718a]"
          >
            Bu hafta
          </button>
          <button
            onClick={() => setWeekStart((current) => addDays(current, 7))}
            className="rounded-xl border border-[#cbe4ea] px-3 py-2 text-sm font-semibold"
          >
            Sonraki →
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-[#54727d]">
        <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#0097be]" />Randevu</span>
        <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#a7ddea]" />Bakım görevi</span>
        <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#a8b8e0]" />Günlük takip</span>
      </div>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[4rem_repeat(7,minmax(9rem,1fr))] border-b border-[#d3e7ec]">
            <div />
            {days.map((day) => (
              <div key={day.toISOString()} className="border-l border-[#d3e7ec] px-3 pb-3 text-center">
                <p className="text-xs font-semibold uppercase text-[#008daf]">
                  {new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(day)}
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(day)}
                </p>
              </div>
            ))}
          </div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid min-h-22 grid-cols-[4rem_repeat(7,minmax(9rem,1fr))] border-b border-[#e5f0f3]"
            >
              <div className="pt-3 text-right text-xs font-medium text-[#54727d]">
                {`${String(hour).padStart(2, "0")}:00`}
              </div>
              {days.map((day) => {
                const slotEvents = eventsBySlot[`${dayKey(day)}-${hour}`] ?? [];

                return (
                  <div key={`${day.toISOString()}-${hour}`} className="border-l border-[#e5f0f3] p-1.5">
                    {slotEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/yonetim/hastalar/${event.appointmentId}`}
                        className={`mb-1 block rounded-lg px-2 py-1.5 text-xs font-semibold ${eventColors[event.kind]}`}
                      >
                        <span className="block">{eventTime(event)} · {event.title}</span>
                        <span className="block truncate opacity-90">{event.patientName}</span>
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
