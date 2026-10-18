"use client";

import React from "react";
import {
  Send,
  Loader2,
  MessageCircle,
  User,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";
import { InterviewTurnRecord, StarDimension } from "@/lib/interviewEngine";

interface InterviewRoomProps {
  sessionId: string;
  targetRoleTitle: string;
  targetRoleId: string;
  interviewType: string;
  turns: InterviewTurnRecord[];
  currentQuestion: string;
  currentStarFocus: StarDimension[];
  turnIndex: number;
  isLoading: boolean;
  isSessionComplete: boolean;
  onSubmitAnswer: (answer: string) => void;
  onProceedToReflection: () => void;
}

// Badge warna per dimensi STAR
const starBadgeColor: Record<StarDimension, string> = {
  situation: "bg-blue-50 text-blue-700 border-blue-200",
  task: "bg-violet-50 text-violet-700 border-violet-200",
  action: "bg-amber-50 text-amber-700 border-amber-200",
  result: "bg-teal-50 text-teal-700 border-teal-200",
};

const starLabel: Record<StarDimension, string> = {
  situation: "Situation",
  task: "Task",
  action: "Action",
  result: "Result",
};

export function InterviewRoom({
  targetRoleTitle,
  targetRoleId,
  interviewType,
  turns,
  currentQuestion,
  currentStarFocus,
  turnIndex,
  isLoading,
  isSessionComplete,
  onSubmitAnswer,
  onProceedToReflection,
}: InterviewRoomProps) {
  const [answer, setAnswer] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-scroll ke bawah saat turn baru muncul
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, currentQuestion, isSessionComplete]);

  // Auto-resize textarea
  React.useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [answer]);

  function handleSubmit() {
    const trimmed = answer.trim();
    if (trimmed.length < 10 || isLoading) return;
    onSubmitAnswer(trimmed);
    setAnswer("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl/Cmd + Enter untuk submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const isAnswerValid = answer.trim().length >= 10;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Header Konteks Sesi */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl mb-4 shadow-sm">
        <div>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            MOD-03 • {interviewType === "behavioral" ? "Behavioral STAR" : interviewType === "technical" ? "Technical Deep-Dive" : "Motivational Fit"}
          </p>
          <p className="text-sm font-semibold text-slate-900">{targetRoleTitle}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i < turns.length
                  ? "bg-amber-500"
                  : i === turns.length && !isSessionComplete
                  ? "bg-amber-200 ring-2 ring-amber-400 ring-offset-1"
                  : "bg-slate-200"
              }`}
            />
          ))}
          <span className="text-xs text-slate-500 ml-1.5">
            {Math.min(turns.length, 3)}/3
          </span>
        </div>
      </div>

      {/* Thread Percakapan */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4 pr-1">
        {/* Tampilkan riwayat turn */}
        {turns.map((turn, idx) => (
          <React.Fragment key={idx}>
            {/* Pertanyaan AI */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-amber-700">
                    Pewawancara AI
                  </span>
                  {turn.starFocus.map((dim) => (
                    <span
                      key={dim}
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${starBadgeColor[dim]}`}
                    >
                      {starLabel[dim]}
                    </span>
                  ))}
                </div>
                <div className="bg-white border border-slate-200 rounded-xl rounded-tl-sm p-3.5 text-sm text-slate-800 leading-relaxed shadow-sm">
                  {turn.question}
                </div>
              </div>
            </div>

            {/* Jawaban User */}
            <div className="flex gap-3 flex-row-reverse">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col items-end">
                <span className="text-[10px] font-bold text-indigo-700 mb-1.5">
                  Jawabanmu
                </span>
                <div className="bg-indigo-600 text-white rounded-xl rounded-tr-sm p-3.5 text-sm leading-relaxed shadow-sm max-w-[90%]">
                  {turn.userAnswer}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Pertanyaan aktif */}
        {!isSessionComplete && currentQuestion && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-bold text-amber-700">
                  Pewawancara AI
                </span>
                {currentStarFocus.map((dim) => (
                  <span
                    key={dim}
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${starBadgeColor[dim]}`}
                  >
                    {starLabel[dim]}
                  </span>
                ))}
              </div>
              <div
                className={`bg-white border border-amber-200 rounded-xl rounded-tl-sm p-3.5 text-sm text-slate-800 leading-relaxed shadow-sm ${
                  isLoading ? "animate-pulse" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun pertanyaan...
                  </span>
                ) : (
                  currentQuestion
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sesi selesai — notifikasi */}
        {isSessionComplete && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="bg-teal-50 border border-teal-200 rounded-xl rounded-tl-sm p-4 text-sm">
                <p className="font-bold text-teal-800 mb-1">
                  Sesi wawancara selesai! 🎉
                </p>
                <p className="text-teal-700 leading-relaxed">
                  Kamu telah menyelesaikan 3 pertanyaan. Sebelum melihat evaluasi
                  AI, wajib isi <strong>Refleksi Mandiri</strong> terlebih dahulu
                  — ini adalah bagian terpenting dari proses belajarmu.
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Jawaban / Tombol Lanjut */}
      {!isSessionComplete ? (
        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ceritakan pengalamanmu secara detail — semakin spesifik semakin baik. (Ctrl+Enter untuk kirim)"
            rows={3}
            className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent resize-none outline-none leading-relaxed min-h-[72px]"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span
              className={`text-xs ${
                wordCount < 20
                  ? "text-slate-400"
                  : wordCount < 50
                  ? "text-amber-600"
                  : "text-teal-600"
              }`}
            >
              {wordCount} kata {wordCount >= 50 ? "✓ Detail yang baik!" : wordCount >= 20 ? "— bisa lebih spesifik" : "— ceritakan lebih detail"}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!isAnswerValid || isLoading}
              className="flex items-center gap-2 min-h-[36px] px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Kirim Jawaban
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onProceedToReflection}
          className="mt-4 w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          <MessageCircle className="w-5 h-5" />
          Lanjut ke Refleksi Mandiri →
        </button>
      )}
    </div>
  );
}
