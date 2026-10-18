"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  FileDown,
  BrainCircuit,
  Bot,
  CheckCircle2,
  Layers,
  UserCheck,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { ParsedSection } from "@/lib/resumeParser";
import { useAppStore } from "@/lib/store/useAppStore";
import { CV_TEMPLATE_PRESETS, CvTemplatePreset } from "@/data/cvTemplates";

interface FastCvBuilderProps {
  sections: ParsedSection[];
  onUpdateSections: (newSections: ParsedSection[]) => void;
  onOpenExport: () => void;
  onOpenSocraticPane: () => void;
  onOpenMentorChat: () => void;
}

export function FastCvBuilder({
  sections,
  onUpdateSections,
  onOpenExport,
  onOpenSocraticPane,
  onOpenMentorChat,
}: FastCvBuilderProps) {
  const { persona, setPersona } = useAppStore();
  const [activeTab, setActiveTab] = useState<"profile" | "experience" | "education" | "skills">("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Muat Preset Template Instan
  const handleLoadPreset = (preset: CvTemplatePreset) => {
    setPersona({
      name: preset.persona.name,
      targetRoleTitle: preset.persona.targetRoleTitle,
      email: preset.persona.email,
      phone: preset.persona.phone,
      address: preset.persona.address,
      summary: preset.persona.summary,
    });
    onUpdateSections(preset.sections);
    showToast(`Template "${preset.name}" berhasil diterapkan!`);
  };

  // Helper mendapatkan atau membuat section
  const getSection = (type: "SUMMARY" | "EXPERIENCE" | "PROJECT" | "EDUCATION" | "SKILL", defaultTitle: string): ParsedSection => {
    const found = sections.find((s) => s.type === type);
    if (found) return found;
    return { type, title: defaultTitle, bullets: [] };
  };

  // Update specific section
  const updateSectionBullets = (
    type: "SUMMARY" | "EXPERIENCE" | "PROJECT" | "EDUCATION" | "SKILL",
    defaultTitle: string,
    newBullets: ParsedSection["bullets"]
  ) => {
    const existingIdx = sections.findIndex((s) => s.type === type);
    if (existingIdx !== -1) {
      const next = [...sections];
      next[existingIdx] = { ...next[existingIdx], bullets: newBullets };
      onUpdateSections(next);
    } else {
      onUpdateSections([...sections, { type, title: defaultTitle, bullets: newBullets }]);
    }
  };

  const expSection = getSection("EXPERIENCE", "Pengalaman Profesional");
  const eduSection = getSection("EDUCATION", "Pendidikan");
  const skillSection = getSection("SKILL", "Keahlian & Sertifikasi");

  // Tambah Poin Bullet Pengalaman
  const handleAddExpBullet = () => {
    const newId = `b_exp_${Date.now()}`;
    const newBullets = [
      ...expSection.bullets,
      {
        id: newId,
        originalText: "Memimpin pelaksanaan program dengan peningkatan metrik sebesar 25%.",
        approvalStatus: "APPROVED" as const,
      },
    ];
    updateSectionBullets("EXPERIENCE", "Pengalaman Profesional", newBullets);
  };

  // Tambah Header Posisi / Perusahaan Baru
  const handleAddExpHeader = () => {
    const newId = `b_exp_head_${Date.now()}`;
    const newBullets = [
      ...expSection.bullets,
      {
        id: newId,
        originalText: "Posisi Baru, Nama Perusahaan | 2023 – Sekarang",
        approvalStatus: "APPROVED" as const,
      },
      {
        id: `b_exp_sub_${Date.now()}`,
        originalText: "Mendukung pencapaian target divisi melalui eksekusi inisiatif strategis.",
        approvalStatus: "APPROVED" as const,
      },
    ];
    updateSectionBullets("EXPERIENCE", "Pengalaman Profesional", newBullets);
    showToast("Posisi pengalaman baru ditambahkan");
  };

  // Edit Text Bullet
  const handleEditBulletText = (
    type: "SUMMARY" | "EXPERIENCE" | "PROJECT" | "EDUCATION" | "SKILL",
    title: string,
    bulletId: string,
    newText: string
  ) => {
    const sec = getSection(type, title);
    const updated = sec.bullets.map((b) => (b.id === bulletId ? { ...b, originalText: newText, finalText: newText } : b));
    updateSectionBullets(type, title, updated);
  };

  // Hapus Bullet
  const handleDeleteBullet = (
    type: "SUMMARY" | "EXPERIENCE" | "PROJECT" | "EDUCATION" | "SKILL",
    title: string,
    bulletId: string
  ) => {
    const sec = getSection(type, title);
    const updated = sec.bullets.filter((b) => b.id !== bulletId);
    updateSectionBullets(type, title, updated);
  };

  // Generate Summary Otomatis dengan AI
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const targetRole = persona.targetRoleTitle || "Profesional Muda";
      const sampleBullets = expSection.bullets.map((b) => b.originalText).slice(0, 3).join(". ");
      const res = await fetch("/api/resume/mentor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Buatkan 1 paragraf Ringkasan Profil (Executive Summary) yang persuasif, percaya diri, dan berstandar ATS untuk kandidat dengan target posisi: "${targetRole}". Konteks pengalaman: ${sampleBullets || "Mahasiswa aktif berprestasi dan siap berkarier profesional"}. Buat dalam 3-4 kalimat padat tanpa pembuka basa-basi.`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setPersona({ summary: data.reply.trim() });
        // Simpan juga ke SUMMARY section
        updateSectionBullets("SUMMARY", "Summary", [
          { id: `b_sum_${Date.now()}`, originalText: data.reply.trim(), approvalStatus: "APPROVED" },
        ]);
        showToast("Ringkasan profesional berhasil dibuat!");
      }
    } catch (e) {
      console.warn("Gagal generate summary:", e);
      const fallback = `Profesional yang berdedikasi tinggi pada bidang ${persona.targetRoleTitle || "Pengembangan Karier"} dengan kemampuan komunikasi kolaboratif dan orientasi hasil terukur. Memiliki komitmen kuat dalam mendorong pertumbuhan tim dan pencapaian target organisasi.`;
      setPersona({ summary: fallback });
      updateSectionBullets("SUMMARY", "Summary", [
        { id: `b_sum_${Date.now()}`, originalText: fallback, approvalStatus: "APPROVED" },
      ]);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Preset Banner: 1-Klik Terapkan Layout Gambar */}
      <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50/60 border border-indigo-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded shadow-xs">
                Template Siap Pakai • Standar Industri
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">Berdasarkan format CV teruji</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Gunakan Template Contoh (1-Klik Isi Otomatis)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih salah satu template di samping untuk langsung mengisi format CV yang rapi, proporsional, dan siap diunduh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CV_TEMPLATE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
                title={preset.description}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Navigation Header: Unduh PDF vs Socratic Consultation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-heading">
              {persona.name || "Nama Mahasiswa"}
            </h4>
            <p className="text-xs text-slate-500">
              {persona.targetRoleTitle || "Target Karier"} {persona.email ? `• ${persona.email}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenMentorChat}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Tanya Mentor AI</span>
          </button>

          <button
            onClick={onOpenSocraticPane}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer flex-1 sm:flex-initial"
            title="Uji kualitas diksi poin CV dengan AI Sokratik & STAR Method"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span>Mode Uji ATS AI</span>
          </button>

          <button
            onClick={onOpenExport}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh Berkas PDF</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-3 pt-3 gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "profile"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>1. Data Diri & Ringkasan</span>
        </button>

        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "experience"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>2. Pengalaman ({expSection.bullets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "education"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>3. Pendidikan ({eduSection.bullets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Keterampilan & Sertifikasi</span>
        </button>
      </div>

      {/* Tab 1: Profile & Summary */}
      {activeTab === "profile" && (
        <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={persona.name}
                onChange={(e) => setPersona({ name: e.target.value })}
                placeholder="Contoh: Alfredo Torres"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Target Jabatan / Peran
              </label>
              <input
                type="text"
                value={persona.targetRoleTitle}
                onChange={(e) => setPersona({ targetRoleTitle: e.target.value })}
                placeholder="Contoh: Marketing Manager / Junior Product Manager"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Email
              </label>
              <input
                type="email"
                value={persona.email || ""}
                onChange={(e) => setPersona({ email: e.target.value })}
                placeholder="hello@reallygreatsite.com"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={persona.phone || ""}
                onChange={(e) => setPersona({ phone: e.target.value })}
                placeholder="123-456-7890 / 0812-3456-7890"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Alamat / Domisili
              </label>
              <input
                type="text"
                value={persona.address || ""}
                onChange={(e) => setPersona({ address: e.target.value })}
                placeholder="123 Anywhere St., Any City / Jakarta Selatan, Indonesia"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Section Ringkasan Profil (Summary) */}
          <div className="border-t border-slate-200 pt-5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 font-heading block">
                  Ringkasan Profil (Executive Summary)
                </label>
                <p className="text-[11px] text-slate-500">
                  Paragraf singkat (3-4 kalimat) yang merangkum keahlian dan nilai unikmu bagi perusahaan.
                </p>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isGeneratingSummary ? "Merumuskan AI..." : "✨ Buatkan Ringkasan AI"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={persona.summary || ""}
              onChange={(e) => {
                setPersona({ summary: e.target.value });
                updateSectionBullets("SUMMARY", "Summary", [
                  { id: `b_sum_${Date.now()}`, originalText: e.target.value, approvalStatus: "APPROVED" },
                ]);
              }}
              placeholder="Contoh: Results-driven Marketing Manager with extensive experience in developing and executing strategic marketing initiatives..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Work Experience */}
      {activeTab === "experience" && (
        <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Riwayat Pengalaman Kerja, Magang & Organisasi
              </h4>
              <p className="text-xs text-slate-500">
                Gunakan format: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono text-[11px]">Posisi, Perusahaan | Tanggal</code> untuk judul pekerjaan, lalu masukkan butir pencapaian di bawahnya.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddExpHeader}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Posisi Baru</span>
              </button>
              <button
                onClick={handleAddExpBullet}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Butir Poin</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {expSection.bullets.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-xs text-slate-500 mb-2">Belum ada pengalaman tercatat.</p>
                <button
                  onClick={handleAddExpHeader}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                >
                  Tambah Pengalaman Pertama
                </button>
              </div>
            ) : (
              expSection.bullets.map((bullet, idx) => {
                const isHeader = bullet.originalText.includes("|") || bullet.id.includes("head");
                return (
                  <div
                    key={bullet.id}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border transition-all ${
                      isHeader
                        ? "bg-indigo-50/50 border-indigo-200 shadow-xs"
                        : "bg-slate-50/70 border-slate-200"
                    }`}
                  >
                    <span className="text-[11px] font-bold text-slate-400 mt-2 shrink-0 w-6 text-center">
                      {isHeader ? "📌" : `•`}
                    </span>

                    <div className="flex-1">
                      {isHeader && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-0.5">
                          Judul Posisi, Perusahaan & Periode Tanggal
                        </span>
                      )}
                      <textarea
                        rows={isHeader ? 1 : 2}
                        value={bullet.finalText || bullet.originalText}
                        onChange={(e) =>
                          handleEditBulletText("EXPERIENCE", "Pengalaman Profesional", bullet.id, e.target.value)
                        }
                        className={`w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-600 text-slate-900 ${
                          isHeader ? "font-bold text-indigo-950" : "font-normal"
                        }`}
                      />
                    </div>

                    <button
                      onClick={() => handleDeleteBullet("EXPERIENCE", "Pengalaman Profesional", bullet.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Education */}
      {activeTab === "education" && (
        <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Riwayat Pendidikan & Akademik
              </h4>
              <p className="text-xs text-slate-500">
                Nama perguruan tinggi, jenjang studi, jurusan, dan tahun kelulusan.
              </p>
            </div>

            <button
              onClick={() => {
                const newId = `b_edu_${Date.now()}`;
                const newBullets = [
                  ...eduSection.bullets,
                  {
                    id: newId,
                    originalText: "Sarjana Sistem Informasi | 2021 – 2025",
                    approvalStatus: "APPROVED" as const,
                  },
                ];
                updateSectionBullets("EDUCATION", "Pendidikan", newBullets);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Pendidikan</span>
            </button>
          </div>

          <div className="space-y-3">
            {eduSection.bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200"
              >
                <input
                  type="text"
                  value={bullet.finalText || bullet.originalText}
                  onChange={(e) =>
                    handleEditBulletText("EDUCATION", "Pendidikan", bullet.id, e.target.value)
                  }
                  className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-600 text-slate-900 font-medium"
                />
                <button
                  onClick={() => handleDeleteBullet("EDUCATION", "Pendidikan", bullet.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Skills & Certifications */}
      {activeTab === "skills" && (
        <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Keahlian, Bahasa & Sertifikasi
              </h4>
              <p className="text-xs text-slate-500">
                Sebutkan keterampilan teknis, tools, sertifikasi resmi, dan prestasi pendukung.
              </p>
            </div>

            <button
              onClick={() => {
                const newId = `b_skl_${Date.now()}`;
                const newBullets = [
                  ...skillSection.bullets,
                  {
                    id: newId,
                    originalText: "Keahlian: Tools, Software, Metodologi",
                    approvalStatus: "APPROVED" as const,
                  },
                ];
                updateSectionBullets("SKILL", "Keahlian & Sertifikasi", newBullets);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Baris Keahlian</span>
            </button>
          </div>

          <div className="space-y-3">
            {skillSection.bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200"
              >
                <textarea
                  rows={2}
                  value={bullet.finalText || bullet.originalText}
                  onChange={(e) =>
                    handleEditBulletText("SKILL", "Keahlian & Sertifikasi", bullet.id, e.target.value)
                  }
                  className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-600 text-slate-900 leading-relaxed"
                />
                <button
                  onClick={() => handleDeleteBullet("SKILL", "Keahlian & Sertifikasi", bullet.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
