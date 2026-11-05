# FIT MOTORS

სერვისი და ავტონაწილები Honda FIT, HR-V და VEZEL-ისთვის - https://fitmotors.ge

- Next.js 16, Neon Postgres (Drizzle), Vercel Blob (ნაწილების ფოტოები)
- მთავარი გვერდი: მარკაპი `src/content/body.html`, სტილები `src/app/design.css` + `src/app/globals.css`, ლოგიკა/კონტაქტები `public/site.js`
- ჰედერი და ფუტერი `body.html`-შია, `/parts` მათ `src/lib/site-chrome.ts`-ით იღებს
- ნაწილების კატალოგი: `/parts`
- ადმინ პანელი: `/admin` (შესვლა: `ADMIN_USERNAME` და `ADMIN_PASSWORD`)

## ლოკალურად

```
vercel link
vercel env pull .env.local
npm install
npm run dev
```

## ბაზის ცვლილება

შეცვალეთ `src/db/schema.ts`, შემდეგ:

```
npm run db:generate
npm run db:migrate
```

Production და Preview ერთსა და იმავე ბაზას იყენებენ, ამიტომ მიგრაცია მაშინვე ყველგან მოქმედებს.

## გარემოს ცვლადები

- `DATABASE_URL`, `DATABASE_URL_UNPOOLED` - Neon ინტეგრაცია
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob
- `ADMIN_USERNAME` - ადმინის მომხმარებლის სახელი
- `ADMIN_PASSWORD` - ადმინის პაროლი; შეცვლა ყველა მოქმედ სესიას აუქმებს
- `ADMIN_SESSION_SECRET` - სესიის ხელმოწერის გასაღები
