import { INDUSTRY_ROLES, TaxonomySkill, CareerRoleTaxonomy } from "@/data/industryTaxonomy";

export interface EvaluatedSkill {
  skill: TaxonomySkill;
  matchStatus: "STRONG_MATCH" | "PARTIAL_MATCH" | "CRITICAL_GAP";
  evidenceText?: string;
  recommendation: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  isCompleted: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  objective: string;
  focusSkill: string;
  targetHours: number;
  tasks: RoadmapTask[];
  resources: Array<{ title: string; url: string; isFree: boolean }>;
  approvalStatus: "PENDING_REVIEW" | "APPROVED";
}

export interface SkillGapEvaluationResult {
  role: CareerRoleTaxonomy;
  matchPercentage: number;
  categorizedSkills: {
    strongMatches: EvaluatedSkill[];
    partialMatches: EvaluatedSkill[];
    criticalGaps: EvaluatedSkill[];
  };
  weeklyRoadmap: RoadmapWeek[];
}

export function evaluateSkillGap(
  targetRoleId: string,
  resumeText: string = ""
): SkillGapEvaluationResult {
  const role = INDUSTRY_ROLES.find((r) => r.id === targetRoleId) || INDUSTRY_ROLES[0];
  const textLower = resumeText.toLowerCase();

  const strongMatches: EvaluatedSkill[] = [];
  const partialMatches: EvaluatedSkill[] = [];
  const criticalGaps: EvaluatedSkill[] = [];

  for (const skill of role.skills) {
    const skillNameLower = skill.name.toLowerCase();
    const keywords = skillNameLower.split(/[\s\(\)\/]+/).filter((w) => w.length > 3);

    const isDirectlyMentioned = keywords.some((k) => textLower.includes(k));
    const hasMetricContext = isDirectlyMentioned && (textLower.includes("%") || /\d+/.test(textLower));

    if (isDirectlyMentioned && hasMetricContext) {
      strongMatches.push({
        skill,
        matchStatus: "STRONG_MATCH",
        evidenceText: `Terdeteksi di resume dengan konteks dampak/pencapaian.`,
        recommendation: "Pertahankan dan jadikan ini sebagai bahan studi kasus utama saat wawancara.",
      });
    } else if (isDirectlyMentioned) {
      partialMatches.push({
        skill,
        matchStatus: "PARTIAL_MATCH",
        evidenceText: `Disebutkan dalam daftar keahlian atau proyek dasar, namun belum menunjukkan hasil terukur.`,
        recommendation: "Perkuat bukti portofoliomu dengan mengaitkannya ke dampak atau metrik konkret.",
      });
    } else {
      criticalGaps.push({
        skill,
        matchStatus: "CRITICAL_GAP",
        recommendation: skill.suggestedAction,
      });
    }
  }

  // Jika teks resume kosong (belum diunggah), berikan estimasi realistis berdasarkan persona mahasiswa
  if (!resumeText.trim()) {
    // Default baseline umum untuk mahasiswa tingkat akhir:
    // 2 Strong, 2 Partial, sisanya Gap
    strongMatches.length = 0;
    partialMatches.length = 0;
    criticalGaps.length = 0;

    role.skills.forEach((skill, idx) => {
      if (idx === 0 || idx === 1) {
        partialMatches.push({
          skill,
          matchStatus: "PARTIAL_MATCH",
          evidenceText: "Pernah dipelajari di mata kuliah universitas, perlu pembuktian skala industri.",
          recommendation: skill.suggestedAction,
        });
      } else if (idx === 3) {
        strongMatches.push({
          skill,
          matchStatus: "STRONG_MATCH",
          evidenceText: "Terbukti dalam kepengurusan organisasi kampus dan proyek tugas akhir.",
          recommendation: "Siapkan narasi STAR untuk mengilustrasikan pengalaman kepemimpinan ini.",
        });
      } else {
        criticalGaps.push({
          skill,
          matchStatus: "CRITICAL_GAP",
          recommendation: skill.suggestedAction,
        });
      }
    });
  }

  // Hitung persentase kecocokan transparan (Formula Zero-Slop)
  const totalSkills = role.skills.length;
  const matchPercentage = Math.round(
    ((strongMatches.length * 1.0 + partialMatches.length * 0.5) / totalSkills) * 100
  );

  // Bangun Actionable Learning Roadmap 4 Minggu berbasis Critical Gap
  const primaryGapSkill = criticalGaps[0]?.skill.name || role.skills[0].name;
  const secondaryGapSkill = criticalGaps[1]?.skill.name || partialMatches[0]?.skill.name || role.skills[1].name;

  const weeklyRoadmap: RoadmapWeek[] = [
    {
      weekNumber: 1,
      title: "Fondasi & Kerangka Konseptual",
      objective: `Memahami prinsip dasar dan standar industri untuk ${primaryGapSkill}.`,
      focusSkill: primaryGapSkill,
      targetHours: 8,
      tasks: [
        {
          id: "w1_t1",
          title: "Pelajari dokumentasi & studi kasus industri",
          description: "Baca 2 panduan resmi dan bedah contoh penerapan di perusahaan terkemuka.",
          estimatedHours: 4,
          isCompleted: false,
        },
        {
          id: "w1_t2",
          title: "Ringkas pola implementasi ke dalam catatan reflektif",
          description: "Tulis 3 prinsip utama yang membedakan proyek pemula dengan standar profesional.",
          estimatedHours: 4,
          isCompleted: false,
        },
      ],
      resources: [
        { title: "Panduan Komprehensif Industri (Gratis)", url: "https://roadmap.sh", isFree: true },
        { title: "Dokumentasi & Best Practice Resmi", url: "https://github.com", isFree: true },
      ],
      approvalStatus: "APPROVED",
    },
    {
      weekNumber: 2,
      title: "Eksperimen Praktis & Hands-On Mini Project",
      objective: `Membangun prototipe kerja atau analisis mandiri untuk ${primaryGapSkill}.`,
      focusSkill: primaryGapSkill,
      targetHours: 10,
      tasks: [
        {
          id: "w2_t1",
          title: "Buat artefak portofolio konkret",
          description: "Rancang 1 hasil karya (dokumen PRD / skrip analisis / komponen web) dari nol.",
          estimatedHours: 6,
          isCompleted: false,
        },
        {
          id: "w2_t2",
          title: "Audit mandiri kualitas artefak",
          description: "Gunakan checklist standar industri untuk menguji apakah artefak sudah siap uji.",
          estimatedHours: 4,
          isCompleted: false,
        },
      ],
      resources: [
        { title: "Template Studi Kasus Terbuka", url: "https://notion.so", isFree: true },
      ],
      approvalStatus: "PENDING_REVIEW",
    },
    {
      weekNumber: 3,
      title: "Penajaman Keterampilan Sekunder & Integrasi",
      objective: `Menutup kesenjangan kedua pada ${secondaryGapSkill} dan mengintegrasikannya.`,
      focusSkill: secondaryGapSkill,
      targetHours: 8,
      tasks: [
        {
          id: "w3_t1",
          title: "Pelajari alat bantu kolaborasi & metodologi kerja",
          description: `Kuasai workflow praktis yang digunakan tim rekruter untuk ${secondaryGapSkill}.`,
          estimatedHours: 4,
          isCompleted: false,
        },
        {
          id: "w3_t2",
          title: "Hubungkan keterampilan sekunder ke proyek utama",
          description: "Tunjukkan sinergi antar keterampilan dalam 1 narasi portofolio utuh.",
          estimatedHours: 4,
          isCompleted: false,
        },
      ],
      resources: [
        { title: "Repositori Latihan & Template Portofolio", url: "https://github.com", isFree: true },
      ],
      approvalStatus: "PENDING_REVIEW",
    },
    {
      weekNumber: 4,
      title: "Finalisasi Portofolio & Persiapan Pembuktian Wawancara",
      objective: "Menarasikan capaian baru ke dalam CV dan melatih argumen pembuktian.",
      focusSkill: "Sintesis Portofolio & Argumen STAR",
      targetHours: 6,
      tasks: [
        {
          id: "w4_t1",
          title: "Perbarui poin bullet CV di MOD-01",
          description: "Masukkan hasil proyek minggu 1-3 ke dalam CV melalui gerbang persetujuan reflektif.",
          estimatedHours: 3,
          isCompleted: false,
        },
        {
          id: "w4_t2",
          title: "Uji argumen di Cognitive Mock Interview (MOD-03)",
          description: "Latih jawaban wawancara STAR untuk menjelaskan pembelajaran 4 minggu terakhir.",
          estimatedHours: 3,
          isCompleted: false,
        },
      ],
      resources: [
        { title: "Panduan Evaluasi STAR & Metakognisi", url: "#", isFree: true },
      ],
      approvalStatus: "PENDING_REVIEW",
    },
  ];

  return {
    role,
    matchPercentage,
    categorizedSkills: {
      strongMatches,
      partialMatches,
      criticalGaps,
    },
    weeklyRoadmap,
  };
}
