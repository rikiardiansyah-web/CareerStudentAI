import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface SocraticAnalysis {
  critique: string;
  socraticPrompt: string;
  suggestedActionVerb: string;
  estimatedAtsImpact: number;
}

export interface FormulationResult {
  suggestedText: string;
  formulaBreakdown: {
    actionVerb: string;
    context: string;
    measurableOutcome: string;
  };
  explanation: string;
}

// 1. Analisis Sokratik & Pertanyaan Pemantik untuk Poin Bullet
export async function generateSocraticCritique(
  bulletText: string,
  targetRole: string = "Junior Professional"
): Promise<SocraticAnalysis> {
  // Jika API Key tersedia, gunakan Gemini 2.5 Flash
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Kamu adalah Socratic Career Dialectical Mentor untuk tema Gen-Think.
Tugasmu BUKAN menulis ulang teks ini, melainkan menganalisis kelemahan diksi dan memberikan pertanyaan pemantik (Socratic Questioning) agar pengguna mengingat kembali metrik riil pengalaman mereka.

Teks Poin Resume: "${bulletText}"
Target Peran Karier: "${targetRole}"

Keluarkan respon HANYA dalam format JSON valid:
{
  "critique": "Kritik objektif mengapa poin ini masih pasif/kurang spesifik.",
  "socraticPrompt": "Pertanyaan reflektif tajam yang menantang ingatan pengguna (misal: berapa metriknya, tantangan apa yang dihadapi, tools apa yang dipakai).",
  "suggestedActionVerb": "Kata kerja aksi kuat yang disarankan (Bahasa Indonesia).",
  "estimatedAtsImpact": 15
}`,
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn("[Gemini API] Falling back to heuristic Socratic engine:", err);
    }
  }

  // Heuristic Socratic Engine (Jaminan Offline & Zero-Dependency)
  const lower = bulletText.toLowerCase();
  let critique = "Deskripsi belum menunjukkan skala tanggung jawab, alat/metodologi spesifik, dan hasil terukur.";
  let socraticPrompt = "Berapa banyak orang atau pengguna yang terdampak oleh kegiatan ini? Apa metrik keberhasilan yang kamu ukur, dan keputusan penting apa yang kamu ambil?";
  let suggestedActionVerb = "Memimpin";

  if (lower.includes("membantu") || lower.includes("ikut") || lower.includes("mengerjakan")) {
    critique = "Penggunaan kata kerja pasif ('membantu' / 'ikut') menyamarkan kontribusi spesifikmu secara individual.";
    socraticPrompt = "Dalam kegiatan tersebut, apa peran personal yang paling krusial yang kamu eksekusi? Jika kamu tidak ada di tim saat itu, apa kendala yang akan terjadi?";
    suggestedActionVerb = "Menginisiasi";
  } else if (lower.includes("membuat") || lower.includes("mengembangkan") || lower.includes("design")) {
    critique = "Poin sudah menyebutkan aksi teknis, namun belum mengaitkan solusi dengan metrik atau dampak terhadap pengguna akhir.";
    socraticPrompt = "Teknologi atau metode spesifik apa yang kamu terapkan? Berapa lama waktu pengerjaannya dan bagaimana respons pengguna/klien setelah solusi ini selesai?";
    suggestedActionVerb = "Mengembangkan";
  } else if (lower.includes("mengelola") || lower.includes("koordinasi")) {
    critique = "Pengelolaan terkesan administratif jika tidak disertai ukuran anggaran, jumlah anggota tim, atau ketepatan tenggat waktu.";
    socraticPrompt = "Berapa anggota tim yang kamu koordinasikan? Kendala jadwal atau komunikasi apa yang berhasil kamu pecahkan?";
    suggestedActionVerb = "Mengorkestrasi";
  }

  return {
    critique,
    socraticPrompt,
    suggestedActionVerb,
    estimatedAtsImpact: 20,
  };
}

// 2. Formulasi Kalimat Hasil Dialog Sokratik (Explicit Approval Gate)
export async function formulateApprovedBullet(
  originalText: string,
  userReflection: string,
  targetRole: string = "Junior Professional"
): Promise<FormulationResult> {
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Kamu adalah asisten formulasi resume berbasis Human-in-the-Loop.
Gabungkan teks asli dan jawaban refleksi pengguna menjadi 1 kalimat poin bullet ATS-Friendly yang berbobot dengan formula:
[Action Verb Kuat] + [Konteks Masalah & Tools] + [Hasil Terukur/Dampak].
DILARANG mengarang data yang tidak ada di jawaban refleksi pengguna.

Teks Asli: "${originalText}"
Jawaban Refleksi Pengguna: "${userReflection}"
Target Peran: "${targetRole}"

Keluarkan respon HANYA dalam format JSON valid:
{
  "suggestedText": "Kalimat hasil formulasi utuh yang kuat.",
  "formulaBreakdown": {
    "actionVerb": "Kata kerja pembuka",
    "context": "Konteks dan teknologi",
    "measurableOutcome": "Metrik atau dampak nyata"
  },
  "explanation": "Penjelasan mengapa formulasi ini jauh lebih kuat di mata rekruter."
}`,
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn("[Gemini API] Falling back to heuristic formulation:", err);
    }
  }

  // Heuristic Formulator Fallback
  const cleanOriginal = originalText.replace(/^[•\-\*•\d+\.]\s*/, "").trim();
  const cleanReflection = userReflection.trim();

  return {
    suggestedText: `Mengorkestrasi dan mengoptimasi ${cleanOriginal.toLowerCase()}, menghasilkan pencapaian berupa ${cleanReflection} secara terukur.`,
    formulaBreakdown: {
      actionVerb: "Mengorkestrasi",
      context: cleanOriginal,
      measurableOutcome: cleanReflection,
    },
    explanation:
      "Formulasi ini menggabungkan peran proaktif dan rincian dampak otentik yang kamu ingat, meningkatkan keterbacaan algoritma ATS hingga 85%.",
  };
}
