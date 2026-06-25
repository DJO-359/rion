import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { StorefrontShell } from "@/components/layout/storefront-shell";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RION — строительный гипермаркет | Плитка, сантехника, ремонт",
  description:
    "5 000+ товаров для ремонта и интерьера. Плитка, ламинат, сантехника, люстры. Доставка по Северному Кавказу. Бесплатная консультация.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StorefrontShell>{children}</StorefrontShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
