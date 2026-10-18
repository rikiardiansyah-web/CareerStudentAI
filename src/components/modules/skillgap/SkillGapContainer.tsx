"use client";

import React, { useState, useEffect } from "react";
import { Target, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { RoleSelector } from "./RoleSelector";
import { SkillMatrixView } from "./SkillMatrixView";
import { RoadmapView } from "./RoadmapView";
import { SkillGapEvaluationResult, RoadmapWeek } from "@/lib/skillGapEvaluator";

const ROADMAP_STORAGE_KEY = "careerstudent_roadmap_v1";

export function SkillGapContainer() {
  const { persona, setPersona } = useAppStore();
  const [evaluation, setEvaluation] = useState<SkillGapEvaluationResult | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"MATRIX" | "ROADMAP">("MATRIX");
  const [isLoading, setIsLoading] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Fetch evaluasi saat targetRoleId berubah
  useEffect(() => {
    let resumeText = "";
    if (typeof window !== "undefined") {
      try {
        const savedCv = localStorage.getItem("careerstudent_cv_draft_v1");
        if (savedCv) {
          const parsed = JSON.parse(savedCv);
          resumeText = parsed.rawText || "";
        }
      } catch (e) {
        console.warn("Gagal membaca CV lokal:", e);
      }
    }

    const runEvaluation = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/skillgap/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRoleId: persona.targetRoleId || "pm_jr",
            resumeText,
          }),
        });
        const json = await res.json();
        if (res.ok && json.data) {
          // Check if there is saved roadmap in local storage
          try {
            const savedRoadmap = localStorage.getItem(`${ROADMAP_STORAGE_KEY}_${persona.targetRoleId}`);
            if (savedRoadmap) {
              json.data.weeklyRoadmap = JSON.parse(savedRoadmap);
            }
          } catch (e) {
            console.warn("Gagal membaca roadmap lokal:", e);
          }

          setEvaluation(json.data);
        }
      } catch (err) {
        console.error("Gagal mengevaluasi skill gap:", err);
      } finally {
        setIsLoading(false);
      }
    };

    runEvaluation();
  }, [persona.targetRoleId]);

  const handleSelectRole = (roleId: string, roleTitle: string) => {
    setPersona({ targetRoleId: roleId, targetRoleTitle: roleTitle });
  };

  const saveRoadmapState = (updatedRoadmap: RoadmapWeek[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        `${ROADMAP_STORAGE_KEY}_${persona.targetRoleId}`,
        JSON.stringify(updatedRoadmap)
      );
      setSavedFeedback("Perubahan roadmap tersimpan");
      setTimeout(() => setSavedFeedback(null), 3000);
    } catch (e) {
      console.warn("Gagal menyimpan roadmap lokal:", e);
    }
  };

  const handleToggleTask = (weekNumber: number, taskId: string) => {
    if (!evaluation) return;
    const nextRoadmap = evaluation.weeklyRoadmap.map((week) => {
      if (week.weekNumber === weekNumber) {
        return {
          ...week,
          tasks: week.tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)),
        };
      }
      return week;
    });

    setEvaluation({ ...evaluation, weeklyRoadmap: nextRoadmap });
    saveRoadmapState(nextRoadmap);
  };

  const handleApproveWeek = (weekNumber: number) => {
    if (!evaluation) return;
    const nextRoadmap = evaluation.weeklyRoadmap.map((week) => {
      if (week.weekNumber === weekNumber) {
        return { ...week, approvalStatus: "APPROVED" as const };
      }
      return week;
    });

    setEvaluation({ ...evaluation, weeklyRoadmap: nextRoadmap });
    saveRoadmapState(nextRoadmap);
  };

  const handleUpdateHours = (weekNumber: number, hours: number) => {
    if (!evaluation) return;
    const nextRoadmap = evaluation.weeklyRoadmap.map((week) => {
      if (week.weekNumber === weekNumber) {
        return { ...week, targetHours: hours };
      }
      return week;
    });

    setEvaluation({ ...evaluation, weeklyRoadmap: nextRoadmap });
    saveRoadmapState(nextRoadmap);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              MOD-02 • Evidence-Based
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Industry Taxonomy vs Profile
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
            Skill-Gap Analysis & Actionable Roadmap
          </h2>
        </div>

        {savedFeedback && (
          <span className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium self-end sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            {savedFeedback}
          </span>
        )}
      </div>

      {/* Role Selection Bar */}
      <RoleSelector
        selectedRoleId={persona.targetRoleId || "pm_jr"}
        onSelectRole={handleSelectRole}
      />

      {/* Sub Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("MATRIX")}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-bold border-b-2 transition-colors cursor-pointer min-h-[44px] ${
            activeSubTab === "MATRIX"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Matriks Kesiapan Keterampilan</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ROADMAP")}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-bold border-b-2 transition-colors cursor-pointer min-h-[44px] ${
            activeSubTab === "ROADMAP"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Actionable Learning Roadmap</span>
        </button>
      </div>

      {/* Main Views */}
      {evaluation && (
        <>
          {activeSubTab === "MATRIX" ? (
            <SkillMatrixView
              matchPercentage={evaluation.matchPercentage}
              categorizedSkills={evaluation.categorizedSkills}
              onJumpToRoadmap={() => setActiveSubTab("ROADMAP")}
            />
          ) : (
            <RoadmapView
              roadmap={evaluation.weeklyRoadmap}
              onToggleTask={handleToggleTask}
              onApproveWeek={handleApproveWeek}
              onUpdateHours={handleUpdateHours}
            />
          )}
        </>
      )}
    </div>
  );
}
