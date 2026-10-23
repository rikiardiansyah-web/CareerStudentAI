import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/security/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "careerstudent-ai-gen-think-secret-key-2026-super-secure",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // 1. Email & Salted Encrypted Password Provider (Enterprise Scrypt)
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Kata Sandi", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan kata sandi wajib diisi.");
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const plainPassword = credentials.password as string;

        const user = await prisma.userProfile.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Akun tidak ditemukan atau belum mengatur kata sandi.");
        }

        // Constant-time verification using crypto.timingSafeEqual
        const isValid = await verifyPassword(plainPassword, user.password);
        if (!isValid) {
          throw new Error("Email atau kata sandi yang Anda masukkan salah.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    // 2. Email OTP / Secure One-Time Passcode Provider
    Credentials({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "Kode OTP", type: "text" },
        name: { label: "Nama", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Email dan kode OTP wajib diisi.");
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const inputOtp = (credentials.otp as string).trim();
        const userName = (credentials.name as string) || email.split("@")[0];

        // Cari token OTP aktif di database
        const record = await prisma.verificationToken.findFirst({
          where: {
            identifier: email,
            token: inputOtp,
            expires: {
              gt: new Date(),
            },
          },
        });

        if (!record) {
          throw new Error("Kode OTP tidak valid atau sudah kedaluwarsa.");
        }

        // Hapus token setelah digunakan sekali (Single-Use OTP)
        await prisma.verificationToken.deleteMany({
          where: {
            identifier: email,
            token: inputOtp,
          },
        });

        // Cari atau buat UserProfile
        let user = await prisma.userProfile.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.userProfile.create({
            data: {
              email,
              name: userName,
              emailVerified: new Date(),
              educationLevel: "FINAL_YEAR_STUDENT",
              targetRoleId: "pm_jr",
              targetRoleTitle: "Junior Product Manager",
            },
          });
        } else if (!user.emailVerified) {
          user = await prisma.userProfile.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const email = user.email.toLowerCase().trim();
          let profile = await prisma.userProfile.findUnique({
            where: { email },
          });

          if (!profile) {
            profile = await prisma.userProfile.create({
              data: {
                email,
                name: user.name || email.split("@")[0],
                image: user.image,
                emailVerified: new Date(),
                educationLevel: "FINAL_YEAR_STUDENT",
                targetRoleId: "pm_jr",
                targetRoleTitle: "Junior Product Manager",
              },
            });
          }
          user.id = profile.id;
        } catch (dbErr) {
          console.error("[signIn callback] Error upserting UserProfile:", dbErr);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Menggunakan modal auth di beranda
  },
});
