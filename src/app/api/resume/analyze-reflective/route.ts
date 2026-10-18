import { NextRequest, NextResponse } from "next/server";
import { generateSocraticCritique } from "@/lib/geminiSocratic";

export async function POST(req: NextRequest) {
  try {
    const { bulletText, targetRole } = await req.json();

    if (!bulletText || typeof bulletText !== "string") {
      return NextResponse.json(
        { error: "Teks poin resume wajib disertakan." },
        { status: 400 }
      );
    }

    const analysis = await generateSocraticCritique(
      bulletText,
      targetRole || "Junior Professional"
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
