import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from '../types/invoice.ts';
import { formatPDFCurrency, getCurrencyOption, roundToTwoDecimals } from '../types/invoice.ts';

let cachedGajrajBase64: string | null = null;

export function setCachedGajrajBase64(base64: string): void {
  cachedGajrajBase64 = base64;
}

export async function loadGajrajFontBase64(): Promise<string | null> {
  if (cachedGajrajBase64) return cachedGajrajBase64;
  
  try {
    if (typeof fetch === 'function') {
      const response = await fetch('/GajrajOne-Regular.ttf');
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        cachedGajrajBase64 = btoa(binary);
        return cachedGajrajBase64;
      }
    }
  } catch (err) {
    console.warn('Could not load GajrajOne font for PDF:', err);
  }
  return null;
}

export async function ensureGajrajFont(doc: jsPDF): Promise<boolean> {
  const base64 = await loadGajrajFontBase64();
  if (base64) {
    try {
      doc.addFileToVFS('GajrajOne-Regular.ttf', base64);
      doc.addFont('GajrajOne-Regular.ttf', 'GajrajOne', 'normal');
      return true;
    } catch (err) {
      console.warn('Failed to register GajrajOne font in jsPDF instance:', err);
    }
  }
  return false;
}

function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

interface DrawOptions {
  margin: number;
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
  hasGajraj: boolean;
}

function drawHeader(doc: jsPDF, invoice: Invoice, y: number, options: DrawOptions): number {
  const { margin, pageWidth, hasGajraj } = options;
  const currency = invoice.metadata.currency || 'INR';
  const locale = getCurrencyOption(currency).locale;

  // 1. Khata wordmark on top-left
  if (hasGajraj) {
    doc.setFont('GajrajOne', 'normal');
    doc.setFontSize(26);
    doc.setTextColor(17, 24, 39); // #111827
    doc.text('खाता', margin, y + 6);
  } else {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(17, 24, 39);
    doc.text('KHATA', margin, y + 6);
  }

  // Optional business logo next to wordmark if uploaded
  if (invoice.customization?.logo && invoice.customization.logo.startsWith('data:image/')) {
    try {
      doc.addImage(invoice.customization.logo, 'PNG', margin + 40, y - 2, 28, 14);
    } catch {
      // Continue gracefully if image format fails
    }
  }

  // 2. INVOICE title directly beneath the wordmark
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55); // #1f2937
  // Render letter spaced INVOICE
  doc.text('I N V O I C E', margin, y + 15);

  // 3. Metadata aligned at upper right
  const rightX = pageWidth - margin;
  const labelX = rightX - 52;
  
  let metaY = y;
  
  // Invoice #
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(107, 114, 128); // #6b7280
  doc.text('Invoice #', labelX, metaY);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(invoice.metadata.invoiceNumber || '-', rightX, metaY, { align: 'right' });
  metaY += 5.5;

  // Date
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(107, 114, 128);
  doc.text('Date', labelX, metaY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(formatDate(invoice.metadata.invoiceDate, locale) || '-', rightX, metaY, { align: 'right' });
  metaY += 5.5;

  // Due Date (if present)
  if (invoice.metadata.dueDate) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text('Due Date', labelX, metaY);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(formatDate(invoice.metadata.dueDate, locale), rightX, metaY, { align: 'right' });
    metaY += 5.5;
  }

  y = Math.max(y + 20, metaY + 3);

  // Thin horizontal rule beneath header (as shown in reference image)
  doc.setDrawColor(229, 231, 235); // #e5e7eb
  doc.setLineWidth(0.35);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  return y;
}

function drawParties(doc: jsPDF, invoice: Invoice, y: number, options: DrawOptions): number {
  const { margin, contentWidth } = options;
  const colWidth = (contentWidth - 16) / 2;
  const rightColX = margin + colWidth + 16;
  const startY = y;

  // Left Column: FROM
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(107, 114, 128);
  doc.text('From', margin, y);

  // Right Column: BILL TO
  doc.text('Bill To', rightColX, y);
  y += 5;

  // Seller Name (bold)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(17, 24, 39);
  doc.text(invoice.seller.name || 'Seller Business Name', margin, y);

  // Customer Name (bold)
  doc.text(invoice.customer.name || 'Customer Name', rightColX, y);
  y += 5;

  // Address lines
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);

  let leftY = y;
  const sellerAddr = invoice.seller.address;
  if (sellerAddr?.line1) {
    doc.text(sellerAddr.line1, margin, leftY);
    leftY += 4.2;
  }
  if (sellerAddr?.line2) {
    doc.text(sellerAddr.line2, margin, leftY);
    leftY += 4.2;
  }
  const sellerCityState = [sellerAddr?.city, sellerAddr?.state ? `${sellerAddr.state} ${sellerAddr?.pincode || ''}`.trim() : sellerAddr?.pincode].filter(Boolean).join(', ');
  if (sellerCityState) {
    doc.text(sellerCityState, margin, leftY);
    leftY += 4.2;
  }
  if (sellerAddr?.country) {
    doc.text(sellerAddr.country, margin, leftY);
    leftY += 4.2;
  }

  // Key-values for seller: GSTIN, Email, Phone
  leftY += 2;
  const metaLabelWidth = 15;
  if (invoice.seller.gstin) {
    doc.setTextColor(107, 114, 128);
    doc.text('GSTIN', margin, leftY);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.seller.gstin, margin + metaLabelWidth, leftY);
    leftY += 4.2;
  }
  if (invoice.seller.email) {
    doc.setTextColor(107, 114, 128);
    doc.text('Email', margin, leftY);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.seller.email, margin + metaLabelWidth, leftY);
    leftY += 4.2;
  }
  if (invoice.seller.phone) {
    doc.setTextColor(107, 114, 128);
    doc.text('Phone', margin, leftY);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.seller.phone, margin + metaLabelWidth, leftY);
    leftY += 4.2;
  }

  // Right Column: Customer details
  let rightY = y;
  const custAddr = invoice.customer.address;
  if (custAddr?.line1) {
    doc.text(custAddr.line1, rightColX, rightY);
    rightY += 4.2;
  }
  if (custAddr?.line2) {
    doc.text(custAddr.line2, rightColX, rightY);
    rightY += 4.2;
  }
  const custCityState = [custAddr?.city, custAddr?.state ? `${custAddr.state} ${custAddr?.pincode || ''}`.trim() : custAddr?.pincode].filter(Boolean).join(', ');
  if (custCityState) {
    doc.text(custCityState, rightColX, rightY);
    rightY += 4.2;
  }
  if (custAddr?.country) {
    doc.text(custAddr.country, rightColX, rightY);
    rightY += 4.2;
  }

  // Key-values for customer
  rightY += 2;
  if (invoice.customer.gstin) {
    doc.setTextColor(107, 114, 128);
    doc.text('GSTIN', rightColX, rightY);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.customer.gstin, rightColX + metaLabelWidth, rightY);
    rightY += 4.2;
  }
  if (invoice.customer.email) {
    doc.setTextColor(107, 114, 128);
    doc.text('Email', rightColX, rightY);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.customer.email, rightColX + metaLabelWidth, rightY);
    rightY += 4.2;
  }
  if (invoice.customer.phone) {
    doc.setTextColor(107, 114, 128);
    doc.text('Phone', rightColX, rightY);
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.customer.phone, rightColX + metaLabelWidth, rightY);
    rightY += 4.2;
  }

  const maxY = Math.max(leftY, rightY);
  return Math.max(maxY + 4, startY + 28);
}

function drawItemsTable(doc: jsPDF, invoice: Invoice, y: number, options: DrawOptions): number {
  const { margin } = options;
  const currency = invoice.metadata.currency || 'INR';

  const hasHsn = invoice.items.some(i => Boolean(i.hsnSac?.trim()));
  const hasDiscount = true; // Always display Disc % column to match standard reference layout
  const hasTax = invoice.items.some(i => (i.taxRate || 0) > 0);

  const headRow: string[] = ['#', 'Description'];
  if (hasHsn) headRow.push('HSN/SAC');
  headRow.push('Qty', 'Unit', 'Unit Price');
  if (hasDiscount) headRow.push('Disc %');
  if (hasTax) headRow.push('Tax Rate');
  headRow.push('Amount');

  const rows = invoice.items.map((item, index) => {
    const row: string[] = [
      String(index + 1),
      item.description || 'Item description',
    ];
    if (hasHsn) {
      row.push(item.hsnSac || '-');
    }
    row.push(
      String(item.quantity),
      item.unit || 'Nos',
      formatPDFCurrency(item.unitPrice, currency),
    );
    if (hasDiscount) {
      row.push(`${item.discountPercent || 0}%`);
    }
    if (hasTax) {
      row.push(`${item.taxRate || 0}%`);
    }
    row.push(formatPDFCurrency(item.totalAmount, currency));
    return row;
  });

  // Calculate dynamic column styles based on included columns
  const columnStyles: Record<number, { cellWidth?: number | 'auto'; halign?: 'left' | 'center' | 'right'; minCellWidth?: number }> = {};
  
  let colIdx = 0;
  columnStyles[colIdx++] = { cellWidth: 8, halign: 'center' }; // #
  columnStyles[colIdx++] = { cellWidth: 'auto', halign: 'left', minCellWidth: 38 }; // Description
  if (hasHsn) columnStyles[colIdx++] = { cellWidth: 18, halign: 'center' };
  columnStyles[colIdx++] = { cellWidth: 10, halign: 'center' }; // Qty
  columnStyles[colIdx++] = { cellWidth: 12, halign: 'center' }; // Unit
  columnStyles[colIdx++] = { cellWidth: 22, halign: 'right' }; // Unit Price
  if (hasDiscount) columnStyles[colIdx++] = { cellWidth: 14, halign: 'center' };
  if (hasTax) columnStyles[colIdx++] = { cellWidth: 16, halign: 'center' };
  columnStyles[colIdx++] = { cellWidth: 24, halign: 'right' }; // Amount

  autoTable(doc, {
    startY: y,
    head: [headRow],
    body: rows,
    margin: { top: 16, bottom: 20, left: margin, right: margin },
    theme: 'plain',
    headStyles: {
      fillColor: [244, 245, 247], // #f4f5f7 as in reference
      textColor: [75, 85, 99],    // #4b5563
      fontSize: 8,
      fontStyle: 'bold',
      font: 'Helvetica',
      halign: 'center',
      cellPadding: { top: 3.2, bottom: 3.2, left: 2, right: 2 },
    },
    bodyStyles: {
      fontSize: 8,
      font: 'Helvetica',
      textColor: [31, 41, 55],    // #1f2937
      lineColor: [229, 231, 235], // #e5e7eb thin row separator
      lineWidth: 0.2,
      cellPadding: { top: 3.8, bottom: 3.8, left: 2, right: 2 },
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    columnStyles,
  });

  return (doc as any).lastAutoTable.finalY + 6;
}

function drawTotals(doc: jsPDF, invoice: Invoice, y: number, options: DrawOptions): number {
  const { margin, contentWidth, pageHeight } = options;
  const totals = invoice.totals;
  const currency = invoice.metadata.currency || 'INR';
  const rightX = margin + contentWidth;
  const summaryWidth = 78;
  const labelX = rightX - summaryWidth;

  // Check if we have enough room on page for totals + bottom sections (~70mm)
  if (y + 70 > pageHeight - margin) {
    doc.addPage();
    y = margin + 5;
  }

  doc.setFontSize(8.5);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(75, 85, 99);

  const drawRow = (label: string, value: string) => {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(label, labelX, y);
    doc.setTextColor(17, 24, 39);
    doc.text(value, rightX, y, { align: 'right' });
    y += 5.2;
  };

  // 1. Subtotal
  drawRow('Subtotal', formatPDFCurrency(totals.subtotal, currency));

  // 2. Total Discount (matches reference image with "- Rs. 0.00" when 0)
  if (totals.totalDiscount > 0) {
    drawRow('Total Discount', `- ${formatPDFCurrency(totals.totalDiscount, currency)}`);
  } else {
    drawRow('Total Discount', `- ${formatPDFCurrency(0, currency)}`);
  }

  // 3. Taxable Value
  drawRow('Taxable Value', formatPDFCurrency(totals.taxableValue, currency));

  // 4. Tax components - calculate effective rates from actual amounts
  const taxableValue = totals.taxableValue || 0;
  
  if (totals.cgst > 0) {
    const cgstRate = taxableValue > 0 ? roundToTwoDecimals((totals.cgst / taxableValue) * 100) : 0;
    drawRow(`CGST (${cgstRate}%)`, formatPDFCurrency(totals.cgst, currency));
  }
  if (totals.sgst > 0) {
    const sgstRate = taxableValue > 0 ? roundToTwoDecimals((totals.sgst / taxableValue) * 100) : 0;
    drawRow(`SGST (${sgstRate}%)`, formatPDFCurrency(totals.sgst, currency));
  }
  if (totals.igst > 0) {
    const igstRate = taxableValue > 0 ? roundToTwoDecimals((totals.igst / taxableValue) * 100) : 0;
    drawRow(`IGST (${igstRate}%)`, formatPDFCurrency(totals.igst, currency));
  }

  // 5. Grand Total Card (prominent with restrained light gray background as in reference)
  y += 2;
  const boxHeight = 11;
  const boxY = y - 3.5;
  doc.setFillColor(243, 244, 246); // #f3f4f6
  doc.roundedRect(labelX - 3, boxY, summaryWidth + 3, boxHeight, 2, 2, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text('Total', labelX, y + 3.5);

  doc.setFontSize(11.5);
  doc.text(formatPDFCurrency(totals.grandTotal, currency), rightX, y + 3.5, { align: 'right' });
  y += boxHeight + 4;

  return y;
}

function drawNotesAndPayment(doc: jsPDF, invoice: Invoice, y: number, options: DrawOptions): number {
  const { margin, contentWidth, pageHeight, hasGajraj } = options;
  const colWidth = (contentWidth - 16) / 2;
  const rightColX = margin + colWidth + 16;

  // Check if we need a page break before notes & payment
  if (y + 40 > pageHeight - margin) {
    doc.addPage();
    y = margin + 5;
  }

  // Horizontal divider before notes/payment (as in reference)
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  const sectionStartY = y;

  // Left Column: Notes
  let notesEndY = y;
  if (invoice.metadata.notes) {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text('Notes', margin, y);
    y += 4.5;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    const splitNotes = doc.splitTextToSize(invoice.metadata.notes, colWidth);
    doc.text(splitNotes, margin, y);
    notesEndY = y + (splitNotes.length * 3.8);
  }

  // Right Column: Payment Details
  let paymentEndY = sectionStartY;
  const bank = invoice.seller.bankDetails;
  if (bank && (bank.accountNumber || bank.bankName)) {
    let py = sectionStartY;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text('Payment Details', rightColX, py);
    py += 4.5;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    
    const bankLabelWidth = 28;
    const addBankRow = (label: string, val?: string) => {
      if (!val) return;
      doc.setTextColor(107, 114, 128);
      doc.text(label, rightColX, py);
      doc.setTextColor(17, 24, 39);
      doc.text(val, rightColX + bankLabelWidth, py);
      py += 3.8;
    };

    addBankRow('Bank Name', bank.bankName);
    addBankRow('Account Name', bank.accountName);
    addBankRow('Account Number', bank.accountNumber);
    addBankRow('IFSC Code', bank.ifsc);
    addBankRow('Account Type', bank.accountType || bank.branch || 'Current Account');

    paymentEndY = py;
  }

  y = Math.max(notesEndY, paymentEndY) + 4;

  // Terms & Conditions and Closing Brand Divider
  const hasTerms = Boolean(invoice.metadata.paymentTerms?.trim());
  if (hasTerms || hasGajraj) {
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;

    const termsStartY = y;

    // Terms & Conditions (Left)
    if (hasTerms) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text('Terms & Conditions', margin, y);
      y += 4.5;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(75, 85, 99);
      const splitTerms = doc.splitTextToSize(invoice.metadata.paymentTerms || '', colWidth + 10);
      doc.text(splitTerms, margin, y);
    }

    // Thank you for your business! — खाता (Right)
    const rightSideX = margin + contentWidth;
    let closingY = termsStartY + 3;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text('Thank you for your business!', rightSideX, closingY, { align: 'right' });
    closingY += 4.5;

    doc.setTextColor(156, 163, 175);
    doc.text('—', rightSideX - 12, closingY, { align: 'right' });

    if (hasGajraj) {
      doc.setFont('GajrajOne', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(17, 24, 39);
      doc.text('खाता', rightSideX, closingY + 1, { align: 'right' });
    }
  }

  return y;
}

export function sanitizeInvoiceFilename(invoiceNumber: string): string {
  const clean = (invoiceNumber || 'INV').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `Invoice-${clean}.pdf`;
}

export async function generatePDF(invoice: Invoice): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const hasGajraj = await ensureGajrajFont(doc);

  const margin = 18;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - 2 * margin;

  let y = margin;

  const options: DrawOptions = {
    margin,
    pageWidth,
    pageHeight,
    contentWidth,
    hasGajraj,
  };

  y = drawHeader(doc, invoice, y, options);
  y = drawParties(doc, invoice, y, options);
  y = drawItemsTable(doc, invoice, y, options);
  y = drawTotals(doc, invoice, y, options);
  y = drawNotesAndPayment(doc, invoice, y, options);

  // Add page numbers on multipage documents
  const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : doc.getNumberOfPages();
  if (pageCount > 1) {
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(156, 163, 175);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  }

  // If running in browser, initiate user download
  if (typeof window !== 'undefined' && typeof doc.save === 'function') {
    const filename = sanitizeInvoiceFilename(invoice.metadata.invoiceNumber);
    doc.save(filename);
  }

  return doc;
}
