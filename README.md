# Azrak Klinik

Azrak Klinik is a TypeScript [Next.js](https://nextjs.org) application, ready to deploy on Vercel.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repository to GitHub.
2. In the [Vercel dashboard](https://vercel.com/new), select **Add New Project** and import the repository.
3. Keep the automatically detected **Next.js** framework preset and deploy.

Vercel automatically runs `npm run build` and deploys the resulting application. No `vercel.json` configuration is required for this Next.js app.

### Environment Variables

Add production environment variables in **Project Settings > Environment Variables** in Vercel. Prefix values that must be accessible in the browser with `NEXT_PUBLIC_`.

For a local production check, run:

```bash
npm run build
```

## Randevu Yönetimi

Başvuru formu ana sayfadadır. Başvurular Neon Postgres veritabanına kaydedilir
ve `/yonetim` adresinden yönetilir. Onaylanan randevular, kişi bilgileri
paylaşılmadan ana sayfadaki takvimde **dolu** olarak görünür.

Yönetim panelini kullanmadan önce Vercel'de **Production** ve **Preview**
ortamları için şu değişkenleri ekleyin:

```text
ADMIN_PASSWORD=<uzun-ve-benzersiz-bir-parola>
ADMIN_SESSION_SECRET=<en-az-32-karakterlik-rastgele-gizli-deger>
```

`DATABASE_URL`, Vercel Neon Postgres entegrasyonu tarafından sağlanır. Yerel
geliştirme için `.env.example` dosyasını `.env.local` olarak kopyalayıp bu iki
değişkeni ekleyin.
