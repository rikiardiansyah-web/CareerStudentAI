"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Sparkles,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CvMentorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSectionTitle?: string;
}

const QUICK_PROMPTS = [
  "Saya belum punya pengalaman kerja, harus isi apa?",
  "Bagaimana cara mengubah kegiatan organisasi jadi poin bernilai?",
  "Bantu saya cari kata kerja aksi yang cocok",
  "Berapa skor minimal metrik yang harus saya cantumkan?",
];

export function CvMentorChatModal({
  isOpen,
  onClose,
  currentSectionTitle,
}: CvMentorChatModalProps) {
  const { persona } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Halo ${persona.name || "Sobat Mahasiswa"}! Saya Career Mentor AI kamu. Jika kamu bingung bagaimana menulis pengalaman, merasa belum punya cukup portofolio, atau ingin memperkuat poin CV untuk posisi **${persona.targetRoleTitle}**, silakan tanyakan apa saja di sini! 😊`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  async function handleSend(customText?: string) {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    if (!customText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/resume/mentor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          targetRole: persona.targetRoleTitle,
          currentContext: currentSectionTitle
            ? `Bagian: ${currentSectionTitle}`
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendapatkan respon mentor.");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kendala saat menghubungkan ke Mentor AI. Silakan coba kembali ya.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetChat() {
    setMessages([
      {
        role: "assistant",
        content: `Percakapan telah direset. Ada bagian lain dari CV untuk posisi **${persona.targetRoleTitle}** yang ingin kamu diskusikan?`,
      },
    ]);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">Career Mentor AI (Interaktif)</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  Gen-Think HITL
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Konsultasikan keraguan dan kelemahan dalam pengisian CV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Mulai Percakapan Baru"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-xs"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Mentor sedang menyusun saran...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 border border-slate-200 cursor-pointer disabled:opacity-50"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan kebingunganmu dalam menulis pengalaman..."
              disabled={isLoading}
              className="flex-1 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 transition-all placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="min-h-[44px] px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
