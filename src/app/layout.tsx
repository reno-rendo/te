import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { WelcomeModal } from "@/components/WelcomeModal";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SaPlay - Nonton Drama Tanpa Drama",
  description: "Nonton drama pendek gratis dan tanpa iklan di SaPlay.",
};

import { MobileNavbar } from "@/components/MobileNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <div className="flex relative">
            <Suspense fallback={<div className="hidden lg:flex w-[260px] h-screen bg-muted" />}>
              <Sidebar />
            </Suspense>
            <div className="flex-1 flex flex-col min-h-screen min-w-0 pb-20 lg:pb-0">
              <Suspense fallback={<div className="h-16" />}>
                <Header />
              </Suspense>
              {children}
              <Footer />
            </div>
          </div>
          <MobileNavbar />
          <Toaster />
          <Sonner />
          <WelcomeModal />
        </Providers>
      </body>
    </html>
  );
}
