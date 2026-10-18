"use client";

import React from "react";
import { PenLine, Lock, Loader2, AlertTriangle } from "lucide-react";

interface SelfReflectionSheetProps {
  targetRoleTitle: string;
  turnCount: number;
  isLoading: boolean;
  onSubmitReflection: (reflection: string) => void;
}

export function SelfReflectionSheet({
  targetRoleTitle,
  turnCount,
  isLoading,
  onSubmitReflection,
}: SelfReflectionSheetProps) {
  const [reflection, setReflection] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;
  const isValid = reflection.trim().length >= 20 && wordCount >= 5;

  // Auto-resize textarea
  React.useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [reflection]);

  function handleSubmit() {
    if (!isValid || isLoading) return;
    onSubmitReflection(reflection.trim());
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Refleksi */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mb-4">
          <PenLine className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Refleksi Mandiri Wajib
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Sebelum melihat evaluasi AI, tuliskan refleksi jujurmu tentang
          performa wawancara yang baru kamu jalani.
        </p>
      </div>

      {/* Info Gate */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800 mb-1">
            Evaluasi AI STAR Terkunci 🔒
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Skor dan umpan balik dari AI{" "}
            <strong>tidak akan ditampilkan</strong> sampai kamu menyelesaikan
            refleksi mandiri ini. Ini bukan formalitas — proses refleksi diri
            adalah inti dari metode HITL.
          </p>
        </div>
      </div>

      {/* Konteks Sesi */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Target Peran:{" "}
            <span className="font-semibold text-slate-700">
              {targetRoleTitle}
            </span>
          </span>
          <span>
            Pertanyaan dijawab:{" "}
            <span className="font-semibold text-slate-700">{turnCount}</span>
          </span>
        </div>
      </div>

      {/* Pertanyaan Panduan Refleksi */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Pertanyaan Pemandu Refleksi
        </label>

        <div className="space-y-3">
          <div className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
              1
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              Dari {turnCount} pertanyaan yang dijawab, jawaban mana yang kamu
              rasa paling kuat dan paling lemah? Mengapa?
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
              2
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              Apakah ada momen di mana kamu kesulitan mengingat detail spesifik
              (angka, tools, hasil)? Apa yang membuatnya sulit?
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
              3
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              Jika kamu bisa mengulang sesi ini, apa satu hal yang akan kamu
              ubah dari caramu menjawab?
            </p>
          </div>
        </div>
      </div>

      {/* Textarea Refleksi */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          Tuliskan Refleksimu
        </label>
        <textarea
          ref={textareaRef}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Tulis refleksi jujurmu di sini. Jawab pertanyaan di atas sebagai panduan, atau tulis pemikiranmu sendiri..."
          rows={5}
          className="w-full text-sm text-slate-900 placeholder-slate-400 bg-slate-50 rounded-lg p-3 resize-none outline-none border border-slate-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all leading-relaxed min-h-[120px]"
        />
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs ${
              wordCount < 5
                ? "text-slate-400"
                : wordCount < 20
                ? "text-amber-600"
                : "text-teal-600"
            }`}
          >
            {wordCount} kata
            {wordCount < 5
              ? " — minimal 5 kata"
              : wordCount < 20
              ? " — refleksi yang lebih dalam akan membantu"
              : " ✓ Refleksi yang baik!"}
          </span>
          {!isValid && reflection.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="w-3 h-3" />
              Belum cukup detail
            </span>
          )}
        </div>
      </div>

      {/* Tombol Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Mengevaluasi sesi...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Kirim Refleksi &amp; Buka Evaluasi AI
          </>
        )}
      </button>
    </div>
  );
}
