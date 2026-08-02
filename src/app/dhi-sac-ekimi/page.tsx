import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "DHI Saç Ekimi",
  description:
    "DHI saç ekimi yaklaşımı ve yöntem seçiminin kişisel değerlendirmeyle neden belirlenmesi gerektiği hakkında bilgi alın.",
};

export default function DhiPage() {
  return (
    <InfoPage
      eyebrow="DHI saç ekimi"
      title="DHI yaklaşımı hakkında bilinçli karar verin."
      introduction="DHI, saç köklerinin yerleştirilmesinde özel kalemlerden yararlanılan bir yaklaşımdır. Size uygun olup olmadığı, saç ve saç derisi analiziyle belirlenir."
      sections={[
        {
          title: "DHI neyi ifade eder?",
          text: "DHI ifadesi, kök yerleştirme aşamasında kullanılan yaklaşımı anlatır. Uygulamanın planlanması; saç çizgisi, donör alan ve hedef yoğunluk gibi birçok başlığı kapsar.",
        },
        {
          title: "FUE ve DHI seçimi",
          text: "Yöntemleri tek bir üstünlük sıralaması içinde değerlendirmek yerine, kişisel özellikler ve klinik hedefler üzerinden konuşmak daha doğru bir yaklaşımdır.",
        },
        {
          title: "Görüşmede neler sorulmalı?",
          text: "Planlanan saç çizgisi, işlem sonrası bakım, takip adımları ve sizin için uygun görülen yaklaşımın gerekçesi hakkında bilgi isteyin.",
        },
      ]}
    />
  );
}
