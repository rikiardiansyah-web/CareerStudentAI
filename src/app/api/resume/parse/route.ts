import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf, segmentResumeText } from "@/lib/resumeParser";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let rawText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "Berkas CV tidak ditemukan dalam unggahan." },
          { status: 400 }
        );
      }

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        rawText = await extractTextFromPdf(arrayBuffer);
      } else {
        rawText = await file.text();
      }
    } else {
      const body = await req.json();
      rawText = body.rawText || "";
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Teks resume kosong atau berkas tidak dapat dibaca." },
        { status: 400 }
      );
    }

    const sections = segmentResumeText(rawText);

    return NextResponse.json({
      success: true,
      data: {
        rawText,
        sections,
        totalBullets: sections.reduce((acc, s) => acc + s.bullets.length, 0),
      },
    });
  } catch (error) {
    console.error("[API Resume Parse Error]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memproses berkas resume." },
      { status: 500 }
    );
  }
}
