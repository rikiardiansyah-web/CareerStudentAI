"use client";

import React, { useState } from "react";
import { Check, Edit3, X, Sparkles, ShieldAlert, ArrowRight } from "lucide-react";
import { FormulationResult } from "@/lib/geminiSocratic";

interface ApprovalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  userReflection: string;
  formulation: FormulationResult | null;
  onApprove: (finalText: string) => void;
  onManualEdit: (editedText: string) => void;
  onReject: () => void;
}

export function ApprovalGateModal({
  isOpen,
  onClose,
  originalText,
  userReflection,
  formulation,
  onApprove,
  onManualEdit,
  onReject,
}: ApprovalGateModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(formulation?.suggestedText || "");

  if (!isOpen || !formulation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-gate-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="approval-gate-title" className="text-base font-bold text-slate-900 font-heading">
                Gerbang Persetujuan Eksplisit
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Human-in-the-Loop • Konfirmasi Kedaulatan Konten
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Comparison */}
        <div className="space-y-4 mb-6">
          {/* 1. Teks Asli Pengguna */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Poin Asli di Resume:
            </span>
            <p className="text-xs text-slate-700 italic">"{originalText}"</p>
          </div>

          {/* 2. Refleksi Otentik Pengguna */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Konteks Otentik yang Kamu Ingat (Jawabanmu):
            </span>
            <p className="text-xs text-amber-950 font-medium">"{userReflection}"</p>
          </div>

          {/* 3. Draf Hasil Formulasi Sokratik */}
          <div className="bg-indigo-50/50 border-2 border-indigo-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Rekomendasi Formulasi Terstruktur:
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                ATS-Optimized
              </span>
            </div>

            {!isEditing ? (
              <p className="text-sm font-semibold text-slate-900 leading-relaxed mb-3">
                {customText || formulation.suggestedText}
              </p>
            ) : (
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full text-xs font-medium p-2.5 bg-white border border-indigo-300 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-900 mb-2"
                placeholder="Sesuaikan narasi kata-katamu sendiri..."
              />
            )}

            {/* Formula Breakdown Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-indigo-100 text-[10px]">
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                Aksi: <strong className="text-indigo-700">{formulation.formulaBreakdown.actionVerb}</strong>
              </span>
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                Metrik: <strong className="text-teal-700">{formulation.formulaBreakdown.measurableOutcome}</strong>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-normal">
            💡 {formulation.explanation}
          </p>
        </div>

        {/* Action Gate Buttons (Three Pillars of HITL) */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
          <button
            onClick={onReject}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            <span>Tolak Draf</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setCustomText(customText || formulation.suggestedText);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              <span>Edit Manual</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onManualEdit(customText);
                onClose();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              <span>Simpan Suntingan Manual</span>
            </button>
          )}

          <button
            onClick={() => {
              onApprove(customText || formulation.suggestedText);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 mr-1.5" />
            <span>Setujui & Terapkan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
