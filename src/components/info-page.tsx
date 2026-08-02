import Image from "next/image";
import Link from "next/link";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  image: string;
  imageAlt: string;
  sections: Array<{ title: string; text: string }>;
};

export function InfoPage({
  eyebrow,
  title,
  introduction,
  image,
  imageAlt,
  sections,
}: InfoPageProps) {
  return (
    <main>
      <section className="bg-[#294b58] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fdded]">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#d5eef4]">
              {introduction}
            </p>
          </div>
          <figure>
            <Image
              src={image}
              alt={imageAlt}
              width={1600}
              height={1067}
              className="aspect-[4/3] rounded-3xl object-cover shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <figcaption className="mt-3 text-xs text-[#bce7f0]">Temsili görsel</figcaption>
          </figure>
        </div>
      </section>
      <section className="px-6 py-18 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl space-y-12 py-16">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="text-3xl font-semibold tracking-tight">{section.title}</h2>
              <p className="mt-4 text-lg leading-8 text-[#52727d]">{section.text}</p>
            </article>
          ))}
          <aside className="rounded-3xl bg-[#eaf8fc] p-8">
            <h2 className="text-2xl font-semibold">Size özel değerlendirme</h2>
            <p className="mt-3 leading-7 text-[#52727d]">
              Saç ekimi yöntemi ve tıbbi uygunluk, muayene ile kişisel olarak
              değerlendirilir. Genel bilgiler kişisel tıbbi öneri yerine geçmez.
            </p>
            <Link
              href="/iletisim"
              className="mt-6 inline-flex rounded-full bg-[#0097be] px-6 py-3 font-semibold text-white transition hover:bg-[#00add6]"
            >
              Ön görüşme talep edin
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
