export interface TaxonomySkill {
  id: string;
  name: string;
  category: "TECHNICAL" | "TOOL" | "SOFT_SKILL" | "DOMAIN_KNOWLEDGE";
  isCritical: boolean;
  description: string;
  suggestedAction: string;
}

export interface CareerRoleTaxonomy {
  id: string;
  title: string;
  industry: string;
  category: "IT_TECH" | "BUSINESS_MANAGEMENT" | "MARKETING_CREATIVE" | "FINANCE_ACCOUNTING";
  description: string;
  skills: TaxonomySkill[];
}

export const INDUSTRY_ROLES: CareerRoleTaxonomy[] = [
  // ==========================================
  // KATEGORI 1: IT & TEKNOLOGI
  // ==========================================
  {
    id: "pm_jr",
    title: "Junior Product Manager",
    industry: "Teknologi & Produk Digital",
    category: "IT_TECH",
    description: "Memimpin perumusan solusi produk, menganalisis kebutuhan pengguna, dan berkolaborasi lintas tim (engineering, design, bisnis) untuk meluncurkan fitur digital bernilai tinggi.",
    skills: [
      {
        id: "pm_prd",
        name: "Penulisan Dokumen PRD & User Stories",
        category: "TECHNICAL",
        isCritical: true,
        description: "Kemampuan merumuskan problem statement, acceptance criteria, dan requirement produk yang jelas.",
        suggestedAction: "Tulis PRD studi kasus untuk memecahkan masalah nyata di aplikasi favoritmu.",
      },
      {
        id: "pm_figma",
        name: "Wireframing & Desain Prototipe (Figma)",
        category: "TOOL",
        isCritical: false,
        description: "Mampu membuat sketsa visual alur pengguna cepat untuk komunikasi dengan desainer.",
        suggestedAction: "Pelajari pembuatan low-fidelity wireframe dan alur screen-by-screen di Figma.",
      },
      {
        id: "pm_metrics",
        name: "Analisis Metrik Produk & Data A/B Test",
        category: "TECHNICAL",
        isCritical: true,
        description: "Memahami indikator performa produk (DAU, Retention, Conversion Funnel, Churn).",
        suggestedAction: "Pelajari analisis funnel menggunakan Mixpanel, PostHog, atau Google Analytics.",
      },
      {
        id: "pm_scrum",
        name: "Metodologi Agile / Scrum & Jira",
        category: "DOMAIN_KNOWLEDGE",
        isCritical: true,
        description: "Pemahaman siklus sprint planning, backlog grooming, dan retrospective.",
        suggestedAction: "Ikuti panduan dasar Agile Scrum dan simulasikan pengelolaan backlog di Trello/Jira.",
      },
      {
        id: "pm_user_research",
        name: "Riset Kualitatif & Wawancara Pengguna",
        category: "TECHNICAL",
        isCritical: false,
        description: "Merancang panduan wawancara pengguna untuk menggali pain-points otentik.",
        suggestedAction: "Lakukan 3 wawancara teman kuliah mengenai kendala mencari beasiswa atau magang.",
      },
    ],
  },
  {
    id: "data_analyst_jr",
    title: "Junior Data Analyst",
    industry: "Sains Data & Business Intelligence",
    category: "IT_TECH",
    description: "Mengolah kumpulan data mentah menjadi wawasan bisnis yang dapat ditindaklanjuti, membangun dashboard pemantauan, dan menyajikan rekomendasi berbasis data.",
    skills: [
      {
        id: "da_sql",
        name: "SQL Relasional (PostgreSQL / MySQL)",
        category: "TECHNICAL",
        isCritical: true,
        description: "Penguasaan klausa JOIN, subquery, window functions, dan optimasi kueri analitik.",
        suggestedAction: "Latih 20 soal SQL intermediate di LeetCode atau HackerRank.",
      },
      {
        id: "da_bi",
        name: "Dashboard & Visualisasi Data (Tableau / Looker Studio)",
        category: "TOOL",
        isCritical: true,
        description: "Mampu menyusun dashboard interaktif yang intuitif bagi pengambil keputusan bisnis.",
        suggestedAction: "Buat 1 dashboard publik di Looker Studio menggunakan dataset terbuka BPS/Kaggle.",
      },
      {
        id: "da_excel",
        name: "Spreadsheet Tingkat Lanjut (Excel / Google Sheets)",
        category: "TOOL",
        isCritical: true,
        description: "XLOOKUP, Pivot Table dinamis, INDEX-MATCH, dan conditional data modeling.",
        suggestedAction: "Bangun template proyeksi keuangan atau monitoring inventaris otomatis dengan Pivot.",
      },
      {
        id: "da_stats",
        name: "Statistika Deskriptif & Inferensial",
        category: "DOMAIN_KNOWLEDGE",
        isCritical: false,
        description: "Pemahaman distribusi data, uji hipotesis (p-value), korelasi, dan regresi.",
        suggestedAction: "Pelajari cara membaca korelasi vs kausalitas dalam analisis bisnis ritel.",
      },
      {
        id: "da_storytelling",
        name: "Data Storytelling & Presentasi Insight",
        category: "SOFT_SKILL",
        isCritical: false,
        description: "Kemampuan menerjemahkan angka teknis menjadi narasi keputusan bisnis yang persuasif.",
        suggestedAction: "Tulis ringkasan 1 halaman berisi 3 rekomendasi bisnis dari dashboard data yang kamu buat.",
      },
    ],
  },
  {
    id: "frontend_jr",
    title: "Junior Frontend Engineer",
    industry: "Rekayasa Perangkat Lunak Web",
    category: "IT_TECH",
    description: "Membangun antarmuka web yang cepat, responsif, aksesibel, dan interaktif menggunakan ekosistem modern React dan TypeScript.",
    skills: [
      {
        id: "fe_ts",
        name: "TypeScript & JavaScript Modern (ES6+)",
        category: "TECHNICAL",
        isCritical: true,
        description: "Pemahaman tipe data kuat (strict typing), generics, dan asynchronous programming.",
        suggestedAction: "Refactor salah satu proyek JavaScript lamamu ke TypeScript secara strict.",
      },
      {
        id: "fe_react",
        name: "React.js & Next.js App Router",
        category: "TECHNICAL",
        isCritical: true,
        description: "Pemahaman hooks, React Server Components (RSC), SSR, dan rendering lifecycle.",
        suggestedAction: "Bangun aplikasi PWA interaktif dengan Next.js App Router dan Tailwind.",
      },
      {
        id: "fe_tailwind",
        name: "Tailwind CSS & Responsive Mobile-First Design",
        category: "TOOL",
        isCritical: true,
        description: "Mendesain layout fleksibel tanpa layout shift dan ramah sentuhan (touch targets).",
        suggestedAction: "Pelajari utilitas responsif Tailwind untuk breakpoint 375px hingga desktop.",
      },
      {
        id: "fe_a11y",
        name: "Aksesibilitas Web (WCAG AA & Semantik HTML)",
        category: "DOMAIN_KNOWLEDGE",
        isCritical: false,
        description: "Memastikan navigasi keyboard, kontras rasio 4.5:1, dan atribut ARIA yang tepat.",
        suggestedAction: "Audit proyek webmu menggunakan Lighthouse Accessibility audit.",
      },
      {
        id: "fe_git",
        name: "Version Control Git & GitHub Workflow",
        category: "TOOL",
        isCritical: true,
        description: "Percabangan git (branching), commit atomic, dan kolaborasi pull request.",
        suggestedAction: "Biasakan membuat PR mandiri dengan ringkasan perubahan yang deskriptif.",
      },
    ],
  },

  // ==========================================
  // KATEGORI 2: BISNIS, MANAJEMEN & SDM
  // ==========================================
  {
    id: "management_trainee",
    title: "Management Trainee (MT) / Operations",
    industry: "Manajemen Bisnis & Operasional",
    category: "BUSINESS_MANAGEMENT",
    description: "Program akselerasi kepemimpinan perusahaan untuk memimpin operasional cabang, mengelola efisiensi rantai pasok, dan menyelaraskan strategi bisnis antar divisi.",
    skills: [
      {
        id: "mt_leadership",
        name: "Kepemimpinan Tim & Koordinasi Proyek",
        category: "SOFT_SKILL",
        isCritical: true,
        description: "Mampu memotivasi tim, mendelegasikan tugas terukur, dan menyelesaikan konflik internal.",
        suggestedAction: "Dokumentasikan kepemimpinan organisasi kampus dengan metrik pencapaian target kerja.",
      },
      {
        id: "mt_problem_solving",
        name: "Root Cause Analysis (RCA) & Problem Solving",
        category: "TECHNICAL",
        isCritical: true,
        description: "Metodologi 5-Whys, diagram Fishbone, dan perbaikan alur kerja berkelanjutan (Kaizen).",
        suggestedAction: "Buat analisis 5-Whys terhadap salah satu kendala operasional kepanitiaan masa lalu.",
      },
      {
        id: "mt_business_acumen",
        name: "Pemahaman Laporan Keuangan & P&L Dasar",
        category: "DOMAIN_KNOWLEDGE",
        isCritical: true,
        description: "Memahami struktur pendapatan, biaya modal (Capex), biaya operasional (Opex), dan margin laba.",
        suggestedAction: "Pelajari cara membaca laporan laba rugi perusahaan publik di IDX.",
      },
      {
        id: "mt_presentation",
        name: "Presentasi Eksekutif & Stakeholder Management",
        category: "SOFT_SKILL",
        isCritical: false,
        description: "Kemampuan menyusun deck presentasi ringkas dan lugas bagi jajaran pimpinan.",
        suggestedAction: "Buat ringkasan 5 slide proposal inisiatif efisiensi biaya untuk organisasi/unit bisnismu.",
      },
    ],
  },
  {
    id: "hr_generalist",
    title: "Junior Human Resources (HR) Specialist",
    industry: "Manajemen Sumber Daya Manusia (SDM)",
    category: "BUSINESS_MANAGEMENT",
    description: "Mengelola siklus hidup karyawan mulai dari rekrutmen talenta, onboarding, administrasi kepersonaliaan, evaluasi kinerja, hingga employee engagement.",
    skills: [
      {
        id: "hr_recruitment",
        name: "End-to-End Talent Sourcing & Screening",
        category: "TECHNICAL",
        isCritical: true,
        description: "Mampu menyaring CV berdasarkan kualifikasi peran, boolean search di LinkedIn, dan initial interview.",
        suggestedAction: "Latih penyusunan rubrik penilaian kandidat berdasarkan metode STAR.",
      },
      {
        id: "hr_labor_law",
        name: "Pemahaman UU Ketenagakerjaan & BPJS",
        category: "DOMAIN_KNOWLEDGE",
        isCritical: true,
        description: "Regulasi kontrak kerja (PKWT/PKWTT), upah minimum, cuti, dan jaminan ketenagakerjaan.",
        suggestedAction: "Pelajari hak dan kewajiban dasar pekerja kontrak di UU Cipta Kerja.",
      },
      {
        id: "hr_engagement",
        name: "Employee Engagement & Onboarding Program",
        category: "TECHNICAL",
        isCritical: false,
        description: "Merancang program orientasi karyawan baru dan kegiatan retensi budaya perusahaan.",
        suggestedAction: "Rancang silabus 30-60-90 hari rencana onboarding untuk staf magang baru.",
      },
      {
        id: "hr_communication",
        name: "Komunikasi Interpersonal & Mediasi Konflik",
        category: "SOFT_SKILL",
        isCritical: true,
        description: "Mendengarkan aktif, empati profesional, dan kerahasiaan data karyawan.",
        suggestedAction: "Terapkan teknik non-violent communication dalam koordinasi divisi tim.",
      },
    ],
  },

  // ==========================================
  // KATEGORI 3: MARKETING, KOMUNIKASI & KREATIF
  // ==========================================
  {
    id: "digital_marketing",
    title: "Digital Marketing Specialist",
    industry: "Pemasaran Digital & Media Komunikasi",
    category: "MARKETING_CREATIVE",
    description: "Merancang dan mengeksekusi kampanye pemasaran digital lintas kanal (SEO, SEM, Meta Ads, Email Marketing) untuk mendorong brand awareness dan konversi penjualan.",
    skills: [
      {
        id: "dm_copywriting",
        name: "Copywriting & Storytelling Komersial",
        category: "TECHNICAL",
        isCritical: true,
        description: "Menulis copy promosi persuasif menggunakan formula AIDA (Attention, Interest, Desire, Action).",
        suggestedAction: "Tulis 3 variasi headline promosi produk lokal dengan sudut pandang emosional vs rasional.",
      },
      {
        id: "dm_meta_ads",
        name: "Paid Ads Management (Meta Ads / Google Ads)",
        category: "TOOL",
        isCritical: true,
        description: "Pengaturan targeting audiens, A/B testing materi kreatif, dan perhitungan ROAS / CPA.",
        suggestedAction: "Pelajari cara kerja pixel tracking dan funnel kampanye retargeting di Meta Ads Manager.",
      },
      {
        id: "dm_analytics",
        name: "Google Analytics 4 (GA4) & Analisis Konversi",
        category: "TOOL",
        isCritical: true,
        description: "Melacak alur traffic website, bounce rate, dan conversion event.",
        suggestedAction: "Selesaikan kursus sertifikasi gratis Google Analytics 4 di Google Skillshop.",
      },
      {
        id: "dm_social_media",
        name: "Perencanaan Kalender Konten & Tren Media Sosial",
        category: "TECHNICAL",
        isCritical: false,
        description: "Riset tren TikTok/Instagram Reels dan konsistensi penjadwalan konten edukatif/promosi.",
        suggestedAction: "Susun kalender konten 1 bulan (12 postingan) lengkap dengan hook dan CTA.",
      },
    ],
  },

  // ==========================================
  // KATEGORI 4: KEUANGAN, AKUNTANSI & PERBANKAN
  // ==========================================
  {
    id: "financial_analyst_jr",
    title: "Junior Financial Analyst / Staff Keuangan",
    industry: "Keuangan, Perbankan & Investasi",
    category: "FINANCE_ACCOUNTING",
    description: "Menganalisis kinerja keuangan, menyusun model peramalan anggaran (budgeting & forecasting), evaluasi kelayakan investasi proyek, dan pelaporan keuangan berkala.",
    skills: [
      {
        id: "fa_modeling",
        name: "Pemodelan Keuangan di Excel (Financial Modeling)",
        category: "TECHNICAL",
        isCritical: true,
        description: "Membangun proyeksi 3-Statement Model (Laba Rugi, Neraca, Arus Kas) menggunakan formula dinamis.",
        suggestedAction: "Bangun model peramalan arus kas sederhana untuk UMKM menggunakan formula NPV & IRR.",
      },
      {
        id: "fa_ratio",
        name: "Analisis Rasio Keuangan & Evaluasi Kinerja",
        category: "DOMAIN_KNOWLEDGE",
        isCritical: true,
        description: "Menilai likuiditas (Current Ratio), profitabilitas (ROE, ROA), dan solvabilitas (Debt-to-Equity).",
        suggestedAction: "Bandingkan rasio profitabilitas dua bank besar di Indonesia dari laporan tahunan resmi.",
      },
      {
        id: "fa_accounting",
        name: "Standar Akuntansi Keuangan (PSAK / IFRS)",
        category: "DOMAIN_KNOWLEDGE",
        isCritical: true,
        description: "Prinsip pencatatan akrual, pengakuan pendapatan, dan rekonsiliasi akun neraca.",
        suggestedAction: "Latih pencatatan jurnal penyesuaian dan pembuatan neraca lajur di Excel.",
      },
      {
        id: "fa_attention_to_detail",
        name: "Ketelitian Data & Audit Trail Rekonsiliasi",
        category: "SOFT_SKILL",
        isCritical: false,
        description: "Kemampuan memverifikasi bukti transaksi tanpa selisih dan dokumentasi rapi.",
        suggestedAction: "Biasakan menyusun sheet rekonsiliasi dengan validasi angka otomatis (checksum balance).",
      },
    ],
  },
];
