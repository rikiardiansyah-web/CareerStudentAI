import { NextRequest, NextResponse } from "next/server";
import { formulateApprovedBullet } from "@/lib/geminiSocratic";

export async function POST(req: NextRequest) {
  try {
    const { originalText, userReflection, targetRole } = await req.json();

    if (!originalText || !userReflection) {
      return NextResponse.json(
        { error: "Teks asli dan respon refleksi pengguna wajib diisi." },
        { status: 400 }
      );
    }

    const formulation = await formulateApprovedBullet(
      originalText,
      userReflection,
      targetRole || "Junior Professional"
    );

    return NextResponse.json({
      success: true,
      formulation,
    });
  } catch (error) {
    console.error("[API Resume Formula Generation Error]:", error);
    return NextResponse.json(
      { error: "Gagal merumuskan formulasi resume." },
      { status: 500 }
    );
  }
}
