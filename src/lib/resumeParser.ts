import { extractText } from "unpdf";

export interface ParsedSection {
  type: "SUMMARY" | "EXPERIENCE" | "PROJECT" | "EDUCATION" | "SKILL";
  title: string;
  bullets: Array<{
    id: string;
    originalText: string;
    critique?: string;
    socraticPrompt?: string;
    userReflectionText?: string;
    suggestedFormula?: string;
    finalText?: string;
    approvalStatus: "PENDING_REVIEW" | "APPROVED" | "MANUALLY_EDITED" | "REJECTED";
  }>;
}

export interface ParsedResumeResult {
  rawText: string;
  sanitizedText: string;
  sections: ParsedSection[];
  detectedWordCount: number;
}

// Sanitasi Data Pribadi Sensitif (Prinsip Privacy & Zero-Training)
export function sanitizePersonalData(rawText: string): string {
  let sanitized = rawText;
  // Masking nomor telepon Indonesia (misal: 0812..., +62...)
  sanitized = sanitized.replace(/(\+62|62|0)8[1-9][0-9]{6,10}/g, "[NOMOR TELEPON DIRAHASIAKAN]");
  // Masking email personal spesifik
  sanitized = sanitized.replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, "[EMAIL DIRAHASIAKAN]");
  // Masking nomor identitas NIK (16 digit)
  sanitized = sanitized.replace(/\b\d{16}\b/g, "[NIK DIRAHASIAKAN]");
  return sanitized;
}

// Ekstraksi Teks dari File PDF secara In-Memory
export async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  try {
    const { text } = await extractText(new Uint8Array(buffer));
    return Array.isArray(text) ? text.join("\n") : (text || "");
  } catch (error) {
    console.error("[PDF Parser] Failed to parse PDF buffer:", error);
    throw new Error("Gagal mengekstrak teks dari berkas PDF. Pastikan file tidak terkunci atau rusak.");
  }
}

// Segmentasi Dokumen Resume Menjadi Bagian dan Poin Bullet
export function segmentResumeText(rawText: string): ParsedSection[] {
  const sanitized = sanitizePersonalData(rawText);
  const lines = sanitized.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const sections: ParsedSection[] = [
    { type: "EXPERIENCE", title: "Pengalaman Kerja & Magang", bullets: [] },
    { type: "PROJECT", title: "Proyek & Portofolio", bullets: [] },
    { type: "EDUCATION", title: "Pendidikan & Akademik", bullets: [] },
    { type: "SKILL", title: "Keahlian & Kompetensi", bullets: [] },
  ];

  let currentSectionIdx = 0; // Default to Experience

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Deteksi Header Bagian
    if (lower.includes("pengalaman") || lower.includes("experience") || lower.includes("riwayat kerja") || lower.includes("organisasi")) {
      currentSectionIdx = 0;
      continue;
    } else if (lower.includes("proyek") || lower.includes("project") || lower.includes("portofolio")) {
      currentSectionIdx = 1;
      continue;
    } else if (lower.includes("pendidikan") || lower.includes("education") || lower.includes("akademik") || lower.includes("kuliah")) {
      currentSectionIdx = 2;
      continue;
    } else if (lower.includes("keahlian") || lower.includes("skill") || lower.includes("kompetensi") || lower.includes("teknologi")) {
      currentSectionIdx = 3;
      continue;
    }

    // Identifikasi Poin Bullet / Kalimat Bermakna
    const cleanBullet = line.replace(/^[•\-\*•\d+\.]\s*/, "").trim();
    if (cleanBullet.length > 10) {
      const id = `b_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sections[currentSectionIdx].bullets.push({
        id,
        originalText: cleanBullet,
        approvalStatus: "PENDING_REVIEW",
      });
    }
  }

  // Jika suatu section kosong, pastikan ada minimal 1 poin dari teks asli
  return sections.filter((s) => s.bullets.length > 0);
}
