import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: "Plataforma Inmobiliaria",
  description: "Sistema completo de gestión inmobiliaria desarrollado con Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
