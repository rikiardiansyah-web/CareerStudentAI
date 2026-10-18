"use client";

import React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { InterviewSetup } from "./InterviewSetup";
import { InterviewRoom } from "./InterviewRoom";
import { SelfReflectionSheet } from "./SelfReflectionSheet";
import { STARResultCard } from "./STARResultCard";
import {
  InterviewType,
  InterviewTurnRecord,
  StarDimension,
  SessionEvaluation,
  InterviewSession,
} from "@/lib/interviewEngine";
import { useAppStore } from "@/lib/store/useAppStore";
import { ErrorState } from "@/components/ui/StatusStates";

// Fase alur sesi wawancara
type InterviewPhase = "setup" | "room" | "reflection" | "result";

const STORAGE_KEY = "careerstudent_interview_session_v1";

export function MockInterviewContainer() {
  const { setActiveTab } = useAppStore();

  // State sesi
  const [phase, setPhase] = React.useState<InterviewPhase>("setup");
  const [sessionId, setSessionId] = React.useState("");
  const [targetRoleId, setTargetRoleId] = React.useState("");
  const [targetRoleTitle, setTargetRoleTitle] = React.useState("");
  const [interviewType, setInterviewType] =
    React.useState<InterviewType>("behavioral");
  const [turns, setTurns] = React.useState<InterviewTurnRecord[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState("");
  const [currentStarFocus, setCurrentStarFocus] = React.useState<
    StarDimension[]
  >([]);
  const [isSessionComplete, setIsSessionComplete] = React.useState(false);
  const [selfReflection, setSelfReflection] = React.useState<string | null>(
    null
  );
  const [evaluation, setEvaluation] =
    React.useState<SessionEvaluation | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Restore dari localStorage saat mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.sessionId && data.turns?.length > 0) {
          setSessionId(data.sessionId);
          setTargetRoleId(data.targetRoleId);
          setTargetRoleTitle(data.targetRoleTitle);
          setInterviewType(data.interviewType);
          setTurns(data.turns);
          setCurrentQuestion(data.currentQuestion || "");
          setCurrentStarFocus(data.currentStarFocus || []);
          setIsSessionComplete(data.isSessionComplete || false);
          setSelfReflection(data.selfReflection || null);
          setEvaluation(data.evaluation || null);

          // Tentukan fase dari data tersimpan
          if (data.evaluation) {
            setPhase("result");
          } else if (data.selfReflection) {
            setPhase("reflection");
          } else if (data.isSessionComplete) {
            setPhase("reflection");
          } else {
            setPhase("room");
          }
        }
      }
    } catch {
      // localStorage corrupt, mulai fresh
    }
  }, []);

  // Simpan ke localStorage setiap ada perubahan state penting
  React.useEffect(() => {
    if (!sessionId) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sessionId,
          targetRoleId,
          targetRoleTitle,
          interviewType,
          turns,
          currentQuestion,
          currentStarFocus,
          isSessionComplete,
          selfReflection,
          evaluation,
        })
      );
    } catch {
      // Quota exceeded silently
    }
  }, [
    sessionId,
    targetRoleId,
    targetRoleTitle,
    interviewType,
    turns,
    currentQuestion,
    currentStarFocus,
    isSessionComplete,
    selfReflection,
    evaluation,
  ]);

  // ─── Handler: Mulai Sesi ──────────────────────────────────────────────
  async function handleStart(config: {
    targetRoleId: string;
    targetRoleTitle: string;
    interviewType: InterviewType;
  }) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Gagal memulai sesi wawancara.");

      const data = await res.json();
      setSessionId(data.sessionId);
      setTargetRoleId(config.targetRoleId);
      setTargetRoleTitle(config.targetRoleTitle);
      setInterviewType(config.interviewType);
      setCurrentQuestion(data.firstQuestion);
      setCurrentStarFocus(data.starFocus || []);
      setTurns([]);
      setIsSessionComplete(false);
      setSelfReflection(null);
      setEvaluation(null);
      setPhase("room");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan tak terduga."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Handler: Submit Jawaban ──────────────────────────────────────────
  async function handleSubmitAnswer(answer: string) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interview/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnIndex: turns.length,
          question: currentQuestion,
          userAnswer: answer,
          starFocus: currentStarFocus,
          turns,
          targetRoleId,
          interviewType,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || "Gagal memproses jawaban."
        );
      }

      const data = await res.json();
      setTurns(data.updatedTurns);

      if (data.isSessionComplete) {
        setIsSessionComplete(true);
        setCurrentQuestion("");
        setCurrentStarFocus([]);
      } else {
        setCurrentQuestion(data.followUpQuestion);
        setCurrentStarFocus(data.starFocus || []);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengirim jawaban."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Handler: Submit Refleksi & Evaluasi ──────────────────────────────
  async function handleSubmitReflection(reflection: string) {
    setIsLoading(true);
    setError(null);
    setSelfReflection(reflection);

    try {
      const session: InterviewSession = {
        sessionId,
        targetRole: targetRoleTitle,
        interviewType,
        turns,
        selfReflection: reflection,
        evaluation: null,
        completedAt: null,
      };

      const res = await fetch("/api/interview/evaluate-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || "Gagal mengevaluasi sesi."
        );
      }

      const data = await res.json();
      setEvaluation(data.evaluation);
      setPhase("result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Evaluasi gagal."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Handler: Mulai Ulang ─────────────────────────────────────────────
  function handleRestart() {
    localStorage.removeItem(STORAGE_KEY);
    setSessionId("");
    setTargetRoleId("");
    setTargetRoleTitle("");
    setInterviewType("behavioral");
    setTurns([]);
    setCurrentQuestion("");
    setCurrentStarFocus([]);
    setIsSessionComplete(false);
    setSelfReflection(null);
    setEvaluation(null);
    setError(null);
    setPhase("setup");
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            MOD-03: Cognitive Mock Interview
          </h2>
          <p className="text-xs text-slate-500">
            {phase === "setup"
              ? "Konfigurasi sesi simulasi"
              : phase === "room"
              ? "Dialog wawancara adaptif"
              : phase === "reflection"
              ? "Refleksi mandiri (wajib)"
              : "Hasil evaluasi STAR"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {phase !== "setup" && (
            <button
              onClick={handleRestart}
              className="text-xs text-amber-600 hover:text-amber-700 hover:underline font-semibold min-h-[44px] px-2 flex items-center cursor-pointer"
            >
              Mulai Ulang
            </button>
          )}
          <button
            onClick={() => setActiveTab("dashboard")}
            className="text-xs text-indigo-600 hover:underline font-semibold min-h-[44px] px-2 flex items-center cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Beranda
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorState
          title="Terjadi Kesalahan"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Phase-specific Views */}
      {phase === "setup" && (
        <InterviewSetup
          onStart={handleStart}
        />
      )}

      {phase === "room" && (
        <InterviewRoom
          sessionId={sessionId}
          targetRoleTitle={targetRoleTitle}
          targetRoleId={targetRoleId}
          interviewType={interviewType}
          turns={turns}
          currentQuestion={currentQuestion}
          currentStarFocus={currentStarFocus}
          turnIndex={turns.length}
          isLoading={isLoading}
          isSessionComplete={isSessionComplete}
          onSubmitAnswer={handleSubmitAnswer}
          onProceedToReflection={() => setPhase("reflection")}
        />
      )}

      {phase === "reflection" && (
        <SelfReflectionSheet
          targetRoleTitle={targetRoleTitle}
          turnCount={turns.length}
          isLoading={isLoading}
          onSubmitReflection={handleSubmitReflection}
        />
      )}

      {phase === "result" && evaluation && (
        <STARResultCard
          evaluation={evaluation}
          selfReflection={selfReflection || ""}
          targetRoleTitle={targetRoleTitle}
          onRestart={handleRestart}
        />
      )}

      {/* Loading overlay (untuk start) */}
      {isLoading && phase === "setup" && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          <span className="text-sm text-slate-500 ml-2">
            Mempersiapkan sesi...
          </span>
        </div>
      )}
    </div>
  );
}
