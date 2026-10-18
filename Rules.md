# Project Rules & Coding Standards (Rules.md)
## CAREERSTUDENT AI — Adaptive Career Co-Pilot

---

### 1. Prinsip Utama Filosofi Produk (Gen-Think & HITL)

1. **Human-in-the-Loop (HITL) Tanpa Kompromi:**
   - **Anti-Ghostwriting / Anti-Auto-Write:** AI dilarang keras menulis ulang atau menimpa teks resume secara sepihak. Setiap revisi harus melalui *Explicit Approval Gate* (`[Setujui & Terapkan]`, `[Edit Manual]`, `[Tolak / Minta Sudut Pandang Lain]`).
   - **Zero-Hallucination Guardrail:** AI dilarang mengarang metrik, prestasi, sertifikasi, atau pengalaman kerja yang tidak pernah diinput oleh pengguna.
   - **Mandatory Self-Reflection First:** Pada modul *Mock Interview*, skor evaluasi dan umpan balik AI **terkunci** hingga pengguna mengisi lembar refleksi diri mandiri terlebih dahulu.

---

### 2. Standar Kualitas Antarmuka & Anti-Slop (`stop-making-ui-slop`)

1. **Finish Gate Wajib Sebelum Fitur Dianggap Selesai:**
   - **Tujuan Jelas:** Fungsi setiap layar harus dapat dipahami pengguna dalam 3 detik pertama.
   - **Satu Aksi Primer:** Setiap tampilan harus memiliki 1 Call-to-Action (CTA) primer yang memimpin hierarki visual.
   - **Tidak Ada Tombol Buntu:** Setiap tombol, link, atau kartu yang dapat diklik wajib memiliki fungsi dan aksi riil (dilarang menaruh tombol hiasan/placeholder).
   - **Zero Fake Metrics:** Dilarang menampilkan angka persentase, testimoni, atau grafik buatan yang tidak bersumber dari data evaluasi nyata pengguna.
   - **Label Spesifik:** Dilarang menggunakan label generik (seperti *"Overview"*, *"Insights"*, *"Learn more"*). Gunakan terminologi kontekstual produk (misal: *"Skor Keselarasan ATS"*, *"Refleksi Diksi Aksi"*, *"Tantangan Peran"*).
2. **Penanganan 4 Status Wajib (Required States):**
   - Setiap komponen data wajib menangani:
     1. `Loading State` (menggunakan *Skeleton UI*, bukan spinner layar penuh).
     2. `Empty State` (dilengkapi panduan aksi konkret untuk memulai).
     3. `Error State` (pesan kesalahan yang jelas disertai tombol coba lagi).
     4. `Offline State` (penanda visual bahwa data tersimpan di perangkat lokal).

---

### 3. Standar Aksesibilitas & UI/UX (`ui-ux-pro-max-design-intelligence`)

1. **Aksesibilitas (WCAG AA):**
   - **Kontras Teks:** Rasio kontras minimal $4.5:1$ untuk teks normal dan $3:1$ untuk teks besar/elemen antarmuka terhadap latar belakang.
   - **Touch Target Size:** Setiap elemen interaktif (tombol, input, link, navigasi bawah) memiliki ukuran area sentuh minimal $44 \times 44\text{px}$.
   - **Focus State:** Elemen interaktif wajib menampilkan *focus ring* yang jelas saat dinavigasi menggunakan keyboard.
   - **Semantik HTML:** Form wajib menggunakan `<label>` dengan atribut `htmlFor`. Tombol hanya-ikon wajib memiliki `aria-label`.
2. **Ikonografi & Visual:**
   - **No Emoji Icons:** Dilarang menggunakan emoji (seperti 🎨, 🚀, ⚙️) sebagai ikon antarmuka utama. Gunakan pustaka SVG seragam (**Lucide React**).
   - **Ukuran Ikon Konsisten:** Gunakan `w-5 h-5` atau `w-6 h-6` dengan `strokeWidth={2}`.
3. **Interaksi & Animasi Mikro:**
   - **Durasi Mikro:** Transisi antarmuka berkisar antara $150\text{ms} - 300\text{ms}$.
   - **Performa Transform:** Gunakan transisi `opacity` dan `transform` (GPU-accelerated), hindari menganimasikan properti layout (`width`, `height`, `padding`) yang memicu *layout shift*.
   - **Cursor Pointer:** Tambahkan `cursor-pointer` pada seluruh kartu atau elemen yang dapat diklik.

---

### 4. Standar Performa React & Next.js (`vercel-react-best-practices`)

1. **Eliminasi Waterfall Requests (`async-`):**
   - Dilarang menjalankan request independen secara sekuensial. Gunakan `Promise.all()` untuk pengambilan data paralel:
     ```typescript
     // ✅ BENAR: Paralel
     const [resumeData, targetTaxonomy] = await Promise.all([
       getResume(resumeId),
       getSkillTaxonomy(roleId)
     ]);
     ```
   - Manfaatkan React Suspense boundaries untuk *streaming* konten bertahap pada halaman dashboard.
2. **Optimasi Ukuran Bundle (`bundle-`):**
   - **Hindari Barrel Imports:** Lakukan import ikon atau komponen secara langsung dari subpath, jangan memuat file barrel besar yang menghambat *tree-shaking*:
     ```typescript
     // ❌ HINDARI:
     // import { Check, AlertCircle } from 'lucide-react';
     // ✅ BENAR:
     import Check from 'lucide-react/dist/esm/icons/check';
     import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
     ```
   - **Dynamic Imports:** Gunakan `next/dynamic` dengan `{ ssr: false }` untuk modul berat yang hanya dibutuhkan di client-side (seperti viewer PDF, modul speech-to-text, atau visualisasi radar chart).
3. **Server-Side Performance & Minimal Serialization (`server-`):**
   - Hanya kirimkan data yang benar-benar ditampilkan ke Client Components. Hindari mengirim seluruh objek database Prisma yang mengandung metadata tidak relevan.
4. **Optimasi Render & JavaScript (`rerender-` & `js-`):**
   - Gunakan *functional setState* (`setCount(prev => prev + 1)`) untuk menjaga stabilitas *callback* tanpa ketergantungan berlebih.
   - Hindari alokasi array/objek baru di dalam render props yang menyebabkan re-render anak yang tidak perlu.
   - Gunakan `Set` atau `Map` untuk pencarian $O(1)$ pada pencocokan taksonomi keterampilan (hindari `Array.find` berulang dalam loop besar).

---

### 5. Standar PWA & Offline Resilience (`progressive-web-apps-pwas`)

1. **Service Worker Lifecycle & Cache Versioning:**
   - Selalu perbarui `CACHE_VERSION` (misal: `careerstudent-v1`) saat merilis perubahan aset statis.
   - Strategi Caching:
     - **Cache-First:** Untuk font, ikon SVG, dan aset CSS/JS statis yang memiliki hash.
     - **Network-First:** Untuk navigasi rute halaman (`text/html`), dengan fallback wajib ke `/offline.html`.
     - **Stale-While-Revalidate:** Untuk taksonomi keterampilan industri dan data referensi publik.
2. **PWA Manifest Standar:**
   - File `public/manifest.json` wajib memiliki atribut: `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `orientation: "portrait-primary"`, dan ikon maskable $192 \times 192\text{px}$ serta $512 \times 512\text{px}$.
3. **Penyelamatan Data Lokal (Local Draft Auto-Save):**
   - Setiap perubahan draf pada formulir refleksi atau suntingan CV otomatis dicadangkan ke IndexedDB / LocalStorage setiap 2 detik.
   - Banner indikator koneksi (`useNetworkStatus`) wajib tampil saat koneksi offline untuk memberi ketenangan pada pengguna bahwa pekerjaan mereka aman.

---

### 6. Konvensi Kode & Struktur File (Codebase Standards)

1. **Bahasa & Typing:**
   - Wajib menggunakan **TypeScript** dengan mode *strict* (`strict: true` di `tsconfig.json`).
   - Dilarang menggunakan tipe `any` tanpa pengecualian kuat yang terdokumentasi.
2. **Struktur Direktori:**
   ```
   src/
   ├── app/                    # Next.js App Router (Halaman & Route Handlers)
   │   ├── (auth)/             # Rute orientasi persona & onboarding
   │   ├── (dashboard)/        # Rute utama dashboard & modul fitur
   │   ├── api/                # API Route Handlers
   │   └── offline/            # Halaman fallback offline Next.js
   ├── components/             # Komponen UI modular
   │   ├── ui/                 # Primitif dasar (Button, Modal, Input, Badge)
   │   ├── socratic/           # Komponen dialog reflektif & Approval Gate
   │   ├── pwa/                # Komponen banner offline & prompt instalasi
   │   └── modules/            # Komponen khusus MOD-01 s/d MOD-04
   ├── hooks/                  # Custom React hooks (usePwaInstall, useNetworkStatus)
   ├── lib/                    # Utilitas, Prisma client, Gemini AI SDK helper
   ├── types/                  # Type definitions & API contracts
   └── data/                   # Dataset kurasi taksonomi & peran karier
   ```
3. **Penamaan Berkas:**
   - Komponen React: `PascalCase.tsx` (contoh: `ApprovalGateModal.tsx`).
   - Custom Hooks: `camelCase.ts` diawali `use` (contoh: `useNetworkStatus.ts`).
   - API Routes: `route.ts`.
   - Utility: `camelCase.ts` (contoh: `socraticPromptBuilder.ts`).
