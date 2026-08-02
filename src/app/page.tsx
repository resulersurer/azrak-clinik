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
    url: "https://azrak-clinik.vercel.app",
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

      <section className="relative isolate bg-[#17332d] px-6 pb-20 pt-6 text-[#f8f7f3] sm:px-10 lg:min-h-[690px] lg:px-16">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(circle_at_80%_30%,rgba(186,211,191,0.28),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(196,157,93,0.22),transparent_30%)]" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="#ana-sayfa"
            className="rounded-xl bg-white px-3 py-2 shadow-sm transition hover:opacity-90"
          >
            <Image
              src="/azrak-hair-transplant-logo.jpeg"
              alt="Azrak Hair Transplant"
              width={200}
              height={99}
              priority
              className="h-auto w-36 sm:w-44"
            />
          </a>
          <a
            href="#iletisim"
            className="rounded-full border border-[#d9c69d]/70 px-5 py-2 text-sm font-medium transition hover:bg-[#d9c69d] hover:text-[#17332d]"
          >
            Ön görüşme planla
          </a>
        </nav>
        <div
          id="ana-sayfa"
          className="relative mx-auto grid max-w-6xl gap-12 pb-10 pt-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:pt-36"
        >
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c69d]">
              İstanbul saç ekimi
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">
              Doğal görünüme odaklanan, size özel saç ekimi planı.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#e0ebe4]">
              Azrak Klinik&apos;te saç dökülmesi, donör alan ve beklentileriniz
              birlikte değerlendirilir. Süreciniz hakkında açık, anlaşılır ve
              gerçekçi bilgi alırsınız.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#iletisim"
                className="rounded-full bg-[#d9c69d] px-6 py-3 font-semibold text-[#17332d] transition hover:bg-[#f0dfb7]"
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
            <div className="aspect-[4/5] rounded-t-[10rem] rounded-br-[10rem] border border-white/20 bg-[linear-gradient(145deg,#aec5b6,#6d9384_48%,#244a40)] p-5 shadow-2xl">
              <div className="flex h-full flex-col justify-end rounded-t-[8rem] rounded-br-[8rem] border border-white/20 bg-[#17332d]/20 p-8">
                <p className="text-sm uppercase tracking-[0.18em] text-[#d9c69d]">
                  Kişisel yaklaşım
                </p>
                <p className="mt-3 text-2xl font-medium leading-tight">
                  Her saç çizgisi, yüz yapısı ve hedef farklıdır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="yontemler" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a58042]">
            Saç ekimi seçenekleri
          </p>
          <div className="mt-4 flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Doğru yöntem, doğru değerlendirmeyle başlar.
            </h2>
            <p className="max-w-md leading-7 text-[#49645b]">
              Saç ekimi tek bir standartla uygulanmaz. İhtiyacınıza uygun yaklaşım
              klinik değerlendirme sonrası belirlenir.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.name}
                className="rounded-3xl border border-[#d8ded8] bg-white p-7"
              >
                <span className="text-sm font-semibold text-[#a58042]">
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-2xl font-semibold">{service.name}</h3>
                <p className="mt-4 leading-7 text-[#5a6e66]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e8eee9] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a58042]">
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
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#c8d3cc] pb-5"
              >
                <span className="font-semibold text-[#a58042]">{number}</span>
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-7 text-[#50665d]">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#a58042]">
            Sık sorulan sorular
          </p>
          <h2 className="mt-4 text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            Saç ekimi hakkında merak ettikleriniz.
          </h2>
          <div className="mt-12 space-y-4">
            {questions.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-[#d8ded8] bg-white px-6 py-5"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-2xl leading-7 text-[#536860]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e8eee9] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a58042]">
            Görüşme takvimi
          </p>
          <div className="mt-4 flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Yaklaşan görüşme saatleri.
            </h2>
            <p className="max-w-md leading-7 text-[#49645b]">
              Takvimde sadece dolu saatler gösterilir. Başvuru sahiplerinin
              kimliği ve iletişim bilgileri gizli tutulur.
            </p>
          </div>
          <AvailabilityCalendar />
        </div>
      </section>

      <section id="iletisim" className="bg-[#17332d] px-6 py-20 text-[#f8f7f3] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d9c69d]">
              İstanbul
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Saç ekimi yolculuğunuz için ilk adımı atın.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-[#dce8e1]">
              Ön görüşmede ihtiyaçlarınız ve süreç hakkındaki sorularınız
              değerlendirilir. Tıbbi uygunluk, uzman değerlendirmesiyle belirlenir.
            </p>
          </div>
          <AppointmentForm />
        </div>
      </section>

      <footer className="bg-[#10271f] px-6 py-7 text-sm text-[#b9cabe] sm:px-10 lg:px-16">
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
import Image from "next/image";
