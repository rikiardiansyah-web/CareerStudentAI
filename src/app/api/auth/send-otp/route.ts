import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";
import crypto from "crypto";

// In-memory rate limiting map: email -> lastRequestedTimestamp
const otpRateLimitMap = new Map<string, number>();
const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds

// POST /api/auth/send-otp
// Body: { email: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email: string };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Rate Limiting Cooldown Check (Anti-Flooding / Anti-DoS)
    const now = Date.now();
    const lastRequested = otpRateLimitMap.get(normalizedEmail);
    if (lastRequested && now - lastRequested < OTP_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((OTP_COOLDOWN_MS - (now - lastRequested)) / 1000);
      return NextResponse.json(
        {
          error: `Harap tunggu ${waitSeconds} detik sebelum meminta kode OTP kembali.`,
        },
        { status: 429 }
      );
    }

    // 2. Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Expire dalam 10 menit
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Hapus token lama untuk email ini jika ada
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    // Simpan ke VerificationToken
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: otp,
        expires,
      },
    });

    // Perbarui catatan cooldown
    otpRateLimitMap.set(normalizedEmail, now);

    // Kirim email fisik sungguhan jika SMTP aktif
    let emailSent = false;
    try {
      emailSent = await sendOtpEmail(normalizedEmail, otp);
    } catch (mailErr) {
      console.warn("[SMTP Warn] Gagal kirim email fisik:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? "Kode OTP resmi telah dikirim ke inbox email kamu."
        : "Kode verifikasi telah diproses secara aman.",
      // SECURITY: devOtp hanya muncul saat NODE_ENV development
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
      emailSent,
    });
  } catch (err) {
    console.error("[/api/auth/send-otp Error]:", err);
    return NextResponse.json(
      { error: "Gagal memproses kode OTP. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
