import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  getOpeningQuestion,
  InterviewType,
  InterviewSession,
} from "@/lib/interviewEngine";

// POST /api/interview/start
// Body: { targetRoleId: string, targetRoleTitle: string, interviewType: InterviewType }
// Response: { sessionId: string, firstQuestion: string, starFocus: string[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      targetRoleId = "pm_jr",
      targetRoleTitle = "Junior Professional",
      interviewType = "behavioral",
    } = body as {
      targetRoleId: string;
      targetRoleTitle: string;
      interviewType: InterviewType;
    };

    const sessionId = randomUUID().slice(0, 12);
    const firstQuestion = getOpeningQuestion(targetRoleId, interviewType);

    // Buat session awal (disimpan di client localStorage)
    const session: InterviewSession = {
      sessionId,
      targetRole: targetRoleTitle,
      interviewType,
      turns: [],
      selfReflection: null,
      evaluation: null,
      completedAt: null,
    };

    return NextResponse.json({
      sessionId,
      firstQuestion: firstQuestion.text,
      starFocus: firstQuestion.starFocus,
      sessionSnapshot: session,
    });
  } catch (err) {
    console.error("[/api/interview/start]", err);
    return NextResponse.json(
      { error: "Gagal memulai sesi wawancara." },
      { status: 500 }
    );
  }
}
