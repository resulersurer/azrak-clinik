import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "İstanbul Saç Ekimi",
  description:
    "Saç ekimi süreci, kişisel değerlendirme, planlama ve takip hakkında Azrak Hair Transplant'ın bilgilendirici rehberi.",
};

export default function HairTransplantPage() {
  return (
    <InfoPage
      eyebrow="İstanbul saç ekimi"
      title="Saç ekimi planı, kişisel değerlendirmeyle başlar."
      introduction="Saç dökülmesi görünümü, donör alanın kapasitesi ve beklentiler birlikte ele alınır. Azrak Hair Transplant, süreci açık bilgi ve gerçekçi planlamayla anlatmayı hedefler."
      image="/clinic-consultation.jpg"
      imageAlt="Klinik ortamında yapılan temsili görüşme"
      sections={[
        {
          title: "Kişisel analiz",
          text: "Saç dökülmesinin tipi, mevcut saç yoğunluğu, saç teli özellikleri ve donör alan bir bütün olarak değerlendirilir. Bu inceleme, uygulanabilecek yaklaşımın çerçevesini belirler.",
        },
        {
          title: "Doğal görünüm odaklı planlama",
          text: "Saç çizgisi; yüz oranı, yaş ve uzun vadeli saç kaybı olasılığı göz önünde bulundurularak değerlendirilir. Amaç, tek bir kalıbı uygulamak değil, kişisel görünümü destekleyen bir plan oluşturmaktır.",
        },
        {
          title: "Süreç ve takip",
          text: "Ön görüşme, değerlendirme, uygulama günü ve işlem sonrası bakım adımları anlaşılır biçimde paylaşılır. Takip önerileri kişisel ihtiyaçlara göre şekillenir.",
        },
      ]}
    />
  );
}
