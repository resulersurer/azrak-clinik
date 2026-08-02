import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "FUE Saç Ekimi",
  description:
    "FUE saç ekimi yaklaşımı, planlama adımları ve kişisel uygunluk değerlendirmesi hakkında bilgi alın.",
};

export default function FuePage() {
  return (
    <InfoPage
      eyebrow="FUE saç ekimi"
      title="FUE yaklaşımını kişisel ihtiyaçlarınızla birlikte değerlendirin."
      introduction="FUE, köklerin donör bölgeden tek tek alınarak planlanan alana yerleştirildiği bir yaklaşımdır. Uygunluk ve ayrıntılı planlama, klinik değerlendirme sonrasında belirlenir."
      image="/medical-consultation.jpg"
      imageAlt="Tıbbi değerlendirmeyi temsil eden görsel"
      sections={[
        {
          title: "FUE nasıl planlanır?",
          text: "Donör alanın durumu, ekim yapılacak alanın genişliği ve mevcut saçların korunması birlikte ele alınır. Bu nedenle planlama kişiden kişiye değişir.",
        },
        {
          title: "Yöntem seçiminde önemli noktalar",
          text: "Saç yapısı, yoğunluk hedefi ve uzun vadeli dökülme olasılığı değerlendirilmeden yalnızca yöntem adına göre karar verilmemelidir.",
        },
        {
          title: "Bilgilendirme ve bakım",
          text: "İşlem öncesi hazırlık, işlem sonrası bakım ve kontrol adımları klinik tarafından ayrıntılı şekilde açıklanmalıdır.",
        },
      ]}
    />
  );
}
