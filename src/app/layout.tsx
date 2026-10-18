import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "CAREERSTUDENT AI — Adaptive Career Co-Pilot",
  description: "Gen-Think: Bridging Human Intelligence in the Digital Era. Adaptive Career Readiness & Socratic Co-Pilot for Students & Fresh Graduates.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CareerAI",
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <AuthProvider>
          <ServiceWorkerRegister />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
