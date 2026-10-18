"use client";

import React from "react";
import { LayoutDashboard, FileText, Target, Mic, Compass } from "lucide-react";
import { useAppStore, TabId } from "@/lib/store/useAppStore";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Beranda", icon: LayoutDashboard },
  { id: "cv-analyzer", label: "CV Optimizer", icon: FileText },
  { id: "skill-gap", label: "Skill Gap", icon: Target },
  { id: "mock-interview", label: "Interview", icon: Mic },
  { id: "career-discovery", label: "Peluang", icon: Compass },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom"
      aria-label="Navigasi Bawah Mobile"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors cursor-pointer ${
                isActive ? "text-indigo-600 font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? "bg-indigo-50 scale-105" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-500"}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
