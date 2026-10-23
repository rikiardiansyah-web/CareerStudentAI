# CAREERSTUDENT AI
### Adaptive Career Co-Pilot Berbasis Human-in-the-Loop & Socratic Dialogue
**Inovasi Kesiapan Karier Mahasiswa Multidisiplin di Era Digital**

---

<div align="center">

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.2-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?logo=postgresql)](https://neon.tech/)
[![Security](https://img.shields.io/badge/OWASP-Top_10_Hardened-green?logo=owasp)](https://owasp.org/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple?logo=pwa)](https://web.dev/progressive-web-apps/)

**[🌐 Akses Aplikasi Live](https://career-student-ai.vercel.app)** • **[📄 Dokumen Proposal](PROPOSAL_GDI_FEST_2026.md)** • **[🎯 Pitch Deck](PITCH_DECK.md)**

</div>

---

## 📌 Tentang Proyek

**CAREERSTUDENT AI** adalah platform persiapan karier adaptif berbasis web progresif (PWA) yang dirancang untuk mengatasi fenomena *vibe-applying* (kebiasaan menyalin klaim teks otomatis tanpa memahami isi resume) di kalangan mahasiswa tingkat akhir dan lulusan baru (*fresh graduates*). 

Sistem ini mengusung paradigma **Human-in-the-Loop (HITL)** dan metode dialektika **Sokratik**: AI dilarang keras menimpa teks CV secara otonom, melainkan memandu mahasiswa merefleksikan pencapaian riil ke dalam format berstandar internasional (*Applicant Tracking System* / ATS), mendiagnosis kesenjangan keterampilan (*skill gap*), serta mengasah kesiapan mental wawancara berbasis metode STAR (*Situation, Task, Action, Result*).

---

## 🚀 Fitur Unggulan

1. **MOD-01: Interactive CV Analyzer & Fast Builder**
   - Formulir terstruktur 4 tab dengan template industri (*Executive Modern Layout* & *Harvard Classic ATS Standard*).
   - Fitur sensor otomatis data sensitif (**PII Redaction Guard**) yang mencegah pencantuman NIK / KTP di resume.
   - Analisis diksi Sokratik dan **Explicit Approval Gate** (Setujui / Edit Manual / Tolak).
   - Ekspor berkas fisik `.pdf` berbasis vektor client-side (*jsPDF*) yang kebal terhadap browser *pop-up blocker*.

2. **MOD-02: Multidisciplinary Skill-Gap Analysis**
   - Diagnosis kesenjangan kompetensi lintas 4 rumpun ilmu (IT, Bisnis/MT, Pemasaran Digital, Keuangan).
   - Matriks kompetensi visual (*Strong Match*, *Partial*, *Critical Gap*).
   - *Actionable Learning Roadmap* bertahap 4 minggu untuk menutup kelemahan kritis.

3. **MOD-03: Cognitive Mock Interview Simulator**
   - Simulasi wawancara adaptif dengan *dynamic follow-up probes*.
   - **Mandatory Self-Reflection Gate**: skor evaluasi AI dikunci hingga kandidat mengevaluasi diri sendiri.
   - Ulasan mendalam pada 4 pilar metode STAR (*Situation, Task, Action, Result*).

4. **MOD-04: Career Discovery & Explainable Job Matching**
   - Algoritma pencocokan karier transparan berbasis formula **Weighted Skill-Coverage**:
     $$\text{MatchScore} = \left( \sum_{i=1}^{n} w_i \cdot s_i \right) \times 100\%$$
   - Penjelasan terbuka (*Explainable AI*) mengapa peran relevan dan tantangan apa yang harus diantisipasi.

---

## 🛡️ Arsitektur Keamanan & Enkripsi Data

Aplikasi telah diperkuat (*hardened*) sesuai standar keamanan industri dan **OWASP Top 10**:

- **Enkripsi Kata Sandi Kriptografis (Scrypt + Salt):** Kata sandi pengguna di-hash menggunakan fungsi derivasi kunci memori-intensif **Scrypt** dengan **16-byte cryptographic salt (CSPRNG)** dan diverifikasi menggunakan `crypto.timingSafeEqual` untuk mencegah serangan *timing attack* dan *rainbow table*.
- **Otentikasi Multi-Faktor:** Mendukung Google OAuth, Email & Kata Sandi Terenkripsi, serta Email OTP dengan *rate-limiting cooldown* 60 detik.
- **Perlindungan Header Keamanan:** Mengaktifkan HSTS (*Strict-Transport-Security*), *Content Security Policy* (CSP), *X-Frame-Options: DENY* (anti-clickjacking), *X-Content-Type-Options: nosniff*, dan menyembunyikan header `X-Powered-By`.
- **Privasi Identitas (Zero Plaintext):** Sensor otomatis PII (*Personally Identifiable Information*) untuk melindungi data sensitif mahasiswa.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

| Lapisan | Teknologi |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Lucide Icons |
| **Bahasa** | TypeScript 5 (Strict Mode) |
| **Backend** | Next.js Serverless Edge Route Handlers (Vercel) |
| **Database** | PostgreSQL (Neon Cloud) via Prisma ORM v6 |
| **AI Engine** | Google Gemini 2.5 Flash API (Socratic Persona) |
| **Microservice** | Golang (gRPC-Go) & Protocol Buffers v3 |
| **Ekspor Dokumen** | jsPDF (Client-Side Vector Engine) |
| **PWA** | Service Worker dengan strategi caching *Network-First* & *Cache-First* |

---

## 💻 Panduan Instalasi Lokal

### Prasyarat
- Node.js versi 20.x atau lebih baru
- npm, yarn, atau pnpm

### Langkah Menjalankan
1. **Clone Repositori:**
   ```bash
   git clone https://github.com/rikiardiansyah-web/CareerStudentAI.git
   cd CareerStudentAI
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Lingkungan (`.env`):**
   Salin berkas `.env.example` atau buat `.env` dengan variabel berikut:
   ```env
   DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
   AUTH_SECRET="your-secure-auth-secret"
   GEMINI_API_KEY="your-gemini-api-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Sinkronisasi Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

---

## 👥 Tim Pengembang

**TIM AQUAMAN TEKNOKRAT — UNIVERSITAS TEKNOKRAT INDONESIA**
*Lomba Inovasi Digital — GDI FEST 2026*

- **Riki Ardiansyah** (Ketua Tim / Lead Full-Stack & AI) — NIM: 24313003
- **Jovan Akbar Setiodono** (Frontend & PWA Specialist) — NIM: 24313024
- **Fiqi Rahman Al Afkhoni** (Security & QA Analyst) — NIM: 24313023

**Dosen Pembimbing:**
- **Dr. Erliyan Redy Susanto, M.Kom.**

---

## 📄 Lisensi
Hak Cipta © 2026 Tim Aquaman — Universitas Teknokrat Indonesia. Seluruh hak cipta dilindungi undang-undang.
