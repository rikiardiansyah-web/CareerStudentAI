"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, Sparkles, Loader2, ClipboardCheck } from "lucide-react";
import { ParsedSection } from "@/lib/resumeParser";

interface ResumeUploaderProps {
  onParsed: (sections: ParsedSection[], rawText: string) => void;
}

const SAMPLE_STUDENT_CV = `MAHASISWA TINGKAT AKHIR
Program Studi Sistem Informasi / Ilmu Komputer
Target Karier: Junior Product Manager

RINGKASAN
Mahasiswa tingkat akhir jurusan Sistem Informasi dengan ketertarikan kuat pada manajemen produk digital, analisis kebutuhan pengguna, dan riset berbasis data.

PENGALAMAN & ORGANISASI
• Membantu mengelola event kampus tahunan bersama tim panitia.
• Ikut merancang website informasi himpunan mahasiswa untuk dokumentasi kegiatan.
• Menjadi koordinator divisi humas dalam menjalin relasi ke pihak sponsor luar kampus.

PROYEK & PORTOFOLIO
• Membuat prototipe aplikasi mobile pemesanan kantin kampus menggunakan Figma.
• Mengerjakan riset survei pengalaman pengguna terhadap sistem absensi online mahasiswa.
• Mengembangkan dashboard analisis data sederhana menggunakan Google Sheets dan spreadsheet.

KEAHLIAN & KOMPETENSI
• Product Management: Agile basics, Scrum, User Stories, Wireframing
• Tools: Figma, Trello, Notion, Jira, Google Analytics
• Soft Skills: Problem Solving, Komunikasi Tim, Berpikir Kritis
`;

export function ResumeUploader({ onParsed }: ResumeUploaderProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memproses file.");

      onParsed(json.data.sections, json.data.rawText);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses berkas PDF.";
      setErrorMsg(message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!pastedText.trim()) return;
    setIsParsing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/resume/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: pastedText }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memproses teks.");

      onParsed(json.data.sections, json.data.rawText);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses teks.";
      setErrorMsg(message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleLoadSample = async () => {
    setPastedText(SAMPLE_STUDENT_CV);
    setIsParsing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/resume/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: SAMPLE_STUDENT_CV }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      onParsed(json.data.sections, json.data.rawText);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat sampel.";
      setErrorMsg(message);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
          Unggah atau Tempel CV Resume
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          AI akan membedah poin-poin pengalamanmu secara in-memory, membersihkan data sensitif pribadi, dan menyusun pertanyaan Sokratik reflektif.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-center font-medium">
          {errorMsg}
        </div>
      )}

      {!pasteMode ? (
        <div className="space-y-4">
          <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50/60 hover:bg-indigo-50/20 transition-all duration-200">
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isParsing}
            />
            {isParsing ? (
              <div className="flex flex-col items-center gap-2 text-indigo-600">
                <Loader2 className="w-7 h-7 animate-spin" />
                <span className="text-xs font-semibold">Memproses dan mengekstrak CV...</span>
              </div>
            ) : (
              <>
                <FileText className="w-8 h-8 text-slate-400" />
                <div className="text-center">
                  <span className="text-sm font-semibold text-indigo-600 hover:underline">
                    Pilih file PDF atau TXT
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">Maksimal 5MB • Diproses secara privat</span>
                </div>
              </>
            )}
          </label>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setPasteMode(true)}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Tempel teks manual saja →
            </button>

            <button
              onClick={handleLoadSample}
              disabled={isParsing}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gunakan Contoh CV Mahasiswa</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            rows={10}
            className="w-full text-xs font-mono p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800"
            placeholder="Tempelkan teks riwayat CV lengkapmu di sini..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setPasteMode(false)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Kembali ke unggah berkas
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadSample}
                className="text-xs font-semibold text-indigo-600 hover:underline px-2 py-1"
              >
                Isi Contoh
              </button>
              <button
                onClick={handleTextSubmit}
                disabled={isParsing || !pastedText.trim()}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
                <span>Mulai Analisis Reflektif</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
