import { NextRequest, NextResponse } from "next/server";
import { generateSocraticCritique } from "@/lib/geminiSocratic";

const MAX_BULLET_LENGTH = 2000;

export async function POST(req: NextRequest) {
  try {
    const { bulletText, targetRole } = await req.json();

    if (!bulletText || typeof bulletText !== "string") {
      return NextResponse.json(
        { error: "Teks poin resume wajib disertakan." },
        { status: 400 }
      );
    }

    const sanitizedBullet = bulletText.trim().slice(0, MAX_BULLET_LENGTH);
    const sanitizedRole = (typeof targetRole === "string")
      ? targetRole.trim().slice(0, 100)
      : "Junior Professional";

    const analysis = await generateSocraticCritique(
      sanitizedBullet,
      sanitizedRole
    );

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("[API Resume Reflective Analysis Error]:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis kritik Sokratik." },
      { status: 500 }
    );
  }
}
