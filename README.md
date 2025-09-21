# real-estate-platform
Full-stack real estate platform built with Next.js 14, Prisma, NextAuth, and TailwindCSS, designed for deployment on Vercel

## Features
- 🔐 Authentication with NextAuth.js (Google, GitHub OAuth)
- 🗄️ Database integration with Prisma
- 🎨 Styled with TailwindCSS
- 📱 Responsive design
- 🚀 Built with Next.js 14 App Router

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
DATABASE_URL=your_database_url
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
