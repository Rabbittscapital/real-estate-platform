# Database Development Guide

## Overview

This project uses Prisma as the ORM with PostgreSQL as the database. The recommended cloud provider is Neon for PostgreSQL hosting.

## Initial Setup

1. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Apply Schema to Database**
   ```bash
   npx prisma db push
   ```

## Database Schema

The platform includes these core models:

### User Management
- **User**: Core user authentication (id, email, name, password, role)
- **ClientProfile**: Extended client information (address, contact details)

### Real Estate Management
- **Project**: Real estate developments (name, location, status, dates)
- **Units**: Individual properties (unit number, bedrooms, bathrooms, area, price)

### Business Operations
- **Quote**: Price quotations (base price, discounts, final price, validity)
- **Reservation**: Unit reservations (dates, deposits, status)

### Key Relationships
- Users → ClientProfiles (1:1)
- Users → Quotes (1:Many)
- Users → Reservations (1:Many)
- Projects → Units (1:Many)
- Projects → Quotes (1:Many)
- Units → Quotes (1:Many)
- Units → Reservations (1:Many)

## Migration Workflow

### Development
1. Modify `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name description`
3. Commit the migration files to version control

### Production
1. Apply migrations: `npx prisma migrate deploy`

## Database Operations

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

### View Data
```bash
npx prisma studio
```

### Seed Database (Optional)
Create a `prisma/seed.ts` file and run:
```bash
npx prisma db seed
```

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# NextAuth (for future authentication setup)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Neon PostgreSQL Setup

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `.env` file
5. Run `npx prisma db push` to create tables

## Common Commands

```bash
# Development workflow
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema changes
npm run db:migrate    # Create and apply migration
npm run db:studio     # Open Prisma Studio

# Check schema
npx prisma validate

# Format schema
npx prisma format
```