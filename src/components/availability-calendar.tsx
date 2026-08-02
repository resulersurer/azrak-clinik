"use client";

import { useEffect, useState } from "react";

type Slot = { scheduledAt: string };

function formatSlot(scheduledAt: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(scheduledAt));
}

export function AvailabilityCalendar() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/appointments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Appointment availability could not be loaded.");
        }

        return response.json() as Promise<Slot[]>;
      })
      .then(setSlots)
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return <p className="mt-6 text-[#54727d]">Takvim yükleniyor...</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="mt-6 max-w-xl leading-7 text-[#54727d]">
        Yaklaşan onaylı görüşme bulunmuyor. Tercih ettiğiniz tarih için ön
        görüşme talebi oluşturabilirsiniz.
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {slots.map((slot) => (
        <div
          key={slot.scheduledAt}
          className="flex items-center justify-between rounded-2xl border border-[#cbe7ed] bg-white px-5 py-4"
        >
          <span className="font-semibold">{formatSlot(slot.scheduledAt)}</span>
          <span className="rounded-full bg-[#e1f5f9] px-3 py-1 text-xs font-semibold text-[#28718a]">
            Dolu
          </span>
        </div>
      ))}
    </div>
  );
}
