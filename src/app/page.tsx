"use client";

import React from "react";
import {
  FileText,
  Target,
  Mic,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { OfflineBanner } from "@/components/ui/StatusStates";
import { CvModuleContainer } from "@/components/modules/cv/CvModuleContainer";
import { SkillGapContainer } from "@/components/modules/skillgap/SkillGapContainer";
import { MockInterviewContainer } from "@/components/modules/interview/MockInterviewContainer";
import { CareerDiscoveryContainer } from "@/components/modules/career/CareerDiscoveryContainer";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useAppStore, TabId } from "@/lib/store/useAppStore";

export default function Home() {
  const { isOnline } = useNetworkStatus();
  const { activeTab, setActiveTab, persona } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-6">
      <OfflineBanner isOnline={isOnline} />
      <AppHeader />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Executive Welcome Hero */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Gen-Think: Human-in-the-Loop Co-Pilot</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading mb-3">
                    {persona.isAuthenticated
                      ? `Selamat Datang, ${persona.name}!`
                      : "Selamat Datang di CareerStudent AI!"}
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    {persona.isAuthenticated
                      ? `Akunmu terhubung (${persona.email}). Siap memetakan kompetensi riil, mengoptimasi CV secara Sokratik, dan melatih argumen wawancaramu.`
                      : "Pendamping karier kognitif berbasis Human-in-the-Loop. Masuk dengan Email OTP atau gunakan fitur eksplorasi langsung di bawah ini."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      Anti-Ghostwriting
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      Explicit Approval Gate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      PWA Offline Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Core Functional Modules (Anti-Slop Grid) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Modul Persiapan Karier Kognitif
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    Target: {persona.targetRoleTitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card MOD-01 */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all duration-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        MOD-01 • HITL
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2 mb-1.5">
                        Interactive CV & Reflective ATS Optimizer
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        Unggah CV, identifikasi poin bullet yang lemah, dan perbaiki deskripsi dampakmu lewat pertanyaan pemantik Sokratik dengan konfirmasi eksplisit.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("cv-analyzer")}
                      className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200 hover:border-indigo-200"
                    >
                      <span>Buka CV Optimizer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card MOD-02 */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all duration-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                        <Target className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        MOD-02 • Evidence-Based
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2 mb-1.5">
                        Skill-Gap Analysis & Actionable Roadmap
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        Bandingkan keterampilanmu terhadap taksonomi industri terkini. Dapatkan matriks kompetensi dan rancangan kurikulum belajar mingguan yang disetujui pengguna.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("skill-gap")}
                      className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200 hover:border-teal-200"
                    >
                      <span>Buka Matriks Skill-Gap</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card MOD-03 */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all duration-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                        <Mic className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        MOD-03 • STAR Method
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2 mb-1.5">
                        Cognitive Mock Interview Simulator
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        Simulasi wawancara adaptif dengan pertanyaan pendalaman dinamis. Wajib isi refleksi diri mandiri terlebih dahulu sebelum evaluasi AI STAR dibuka.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("mock-interview")}
                      className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200 hover:border-amber-200"
                    >
                      <span>Mulai Sesi Simulasi</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card MOD-04 */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all duration-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                        <Compass className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                        MOD-04 • Explainable AI
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2 mb-1.5">
                        Career Opportunity & Job Matching Discovery
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        Temukan peran kerja relevan dengan transparansi alasan kecocokan dan mitigasi tantangan riil, langsung terhubung ke analisis kesenjangan kompetensi.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("career-discovery")}
                      className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200 hover:border-indigo-200"
                    >
                      <span>Eksplorasi Peluang Karier</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Views */}
          {activeTab === "cv-analyzer" && <CvModuleContainer />}

          {activeTab === "skill-gap" && <SkillGapContainer />}

          {activeTab === "mock-interview" && <MockInterviewContainer />}

          {activeTab === "career-discovery" && <CareerDiscoveryContainer />}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
