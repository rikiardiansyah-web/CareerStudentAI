import { NextRequest, NextResponse } from "next/server";
import {
  generateFollowUpQuestion,
  InterviewTurnRecord,
  InterviewType,
} from "@/lib/interviewEngine";

// POST /api/interview/submit-answer
// Body: { sessionId, turnIndex, question, userAnswer, starFocus, turns, targetRoleId, interviewType }
// Response: { followUpQuestion?, starFocus?, isSessionComplete }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      turnIndex,
      question,
      userAnswer,
      starFocus,
      turns = [],
      targetRoleId = "pm_jr",
      interviewType = "behavioral",
    } = body as {
      turnIndex: number;
      question: string;
      userAnswer: string;
      starFocus: string[];
      turns: InterviewTurnRecord[];
      targetRoleId: string;
      interviewType: InterviewType;
    };

    // Validasi jawaban tidak kosong
    if (!userAnswer || userAnswer.trim().length < 10) {
      return NextResponse.json(
        { error: "Jawaban terlalu singkat. Ceritakan dengan lebih detail." },
        { status: 400 }
      );
    }

    // Append turn baru ke riwayat sesi
    const updatedTurns: InterviewTurnRecord[] = [
      ...turns,
      {
        turnIndex,
        question,
        userAnswer: userAnswer.trim(),
        starFocus: starFocus as ("situation" | "task" | "action" | "result")[],
      },
    ];

    // Generate pertanyaan follow-up dinamis
    const followUp = await generateFollowUpQuestion(
      updatedTurns,
      targetRoleId,
      interviewType
    );

    return NextResponse.json({
      followUpQuestion: followUp.question,
      starFocus: followUp.starFocus,
      isSessionComplete: followUp.isSessionComplete,
      updatedTurns,
    });
  } catch (err) {
    console.error("[/api/interview/submit-answer]", err);
    return NextResponse.json(
      { error: "Gagal memproses jawaban wawancara." },
      { status: 500 }
    );
  }
}
