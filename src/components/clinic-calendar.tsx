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
  appointment: "border-[#008daf] bg-[#e2f7fa] text-[#075d72]",
  care_task: "border-[#85d3e2] bg-[#f0fbfc] text-[#28718a]",
  follow_up: "border-[#a9b9df] bg-[#f2f4fb] text-[#405b9a]",
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
  const todayKey = dayKey(new Date());
  const dateRange = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatRange(days[0], days[6]);

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#dbecef] bg-white shadow-[0_20px_60px_-35px_rgba(21,77,94,0.45)]">
      <div className="border-b border-[#dbecef] bg-[linear-gradient(120deg,#f7fdfe_0%,#eaf9fb_52%,#f7fbff_100%)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008daf]">
            Operasyon takvimi
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#173f4d] sm:text-3xl">
            Haftalık operasyon planı
          </h2>
          <p className="mt-2 text-sm font-medium text-[#54727d]">{dateRange}</p>
        </div>
        <div className="flex rounded-xl border border-[#cbe4ea] bg-white p-1 shadow-sm">
          <button
            onClick={() => setWeekStart((current) => addDays(current, -7))}
            aria-label="Önceki hafta"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#38606d] transition hover:bg-[#edf8fa]"
          >
            Onceki
          </button>
          <button
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="rounded-lg bg-[#008daf] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#007b98]"
          >
            Bu hafta
          </button>
          <button
            onClick={() => setWeekStart((current) => addDays(current, 7))}
            aria-label="Sonraki hafta"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#38606d] transition hover:bg-[#edf8fa]"
          >
            Sonraki
          </button>
        </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-white px-3 py-1.5 text-[#075d72] shadow-sm">
            <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#008daf]" />
            Randevu
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-[#28718a] shadow-sm">
            <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#85d3e2]" />
            Bakım görevi
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-[#405b9a] shadow-sm">
            <i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#a9b9df]" />
            Günlük takip
          </span>
        </div>
      </div>
      {error && <p className="mx-5 mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 sm:mx-7">{error}</p>}
      <div className="overflow-x-auto">
        <div className="min-w-[990px]">
          <div className="grid grid-cols-[4.5rem_repeat(7,minmax(9rem,1fr))] border-b border-[#dbecef]">
            <div className="bg-[#f8fcfd]" />
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={`border-l border-[#dbecef] px-3 py-4 text-center ${
                  dayKey(day) === todayKey ? "bg-[#effbfd]" : "bg-[#fbfdfe]"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#54727d]">
                  {new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(day)}
                </p>
                <p className={`mx-auto mt-2 grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                  dayKey(day) === todayKey ? "bg-[#008daf] text-white shadow-md shadow-[#008daf]/25" : "text-[#173f4d]"
                }`}>
                  {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(day)}
                </p>
              </div>
            ))}
          </div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid min-h-24 grid-cols-[4.5rem_repeat(7,minmax(9rem,1fr))] border-b border-[#e8f1f3]"
            >
              <div className="bg-[#fbfdfe] pt-3 pr-3 text-right text-xs font-bold text-[#6a8790]">
                {`${String(hour).padStart(2, "0")}:00`}
              </div>
              {days.map((day) => {
                const slotEvents = eventsBySlot[`${dayKey(day)}-${hour}`] ?? [];

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={`group border-l border-[#e8f1f3] p-1.5 transition-colors hover:bg-[#f8fcfd] ${
                      dayKey(day) === todayKey ? "bg-[#fcfeff]" : ""
                    }`}
                  >
                    {slotEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/yonetim/hastalar/${event.appointmentId}`}
                        className={`mb-1 block border-l-[3px] rounded-lg px-2.5 py-2 text-xs transition hover:-translate-y-0.5 hover:shadow-md ${eventColors[event.kind]}`}
                      >
                        <span className="block font-bold">{eventTime(event)} · {event.title}</span>
                        <span className="mt-0.5 block truncate font-medium opacity-80">{event.patientName}</span>
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
