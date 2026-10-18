"use client";

import React from "react";
import {
  MapPin,
  Building2,
  Briefcase,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { MatchResult } from "@/lib/careerMatcher";

interface RoleMatchCardProps {
  result: MatchResult;
  onBridgeToSkillGap: (roleId: string, roleTitle: string) => void;
}

function MatchBadge({ percentage }: { percentage: number }) {
  let color: string;
  let label: string;
  if (percentage >= 70) {
    color = "bg-teal-100 text-teal-800 border-teal-200";
    label = "Sangat Cocok";
  } else if (percentage >= 40) {
    color = "bg-amber-100 text-amber-800 border-amber-200";
    label = "Potensial";
  } else {
    color = "bg-red-100 text-red-800 border-red-200";
    label = "Perlu Persiapan";
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${color}`}
    >
      {percentage}% — {label}
    </span>
  );
}

export function RoleMatchCard({
  result,
  onBridgeToSkillGap,
}: RoleMatchCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { opportunity: opp } = result;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-indigo-200 transition-all duration-200">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">
              {opp.roleTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {opp.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {opp.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {opp.workMode}
              </span>
            </div>
          </div>
          <MatchBadge percentage={result.matchPercentage} />
        </div>

        {/* Rentang Gaji */}
        <p className="text-sm font-semibold text-indigo-700 mb-3">
          {opp.salaryRange}
        </p>

        {/* Deskripsi Singkat */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {opp.roleDescription}
        </p>

        {/* Skill Match Visual */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {result.matchedSkills.map((s) => (
            <span
              key={s}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200"
            >
              ✓ {s}
            </span>
          ))}
          {result.partialSkills.map((s) => (
            <span
              key={s}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
            >
              ◐ {s}
            </span>
          ))}
          {result.missingSkills.map((s) => (
            <span
              key={s}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200"
            >
              ✗ {s}
            </span>
          ))}
        </div>

        {/* Formula Transparency */}
        <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-[10px] text-slate-500 font-mono">
            📐 {result.formulaExplanation}
          </p>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer min-h-[36px]"
        >
          {isExpanded ? (
            <>
              Tutup detail
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Lihat alasan kecocokan & tantangan
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expanded: Explainable AI Section */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/50">
          {/* Mengapa Relevan */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                Mengapa Relevan untuk Kamu
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {opp.whyRelevant}
              </p>
            </div>
          </div>

          {/* Tantangan */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                Tantangan yang Perlu Diantisipasi
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {opp.challengesToFace}
              </p>
            </div>
          </div>

          {/* Growth Path */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                Jalur Karier dari Posisi Ini
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {opp.growthPath}
              </p>
            </div>
          </div>

          {/* Nice to Have */}
          {opp.niceToHaveSkills.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Skill Bonus (Nice to Have)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {opp.niceToHaveSkills.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bridge CTA → MOD-02 Skill-Gap */}
          <button
            onClick={() =>
              onBridgeToSkillGap(
                opp.linkedSkillGapRoleId,
                opp.roleTitle
              )
            }
            className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Target className="w-4 h-4" />
            Petakan Skill Gap untuk Peran Ini
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
