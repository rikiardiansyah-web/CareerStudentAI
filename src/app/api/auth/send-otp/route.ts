import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";

// POST /api/auth/send-otp
// Body: { email: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate 6 digit angka OTP acak
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expire dalam 10 menit
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Hapus token lama untuk email ini jika ada
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    // Simpan ke SQLite VerificationToken
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: otp,
        expires,
      },
    });

    console.log(`\n==================================================`);
    console.log(`🔑 [EMAIL OTP SENT]`);
    console.log(`Email : ${normalizedEmail}`);
    console.log(`Kode OTP: ${otp} (Berlaku 10 menit)`);
    console.log(`==================================================\n`);

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
        : "Kode OTP berhasil diproses (periksa log konsol jika dalam mode development).",
      devOtp: process.env.NODE_ENV === "production" ? undefined : otp,
      emailSent,
    });
  } catch (err) {
    console.error("[/api/auth/send-otp]", err);
    return NextResponse.json(
      { error: "Gagal mengirimkan kode OTP." },
      { status: 500 }
    );
  }
}
