"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Download,
  Check,
  FileText,
  Printer,
  FileDown,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";
import { ParsedSection } from "@/lib/resumeParser";
import { useAppStore } from "@/lib/store/useAppStore";
import jsPDF from "jspdf";

interface CvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: ParsedSection[];
}

export function CvExportModal({ isOpen, onClose, sections }: CvExportModalProps) {
  const { persona } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<"modern" | "classic">("modern");
  const [activeView, setActiveView] = useState<"preview" | "text">("preview");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const phone = persona.phone || "123-456-7890";
  const email = persona.email || "hello@reallygreatsite.com";
  const address = persona.address || "123 Anywhere St., Any City";
  const fullName = (persona.name || "NAMA LENGKAP").toUpperCase();
  const targetRole = persona.targetRoleTitle || "Marketing Manager";

  // Format Dokumen ATS-Friendly Bersih Plain Text
  const buildAtsPlainText = () => {
    let out = `${fullName}\n`;
    out += `${phone} | ${email} | ${address}\n`;
    out += `Target Peran: ${targetRole}\n\n`;

    for (const section of sections) {
      out += `========================================\n`;
      out += `${section.title.toUpperCase()}\n`;
      out += `========================================\n`;
      for (const bullet of section.bullets) {
        const text = bullet.finalText || bullet.originalText || "";
        if (section.type === "SUMMARY") {
          out += `${text}\n`;
        } else if (text.includes("|")) {
          out += `\n${text}\n`;
        } else {
          out += `• ${text}\n`;
        }
      }
      out += `\n`;
    }
    return out;
  };

  const plainText = buildAtsPlainText();

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_${(persona.name || "Resume").replace(/\s+/g, "_")}_ATS.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Unduh Langsung Berkas File .PDF Sesuai Template (Modern / Classic)
  const handleDirectDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      if (selectedStyle === "modern") {
        // =====================================================================
        // TEMPLATE 1: EXECUTIVE MODERN LAYOUT
        // =====================================================================
        // Header Kiri: Nama Besar Biru Navy + Subtitle
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(30, 58, 138); // Deep Navy (#1E3A8A)
        doc.text(fullName, margin, y);

        y += 6;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text(targetRole, margin, y);

        // Header Kanan: Kotak Kontak Terstruktur
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const contactX = pageWidth - margin;
        doc.text(`Phone:   ${phone}`, contactX, y - 6, { align: "right" });
        doc.text(`Email:   ${email}`, contactX, y - 2, { align: "right" });
        doc.text(`Address: ${address}`, contactX, y + 2, { align: "right" });

        y += 6;
        // Garis Pembatas Header Tebal Beraksen Biru
        doc.setDrawColor(30, 58, 138);
        doc.setLineWidth(0.8);
        doc.line(margin, y, pageWidth - margin, y);
        y += 7;

        // Render Bagian
        for (const section of sections) {
          if (y > 260) {
            doc.addPage();
            y = 18;
          }

          // Judul Seksi (Bold Navy)
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(30, 58, 138);
          doc.text(section.title.toUpperCase(), margin, y);
          y += 2;

          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.3);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4.5;

          const isSummary = section.type === "SUMMARY" || section.title.toLowerCase().includes("summary") || section.title.toLowerCase().includes("ringkasan");

          for (const bullet of section.bullets) {
            const content = (bullet.finalText || bullet.originalText || "").trim();
            if (!content) continue;

            if (isSummary) {
              // Paragraph flow tanpa tanda bullet
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(51, 65, 85);
              const wrapped = doc.splitTextToSize(content, contentWidth);
              if (y + wrapped.length * 4 > 275) {
                doc.addPage();
                y = 18;
              }
              doc.text(wrapped, margin, y);
              y += wrapped.length * 4.2 + 2;
            } else if (content.includes("|")) {
              // Header Pengalaman: Posisi di kiri, Tanggal di kanan
              const parts = content.split("|").map((p) => p.trim());
              const leftText = parts[0] || "";
              const rightText = parts.slice(1).join(" | ");

              if (y > 260) {
                doc.addPage();
                y = 18;
              }

              y += 1.5;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // slate-900
              doc.text(leftText, margin, y);

              if (rightText) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(71, 85, 105);
                doc.text(rightText, pageWidth - margin, y, { align: "right" });
              }
              y += 4.2;
            } else {
              // Butir Poin dengan Bullet Indentasi
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8.8);
              doc.setTextColor(51, 65, 85);
              const wrapped = doc.splitTextToSize(`•   ${content}`, contentWidth - 3);
              if (y + wrapped.length * 4 > 275) {
                doc.addPage();
                y = 18;
              }
              doc.text(wrapped, margin + 2, y);
              y += wrapped.length * 3.8 + 1.2;
            }
          }
          y += 3.5;
        }
      } else {
        // =====================================================================
        // TEMPLATE 2: CLASSIC ATS STANDARD (HARVARD MINIMALIST)
        // =====================================================================
        // Header Tengah (Centered)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(fullName, pageWidth / 2, y, { align: "center" });

        y += 5.5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`${phone}  |  ${email}  |  ${address}`, pageWidth / 2, y, { align: "center" });

        y += 4;
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.4);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6.5;

        for (const section of sections) {
          if (y > 260) {
            doc.addPage();
            y = 18;
          }

          // Judul Seksi Bersih Bergaris Bawah
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(section.title.toUpperCase(), margin, y);
          y += 1.8;

          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.3);
          doc.line(margin, y, pageWidth - margin, y);
          y += 4.5;

          const isSummary = section.type === "SUMMARY" || section.title.toLowerCase().includes("summary") || section.title.toLowerCase().includes("ringkasan");

          for (const bullet of section.bullets) {
            const content = (bullet.finalText || bullet.originalText || "").trim();
            if (!content) continue;

            if (isSummary) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(51, 65, 85);
              const wrapped = doc.splitTextToSize(content, contentWidth);
              if (y + wrapped.length * 4 > 275) {
                doc.addPage();
                y = 18;
              }
              doc.text(wrapped, margin, y);
              y += wrapped.length * 4.2 + 2;
            } else if (content.includes("|")) {
              const parts = content.split("|").map((p) => p.trim());
              const leftText = parts[0] || "";
              const rightText = parts.slice(1).join(" | ");

              if (y > 260) {
                doc.addPage();
                y = 18;
              }

              y += 1.5;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42);
              doc.text(leftText, margin, y);

              if (rightText) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.setTextColor(71, 85, 105);
                doc.text(rightText, pageWidth - margin, y, { align: "right" });
              }
              y += 4.2;
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8.8);
              doc.setTextColor(51, 65, 85);
              const wrapped = doc.splitTextToSize(`•  ${content}`, contentWidth - 3);
              if (y + wrapped.length * 4 > 275) {
                doc.addPage();
                y = 18;
              }
              doc.text(wrapped, margin + 2, y);
              y += wrapped.length * 3.8 + 1.2;
            }
          }
          y += 3.5;
        }
      }

      // Download file PDF ke komputer pengguna
      const styleSuffix = selectedStyle === "modern" ? "Modern" : "Classic";
      const fileName = `CV_${(persona.name || "Resume").replace(/\s+/g, "_")}_${styleSuffix}_ATS.pdf`;
      doc.save(fileName);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3000);
    } catch (err) {
      console.error("Gagal men-generate PDF:", err);
      alert("Terjadi kendala saat men-generate PDF. Silakan coba kembali.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Ekspor Resume Standar Industri (PDF & ATS)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pilih gaya layout desain profesional (Gaya Alfredo Torres / Mariana Napolitani)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pilihan Gaya Desain PDF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setSelectedStyle("modern");
              setActiveView("preview");
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              selectedStyle === "modern" && activeView === "preview"
                ? "bg-white text-blue-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutTemplate className="w-4 h-4 text-blue-700" />
            <span>Gaya 1: Executive Modern Layout</span>
          </button>

          <button
            onClick={() => {
              setSelectedStyle("classic");
              setActiveView("preview");
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              selectedStyle === "classic" && activeView === "preview"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Gaya 2: Harvard Classic ATS Standard</span>
          </button>
        </div>

        {/* Tab Toggle View: Pratinjau vs TXT */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveView("preview")}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeView === "preview"
                ? "bg-indigo-100 text-indigo-800 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📄 Pratinjau Dokumen Nyata
          </button>
          <button
            onClick={() => setActiveView("text")}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeView === "text"
                ? "bg-indigo-100 text-indigo-800 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📋 Teks ATS Polos (.txt)
          </button>
        </div>

        {/* Content Preview Container */}
        {activeView === "preview" ? (
          <div className="mb-5 max-h-[420px] overflow-y-auto bg-slate-100 p-4 sm:p-6 rounded-xl border border-slate-300">
            {/* Lembar Dokumen A4 Mockup */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200 text-slate-900 max-w-2xl mx-auto space-y-4 font-sans text-xs">
              {selectedStyle === "modern" ? (
                /* ================= Modern Header (Alfredo Torres) ================= */
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-blue-900 pb-3 mb-4">
                    <div>
                      <h4 className="text-xl font-bold uppercase tracking-tight text-blue-900 font-heading">
                        {fullName}
                      </h4>
                      <p className="text-xs italic font-medium text-slate-600 mt-0.5">
                        {targetRole}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-700 sm:text-right space-y-0.5">
                      <p><span className="font-semibold text-slate-900">Phone:</span> {phone}</p>
                      <p><span className="font-semibold text-slate-900">Email:</span> {email}</p>
                      <p><span className="font-semibold text-slate-900">Address:</span> {address}</p>
                    </div>
                  </div>

                  {/* Sections Modern */}
                  <div className="space-y-4">
                    {sections.map((sec, sIdx) => {
                      const isSummary = sec.type === "SUMMARY" || sec.title.toLowerCase().includes("summary") || sec.title.toLowerCase().includes("ringkasan");
                      return (
                        <div key={sIdx} className="space-y-1.5">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-0.5">
                            {sec.title}
                          </h5>

                          {isSummary ? (
                            <div className="text-[11px] text-slate-700 leading-relaxed">
                              {sec.bullets.map((b) => (
                                <p key={b.id}>{b.finalText || b.originalText}</p>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {sec.bullets.map((b) => {
                                const text = b.finalText || b.originalText;
                                const isHeader = text.includes("|");
                                if (isHeader) {
                                  const parts = text.split("|").map((p) => p.trim());
                                  return (
                                    <div key={b.id} className="flex items-center justify-between pt-1 font-bold text-[11px] text-slate-900">
                                      <span>{parts[0]}</span>
                                      <span className="text-slate-600 font-medium text-[10px]">{parts.slice(1).join(" | ")}</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={b.id} className="flex items-start gap-2 pl-2 text-[11px] text-slate-700">
                                    <span className="text-slate-400">•</span>
                                    <span className="leading-relaxed">{text}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ================= Classic ATS Header (Mariana Napolitani) ================= */
                <div>
                  <div className="text-center border-b border-slate-300 pb-3 mb-4 space-y-1">
                    <h4 className="text-xl font-extrabold uppercase tracking-widest text-slate-900">
                      {fullName}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      {phone} | {email} | {address}
                    </p>
                  </div>

                  {/* Sections Classic */}
                  <div className="space-y-4">
                    {sections.map((sec, sIdx) => {
                      const isSummary = sec.type === "SUMMARY" || sec.title.toLowerCase().includes("summary") || sec.title.toLowerCase().includes("ringkasan");
                      return (
                        <div key={sIdx} className="space-y-1.5">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                            {sec.title}
                          </h5>

                          {isSummary ? (
                            <div className="text-[11px] text-slate-700 leading-relaxed">
                              {sec.bullets.map((b) => (
                                <p key={b.id}>{b.finalText || b.originalText}</p>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {sec.bullets.map((b) => {
                                const text = b.finalText || b.originalText;
                                const isHeader = text.includes("|");
                                if (isHeader) {
                                  const parts = text.split("|").map((p) => p.trim());
                                  return (
                                    <div key={b.id} className="flex items-center justify-between pt-1 font-bold text-[11px] text-slate-900">
                                      <span>{parts[0]}</span>
                                      <span className="text-slate-600 font-normal text-[10px]">{parts.slice(1).join(" | ")}</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={b.id} className="flex items-start gap-2 pl-2 text-[11px] text-slate-700">
                                    <span className="text-slate-400">•</span>
                                    <span className="leading-relaxed">{text}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-5">
            <textarea
              readOnly
              rows={12}
              value={plainText}
              className="w-full text-xs font-mono p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 leading-relaxed select-all"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Berhasil Disalin!" : "Salin Teks"}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              title="Cetak lewat dialog browser (atau Simpan sebagai PDF via browser)"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh TXT</span>
            </button>

            {/* Tombol Unduh PDF Cantik */}
            <button
              onClick={handleDirectDownloadPdf}
              disabled={isGeneratingPdf}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer ${
                pdfDownloaded
                  ? "bg-teal-600 hover:bg-teal-700"
                  : selectedStyle === "modern"
                  ? "bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400"
                  : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
              }`}
            >
              {pdfDownloaded ? <Check className="w-4 h-4" /> : <FileDown className="w-4 h-4" />}
              <span>
                {isGeneratingPdf
                  ? "Menyiapkan PDF..."
                  : pdfDownloaded
                  ? "PDF Berhasil Diunduh!"
                  : `Unduh PDF (${selectedStyle === "modern" ? "Alfredo Style" : "Mariana Style"})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
