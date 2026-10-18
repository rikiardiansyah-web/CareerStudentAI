// =============================================================================
// Dataset Peluang Karier Terkurasi — Career Opportunity Dataset
// Setiap role disertai: kualifikasi, alasan relevansi, dan tantangan riil
// =============================================================================

export interface CareerOpportunity {
  id: string;
  roleTitle: string;
  company: string;
  companyType: string; // e.g. "Startup Edtech", "Corporate Bank", "Konsultan"
  location: string;
  workMode: "Remote" | "Hybrid" | "Onsite";
  salaryRange: string; // Rentang gaji transparan
  requiredSkills: string[];
  niceToHaveSkills: string[];
  roleDescription: string;
  whyRelevant: string; // Explainable AI: alasan kecocokan
  challengesToFace: string; // Tantangan riil yang perlu diantisipasi
  growthPath: string; // Jalur karier dari posisi ini
  linkedSkillGapRoleId: string; // ID role di taxonomy untuk bridge ke MOD-02
}

// Dataset kurasi — bukan scraping, ini role-role relevan untuk persona mahasiswa
export const careerOpportunities: CareerOpportunity[] = [
  // ─── Product Management ───────────────────────────────────────────────
  {
    id: "opp_pm_01",
    roleTitle: "Associate Product Manager",
    company: "Startup Edtech Skala Nasional",
    companyType: "Startup Edtech",
    location: "Jakarta, Indonesia",
    workMode: "Hybrid",
    salaryRange: "Rp 6–10 juta/bulan",
    requiredSkills: [
      "Product Roadmap",
      "User Story Writing",
      "Prioritization Framework",
      "Data-Driven Decision",
      "Stakeholder Communication",
    ],
    niceToHaveSkills: ["SQL Dasar", "Figma", "A/B Testing"],
    roleDescription:
      "Mengelola lifecycle fitur produk edukasi dari ideasi hingga delivery, bekerja langsung dengan tim engineering dan desain untuk meningkatkan engagement pelajar.",
    whyRelevant:
      "Pengalaman organisasi dan koordinasi tim kampus yang kamu miliki merupakan fondasi kuat untuk komunikasi lintas-fungsi di Product Management.",
    challengesToFace:
      "Harus terbiasa membuat keputusan berbasis data (bukan opini), dan menghadapi trade-off antara keinginan stakeholder vs. kebutuhan pengguna nyata.",
    growthPath:
      "Associate PM → Product Manager → Senior PM → Head of Product (3–5 tahun tergantung startup stage).",
    linkedSkillGapRoleId: "pm_jr",
  },
  {
    id: "opp_pm_02",
    roleTitle: "Junior Product Owner",
    company: "Perusahaan SaaS B2B",
    companyType: "SaaS Scale-up",
    location: "Bandung, Indonesia",
    workMode: "Remote",
    salaryRange: "Rp 5–8 juta/bulan",
    requiredSkills: [
      "Agile/Scrum",
      "Backlog Management",
      "User Story Writing",
      "Stakeholder Communication",
      "Wireframing",
    ],
    niceToHaveSkills: ["JIRA/Linear", "Product Analytics", "SQL"],
    roleDescription:
      "Bertanggung jawab atas product backlog dan sprint planning untuk modul SaaS HR. Berkolaborasi erat dengan Scrum Master dan QA.",
    whyRelevant:
      "Kemampuan menulis dokumen terstruktur dan pengalaman memimpin tim proyek kampus menunjukkan readiness untuk mengelola backlog produk.",
    challengesToFace:
      "Kecepatan iterasi di SaaS sangat tinggi — harus nyaman dengan perubahan prioritas mingguan dan feedback loop cepat dari pelanggan B2B.",
    growthPath:
      "Junior PO → Product Owner → Senior PO / PM → Director of Product.",
    linkedSkillGapRoleId: "pm_jr",
  },

  // ─── Data Analysis ────────────────────────────────────────────────────
  {
    id: "opp_da_01",
    roleTitle: "Junior Data Analyst",
    company: "E-commerce Unicorn",
    companyType: "E-commerce",
    location: "Jakarta, Indonesia",
    workMode: "Hybrid",
    salaryRange: "Rp 7–12 juta/bulan",
    requiredSkills: [
      "SQL",
      "Python/Pandas",
      "Data Visualization",
      "Excel/Spreadsheet Advanced",
      "Statistical Analysis",
    ],
    niceToHaveSkills: ["Tableau/Looker", "BigQuery", "A/B Testing Analysis"],
    roleDescription:
      "Menganalisis perilaku pengguna marketplace, membuat dashboard monitoring KPI, dan menyajikan insight actionable untuk tim Growth dan Marketing.",
    whyRelevant:
      "Latar belakang analitik dan kemampuan mengolah data kuantitatif dari proyek kampus dapat langsung diaplikasikan ke analisis metrik bisnis e-commerce.",
    challengesToFace:
      "Volume data sangat besar (jutaan transaksi/hari) — perlu keterampilan query optimization dan kemampuan menyederhanakan insight untuk audiens non-teknis.",
    growthPath:
      "Junior Analyst → Data Analyst → Senior Analyst → Data Analytics Manager / Data Scientist.",
    linkedSkillGapRoleId: "data_analyst_jr",
  },
  {
    id: "opp_da_02",
    roleTitle: "Business Intelligence Analyst",
    company: "Fintech Lending",
    companyType: "Fintech",
    location: "Jakarta, Indonesia",
    workMode: "Onsite",
    salaryRange: "Rp 8–14 juta/bulan",
    requiredSkills: [
      "SQL",
      "Data Visualization",
      "Dashboard Design",
      "Excel/Spreadsheet Advanced",
      "Business Acumen",
    ],
    niceToHaveSkills: ["Metabase/Superset", "Python", "Risk Modeling Basics"],
    roleDescription:
      "Membangun dan memelihara dashboard bisnis untuk monitoring portfolio kredit, analisis risiko debitur, dan reporting ke regulator OJK.",
    whyRelevant:
      "Kemampuan membuat visualisasi data dan presentasi analitik yang terstruktur menjadi dasar kuat untuk peran BI di industri keuangan.",
    challengesToFace:
      "Industri fintech heavily regulated — harus memahami konteks regulasi keuangan dan menjaga akurasi data untuk keperluan audit.",
    growthPath:
      "BI Analyst → Senior BI → BI Lead → Head of Data / Chief Data Officer.",
    linkedSkillGapRoleId: "data_analyst_jr",
  },

  // ─── Frontend Development ─────────────────────────────────────────────
  {
    id: "opp_fe_01",
    roleTitle: "Junior Frontend Developer",
    company: "Digital Agency",
    companyType: "Digital Agency",
    location: "Yogyakarta, Indonesia",
    workMode: "Hybrid",
    salaryRange: "Rp 5–9 juta/bulan",
    requiredSkills: [
      "React/Next.js",
      "TypeScript",
      "HTML/CSS Semantik",
      "Responsive Design",
      "Git/Version Control",
    ],
    niceToHaveSkills: ["Tailwind CSS", "Testing (Jest/Cypress)", "Figma to Code"],
    roleDescription:
      "Mengembangkan antarmuka web interaktif untuk berbagai klien (dari landing page hingga dashboard internal), dengan fokus pada performa dan aksesibilitas.",
    whyRelevant:
      "Proyek portofolio web dan pemahaman React/TypeScript yang kamu bangun menjadi modal langsung untuk kontribusi teknis di klien-klien agency.",
    challengesToFace:
      "Multi-project environment — harus cepat beradaptasi dengan tech stack dan design system berbeda setiap proyek baru.",
    growthPath:
      "Junior FE → Mid FE → Senior FE → Tech Lead / Frontend Architect.",
    linkedSkillGapRoleId: "frontend_jr",
  },
  {
    id: "opp_fe_02",
    roleTitle: "Frontend Engineer",
    company: "Healthtech Startup",
    companyType: "Healthtech Startup",
    location: "Remote (Indonesia)",
    workMode: "Remote",
    salaryRange: "Rp 8–15 juta/bulan",
    requiredSkills: [
      "React/Next.js",
      "TypeScript",
      "State Management",
      "API Integration",
      "Performance Optimization",
    ],
    niceToHaveSkills: ["PWA", "Accessibility (WCAG)", "WebSocket"],
    roleDescription:
      "Membangun platform telemedicine dan electronic medical records (EMR) yang digunakan oleh ribuan tenaga medis dan pasien. Fokus pada UX yang intuitif dan performa cepat.",
    whyRelevant:
      "Pengalaman PWA dan performa React yang kamu kembangkan sangat relevan dengan kebutuhan healthtech yang mengutamakan reliability dan offline access.",
    challengesToFace:
      "Data kesehatan sensitif — harus paham tentang keamanan data (HIPAA-like), dan testing yang lebih ketat karena dampak langsung ke pengguna medis.",
    growthPath:
      "FE Engineer → Senior FE → Staff Engineer → VP Engineering (di startup early-stage).",
    linkedSkillGapRoleId: "frontend_jr",
  },

  // ─── Bisnis & Manajemen SDM ──────────────────────────────────────────
  {
    id: "opp_mt_01",
    roleTitle: "Management Trainee (Operations)",
    company: "FMCG Multinasional Terkemuka",
    companyType: "Fast Moving Consumer Goods (FMCG)",
    location: "Surabaya / Jakarta",
    workMode: "Onsite",
    salaryRange: "Rp 8–13 juta/bulan",
    requiredSkills: [
      "Kepemimpinan Tim",
      "Problem Solving (5-Whys)",
      "Analisis P&L Dasar",
      "Koordinasi Proyek",
      "Presentasi Eksekutif",
    ],
    niceToHaveSkills: ["Excel Tingkat Lanjut", "Manajemen Inventaris", "Bahasa Inggris Fasih"],
    roleDescription:
      "Rotasi intensif selama 12 bulan di berbagai departemen operasional pabrik dan distribusi logistik untuk dipersiapkan menjadi calon pimpinan cabang.",
    whyRelevant:
      "Pengalaman memimpin kepanitiaan dan inisiatif organisasi kampus membuktikan kesiapanmu memimpin tim lini depan operasional.",
    challengesToFace:
      "Lingkungan operasional lapangan yang dinamis menuntut ketahanan mental tinggi dan pengambilan keputusan cepat saat terjadi kendala supply chain.",
    growthPath:
      "Management Trainee → Operations Supervisor → Branch Manager → VP of Operations.",
    linkedSkillGapRoleId: "management_trainee",
  },
  {
    id: "opp_hr_01",
    roleTitle: "People & Culture (HR) Associate",
    company: "Tech Unicorn & Financial Services",
    companyType: "Teknologi Finansial",
    location: "Jakarta, Indonesia",
    workMode: "Hybrid",
    salaryRange: "Rp 6–9 juta/bulan",
    requiredSkills: [
      "Talent Sourcing",
      "Initial Screening",
      "Employee Engagement",
      "Komunikasi Interpersonal",
      "Administrasi Personalia",
    ],
    niceToHaveSkills: ["LinkedIn Recruiter", "UU Ketenagakerjaan", "Desain Program Onboarding"],
    roleDescription:
      "Membantu proses akuisisi talenta muda, mengoordinasikan onboarding karyawan baru, serta merancang inisiatif employee engagement berkala.",
    whyRelevant:
      "Kemampuan komunikasi empati dan kepengurusan bidang humas/SDM di organisasi mahasiswa menjadi bekal langsung untuk peran People & Culture.",
    challengesToFace:
      "Menyeimbangkan target rekrutmen cepat dengan kesesuaian budaya kerja serta menjaga kerahasiaan data sensitif karyawan.",
    growthPath:
      "HR Associate → Talent Acquisition Specialist / HR Generalist → HR Business Partner (HRBP) → Head of People.",
    linkedSkillGapRoleId: "hr_generalist",
  },

  // ─── Pemasaran & Media Kreatif ────────────────────────────────────────
  {
    id: "opp_dm_01",
    roleTitle: "Digital Marketing Specialist",
    company: "Brand D2C & Retail Lifestyle",
    companyType: "Retail Consumer Brand",
    location: "Jakarta Selatan",
    workMode: "Hybrid",
    salaryRange: "Rp 6–10 juta/bulan",
    requiredSkills: [
      "Copywriting Persuasif",
      "Paid Ads (Meta / TikTok Ads)",
      "Google Analytics 4",
      "Perencanaan Kalender Konten",
      "Riset Tren Media Sosial",
    ],
    niceToHaveSkills: ["Canva / Figma Dasar", "Kreator Konten TikTok", "Email Marketing Mailchimp"],
    roleDescription:
      "Merancang dan mengeksekusi strategi iklan berbayar (paid ads) dan kampanye konten viral di TikTok/Instagram untuk meningkatkan penjualan produk lifestyle.",
    whyRelevant:
      "Kreativitas membuat materi publikasi acara kampus dan pemahaman psikologi audiens muda sangat selaras dengan kebutuhan brand D2C.",
    challengesToFace:
      "Algoritma media sosial dan biaya iklan per klik (CPA) berubah sangat cepat — dibutuhkan kedisiplinan membaca metrik analitik setiap hari.",
    growthPath:
      "Digital Marketing Specialist → Performance Marketing Lead → Marketing Manager → Chief Marketing Officer (CMO).",
    linkedSkillGapRoleId: "digital_marketing",
  },

  // ─── Keuangan & Akuntansi ─────────────────────────────────────────────
  {
    id: "opp_fa_01",
    roleTitle: "Junior Financial Analyst",
    company: "Bank Swasta Nasional Terkemuka",
    companyType: "Perbankan Komersial",
    location: "Jakarta Pusat",
    workMode: "Hybrid",
    salaryRange: "Rp 7–11 juta/bulan",
    requiredSkills: [
      "Pemodelan Keuangan Excel",
      "Analisis Rasio Keuangan",
      "Standar Akuntansi PSAK",
      "Budgeting & Forecasting",
      "Audit Trail & Ketelitian Data",
    ],
    niceToHaveSkills: ["Sertifikasi CFA Level 1 / WMI", "Power BI Dasar", "Analisis Kelayakan Kredit"],
    roleDescription:
      "Menelaah laporan keuangan calon debitur korporasi, menyusun model proyeksi arus kas, dan membuat laporan kajian risiko portofolio kredit.",
    whyRelevant:
      "Ketelitian dalam mengolah angka spreadsheet dan pemahaman prinsip akuntansi dasar menjadi modal berharga di industri perbankan.",
    challengesToFace:
      "Tingkat ketelitian harus 100% tanpa toleransi salah hitung, serta pemahaman regulasi perbankan OJK/BI yang ketat.",
    growthPath:
      "Junior Financial Analyst → Senior Credit Analyst → Relationship Manager Corporate → Head of Commercial Banking.",
    linkedSkillGapRoleId: "financial_analyst_jr",
  },
];
