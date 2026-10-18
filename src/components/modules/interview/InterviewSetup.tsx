"use client";

import React from "react";
import { Mic, BrainCircuit, MessageSquareText, Lightbulb } from "lucide-react";
import { InterviewType } from "@/lib/interviewEngine";
import { useAppStore } from "@/lib/store/useAppStore";

interface InterviewSetupProps {
  onStart: (config: {
    targetRoleId: string;
    targetRoleTitle: string;
    interviewType: InterviewType;
  }) => void;
}

const roleOptions = [
  {
    id: "pm_jr",
    label: "Junior Product Manager",
    description: "Prioritas fitur, user research, roadmap",
    category: "💻 Teknologi & IT",
  },
  {
    id: "data_analyst_jr",
    label: "Junior Data Analyst",
    description: "Analitik data, visualisasi, SQL",
    category: "💻 Teknologi & IT",
  },
  {
    id: "frontend_jr",
    label: "Junior Frontend Developer",
    description: "React, TypeScript, performa web",
    category: "💻 Teknologi & IT",
  },
  {
    id: "management_trainee",
    label: "Management Trainee (Operations)",
    description: "Kepemimpinan, 5-Whys, analisis P&L",
    category: "📈 Bisnis & Manajemen",
  },
  {
    id: "hr_generalist",
    label: "Junior HR & People Specialist",
    description: "Talent sourcing, onboarding, kepersonaliaan",
    category: "📈 Bisnis & Manajemen",
  },
  {
    id: "digital_marketing",
    label: "Digital Marketing Specialist",
    description: "Paid ads, GA4, kalender konten & copywriting",
    category: "🎨 Pemasaran & Komunikasi",
  },
  {
    id: "financial_analyst_jr",
    label: "Junior Financial Analyst / Staf Keuangan",
    description: "Pemodelan keuangan Excel, rasio finansial, PSAK",
    category: "💰 Keuangan & Akuntansi",
  },
];

const interviewTypeOptions: {
  id: InterviewType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "behavioral",
    label: "Behavioral (STAR)",
    description:
      "Pertanyaan situasional berbasis pengalaman nyata. Paling umum di wawancara pertama.",
    icon: <MessageSquareText className="w-5 h-5" />,
  },
  {
    id: "technical",
    label: "Technical Deep-Dive",
    description:
      "Fokus pada kompetensi teknis spesifik peran, tools, dan keputusan arsitektur.",
    icon: <BrainCircuit className="w-5 h-5" />,
  },
  {
    id: "motivational",
    label: "Motivational Fit",
    description:
      "Menggali nilai, motivasi karier, dan keselarasan dengan kultur perusahaan.",
    icon: <Lightbulb className="w-5 h-5" />,
  },
];

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const { persona } = useAppStore();

  const defaultRoleId = persona.targetRoleId || "pm_jr";
  const defaultRoleTitle =
    persona.targetRoleTitle ||
    roleOptions.find((r) => r.id === defaultRoleId)?.label ||
    "Junior Professional";

  const [selectedRoleId, setSelectedRoleId] = React.useState(defaultRoleId);
  const [selectedInterviewType, setSelectedInterviewType] =
    React.useState<InterviewType>("behavioral");

  const selectedRoleLabel =
    roleOptions.find((r) => r.id === selectedRoleId)?.label || defaultRoleTitle;

  function handleStart() {
    onStart({
      targetRoleId: selectedRoleId,
      targetRoleTitle: selectedRoleLabel,
      interviewType: selectedInterviewType,
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mb-4">
          <Mic className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Simulasi Wawancara Kognitif
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Dialog adaptif berbasis metode STAR. Evaluasi AI{" "}
          <span className="font-semibold text-amber-700">dikunci</span> hingga
          refleksi mandirimu selesai diisi.
        </p>
      </div>

      {/* Pilih Role Target */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Target Peran Karier
        </label>
        <div className="space-y-2">
          {roleOptions.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`w-full text-left min-h-[52px] flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                selectedRoleId === role.id
                  ? "border-amber-400 bg-amber-50 text-slate-900"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selectedRoleId === role.id
                    ? "border-amber-500 bg-amber-500"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedRoleId === role.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{role.label}</p>
                  {role.category && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      {role.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pilih Tipe Wawancara */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Tipe Wawancara
        </label>
        <div className="space-y-2">
          {interviewTypeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedInterviewType(opt.id)}
              className={`w-full text-left min-h-[52px] flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                selectedInterviewType === opt.id
                  ? "border-amber-400 bg-amber-50 text-slate-900"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <span
                className={`flex-shrink-0 ${
                  selectedInterviewType === opt.id
                    ? "text-amber-600"
                    : "text-slate-400"
                }`}
              >
                {opt.icon}
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panduan Sesi */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-800 mb-2">
          Panduan Sesi (3 Putaran)
        </p>
        <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside leading-relaxed">
          <li>Jawab setiap pertanyaan selengkap mungkin — detail adalah pembeda.</li>
          <li>
            Pertanyaan akan menyesuaikan jawaban sebelumnya (adaptive probe).
          </li>
          <li>
            Setelah sesi selesai, isi{" "}
            <strong>Refleksi Mandiri</strong> terlebih dahulu.
          </li>
          <li>
            Skor STAR Evaluasi AI baru terbuka setelah refleksimu dikirim.
          </li>
        </ol>
      </div>

      {/* Tombol Mulai */}
      <button
        onClick={handleStart}
        className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
      >
        <Mic className="w-5 h-5" />
        Mulai Sesi Wawancara
      </button>
    </div>
  );
}
