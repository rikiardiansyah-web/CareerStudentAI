"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { RoadmapWeek, RoadmapTask } from "@/lib/skillGapEvaluator";

interface RoadmapViewProps {
  roadmap: RoadmapWeek[];
  onToggleTask: (weekNumber: number, taskId: string) => void;
  onApproveWeek: (weekNumber: number) => void;
  onUpdateHours: (weekNumber: number, hours: number) => void;
}

export function RoadmapView({
  roadmap,
  onToggleTask,
  onApproveWeek,
  onUpdateHours,
}: RoadmapViewProps) {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const currentWeekData = roadmap.find((w) => w.weekNumber === activeWeek) || roadmap[0];

  const totalTasks = roadmap.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedTasks = roadmap.reduce(
    (acc, w) => acc + w.tasks.filter((t) => t.isCompleted).length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header & Overall Roadmap Progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Actionable Learning Roadmap (4 Minggu)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Persetujuan Mingguan
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Rancangan kurikulum mandiri untuk menutup kesenjangan kritis sebelum mengajukan lamaran kerja.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 block">
            Progres Tugas Terlaksana
          </span>
          <span className="text-sm font-bold text-slate-900">
            {completedTasks} dari {totalTasks} Selesai ({Math.round((completedTasks / totalTasks) * 100)}%)
          </span>
        </div>
      </div>

      {/* Week Selector Tabs (Touch Target >= 44px) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist">
        {roadmap.map((week) => {
          const isSelected = activeWeek === week.weekNumber;
          const isApproved = week.approvalStatus === "APPROVED";
          const weekDoneTasks = week.tasks.filter((t) => t.isCompleted).length;

          return (
            <button
              key={week.weekNumber}
              onClick={() => setActiveWeek(week.weekNumber)}
              className={`p-3.5 rounded-xl border text-left transition-all min-h-[44px] cursor-pointer ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              role="tab"
              aria-selected={isSelected}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  Minggu {week.weekNumber}
                </span>
                {isApproved ? (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    Disetujui
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    Draf
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {week.focusSkill}
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-semibold">
                {weekDoneTasks}/{week.tasks.length} Tugas
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Week Detail Panel */}
      {currentWeekData && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Week Goal Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Fokus Sasaran Minggu {currentWeekData.weekNumber}:
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {currentWeekData.focusSkill}
                </span>
              </div>
              <h4 className="text-sm md:text-base font-bold text-slate-900 font-heading">
                {currentWeekData.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1">{currentWeekData.objective}</p>
            </div>

            {/* Target Hours Adjustment */}
            <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-3 shrink-0">
              <Clock className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Beban Belajar:
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={currentWeekData.targetHours}
                    onChange={(e) =>
                      onUpdateHours(
                        currentWeekData.weekNumber,
                        parseInt(e.target.value) || currentWeekData.targetHours
                      )
                    }
                    className="w-12 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">Jam / Minggu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Project Tasks */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daftar Tugas Praktis Mingguan:
            </h5>

            <div className="space-y-2">
              {currentWeekData.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(currentWeekData.weekNumber, task.id)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer min-h-[44px] ${
                    task.isCompleted
                      ? "border-teal-300 bg-teal-50/50"
                      : "border-slate-200 bg-slate-50/40 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => onToggleTask(currentWeekData.weekNumber, task.id)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 mt-0.5 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold ${
                          task.isCompleted ? "line-through text-slate-500" : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium shrink-0">
                        ~{task.estimatedHours} Jam
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Free Resources */}
          {currentWeekData.resources.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Kurasi Referensi Terbuka:
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentWeekData.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    <span>{res.title}</span>
                    <ExternalLink className="w-3 h-3 text-indigo-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Explicit Approval Gate for Weekly Commitment */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-600 font-medium text-center sm:text-left">
              {currentWeekData.approvalStatus === "APPROVED"
                ? "✓ Komitmen minggu ini telah kamu setujui."
                : "Tinjau tugas dan jam di atas, lalu konfirmasi komitmen belajarmu:"}
            </span>

            {currentWeekData.approvalStatus !== "APPROVED" ? (
              <button
                onClick={() => onApproveWeek(currentWeekData.weekNumber)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Setujui Komitmen Minggu {currentWeekData.weekNumber}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Roadmap Aktif</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
