export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "sac-ekimi-oncesi-hazirlik-rehberi",
    title: "Saç Ekimi Öncesi Hazırlık Rehberi",
    description:
      "İlk görüşmeden uygulama gününe uzanan hazırlık sürecinde hangi başlıkların konuşulması gerektiğini öğrenin.",
    category: "Hazırlık",
    publishedAt: "2026-08-02",
    readTime: "6 dk okuma",
    sections: [
      {
        heading: "İlk değerlendirmede neler ele alınır?",
        paragraphs: [
          "Saç ekimi planı, yalnızca saç kaybının görünen alanına bakılarak oluşturulmaz. Donör alanın durumu, saç telinin özellikleri, dökülme biçimi ve kişinin beklentisi birlikte değerlendirilir.",
          "Ön görüşmede güncel sağlık durumunuzu, düzenli kullandığınız ilaçları ve daha önce geçirdiğiniz işlemleri eksiksiz paylaşmanız önemlidir. Bu bilgiler, güvenli ve gerçekçi bir planlama için temel oluşturur.",
        ],
      },
      {
        heading: "Beklenti ve saç çizgisi planlaması",
        paragraphs: [
          "Doğal sonuç yaklaşımında saç çizgisi yaş, yüz oranı, mevcut saç yoğunluğu ve gelecekteki olası dökülme dikkate alınarak değerlendirilir. Herkes için aynı saç çizgisi uygun değildir.",
          "Referans görseller beklentinizi anlatmaya yardımcı olabilir; ancak kişisel özellikler nedeniyle aynı görünümün her kişide oluşacağı varsayılmamalıdır.",
        ],
      },
      {
        heading: "Uygulama gününe yaklaşırken",
        paragraphs: [
          "Klinik ekibinin verdiği hazırlık önerileri kişiye özgü olabilir. Ulaşım, refakat gereksinimi ve işlem sonrası ilk gün planı önceden netleştirilmelidir.",
          "Bu içerik genel bilgilendirme amaçlıdır. Kişisel tıbbi öneriler yalnızca muayene ve uzman değerlendirmesi sonrasında verilebilir.",
        ],
      },
    ],
  },
  {
    slug: "fue-sac-ekimi-nedir",
    title: "FUE Saç Ekimi Nedir? Süreç Hakkında Bilmeniz Gerekenler",
    description:
      "FUE yaklaşımının temel adımlarını, değerlendirme sürecini ve kişisel planlamanın neden önemli olduğunu inceleyin.",
    category: "FUE",
    publishedAt: "2026-07-28",
    readTime: "7 dk okuma",
    sections: [
      {
        heading: "FUE yaklaşımının temel prensibi",
        paragraphs: [
          "FUE, saç köklerinin donör bölgeden tek tek alınması ve planlanan alana yerleştirilmesi esasına dayanan bir saç ekimi yaklaşımıdır. Uygulama ayrıntıları kişinin saç yapısına ve ekibin planlamasına göre değişir.",
          "Yöntemin uygunluğu, sadece dökülme alanı üzerinden değil, donör kapasite ve saç kaybının olası seyri üzerinden de ele alınır.",
        ],
      },
      {
        heading: "Neden kişisel planlama gerekir?",
        paragraphs: [
          "Greft dağılımı, saç çizgisi ve yoğunluk hedefi; mevcut saçları koruma gereksinimiyle birlikte değerlendirilir. Bu nedenle standart bir greft sayısı veya sonuç vaadi doğru bir yaklaşım değildir.",
          "Uzman değerlendirmesi, hem estetik hedefleri hem de donör alanın korunmasını dengeler.",
        ],
      },
      {
        heading: "Takip ve bakım",
        paragraphs: [
          "İşlem sonrası bakım önerileri, iyileşme sürecinin önemli bir parçasıdır. Yıkama, fiziksel aktivite ve kontrol zamanlaması gibi konular klinik tarafından kişiye özel açıklanmalıdır.",
        ],
      },
    ],
  },
  {
    slug: "dhi-sac-ekimi-hakkinda",
    title: "DHI Saç Ekimi Hakkında Merak Edilenler",
    description:
      "DHI yaklaşımının çalışma prensibini ve yöntem seçiminde değerlendirilmesi gereken noktaları keşfedin.",
    category: "DHI",
    publishedAt: "2026-07-18",
    readTime: "6 dk okuma",
    sections: [
      {
        heading: "DHI neyi ifade eder?",
        paragraphs: [
          "DHI, saç köklerinin yerleştirilmesinde özel kalemlerin kullanıldığı bir yaklaşımdır. Kullanılan teknik, uygulamanın tüm aşamalarını tek başına tanımlamaz; planlama ve ekip deneyimi de sürecin parçasıdır.",
          "Hangi yöntemin uygun olduğuna, saç ve saç derisi analizi sonrasında karar verilir.",
        ],
      },
      {
        heading: "Yöntem karşılaştırmalarına temkinli yaklaşın",
        paragraphs: [
          "FUE ve DHI karşılaştırmaları çoğu zaman tek bir ölçüte indirgenir. Oysa doğru seçim; saçın yapısı, ekim alanı, donör alan ve uzun vadeli hedefler gibi birçok değişkene bağlıdır.",
          "Klinik görüşmesinde size önerilen yaklaşımın nedenlerini sormak, süreci daha iyi anlamanıza yardımcı olur.",
        ],
      },
      {
        heading: "Karar öncesinde sorulabilecek sorular",
        paragraphs: [
          "Planlanan saç çizgisi, takip süreci, iyileşme önerileri ve olası kısıtlamalar hakkında bilgi isteyin. Açık iletişim, karar verme sürecinin önemli bir parçasıdır.",
        ],
      },
    ],
  },
  {
    slug: "sac-ekimi-sonrasi-bakim",
    title: "Saç Ekimi Sonrası Bakım: İlk Günler ve Takip Süreci",
    description:
      "İşlem sonrası bakımın neden önemli olduğunu ve klinik takip planının hangi başlıkları içerdiğini öğrenin.",
    category: "Bakım",
    publishedAt: "2026-07-09",
    readTime: "5 dk okuma",
    sections: [
      {
        heading: "İlk günler neden önemlidir?",
        paragraphs: [
          "Saç ekimi sonrasında klinik tarafından paylaşılan bakım adımlarına uyum, iyileşme sürecinin düzenli ilerlemesi açısından önem taşır. Her kişinin iyileşme deneyimi farklı olabilir.",
          "Kişiye özel öneriler; işlem kapsamı, saç derisi özellikleri ve genel sağlık durumuna göre değişir.",
        ],
      },
      {
        heading: "Takip planını anlamak",
        paragraphs: [
          "Yıkama önerileri, kontrol randevuları ve gündelik yaşama dönüşle ilgili bilgiler uygulama öncesinde ve sonrasında netleştirilmelidir.",
          "Beklenmeyen bir durum veya soru olduğunda, internetten genel bilgi aramak yerine işlemi yapan klinikle iletişime geçmek daha güvenlidir.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
