# Project Tracker (Tracker.md)
## CAREERSTUDENT AI — Adaptive Career Co-Pilot

---

### 1. Ringkasan Status Proyek (Executive Progress)

- **Fase Saat Ini:** Fase 6: PWA Audit, Optimasi Vercel & UI Slop Finish Gate (SELESAI ✅)
- **Status Build:** Seluruh Fase 0 s/d 6 Selesai & Lulus Audit (Production Build 100% Clean)

---

### 2. Status 8 Dokumen Perencanaan (`not-a-vibe-coder`)

| No | Dokumen | Status | Deskripsi | Tautan File |
|:---|:---|:---:|:---|:---|
| 1 | `PRD.md` | ✅ Selesai | Spesifikasi produk, target persona, dan lingkup MVP P0 | [`PRD.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/PRD.md) |
| 2 | `TechSpec.md` | ✅ Selesai | Arsitektur Next.js, Gemini API, kontrak endpoint & SQLite | [`TechSpec.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/TechSpec.md) |
| 3 | `AppFlow.md` | ✅ Selesai | Peta navigasi pengguna & alur layar Sokratik per modul | [`AppFlow.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/AppFlow.md) |
| 4 | `Schema.md` | ✅ Selesai | Skema Prisma relasional, tipe kontrak & PWA sync store | [`Schema.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/Schema.md) |
| 5 | `ImplementationPlan.md` | ✅ Selesai | Roadmap bertahap 7 fase (Fase 0 s/d Fase 6) | [`ImplementationPlan.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/ImplementationPlan.md) |
| 6 | `Rules.md` | ✅ Selesai | Standar coding, guardrail HITL, aturan performa & PWA | [`Rules.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/Rules.md) |
| 7 | `Tracker.md` | ✅ Selesai | Pelacakan progres pekerjaan & kepatuhan skill | [`Tracker.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/Tracker.md) |
| 8 | `Design.md` | ✅ Selesai | Modern Clean, Deep Navy & Electric Indigo, anti-slop guidelines | [`Design.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/Design.md) |

---

### 3. Matriks Tugas Eksekusi Pengembangan (WBS Checklist)

#### Fase 0: Fondasi Proyek, Database & PWA Shell
*Skill: `progressive-web-apps-pwas`, `vercel-react-best-practices`*
- [x] **Task 0.1**: Inisialisasi Next.js 14+ (App Router, TypeScript, Tailwind CSS, Lucide Icons).
- [x] **Task 0.2**: Konfigurasi Prisma ORM dengan skema `Schema.md` (SQLite) & migrasi awal.
- [x] **Task 0.3**: Setup `public/manifest.json` (standalone, maskable icons 192px/512px, tema warna).
- [x] **Task 0.4**: Setup Service Worker (`sw.js`) dengan strategi Cache-First, Network-First, dan Stale-While-Revalidate.
- [x] **Task 0.5**: Pembuatan halaman fallback mandiri `public/offline.html`.
- [x] **Task 0.6**: Konfigurasi bundle Next.js & eliminasi *barrel imports*.

#### Fase 1: Desain Shell, Navigasi Mobile-First & State Machine
*Skill: `stop-making-ui-slop`, `ui-ux-pro-max-design-intelligence`, `progressive-web-apps-pwas`*
- [x] **Task 1.1**: Bottom Navigation Bar mobile ($< 768\text{px}$) & Sidebar desktop ($\ge 768\text{px}$).
- [x] **Task 1.2**: Custom hook `usePwaInstall` (tangkap event `beforeinstallprompt` & banner install).
- [x] **Task 1.3**: Custom hook `useNetworkStatus` dan banner visual status offline.
- [x] **Task 1.4**: Komponen dasar dengan 4 status (*Skeleton Loading*, *Empty*, *Error*, *Offline*).
- [x] **Task 1.5**: Zustand store untuk profil persona (Rian Pratama) dan cache draf lokal.

#### Fase 2: MOD-01 Interactive CV / Resume Analyzer & Socratic Optimizer
*Skill: `not-a-vibe-coder` (HITL Core), `vercel-react-best-practices`, `progressive-web-apps-pwas`*
- [x] **Task 2.1**: API `/api/resume/parse` untuk ekstraksi teks PDF in-memory & sanitasi privasi.
- [x] **Task 2.2**: Integrasi Gemini API persona *Socratic Career Mentor* (anti-hallucination prompt).
- [x] **Task 2.3**: API `/api/resume/analyze-reflective` untuk kritik diksi & pertanyaan pemantik.
- [x] **Task 2.4**: Dual-pane UI: Tampilan struktur CV & *Reflective Feedback Pane*.
- [x] **Task 2.5**: Komponen **Explicit Approval Gate Modal** (`[Setujui]`, `[Edit Manual]`, `[Tolak]`).
- [x] **Task 2.6**: Auto-save draf revisi ke IndexedDB lokal setiap 2 detik.
- [x] **Task 2.7**: Ekspor resume teroptimasi format ATS-Friendly.

#### Fase 3: MOD-02 Skill-Gap Analysis & Actionable Learning Roadmap
*Skill: `stop-making-ui-slop` (Zero Fake Metrics), `ui-ux-pro-max-design-intelligence`*
- [x] **Task 3.1**: Dataset taksonomi industri terkurasi untuk peran target.
- [x] **Task 3.2**: API `/api/skillgap/evaluate` untuk perbandingan keterampilan berbasis bukti riil.
- [x] **Task 3.3**: UI Matriks Kompetensi (🟢 *Strong*, 🟡 *Partial*, 🔴 *Critical Gap*) aksesibel WCAG AA.
- [x] **Task 3.4**: Generator *Actionable Learning Roadmap* mingguan (4 minggu).
- [x] **Task 3.5**: Approval Gate Roadmap: Penyesuaian jam belajar & persetujuan butir tugas mingguan.

#### Fase 4: MOD-03 Cognitive Mock Interview Simulator
*Skill: Gen-Think HITL, `ui-ux-pro-max-design-intelligence`*
- [x] **Task 4.1**: Inisialisasi sesi wawancara (Behavioral STAR / Situational).
- [x] **Task 4.2**: API `/api/interview/submit-answer` dengan *Dynamic Follow-Up Probe* Sokratik.
- [x] **Task 4.3**: Antarmuka dialog interaktif bertahap (input teks & audio Speech-to-Text).
- [x] **Task 4.4**: **Mandatory Self-Reflection Sheet** (pengguna wajib refleksi mandiri sebelum skor terbuka).
- [x] **Task 4.5**: API evaluasi STAR & Cognitive Reflection Score komparatif.
- [x] **Task 4.6**: Halaman laporan hasil sesi & rekomendasi aksi perbaikan.

#### Fase 5: MOD-04 Career Opportunity & Job Matching Discovery
*Skill: `stop-making-ui-slop` (Specific Labels & Explainable AI)*
- [x] **Task 5.1**: Dataset kurasi peluang karier relevan beserta atribut kualifikasinya.
- [x] **Task 5.2**: API `/api/career/opportunities` dengan algoritma transparansi relevansi.
- [x] **Task 5.3**: Kartu peluang kognitif: *"Mengapa Relevan"* & *"Tantangan yang Perlu Diantisipasi"*.
- [x] **Task 5.4**: Tombol jembatan lintas modul `[Petakan Skill Gap Peran Ini]` ke MOD-02.

#### Fase 6: PWA Audit, Optimasi Vercel & UI Slop Finish Gate
*Skill: Seluruh 5 Skill Terintegrasi*
- [x] **Task 6.1 (PWA Audit)**: Verifikasi Service Worker, cache offline `/offline.html`, skor Lighthouse PWA $\ge 90$.
- [x] **Task 6.2 (Vercel Audit)**: Eliminasi request waterfalls (`Promise.all`), bundle splitting (`next/dynamic`), minimasi re-render.
- [x] **Task 6.3 (Finish Gate Review)**: Verifikasi nihil tombol buntu, nihil angka/metrik palsu, touch targets $\ge 44\text{px}$, kontras WCAG $\ge 4.5:1$.
- [x] **Task 6.4 (Demo Readiness)**: Skenario pengujian presentasi interaktif untuk juri kompetisi Gen-Think ([`DEMO_GUIDE.md`](file:///C:/Users/Admin/.gemini/antigravity/scratch/careerstudent-ai/DEMO_GUIDE.md)).

---

### 4. Checklist Audit Kepatuhan Skill (Skill Compliance Gate)

#### A. Kepatuhan PWA (`progressive-web-apps-pwas`)
- [x] `manifest.json` lengkap dengan properti `standalone` & ikon maskable.
- [x] `sw.js` terdaftar tanpa error di DevTools -> Application -> Service Workers.
- [x] Caching strategi aktif: Cache-First (aset), Network-First (halaman), Stale-While-Revalidate (data).
- [x] Halaman `offline.html` tampil saat jaringan diputus (*Offline throttle* di DevTools).
- [x] Event `beforeinstallprompt` tertangkap dan tombol install kustom berfungsi.

#### B. Kepatuhan Performa Vercel (`vercel-react-best-practices`)
- [x] Tidak ada waterfall sekuensial pada dashboard dan fetching analitik.
- [x] Tidak ada *barrel imports* dari pustaka UI besar (Lucide, Radix).
- [x] Komponen berat (PDF viewer, chart, speech recognition) di-load secara dinamis dengan `next/dynamic`.
- [x] Objek serialisasi ke Client Component hanya memuat kolom yang dibutuhkan (*lean payload*).

#### C. Kepatuhan Anti-Slop UI (`stop-making-ui-slop`)
- [x] Tidak ada layout kartu/bento generik tanpa fungsi nyata.
- [x] Tidak ada angka persentase atau metrik palsu tanpa dasar kalkulasi riil.
- [x] Setiap tombol memiliki tindakan dan akibat nyata di aplikasi.
- [x] Status *Loading Skeleton*, *Empty*, *Error*, dan *Offline* berfungsi di setiap modul.

#### D. Kepatuhan Aksesibilitas (`ui-ux-pro-max-design-intelligence`)
- [x] Rasio kontras teks $\ge 4.5:1$ pada semua elemen bacaan.
- [x] Touch target minimal $44 \times 44\text{px}$ pada layar mobile.
- [x] Tidak menggunakan emoji sebagai ikon UI (menggunakan SVG Lucide).
- [x] Dukungan navigasi keyboard dengan focus rings yang jelas.

---

### 5. Riwayat Log Pembaruan (Append-Only Change Log)

- **2026-10-18:** Dokumen `PRD.md`, `TechSpec.md`, `AppFlow.md`, `Schema.md`, `ImplementationPlan.md`, `Rules.md`, `Tracker.md`, dan `Design.md` resmi disetujui.
- **2026-10-18:** Fase 0 Selesai (Inisialisasi Next.js 16 App Router, TypeScript, Tailwind CSS, Prisma 6 dengan SQLite lokal terverifikasi, PWA Manifest maskable, Service Worker multi-strategy, dan offline fallback offline.html).
- **2026-10-18:** Fase 1 Selesai (Mobile BottomNav, Desktop Sidebar, hook usePwaInstall & useNetworkStatus, komponen 4 status wajib, Zustand store persona, dan integrasi Dashboard Hub).
- **2026-10-18:** Fase 2 Selesai (MOD-01 Interactive CV Analyzer: unpdf in-memory parser, sanitasi data privat NIK/kontak, Gemini Socratic Engine, Dual-pane Reflective Feedback UI, Explicit Approval Gate Modal, auto-save lokal, dan ekspor ATS). Status: Siap eksekusi Fase 3.
- **2026-10-18:** Fase 3 Selesai (MOD-02 Skill-Gap Analysis: Taksonomi industri 3 role target, evaluator berbasis bukti keyword-detection, Matriks Kompetensi 3 level warna, Generator Roadmap 4 minggu, Approval Gate per minggu). Build terverifikasi 0 error.
- **2026-10-18:** Fase 4 Selesai (MOD-03 Cognitive Mock Interview: Bank pertanyaan 3 role × 3 tipe, Dynamic Follow-Up Probe (Gemini + heuristic), InterviewRoom chat-like UI, Mandatory Self-Reflection Gate, STAR 4-dimensi evaluation, STARResultCard breakdown, localStorage session persistence). Build terverifikasi 0 error.
- **2026-10-18:** Fase 5 Selesai (MOD-04 Career Opportunity & Job Matching Discovery: Dataset 6 peluang karier terkurasi 3 track, matching algorithm transparan tanpa black-box AI, RoleMatchCard dengan Explainable AI (Why Relevant, Challenges, Career Growth), dan jembatan langsung lintas-modul ke MOD-02 Skill-Gap). Build terverifikasi 0 error. Status: Lanjut ke Fase 6 (Audit & Polish).
- **2026-10-18:** Fase 6 Selesai (PWA Audit: manifest.json, sw.js multi-strategy caching, offline fallback offline.html; Vercel Audit: lean bundle, zero barrel imports; UI Slop Finish Gate: touch targets ≥44px, zero fake metrics, 4 required status states di setiap modul; Dokumen Panduan Juri Gen-Think DEMO_GUIDE.md dibuat). Seluruh 7 Fase (Fase 0 s/d 6) SELESAI 100%. PROYEK RESMI SIAP DEMO! 🎉
- **2026-10-18:** Peningkatan Fitur Pasca-Evaluasi:
  1. **Ekspor PDF Langsung (jsPDF):** Unduhan berkas `.pdf` fisik berstandar format ATS resmi secara client-side tanpa terhalang pop-up blocker browser, dilengkapi opsi Cetak native browser dan status feedback interaktif.
  2. **Career Mentor AI (ChatGPT-like):** Dialog bimbingan interaktif Sokratik bagi mahasiswa yang bingung mengisi butir CV dari nol dengan quick-prompt guidance.
  3. **Ekspansi Rumpun Jurusan Multidisiplin:** Memperluas taksonomi dari sebatas IT ke 4 rumpun keilmuan (Teknologi & IT, Bisnis & Manajemen, Pemasaran & Komunikasi, Keuangan & Akuntansi) mencakup 7 peran karier dan bank simulasi STAR terintegrasi.
  4. **Autentikasi Bersih:** Netralisasi profil tamu dan integrasi Google OAuth via NextAuth.
  5. **Pembuat CV Praktis (Fast Builder) & Redesain PDF Presisi Tinggi:**
     - Desain PDF presisi tinggi mengadopsi referensi Alfredo Torres (Modern Executive: header navy, kontak terstruktur, tanggal/instansi rata kanan) dan Mariana Napolitani (Classic ATS: centered header, garis pemisah tipis, layout elegan).
     - Alur pembuatan CV dirombak menjadi Dual-Mode: "Formulir Cepat" (4 tab ringkas tanpa kejenuhan kognitif) vs "Uji Sokratik ATS" (analisis reflektif AI).
     - Tombol template siap pakai 1-klik (Alfredo Torres, Mariana Napolitani, Fresh Graduate) dan generator ringkasan AI instan.

