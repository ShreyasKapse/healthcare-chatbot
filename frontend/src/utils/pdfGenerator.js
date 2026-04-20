import jsPDF from 'jspdf';

export const generateConsultationPDF = (messages, userProfile, userName) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Medical Consultation Summary", margin, yPos);
    yPos += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, yPos);
    yPos += 5;
    doc.text(`Patient: ${userName || 'Guest'}`, margin, yPos);
    yPos += 10;

    // Draw divider line
    doc.setDrawColor(200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(150);
    const disclaimer = "DISCLAIMER: This document is an AI-generated summary of a chat consultation. It is for informational purposes only and does not constitute professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
    doc.text(disclaimerLines, margin, yPos);
    yPos += (disclaimerLines.length * 4) + 10;

    // Content
    doc.setFontSize(12);

    messages.forEach((msg) => {
        // Check page break
        if (yPos > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yPos = 20;
        }

        const role = msg.is_user ? (userName || "You") : "HealthAI";
        const color = msg.is_user ? [50, 50, 50] : [0, 102, 204]; // Dark gray vs Blue

        doc.setTextColor(...color);
        doc.setFont(undefined, 'bold');
        doc.text(`${role}:`, margin, yPos);
        yPos += 5;

        doc.setFont(undefined, 'normal');
        doc.setTextColor(0);

        // Clean text (remove markdown-like chars if simple)
        const cleanContent = msg.content.replace(/\*/g, '').replace(/#/g, '');
        const lines = doc.splitTextToSize(cleanContent, contentWidth);
        doc.text(lines, margin, yPos);

        yPos += (lines.length * 5) + 8; // Spacing between messages
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save(`HealthAI_Consultation_${new Date().toISOString().slice(0, 10)}.pdf`);
};
