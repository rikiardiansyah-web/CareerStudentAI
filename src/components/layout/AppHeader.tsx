"use client";

import React, { useState } from "react";
import { Download, ShieldCheck, Target, Sparkles, LogIn, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { useAppStore } from "@/lib/store/useAppStore";
import { AuthModal } from "@/components/auth/AuthModal";

export function AppHeader() {
  const { persona, setPersona } = useAppStore();
  const { data: session } = useSession();
  const { isInstallable, promptInstall } = usePwaInstall();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Jika session login NextAuth aktif, sinkronkan ke persona store
  React.useEffect(() => {
    if (session?.user?.email) {
      if (session.user.email !== persona.email || !persona.isAuthenticated) {
        setPersona({
          name: session.user.name || session.user.email.split("@")[0],
          email: session.user.email,
          educationLevel: "FINAL_YEAR_STUDENT",
          targetRoleId: persona.targetRoleId || "pm_jr",
          targetRoleTitle: persona.targetRoleTitle || "Junior Product Manager",
          isAuthenticated: true,
        });
      }
    } else if (persona.isAuthenticated) {
      // Saat session sudah tidak ada (logout)
      setPersona({
        name: "Tamu",
        email: undefined,
        educationLevel: "FINAL_YEAR_STUDENT",
        targetRoleTitle: "Pilih Target Karier",
        targetRoleId: "pm_jr",
        isAuthenticated: false,
      });
    }
  }, [session, persona.email, persona.isAuthenticated, persona.targetRoleId, persona.targetRoleTitle, setPersona]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Philosophy Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 font-heading">
                CAREERSTUDENT<span className="text-indigo-600">.AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gen-Think
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium">
              Adaptive Career Co-Pilot • Human-in-the-Loop
            </p>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Target Role Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-semibold border border-slate-200">
            <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate max-w-[140px] md:max-w-[200px]">{persona.targetRoleTitle}</span>
          </div>

          {/* Privacy Consent Badge */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 font-medium px-2 py-1 bg-slate-50 rounded border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Private & Zero-Training</span>
          </div>

          {/* Akun / Tombol Login */}
          {session?.user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Keluar"
                aria-label="Keluar dari akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </button>
          )}

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={promptInstall}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              aria-label="Install Aplikasi CareerStudent AI"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Install App</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
