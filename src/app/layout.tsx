import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real Estate Platform',
  description: 'Full-stack real estate platform built with Next.js 14, Prisma, NextAuth, and TailwindCSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}