# Skenario Pengujian & Panduan Demonstrasi Juri Gen-Think
## CAREERSTUDENT AI — Adaptive Career Co-Pilot

Dokumen ini memandu alur demonstrasi interaktif selama penjurian kompetisi Gen-Think (EdTech / Career Readiness Track), memperlihatkan keunggulan filosofi **Human-in-the-Loop (HITL)**, **Anti-Ghostwriting**, **Socratic Questioning**, dan **PWA Offline Resilience**.

---

### Skenario Persona Pengguna: Mahasiswa / Fresh Graduate
- **Status:** Mahasiswa Tingkat Akhir / Fresh Graduate (bisa login dengan akunmu sendiri via Email OTP / Google).
- **Target Karier:** Junior Product Manager (atau pilih Data Analyst / Frontend Developer).
- **Kondisi Awal:** Memiliki draf CV yang pasif ("Membantu menyusun dokumen PRD", "Ikut mengelola sprint"), belum tahu kesenjangan kompetensi nyata terhadap industri, dan gugup menghadapi wawancara STAR.

---

### Alur Demo Step-by-Step (Durasi: 5 Menit)

#### 1. Pembukaan & Dashboard Hub (Durasi: 45 detik)
- **Tampilan:** Buka halaman utama `https://career-student-ai.vercel.app` (atau `http://localhost:3000` di lingkungan lokal).
- **Narasi Juri:**
  > *"CareerStudent AI bukan AI generator jawaban instan (anti-ghostwriting). Kami membangun 'Co-Pilot Kognitif' yang memandu mahasiswa berpikir kritis dan merefleksikan pencapaian riil mereka melalui 4 pilar."*
- **Poin Kunci:**
  - Desain Modern Clean (Deep Navy & Electric Indigo).
  - Indikator filosofi: Anti-Ghostwriting, Explicit Approval Gate, PWA Offline Ready.
  - Akun terverifikasi dengan autentikasi aman Email OTP.

#### 2. MOD-01: Interactive CV Analyzer & Reflective Optimizer (Durasi: 90 detik)
- **Aksi Demo:**
  1. Klik tab **"CV Optimizer"** (atau kartu MOD-01 di Beranda).
  2. Klik tombol **"Gunakan Contoh CV Mahasiswa"** untuk instant demo tanpa perlu upload file manual.
  3. Klik salah satu butir pengalaman kerja yang pasif, misalnya: *"Membantu menyusun dokumen PRD dan user story untuk aplikasi mobile kampus"*.
  4. Tunjukkan panel kanan **Socratic Critique**:
     - AI tidak langsung menulis ulang, tetapi bertanya: *"Berapa banyak pengguna aplikasi tersebut? Apa metrik keberhasilan yang kamu ukur?"*
  5. Isi refleksi pengguna pada textarea:
     > *"Aplikasi dipakai 1.200 mahasiswa aktif, metrik keberhasilan retensi naik 25% dalam 2 bulan."*
  6. Klik tombol **"Formulasikan Kalimat Berbobot"**.
  7. **Approval Gate Modal Muncul:**
     - AI menampilkan usulan kalimat berbasis formula STAR + metrik nyata pengguna.
     - Tunjukkan 3 tombol kepatuhan HITL: `[Setujui & Terapkan]`, `[Edit Manual]`, `[Tolak]`.
     - Klik `[Setujui & Terapkan]`. Poin di resume berubah seketika dan skor ATS terhitung transparan.

#### 3. MOD-02: Skill-Gap Analysis & Actionable Roadmap (Durasi: 60 detik)
- **Aksi Demo:**
  1. Klik tab **"Skill Gap"**.
  2. Pilih role target: **"Junior Product Manager"**.
  3. Tunjukkan **Matriks Kompetensi Evidence-Based**:
     - 🟢 *Strong Match*: Keterampilan yang terbukti ada di CV (User Stories, Prioritization).
     - 🟡 *Partial*: Keterampilan yang baru tersirat.
     - 🔴 *Critical Gap*: Keterampilan industri krusial yang belum terdeteksi (misal: Product Analytics / SQL).
  4. Tunjukkan formula kalkulasi transparan di header (Zero Fake Metrics).
  5. Buka tab **"Roadmap Belajar 4 Minggu"**:
     - Tunjukkan tugas mingguan terarah.
     - Demonstrasikan interaktivitas: centang checkbox tugas, sesuaikan slider alokasi jam belajar mingguan.
     - Klik tombol **"Setujui Roadmap Mingguan"** (Approval Gate).

#### 4. MOD-03: Cognitive Mock Interview Simulator (Durasi: 60 detik)
- **Aksi Demo:**
  1. Klik tab **"Interview"**.
  2. Pilih tipe: **"Behavioral (STAR)"**, lalu klik **"Mulai Sesi Wawancara"**.
  3. AI mengajukan pertanyaan pembuka STAR situasional.
  4. Ketik jawaban kontekstual lalu kirim.
  5. Tunjukkan bahwa pertanyaan kedua adalah **Dynamic Follow-Up Probe** adaptif yang menggali detail metodologi dari jawaban pertama.
  6. Setelah sesi selesai, tunjukkan fitur paling krusial:
     - **Mandatory Self-Reflection Sheet 🔒:** Evaluasi AI TERKUNCI.
     - Mahasiswa WAJIB menuliskan refleksi performanya sendiri terlebih dahulu.
  7. Tulis refleksi mandiri singkat, lalu klik tombol **"Kirim Refleksi & Buka Evaluasi AI"**.
  8. Evaluasi AI terbuka: Breakdown skor 4 dimensi STAR (Situation, Task, Action, Result), perbandingan dengan refleksi mandiri, dan wawasan kognitif.

#### 5. MOD-04: Career Opportunity Discovery & Explainable AI (Durasi: 45 detik)
- **Aksi Demo:**
  1. Klik tab **"Peluang"**.
  2. Tunjukkan kartu lowongan kerja terkurasi (APM, Junior PO, Data Analyst, dll.).
  3. Buka detail salah satu kartu untuk memperlihatkan **Explainable AI Matching**:
     - Breakdown formula kecocokan transparan (bukan sekadar persentase acak).
     - Bagian *"Mengapa Relevan"* dan *"Tantangan yang Perlu Diantisipasi"*.
  4. Klik tombol **"Petakan Skill Gap untuk Peran Ini"** — aplikasi secara mulus mengarahkan pengguna kembali ke modul Skill Gap dengan peran baru terpilih.

#### 6. Demonstrasi PWA Offline (Durasi: 20 detik)
- **Aksi Demo:**
  1. Buka Chrome DevTools -> tab Network -> centang opsi **"Offline"**.
  2. Perhatikan **Offline Banner** kuning muncul otomatis di bagian atas aplikasi.
  3. Navigasikan antar tab (Beranda, Skill Gap, CV) — aplikasi tetap berjalan mulus menggunakan Cache-First & localStorage offline sync.
  4. Refresh halaman — Service Worker tetap melayani halaman dari App Shell cache atau menampilkan fallback `offline.html`.

---

### Rangkuman Kepatuhan Kriteria Kompetisi Gen-Think

| Kriteria Penilaian | Implementasi di CareerStudent AI |
|:---|:---|
| **Human-in-the-Loop** | Socratic Questioning Engine, Approval Gate sebelum teks CV diubah, Mandatory Self-Reflection sebelum skor wawancara dibuka. |
| **Anti-Ghostwriting** | AI menolak mengarang data; hanya memadukan teks asli dengan jawaban refleksi riil pengguna. |
| **Zero Fake Metrics** | ATS score & Match percentage dilengkapi formula matematika transparan yang dapat diverifikasi pengguna. |
| **Kesiapan Teknis** | Next.js 16 App Router, Prisma ORM, 100% TypeScript compile-clean, Service Worker PWA mandiri. |
| **Inklusivitas & UX** | WCAG AA contrast ratio, touch targets $\ge 44\text{px}$, responsive mobile-first. |
