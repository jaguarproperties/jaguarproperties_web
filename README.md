# Jaguar Properties

Luxury full-stack real estate platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma, MongoDB Atlas, NextAuth, server actions, and Framer Motion.

## Features

- Premium public website for Bengaluru, Doha, and Dubai
- Dynamic projects, properties, blog/news, portfolio, and contact pages
- Secure `/admin` dashboard with CRUD for properties, blog posts, careers, users, attendance, and website content
- Lead capture stored in MongoDB Atlas
- CSV export for leads
- Public images can be served from `public/images` or external image URLs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Push the MongoDB schema and seed default admin/content:

```bash
npx prisma db push
npm run seed
```

4. Start the development server:

```bash
npm run dev
```

5. To enable career application emails, add SMTP values in `.env`:

```bash
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

## Vercel Deployment

- Add the same variables from `.env.example` in your Vercel project settings.
- Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your real production domain, for example `https://your-site.vercel.app`.
- Use a production MongoDB Atlas `DATABASE_URL`.
- Store website images in `public/images` or use external URLs. This project no longer depends on local runtime uploads.

## Default Admin Credentials

- User ID: value from `ADMIN_USERNAME`
- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`

## Notes

- Public website content updates immediately after admin saves because pages are revalidated through server actions.
- Career applications can be emailed to your recruitment inbox when SMTP is configured.
- `DATABASE_URL` should be a MongoDB Atlas URI.
