import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// POST /api/resume/mentor-chat
// Body: { messages: ChatMessage[], targetRole: string, currentContext?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], targetRole = "Junior Professional", currentContext = "" } = body;

    const userLastMessage = messages[messages.length - 1]?.content || "";

    if (!userLastMessage) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    if (ai) {
      try {
        const conversationHistory = messages
          .slice(-6) // ambil 6 pesan terakhir
          .map((m: ChatMessage) => `${m.role === "user" ? "Mahasiswa" : "Mentor"}: ${m.content}`)
          .join("\n");

        const prompt = `Kamu adalah Career Mentor Kognitif (Gen-Think Co-Pilot) untuk mahasiswa & fresh graduate di Indonesia.
Target Peran Mahasiswa: ${targetRole}
Konteks Bagian CV yang Sedang Dikerjakan: ${currentContext || "Penyusunan Poin Bullet & Pengalaman CV"}

Tugasmu:
1. Membantu mahasiswa yang bingung atau merasa kekurangan pengalaman saat menulis CV.
2. Gunakan gaya bahasa Indonesia yang suportif, profesional, dan membimbing (Socratic approach).
3. BUKAN mengarang data palsu, melainkan membantu mahasiswa menggali kegiatan kampus, tugas kuliah, proyek kelompok, atau organisasi mereka agar bernilai di mata rekruter.
4. Berikan contoh formula konkret: [Kata Kerja Aksi] + [Tantangan/Teknologi/Metode] + [Dampak/Hasil].
5. Buat respon yang ringkas, terstruktur rapi (gunakan bullet points jika perlu), dan maksimal 3 paragraf.

Riwayat Percakapan:
${conversationHistory}

Respon Mentor:`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const replyText = response.text || "Ada kendala dalam memproses jawaban. Silakan coba tanyakan kembali.";
        return NextResponse.json({ reply: replyText });
      } catch (geminiErr) {
        console.warn("[Gemini Chat API Error] Fallback to heuristic mentor response:", geminiErr);
      }
    }

    // Heuristic Fallback Response (Jika tanpa API Key atau offline)
    const lower = userLastMessage.toLowerCase();
    let reply = "";

    if (lower.includes("organisasi") || lower.includes("kepanitiaan") || lower.includes("acara")) {
      reply = `Pengalaman organisasi atau kepanitiaan di kampus itu sangat berharga jika kamu menuliskannya dari sudut pandang **hasil kerja nyata**! 

Coba ingat-ingat:
1. Berapa anggaran yang kamu kelola atau berapa peserta yang hadir di acara tersebut?
2. Apakah kamu memimpin divisi tertentu atau menyelesaikan kendala komunikasi?

Contoh formulasi kuat:
* *"Mengorkestrasi divisi logistik untuk acara kampus tahunan berkapasitas 500+ peserta, menyelesaikan pengadaan perlengkapan 2 hari sebelum tenggat waktu dengan efisiensi anggaran 15%."*

Bagian mana dari peran organisasimu yang ingin kita formulasikan bersama?`;
    } else if (lower.includes("tidak punya pengalaman") || lower.includes("belum pernah magang") || lower.includes("kosong")) {
      reply = `Jangan berkecil hati! Rekruter untuk posisi fresh graduate atau intern memahami bahwa kamu baru memulai. Kamu bisa mengganti pengalaman kerja formal dengan **3 pilar alternatif**:

1. **Tugas Besar & Proyek Kuliah**: Misalnya studi kasus, riset kelompok, atau aplikasi sederhana yang kamu bangun di semester akhir.
2. **Kepanitiaan & Kegiatan Relawan**: Menunjukkan soft skills seperti kerja sama tim dan kepemimpinan.
3. **Proyek Mandiri (Personal Project) & Sertifikasi**: Kursus online atau portofolio studi kasus mandiri.

Ceritakan ke saya satu tugas kuliah atau proyek kelompok yang menurutmu paling menantang, mari kita ubah jadi poin resume yang berbobot!`;
    } else {
      reply = `Pertanyaan yang bagus! Dalam menulis CV untuk target peran **${targetRole}**, kunci utamanya adalah memperjelas **kontribusi spesifikmu** dan **hasil yang terukur**.

Coba gunakan formula ini:
👉 **[Kata Kerja Kuat]** + **[Konteks Masalah / Tools]** + **[Hasil Terukur / Metrik]**

Misalnya, daripada menulis *"Membantu riset data"*, tuliskan: *"Menganalisis 200+ data responden survei menggunakan Google Sheets untuk merumuskan 3 rekomendasi fitur utama."*

Ada butir pengalaman spesifik yang sedang ingin kamu perbaiki sekarang? Tuliskan saja draf kasarmu di sini!`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("[/api/resume/mentor-chat]", err);
    return NextResponse.json({ error: "Gagal memproses pesan chat." }, { status: 500 });
  }
}
