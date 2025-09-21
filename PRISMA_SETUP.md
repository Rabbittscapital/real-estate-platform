# Prisma Database Setup

Since the current configuration uses JWT sessions for simplicity, you can run the application immediately without a database.

However, if you want to use database sessions (recommended for production), follow these steps:

## 1. Set up your database

Create a PostgreSQL database and get the connection string.

## 2. Update your environment variables

Copy `.env.example` to `.env.local` and update the `DATABASE_URL`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_db?schema=public"
```

## 3. Generate Prisma client and run migrations

```bash
npx prisma generate
npx prisma db push
```

## 4. Update auth configuration

In `src/lib/auth.ts`, uncomment the Prisma adapter lines and change session strategy to "database":

```typescript
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // ... rest of config
  session: {
    strategy: "database" as const,
  },
}
```

This will enable persistent sessions and user management in your database.