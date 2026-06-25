"use client";



import { usePathname } from "next/navigation";

import { Header } from "./header";

import { Footer } from "./footer";

import { ConsultationProvider } from "@/components/storefront/consultation-context";

import { ConsultationModal } from "@/components/storefront/consultation-modal";

import { FeedbackButton } from "@/components/storefront/feedback-button";



export function StorefrontShell({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const isAdmin =

    pathname?.startsWith("/admin") || pathname === "/admin-login";



  if (isAdmin) return <>{children}</>;



  return (

    <ConsultationProvider>

      <Header />

      <main className="mx-auto min-h-screen w-full flex-1">{children}</main>

      <Footer />

      <FeedbackButton />

      <ConsultationModal />

    </ConsultationProvider>

  );

}

