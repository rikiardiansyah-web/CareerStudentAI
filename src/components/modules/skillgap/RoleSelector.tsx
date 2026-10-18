"use client";

import React from "react";
import { Briefcase, ChevronDown, Sparkles } from "lucide-react";
import { INDUSTRY_ROLES } from "@/data/industryTaxonomy";

interface RoleSelectorProps {
  selectedRoleId: string;
  onSelectRole: (roleId: string, roleTitle: string) => void;
}

const CATEGORY_LABELS = {
  IT_TECH: "💻 Teknologi & IT",
  BUSINESS_MANAGEMENT: "📈 Bisnis, Manajemen & SDM",
  MARKETING_CREATIVE: "🎨 Pemasaran & Media Kreatif",
  FINANCE_ACCOUNTING: "💰 Keuangan & Akuntansi",
};

export function RoleSelector({ selectedRoleId, onSelectRole }: RoleSelectorProps) {
  const selectedRole =
    INDUSTRY_ROLES.find((r) => r.id === selectedRoleId) || INDUSTRY_ROLES[0];

  // Kelompokkan peran berdasarkan kategori jurusan
  const categories = Array.from(new Set(INDUSTRY_ROLES.map((r) => r.category)));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Peran Impian Target (Lintas Jurusan)
            </span>
            <div className="relative mt-0.5">
              <select
                value={selectedRoleId}
                onChange={(e) => {
                  const role = INDUSTRY_ROLES.find((r) => r.id === e.target.value);
                  if (role) onSelectRole(role.id, role.title);
                }}
                className="appearance-none bg-slate-50 border border-slate-300 hover:border-teal-500 font-bold text-slate-900 text-sm md:text-base py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer min-h-[44px]"
                aria-label="Pilih peran impian target"
              >
                {categories.map((cat) => (
                  <optgroup key={cat} label={CATEGORY_LABELS[cat] || cat}>
                    {INDUSTRY_ROLES.filter((r) => r.category === cat).map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right max-w-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Industri: {selectedRole.industry}
          </span>
          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
            {selectedRole.description}
          </p>
        </div>
      </div>
    </div>
  );
}
