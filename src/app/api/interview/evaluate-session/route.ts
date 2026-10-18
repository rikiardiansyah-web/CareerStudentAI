import { NextRequest, NextResponse } from "next/server";
import { evaluateInterviewSession, InterviewSession } from "@/lib/interviewEngine";

// POST /api/interview/evaluate-session
// Body: { session: InterviewSession }  — session sudah mengandung selfReflection
// Response: SessionEvaluation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session } = body as { session: InterviewSession };

    // Guard: refleksi diri WAJIB diisi sebelum evaluasi dibuka
    if (!session.selfReflection || session.selfReflection.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Refleksi mandiri belum diisi. Isi terlebih dahulu sebelum evaluasi AI ditampilkan.",
        },
        { status: 400 }
      );
    }

    if (!session.turns || session.turns.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada rekaman jawaban wawancara dalam sesi ini." },
        { status: 400 }
      );
    }

    const evaluation = await evaluateInterviewSession(session);

    return NextResponse.json({ evaluation });
  } catch (err) {
    console.error("[/api/interview/evaluate-session]", err);
    return NextResponse.json(
      { error: "Gagal mengevaluasi sesi wawancara." },
      { status: 500 }
    );
  }
}
