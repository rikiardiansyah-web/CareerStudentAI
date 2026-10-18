# Product Requirement Document (PRD)
## CAREERSTUDENT AI — Adaptive Career Co-Pilot

---

### 1. Eksekutif & Latar Belakang Produk

| Atribut | Keterangan |
| :--- | :--- |
| **Nama Produk** | **CAREERSTUDENT AI** |
| **Kategori** | Adaptive Career Co-Pilot / EdTech & Career Readiness |
| **Tema & Filosofi** | *Gen-Think: Bridging Human Intelligence in the Digital Era* |
| **Platform Target** | Progressive Web App (PWA) — Mobile-First & Desktop Responsive |
| **Konteks Rilis** | Prototipe Inovasi Kompetisi Gen-Think (Fokus Novelty, Interaksi Kognitif, & Validasi Fungsional) |
| **Versi Dokumen** | 1.0 (MVP Specification) |

#### 1.1 Masalah (Problem Statement)
Di era disrupsi digital dan otomatisasi AI, mahasiswa tingkat akhir dan *fresh graduates* dihadapkan pada paradoks persiapan karier:
1. **Generative AI Over-Reliance (Vibe-Applying):** Talenta muda menggunakan AI generatif untuk membuat resume dan cover letter otomatis secara seragam (*black-box generation*). Hasilnya, mereka tidak memahami esensi portofolio sendiri saat diuji dalam wawancara, kehilangan keaslian (*authenticity*), serta tumpul dalam penalaran kritis.
2. **Kesenjangan Keterampilan Nyata (*Blind Skill Gap*):** Informasi lowongan kerja sering kali menggunakan jargon industri yang dinamis, membuat lulusan baru kesulitan mengidentifikasi gap kompetensi nyata antara kurikulum kampus dan ekspektasi industri.
3. **Kecemasan Transisi Karier Tanpa Kompas Reflektif:** Sebagian besar platform karier bertindak sebagai papan lowongan pasif (*job boards*) atau mesin pencocokan algoritma dingin tanpa proses pendampingan mental dan kognitif yang memicu refleksi diri (*self-reflection*).

#### 1.2 Visi & Proposisi Nilai (Value Proposition)
**CareerStudent AI** memosisikan kecerdasan buatan bukan sebagai penentu takdir atau pengganti keputusan manusia (*autonomous decision-maker*), melainkan sebagai **jembatan kognitif (*cognitive bridge*)** yang menguatkan kecerdasan manusia (*human intelligence*):
* **Bukan Auto-Write, tapi Co-Thinking:** AI tidak menuliskan jawaban secara sepihak, melainkan memandu pengguna berpikir kritis melalui metode dialektika/Sokratik.
* **Otonomi Penuh di Tangan Manusia (*Human-in-the-Loop*):** Setiap wawasan, penyesuaian strategi karier, dan draf narasi portofolio wajib melalui gerbang persetujuan eksplisit (*Explicit Approval Gates*) dari pengguna.

---

### 2. Target Pengguna & Karakteristik Persona

#### 2.1 Segmen Utama
1. **Mahasiswa Tingkat Akhir (Semester 7–8):**
   * *Kebutuhan:* Mempersiapkan berkas lamaran pertama, mengonversi kegiatan akademik/organisasi/magang ke bahasa capaian industri (*impact-oriented metrics*), dan melatih mental wawancara kerja.
2. **Fresh Graduates (0–1 Tahun Kelulusan):**
   * *Kebutuhan:* Mendiagnosis alasan kegagalan seleksi administrasi/wawancara sebelumnya, menutup *skill-gap* spesifik secara terarah, dan menjelajahi alternatif peran yang relevan dengan kapabilitas mereka.

#### 2.2 Persona Pengguna
* **Karakteristik Persona:** Mahasiswa Calon Lulusan / Fresh Graduate Multidisiplin (21–23 tahun, rumpun ilmu IT, Bisnis, Komunikasi, atau Keuangan).
* **Tantangan:** Memiliki pengalaman organisasi, kepanitiaan, dan proyek kuliah, namun bingung bagaimana menarasikannya di CV agar lolos ATS, cemas menghadapi wawancara teknis/perilaku, dan tergoda menggunakan ChatGPT secara asal-asalan untuk membuat resume instan tanpa memahami substansinya.
* **Tujuan Penggunaan:** Ingin pendamping cerdas yang menantangnya berpikir kritis, membantu memetakan kompetensi yang masih kurang, menyediakan formulir cepat dengan template siap pakai, serta melatih argumen wawancara secara percaya diri.

---

### 3. Prinsip Desain Interaksi: Human-in-the-Loop (HITL) & Cognitive Bridge

Untuk menjamin ketaatan terhadap tema *Gen-Think*, sistem menerapkan 3 pilar interaksi utama:

1. **Dual-Mode Workflow (Efisiensi & Kedalaman Kognitif):**
   * *Mode Formulir Cepat (Fast Builder):* Membantu mahasiswa menyusun draf CV rapi dalam hitungan menit menggunakan template teruji (*Modern Executive* & *Classic ATS*) serta generator ringkasan berbasis AI.
   * *Mode Reflektif Sokratik (Cognitive Optimizer):* Membedah kelemahan diksi dan memandu mahasiswa memperdalam pencapaian melalui dialog terarah tanpa fabrikasi data palsu.

2. **Socratic Questioning Engine (Dialog Reflektif):**
   * Ketika sistem mendeteksi deskripsi pengalaman yang lemah di CV (misal: *"Membantu mengelola event kampus"*), AI tidak langsung menulis ulang teks secara otomatis.
   * AI mengajukan pertanyaan pemantik: *"Berapa peserta yang hadir? Metrik apa yang kamu ukur untuk mengklaim event tersebut sukses? Keputusan sulit apa yang kamu ambil saat terjadi kendala?"*

3. **Explicit Approval Gates (Gerbang Konfirmasi Bertahap):**
   * Tidak ada data profil, poin resume, atau sasaran belajar yang disimpan secara otomatis oleh AI tanpa konfirmasi pengguna. Pengguna memiliki kendali penuh: **[Setujui & Terapkan]**, **[Edit Manual]**, atau **[Tolak / Refleksi Ulang]**.

---

### 4. Lingkup Fitur Produk (MVP Scope / Must-Have P0)

| ID Fitur | Modul | Deskripsi Fungsional & Aturan Bisnis |
| :--- | :--- | :--- |
| **MOD-01** | **Interactive CV Builder & ATS Optimizer** | • **Dual-Mode System:** Formulir cepat (*Fast Builder*) dengan template siap pakai (Alfredo Torres & Mariana Napolitani) + Mode Uji Sokratik AI.<br>• **Generator Ringkasan AI:** Menyusun ringkasan profil eksekutif sesuai peran target dalam 1 detik.<br>• **Pembedah Diksi Sokratik:** AI membedah kelemahan butir pengalaman dan membuka *Approval Gate* sebelum perubahan disetujui.<br>• **Ekspor PDF Berstandar Industri:** Sintesis PDF client-side (*jsPDF*) dengan opsi *Modern Executive* (aksen navy, tanggal rata kanan) & *Classic ATS* (centered layout, garis pembatas rapi), kebal pop-up blocker browser, serta ekspor teks ATS (.txt). |
| **MOD-02** | **Skill-Gap Analysis & Actionable Roadmap (Multidisiplin)** | • Pengguna memilih peran target dari 4 rumpun keilmuan (*Teknologi & IT, Bisnis & Manajemen, Pemasaran & Komunikasi, Keuangan & Akuntansi*).<br>• Sistem membandingkan keterampilan profil pengguna saat ini terhadap taksonomi keterampilan industri terkini.<br>• Menampilkan matriks kompetensi: *Strong Match*, *Partial Match*, dan *Critical Gap*.<br>• Menghasilkan *Actionable Learning Roadmap* mingguan yang disetujui pengguna (rekomendasi modul belajar mandiri, proyek latihan, dan sertifikasi relevan). |
| **MOD-03** | **Cognitive Mock Interview Simulator (STAR Method)** | • Simulasi wawancara adaptif multi-role (*Behavioral STAR*, *Technical*, *Motivational*) dengan bank pertanyaan terkurasi untuk 7 peran multidisiplin.<br>• Pewawancara AI mengajukan pertanyaan bertahap secara dinamis berdasarkan jawaban sebelumnya (*follow-up probe*).<br>• Evaluasi pasca-sesi berbasis refleksi kognitif: Menilai struktur logika (Situation, Task, Action, Result), kedalaman penalaran, dan area yang belum terjawab secara tuntas.<br>• Lembar refleksi diri: Pengguna menuliskan apa yang mereka pelajari sebelum membaca analisis AI. |
| **MOD-04** | **Career Opportunity & Job Matching Discovery** | • Pencocokan peluang peran kerja dan magang di berbagai sektor industri berdasarkan profil kompetensi pengguna.<br>• *Cognitive Transparency (Explainable AI)*: Menyertakan penjelasan rasional komprehensif (*"Mengapa peran ini relevan denganmu"* dan *"Tantangan yang perlu kamu antisipasi"*).<br>• Jembatan langsung lintas-modul untuk menguji kesiapan peran ke Modul Skill-Gap (MOD-02) dan Simulasi Interview (MOD-03). |

---

### 5. Arsitektur Teknis & Batasan Platform

* **Form Factor:** Progressive Web App (PWA).
  * *Mobile-First Design:* Dioptimalkan untuk navigasi smartphone mahasiswa dan desktop browser.
  * *Offline-Ready:* Dilengkapi Service Worker multi-strategy caching dan fallback page offline.
  * *Installable:* Memenuhi standar Web App Manifest maskable icons.
* **Autentikasi & Database:**
  * NextAuth.js terintegrasi dengan Google OAuth Provider dan fallback local session.
  * Prisma 6 ORM dengan SQLite lokal terenkapsulasi.
* **AI & LLM Strategy:**
  * LLM reasoning engine (Gemini 2.5 Flash) dengan instruksi persona *Socratic Career Mentor*.
  * Prompt guardrails: Dilarang keras memfabrikasi prestasi pengguna (*anti-hallucination*).
  * Heuristic fallback cerdas untuk keandalan kerja saat koneksi internet terbatas.
* **Data Privacy & Security:**
  * Sanitasi data pribadi otomatis (masking nomor telepon, NIK, dan email pribadi) sebelum analisis.
  * Seluruh proses pembuatan dan konversi PDF diproses secara privat di memori peramban (*client-side*).
  * Data draf dan riwayat simulasi tersimpan terenkapsulasi secara lokal (*local-first storage*) dengan hak hapus penuh (*right to be forgotten*).

---

### 6. Kriteria Keberhasilan & Definition of Done (DoD) — Gen-Think

Sebagai produk prototipe inovasi untuk kompetisi **Gen-Think**, kriteria selesai dinilai berdasarkan:
1. **Novelty & Alignment to Theme:** Alur interaksi jelas merepresentasikan *Human-in-the-Loop* dan *Cognitive Bridge*; bukan tiruan ChatGPT wrapper biasa.
2. **End-to-End Functional Flow:**
   * Pengguna dapat mengunggah resume -> menerima pertanyaan reflektif -> menyetujui revisi.
   * Pengguna dapat memilih target karier -> melihat gap kompetensi -> menerima roadmap belajar.
   * Pengguna dapat menjalankan 1 sesi mock interview komprehensif dengan umpan balik kognitif berbasis STAR.
3. **Usability & UX Polish:** Antarmuka responsif PWA yang bersih, cepat, intuitif, dan tidak membingungkan pengguna pemula.
4. **Demonstrable Prototype:** Siap digunakan secara interaktif dalam sesi presentasi dan pengujian juri/evaluator.

---

### 7. Pertanyaan Terbuka & Batasan untuk Fase Selanjutnya (Out of Scope / P1)

* **Out of Scope (P1/P2 - Tidak masuk MVP):**
  * Integrasi otomatis *scraping live jobs* langsung dari LinkedIn/Jobstreet API (fase MVP menggunakan database taksonomi kurasi lowongan standar).
  * Simulasi wawancara berbasis video avatar 3D real-time (fase awal berbasis audio/teks reflektif berlatensi rendah).
  * Fitur jejaring sosial atau mentoring manusia berbayar.
* **Pertanyaan Desain Terbuka:**
  * Arah estetika visual dan palet warna (akan disepakati secara interaktif pada tahap `Design.md`).
