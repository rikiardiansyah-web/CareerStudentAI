"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import {
  Mail,
  KeyRound,
  User,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = "password" | "otp";
type PasswordAction = "login" | "register";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { setPersona } = useAppStore();

  const [authTab, setAuthTab] = useState<AuthTab>("password");
  const [passwordAction, setPasswordAction] = useState<PasswordAction>("login");

  // Common inputs
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // OTP inputs
  const [otpStep, setOtpStep] = useState<"input-email" | "verify-otp">("input-email");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  function resetState() {
    setError(null);
    setSuccessMsg(null);
  }

  // Handle Login / Register with Salted & Scrypt-Encrypted Password
  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      if (passwordAction === "register") {
        // 1. Pendaftaran Akun Baru dengan Enkripsi Scrypt
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || cleanEmail.split("@")[0],
            email: cleanEmail,
            password,
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.error || "Gagal mendaftarkan akun.");
        }
      }

      // 2. Autentikasi Masuk menggunakan NextAuth Credentials
      const result = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Sinkronkan ke persona store
      setPersona({
        name: name.trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        educationLevel: "FINAL_YEAR_STUDENT",
        targetRoleId: "pm_jr",
        targetRoleTitle: "Junior Product Manager",
      });

      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Autentikasi kata sandi gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Send OTP
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirimkan OTP.");

      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }
      setOtpStep("verify-otp");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Masukkan 6 digit kode OTP.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const result = await signIn("email-otp", {
        email: cleanEmail,
        otp,
        name: name.trim() || cleanEmail.split("@")[0],
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setPersona({
        name: name.trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        educationLevel: "FINAL_YEAR_STUDENT",
        targetRoleId: "pm_jr",
        targetRoleTitle: "Junior Product Manager",
      });

      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Verifikasi OTP gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-auto relative transform transition-all">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Portal Keamanan Akun</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Pilih metode masuk yang terverifikasi & terenkripsi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Opsi 1: Google OAuth Utama */}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full min-h-[46px] flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold rounded-xl border-2 border-slate-200 hover:border-indigo-400 shadow-sm transition-all cursor-pointer mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
              />
            </svg>
            <span>Masuk Cepat dengan Google</span>
          </button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">
                Atau Autentikasi Mandiri
              </span>
            </div>
          </div>

          {/* Tab Selector: Kata Sandi Terenkripsi vs OTP */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthTab("password");
                resetState();
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authTab === "password"
                  ? "bg-white text-indigo-700 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔒 Kata Sandi Terenkripsi
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab("otp");
                resetState();
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authTab === "otp"
                  ? "bg-white text-indigo-700 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔑 Email OTP
            </button>
          </div>

          {/* TAB 1: KATA SANDI TERENKRIPSI (SCRYPT + SALT) */}
          {authTab === "password" && (
            <form onSubmit={handlePasswordAuth} className="space-y-3">
              {passwordAction === "register" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Lengkapmu"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  {passwordAction === "register" && (
                    <span className="text-[10px] text-slate-500">Min. 8 karakter (A-Z, a-z, 0-9, Simbol)</span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Security Badge Callout */}
              <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center gap-2 text-[10px] text-indigo-900">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Enkripsi Kriptografi Scrypt + 16-Byte Salt (Anti-Brute Force)</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[42px] flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>
                  {passwordAction === "login"
                    ? "Masuk dengan Kata Sandi"
                    : "Daftar Akun Terenkripsi"}
                </span>
              </button>

              <div className="text-center pt-1">
                {passwordAction === "login" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordAction("register");
                      resetState();
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Belum punya akun? <span className="underline">Daftar sekarang</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordAction("login");
                      resetState();
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Sudah punya akun? <span className="underline">Masuk di sini</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: EMAIL OTP VERIFICATION */}
          {authTab === "otp" && (
            <div>
              {otpStep === "input-email" ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Lengkapmu"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[42px] flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    <span>Kirim Kode OTP (Berlaku 10 Menit)</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {devOtp && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold">Kode OTP Demo: </span>
                        <span className="font-mono text-sm tracking-wider font-extrabold text-amber-900">
                          {devOtp}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtp(devOtp)}
                        className="text-[10px] bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded font-semibold text-amber-900 cursor-pointer"
                      >
                        Salin
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                      Masukkan 6 Digit Kode OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className="w-full text-center text-xl tracking-[0.4em] font-mono py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpStep("input-email")}
                      className="w-1/3 min-h-[40px] px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || otp.length < 6}
                      className="w-2/3 min-h-[40px] flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Verifikasi</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
