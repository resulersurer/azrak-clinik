import Image from "next/image";
import { HairStyleSlider } from "@/components/hair-style-slider";

const services = [
  {
    name: "FUE saç ekimi",
    description:
      "Greftlerin tek tek alınarak planlanan alana yerleştirildiği, değerlendirme gerektiren bir yöntemdir.",
  },
  {
    name: "DHI saç ekimi",
    description:
      "Özel kalemlerle uygulanan DHI yaklaşımının sizin için uygunluğu, muayene ve saç analiziyle belirlenir.",
  },
  {
    name: "Sakal ve kaş ekimi",
    description:
      "Yüz yapısı, kıl yönü ve kişisel beklentiler dikkate alınarak planlanan seçenekler sunulur.",
  },
];

const questions = [
  {
    question: "Saç ekimi herkes için uygun mudur?",
    answer:
      "Uygunluk; donör alan, saç dökülmesinin tipi, genel sağlık durumu ve beklentiler birlikte değerlendirilerek belirlenir.",
  },
  {
    question: "FUE ve DHI arasındaki fark nedir?",
    answer:
      "Her iki yaklaşım da farklı araçlar ve yerleştirme teknikleri içerir. En uygun yönteme, kişisel değerlendirme sonrasında karar verilir.",
  },
  {
    question: "İyileşme süreci ne kadar sürer?",
    answer:
      "İyileşme deneyimi kişiden kişiye değişir. Size özel bakım ve takip planı ön görüşme sonrasında ayrıntılı olarak paylaşılır.",
  },
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Azrak Klinik",
    url: "https://azrakclinic.com",
    description:
      "İstanbul'da saç ekimi seçenekleri hakkında bilgi ve kişiye özel ön görüşme sunan klinik.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    areaServed: {
      "@type": "City",
      name: "İstanbul",
    },
    availableLanguage: "tr",
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <main className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <section className="relative isolate bg-[#294b58] px-6 pb-20 pt-16 text-[#f7fcfd] sm:px-10 lg:min-h-[690px] lg:px-16">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(circle_at_80%_30%,rgba(0,151,190,0.42),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(137,210,226,0.22),transparent_30%)]" />
        <div
          id="ana-sayfa"
          className="relative mx-auto grid max-w-6xl gap-12 pb-10 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:pt-20"
        >
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#8fdded]">
              İstanbul saç ekimi
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">
              Doğal görünüme odaklanan, size özel saç ekimi planı.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#d5eef4]">
              Azrak Klinik&apos;te saç dökülmesi, donör alan ve beklentileriniz
              birlikte değerlendirilir. Süreciniz hakkında açık, anlaşılır ve
              gerçekçi bilgi alırsınız.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#iletisim"
                className="rounded-full bg-[#00a3cd] px-6 py-3 font-semibold text-white transition hover:bg-[#18b8dd]"
              >
                Ücretsiz ön görüşme
              </a>
              <a
                href="#yontemler"
                className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:border-white"
              >
                Yöntemleri inceleyin
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <HairStyleSlider />
          </div>
        </div>
      </section>

      <section id="yontemler" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
            Saç ekimi seçenekleri
          </p>
          <div className="mt-4 flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Doğru yöntem, doğru değerlendirmeyle başlar.
            </h2>
            <p className="max-w-md leading-7 text-[#52727d]">
              Saç ekimi tek bir standartla uygulanmaz. İhtiyacınıza uygun yaklaşım
              klinik değerlendirme sonrası belirlenir.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.name}
                className="rounded-3xl border border-[#d3e7ec] bg-white p-7 shadow-sm"
              >
                <span className="text-sm font-semibold text-[#008daf]">
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-2xl font-semibold">{service.name}</h3>
                <p className="mt-4 leading-7 text-[#597681]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
          <figure className="mt-12 overflow-hidden rounded-3xl bg-[#eaf8fc]">
            <div className="grid lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <Image
                src="/medical-consultation.jpg"
                alt="Tıbbi konsültasyonu temsil eden görsel"
                width={1600}
                height={1067}
                className="h-full min-h-64 w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <figcaption className="p-8 text-lg leading-8 text-[#52727d] sm:p-12">
                <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
                  Bilinçli karar
                </span>
                Saç ekimi sürecini değerlendirmek için doğru bilgi, kişisel analiz
                ve uzman görüşü birlikte ele alınmalıdır.
                <span className="mt-4 block text-xs text-[#67828b]">Temsili görsel</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section className="bg-[#eaf8fc] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
              Süreç nasıl ilerler?
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Bilgiyle başlayan, takip ile devam eden bir süreç.
            </h2>
          </div>
          <ol className="space-y-5">
            {[
              ["01", "Ön görüşme", "Beklentilerinizi dinler, temel bilgileri paylaşırız."],
              ["02", "Değerlendirme", "Saç ve donör alan analiziyle uygunluğu konuşuruz."],
              ["03", "Planlama", "Yöntem, süreç ve bakım adımları sizinle netleştirilir."],
              ["04", "Takip", "Uygulama sonrasında önerilen kontrol ve bakım planı sürdürülür."],
            ].map(([number, title, description]) => (
              <li
                key={number}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#cbe4ea] pb-5"
              >
                <span className="font-semibold text-[#008daf]">{number}</span>
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-7 text-[#56747e]">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
            Sık sorulan sorular
          </p>
          <h2 className="mt-4 text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            Saç ekimi hakkında merak ettikleriniz.
          </h2>
          <div className="mt-12 space-y-4">
            {questions.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-[#d3e7ec] bg-white px-6 py-5"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-2xl leading-7 text-[#55737d]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf8fc] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
            Görüşme takvimi
          </p>
          <div className="mt-4 flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Yaklaşan görüşme saatleri.
            </h2>
            <p className="max-w-md leading-7 text-[#52727d]">
              Takvimde sadece dolu saatler gösterilir. Başvuru sahiplerinin
              kimliği ve iletişim bilgileri gizli tutulur.
            </p>
          </div>
          <AvailabilityCalendar />
        </div>
      </section>

      <section id="iletisim" className="bg-[#294b58] px-6 py-20 text-[#f7fcfd] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fdded]">
              İstanbul
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Saç ekimi yolculuğunuz için ilk adımı atın.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-[#d5eef4]">
              Ön görüşmede ihtiyaçlarınız ve süreç hakkındaki sorularınız
              değerlendirilir. Tıbbi uygunluk, uzman değerlendirmesiyle belirlenir.
            </p>
          </div>
          <AppointmentForm />
        </div>
      </section>

      <footer className="bg-[#203f4b] px-6 py-7 text-sm text-[#c5e6ed] sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Azrak Klinik</span>
          <span>İstanbul saç ekimi hakkında bilgilendirici içerik</span>
        </div>
      </footer>
    </main>
  );
}
import { AppointmentForm } from "@/components/appointment-form";
import { AvailabilityCalendar } from "@/components/availability-calendar";
