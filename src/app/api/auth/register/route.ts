import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  validatePasswordStrength,
} from "@/lib/security/password";

// POST /api/auth/register
// Body: { name?: string, email: string, password: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Sanitize & Validate Email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Enforce NIST/OWASP Password Strength
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        { error: passwordCheck.message },
        { status: 400 }
      );
    }

    // 3. Check for Existing Account
    const existingUser = await prisma.userProfile.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      if (existingUser.password) {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan masuk menggunakan kata sandi Anda." },
          { status: 409 }
        );
      } else {
        // User previously logged in via Google OAuth or OTP - update with encrypted password
        const hashedPassword = await hashPassword(password);
        await prisma.userProfile.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            name: name?.trim() || existingUser.name,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Kata sandi terenkripsi berhasil ditambahkan ke akun Anda.",
        });
      }
    }

    // 4. Hash Password with Scrypt & 16-byte Cryptographic Salt
    const hashedPassword = await hashPassword(password);
    const sanitizedName = (name && typeof name === "string")
      ? name.trim().slice(0, 50)
      : normalizedEmail.split("@")[0];

    // 5. Create Protected User Profile
    const newUser = await prisma.userProfile.create({
      data: {
        email: normalizedEmail,
        name: sanitizedName,
        password: hashedPassword,
        educationLevel: "FINAL_YEAR_STUDENT",
        targetRoleId: "pm_jr",
        targetRoleTitle: "Junior Product Manager",
        dataConsentAccepted: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Akun berhasil didaftarkan dengan enkripsi kata sandi Scrypt tingkat enterprise.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[/api/auth/register Error]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat mendaftarkan akun." },
      { status: 500 }
    );
  }
}
