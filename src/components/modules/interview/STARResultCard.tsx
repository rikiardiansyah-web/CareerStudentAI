"use client";

import React from "react";
import {
  Star,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  BrainCircuit,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SessionEvaluation, StarDimension } from "@/lib/interviewEngine";

interface STARResultCardProps {
  evaluation: SessionEvaluation;
  selfReflection: string;
  targetRoleTitle: string;
  onRestart: () => void;
}

// Warna dan label per dimensi
const dimensionMeta: Record<
  StarDimension,
  { label: string; fullLabel: string; color: string; bgColor: string; barColor: string }
> = {
  situation: {
    label: "S",
    fullLabel: "Situation",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500",
  },
  task: {
    label: "T",
    fullLabel: "Task",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    barColor: "bg-violet-500",
  },
  action: {
    label: "A",
    fullLabel: "Action",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    barColor: "bg-amber-500",
  },
  result: {
    label: "R",
    fullLabel: "Result",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    barColor: "bg-teal-500",
  },
};

function ScoreLabel(score: number): string {
  if (score >= 4.5) return "Sangat Kuat";
  if (score >= 3.5) return "Kuat";
  if (score >= 2.5) return "Cukup";
  if (score >= 1.5) return "Perlu Perbaikan";
  return "Sangat Lemah";
}

function ScoreBadgeColor(score: number): string {
  if (score >= 4) return "bg-teal-100 text-teal-800 border-teal-200";
  if (score >= 3) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
}

export function STARResultCard({
  evaluation,
  selfReflection,
  targetRoleTitle,
  onRestart,
}: STARResultCardProps) {
  const [showReflection, setShowReflection] = React.useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header Evaluasi */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
          <Star className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Evaluasi STAR — {targetRoleTitle}
        </h2>
        <p className="text-sm text-slate-500">
          Skor berdasarkan kualitas jawaban dan kedalaman dimensi STAR
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Skor Keseluruhan
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl font-extrabold text-slate-900">
            {evaluation.overallScore.toFixed(1)}
          </span>
          <span className="text-lg text-slate-400">/5.0</span>
        </div>
        <span
          className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border ${ScoreBadgeColor(
            evaluation.overallScore
          )}`}
        >
          {ScoreLabel(evaluation.overallScore)}
        </span>
        <p className="text-[10px] text-slate-400 mt-2">
          Formula: Rata-rata tertimbang STAR 4 dimensi × depth coverage
        </p>
      </div>

      {/* STAR Breakdown Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Breakdown per Dimensi STAR
        </h3>
        <div className="space-y-4">
          {evaluation.starScores.map((star) => {
            const meta = dimensionMeta[star.dimension];
            return (
              <div key={star.dimension} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-md ${meta.bgColor} ${meta.color} flex items-center justify-center text-xs font-extrabold`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {meta.fullLabel}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border ${ScoreBadgeColor(
                      star.score
                    )}`}
                  >
                    {star.score}/5
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${meta.barColor}`}
                    style={{ width: `${(star.score / 5) * 100}%` }}
                  />
                </div>

                {/* Rationale & Missing */}
                <div className="flex flex-col sm:flex-row gap-2 text-xs pl-9">
                  <p className="text-slate-600 flex-1">
                    <span className="font-semibold text-slate-700">Evaluasi:</span>{" "}
                    {star.rationale}
                  </p>
                  {star.missingElement && (
                    <p className="text-amber-600 flex-1">
                      <span className="font-semibold">Belum ada:</span>{" "}
                      {star.missingElement}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kekuatan & Area Pertumbuhan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kekuatan
            </h3>
          </div>
          <ul className="space-y-2">
            {evaluation.strengths.map((s, i) => (
              <li
                key={i}
                className="text-sm text-slate-700 leading-relaxed flex gap-2"
              >
                <span className="text-teal-500 font-bold flex-shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Area Pertumbuhan
            </h3>
          </div>
          <ul className="space-y-2">
            {evaluation.growthAreas.map((g, i) => (
              <li
                key={i}
                className="text-sm text-slate-700 leading-relaxed flex gap-2"
              >
                <span className="text-amber-500 font-bold flex-shrink-0">△</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cognitive Insight */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Wawasan Kognitif
          </h3>
        </div>
        <p className="text-sm text-indigo-800 leading-relaxed">
          {evaluation.cognitiveInsight}
        </p>
      </div>

      {/* Rekomendasi Latihan */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Rekomendasi Latihan Selanjutnya
          </h3>
        </div>
        <p className="text-sm text-teal-800 leading-relaxed">
          {evaluation.nextPracticeRecommendation}
        </p>
      </div>

      {/* Refleksi Mandiri (Collapsible) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowReflection(!showReflection)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Refleksi Mandiri yang Kamu Tulis
          </span>
          {showReflection ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {showReflection && (
          <div className="px-4 pb-4 pt-0 border-t border-slate-100">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-3">
              {selfReflection}
            </p>
          </div>
        )}
      </div>

      {/* Tombol Mulai Ulang */}
      <button
        onClick={onRestart}
        className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
      >
        <RotateCcw className="w-5 h-5" />
        Mulai Sesi Wawancara Baru
      </button>
    </div>
  );
}
