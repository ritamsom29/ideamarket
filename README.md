# IDEA MARKET — Where Ideas Meet Investment

> The premier platform connecting entrepreneurs, investors, and mentors in the Indian startup ecosystem.

---

## 🚀 Overview

**Idea Market** is a production-grade full-stack web application tailored for India's high-velocity startup landscape. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, and Auth.js, it facilitates seamless discovery, investment interests, bilateral networking, and expert mentorship.

- **Currency & Formats:** Indian Rupee (`₹`) native formatting with Lakhs (`₹L`) and Crores (`₹Cr`) support.
- **Roles Supported:** 
  1. **Entrepreneur** — Showcase startup ideas, manage team & metrics, build 6-step investor-ready pitches, manage investor interest requests.
  2. **Investor** — Explore curated ventures, filter by stage/ticket size/sector, save to watchlist, express interest with custom cover notes.
  3. **Mentor** — Accept mentorship inquiries, advise founders, set availability and expertise domains.
  4. **Administrator** — Review reported items, audit ecosystem actions, moderate listings, suspend/restore users.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Radix UI primitives, Recharts, Sonner |
| **Backend** | Next.js Server Actions, NextAuth (Auth.js v5 beta), Edge-compatible JWT sessions |
| **Database** | PostgreSQL, Prisma ORM (v5.22.0) with 22 relational models and enums |
| **Data Resilience** | Dual-mode services: live PostgreSQL with automatic fallback to typed seed dataset when offline |
| **Testing** | Jest, ts-jest, 21 automated unit and integration tests |

---

## 📦 Project Structure

```
ideamarket/
├── prisma/
│   ├── schema.prisma          # 22 relational models & enums
│   └── seed.ts                # Deterministic seed data script
├── __tests__/                 # Unit & integration test suites
│   ├── utils.test.ts          # INR formatting, slug, initials
│   ├── discovery.test.ts      # Filters, search, pagination
│   ├── recommendations.test.ts# Matchmaking & scoring algorithms
│   └── permissions.test.ts    # Role-based access control & state machines
├── src/
│   ├── actions/               # Next.js Server Actions
│   │   ├── auth.ts            # Registration & role onboarding
│   │   ├── startups.ts        # Pitch wizard, updates, publishing
│   │   ├── interests.ts       # Investment pipeline & watchlist
│   │   ├── connections.ts     # Bilateral networking requests
│   │   ├── mentorship.ts      # Mentor request lifecycle
│   │   ├── messages.ts        # Direct messaging system
│   │   ├── notifications.ts   # Notification center
│   │   └── admin.ts           # Moderation & audit logging
│   ├── app/
│   │   ├── (auth)/            # Login, register, onboarding, forgot/reset password
│   │   ├── (dashboard)/       # Role-adaptive dashboard, startups, network, settings
│   │   ├── (public)/          # Startup discovery, pitch views, directories, legal
│   │   ├── admin/             # Platform admin console & audit trail
│   │   ├── api/auth/          # NextAuth route handler
│   │   └── page.tsx           # High-converting landing page
│   ├── components/
│   │   ├── layout/            # Navbar, footer, dashboard sidebar
│   │   └── ui/                # Accessible design system components
│   ├── lib/
│   │   ├── auth/              # NextAuth configuration & callbacks
│   │   ├── services/          # Startup, investor, and mentor data services
│   │   ├── demo-data.ts       # Typed reference dataset
│   │   ├── prisma.ts          # Singleton Prisma Client
│   │   └── utils.ts           # Indian currency helpers & formatters
│   └── middleware.ts          # Route protection & role guards
```

---

## 🔑 Demo Accounts & Seed Credentials

All demo accounts are pre-configured with the default password:
**`Password@123`**

| Persona | Name | Role | Email |
|---|---|---|---|
| **Entrepreneur** | Aarav Sharma | Entrepreneur | `aarav.sharma@payflow.in` |
| **Entrepreneur** | Priya Patel | Entrepreneur | `priya.patel@greengrid.in` |
| **Entrepreneur** | Rohan Gupta | Entrepreneur | `rohan.gupta@kisaansetu.in` |
| **Investor** | Rajesh Singhania | Investor | `rajesh.singhania@apexventures.in` |
| **Investor** | Ananya Sen | Investor | `ananya.sen@bengaluruangels.in` |
| **Mentor** | Sanjay Mehta | Mentor | `sanjay.mehta@scaleadvisors.in` |
| **Mentor** | Dr. Radhika Nair | Mentor | `radhika.nair@healthx.org` |
| **Administrator** | System Admin | Admin | `admin@ideamarket.in` |

> *One-click login helper buttons are embedded on the `/login` page for instant testing.*

---

## 🏃 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
- `DATABASE_URL`: PostgreSQL connection string (Neon, Supabase, Railway, or local)
- `AUTH_SECRET`: Random string for JWT encryption (`openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL`: Defaults to `http://localhost:3000`

### 3. Generate Database Client & Seed (Optional if using live DB)
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

> **Offline Mode:** If PostgreSQL is not connected, the application seamlessly runs on an in-memory typed demo dataset without crashing.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing

Run the automated test suite with Jest:
```bash
npm test
```
All 4 test suites and 21 tests execute with zero failures:
- `__tests__/utils.test.ts`: Currency conversion (`₹12.5L`, `₹4.5Cr`), slug generator, relative timestamps.
- `__tests__/discovery.test.ts`: Search, filtering by stage/industry, pagination.
- `__tests__/recommendations.test.ts`: Stage & sector preference matching algorithms.
- `__tests__/permissions.test.ts`: State transitions, role boundaries, and interest request invariants.

---

## 🏗️ Production Build

Verify type checking, server compilation, and static page generation:
```bash
npm run build
npm run start
```
All 38 routes compile cleanly into production bundles.

---

## 🛡️ License
Private and confidential. Built for the Indian Startup Ecosystem.
