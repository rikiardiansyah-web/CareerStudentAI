import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// =============================================================================
// Tipe Data Core MOD-03
// =============================================================================

export type InterviewType = "behavioral" | "technical" | "motivational";
export type StarDimension = "situation" | "task" | "action" | "result";

export interface InterviewQuestion {
  id: string;
  text: string;
  type: InterviewType;
  starFocus: StarDimension[];
  probeDepth: number; // 0=intro, 1=follow-up, 2=deep probe
}

export interface InterviewTurnRecord {
  turnIndex: number;
  question: string;
  userAnswer: string;
  starFocus: StarDimension[];
}

export interface StarScore {
  dimension: StarDimension;
  score: number; // 1–5
  rationale: string;
  missingElement: string;
}

export interface SessionEvaluation {
  overallScore: number; // 1–5
  starScores: StarScore[];
  strengths: string[];
  growthAreas: string[];
  cognitiveInsight: string; // Wawasan kognitif mendalam
  nextPracticeRecommendation: string;
}

export interface InterviewSession {
  sessionId: string;
  targetRole: string;
  interviewType: InterviewType;
  turns: InterviewTurnRecord[];
  selfReflection: string | null;
  evaluation: SessionEvaluation | null;
  completedAt: string | null;
}

// =============================================================================
// Bank Pertanyaan Heuristik (Offline Fallback per Role & Tipe)
// =============================================================================

const questionBank: Record<
  string,
  Record<InterviewType, InterviewQuestion[]>
> = {
  pm_jr: {
    behavioral: [
      {
        id: "pm_b1",
        text: "Ceritakan situasi di mana kamu harus memprioritaskan fitur produk dengan sumber daya yang sangat terbatas. Bagaimana proses pengambilan keputusanmu?",
        type: "behavioral",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "pm_b2",
        text: "Bagaimana konkretnya kamu mengidentifikasi masalah utama dalam konteks yang kamu ceritakan, dan siapa pemangku kepentingan yang paling terpengaruh?",
        type: "behavioral",
        starFocus: ["task", "action"],
        probeDepth: 1,
      },
      {
        id: "pm_b3",
        text: "Framework atau metodologi apa yang kamu terapkan saat itu, dan bagaimana hasilnya kamu ukur setelah keputusan dibuat?",
        type: "behavioral",
        starFocus: ["action", "result"],
        probeDepth: 2,
      },
    ],
    technical: [
      {
        id: "pm_t1",
        text: "Jelaskan bagaimana kamu menggunakan data kuantitatif untuk memvalidasi sebuah hipotesis fitur. Berikan contoh nyata dari pengalamanmu.",
        type: "technical",
        starFocus: ["action", "result"],
        probeDepth: 0,
      },
      {
        id: "pm_t2",
        text: "Metrik apa yang menjadi patokan keberhasilan dalam contoh yang kamu berikan tadi, dan mengapa metrik tersebut dipilih?",
        type: "technical",
        starFocus: ["result"],
        probeDepth: 1,
      },
    ],
    motivational: [
      {
        id: "pm_m1",
        text: "Mengapa kamu tertarik menjadi Product Manager, dan apa momen spesifik yang pertama kali membuat kamu yakin dengan pilihan karier ini?",
        type: "motivational",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "pm_m2",
        text: "Kualitas PM seperti apa yang paling ingin kamu kembangkan dalam 6 bulan ke depan, dan apa langkah konkret pertamamu?",
        type: "motivational",
        starFocus: ["action", "result"],
        probeDepth: 1,
      },
    ],
  },
  data_analyst_jr: {
    behavioral: [
      {
        id: "da_b1",
        text: "Ceritakan situasi di mana kamu menemukan anomali atau inkonsistensi signifikan dalam dataset. Bagaimana kamu mengatasinya?",
        type: "behavioral",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "da_b2",
        text: "Tools dan teknik spesifik apa yang kamu gunakan untuk mendiagnosis masalah tersebut, dan siapa yang terdampak jika kamu tidak menemukannya?",
        type: "behavioral",
        starFocus: ["action"],
        probeDepth: 1,
      },
      {
        id: "da_b3",
        text: "Apa rekomendasi keputusan bisnis yang kamu hasilkan dari analisis itu, dan bagaimana dampaknya diukur?",
        type: "behavioral",
        starFocus: ["result"],
        probeDepth: 2,
      },
    ],
    technical: [
      {
        id: "da_t1",
        text: "Jelaskan bagaimana kamu merancang sebuah dashboard monitoring. Variabel apa yang kamu pertimbangkan saat memilih visualisasi untuk audiens non-teknis?",
        type: "technical",
        starFocus: ["action", "result"],
        probeDepth: 0,
      },
      {
        id: "da_t2",
        text: "Bagaimana kamu memastikan validitas model analitik atau laporan yang kamu buat sebelum dipresentasikan ke stakeholder?",
        type: "technical",
        starFocus: ["action"],
        probeDepth: 1,
      },
    ],
    motivational: [
      {
        id: "da_m1",
        text: "Apa yang mendorongmu memilih jalur karier Data Analyst, dan proyek analitik seperti apa yang paling ingin kamu kerjakan dalam 1 tahun ke depan?",
        type: "motivational",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
    ],
  },
  frontend_jr: {
    behavioral: [
      {
        id: "fe_b1",
        text: "Ceritakan proyek frontend paling kompleks yang pernah kamu bangun. Apa tantangan teknis tersulit yang kamu hadapi?",
        type: "behavioral",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "fe_b2",
        text: "Pendekatan arsitektur atau pattern React apa yang kamu terapkan untuk menyelesaikan tantangan tersebut, dan mengapa kamu memilihnya dibanding alternatif lain?",
        type: "behavioral",
        starFocus: ["action"],
        probeDepth: 1,
      },
      {
        id: "fe_b3",
        text: "Bagaimana kamu mengukur dan memvalidasi peningkatan performa atau UX yang dihasilkan dari keputusan teknismu?",
        type: "behavioral",
        starFocus: ["result"],
        probeDepth: 2,
      },
    ],
    technical: [
      {
        id: "fe_t1",
        text: "Jelaskan strategi state management yang kamu gunakan di proyek React terakhirmu. Kapan kamu memilih global state vs. local state?",
        type: "technical",
        starFocus: ["action"],
        probeDepth: 0,
      },
      {
        id: "fe_t2",
        text: "Teknik optimasi rendering apa yang kamu terapkan untuk mencegah re-render tidak perlu, dan bagaimana kamu mengukur efeknya?",
        type: "technical",
        starFocus: ["action", "result"],
        probeDepth: 1,
      },
    ],
    motivational: [
      {
        id: "fe_m1",
        text: "Apa yang paling kamu sukai dari pekerjaan Frontend Developer, dan area spesifik apa (performa, aksesibilitas, UI animation, dll.) yang paling ingin kamu dalami?",
        type: "motivational",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
    ],
  },
  management_trainee: {
    behavioral: [
      {
        id: "mt_b1",
        text: "Ceritakan situasi di mana kamu memimpin sebuah inisiatif atau kepanitiaan dengan tenggat waktu ketat dan anggota tim yang demotivasi. Bagaimana kamu mengatasinya?",
        type: "behavioral",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "mt_b2",
        text: "Langkah terukur apa yang kamu ambil untuk membagi beban kerja dan mengidentifikasi akar hambatan (root cause) saat itu?",
        type: "behavioral",
        starFocus: ["action"],
        probeDepth: 1,
      },
      {
        id: "mt_b3",
        text: "Bagaimana hasil akhirnya dari segi target kegiatan, dan apa evaluasi kepemimpinan terbesar yang kamu pelajari?",
        type: "behavioral",
        starFocus: ["result"],
        probeDepth: 2,
      },
    ],
    technical: [
      {
        id: "mt_t1",
        text: "Jika terjadi keterlambatan distribusi barang di cabang regional hingga membebani biaya logistik harian, framework analisis (seperti 5-Whys atau Fishbone) apa yang akan kamu gunakan?",
        type: "technical",
        starFocus: ["task", "action"],
        probeDepth: 0,
      },
      {
        id: "mt_t2",
        text: "Bagaimana cara kamu menyeimbangkan efisiensi biaya operasional (P&L) tanpa mengorbankan standar keselamatan kerja tim lapangan?",
        type: "technical",
        starFocus: ["action", "result"],
        probeDepth: 1,
      },
    ],
    motivational: [
      {
        id: "mt_m1",
        text: "Program Management Trainee menuntut rotasi lintas divisi dengan beban kerja tinggi. Apa yang membuatmu yakin dan termotivasi memilih jalur jalur akselerasi kepemimpinan ini?",
        type: "motivational",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
    ],
  },
  hr_generalist: {
    behavioral: [
      {
        id: "hr_b1",
        text: "Ceritakan pengalaman ketika kamu harus memediasi perselisihan atau perbedaan kepentingan antara dua pihak dalam organisasi/proyek. Bagaimana pendekatan komunikasimu?",
        type: "behavioral",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "hr_b2",
        text: "Prinsip netralitas dan langkah objektif apa yang kamu gunakan untuk mengumpulkan fakta tanpa memperburuk hubungan kerja?",
        type: "behavioral",
        starFocus: ["action"],
        probeDepth: 1,
      },
      {
        id: "hr_b3",
        text: "Apa resolusi yang disepakati bersama, dan bagaimana dampak jangka panjangnya terhadap kerja sama tim?",
        type: "behavioral",
        starFocus: ["result"],
        probeDepth: 2,
      },
    ],
    technical: [
      {
        id: "hr_t1",
        text: "Bagaimana alur kamu menyusun kriteria penilaian saat melakukan screening awal (initial screening) terhadap ratusan pelamar untuk posisi fresh graduate?",
        type: "technical",
        starFocus: ["action"],
        probeDepth: 0,
      },
      {
        id: "hr_t2",
        text: "Apa indikator utama (KPI) yang kamu perhatikan untuk mengukur keberhasilan program onboarding karyawan baru pada 30 hari pertama?",
        type: "technical",
        starFocus: ["action", "result"],
        probeDepth: 1,
      },
    ],
    motivational: [
      {
        id: "hr_m1",
        text: "Mengapa kamu tertarik berkarier di bidang Human Resources & People Development, dan nilai apa yang ingin kamu bawa untuk menciptakan lingkungan kerja yang sehat?",
        type: "motivational",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
    ],
  },
  digital_marketing: {
    behavioral: [
      {
        id: "dm_b1",
        text: "Ceritakan pengalamanmu mengelola kampanye promosi atau konten media sosial yang awalnya tidak mencapai target interaksi (engagement/leads). Apa yang kamu lakukan?",
        type: "behavioral",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "dm_b2",
        text: "Data atau analitik apa yang kamu bedah untuk memahami penyebab rendahnya performa, dan iterasi apa yang langsung kamu uji coba?",
        type: "behavioral",
        starFocus: ["action"],
        probeDepth: 1,
      },
      {
        id: "dm_b3",
        text: "Berapa peningkatan metrik yang berhasil dicapai setelah perbaikan tersebut, dan bagaimana kamu mendokumentasikannya?",
        type: "behavioral",
        starFocus: ["result"],
        probeDepth: 2,
      },
    ],
    technical: [
      {
        id: "dm_t1",
        text: "Bagaimana cara kamu menentukan alokasi anggaran iklan antara awareness, traffic, dan konversi? Metrik seperti CPA dan ROAS apa yang menjadi acuan utamamu?",
        type: "technical",
        starFocus: ["action"],
        probeDepth: 0,
      },
      {
        id: "dm_t2",
        text: "Bagaimana metodologimu saat melakukan A/B testing terhadap headline dan creative ad agar kesimpulan yang diambil valid secara statistik?",
        type: "technical",
        starFocus: ["action", "result"],
        probeDepth: 1,
      },
    ],
    motivational: [
      {
        id: "dm_m1",
        text: "Tren dunia pemasaran digital berkembang sangat dinamis. Bagaimana caramu secara proaktif memperbarui keahlian dan wawasan analitik pasarmu setiap minggu?",
        type: "motivational",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
    ],
  },
  financial_analyst_jr: {
    behavioral: [
      {
        id: "fa_b1",
        text: "Ceritakan pengalamanmu saat mengolah sekumpulan data keuangan yang berantakan atau memiliki ketidaksesuaian angka. Bagaimana kamu menyelesaikannya?",
        type: "behavioral",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
      {
        id: "fa_b2",
        text: "Metode audit trail atau verifikasi apa yang kamu terapkan untuk memastikan tidak ada kesalahan input atau double-counting?",
        type: "behavioral",
        starFocus: ["action"],
        probeDepth: 1,
      },
      {
        id: "fa_b3",
        text: "Apa kesimpulan finansial yang berhasil kamu sampaikan kepada dosen/atasan/tim, dan bagaimana tanggapan mereka terhadap ketepatan analisismu?",
        type: "behavioral",
        starFocus: ["result"],
        probeDepth: 2,
      },
    ],
    technical: [
      {
        id: "fa_t1",
        text: "Dalam membaca laporan keuangan perusahaan, apa rasio likuiditas dan solvabilitas utama yang kamu telaah terlebih dahulu sebelum menyimpulkan kesehatan finansialnya?",
        type: "technical",
        starFocus: ["action"],
        probeDepth: 0,
      },
      {
        id: "fa_t2",
        text: "Jelaskan pemahamanmu mengenai keterhubungan antara Laporan Laba Rugi (P&L), Neraca (Balance Sheet), dan Laporan Arus Kas (Cash Flow Statement).",
        type: "technical",
        starFocus: ["action", "result"],
        probeDepth: 1,
      },
    ],
    motivational: [
      {
        id: "fa_m1",
        text: "Bidang keuangan menuntut akurasi dan etika integritas tanpa kompromi. Apa yang memotivasimu untuk mendalami profesi analis keuangan ini?",
        type: "motivational",
        starFocus: ["situation", "task"],
        probeDepth: 0,
      },
    ],
  },
};

// Fallback default jika role tidak dikenali
const defaultQuestions: Record<InterviewType, InterviewQuestion[]> = {
  behavioral: [
    {
      id: "def_b1",
      text: "Ceritakan pengalaman di mana kamu harus bekerja sama dengan tim yang memiliki pandangan berbeda dari kamu. Apa situasinya dan bagaimana kamu menavigasinya?",
      type: "behavioral",
      starFocus: ["situation", "task"],
      probeDepth: 0,
    },
    {
      id: "def_b2",
      text: "Apa langkah konkret yang kamu ambil untuk menjembatani perbedaan perspektif tersebut, dan siapa yang kamu libatkan?",
      type: "behavioral",
      starFocus: ["action"],
      probeDepth: 1,
    },
    {
      id: "def_b3",
      text: "Apa hasil yang dicapai, dan apa pelajaran terpenting yang kamu ambil dari pengalaman itu untuk situasi serupa di masa depan?",
      type: "behavioral",
      starFocus: ["result"],
      probeDepth: 2,
    },
  ],
  technical: [
    {
      id: "def_t1",
      text: "Jelaskan proyek atau tugas teknis yang paling menantang yang pernah kamu kerjakan. Tools dan metodologi apa yang kamu gunakan?",
      type: "technical",
      starFocus: ["action"],
      probeDepth: 0,
    },
  ],
  motivational: [
    {
      id: "def_m1",
      text: "Apa motivasi terkuat yang mendorong kamu melamar untuk posisi ini, dan nilai apa dari diri kamu yang paling relevan dengan peran tersebut?",
      type: "motivational",
      starFocus: ["situation", "task"],
      probeDepth: 0,
    },
  ],
};

// =============================================================================
// Fungsi: Ambil pertanyaan pembuka berdasarkan role & tipe
// =============================================================================

export function getOpeningQuestion(
  roleId: string,
  interviewType: InterviewType
): InterviewQuestion {
  const roleQuestions = questionBank[roleId] ?? {};
  const typeQuestions = roleQuestions[interviewType] ?? defaultQuestions[interviewType];
  return typeQuestions[0];
}

// =============================================================================
// Fungsi: Generate pertanyaan follow-up dinamis (AI atau heuristik)
// =============================================================================

export async function generateFollowUpQuestion(
  turns: InterviewTurnRecord[],
  roleId: string,
  interviewType: InterviewType
): Promise<{ question: string; starFocus: StarDimension[]; isSessionComplete: boolean }> {
  const turnCount = turns.length;

  // Sesi selesai setelah 3 giliran pertanyaan
  if (turnCount >= 3) {
    return { question: "", starFocus: [], isSessionComplete: true };
  }

  // Coba generate probe dinamis dengan Gemini
  if (ai) {
    try {
      const conversationContext = turns
        .map((t, i) => `Pertanyaan ${i + 1}: ${t.question}\nJawaban: ${t.userAnswer}`)
        .join("\n\n");

      const coveredDimensions = turns.flatMap((t) => t.starFocus);
      const missingDimensions: StarDimension[] = (
        ["situation", "task", "action", "result"] as StarDimension[]
      ).filter((d) => !coveredDimensions.includes(d));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Kamu adalah pewawancara karier Senior yang menggunakan metode STAR (Situation, Task, Action, Result).
Sesi wawancara sudah berjalan ${turnCount} giliran. Dimensi STAR yang belum cukup digali: ${missingDimensions.join(", ") || "semua sudah dibahas, fokus pada kedalaman"}.

Konteks percakapan:
${conversationContext}

Buat 1 pertanyaan follow-up yang:
1. Menggali dimensi STAR yang belum terjawab atau masih dangkal
2. Menggunakan referensi konkret dari jawaban sebelumnya (bukan pertanyaan generik)
3. Mendorong kandidat mengingat detail SPESIFIK (angka, nama tools, timeline)
4. Tidak lebih dari 2 kalimat

Keluarkan HANYA dalam JSON valid:
{
  "question": "Pertanyaan follow-up spesifik di sini.",
  "starFocus": ["action"]
}`,
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          question: parsed.question,
          starFocus: parsed.starFocus || ["action"],
          isSessionComplete: false,
        };
      }
    } catch (err) {
      console.warn("[Gemini API] Falling back to heuristic follow-up:", err);
    }
  }

  // Heuristik fallback: ambil pertanyaan berikutnya dari bank berdasarkan urutan
  const roleQuestions = questionBank[roleId] ?? {};
  const typeQuestions = roleQuestions[interviewType] ?? defaultQuestions[interviewType];
  const nextQuestion = typeQuestions[turnCount] ?? typeQuestions[typeQuestions.length - 1];

  return {
    question: nextQuestion.text,
    starFocus: nextQuestion.starFocus,
    isSessionComplete: false,
  };
}

// =============================================================================
// Fungsi: Evaluasi Sesi (AI atau heuristik)
// =============================================================================

export async function evaluateInterviewSession(
  session: InterviewSession
): Promise<SessionEvaluation> {
  const { turns, selfReflection, targetRole } = session;

  if (ai) {
    try {
      const transcriptText = turns
        .map(
          (t, i) =>
            `[Turn ${i + 1} — STAR Focus: ${t.starFocus.join(", ")}]\nPertanyaan: ${t.question}\nJawaban Kandidat: ${t.userAnswer}`
        )
        .join("\n\n---\n\n");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Kamu adalah evaluator wawancara karier senior yang menggunakan framework STAR.
Evaluasi sesi wawancara kandidat untuk peran: ${targetRole}.

TRANSKRIP WAWANCARA:
${transcriptText}

REFLEKSI MANDIRI KANDIDAT (diisi sebelum melihat evaluasi AI):
${selfReflection || "(tidak diisi)"}

Berikan evaluasi komprehensif dan jujur. Bandingkan refleksi mandiri dengan kualitas jawaban aktual.
Keluarkan HANYA dalam format JSON valid:
{
  "overallScore": 3.8,
  "starScores": [
    { "dimension": "situation", "score": 4, "rationale": "Konteks jelas dan spesifik.", "missingElement": "Tidak menyebut skala tim." },
    { "dimension": "task", "score": 3, "rationale": "Peran cukup tergambar.", "missingElement": "KPI pribadi tidak disebutkan." },
    { "dimension": "action", "score": 4, "rationale": "Langkah metodis dan nyata.", "missingElement": "Tools spesifik kurang." },
    { "dimension": "result", "score": 3, "rationale": "Ada dampak, tapi tanpa angka.", "missingElement": "Metrik kuantitatif absen." }
  ],
  "strengths": ["Narasi kronologis yang runtut", "Pemilihan contoh relevan dengan peran target"],
  "growthAreas": ["Tambahkan metrik konkret (angka, %) di dimensi Result", "Sebutkan nama tools spesifik saat menjelaskan Action"],
  "cognitiveInsight": "Kandidat menunjukkan pola pikir solutif namun cenderung abstrak. Refleksi mandiri yang diberikan sudah menunjukkan kesadaran diri yang baik terhadap kelemahan di dimensi Result.",
  "nextPracticeRecommendation": "Latih 2 contoh behavioral question dengan fokus WAJIB menyebut minimal 1 metrik kuantitatif di setiap jawaban."
}`,
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn("[Gemini API] Falling back to heuristic evaluation:", err);
    }
  }

  // Heuristic Evaluation Fallback — tetap jujur, tidak fake
  const totalWords = turns.reduce((sum, t) => sum + t.userAnswer.split(/\s+/).length, 0);
  const avgWords = totalWords / Math.max(turns.length, 1);

  // Penilaian kasar berdasarkan panjang dan kata kunci STAR
  const scoreByWords = avgWords > 80 ? 3.5 : avgWords > 40 ? 2.5 : 1.5;
  const hasMetric = turns.some(
    (t) => /(\d+%|\d+ orang|\d+ hari|\d+x|rupiah|Rp)/i.test(t.userAnswer)
  );
  const hasTools = turns.some(
    (t) => /figma|excel|sql|python|jira|notion|trello|tableau|react|notion/i.test(t.userAnswer.toLowerCase())
  );

  const finalScore = Math.min(5, scoreByWords + (hasMetric ? 0.5 : 0) + (hasTools ? 0.3 : 0));

  return {
    overallScore: parseFloat(finalScore.toFixed(1)),
    starScores: [
      {
        dimension: "situation",
        score: Math.round(finalScore),
        rationale: "Konteks situasi tersampaikan secara umum.",
        missingElement: "Detail skala dan konteks organisasi masih bisa diperjelas.",
      },
      {
        dimension: "task",
        score: Math.max(1, Math.round(finalScore - 0.5)),
        rationale: "Peran dan tanggung jawab cukup tergambarkan.",
        missingElement: "Target atau KPI personal tidak disebutkan secara eksplisit.",
      },
      {
        dimension: "action",
        score: Math.round(finalScore),
        rationale: hasTools
          ? "Menyebutkan tools spesifik meningkatkan kredibilitas."
          : "Tindakan disebutkan namun kurang detail metodologi.",
        missingElement: hasTools ? "Alasan pemilihan tools belum dijelaskan." : "Sebutkan tools dan teknik spesifik.",
      },
      {
        dimension: "result",
        score: Math.max(1, Math.round(finalScore - (hasMetric ? 0 : 1))),
        rationale: hasMetric
          ? "Menunjukkan kesadaran terhadap dampak terukur."
          : "Hasil disebutkan namun masih bersifat kualitatif.",
        missingElement: hasMetric
          ? "Bandingkan hasil dengan baseline atau target awal."
          : "Tambahkan minimal 1 metrik kuantitatif (angka, persentase, frekuensi).",
      },
    ],
    strengths: [
      avgWords > 60
        ? "Jawaban cukup elaboratif dan bernuansa"
        : "Berhasil menjawab semua pertanyaan yang diajukan",
      selfReflection && selfReflection.length > 50
        ? "Refleksi mandiri menunjukkan kesadaran diri yang baik"
        : "Bersedia melakukan proses refleksi mandiri",
    ],
    growthAreas: [
      !hasMetric
        ? "Sertakan angka spesifik di setiap dimensi Result (misalnya: meningkat 30%, menghemat 2 jam/minggu)"
        : "Pastikan metrik yang disebut dapat diverifikasi atau memiliki konteks perbandingan",
      !hasTools
        ? "Sebutkan nama tools dan teknologi spesifik saat menjelaskan Action"
        : "Jelaskan alasan pemilihan tools dibanding alternatif lainnya",
    ],
    cognitiveInsight:
      "Jawaban menunjukkan pemahaman dasar atas metode STAR. Untuk wawancara karier kompetitif, spesifisitas adalah pembeda utama antara kandidat rata-rata dan kandidat yang dipanggil tahap berikutnya.",
    nextPracticeRecommendation:
      "Pilih 2 pengalaman kerja atau organisasi terbaikmu, dan latih menceritakannya dengan wajib menyebut: (1) angka konkret, (2) nama tools, (3) dampak ke orang lain atau bisnis.",
  };
}
