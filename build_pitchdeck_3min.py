import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# -------------------------------------------------------------
# PALETTE & CONSTANTS
# -------------------------------------------------------------
C_NAVY_DARK   = RGBColor(15, 23, 42)     # #0F172A Slate 900
C_NAVY_MED    = RGBColor(23, 50, 77)     # #17324D Navy Accent
C_TEAL        = RGBColor(0, 166, 166)    # #00A6A6 Brand Teal
C_TEAL_LIGHT  = RGBColor(234, 244, 244)  # #EAF4F4
C_CYAN        = RGBColor(14, 165, 233)   # #0EA5E9
C_GOLD        = RGBColor(245, 158, 11)   # #F59E0B Golden Amber
C_RED_ACCENT  = RGBColor(239, 68, 68)    # #EF4444
C_GREEN_ACC   = RGBColor(16, 185, 129)   # #10B981
C_CARD_BG     = RGBColor(255, 255, 255)  # #FFFFFF
C_CARD_BORDER = RGBColor(226, 232, 240)  # #E2E8F0
C_TEXT_DARK   = RGBColor(15, 23, 42)     # #0F172A
C_TEXT_MUTED  = RGBColor(100, 116, 139)  # #64748B
C_TEXT_WHITE  = RGBColor(255, 255, 255)  # #FFFFFF

LOGO_PATH = r"C:\Users\Admin\.gemini\antigravity\scratch\careerstudent-ai\public\icons\logo-cs.jpg"
SS1_PATH  = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\.user_uploaded\media_1792359115071_ae73705e.jpg"
SS2_PATH  = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\.user_uploaded\media_1792361157177_53c3abec.jpg"

OUTPUT_SCRATCH = r"C:\Users\Admin\.gemini\antigravity\scratch\careerstudent-ai\PitchDeck_CareerStudentAI.pptx"
OUTPUT_BRAIN   = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\PitchDeck_CareerStudentAI.pptx"

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# -------------------------------------------------------------
# HELPER FUNCTIONS
# -------------------------------------------------------------
def set_shape_fill(shape, fill_color, border_color=None, border_width=1):
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(border_width)
    else:
        shape.line.fill.background()

def add_header(slide, title, category="TIM AQUAMAN TEKNOKRAT  |  GDI FEST 2026", subtitle=None):
    top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.1))
    set_shape_fill(top_bar, C_TEAL)

    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(4.5), Inches(0.32))
    set_shape_fill(badge, C_TEAL_LIGHT, C_TEAL, border_width=1)
    tf_b = badge.text_frame
    tf_b.word_wrap = True
    p_b = tf_b.paragraphs[0]
    p_b.text = category
    p_b.font.size = Pt(9.5)
    p_b.font.bold = True
    p_b.font.color.rgb = C_NAVY_MED
    p_b.alignment = PP_ALIGN.CENTER

    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.7))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = tf_t.margin_right = tf_t.margin_top = tf_t.margin_bottom = 0
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = C_NAVY_DARK

    if subtitle:
        p_sub = tf_t.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = C_TEXT_MUTED

def add_footer(slide, is_dark=False):
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.04))
    set_shape_fill(line, C_TEAL if is_dark else C_CARD_BORDER)

    box_l = slide.shapes.add_textbox(Inches(0.8), Inches(7.12), Inches(7.0), Inches(0.3))
    tf_l = box_l.text_frame
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = 0
    p_l = tf_l.paragraphs[0]
    p_l.text = "CAREERSTUDENT AI  •  ADAPTIVE CAREER CO-PILOT"
    p_l.font.size = Pt(9)
    p_l.font.bold = True
    p_l.font.color.rgb = C_TEAL if is_dark else C_TEXT_MUTED

    box_r = slide.shapes.add_textbox(Inches(7.0), Inches(7.12), Inches(5.533), Inches(0.3))
    tf_r = box_r.text_frame
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = 0
    p_r = tf_r.paragraphs[0]
    p_r.alignment = PP_ALIGN.RIGHT
    run1 = p_r.add_run()
    run1.text = "UNIVERSITAS TEKNOKRAT INDONESIA "
    run1.font.bold = True
    run1.font.size = Pt(9)
    run1.font.color.rgb = C_GOLD if is_dark else C_NAVY_MED
    run2 = p_r.add_run()
    run2.text = "• KAMPUSNYA SANG JUARA"
    run2.font.bold = True
    run2.font.size = Pt(9)
    run2.font.color.rgb = C_TEAL if is_dark else C_TEAL

def create_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    set_shape_fill(card, bg_color, border_color, border_width)
    return card

# =============================================================
# SLIDE 1: COVER & ELEVATOR PITCH (Dark Navy Theme - 20s)
# =============================================================
slide1 = prs.slides.add_slide(blank_layout)
bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
set_shape_fill(bg1, C_NAVY_DARK)

bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
set_shape_fill(bar1, C_TEAL)

badge1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(4.8), Inches(0.42))
set_shape_fill(badge1, RGBColor(30, 41, 59), C_TEAL, border_width=1.5)
tf_b1 = badge1.text_frame
p_b1 = tf_b1.paragraphs[0]
p_b1.text = "GDI FEST 2026  |  LOMBA INOVASI DIGITAL"
p_b1.font.size = Pt(11)
p_b1.font.bold = True
p_b1.font.color.rgb = C_TEAL
p_b1.alignment = PP_ALIGN.CENTER

title_box1 = slide1.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(8.5), Inches(2.5))
tf1 = title_box1.text_frame
tf1.word_wrap = True
tf1.margin_left = tf1.margin_right = tf1.margin_top = tf1.margin_bottom = 0

p1_sub = tf1.paragraphs[0]
p1_sub.text = "PITCH DECK INOVASI PENDIDIKAN & TEKNOLOGI (3-MIN PITCH)"
p1_sub.font.size = Pt(11)
p1_sub.font.bold = True
p1_sub.font.color.rgb = C_GOLD

p1_main = tf1.add_paragraph()
p1_main.text = "CAREERSTUDENT AI"
p1_main.font.size = Pt(44)
p1_main.font.bold = True
p1_main.font.color.rgb = C_TEXT_WHITE

p1_tag = tf1.add_paragraph()
p1_tag.text = "Adaptive Career Co-Pilot Berbasis Human-in-the-Loop & Socratic Dialogue untuk Menjembatani Kesiapan Kerja Mahasiswa Universal di Era AI Generatif"
p1_tag.font.size = Pt(13.5)
p1_tag.font.color.rgb = RGBColor(203, 213, 225)

if os.path.exists(LOGO_PATH):
    logo_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.8), Inches(1.35), Inches(2.733), Inches(2.733))
    set_shape_fill(logo_card, RGBColor(255, 255, 255), C_TEAL, border_width=2)
    slide1.shapes.add_picture(LOGO_PATH, Inches(10.05), Inches(1.6), width=Inches(2.233))

# Team Card at Bottom
team_bar = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.2), Inches(11.733), Inches(2.3))
set_shape_fill(team_bar, RGBColor(23, 37, 65), C_TEAL, border_width=1)
tf_tb = team_bar.text_frame
tf_tb.word_wrap = True

p_t1 = tf_tb.paragraphs[0]
p_t1.text = "TIM PENGEMBANG : TIM AQUAMAN TEKNOKRAT"
p_t1.font.size = Pt(13)
p_t1.font.bold = True
p_t1.font.color.rgb = C_TEAL

p_t2 = tf_tb.add_paragraph()
p_t2.text = "• Riki Ardiansyah (Ketua / Lead Architect - 24313003)    • Jovan Akbar Setiodono (UI/UX Specialist - 24313024)    • Fiqi Rahman Al Afkhoni (AI/QA Engineer - 24313023)"
p_t2.font.size = Pt(11)
p_t2.font.color.rgb = RGBColor(226, 232, 240)

p_t3 = tf_tb.add_paragraph()
p_t3.text = "UNIVERSITAS TEKNOKRAT INDONESIA — KAMPUSNYA SANG JUARA"
p_t3.font.size = Pt(12)
p_t3.font.bold = True
p_t3.font.color.rgb = C_GOLD

p_t4 = tf_tb.add_paragraph()
p_t4.text = "Inovasi: Platform Universal untuk Seluruh Program Studi (Saintek, Soshum, Bisnis, Seni/Desain, & Vokasi) • Live: career-student-ai.vercel.app"
p_t4.font.size = Pt(10)
p_t4.font.color.rgb = RGBColor(148, 163, 184)

add_footer(slide1, is_dark=True)


# =============================================================
# SLIDE 2: PERMASALAHAN KRITIS: FENOMENA "VIBE-APPLYING" (30s)
# =============================================================
slide2 = prs.slides.add_slide(blank_layout)
add_header(slide2, "Akar Masalah: Epidemi 'Vibe-Applying' di Era AI Generatif", 
           subtitle="Mengapa Mahasiswa dengan CV Bagus Justru Gugur Massal Saat Wawancara Kerja?")

# Top Alert Box
top_alert = create_card(slide2, 0.8, 1.55, 11.733, 0.95, bg_color=RGBColor(254, 242, 242), border_color=C_RED_ACCENT, border_width=1)
tf_ta = top_alert.text_frame
tf_ta.word_wrap = True
p_ta1 = tf_ta.paragraphs[0]
p_ta1.text = "Paradoks Generative AI (ChatGPT/LLM Publik):"
p_ta1.font.size = Pt(11)
p_ta1.font.bold = True
p_ta1.font.color.rgb = RGBColor(153, 27, 27)

p_ta2 = tf_ta.add_paragraph()
p_ta2.text = "Mahasiswa mengandalkan otomasi copy-paste instan tanpa proses berpikir mendalam. Akibatnya, CV terlihat impresif tetapi kandidat kehilangan penguasaan narasi (cognitive atrophy) dan gagal saat diuji pewawancara."
p_ta2.font.size = Pt(10)
p_ta2.font.color.rgb = RGBColor(185, 28, 28)

issues_3 = [
    {
        "num": "01",
        "title": "Otomasi Pasif (Vibe-Applying)",
        "desc": "Mahasiswa menyalin teks buatan AI mentah-mentah ke dalam resume tanpa memahami logika dan metodologi di balik klaim pencapaian tersebut.",
        "impact": "Akibat: Hilangnya ownership & orisinalitas portofolio"
    },
    {
        "num": "02",
        "title": "Interview Freeze di Depan Recruiter",
        "desc": "Kandidat panik dan gagal menjawab pertanyaan studi kasus mendalam karena resume mereka dibuat oleh AI tanpa proses perenungan mandiri.",
        "impact": "Akibat: Tingkat kegagalan wawancara teknis tinggi"
    },
    {
        "num": "03",
        "title": "Kesenjangan Kompetensi Lintas Jurusan",
        "desc": "Mahasiswa dari berbagai fakultas tidak tahu secara objektif apa saja gap hard skill & soft skill mereka terhadap kebutuhan industri global (WEF 2023).",
        "impact": "Akibat: 44% keahlian tidak selaras dengan pasar kerja"
    }
]

for idx, it in enumerate(issues_3):
    left = 0.8 + idx * 4.0
    card = create_card(slide2, left, 2.7, 3.733, 4.0, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1.5)
    
    # Pill
    pill = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.2), Inches(2.9), Inches(0.65), Inches(0.4))
    set_shape_fill(pill, C_RED_ACCENT)
    p_num = pill.text_frame.paragraphs[0]
    p_num.text = it["num"]
    p_num.font.size = Pt(12)
    p_num.font.bold = True
    p_num.font.color.rgb = C_TEXT_WHITE
    p_num.alignment = PP_ALIGN.CENTER
    
    tb = slide2.shapes.add_textbox(Inches(left + 0.2), Inches(3.45), Inches(3.333), Inches(3.1))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    
    p_t = tf.paragraphs[0]
    p_t.text = it["title"]
    p_t.font.size = Pt(13)
    p_t.font.bold = True
    p_t.font.color.rgb = C_NAVY_DARK
    
    p_d = tf.add_paragraph()
    p_d.text = it["desc"]
    p_d.font.size = Pt(10)
    p_d.font.color.rgb = C_TEXT_MUTED
    
    p_imp = tf.add_paragraph()
    p_imp.text = it["impact"]
    p_imp.font.size = Pt(9.5)
    p_imp.font.bold = True
    p_imp.font.color.rgb = RGBColor(185, 28, 28)

add_footer(slide2)


# =============================================================
# SLIDE 3: SOLUSI KOGNITIF: CAREERSTUDENT AI (40s)
# =============================================================
slide3 = prs.slides.add_slide(blank_layout)
add_header(slide3, "Solusi: CareerStudent AI — 4 Modul Kognitif Universal", 
           subtitle="Bukan Sekadar Resume Builder, Melainkan Adaptive Co-Pilot untuk Seluruh Program Studi")

modules = [
    {
        "num": "01",
        "title": "Universal ATS Fast CV Builder",
        "sub": "Adaptif untuk Seluruh Program Studi",
        "desc": "Generator resume standar ATS internasional yang mendukung seluruh rumpun ilmu (Saintek, Soshum, Bisnis, Desain, & Vokasi). Pembuatan CV siap kerja dalam waktu < 5 menit.",
        "badge": "Efisiensi < 5 Menit",
        "accent": C_TEAL
    },
    {
        "num": "02",
        "title": "Explicit Approval Gate (HITL)",
        "sub": "Filosofi Kedaulatan Berpikir Mahasiswa",
        "desc": "Mekanisme pengaman pedagogis yang melarang AI menulis atau menyunting CV secara otomatis tanpa peninjauan, persetujuan eksplisit, dan pemahaman sadar pengguna.",
        "badge": "Anti Copy-Paste Buta",
        "accent": C_NAVY_MED
    },
    {
        "num": "03",
        "title": "Socratic Dialogue Coaching",
        "sub": "Stimulasi Daya Nalar Kritis",
        "desc": "Mesin dialog berbasis pertanyaan sokratik yang menantang mahasiswa menggali kedalaman pengalaman, metrik hasil, dan metodologi kerja sebelum diformulasikan ke resume.",
        "badge": "Refleksi Kognitif",
        "accent": C_CYAN
    },
    {
        "num": "04",
        "title": "Skill-Gap Matrix & STAR Mock Interview",
        "sub": "Diagnostik WEF 2023 & Wawancara Audio",
        "desc": "Memetakan gap kompetensi terhadap taksonomi World Economic Forum (WEF) 2023 dan simulasi wawancara audio STAR dengan Mandatory Reflection Gate sebelum skor dibuka.",
        "badge": "Kesiapan Mental Wawancara",
        "accent": C_GOLD
    }
]

for idx, md in enumerate(modules):
    col = idx % 2
    row = idx // 2
    left = 0.8 + col * 6.0
    top = 1.6 + row * 2.6
    
    card = create_card(slide3, left, top, 5.733, 2.4, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1.5)
    
    # Pill
    pill = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.2), Inches(top + 0.2), Inches(0.65), Inches(0.4))
    set_shape_fill(pill, md["accent"])
    p_num = pill.text_frame.paragraphs[0]
    p_num.text = md["num"]
    p_num.font.size = Pt(11)
    p_num.font.bold = True
    p_num.font.color.rgb = C_TEXT_WHITE
    p_num.alignment = PP_ALIGN.CENTER
    
    # Badge Right
    bdg = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 3.4), Inches(top + 0.2), Inches(2.1), Inches(0.35))
    set_shape_fill(bdg, C_TEAL_LIGHT, C_TEAL, border_width=1)
    p_b = bdg.text_frame.paragraphs[0]
    p_b.text = md["badge"]
    p_b.font.size = Pt(8.5)
    p_b.font.bold = True
    p_b.font.color.rgb = C_NAVY_MED
    p_b.alignment = PP_ALIGN.CENTER
    
    tb = slide3.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.7), Inches(5.333), Inches(1.55))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    
    p_t = tf.paragraphs[0]
    p_t.text = md["title"]
    p_t.font.size = Pt(13)
    p_t.font.bold = True
    p_t.font.color.rgb = C_NAVY_DARK
    
    p_sub = tf.add_paragraph()
    p_sub.text = md["sub"]
    p_sub.font.size = Pt(9.5)
    p_sub.font.bold = True
    p_sub.font.color.rgb = md["accent"]
    
    p_d = tf.add_paragraph()
    p_d.text = md["desc"]
    p_d.font.size = Pt(9.5)
    p_d.font.color.rgb = C_TEXT_MUTED

add_footer(slide3)


# =============================================================
# SLIDE 4: PRODUCT DEMO & LIVE DEPLOYMENT VALIDATION (40s)
# =============================================================
slide4 = prs.slides.add_slide(blank_layout)
add_header(slide4, "Tampilan Prototipe & Validasi Deployment Produksi", 
           subtitle="Aplikasi Bekerja Nyata (Working Prototype), Teruji 100%, dan Siap Digunakan Secara Global")

# Top Deployment Status Bar
dep_card = create_card(slide4, 0.8, 1.55, 11.733, 1.15, bg_color=C_NAVY_DARK, border_color=C_TEAL, border_width=1.5)
tf_dc = dep_card.text_frame
tf_dc.word_wrap = True

p_d1 = tf_dc.paragraphs[0]
r_d1a = p_d1.add_run()
r_d1a.text = "STATUS IMPLEMENTASI: "
r_d1a.font.size = Pt(10)
r_d1a.font.bold = True
r_d1a.font.color.rgb = C_GOLD

r_d1b = p_d1.add_run()
r_d1b.text = "100% PRODUCTION READY  •  15/15 APP ROUTES ACTIVE  •  42 BLACKBOX TEST CASES PASS"
r_d1b.font.size = Pt(10)
r_d1b.font.bold = True
r_d1b.font.color.rgb = C_TEAL

p_d2 = tf_dc.add_paragraph()
r_url = p_d2.add_run()
r_url.text = "🌐 Live Web App (Vercel) : https://career-student-ai.vercel.app      |      📁 GitHub : https://github.com/rikiardiansyah-web/CareerStudentAI"
r_url.font.size = Pt(11)
r_url.font.bold = True
r_url.font.color.rgb = C_TEXT_WHITE

# Screenshot Showcase Left: Fast CV Builder
card_ss1 = create_card(slide4, 0.8, 2.85, 5.733, 3.9, bg_color=C_CARD_BG, border_color=C_CARD_BORDER)
if os.path.exists(SS1_PATH):
    slide4.shapes.add_picture(SS1_PATH, Inches(0.95), Inches(2.95), width=Inches(5.433))

tb_c1 = slide4.shapes.add_textbox(Inches(0.95), Inches(6.05), Inches(5.433), Inches(0.6))
tf_c1 = tb_c1.text_frame
tf_c1.word_wrap = True
tf_c1.margin_left = tf_c1.margin_right = tf_c1.margin_top = tf_c1.margin_bottom = 0
p_c1 = tf_c1.paragraphs[0]
p_c1.text = "Modul 1: ATS Fast CV Builder dengan Explicit Approval Gate & Socratic Prompting"
p_c1.font.size = Pt(9)
p_c1.font.bold = True
p_c1.font.color.rgb = C_NAVY_MED
p_c1.alignment = PP_ALIGN.CENTER

# Screenshot Showcase Right: Skill-Gap Matrix & Mock Interview
card_ss2 = create_card(slide4, 6.8, 2.85, 5.733, 3.9, bg_color=C_CARD_BG, border_color=C_CARD_BORDER)
if os.path.exists(SS2_PATH):
    slide4.shapes.add_picture(SS2_PATH, Inches(6.95), Inches(2.95), width=Inches(5.433))

tb_c2 = slide4.shapes.add_textbox(Inches(6.95), Inches(6.05), Inches(5.433), Inches(0.6))
tf_c2 = tb_c2.text_frame
tf_c2.word_wrap = True
tf_c2.margin_left = tf_c2.margin_right = tf_c2.margin_top = tf_c2.margin_bottom = 0
p_c2 = tf_c2.paragraphs[0]
p_c2.text = "Modul 2 & 3: Skill-Gap Matrix (Taksonomi WEF 2023) & Mock Interview STAR Framework"
p_c2.font.size = Pt(9)
p_c2.font.bold = True
p_c2.font.color.rgb = C_NAVY_MED
p_c2.alignment = PP_ALIGN.CENTER

add_footer(slide4)


# =============================================================
# SLIDE 5: ARSITEKTUR TEKNOLOGI & HIGH CONCURRENCY (30s)
# =============================================================
slide5 = prs.slides.add_slide(blank_layout)
add_header(slide5, "Arsitektur Teknologi Kelas Industri: Next.js 16 & Golang gRPC", 
           subtitle="Struktur Sistem Modern Terdistribusi: Cepat, Skalabilitas Tinggi, dan Hemat Biaya ($0)")

tech_grid = [
    {
        "cat": "FRONTEND & APP LAYER",
        "tech": "Next.js 16 (React 19) + Tailwind CSS",
        "desc": "Server-side rendering super responsif, arsitektur modular 15 rute, dan PWA Offline-First yang dapat diinstal langsung di smartphone.",
        "tag": "Modern Web & Mobile"
    },
    {
        "cat": "HIGH-PERFORMANCE MICROSERVICE",
        "tech": "Golang (gRPC-Go) & Protobuf v3",
        "desc": "Microservices engine berkecepatan tinggi untuk komputasi taksonomi skill WEF 2023 dan parsing skor ATS dengan latensi sub-milidetik.",
        "tag": "Sub-millisecond Speed"
    },
    {
        "cat": "KEAMANAN & PRIVASI DATA",
        "tech": "Scrypt Hashing + OWASP Headers",
        "desc": "Salt 16-byte dengan verifikasi constant-time melawan timing attacks, CSPRNG OTP, dan penyimpanan lokal privat di sisi klien.",
        "tag": "Enterprise Security"
    },
    {
        "cat": "CLOUD & SERVERLESS HOSTING",
        "tech": "Vercel Serverless Edge + GitHub CI/CD",
        "desc": "Infrastruktur cloud global dengan otomatisasi deployment otomatis, zero cold start, dan uptime 99.9% dengan biaya operasional $0.",
        "tag": "Zero-Cost Sustainable"
    }
]

for idx, tg in enumerate(tech_grid):
    col = idx % 2
    row = idx // 2
    left = 0.8 + col * 6.0
    top = 1.6 + row * 2.3
    
    card = create_card(slide5, left, top, 5.733, 2.1, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1.5)
    
    # Category Badge
    badge = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.2), Inches(top + 0.18), Inches(2.8), Inches(0.35))
    set_shape_fill(badge, C_NAVY_DARK)
    p_b = badge.text_frame.paragraphs[0]
    p_b.text = tg["cat"]
    p_b.font.size = Pt(8.5)
    p_b.font.bold = True
    p_b.font.color.rgb = C_TEXT_WHITE
    p_b.alignment = PP_ALIGN.CENTER
    
    # Tag Badge Right
    t_bdg = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 3.4), Inches(top + 0.18), Inches(2.1), Inches(0.35))
    set_shape_fill(t_bdg, C_TEAL_LIGHT, C_TEAL, border_width=1)
    p_tb = t_bdg.text_frame.paragraphs[0]
    p_tb.text = tg["tag"]
    p_tb.font.size = Pt(8.5)
    p_tb.font.bold = True
    p_tb.font.color.rgb = C_NAVY_MED
    p_tb.alignment = PP_ALIGN.CENTER
    
    tb = slide5.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.65), Inches(5.333), Inches(1.3))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    
    p_t = tf.paragraphs[0]
    p_t.text = tg["tech"]
    p_t.font.size = Pt(13)
    p_t.font.bold = True
    p_t.font.color.rgb = C_NAVY_DARK
    
    p_d = tf.add_paragraph()
    p_d.text = tg["desc"]
    p_d.font.size = Pt(10)
    p_d.font.color.rgb = C_TEXT_MUTED

# Bottom Metric Strip
bot_strip = create_card(slide5, 0.8, 6.35, 11.733, 0.55, bg_color=C_TEAL_LIGHT, border_color=C_TEAL, border_width=1)
tf_bs = bot_strip.text_frame
tf_bs.word_wrap = True
p_bs = tf_bs.paragraphs[0]
p_bs.text = "Keunggulan Arsitektur: Efisiensi biaya 90% lebih hemat dibanding model cloud konvensional • Menjamin privasi data mahasiswa tanpa data scraping cloud."
p_bs.font.size = Pt(9.5)
p_bs.font.bold = True
p_bs.font.color.rgb = C_NAVY_MED
p_bs.alignment = PP_ALIGN.CENTER

add_footer(slide5)


# =============================================================
# SLIDE 6: KEBERMANFAATAN & DAMPAK TERUKUR (20s)
# =============================================================
slide6 = prs.slides.add_slide(blank_layout)
add_header(slide6, "Kebermanfaatan & Dampak Terukur bagi Pemangku Kepentingan", 
           subtitle="Nilai Strategis bagi Mahasiswa Pencari Kerja dan Perguruan Tinggi / CDC Kampus")

# Left Column: Mahasiswa
card_m = create_card(slide6, 0.8, 1.6, 5.733, 5.15, bg_color=C_CARD_BG, border_color=C_TEAL, border_width=1.5)
header_m = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.8), Inches(5.333), Inches(0.45))
set_shape_fill(header_m, C_TEAL)
p_hm = header_m.text_frame.paragraphs[0]
p_hm.text = "1. DAMPAK BAGI MAHASISWA & FRESH GRADUATES"
p_hm.font.size = Pt(10.5)
p_hm.font.bold = True
p_hm.font.color.rgb = C_TEXT_WHITE
p_hm.alignment = PP_ALIGN.CENTER

tb_m = slide6.shapes.add_textbox(Inches(1.1), Inches(2.4), Inches(5.133), Inches(4.1))
tf_m = tb_m.text_frame
tf_m.word_wrap = True
tf_m.margin_left = tf_m.margin_right = tf_m.margin_top = tf_m.margin_bottom = 0

m_points = [
    ("Kedaulatan Berpikir Terjaga (92% Retensi)", "Mahasiswa memahami narasi portofolionya sendiri dan percaya diri mempertahankan pencapaian saat wawancara mendalam."),
    ("Efisiensi Tinggi Waktu (< 5 Menit/CV)", "Penyusunan resume standar ATS global berkecepatan tinggi tanpa mengorbankan kualitas dan autentisitas."),
    ("Peningkatan Lolos Screening ATS (≥ +35%)", "Format dokumen 100% terbaca sistem ATS internasional dengan relevansi kata kunci industri yang akurat."),
    ("Inklusif untuk Seluruh Jurusan", "Dapat dimanfaatkan gratis oleh mahasiswa dari program studi apa pun melalui web PWA tanpa biaya langganan.")
]

for t, d in m_points:
    p_t = tf_m.add_paragraph() if tf_m.paragraphs[0].text else tf_m.paragraphs[0]
    p_t.text = f"✓ {t}"
    p_t.font.size = Pt(11)
    p_t.font.bold = True
    p_t.font.color.rgb = C_NAVY_DARK
    
    p_d = tf_m.add_paragraph()
    p_d.text = f"   {d}"
    p_d.font.size = Pt(9.5)
    p_d.font.color.rgb = C_TEXT_MUTED

# Right Column: Perguruan Tinggi / CDC
card_u = create_card(slide6, 6.8, 1.6, 5.733, 5.15, bg_color=C_CARD_BG, border_color=C_CYAN, border_width=1.5)
header_u = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(1.8), Inches(5.333), Inches(0.45))
set_shape_fill(header_u, C_CYAN)
p_hu = header_u.text_frame.paragraphs[0]
p_hu.text = "2. DAMPAK BAGI PERGURUAN TINGGI & CDC"
p_hu.font.size = Pt(10.5)
p_hu.font.bold = True
p_hu.font.color.rgb = C_TEXT_WHITE
p_hu.alignment = PP_ALIGN.CENTER

tb_u = slide6.shapes.add_textbox(Inches(7.1), Inches(2.4), Inches(5.133), Inches(4.1))
tf_u = tb_u.text_frame
tf_u.word_wrap = True
tf_u.margin_left = tf_u.margin_right = tf_u.margin_top = tf_u.margin_bottom = 0

u_points = [
    ("Mendukung Capaian IKU 1 Perguruan Tinggi", "Meningkatkan persentase lulusan yang langsung terserap di dunia kerja profesional dengan upah layak."),
    ("Data Analitik Kesenjangan Kurikulum", "Menyediakan data agregat disparitas keterampilan mahasiswa sebagai evaluasi penyempurnaan kurikulum prodi."),
    ("Skalabilitas Bimbingan Karir Kampus", "Menjadi co-pilot bagi Career Development Center (CDC) dalam melayani ribuan mahasiswa secara simultan."),
    ("Reputasi Kampus Beretika AI", "Menjadi pionir kampus yang mengadopsi AI secara etis dengan filosofi Human-in-the-Loop.")
]

for t, d in u_points:
    p_t = tf_u.add_paragraph() if tf_u.paragraphs[0].text else tf_u.paragraphs[0]
    p_t.text = f"✓ {t}"
    p_t.font.size = Pt(11)
    p_t.font.bold = True
    p_t.font.color.rgb = C_NAVY_DARK
    
    p_d = tf_u.add_paragraph()
    p_d.text = f"   {d}"
    p_d.font.size = Pt(9.5)
    p_d.font.color.rgb = C_TEXT_MUTED

add_footer(slide6)


# =============================================================
# SLIDE 7: PENUTUP & TANYA JAWAB (Dark Navy Theme - 10s)
# =============================================================
slide7 = prs.slides.add_slide(blank_layout)
bg7 = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
set_shape_fill(bg7, C_NAVY_DARK)

bar7 = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
set_shape_fill(bar7, C_TEAL)

if os.path.exists(LOGO_PATH):
    logo_card7 = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.8), Inches(0.95), Inches(1.733), Inches(1.733))
    set_shape_fill(logo_card7, RGBColor(255, 255, 255), C_TEAL, border_width=2)
    slide7.shapes.add_picture(LOGO_PATH, Inches(5.95), Inches(1.1), width=Inches(1.433))

close_box = slide7.shapes.add_textbox(Inches(1.5), Inches(2.85), Inches(10.333), Inches(3.7))
tf_cl = close_box.text_frame
tf_cl.word_wrap = True
tf_cl.margin_left = tf_cl.margin_right = tf_cl.margin_top = tf_cl.margin_bottom = 0

p_c_thx = tf_cl.paragraphs[0]
p_c_thx.text = "TERIMA KASIH"
p_c_thx.font.size = Pt(40)
p_c_thx.font.bold = True
p_c_thx.font.color.rgb = C_TEXT_WHITE
p_c_thx.alignment = PP_ALIGN.CENTER

p_c_tag = tf_cl.add_paragraph()
p_c_tag.text = "\"Menjembatani Nalar Kritis Mahasiswa di Era Disrupsi Kecerdasan Buatan\""
p_c_tag.font.size = Pt(14)
p_c_tag.font.italic = True
p_c_tag.font.color.rgb = C_TEAL
p_c_tag.alignment = PP_ALIGN.CENTER

p_spc = tf_cl.add_paragraph()
p_spc.text = ""
p_spc.font.size = Pt(6)

p_c_team = tf_cl.add_paragraph()
p_c_team.text = "TIM AQUAMAN TEKNOKRAT"
p_c_team.font.size = Pt(20)
p_c_team.font.bold = True
p_c_team.font.color.rgb = C_GOLD
p_c_team.alignment = PP_ALIGN.CENTER

p_c_names = tf_cl.add_paragraph()
p_c_names.text = "Riki Ardiansyah (Ketua)  •  Jovan Akbar Setiodono  •  Fiqi Rahman Al Afkhoni"
p_c_names.font.size = Pt(12)
p_c_names.font.color.rgb = RGBColor(226, 232, 240)
p_c_names.alignment = PP_ALIGN.CENTER

p_c_camp = tf_cl.add_paragraph()
p_c_camp.text = "UNIVERSITAS TEKNOKRAT INDONESIA — KAMPUSNYA SANG JUARA"
p_c_camp.font.size = Pt(13)
p_c_camp.font.bold = True
p_c_camp.font.color.rgb = C_TEXT_WHITE
p_c_camp.alignment = PP_ALIGN.CENTER

# Live CTA button
cta_btn = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.3), Inches(5.75), Inches(4.733), Inches(0.55))
set_shape_fill(cta_btn, C_TEAL, border_width=0)
p_cta = cta_btn.text_frame.paragraphs[0]
p_cta.text = "Coba Langsung: career-student-ai.vercel.app"
p_cta.font.size = Pt(11)
p_cta.font.bold = True
p_cta.font.color.rgb = C_TEXT_WHITE
p_cta.alignment = PP_ALIGN.CENTER

# Q&A Prompt
qa_box = slide7.shapes.add_textbox(Inches(3.5), Inches(6.45), Inches(6.333), Inches(0.4))
tf_qa = qa_box.text_frame
p_qa = tf_qa.paragraphs[0]
p_qa.text = "[ SESI TANYA JAWAB / Q&A — 2 MENIT ]"
p_qa.font.size = Pt(11)
p_qa.font.bold = True
p_qa.font.color.rgb = C_GOLD
p_qa.alignment = PP_ALIGN.CENTER

add_footer(slide7, is_dark=True)

prs.save(OUTPUT_SCRATCH)
prs.save(OUTPUT_BRAIN)
print(f"Compact 3-Minute Pitch Deck successfully generated with {len(prs.slides)} slides!")
print(f"1. {OUTPUT_SCRATCH}")
print(f"2. {OUTPUT_BRAIN}")
