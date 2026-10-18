"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, ArrowRight } from "lucide-react";
import { EvaluatedSkill } from "@/lib/skillGapEvaluator";

interface SkillMatrixViewProps {
  matchPercentage: number;
  categorizedSkills: {
    strongMatches: EvaluatedSkill[];
    partialMatches: EvaluatedSkill[];
    criticalGaps: EvaluatedSkill[];
  };
  onJumpToRoadmap: () => void;
}

export function SkillMatrixView({
  matchPercentage,
  categorizedSkills,
  onJumpToRoadmap,
}: SkillMatrixViewProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "STRONG" | "PARTIAL" | "GAP">("ALL");

  const { strongMatches, partialMatches, criticalGaps } = categorizedSkills;
  const totalSkills = strongMatches.length + partialMatches.length + criticalGaps.length;

  return (
    <div className="space-y-6">
      {/* Executive Gap Summary Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Progress Ring / Numeric Match */}
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center shrink-0">
            <span className="text-2xl font-black text-teal-800 leading-none">
              {matchPercentage}%
            </span>
            <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider mt-0.5">
              Match
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Matriks Kesiapan Kompetensi Industri
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {strongMatches.length} Siap • {partialMatches.length} Perlu Penguatan • {criticalGaps.length} Gap
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Skor dihitung secara transparan dari rasio keterampilan yang terbukti pada portofoliomu terhadap taksonomi standar rekruter industri.
            </p>
          </div>
        </div>

        <button
          onClick={onJumpToRoadmap}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer w-full md:w-auto shrink-0"
        >
          <span>Buka Roadmap Belajar 4 Minggu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2" role="tablist">
        <button
          onClick={() => setActiveFilter("ALL")}
          className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeFilter === "ALL"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
          role="tab"
          aria-selected={activeFilter === "ALL"}
        >
          Semua Keterampilan ({totalSkills})
        </button>
        <button
          onClick={() => setActiveFilter("GAP")}
          className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === "GAP"
              ? "bg-red-600 text-white"
              : "bg-white border border-slate-200 text-red-700 hover:bg-red-50"
          }`}
          role="tab"
          aria-selected={activeFilter === "GAP"}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          Critical Gap ({criticalGaps.length})
        </button>
        <button
          onClick={() => setActiveFilter("PARTIAL")}
          className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === "PARTIAL"
              ? "bg-amber-600 text-white"
              : "bg-white border border-slate-200 text-amber-800 hover:bg-amber-50"
          }`}
          role="tab"
          aria-selected={activeFilter === "PARTIAL"}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Partial Match ({partialMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter("STRONG")}
          className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === "STRONG"
              ? "bg-teal-700 text-white"
              : "bg-white border border-slate-200 text-teal-800 hover:bg-teal-50"
          }`}
          role="tab"
          aria-selected={activeFilter === "STRONG"}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Strong Match ({strongMatches.length})
        </button>
      </div>

      {/* Grid of Skill Cards (Zero-Slop Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render Critical Gaps */}
        {(activeFilter === "ALL" || activeFilter === "GAP") &&
          criticalGaps.map((item) => (
            <div
              key={item.skill.id}
              className="bg-white border-2 border-red-100 rounded-xl p-5 hover:border-red-300 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    <AlertOctagon className="w-3 h-3 text-red-600" />
                    Critical Gap
                  </span>
                  {item.skill.isCritical && (
                    <span className="text-[10px] font-semibold text-slate-500">
                      Wajib Rekruter
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1 font-heading">
                  {item.skill.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.skill.description}
                </p>
              </div>

              <div className="bg-red-50/60 border border-red-200 rounded-lg p-2.5 mt-2">
                <span className="text-[10px] font-bold text-red-900 uppercase tracking-wider block mb-0.5">
                  Langkah Aksi Menutup Gap:
                </span>
                <p className="text-xs text-red-950 font-medium leading-relaxed">
                  {item.recommendation}
                </p>
              </div>
            </div>
          ))}

        {/* Render Partial Matches */}
        {(activeFilter === "ALL" || activeFilter === "PARTIAL") &&
          partialMatches.map((item) => (
            <div
              key={item.skill.id}
              className="bg-white border border-amber-200 rounded-xl p-5 hover:border-amber-300 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Partial Match
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Kategori: {item.skill.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1 font-heading">
                  {item.skill.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.evidenceText || item.skill.description}
                </p>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-2.5 mt-2">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
                  Penguatan Portofolio:
                </span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {item.recommendation}
                </p>
              </div>
            </div>
          ))}

        {/* Render Strong Matches */}
        {(activeFilter === "ALL" || activeFilter === "STRONG") &&
          strongMatches.map((item) => (
            <div
              key={item.skill.id}
              className="bg-white border border-teal-200 rounded-xl p-5 hover:border-teal-300 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    Strong Match
                  </span>
                  <span className="text-[10px] font-semibold text-teal-700">
                    Terbukti
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1 font-heading">
                  {item.skill.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.evidenceText || item.skill.description}
                </p>
              </div>

              <div className="bg-teal-50/60 border border-teal-200 rounded-lg p-2.5 mt-2">
                <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block mb-0.5">
                  Tips Saat Wawancara:
                </span>
                <p className="text-xs text-teal-950 font-medium leading-relaxed">
                  {item.recommendation}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
