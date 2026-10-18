import nodemailer from "nodemailer";

// Konfigurasi transporter SMTP
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null; // SMTP belum dikonfigurasi lengkap
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Mengirim email fisik berisi kode OTP dengan template HTML profesional
 */
export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
  const transporter = getEmailTransporter();

  // Jika belum dikonfigurasi, catat ke log server (fallback aman)
  if (!transporter) {
    console.log(`[SMTP INFO] SMTP_USER atau SMTP_PASS belum diset di .env. Email fisik dilewati.`);
    return false;
  }

  const from = process.env.SMTP_FROM || `CAREERSTUDENT AI <${process.env.SMTP_USER}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .logo { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 24px; }
        .logo span { color: #4f46e5; }
        .badge { display: inline-block; padding: 4px 12px; background: #eef2ff; color: #4338ca; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
        h1 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; }
        p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
        .otp-container { background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; border: 1px dashed #cbd5e1; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e1b4b; }
        .validity { font-size: 12px; color: #64748b; margin-top: 8px; }
        .footer { font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">CAREERSTUDENT<span>.AI</span></div>
        <div class="badge">Keamanan Akun Mahasiswa</div>
        <h1>Kode Verifikasi Masuk Kamu</h1>
        <p>Gunakan 6 digit kode One-Time Passcode (OTP) di bawah ini untuk mengakses akun dan data kariermu:</p>
        
        <div class="otp-container">
          <div class="otp-code">${otpCode}</div>
          <div class="validity">Berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.</div>
        </div>

        <p style="font-size: 13px; color: #64748b;">Jika kamu tidak merasa meminta kode ini, abaikan saja email ini dengan aman.</p>
        
        <div class="footer">
          &copy; 2026 CAREERSTUDENT AI — Adaptive Career Co-Pilot<br>
          Gen-Think Competition: Human-in-the-Loop Technology
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `[CAREERSTUDENT AI] Kode OTP Verifikasi: ${otpCode}`,
      html: htmlContent,
      text: `Kode verifikasi masuk CAREERSTUDENT AI kamu adalah: ${otpCode}. Kode ini berlaku selama 10 menit.`,
    });
    console.log(`✅ [SMTP SUCCESS] Email OTP berhasil dikirim fisik ke inbox: ${toEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ [SMTP ERROR] Gagal mengirim email ke ${toEmail}:`, error);
    return false;
  }
}
