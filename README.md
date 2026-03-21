# SPL — Saroj Premier League (U19) Official Website

Official website for Saroj Premier League Under-19 Cricket Tournament built with Next.js 14.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: Prisma + MongoDB Atlas
- **Authentication**: Custom JWT (role-based)
- **Payment**: Easebuzz (integration ready)
- **SMS**: Fast2SMS
- **Email**: Nodemailer (Gmail SMTP)

## Quick Start

```bash
npm install
cp .env.example .env   # fill in your values
npx prisma generate
npm run dev
```

Open `http://localhost:3000`

## Environment Variables

See `.env.example` for all required variables.

## Project Structure

```
app/
├── api/               # API routes
├── admin/             # Admin panel
├── coordinator/       # Coordinator panel
├── register/          # Registration pages
└── payment/           # Payment pages
components/            # Reusable UI components
lib/                   # auth, email, sms, prisma helpers
prisma/                # Database schema
```

## User Roles

| Role | Access |
|------|--------|
| Public | View pages, register team/individual |
| District Coordinator | View district teams, verify docs, update results |
| Admin (HQ) | Full control — fixtures, coordinators, reports, announcements |

## Features

- Team & Individual registration with document upload
- Razorpay/Easebuzz payment integration (₹11,000 team / ₹1,000 individual)
- Admin panel — fixtures, coordinators, announcements, reports (CSV + Excel)
- Coordinator panel — team approval, player assignment, match results
- SMS + Email automation on registration, approval, rejection
- Public schedule and news from live DB

## Deployment

Recommended: **Vercel**

```bash
npm run build
```

Set all environment variables in Vercel dashboard before deploying.

## License

© 2026 Saroj Educational Group. All rights reserved.
