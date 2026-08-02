"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/hero-hair-style-1.jpg",
    alt: "Kısa saç stiline sahip erkeğin temsili portresi",
    label: "Doğal ve dengeli",
  },
  {
    image: "/hero-hair-style-2.jpg",
    alt: "Uzun saç stiline sahip kadının temsili portresi",
    label: "Kişisel görünüm",
  },
  {
    image: "/hero-hair-style-3.jpg",
    alt: "Modern saç stiline sahip erkeğin temsili portresi",
    label: "Her stil farklıdır",
  },
];

export function HairStyleSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <figure className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-br-[10rem] border border-white/20 shadow-2xl">
      {slides.map((slide, index) => (
        <Image
          key={slide.image}
          src={slide.image}
          alt={index === activeIndex ? slide.alt : ""}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 420px"
          className={`object-cover transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 flex min-h-2/5 flex-col justify-end bg-gradient-to-t from-[#173a48]/95 to-transparent p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-[#b6edf6]">
          {activeSlide.label}
        </p>
        <p className="mt-3 text-2xl font-medium leading-tight">
          Her saç çizgisi, yüz yapısı ve hedef farklıdır.
        </p>
        <div className="mt-6 flex gap-2" aria-label="Saç stili görselleri">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}. görsele git`}
              aria-current={index === activeIndex}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-[#8fdded]" : "w-2.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
      <figcaption className="sr-only">Temsili saç stili görselleri</figcaption>
    </figure>
  );
}
