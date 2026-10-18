"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  FileCheck2,
  Bot,
  MessageSquare,
} from "lucide-react";
import { ParsedSection } from "@/lib/resumeParser";
import { SocraticAnalysis, FormulationResult } from "@/lib/geminiSocratic";
import { ApprovalGateModal } from "./ApprovalGateModal";
import { CvMentorChatModal } from "./CvMentorChatModal";

interface ReflectiveFeedbackPaneProps {
  sections: ParsedSection[];
  onUpdateBullet: (
    sectionIdx: number,
    bulletId: string,
    updates: {
      finalText?: string;
      approvalStatus: "PENDING_REVIEW" | "APPROVED" | "MANUALLY_EDITED" | "REJECTED";
      userReflectionText?: string;
    }
  ) => void;
  onOpenExport: () => void;
}

export function ReflectiveFeedbackPane({
  sections,
  onUpdateBullet,
  onOpenExport,
}: ReflectiveFeedbackPaneProps) {
  // Temukan bullet pertama yang tersedia
  const [selectedLocation, setSelectedLocation] = useState<{
    sectionIdx: number;
    bulletId: string;
  }>({
    sectionIdx: 0,
    bulletId: sections[0]?.bullets[0]?.id || "",
  });

  const [activeAnalysis, setActiveAnalysis] = useState<SocraticAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reflectionInput, setReflectionInput] = useState("");
  const [isFormulating, setIsFormulating] = useState(false);
  const [activeFormulation, setActiveFormulation] = useState<FormulationResult | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [isMentorChatOpen, setIsMentorChatOpen] = useState(false);

  // Dapatkan bullet yang sedang dipilih
  const currentSection = sections[selectedLocation.sectionIdx];
  const currentBullet = currentSection?.bullets.find(
    (b) => b.id === selectedLocation.bulletId
  );

  // Hitung Skor ATS Transparan (Formula-Based)
  const totalBullets = sections.reduce((acc, s) => acc + s.bullets.length, 0);
  const approvedBullets = sections.reduce(
    (acc, s) =>
      acc +
      s.bullets.filter(
        (b) => b.approvalStatus === "APPROVED" || b.approvalStatus === "MANUALLY_EDITED"
      ).length,
    0
  );
  const atsScore = totalBullets > 0 ? Math.min(100, Math.round(50 + (approvedBullets / totalBullets) * 45)) : 50;

  // Analisis Sokratik saat bullet baru dipilih
  const handleSelectBullet = async (sIdx: number, bId: string, text: string) => {
    setSelectedLocation({ sectionIdx: sIdx, bulletId: bId });
    setReflectionInput("");
    setIsAnalyzing(true);
    setActiveAnalysis(null);

    try {
      const res = await fetch("/api/resume/analyze-reflective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulletText: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Gagal mengambil kritik Sokratik:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Formulasi & Buka Gerbang Persetujuan
  const handleTriggerGate = async () => {
    if (!currentBullet || !reflectionInput.trim()) return;

    setIsFormulating(true);
    try {
      const res = await fetch("/api/resume/generate-formula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: currentBullet.originalText,
          userReflection: reflectionInput,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveFormulation(data.formulation);
        setIsGateOpen(true);
      }
    } catch (err) {
      console.error("Gagal merumuskan kalimat:", err);
    } finally {
      setIsFormulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top ATS Transparency Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center shrink-0">
            <span className="text-xl font-black text-indigo-700 leading-none">{atsScore}</span>
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider mt-0.5">/100</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Skor Keselarasan ATS & Diksi Reflektif
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {approvedBullets} dari {totalBullets} Poin Teroptimasi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Skor meningkat seiring setiap poin resume kamu pertajam melalui gerbang persetujuan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsMentorChatOpen(true)}
            className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 shadow-xs transition-colors cursor-pointer flex-1 sm:flex-initial justify-center"
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Tanya Career Mentor AI</span>
          </button>

          <button
            onClick={onOpenExport}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex-1 sm:flex-initial justify-center"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Ekspor Resume Teroptimasi</span>
          </button>
        </div>
      </div>

      {/* Dual Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Struktur Resume & Pilihan Bullet (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Struktur Dokumen CV
            </h4>
            <span className="text-[11px] text-slate-500">
              Pilih poin bullet untuk membuka dialog Sokratik
            </span>
          </div>

          <div className="space-y-6">
            {sections.map((section, sIdx) => (
              <div key={section.type} className="space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {section.title}
                </h5>

                <div className="space-y-2">
                  {section.bullets.map((bullet) => {
                    const isSelected = bullet.id === selectedLocation.bulletId;
                    const isApproved =
                      bullet.approvalStatus === "APPROVED" ||
                      bullet.approvalStatus === "MANUALLY_EDITED";

                    return (
                      <div
                        key={bullet.id}
                        onClick={() => handleSelectBullet(sIdx, bullet.id, bullet.originalText)}
                        className={`p-3.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer min-h-[44px] ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 shadow-sm"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              bullet.approvalStatus === "APPROVED"
                                ? "bg-teal-100 text-teal-800"
                                : bullet.approvalStatus === "MANUALLY_EDITED"
                                ? "bg-blue-100 text-blue-800"
                                : bullet.approvalStatus === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {bullet.approvalStatus === "APPROVED"
                              ? "✓ Disetujui"
                              : bullet.approvalStatus === "MANUALLY_EDITED"
                              ? "✎ Diedit Manual"
                              : bullet.approvalStatus === "REJECTED"
                              ? "✕ Ditolak"
                              : "Perlu Refleksi"}
                          </span>

                          {isSelected && (
                            <span className="text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                              Aktif <ArrowRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <p className={`leading-relaxed ${isApproved ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                          {bullet.finalText || bullet.originalText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Socratic Feedback Pane (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 sticky top-24">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <BrainCircuit className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Socratic Feedback Pane
              </h4>
              <p className="text-[11px] text-slate-500">
                Pemicu penalaran kognitif • Anti-Auto-Write
              </p>
            </div>
          </div>

          {currentBullet ? (
            <div className="space-y-4">
              {/* Teks Terpilih */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">
                  Poin yang Sedang Ditelaah:
                </span>
                <p className="italic">"{currentBullet.originalText}"</p>
              </div>

              {/* Status Analisis Sokratik */}
              {isAnalyzing ? (
                <div className="p-6 text-center text-slate-500 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                  <p className="text-xs font-semibold">Menelaah kelemahan diksi dan menyusun pertanyaan Sokratik...</p>
                </div>
              ) : activeAnalysis ? (
                <div className="space-y-3.5">
                  {/* Kritik Diksi */}
                  <div className="bg-red-50/60 border border-red-200 rounded-xl p-3 text-xs text-red-900">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                      Kritik Objektif AI:
                    </span>
                    <p className="leading-relaxed">{activeAnalysis.critique}</p>
                  </div>

                  {/* Pertanyaan Pemantik Sokratik */}
                  <div className="bg-amber-50/80 border-l-4 border-amber-500 border-y border-r border-amber-200 rounded-r-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Pertanyaan Pemantik Sokratik:</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      "{activeAnalysis.socraticPrompt}"
                    </p>
                  </div>

                  {/* Input Refleksi Pengguna */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Refleksi Otentikmu (Jawab Pertanyaan Pemantik di Atas):
                    </label>
                    <textarea
                      rows={4}
                      value={reflectionInput}
                      onChange={(e) => setReflectionInput(e.target.value)}
                      placeholder="Contoh: Kami berhasil mendatangkan 350 peserta dari 12 fakultas, menaikkan jumlah registrasi 25% dibanding tahun lalu..."
                      className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Tombol Rumuskan (Buka Approval Gate) */}
                  <button
                    onClick={handleTriggerGate}
                    disabled={isFormulating || !reflectionInput.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {isFormulating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Merumuskan Rekomendasi...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Rumuskan Ulang (Buka Approval Gate)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  Klik poin bullet di sebelah kiri untuk melihat dialog Sokratik.
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Pilih salah satu poin di sebelah kiri untuk memulai refleksi.
            </div>
          )}
        </div>
      </div>

      {/* Explicit Approval Gate Modal */}
      <ApprovalGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        originalText={currentBullet?.originalText || ""}
        userReflection={reflectionInput}
        formulation={activeFormulation}
        onApprove={(finalText) => {
          onUpdateBullet(selectedLocation.sectionIdx, selectedLocation.bulletId, {
            finalText,
            approvalStatus: "APPROVED",
            userReflectionText: reflectionInput,
          });
        }}
        onManualEdit={(editedText) => {
          onUpdateBullet(selectedLocation.sectionIdx, selectedLocation.bulletId, {
            finalText: editedText,
            approvalStatus: "MANUALLY_EDITED",
            userReflectionText: reflectionInput,
          });
        }}
        onReject={() => {
          onUpdateBullet(selectedLocation.sectionIdx, selectedLocation.bulletId, {
            approvalStatus: "REJECTED",
            userReflectionText: reflectionInput,
          });
          setIsGateOpen(false);
        }}
      />

      {/* Modal Dialog Chat Career Mentor AI Interaktif */}
      <CvMentorChatModal
        isOpen={isMentorChatOpen}
        onClose={() => setIsMentorChatOpen(false)}
        currentSectionTitle={currentSection?.title}
      />
    </div>
  );
}
