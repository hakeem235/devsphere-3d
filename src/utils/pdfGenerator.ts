import { jsPDF } from 'jspdf';
import { Project } from '../types';
import { DEVELOPER_PROFILE } from '../data/portfolioData';

/**
 * Generates an executive, beautifully formatted printable PDF case study for a project.
 */
export function generateProjectCaseStudyPDF(project: Project): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Helper for adding lines & borders
  const drawDivider = (y: number, color: [number, number, number] = [226, 232, 240]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // 1. Header Bar: Branding & Document Type
  doc.setFillColor(11, 18, 34); // Slate 900 dark header
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(56, 189, 248); // Cyan 400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('AHMED HAKEEM  |  SENIOR WEB & MOBILE ARCHITECT', margin, 12);

  doc.setTextColor(203, 213, 225); // Slate 300
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ENGINEERING CASE STUDY & ARCHITECTURAL BRIEF', margin, 18);

  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(
    `PORTFOLIO DOSSIER • GENERATED: ${new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })}`,
    pageWidth - margin,
    18,
    { align: 'right' }
  );

  cursorY = 38;

  // 2. Project Title & Category
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(project.title, margin, cursorY);

  cursorY += 7;
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`${project.subtitle}  •  Platform: ${project.platform}`, margin, cursorY);

  cursorY += 8;
  drawDivider(cursorY, [203, 213, 225]);
  cursorY += 8;

  // 3. Quick Stats & Project Attributes Banner
  if (project.quickStats) {
    doc.setFillColor(248, 250, 252); // Light slate background
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, cursorY, contentWidth, 14, 2, 2, 'FD');

    const colWidth = contentWidth / 4;
    const statsY = cursorY + 9;

    // Timeline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TIMELINE:', margin + 4, cursorY + 5);
    doc.setTextColor(15, 23, 42);
    doc.text(project.quickStats.duration, margin + 4, statsY);

    // Tech Count
    doc.setTextColor(100, 116, 139);
    doc.text('TECH STACK:', margin + colWidth + 4, cursorY + 5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${project.quickStats.techCount} Technologies`, margin + colWidth + 4, statsY);

    // Stars / Impact
    doc.setTextColor(100, 116, 139);
    doc.text('ADOPTION / STARS:', margin + colWidth * 2 + 4, cursorY + 5);
    doc.setTextColor(15, 23, 42);
    doc.text(project.quickStats.githubStars, margin + colWidth * 2 + 4, statsY);

    // Role
    doc.setTextColor(100, 116, 139);
    doc.text('ENGINEERING ROLE:', margin + colWidth * 3 + 4, cursorY + 5);
    doc.setTextColor(15, 23, 42);
    doc.text(project.quickStats.teamRole || 'Lead Engineer', margin + colWidth * 3 + 4, statsY);

    cursorY += 20;
  }

  // 4. Primary Metrics Highlights (3 Key Metric Cards)
  const metricBoxWidth = (contentWidth - 6) / 3;
  project.metrics.forEach((m, idx) => {
    const boxX = margin + idx * (metricBoxWidth + 3);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(boxX, cursorY, metricBoxWidth, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label.toUpperCase(), boxX + metricBoxWidth / 2, cursorY + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199); // Ocean Blue
    doc.text(m.value, boxX + metricBoxWidth / 2, cursorY + 12, { align: 'center' });
  });

  cursorY += 24;

  // 5. Executive Summary & Overview
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('EXECUTIVE SUMMARY & ENGINEERING RATIONALE', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(project.longDescription, contentWidth);
  doc.text(descLines, margin, cursorY);
  cursorY += descLines.length * 4.6 + 6;

  // 6. Key Achievements & Highlights
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('KEY TECHNICAL ACHIEVEMENTS & OUTCOMES', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  project.highlights.forEach((h) => {
    doc.setTextColor(14, 165, 233); // Cyan bullet
    doc.text('•', margin, cursorY);
    doc.setTextColor(51, 65, 85);
    const hLines = doc.splitTextToSize(h, contentWidth - 6);
    doc.text(hLines, margin + 5, cursorY);
    cursorY += hLines.length * 4.2 + 2;
  });

  cursorY += 4;

  // 7. System Architecture
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SYSTEM & INFRASTRUCTURE ARCHITECTURE', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  project.architecture.forEach((arch) => {
    doc.setTextColor(99, 102, 241); // Indigo bullet
    doc.text('›', margin, cursorY);
    doc.setTextColor(51, 65, 85);
    const archLines = doc.splitTextToSize(arch, contentWidth - 6);
    doc.text(archLines, margin + 5, cursorY);
    cursorY += archLines.length * 4.2 + 1.5;
  });

  cursorY += 5;

  // 8. Core Technologies Stack Tags
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('CORE TECHNOLOGIES & TOOLING', margin, cursorY);
  cursorY += 5;

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const techText = project.tags.join('  •  ');
  const techLines = doc.splitTextToSize(techText, contentWidth);
  doc.text(techLines, margin, cursorY);

  // 9. Document Footer
  const footerY = pageHeight - 12;
  drawDivider(footerY - 4, [226, 232, 240]);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `DevDimension Portfolio  •  Contact: ${DEVELOPER_PROFILE.email}  •  Ahmed Hakeem`,
    margin,
    footerY
  );
  doc.text('CONFIDENTIAL ARCHITECTURAL CASE STUDY  |  PAGE 1 OF 1', pageWidth - margin, footerY, {
    align: 'right',
  });

  // Download PDF file
  const fileName = `${project.id}-case-study-ahmed-hakeem.pdf`;
  doc.save(fileName);
}
