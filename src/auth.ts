import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 jam (A07: Mengurangi resiko token aktif terlalu lama)
  },
  providers: [
    // 1. Google OAuth Provider (jika kredensial diisi)
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: email,
              token: inputOtp,
            },
          },
        });

        // Cari atau buat UserProfile di SQLite
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
