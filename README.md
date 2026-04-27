# Meus_prop

This project is a Next.js 14 real estate application with:

- `Next.js App Router`
- `PostgreSQL + Sequelize`
- `NextAuth` for login
- `admin` and `user/public` areas in the same app

## Project structure

The app is already split into separate sides:

- `src/app/(public)` -> public user-facing pages
- `src/app/(auth)` -> login and register pages
- `src/app/admin` -> admin dashboard and management pages
- `src/app/api` -> API routes for properties, users, enquiries, favorites, and auth
- `src/lib/db` -> database connection, models, and associations
- `src/lib/auth.ts` -> role-aware auth configuration

## Database setup

### 1. Install packages

```bash
npm install
```

### 2. Create your env file

Copy `.env.local.example` to `.env.local` and fill in the values.

There is also an [`env`](./env) folder with a shared template copy for reference, but your real `.env.local` should still stay at the project root because Next.js loads env files from there.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/meus_realestate"
DB_SSL="false"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Meus Real Estate"
```

For hosted PostgreSQL like Neon, Supabase, or Render, switch to your hosted connection string and usually set:

```env
DB_SSL="true"
```

Optional if you want them:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_*`

### 3. Create the database tables

Run:

```bash
npm run db:check
npm run db:migrate
```

This creates the tables and enums used by:

- `users`
- `properties`
- `property_images`
- `favorites`
- `enquiries`

### 4. Seed a first admin user

Quick default seed:

```bash
npm run db:seed
```

Default local admin credentials:

- email: `admin@example.com`
- password: `Admin123!`

You can override them in `.env.local`:

```env
ADMIN_EMAIL="owner@meus.com"
ADMIN_PASSWORD="StrongPassword123"
ADMIN_NAME="Site Owner"
```

Or create/update an admin manually:

```bash
npm run db:create-admin -- owner@meus.com StrongPassword123 "Site Owner"
```

### 5. Start the app

```bash
npm run dev
```

### 6. Verify DB connection

Open:

```text
http://localhost:3000/api/health/db
```

If setup is correct, it returns a success response.

## How admin side and user side work in this app

### Public / user side

The user side is under `src/app/(public)` and `src/app/(auth)`.

Main flow:

1. Visitor browses listings from public pages.
2. Visitor can register from `src/app/(auth)/register/page.tsx`.
3. Registered users are created with role `user`.
4. Logged-in users can use user features like favorites and enquiries.

Important files:

- `src/app/api/auth/register/route.ts` -> creates normal users with role `user`
- `src/app/api/favorites/route.ts` -> user favorites
- `src/app/api/enquiries/route.ts` -> send property enquiries
- `src/app/(public)/properties/page.tsx` -> public listings page

### Admin side

The admin side is under `src/app/admin`.

Main flow:

1. Admin logs in through the normal login page.
2. `next-auth` session contains the user role.
3. `src/app/admin/layout.tsx` checks that the session role is `admin`.
4. Admin can manage properties, enquiries, dashboard data, and users.

Important files:

- `src/lib/auth.ts` -> stores `role` inside JWT/session
- `src/app/admin/layout.tsx` -> blocks non-admin users from admin pages
- `src/app/api/admin/stats/route.ts` -> dashboard stats
- `src/app/api/admin/users/route.ts` -> user list for admins
- `src/app/admin/users/page.tsx` -> admin users screen
- `src/app/api/properties/route.ts` -> admins can create properties
- `src/app/api/properties/[id]/route.ts` -> admins can update/delete properties

## Role design

This app uses a simple role model:

- `user` -> normal app user
- `admin` -> staff/admin dashboard access

That role is stored in:

- DB model: `src/lib/db/models/User.ts`
- auth session: `src/lib/auth.ts`

## Recommended build pattern

For this application, keep the separation like this:

### User side should handle

- browse properties
- view property details
- register/login
- save favorites
- send enquiries
- manage personal profile later if needed

### Admin side should handle

- create/edit/delete properties
- upload property images
- view and respond to enquiries
- view users
- see dashboard stats

## Current DB behavior

The server now initializes the database before auth and API usage through `ensureDatabase()` in `src/lib/db/index.ts`.

That means:

- DB setup is safe during route usage
- auth callbacks can read users safely
- admin/user API routes initialize DB access before querying

## Useful commands

```bash
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:create-admin -- admin@example.com Admin123! "Administrator"
npm run db:reset
npm run dev
```

## Next improvements you may want

- add middleware-based admin protection for earlier redirects
- add profile pages for normal users
- add admin role editing UI
- add booking or appointment tables if this becomes more than listings/enquiries
- replace `sequelize.sync({ alter: ... })` with versioned migrations for production
