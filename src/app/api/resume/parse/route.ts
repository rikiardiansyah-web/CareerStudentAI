import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf, segmentResumeText } from "@/lib/resumeParser";

// Maximum upload file size: 5 MB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
// Maximum raw text character length to prevent buffer overflow / DoS
const MAX_RAW_TEXT_LENGTH = 50000;

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

      // Security check: File size limit (5MB)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Ukuran berkas melebihi batas maksimum 5 MB." },
          { status: 413 }
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
      rawText = (typeof body.rawText === "string") ? body.rawText : "";
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Teks resume kosong atau berkas tidak dapat dibaca." },
        { status: 400 }
      );
    }

    // Security check: Raw text length limit
    if (rawText.length > MAX_RAW_TEXT_LENGTH) {
      rawText = rawText.slice(0, MAX_RAW_TEXT_LENGTH);
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
