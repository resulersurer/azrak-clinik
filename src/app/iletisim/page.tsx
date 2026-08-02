import type { Metadata } from "next";
import { AppointmentForm } from "@/components/appointment-form";

export const metadata: Metadata = {
  title: "İletişim ve Ön Görüşme",
  description:
    "İstanbul saç ekimi ön görüşmesi için Azrak Hair Transplant'a talebinizi iletin.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-[#294b58] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fdded]">
            İletişim
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Ön görüşme talebinizi iletin.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d5eef4]">
            Bilgilerinizi paylaşın; talebiniz yönetim paneline iletilsin. Uygunluk
            değerlendirmesi sonrasında sizinle iletişime geçilir.
          </p>
          <AppointmentForm />
        </div>
      </section>
    </main>
  );
}
