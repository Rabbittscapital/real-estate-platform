# Real Estate Platform - GitHub Copilot Instructions

Full-stack real estate platform built with Next.js 14, Prisma, NextAuth, and TailwindCSS, designed for deployment on Vercel.

**CRITICAL: Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Current Repository State

**IMPORTANT: This repository is in early development stage.**

Currently available:
- README.md with project description
- Empty package-lock.json (indicates npm was run without package.json)
- No source code, package.json, or configuration files yet

Do NOT attempt to run build or test commands until the codebase is properly initialized.

## Environment Requirements

**VERIFIED WORKING:**
- Node.js v20.19.5 is available
- npm v10.8.2 is available  
- git is available at /usr/bin/git

## Initial Project Setup (Required Before Development)

Since this is an early-stage repository, you MUST first initialize the Next.js project:

1. **Initialize Next.js 14 Project:**
   ```bash
   npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
   - NEVER CANCEL: Takes 10-15 seconds. Set timeout to 5+ minutes.
   - When prompted, answer: Yes to TypeScript, Yes to ESLint, Yes to TailwindCSS, Yes to App Router, Yes to src/ directory, Yes to import alias
   - **NOTE**: This creates a Next.js 14 App Router project (not Pages Router)

2. **Install Additional Dependencies:**
   ```bash
   npm install @prisma/client prisma next-auth @next-auth/prisma-adapter
   npm install -D @types/node
   ```
   - NEVER CANCEL: Takes 15-20 seconds. Set timeout to 5+ minutes.

3. **Initialize Prisma:**
   ```bash
   npx prisma init
   ```
   - NEVER CANCEL: Takes 30-60 seconds. Set timeout to 5+ minutes.
   - **WARNING**: May fail due to network access to binaries.prisma.sh in sandboxed environments. If this fails, continue with other setup steps.

## Working With Fully Initialized Codebase

**Once the project is properly initialized**, use these commands:

### Building and Development
- **Development server:** `npm run dev`
  - NEVER CANCEL: Starts in 1-2 seconds, runs continuously. Set timeout to 60+ minutes.
  - Available at http://localhost:3000
  - Hot reload enabled for development

- **Production build:** `npm run build`
  - NEVER CANCEL: Takes 15-20 seconds for basic app, up to 5-15 minutes for complex apps. Set timeout to 30+ minutes.
  - Optimizes and builds static assets
  - Required before deployment

- **Production preview:** `npm run start`
  - Takes ~270ms to start after successful build
  - Requires `npm run build` to be run first
  - Serves production build locally

### Testing
- **Run all tests:** `npm run test` (if Jest/testing framework is added)
  - NEVER CANCEL: Takes 2-10 minutes depending on test suite. Set timeout to 20+ minutes.

- **Run tests in watch mode:** `npm run test:watch` (if configured)
  - NEVER CANCEL: Runs continuously. Set timeout to 60+ minutes.

### Database Operations (Prisma)
- **Generate Prisma client:** `npx prisma generate`
  - NEVER CANCEL: Takes 30-90 seconds. Set timeout to 5+ minutes.
  - Run after any schema changes

- **Run database migrations:** `npx prisma migrate dev`
  - NEVER CANCEL: Takes 30-120 seconds. Set timeout to 5+ minutes.
  - Creates and applies new migrations

- **View database:** `npx prisma studio`
  - NEVER CANCEL: Starts database GUI, runs continuously. Set timeout to 60+ minutes.
  - Available at http://localhost:5555

- **Reset database:** `npx prisma migrate reset`
  - NEVER CANCEL: Takes 30-90 seconds. Set timeout to 5+ minutes.
  - Resets database and reapplies all migrations

### Code Quality
- **Lint code:** `npm run lint`
  - NEVER CANCEL: Takes 2-5 seconds. Set timeout to 3+ minutes.
  - ALWAYS run before committing changes

- **Format code:** `npm run format` (if Prettier is configured)
  - NEVER CANCEL: Takes 15-60 seconds. Set timeout to 3+ minutes.

## Manual Validation Requirements

**CRITICAL: After making any changes, ALWAYS run through these complete scenarios:**

### 1. Basic Application Validation
1. Start development server: `npm run dev`
2. Navigate to http://localhost:3000 (may not be accessible in sandboxed environments)
3. Verify the page loads without errors (check console output for "Ready in" message)
4. Check browser console for any JavaScript errors (if browser access available)
5. Take a screenshot to document the working state (if UI access available)

### 2. Authentication Flow (Once NextAuth is configured)
1. Navigate to the login page
2. Test authentication with configured provider
3. Verify successful login redirects correctly
4. Test logout functionality
5. Verify session persistence across page refreshes

### 3. Database Connectivity (Once Prisma is configured)
1. Run `npx prisma studio`
2. Verify database connection is successful
3. Test basic CRUD operations if models exist
4. Verify data persistence

### 4. Build Process Validation
1. Run `npm run build`
2. Verify build completes without errors
3. Run `npm run start`
4. Test the production build loads correctly
5. Compare production vs development behavior

## Expected File Structure (After Initialization)

```
/
├── README.md ✓ (exists)
├── package.json (will be created)
├── package-lock.json ✓ (exists, currently empty)
├── next.config.js (will be created)
├── tailwind.config.js (will be created)
├── prisma/
│   ├── schema.prisma (will be created)
│   └── migrations/ (will be created)
├── src/
│   ├── app/ (Next.js 14 App Router)
│   ├── components/
│   ├── lib/
│   └── styles/
├── public/
├── .env.local (will be created)
├── .env.example (should be created)
└── .gitignore (will be created)
```

## Environment Variables (Once Configured)

Create `.env.local` with required variables:
```
DATABASE_URL="your-database-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## Deployment to Vercel

1. **Install Vercel CLI:** `npm i -g vercel`
2. **Login to Vercel:** `vercel login`
3. **Deploy:** `vercel --prod`
   - NEVER CANCEL: Takes 5-15 minutes. Set timeout to 30+ minutes.

## Troubleshooting Common Issues

- **"Cannot find module" errors:** Run `npm install` to ensure all dependencies are installed
- **Prisma client errors:** Run `npx prisma generate` after schema changes
- **Prisma init fails:** Network access to binaries.prisma.sh may be blocked in sandboxed environments - this is expected
- **Build failures:** Check that all environment variables are set correctly
- **Database connection issues:** Verify DATABASE_URL in .env.local
- **Production start fails:** Ensure `npm run build` completed successfully first
- **Network timeouts:** Some commands may fail in sandboxed environments due to firewall restrictions

## Development Workflow

1. **Before making changes:**
   - Ensure repository is properly initialized (see Initial Project Setup)
   - Run `git --no-pager status` to check current state
   - Run `npm run dev` to start development server

2. **During development:**
   - Make incremental changes
   - Test changes in browser at http://localhost:3000
   - Run `npm run lint` to check code quality

3. **Before committing:**
   - Run `npm run build` to ensure production build works
   - Run `npm run lint` and fix any issues
   - Run manual validation scenarios
   - Test the complete user flow

## Key Files to Monitor

- **package.json:** Dependencies and scripts configuration
- **next.config.js:** Next.js configuration
- **prisma/schema.prisma:** Database schema definitions  
- **src/app/layout.tsx:** Main application layout
- **src/app/page.tsx:** Home page component
- **tailwind.config.js:** TailwindCSS configuration

## Performance Expectations (VALIDATED)

- **npx create-next-app@14:** 10-15 seconds 
- **npm install (additional deps):** 15-20 seconds
- **npm run dev startup:** 1-2 seconds
- **npm run build:** 15-20 seconds (basic app), up to 15 minutes (complex app) - NEVER CANCEL
- **npm run start:** 270ms after successful build
- **npm run lint:** 2-5 seconds
- **prisma generate:** 30-90 seconds
- **prisma migrate dev:** 30-120 seconds
- **prisma init:** 30-60 seconds (may fail due to network restrictions in sandboxed environments)

## CRITICAL REMINDERS

- **NEVER CANCEL** any build, test, or migration commands
- **ALWAYS** set timeouts of 30+ minutes for build commands
- **ALWAYS** run manual validation scenarios after changes
- **ALWAYS** test both development and production builds
- Repository is currently in early stage - initialize first before development