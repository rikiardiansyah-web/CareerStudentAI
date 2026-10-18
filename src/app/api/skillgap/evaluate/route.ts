import { NextRequest, NextResponse } from "next/server";
import { evaluateSkillGap } from "@/lib/skillGapEvaluator";

export async function POST(req: NextRequest) {
  try {
    const { targetRoleId, resumeText } = await req.json();

    const result = evaluateSkillGap(targetRoleId || "pm_jr", resumeText || "");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[API Skill-Gap Evaluation Error]:", error);
    return NextResponse.json(
      { error: "Gagal mengevaluasi kesenjangan keterampilan." },
      { status: 500 }
    );
  }
}
