"use client";

import React from "react";
import {
  Compass,
  Loader2,
  ArrowLeft,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import { RoleMatchCard } from "./RoleMatchCard";
import { MatchResult } from "@/lib/careerMatcher";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  SkeletonBlock,
  CardSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/StatusStates";

const STORAGE_KEY_SKILLS = "careerstudent_cv_draft_v1";

type FilterMode =
  | "all"
  | "pm_jr"
  | "data_analyst_jr"
  | "frontend_jr"
  | "management_trainee"
  | "hr_generalist"
  | "digital_marketing"
  | "financial_analyst_jr";

const filterLabels: Record<FilterMode, string> = {
  all: "Semua Jurusan & Peran",
  pm_jr: "Product Management",
  data_analyst_jr: "Data Analysis",
  frontend_jr: "Frontend Development",
  management_trainee: "Management Trainee",
  hr_generalist: "HR & People",
  digital_marketing: "Digital Marketing",
  financial_analyst_jr: "Keuangan & Finansial",
};

export function CareerDiscoveryContainer() {
  const { setActiveTab, persona } = useAppStore();

  const [results, setResults] = React.useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [filter, setFilter] = React.useState<FilterMode>("all");
  const [customSkills, setCustomSkills] = React.useState("");

  // Extrak skill dari CV draft tersimpan (jika ada)
  const extractSkillsFromStorage = React.useCallback((): string[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SKILLS);
      if (saved) {
        const data = JSON.parse(saved);
        // Coba ambil dari parsed resume sections
        if (data.sections) {
          const skillSection = data.sections.find(
            (s: { type: string }) =>
              s.type === "SKILL" || s.type === "SKILLS"
          );
          if (skillSection?.bullets) {
            return skillSection.bullets.map(
              (b: { text: string }) => b.text
            );
          }
        }
      }
    } catch {
      // silently ignore
    }
    return [];
  }, []);

  // Skill baseline umum untuk mahasiswa tingkat akhir
  const defaultSkills = [
    "Project Coordination",
    "User Research",
    "Google Docs",
    "Canva",
    "Public Speaking",
    "Microsoft Excel",
    "Data Entry",
    "Event Planning",
    "Social Media Management",
    "Teamwork",
    "Communication",
    "Leadership",
  ];

  async function fetchOpportunities(skillList?: string[]) {
    setIsLoading(true);
    setError(null);

    try {
      const userSkills =
        skillList ||
        (customSkills
          ? customSkills.split(",").map((s) => s.trim()).filter(Boolean)
          : null) ||
        extractSkillsFromStorage() ||
        defaultSkills;

      const targetRoleId = filter === "all" ? undefined : filter;

      const res = await fetch("/api/career/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSkills, targetRoleId }),
      });

      if (!res.ok) throw new Error("Gagal mengambil data peluang karier.");

      const data = await res.json();
      setResults(data.results);
      setHasLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Auto-fetch on mount
  React.useEffect(() => {
    fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when filter changes
  React.useEffect(() => {
    if (hasLoaded) {
      fetchOpportunities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Bridge ke MOD-02 Skill-Gap
  function handleBridgeToSkillGap(roleId: string, _roleTitle: string) {
    // Simpan role target ke Zustand
    useAppStore.getState().setPersona({
      ...persona,
      targetRoleId: roleId,
    });
    setActiveTab("skill-gap");
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            MOD-04: Career Discovery
          </h2>
          <p className="text-xs text-slate-500">
            Peluang karier dengan Explainable AI Matching
          </p>
        </div>
        <button
          onClick={() => setActiveTab("dashboard")}
          className="text-xs text-indigo-600 hover:underline font-semibold min-h-[44px] px-2 flex items-center cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Beranda
        </button>
      </div>

      {/* Skill Input + Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        {/* Custom Skill Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Skill Kamu (pisahkan dengan koma)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              placeholder="React, TypeScript, SQL, Figma, Project Management..."
              className="flex-1 min-h-[44px] px-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400"
            />
            <button
              onClick={() => fetchOpportunities()}
              disabled={isLoading}
              className="min-h-[44px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Cocokkan
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Kosongkan untuk menggunakan skill dari CV yang sudah diunggah atau
            profil default
          </p>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(filterLabels) as FilterMode[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                filter === key
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {filterLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex gap-2.5 items-start">
        <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-700 leading-relaxed">
          Skor kecocokan dihitung dengan formula transparan: (skill cocok ×
          1.0 + skill parsial × 0.5) ÷ total skill wajib × 100.{" "}
          <strong>Bukan prediksi AI black-box.</strong> Lihat detail formula
          di setiap kartu.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && !hasLoaded && (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && (
        <ErrorState
          title="Gagal Memuat Peluang"
          message={error}
          onRetry={() => fetchOpportunities()}
        />
      )}

      {/* Empty State */}
      {hasLoaded && !isLoading && results.length === 0 && (
        <EmptyState
          title="Belum Ada Kecocokan"
          description="Coba masukkan skill yang lebih spesifik atau ubah filter kategori peran."
        />
      )}

      {/* Results */}
      {hasLoaded && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Ditemukan {results.length} peluang karier • Diurutkan dari
            kecocokan tertinggi
          </p>
          {results.map((result) => (
            <RoleMatchCard
              key={result.opportunity.id}
              result={result}
              onBridgeToSkillGap={handleBridgeToSkillGap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
