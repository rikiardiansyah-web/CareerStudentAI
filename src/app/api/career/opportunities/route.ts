import { NextRequest, NextResponse } from "next/server";
import { matchCareerOpportunities } from "@/lib/careerMatcher";

// POST /api/career/opportunities
// Body: { userSkills: string[], targetRoleId?: string }
// Response: { results: MatchResult[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userSkills = [], targetRoleId } = body as {
      userSkills: string[];
      targetRoleId?: string;
    };

    if (!Array.isArray(userSkills)) {
      return NextResponse.json(
        { error: "userSkills harus berupa array string." },
        { status: 400 }
      );
    }

    const results = matchCareerOpportunities(userSkills, targetRoleId);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[/api/career/opportunities]", err);
    return NextResponse.json(
      { error: "Gagal memproses pencocokan karier." },
      { status: 500 }
    );
  }
}
