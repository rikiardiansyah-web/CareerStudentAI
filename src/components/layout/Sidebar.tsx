"use client";

import React from "react";
import { LayoutDashboard, FileText, Target, Mic, Compass, UserCheck, Sparkles } from "lucide-react";
import { useAppStore, TabId } from "@/lib/store/useAppStore";

interface NavItem {
  id: TabId;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Hub Beranda", icon: LayoutDashboard },
  { id: "cv-analyzer", label: "CV Reflective Optimizer", badge: "HITL", icon: FileText },
  { id: "skill-gap", label: "Skill-Gap & Roadmap", icon: Target },
  { id: "mock-interview", label: "Cognitive Mock Interview", badge: "STAR", icon: Mic },
  { id: "career-discovery", label: "Career & Opportunity Match", icon: Compass },
];

export function Sidebar() {
  const { activeTab, setActiveTab, persona } = useAppStore();

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 shrink-0">
      {/* Persona Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            persona.isAuthenticated ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
          }`}>
            {persona.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{persona.name}</h4>
              {persona.isAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-teal-500" title="Akun Terverifikasi" />
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {persona.isAuthenticated
                ? (persona.email || "Akun Terverifikasi")
                : "Mode Tamu • Belum Masuk"}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <span className="text-[11px] font-medium text-slate-500">Target Karier:</span>
          <span className="font-semibold text-indigo-700 truncate max-w-[130px]">
            {persona.targetRoleTitle}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1" aria-label="Navigasi Desktop">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer min-h-[44px] ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Philosophy Callout (Gen-Think) */}
      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Prinsip Gen-Think</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            AI memandu penalaran reflektif. Keputusan akhir narasi dan aksi tetap di tanganmu.
          </p>
        </div>
      </div>
    </aside>
  );
}
