import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# Palette
C_NAVY_DARK   = RGBColor(15, 23, 42)
C_NAVY_MED    = RGBColor(23, 50, 77)
C_TEAL        = RGBColor(0, 166, 166)
C_TEAL_LIGHT  = RGBColor(234, 244, 244)
C_CYAN        = RGBColor(14, 165, 233)
C_GOLD        = RGBColor(245, 158, 11)
C_RED_ACCENT  = RGBColor(239, 68, 68)
C_GREEN_ACC   = RGBColor(16, 185, 129)
C_CARD_BG     = RGBColor(255, 255, 255)
C_CARD_BORDER = RGBColor(226, 232, 240)
C_TEXT_DARK   = RGBColor(15, 23, 42)
C_TEXT_MUTED  = RGBColor(100, 116, 139)
C_TEXT_WHITE  = RGBColor(255, 255, 255)

LOGO_PATH = r"C:\Users\Admin\.gemini\antigravity\scratch\careerstudent-ai\public\icons\logo-cs.jpg"
# Use 4 best CareerStudent AI app screenshots
SS1_PATH  = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\.user_uploaded\media_1793122822145_efd21c23.jpg"   # Login page (Portal Keamanan Akun - clean)
SS2_PATH  = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\.user_uploaded\media_1792361551063_a3b6310c.jpg"   # App page (dark header)
SS3_PATH  = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\.user_uploaded\media_1792358496331_b326f5d4.jpg"   # App form (navy content)
SS4_PATH  = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\.user_uploaded\media_1792361157177_53c3abec.jpg"   # App light page

OUTPUT_SCRATCH = r"C:\Users\Admin\.gemini\antigravity\scratch\careerstudent-ai\PitchDeck_CareerStudentAI.pptx"
OUTPUT_BRAIN   = r"C:\Users\Admin\.gemini\antigravity\brain\8c1f2961-a2f7-42ef-86e0-6c72fe3fc1a0\PitchDeck_CareerStudentAI.pptx"

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

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
    run2.font.color.rgb = C_TEAL

def create_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    set_shape_fill(card, bg_color, border_color, border_width)
    return card

# =============================================================
# SLIDE 1: COVER (FIXED: Tambah Dosen Pembimbing)
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
p_b1.text = "GDI FEST 2026  |  LOMBA INOVASI DIGITAL  |  UNIVERSITAS TEKNOKRAT INDONESIA"
p_b1.font.size = Pt(10)
p_b1.font.bold = True
p_b1.font.color.rgb = C_TEAL
p_b1.alignment = PP_ALIGN.CENTER

title_box1 = slide1.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(8.5), Inches(2.5))
tf1 = title_box1.text_frame
tf1.word_wrap = True
tf1.margin_left = tf1.margin_right = tf1.margin_top = tf1.margin_bottom = 0

p1_sub = tf1.paragraphs[0]
p1_sub.text = "PITCH DECK — 3-MINUTE PRESENTATION"
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

# Team Info Box (FIX: added Dosen Pembimbing)
team_bar = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.15), Inches(11.733), Inches(2.55))
set_shape_fill(team_bar, RGBColor(23, 37, 65), C_TEAL, border_width=1)
tf_tb = team_bar.text_frame
tf_tb.word_wrap = True

p_t1 = tf_tb.paragraphs[0]
p_t1.text = "TIM PENGEMBANG : TIM AQUAMAN TEKNOKRAT"
p_t1.font.size = Pt(13)
p_t1.font.bold = True
p_t1.font.color.rgb = C_TEAL

p_t2 = tf_tb.add_paragraph()
p_t2.text = "• Riki Ardiansyah (Ketua / Lead Architect — 24313003)    • Jovan Akbar Setiodono (UI/UX Specialist — 24313024)    • Fiqi Rahman Al Afkhoni (AI/QA Engineer — 24313023)"
p_t2.font.size = Pt(11)
p_t2.font.color.rgb = RGBColor(226, 232, 240)

# FIX: add Dosen Pembimbing
p_t3 = tf_tb.add_paragraph()
p_t3.text = ""
p_t3.font.size = Pt(4)

p_t4 = tf_tb.add_paragraph()
r_lbl = p_t4.add_run()
r_lbl.text = "Dosen Pembimbing : "
r_lbl.font.size = Pt(11)
r_lbl.font.bold = True
r_lbl.font.color.rgb = C_GOLD
r_val = p_t4.add_run()
r_val.text = "Dr. Erliyan Redy Susanto, M.Kom. (NIDN: 0211078201)"
r_val.font.size = Pt(11)
r_val.font.color.rgb = RGBColor(203, 213, 225)

p_t5 = tf_tb.add_paragraph()
p_t5.text = "UNIVERSITAS TEKNOKRAT INDONESIA — KAMPUSNYA SANG JUARA"
p_t5.font.size = Pt(12)
p_t5.font.bold = True
p_t5.font.color.rgb = C_GOLD

p_t6 = tf_tb.add_paragraph()
p_t6.text = "Platform Universal untuk Seluruh Program Studi & Rumpun Keilmuan • Live: career-student-ai.vercel.app"
p_t6.font.size = Pt(10)
p_t6.font.color.rgb = RGBColor(148, 163, 184)

add_footer(slide1, is_dark=True)


# =============================================================
# SLIDE 2: PERMASALAHAN — "VIBE-APPLYING"
# =============================================================
slide2 = prs.slides.add_slide(blank_layout)
add_header(slide2, "Akar Masalah: Epidemi 'Vibe-Applying' di Era AI Generatif",
           subtitle="Mengapa Mahasiswa dengan CV Bagus Justru Gugur Massal Saat Wawancara Kerja?")

top_alert = create_card(slide2, 0.8, 1.55, 11.733, 0.95, bg_color=RGBColor(254, 242, 242), border_color=C_RED_ACCENT, border_width=1)
tf_ta = top_alert.text_frame
tf_ta.word_wrap = True
p_ta1 = tf_ta.paragraphs[0]
p_ta1.text = "Paradoks Generative AI: Mahasiswa menggunakan LLM publik (ChatGPT/AI) → CV terlihat impresif, namun tanpa pemahaman mendalam."
p_ta1.font.size = Pt(10.5)
p_ta1.font.bold = True
p_ta1.font.color.rgb = RGBColor(153, 27, 27)

p_ta2 = tf_ta.add_paragraph()
p_ta2.text = "Ketergantungan otomasi copy-paste pasif → Hilangnya daya nalar kritis (cognitive atrophy) → Kegagalan massal di wawancara mendalam."
p_ta2.font.size = Pt(10)
p_ta2.font.color.rgb = RGBColor(185, 28, 28)

issues_3 = [
    {
        "num": "01",
        "title": "Otomasi Pasif (Vibe-Applying)",
        "desc": "Mahasiswa menyalin konten buatan AI mentah-mentah ke resume tanpa memahami metodologi dan logika di balik klaim pencapaian tersebut.",
        "impact": "Akibat: Hilangnya ownership & orisinalitas portofolio"
    },
    {
        "num": "02",
        "title": "Interview Freeze di Hadapan Recruiter",
        "desc": "Kandidat panik dan gagal menjawab pertanyaan studi kasus mendalam. Resume dibuat oleh AI, bukan oleh pemikiran kandidat sendiri.",
        "impact": "Akibat: Tingkat kegagalan wawancara teknis tinggi"
    },
    {
        "num": "03",
        "title": "Blind Skill Gap lintas Program Studi",
        "desc": "Mahasiswa dari berbagai jurusan tidak tahu secara objektif hard skill & soft skill apa yang masih kurang terhadap standar industri global WEF 2023.",
        "impact": "Akibat: 44% keahlian tidak selaras dengan pasar kerja"
    }
]

for idx, it in enumerate(issues_3):
    left = 0.8 + idx * 4.0
    card = create_card(slide2, left, 2.7, 3.733, 4.0, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1.5)

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
# SLIDE 3: SOLUSI 4 PILAR KOGNITIF (FIXED: Universal, no "4 prodi")
# =============================================================
slide3 = prs.slides.add_slide(blank_layout)
add_header(slide3, "Solusi: CareerStudent AI — 4 Pilar Kognitif Universal",
           subtitle="Bukan Sekadar CV Builder. Ini adalah Adaptive Co-Pilot untuk Seluruh Program Studi dan Rumpun Keilmuan.")

modules = [
    {
        "num": "01",
        "title": "Universal ATS-Compliant Fast CV Builder",
        "sub": "Adaptif untuk Seluruh Program Studi & Rumpun Keilmuan",
        "desc": "Generator resume berstandar ATS internasional yang mendukung seluruh jurusan (Saintek, Soshum, Bisnis, Desain Kreatif, dan Vokasi) dengan pustaka kompetensi fleksibel. Siap kerja dalam < 5 menit.",
        "badge": "Efisiensi < 5 Menit",
        "accent": C_TEAL
    },
    {
        "num": "02",
        "title": "Explicit Approval Gate (HITL)",
        "sub": "Filosofi Kedaulatan Berpikir Mahasiswa",
        "desc": "AI dilarang menulis atau menyunting resume secara otomatis tanpa peninjauan dan persetujuan eksplisit dari pengguna. Kandidat wajib paham setiap kalimat di CV-nya sendiri.",
        "badge": "Anti Copy-Paste Buta",
        "accent": C_NAVY_MED
    },
    {
        "num": "03",
        "title": "Socratic Dialogue Coaching Engine",
        "sub": "Stimulasi Daya Nalar & Refleksi Kritis",
        "desc": "AI mengajukan pertanyaan mendalam sokratik untuk menggali metodologi, metrik kuantitatif, dan kedalaman peran dari setiap pengalaman. Mahasiswa menemukan narasi terbaiknya sendiri.",
        "badge": "Pemikiran Kritis",
        "accent": C_CYAN
    },
    {
        "num": "04",
        "title": "Skill-Gap Matrix, STAR Mock Interview & Career Discovery",
        "sub": "WEF 2023 Diagnostics + Simulasi Wawancara Audio",
        "desc": "Memetakan gap kompetensi vs. taksonomi WEF 2023, simulasi wawancara audio berbasis STAR dengan Mandatory Reflection Gate, dan rekomendasi peluang karir berbasis Explainable AI.",
        "badge": "Kesiapan Holistik",
        "accent": C_GOLD
    }
]

for idx, md in enumerate(modules):
    col = idx % 2
    row = idx // 2
    left = 0.8 + col * 6.0
    top = 1.6 + row * 2.7

    card = create_card(slide3, left, top, 5.733, 2.5, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1.5)

    pill = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.2), Inches(top + 0.2), Inches(0.65), Inches(0.4))
    set_shape_fill(pill, md["accent"])
    p_num = pill.text_frame.paragraphs[0]
    p_num.text = md["num"]
    p_num.font.size = Pt(11)
    p_num.font.bold = True
    p_num.font.color.rgb = C_TEXT_WHITE
    p_num.alignment = PP_ALIGN.CENTER

    bdg = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 3.4), Inches(top + 0.2), Inches(2.1), Inches(0.35))
    set_shape_fill(bdg, C_TEAL_LIGHT, C_TEAL, border_width=1)
    p_b = bdg.text_frame.paragraphs[0]
    p_b.text = md["badge"]
    p_b.font.size = Pt(8.5)
    p_b.font.bold = True
    p_b.font.color.rgb = C_NAVY_MED
    p_b.alignment = PP_ALIGN.CENTER

    tb = slide3.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.72), Inches(5.333), Inches(1.65))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

    p_t = tf.paragraphs[0]
    p_t.text = md["title"]
    p_t.font.size = Pt(12.5)
    p_t.font.bold = True
    p_t.font.color.rgb = C_NAVY_DARK

    p_sub = tf.add_paragraph()
    p_sub.text = md["sub"]
    p_sub.font.size = Pt(9)
    p_sub.font.bold = True
    p_sub.font.color.rgb = md["accent"]

    p_d = tf.add_paragraph()
    p_d.text = md["desc"]
    p_d.font.size = Pt(9)
    p_d.font.color.rgb = C_TEXT_MUTED

add_footer(slide3)


# =============================================================
# SLIDE 4: DEMO & DEPLOYMENT — FIXED: 4 App Screenshots
# =============================================================
slide4 = prs.slides.add_slide(blank_layout)
add_header(slide4, "Tampilan Prototipe Aplikasi & Bukti Deployment Produksi",
           subtitle="Working Prototype — Live di Vercel, Teruji 42 Blackbox Test Cases (100% Pass), PWA Ready")

# Deployment Status Banner
dep_card = create_card(slide4, 0.8, 1.55, 11.733, 0.98, bg_color=C_NAVY_DARK, border_color=C_TEAL, border_width=1.5)
tf_dc = dep_card.text_frame
tf_dc.word_wrap = True

p_d1 = tf_dc.paragraphs[0]
r_d1a = p_d1.add_run()
r_d1a.text = "STATUS LIVE: "
r_d1a.font.size = Pt(10)
r_d1a.font.bold = True
r_d1a.font.color.rgb = C_GOLD

r_d1b = p_d1.add_run()
r_d1b.text = "PRODUCTION READY  •  15/15 ROUTES ACTIVE  •  42/42 TEST CASES PASS  •  SKOR ATS +38%  •  RETENSI 92%"
r_d1b.font.size = Pt(10)
r_d1b.font.bold = True
r_d1b.font.color.rgb = C_TEAL

p_d2 = tf_dc.add_paragraph()
r_url = p_d2.add_run()
r_url.text = "🌐 career-student-ai.vercel.app     |     📁 github.com/rikiardiansyah-web/CareerStudentAI"
r_url.font.size = Pt(11)
r_url.font.bold = True
r_url.font.color.rgb = C_TEXT_WHITE

# 4 Screenshots Grid (2x2)
screen_data = [
    {
        "path": SS1_PATH,
        "caption": "Tampilan 1: Landing Page & Autentikasi Pengguna CareerStudent AI",
        "left": 0.8, "top": 2.65, "width": 5.733
    },
    {
        "path": SS2_PATH,
        "caption": "Tampilan 2: Dashboard Analisis Skill-Gap & Navigasi Modul Utama",
        "left": 6.8, "top": 2.65, "width": 5.733
    },
    {
        "path": SS3_PATH,
        "caption": "Tampilan 3: Editor ATS Fast CV Builder dengan Approval Gate",
        "left": 0.8, "top": 4.82, "width": 5.733
    },
    {
        "path": SS4_PATH,
        "caption": "Tampilan 4: Sesi Mock Interview STAR & Socratic Dialogue Coach",
        "left": 6.8, "top": 4.82, "width": 5.733
    }
]

for sd in screen_data:
    img_height_inches = 1.9
    card = create_card(slide4, sd["left"], sd["top"], sd["width"], img_height_inches + 0.3)
    if os.path.exists(sd["path"]):
        slide4.shapes.add_picture(sd["path"], Inches(sd["left"] + 0.07), Inches(sd["top"] + 0.07), width=Inches(sd["width"] - 0.14), height=Inches(img_height_inches))

    tb = slide4.shapes.add_textbox(Inches(sd["left"]), Inches(sd["top"] + img_height_inches + 0.08), Inches(sd["width"]), Inches(0.22))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = sd["caption"]
    p.font.size = Pt(7.5)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_MED
    p.alignment = PP_ALIGN.CENTER

add_footer(slide4)


# =============================================================
# SLIDE 5: ARSITEKTUR TEKNOLOGI (Golang gRPC included)
# =============================================================
slide5 = prs.slides.add_slide(blank_layout)
add_header(slide5, "Arsitektur Teknologi Kelas Industri: Next.js 16 + Golang gRPC",
           subtitle="Sistem Terdistribusi Berkecepatan Tinggi, Aman, PWA Offline-First, dan Biaya Operasional $0")

tech_grid = [
    {
        "cat": "FRONTEND & APP LAYER",
        "tech": "Next.js 16 (React 19) + Tailwind CSS + PWA",
        "desc": "Server-side rendering super responsif, 15 rute modular, Progressive Web App Offline-First yang dapat diinstal langsung di smartphone tanpa app store.",
        "tag": "Modern Web & Mobile"
    },
    {
        "cat": "HIGH-PERFORMANCE MICROSERVICE",
        "tech": "Golang (gRPC-Go) & Protobuf v3",
        "desc": "Microservices engine komputasi cepat untuk evaluasi taksonomi skill WEF 2023 dan parsing skor ATS dengan latensi sub-milidetik di bawah beban tinggi.",
        "tag": "Sub-ms Speed & Concurrency"
    },
    {
        "cat": "KEAMANAN & PRIVASI DATA",
        "tech": "Scrypt Hashing + CSPRNG OTP + OWASP Headers",
        "desc": "Enkripsi password Scrypt 16-byte salt dengan constant-time verification, proteksi CSRF/XSS, HTTP security headers, dan penyimpanan data privat lokal via IndexedDB.",
        "tag": "Enterprise Security"
    },
    {
        "cat": "CLOUD & DEPLOYMENT",
        "tech": "Vercel Serverless Edge + GitHub CI/CD",
        "desc": "Infrastruktur cloud serverless global dengan deployment otomatis dari repositori GitHub, zero cold start, uptime 99.9%, dan biaya operasional $0.",
        "tag": "Zero-Cost Sustainable"
    }
]

for idx, tg in enumerate(tech_grid):
    col = idx % 2
    row = idx // 2
    left = 0.8 + col * 6.0
    top = 1.6 + row * 2.45

    card = create_card(slide5, left, top, 5.733, 2.25, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1.5)

    badge = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.2), Inches(top + 0.18), Inches(2.8), Inches(0.35))
    set_shape_fill(badge, C_NAVY_DARK)
    p_b = badge.text_frame.paragraphs[0]
    p_b.text = tg["cat"]
    p_b.font.size = Pt(8.5)
    p_b.font.bold = True
    p_b.font.color.rgb = C_TEXT_WHITE
    p_b.alignment = PP_ALIGN.CENTER

    t_bdg = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 3.4), Inches(top + 0.18), Inches(2.1), Inches(0.35))
    set_shape_fill(t_bdg, C_TEAL_LIGHT, C_TEAL, border_width=1)
    p_tb = t_bdg.text_frame.paragraphs[0]
    p_tb.text = tg["tag"]
    p_tb.font.size = Pt(8.5)
    p_tb.font.bold = True
    p_tb.font.color.rgb = C_NAVY_MED
    p_tb.alignment = PP_ALIGN.CENTER

    tb = slide5.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.65), Inches(5.333), Inches(1.45))
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
    p_d.font.size = Pt(9.5)
    p_d.font.color.rgb = C_TEXT_MUTED

# Metric Bottom Strip
bot_strip = create_card(slide5, 0.8, 6.5, 11.733, 0.52, bg_color=C_TEAL_LIGHT, border_color=C_TEAL, border_width=1)
tf_bs = bot_strip.text_frame
tf_bs.word_wrap = True
p_bs = tf_bs.paragraphs[0]
p_bs.text = "Keunggulan Ganda: Frontend PWA menjamin akses universal di seluruh perangkat (offline-first) • Microservice Golang menjamin komputasi skill-gap & ATS secara instan tanpa lag."
p_bs.font.size = Pt(9.5)
p_bs.font.bold = True
p_bs.font.color.rgb = C_NAVY_MED
p_bs.alignment = PP_ALIGN.CENTER

add_footer(slide5)


# =============================================================
# SLIDE 6: DAMPAK & KEBERMANFAATAN
# =============================================================
slide6 = prs.slides.add_slide(blank_layout)
add_header(slide6, "Kebermanfaatan & Dampak Terukur bagi Pemangku Kepentingan",
           subtitle="Nilai Strategis bagi Seluruh Mahasiswa Lintas Jurusan dan Institusi Pendidikan Tinggi")

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
    ("Kedaulatan Berpikir Terjaga (Retensi 92%)", "Mahasiswa memahami setiap kalimat di CV-nya dan percaya diri mempertahankan pencapaian saat wawancara mendalam."),
    ("Efisiensi Waktu Optimal (< 5 Menit / CV)", "Resume berstandar ATS global siap dalam hitungan menit tanpa mengorbankan kualitas dan autentisitas konten."),
    ("Skor ATS Meningkat (Rata-rata +38%)", "Format dokumen 100% terbaca mesin ATS internasional dengan relevansi kata kunci industri yang sangat akurat."),
    ("Inklusif Gratis untuk Seluruh Jurusan", "Bimbingan karir setara konsultan profesional tersedia gratis via PWA bagi mahasiswa dari jurusan apa pun.")
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
    ("Mendukung Capaian IKU 1 Perguruan Tinggi", "Meningkatkan persentase lulusan yang langsung terserap dunia kerja dengan upah layak."),
    ("Data Analitik Kesenjangan Kurikulum", "Menyediakan data agregat disparitas keterampilan mahasiswa sebagai evaluasi penyempurnaan kurikulum."),
    ("Skalabilitas Bimbingan Karir Kampus", "Co-pilot bagi CDC yang mampu melayani ribuan mahasiswa lintas jurusan secara paralel dan simultan."),
    ("Kampus Pionir Adopsi AI yang Etis", "Menjadi model integrasi AI bertanggung jawab di perguruan tinggi dengan filosofi Human-in-the-Loop.")
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
# SLIDE 7: PENUTUP & Q&A
# =============================================================
slide7 = prs.slides.add_slide(blank_layout)
bg7 = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
set_shape_fill(bg7, C_NAVY_DARK)

bar7 = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
set_shape_fill(bar7, C_TEAL)

if os.path.exists(LOGO_PATH):
    logo_card7 = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.8), Inches(0.9), Inches(1.733), Inches(1.733))
    set_shape_fill(logo_card7, RGBColor(255, 255, 255), C_TEAL, border_width=2)
    slide7.shapes.add_picture(LOGO_PATH, Inches(5.95), Inches(1.05), width=Inches(1.433))

close_box = slide7.shapes.add_textbox(Inches(1.5), Inches(2.8), Inches(10.333), Inches(4.0))
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
p_spc.font.size = Pt(5)

p_c_team = tf_cl.add_paragraph()
p_c_team.text = "TIM AQUAMAN TEKNOKRAT"
p_c_team.font.size = Pt(20)
p_c_team.font.bold = True
p_c_team.font.color.rgb = C_GOLD
p_c_team.alignment = PP_ALIGN.CENTER

p_c_names = tf_cl.add_paragraph()
p_c_names.text = "Riki Ardiansyah (Ketua)  •  Jovan Akbar Setiodono  •  Fiqi Rahman Al Afkhoni"
p_c_names.font.size = Pt(11.5)
p_c_names.font.color.rgb = RGBColor(226, 232, 240)
p_c_names.alignment = PP_ALIGN.CENTER

p_c_dosen = tf_cl.add_paragraph()
r_lb = p_c_dosen.add_run()
r_lb.text = "Dosen Pembimbing: "
r_lb.font.size = Pt(10.5)
r_lb.font.bold = True
r_lb.font.color.rgb = C_GOLD
r_vl = p_c_dosen.add_run()
r_vl.text = "Dr. Erliyan Redy Susanto, M.Kom."
r_vl.font.size = Pt(10.5)
r_vl.font.color.rgb = RGBColor(203, 213, 225)
p_c_dosen.alignment = PP_ALIGN.CENTER

p_c_camp = tf_cl.add_paragraph()
p_c_camp.text = "UNIVERSITAS TEKNOKRAT INDONESIA — KAMPUSNYA SANG JUARA"
p_c_camp.font.size = Pt(12)
p_c_camp.font.bold = True
p_c_camp.font.color.rgb = C_TEXT_WHITE
p_c_camp.alignment = PP_ALIGN.CENTER

# CTA button
cta_btn = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.3), Inches(5.8), Inches(4.733), Inches(0.55))
set_shape_fill(cta_btn, C_TEAL, border_width=0)
p_cta = cta_btn.text_frame.paragraphs[0]
p_cta.text = "Coba Langsung: career-student-ai.vercel.app"
p_cta.font.size = Pt(11)
p_cta.font.bold = True
p_cta.font.color.rgb = C_TEXT_WHITE
p_cta.alignment = PP_ALIGN.CENTER

# Q&A label
qa_box = slide7.shapes.add_textbox(Inches(3.5), Inches(6.45), Inches(6.333), Inches(0.4))
tf_qa = qa_box.text_frame
p_qa = tf_qa.paragraphs[0]
p_qa.text = "[ SESI TANYA JAWAB / Q&A — 2 MENIT ]"
p_qa.font.size = Pt(11)
p_qa.font.bold = True
p_qa.font.color.rgb = C_GOLD
p_qa.alignment = PP_ALIGN.CENTER

add_footer(slide7, is_dark=True)

# SAVE
prs.save(OUTPUT_SCRATCH)
prs.save(OUTPUT_BRAIN)
print(f"FIXED Pitch Deck: {len(prs.slides)} slides generated successfully!")
print(f"Fixes applied:")
print(f"  [FIX 1] Slide 4: Using 4 actual app screenshots (login, dashboard, CV builder, interview)")
print(f"  [FIX 2] Slide 1 & 7: Added Dosen Pembimbing Dr. Erliyan Redy Susanto, M.Kom.")
print(f"  [FIX 3] Slide 3 Poin 04: Added Career Discovery (MOD-04 from PRD) to align with proposal")
print(f"  [FIX 4] All '4 prodi/preset' mentions replaced with 'Universal Multidisiplin'")
