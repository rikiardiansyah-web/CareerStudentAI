"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  FileText,
  CheckCircle2,
  BrainCircuit,
  LayoutTemplate,
  Bot,
  PlusCircle,
  UploadCloud,
  Layers,
  Sparkles,
  ArrowRight,
  FileDown,
} from "lucide-react";
import { ParsedSection } from "@/lib/resumeParser";
import { ResumeUploader } from "./ResumeUploader";
import { ReflectiveFeedbackPane } from "./ReflectiveFeedbackPane";
import { FastCvBuilder } from "./FastCvBuilder";
import { CvExportModal } from "./CvExportModal";
import { CvMentorChatModal } from "./CvMentorChatModal";
import { useAppStore } from "@/lib/store/useAppStore";
import { CV_TEMPLATE_PRESETS, CvTemplatePreset } from "@/data/cvTemplates";

const LOCAL_STORAGE_KEY = "careerstudent_cv_draft_v1";

export function CvModuleContainer() {
  const { persona, setPersona } = useAppStore();
  const [sections, setSections] = useState<ParsedSection[]>([]);
  const [rawText, setRawText] = useState<string>("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMentorChatOpen, setIsMentorChatOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"builder" | "optimizer">("builder");
  const [landingTab, setLandingTab] = useState<"presets" | "upload" | "blank">("presets");

  // Pulihkan draf lokal saat pertama kali dimuat
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sections && parsed.sections.length > 0) {
          setSections(parsed.sections);
          setRawText(parsed.rawText || "");
          setLastSaved("Draf sebelumnya dipulihkan");
        }
      }
    } catch (e) {
      console.warn("Gagal memulihkan draf lokal:", e);
    }
  }, []);

  // Simpan otomatis ke localStorage
  const saveToLocal = (updatedSections: ParsedSection[], updatedRaw: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          sections: updatedSections,
          rawText: updatedRaw,
          timestamp: Date.now(),
        })
      );
      const time = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLastSaved(`Tersimpan pukul ${time}`);
    } catch (e) {
      console.warn("Auto-save gagal:", e);
    }
  };

  const handleParsed = (newSections: ParsedSection[], newRaw: string) => {
    setSections(newSections);
    setRawText(newRaw);
    saveToLocal(newSections, newRaw);
    setViewMode("builder");
  };

  // Muat Preset Template Instan dari Landing
  const handleLoadPreset = (preset: CvTemplatePreset) => {
    setPersona({
      name: preset.persona.name,
      targetRoleTitle: preset.persona.targetRoleTitle,
      email: preset.persona.email,
      phone: preset.persona.phone,
      address: preset.persona.address,
      summary: preset.persona.summary,
    });
    setSections(preset.sections);
    saveToLocal(preset.sections, "");
    setViewMode("builder");
  };

  // Buat CV Kosong Bersih
  const handleStartBlank = () => {
    const blankSections: ParsedSection[] = [
      {
        type: "SUMMARY",
        title: "Ringkasan Profil",
        bullets: [
          {
            id: `b_sum_${Date.now()}`,
            originalText: "Tuliskan ringkasan singkat profil profesionalmu di sini...",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EXPERIENCE",
        title: "Pengalaman Kerja & Organisasi",
        bullets: [
          {
            id: `b_exp_${Date.now()}`,
            originalText: "Posisi Pekerjaan, Nama Perusahaan | 2023 – Sekarang",
            approvalStatus: "APPROVED",
          },
          {
            id: `b_exp_sub_${Date.now()}`,
            originalText: "Menjalankan tanggung jawab operasional utama dan mencapai target yang ditetapkan.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EDUCATION",
        title: "Pendidikan",
        bullets: [
          {
            id: `b_edu_${Date.now()}`,
            originalText: "Nama Universitas / Perguruan Tinggi | Tahun Kelulusan",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "SKILL",
        title: "Keahlian & Sertifikasi",
        bullets: [
          {
            id: `b_skl_${Date.now()}`,
            originalText: "Keahlian Utama: Keterampilan 1, Keterampilan 2, Tools",
            approvalStatus: "APPROVED",
          },
        ],
      },
    ];
    setSections(blankSections);
    saveToLocal(blankSections, "");
    setViewMode("builder");
  };

  const handleUpdateSections = (newSections: ParsedSection[]) => {
    setSections(newSections);
    saveToLocal(newSections, rawText);
  };

  const handleUpdateBullet = (
    sectionIdx: number,
    bulletId: string,
    updates: {
      finalText?: string;
      approvalStatus: "PENDING_REVIEW" | "APPROVED" | "MANUALLY_EDITED" | "REJECTED";
      userReflectionText?: string;
    }
  ) => {
    setSections((prev) => {
      const next = [...prev];
      const targetSec = next[sectionIdx];
      if (!targetSec) return prev;

      const bulletIdx = targetSec.bullets.findIndex((b) => b.id === bulletId);
      if (bulletIdx === -1) return prev;

      targetSec.bullets[bulletIdx] = {
        ...targetSec.bullets[bulletIdx],
        ...updates,
      };

      saveToLocal(next, rawText);
      return next;
    });
  };

  const handleResetCv = () => {
    if (confirm("Apakah kamu yakin ingin mengunggah atau membuat CV baru? Seluruh draf saat ini akan direset.")) {
      setSections([]);
      setRawText("");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setLastSaved(null);
      setLandingTab("presets");
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Top Navigation Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              MOD-01 • CV Builder & Optimizer
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Standar ATS & Desain Profesional</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
            Interactive CV Analyzer & Builder
          </h2>
        </div>

        {sections.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Toggle Mode: Fast Builder vs Socratic Optimizer */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("builder")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "builder"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Formulir Cepat</span>
              </button>

              <button
                onClick={() => setViewMode("optimizer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "optimizer"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Uji Sokratik ATS</span>
              </button>
            </div>

            {lastSaved && (
              <span className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded-md hidden lg:flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                {lastSaved}
              </span>
            )}

            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={handleResetCv}
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-red-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Ganti / Reset CV"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ganti CV</span>
            </button>
          </div>
        )}
      </div>

      {/* Main View: Empty Landing vs Active Workspace */}
      {sections.length === 0 ? (
        <div className="space-y-6">
          {/* Welcome Card & Chooser */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              Buat CV Profesional Tanpa Ribet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
              Pilih cara tercepat yang kamu sukai: mulai dari template teruji (Executive Modern / Classic ATS Standard), isi formulir ringkas, atau unggah CV yang sudah kamu miliki.
            </p>

            {/* Sub-tab Chooser */}
            <div className="flex justify-center gap-2 mt-6 mb-8">
              <button
                onClick={() => setLandingTab("presets")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  landingTab === "presets"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Pilihan Template Siap Pakai</span>
              </button>

              <button
                onClick={() => setLandingTab("upload")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  landingTab === "upload"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Unggah Berkas PDF/TXT</span>
              </button>
            </div>

            {/* Content: Template Presets Grid */}
            {landingTab === "presets" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {CV_TEMPLATE_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/50 hover:bg-white"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {preset.style === "modern" ? "Modern Layout" : "Classic ATS"}
                        </span>
                        <span className="text-xs text-slate-400">A4 Standar</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        {preset.name}
                      </h4>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">
                        {preset.roleTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Gunakan Template Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Content: Upload Mode */
              <div className="max-w-xl mx-auto">
                <ResumeUploader onParsed={handleParsed} />
              </div>
            )}

            {/* Alternatif: Mulai dari Kosong */}
            <div className="mt-8 pt-5 border-t border-slate-200 text-center">
              <button
                onClick={handleStartBlank}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Atau ingin isi sendiri formulir bersih dari nol? Klik di sini →</span>
              </button>
            </div>
          </div>
        </div>
      ) : viewMode === "builder" ? (
        /* Workspace Mode 1: Fast CV Builder */
        <FastCvBuilder
          sections={sections}
          onUpdateSections={handleUpdateSections}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenSocraticPane={() => setViewMode("optimizer")}
          onOpenMentorChat={() => setIsMentorChatOpen(true)}
        />
      ) : (
        /* Workspace Mode 2: Socratic ATS Optimizer */
        <ReflectiveFeedbackPane
          sections={sections}
          onUpdateBullet={handleUpdateBullet}
          onOpenExport={() => setIsExportOpen(true)}
        />
      )}

      {/* Export Modal with Live Modern & Classic Document Previews */}
      <CvExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        sections={sections}
      />

      {/* Career Mentor AI Chat Dialog Modal */}
      <CvMentorChatModal
        isOpen={isMentorChatOpen}
        onClose={() => setIsMentorChatOpen(false)}
        currentSectionTitle={sections[0]?.title}
      />
    </div>
  );
}
