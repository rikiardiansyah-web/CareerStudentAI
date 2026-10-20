import { ParsedSection } from "@/lib/resumeParser";

export interface CvTemplatePreset {
  id: string;
  name: string;
  roleTitle: string;
  style: "modern" | "classic";
  description: string;
  persona: {
    name: string;
    targetRoleTitle: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  sections: ParsedSection[];
}

export const CV_TEMPLATE_PRESETS: CvTemplatePreset[] = [
  {
    id: "executive_modern",
    name: "Executive Modern Layout (Marketing & Growth)",
    roleTitle: "Marketing Manager",
    style: "modern",
    description: "Layout eksekutif modern dengan header beraksen navy, tanggal rata kanan, dan format pencapaian terstruktur berstandar ATS.",
    persona: {
      name: "Arif Pratama",
      targetRoleTitle: "Marketing Manager",
      email: "arif.pratama@example.com",
      phone: "+62 812-3456-7890",
      address: "Jakarta Selatan, DKI Jakarta",
      summary:
        "Results-driven Marketing Manager with extensive experience in developing and executing strategic marketing initiatives that drive brand growth and customer engagement. Proven expertise in digital marketing, campaign management, market research, and team leadership. Adept at analyzing market trends, optimizing marketing performance, and delivering measurable business results in competitive environments.",
    },
    sections: [
      {
        type: "SUMMARY",
        title: "Summary",
        bullets: [
          {
            id: "b_sum_1",
            originalText:
              "Results-driven Marketing Manager with extensive experience in developing and executing strategic marketing initiatives that drive brand growth and customer engagement. Proven expertise in digital marketing, campaign management, market research, and team leadership. Adept at analyzing market trends, optimizing marketing performance, and delivering measurable business results in competitive environments.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EXPERIENCE",
        title: "Work Experience",
        bullets: [
          {
            id: "b_exp_1_header",
            originalText: "Marketing Manager, Borcelle Technologies | Jan 2023 - Present",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_1_1",
            originalText: "Developed and executed integrated marketing strategies, increasing brand awareness by 30%.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_1_2",
            originalText: "Managed digital marketing campaigns across social media, email, and paid advertising channels.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_1_3",
            originalText: "Led a team of marketing specialists to deliver high-impact campaigns and achieve business objectives.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_1_4",
            originalText: "Analyzed market trends and customer behavior to identify growth opportunities.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_1_5",
            originalText: "Collaborated with sales and product teams to improve customer acquisition and retention.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_2_header",
            originalText: "Senior Marketing Executive, Arrowai Industries | Feb 2021 - Dec 2022",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_2_1",
            originalText: "Planned and implemented marketing campaigns that increased lead generation by 25%.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_2_2",
            originalText: "Conducted market research and competitor analysis to support strategic decision-making.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_2_3",
            originalText: "Managed content creation, promotional activities, and brand communication efforts.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_2_4",
            originalText: "Monitored campaign performance and prepared reports for senior management.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_exp_2_5",
            originalText: "Assisted in organizing product launches and corporate events.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EDUCATION",
        title: "Education",
        bullets: [
          {
            id: "b_edu_1_header",
            originalText: "Bachelor of Business Administration (BBA) in Marketing | Aug 2016 – Oct 2019",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_edu_1_1",
            originalText: "Major in Marketing Management",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_edu_1_2",
            originalText: "Dean's List for Academic Excellence",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_edu_1_3",
            originalText: "Active member of Marketing and Entrepreneurship Club",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "SKILL",
        title: "Additional Information",
        bullets: [
          {
            id: "b_skl_1",
            originalText:
              "Technical Skills: Digital Marketing, SEO, SEM, Google Analytics, Social Media Marketing, Email Marketing, CRM Systems, Content Marketing, Marketing Automation",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_skl_2",
            originalText: "Languages: English, Malay, Japanese",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_skl_3",
            originalText:
              "Certifications: Google Analytics Certification, Google Ads Certification, HubSpot Content Marketing Certification, Digital Marketing Professional Certification",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_skl_4",
            originalText:
              "Achievements/Activities: Led a marketing campaign that increased online engagement by 40%; recognized for outstanding leadership in cross-functional marketing projects; actively participated in community business development programs.",
            approvalStatus: "APPROVED",
          },
        ],
      },
    ],
  },
  {
    id: "classic_ats",
    name: "Harvard Classic ATS Standard (Creative & Media)",
    roleTitle: "Creative & Art Director",
    style: "classic",
    description: "Format klasik ATS dengan nama centered, garis pembatas tipis elegan, dan pembagian seksi proporsional.",
    persona: {
      name: "Maya Anindita",
      targetRoleTitle: "Creative & Art Director",
      email: "maya.anindita@example.com",
      phone: "+62 821-9876-5432",
      address: "Bandung, Jawa Barat",
      summary:
        "Profesional kreatif dengan kemampuan mengembangkan konsep visual yang kuat dan mengarahkan berbagai proyek desain dari tahap perencanaan hingga implementasi. Berpengalaman dalam membangun identitas visual yang konsisten, memimpin kolaborasi tim kreatif, serta menghasilkan karya yang mendukung tujuan komunikasi dan pemasaran. Memiliki perhatian tinggi terhadap detail, tren desain, dan pengalaman audiens.",
    },
    sections: [
      {
        type: "SUMMARY",
        title: "Ringkasan Profil",
        bullets: [
          {
            id: "b_mn_sum_1",
            originalText:
              "Profesional kreatif dengan kemampuan mengembangkan konsep visual yang kuat dan mengarahkan berbagai proyek desain dari tahap perencanaan hingga implementasi. Berpengalaman dalam membangun identitas visual yang konsisten, memimpin kolaborasi tim kreatif, serta menghasilkan karya yang mendukung tujuan komunikasi dan pemasaran. Memiliki perhatian tinggi terhadap detail, tren desain, dan pengalaman audiens.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EXPERIENCE",
        title: "Pengalaman Profesional",
        bullets: [
          {
            id: "b_mn_exp_1_header",
            originalText: "Art Director | Arowwai Industries | 2023 – Sekarang",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_exp_1_1",
            originalText: "Mengembangkan arah visual untuk berbagai kebutuhan branding, promosi, dan kampanye kreatif.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_exp_1_2",
            originalText: "Membimbing tim desain dalam menghasilkan karya yang sesuai dengan identitas dan tujuan merek.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_exp_1_3",
            originalText: "Mengawasi kualitas visual pada seluruh materi komunikasi, baik digital maupun cetak.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_exp_2_header",
            originalText: "Visual Designer | Borcelle | 2021 – 2023",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_exp_2_1",
            originalText: "Mengembangkan arah visual untuk berbagai kebutuhan branding, promosi, dan kampanye kreatif.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_exp_2_2",
            originalText: "Membimbing tim desain dalam menghasilkan karya yang sesuai dengan identitas dan tujuan merek.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_exp_2_3",
            originalText: "Mengawasi kualitas visual pada seluruh materi komunikasi, baik digital maupun cetak.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EDUCATION",
        title: "Pendidikan",
        bullets: [
          {
            id: "b_mn_edu_1_header",
            originalText: "Universitas Fradel and Spies | 2020 – 2024",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_edu_1_1",
            originalText: "Mengembangkan arah visual untuk berbagai kebutuhan branding, promosi, dan kampanye kreatif.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_edu_1_2",
            originalText: "Membimbing tim desain dalam menghasilkan karya yang sesuai dengan identitas dan tujuan merek.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "SKILL",
        title: "Sertifikasi & Keterampilan",
        bullets: [
          {
            id: "b_mn_crt_1",
            originalText: "Program Pengembangan Kreativitas",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_crt_2",
            originalText: "Pelatihan Strategi Branding",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_crt_3",
            originalText: "Workshop Komunikasi Visual",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_mn_crt_4",
            originalText: "Sertifikasi Kepemimpinan Kreatif",
            approvalStatus: "APPROVED",
          },
        ],
      },
    ],
  },
  {
    id: "student_graduate",
    name: "Mahasiswa Tingkat Akhir (Fresh Graduate)",
    roleTitle: "Junior Product Manager",
    style: "modern",
    description: "Template ideal mahasiswa tingkat akhir/fresh graduate dengan kombinasi proyek kampus dan organisasi.",
    persona: {
      name: "Mahasiswa Tingkat Akhir",
      targetRoleTitle: "Junior Product Manager",
      email: "mahasiswa.career@campus.ac.id",
      phone: "0812-3456-7890",
      address: "Jakarta Selatan, DKI Jakarta",
      summary:
        "Mahasiswa tingkat akhir jurusan Sistem Informasi dengan pemahaman metodologi Agile Scrum, product discovery, dan analisis kebutuhan pengguna. Berpengalaman memimpin inisiatif digital kampus dan kolaborasi lintas tim.",
    },
    sections: [
      {
        type: "SUMMARY",
        title: "Ringkasan Profil",
        bullets: [
          {
            id: "b_std_sum_1",
            originalText:
              "Mahasiswa tingkat akhir jurusan Sistem Informasi dengan pemahaman metodologi Agile Scrum, product discovery, dan analisis kebutuhan pengguna. Berpengalaman memimpin inisiatif digital kampus dan kolaborasi lintas tim.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EXPERIENCE",
        title: "Pengalaman & Organisasi",
        bullets: [
          {
            id: "b_std_exp_1_header",
            originalText: "Product Lead Intern, Digital EduLab | Jan 2024 – Sekarang",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_exp_1_1",
            originalText: "Memimpin riset pengguna terhadap 150+ mahasiswa untuk memvalidasi fitur modul pembelajaran daring.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_exp_1_2",
            originalText: "Menyusun Product Requirement Document (PRD) dan backlog sprint bersama 4 pengembang software.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_exp_2_header",
            originalText: "Ketua Divisi Media & Kreatif, BEM Universitas | 2023 – 2024",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_exp_2_1",
            originalText: "Mengelola publikasi kampanye digital hingga menaikkan engagement media sosial organisasi sebesar 45%.",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_exp_2_2",
            originalText: "Mengkoordinasikan tim desain dan humas dalam penyelenggaraan seminar karier nasional dengan 500+ peserta.",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "EDUCATION",
        title: "Pendidikan",
        bullets: [
          {
            id: "b_std_edu_1_header",
            originalText: "Universitas Negeri Terkemuka | 2021 – 2025",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_edu_1_1",
            originalText: "Sarjana Sistem Informasi (IPK: 3.78/4.00)",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_edu_1_2",
            originalText: "Juara 2 Kompetisi Inovasi Bisnis & Teknologi Mahasiswa Tingkat Nasional",
            approvalStatus: "APPROVED",
          },
        ],
      },
      {
        type: "SKILL",
        title: "Keahlian & Sertifikasi",
        bullets: [
          {
            id: "b_std_skl_1",
            originalText: "Hard Skills: Product Discovery, User Journey Mapping, Wireframing (Figma), Agile/Scrum, Google Analytics",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_skl_2",
            originalText: "Soft Skills: Problem Solving terstruktur (STAR), Komunikasi Pemangku Kepentingan, Manajemen Waktu",
            approvalStatus: "APPROVED",
          },
          {
            id: "b_std_skl_3",
            originalText: "Sertifikasi: Google Project Management Professional Certificate, Scrum Foundation Certified",
            approvalStatus: "APPROVED",
          },
        ],
      },
    ],
  },
];
