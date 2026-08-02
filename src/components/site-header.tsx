import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/sac-ekimi", label: "Saç Ekimi" },
  { href: "/fue-sac-ekimi", label: "FUE" },
  { href: "/dhi-sac-ekimi", label: "DHI" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d5eaf0] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
        <Link href="/" className="shrink-0 rounded-lg bg-white p-1">
          <Image
            src="/azrak-hair-transplant-logo.jpeg"
            alt="Azrak Hair Transplant"
            width={190}
            height={94}
            priority
            className="h-auto w-28 sm:w-36"
          />
        </Link>
        <div className="hidden items-center gap-5 text-sm font-semibold text-[#355b68] xl:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#0097be]">
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/iletisim"
          className="rounded-full bg-[#0097be] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00add6] sm:px-5"
        >
          Ön görüşme
        </Link>
      </nav>
      <div className="flex gap-4 overflow-x-auto border-t border-[#edf7fa] px-5 py-2 text-xs font-semibold text-[#52727d] xl:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap">
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
