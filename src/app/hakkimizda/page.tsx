import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Azrak Hair Transplant'ın İstanbul'da kişiye özel değerlendirme ve şeffaf bilgilendirme yaklaşımı.",
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="Azrak Hair Transplant"
      title="Şeffaf bilgiyle başlayan saç ekimi yolculuğu."
      introduction="Azrak Hair Transplant, İstanbul'da saç ekimi seçenekleri hakkında anlaşılır bilgi paylaşmayı ve kişiye özel değerlendirme yaklaşımını önceliklendirmeyi amaçlar."
      image="/hair-care.jpg"
      imageAlt="Saç bakımını temsil eden görsel"
      sections={[
        {
          title: "Açık iletişim",
          text: "İlk görüşmeden itibaren ihtiyaçlarınızı, beklentilerinizi ve süreçteki sorularınızı konuşabileceğiniz net bir iletişim hedeflenir.",
        },
        {
          title: "Kişisel değerlendirme",
          text: "Saç yapısı ve donör alan gibi özellikler kişiden kişiye değiştiği için, her planın kişisel değerlendirme üzerine kurulması önemlidir.",
        },
        {
          title: "Bilgilendirici yaklaşım",
          text: "Sitedeki içerikler genel bilgilendirme amacı taşır. Tıbbi uygunluk ve kişisel öneriler uzman değerlendirmesi sonrasında belirlenir.",
        },
      ]}
    />
  );
}
