# Design System & UI Guidelines (Design.md)
## CAREERSTUDENT AI — Adaptive Career Co-Pilot

---

### 1. Filosofi Desain & Arah Visual (Design Philosophy)

- **Style:** **Modern Clean & Tech-Forward**
- **Tema:** *Gen-Think: Bridging Human Intelligence in the Digital Era*
- **Karakter Visual:** Bersih, terpercaya, intelektual, dan presisi. Antarmuka tidak terasa seperti "mesin pembuat konten otomatis", melainkan seperti meja kerja analitis seorang mentor karier profesional.
- **Standar Eksekusi:** Menegakkan aturan **`stop-making-ui-slop`** (menolak bento grid klise, gradien acak tanpa alasan, dan metrik palsu) serta **`ui-ux-pro-max-design-intelligence`** (aksesibilitas WCAG AA, rasio kontras $\ge 4.5:1$, touch target $\ge 44\text{px}$).

---

### 2. Palet Warna (Color System)

Palet dirancang dengan kombinasi **Deep Navy & Electric Indigo** dengan aksen **Teal & Amber**, memberikan kesan cerdas, stabil, dan dinamis.

| Token | Warna | Kode HEX | Tailwind Class | Penggunaan Utama |
|:---|:---|:---:|:---|:---|
| **Primary (Brand)** | Deep Navy | `#0F172A` | `bg-slate-900` | Header, teks utama judul, sidebar desktop, status bar |
| **Accent (Cognitive)** | Electric Indigo | `#4F46E5` | `bg-indigo-600` | Tombol CTA primer, indikator fokus, highlight Sokratik |
| **Secondary (Bridge)** | Dynamic Indigo | `#6366F1` | `bg-indigo-500` | State hover, badge aktif, aksen navigasi |
| **Highlight (Growth)** | Vital Teal | `#0D9488` | `bg-teal-600` | Status kecocokan (*Strong Match*), pencapaian, progress |
| **Warning (Reflection)**| Reflective Amber| `#D97706` | `bg-amber-600` | Panel pertanyaan Sokratik, status *Partial Match* |
| **Danger (Gap)** | Crimson Coral | `#DC2626` | `bg-red-600` | Indikator *Critical Gap*, aksi penolakan draf |
| **Surface (Light)** | Pure White | `#FFFFFF` | `bg-white` | Kartu konten, modal dialog, formulir input |
| **Background (Base)** | Soft Slate | `#F8FAFC` | `bg-slate-50` | Latar belakang kanvas aplikasi |
| **Border / Divider** | Crisp Slate | `#E2E8F0` | `border-slate-200`| Pembatas kartu, garis tabel, pemisah navigasi |
| **Text Primary** | Midnight Charcoal| `#0F172A`| `text-slate-900` | Teks bacaan utama, heading (kontras $13.5:1$) |
| **Text Muted** | Slate Gray | `#475569` | `text-slate-600` | Teks pendukung, label input, caption (kontras $6.2:1$) |

#### Standar Kontras Aksesibilitas (WCAG AA):
- Teks `text-slate-900` di atas `bg-white` / `bg-slate-50` memiliki rasio kontras $> 13:1$ (jauh melampaui standar $4.5:1$).
- Teks pendukung `text-slate-600` memiliki kontras $> 6:1$ (aman untuk keterbacaan mobile luar ruangan).

---

### 3. Tipografi (Typography Hierarchy)

Kombinasi font modern bervolume jelas untuk teks bacaan panjang dan penekanan analitis:
- **Heading & UI Display Font:** `Plus Jakarta Sans` (atau `Inter` system fallback)
- **Body & Paragraph Font:** `Inter`
- **ATS Code & Token Data:** `JetBrains Mono` (untuk potongan formula, kata kunci ATS, dan metrik)

```css
/* Skala Tipografi */
h1: text-2xl font-bold tracking-tight text-slate-900 (Desktop: text-3xl)
h2: text-xl font-semibold tracking-tight text-slate-900 (Desktop: text-2xl)
h3: text-lg font-semibold text-slate-900
body: text-base font-normal leading-relaxed text-slate-700
body-sm: text-sm font-normal leading-normal text-slate-600
caption: text-xs font-medium text-slate-500
code-pill: font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800
```

---

### 4. Layout, Spacing & Mobile-First Breakpoints

Mengikuti standar responsif dari `ui-ux-pro-max-design-intelligence`:

| Device | Viewport Width | Pola Layout | Perilaku Navigasi |
|:---|:---:|:---|:---|
| **Mobile** | $375\text{px} - 767\text{px}$ | Single column, padding `px-4 py-4` | Fixed Bottom Nav Bar ($h-16$) + Quick Action Bar |
| **Tablet** | $768\text{px} - 1023\text{px}$| 2-column grid, padding `px-6 py-6` | Collapsed Slim Sidebar |
| **Desktop** | $\ge 1024\text{px}$ | Dual-pane studio layout, max `max-w-7xl` | Fixed Left Sidebar ($w-64$) |

#### Aturan Spacing & Hit Target:
- **Touch Target:** Semua elemen interaktif memiliki `min-h-[44px] min-w-[44px]` dengan bantalan sentuh luas.
- **Floating Bar Spacing:** Navigasi atas memiliki jarak napas `top-3 left-4 right-4` untuk kenyamanan visual mobile.

---

### 5. Komponen Khas: Human-in-the-Loop & Anti-Slop Patterns

#### 5.1 Socratic Feedback Pane (MOD-01)
*Bukan kotak saran biasa, melainkan panel dialog kognitif yang memicu refleksi mandiri:*
- **Wadah (Container):** Latar belakang lembut dengan garis aksen kiri `border-l-4 border-amber-500 bg-amber-50/50 p-4 rounded-r-lg`.
- **Ikon Pemantik:** `HelpCircle` atau `BrainCircuit` dari Lucide (warna `text-amber-600`).
- **Teks Pemantik:** Teks bergaya percakapan Sokratik yang menantang ingatan pengguna (*"Berapa banyak mahasiswa yang terdampak oleh inisiatifmu ini?"*).
- **Kolom Respon Pengguna:** Textarea dengan border fokus `focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`.

#### 5.2 Explicit Approval Gate Modal / Inline Drawer
*Komponen pemutus takdir draf sebelum disimpan ke dokumen:*
```
+-------------------------------------------------------------------+
| GERBANG PERSETUJUAN EKSPLISIT                                     |
+-------------------------------------------------------------------+
| Kalimat Asli:                                                     |
| "Membantu membuat website himpunan."                              |
|                                                                   |
| Rekomendasi Formulasi (Hasil Refleksimu):                         |
| "Mengembangkan platform web himpunan berbasis Next.js yang        |
|  digunakan oleh 450+ mahasiswa aktif untuk voting pemilu kampus." |
+-------------------------------------------------------------------+
| [✓ Setujui & Terapkan]  [✎ Edit Manual]  [✕ Minta Sudut Lain]     |
+-------------------------------------------------------------------+
```
- Tombol **[Setujui & Terapkan]**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors`.
- Tombol **[Edit Manual]**: `bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-lg`.
- Tombol **[Tolak / Regenerasi]**: `text-slate-500 hover:text-red-600 text-sm font-medium px-3 py-2.5`.

#### 5.3 Matriks Kompetensi Bebas Metrik Palsu (MOD-02)
*Menggantikan diagram lingkaran atau bento grid tak bermakna:*
- **List Aksesibel Berlabel Ganda:**
  - 🟢 **Kuasai Penuh (Strong Match):** Badge hijau `bg-emerald-50 text-emerald-700 border-emerald-200` disertai bukti portofolio.
  - 🟡 **Perlu Penguatan (Partial Match):** Badge kuning `bg-amber-50 text-amber-700 border-amber-200` disertai materi pengayaan.
  - 🔴 **Kesenjangan Kritis (Critical Gap):** Badge merah `bg-red-50 text-red-700 border-red-200` disertai tautan roadmap belajar.

#### 5.4 Mandatory Self-Reflection Sheet (MOD-03)
- Formulir refleksi terbagi atas 2 kartu pertanyaan reflektif:
  1. *"Poin terkuat yang kamu sampaikan dalam argumen tadi"*
  2. *"Kelemahan atau area jawaban yang kamu rasa masih mengambang"*
- Tampilan skor AI dan analisis STAR **dalam status terkunci (blur/disabled)** hingga formulir ini disubmit pengguna.

---

### 6. PWA Visual Tokens & Asset Specifications

- **Theme Color:** `#0F172A` (warna status bar browser mobile).
- **Background Color:** `#F8FAFC`.
- **Maskable App Icons:**
  - Ukuran: $192 \times 192\text{px}$ dan $512 \times 512\text{px}$.
  - Zona Aman (*Safe Zone*): Logo utama terpusat di dalam diameter 80% tengah ikon untuk menghindari terpotongnya sudut adaptif di Android/iOS.
- **Install Banner:** Modal bawah (*bottom sheet*) yang muncul elegan: *"Tambahkan CareerStudent AI ke Layar Utama untuk akses instan & mode offline"*.

---

### 7. Checklist Finish Gate (Kriteria Verifikasi Visual)

Sebelum setiap komponen dirilis ke kode:
- [ ] Kontras teks minimum $4.5:1$ terverifikasi.
- [ ] Seluruh tombol memiliki `cursor-pointer` dan efek *active/focus state*.
- [ ] Transisi mikro halus ($150\text{ms} - 300\text{ms}$), bebas *layout shift*.
- [ ] Tidak ada emoji yang digunakan sebagai ikon antarmuka utama.
- [ ] Layar diuji dan responsif pada lebar $375\text{px}$, $768\text{px}$, dan $1280\text{px}$.
- [ ] Seluruh kartu data memiliki *Skeleton Loading* dan *Empty State*.
