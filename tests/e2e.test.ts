import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generatePDF, sanitizeInvoiceFilename, setCachedGajrajBase64 } from '../src/services/pdf.ts';
import { recalculateInvoice } from '../src/domain/calculations/engine.ts';
import { validateInvoice } from '../src/domain/validation/validator.ts';
import type { Invoice } from '../src/types/invoice.ts';

// Pre-load font for Node environment tests
const fontPath = path.resolve(process.cwd(), 'public/GajrajOne-Regular.ttf');
if (fs.existsSync(fontPath)) {
  setCachedGajrajBase64(fs.readFileSync(fontPath).toString('base64'));
}

function createTestInvoice(): Invoice {
  return {
    id: 'INV-20261029-S93COW',
    metadata: {
      invoiceNumber: 'INV-20261029-S93COW',
      invoiceDate: '2026-10-29',
      dueDate: '2026-11-28',
      placeOfSupply: '29',
      reverseCharge: false,
      invoiceType: 'B2B',
      currency: 'INR',
      notes: 'Thank you for your business.\nThis invoice is for website design and development services as discussed.',
      paymentTerms: '1. Payment is due within 30 days from the date of this invoice.\n2. Please make the payment to the bank account mentioned above.\n3. For any queries, feel free to contact us.'
    },
    seller: {
      name: 'Acme Design Studio',
      address: {
        line1: '123 MG Road, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        stateCode: '29',
        pincode: '560001',
        country: 'India'
      },
      gstin: '29ABCDE1234F1Z5',
      email: 'hello@acmedesign.in',
      phone: '+91 98765 43210',
      bankDetails: {
        bankName: 'HDFC Bank',
        accountName: 'Acme Design Studio',
        accountNumber: '1234 5678 9012',
        ifsc: 'HDFC0001234',
        branch: 'Bengaluru',
        accountType: 'Current Account'
      }
    },
    customer: {
      name: 'TechCorp Solutions',
      address: {
        line1: '456 Commercial Street, Fort',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        pincode: '400001',
        country: 'India'
      },
      gstin: '27ABCDE5678G1Z9',
      email: 'accounts@techcorp.in',
      phone: '+91 98765 67890'
    },
    items: [
      { id: '1', description: 'Website Design (Landing Page)', hsnSac: '998313', quantity: 1, unit: 'Nos', unitPrice: 25000, discountPercent: 0, discountAmount: 0, taxCategory: 'GST', taxRate: 18, taxableAmount: 25000, taxAmount: 4500, totalAmount: 25000 },
      { id: '2', description: 'Development (Frontend)', hsnSac: '998313', quantity: 1, unit: 'Nos', unitPrice: 45000, discountPercent: 0, discountAmount: 0, taxCategory: 'GST', taxRate: 18, taxableAmount: 45000, taxAmount: 8100, totalAmount: 45000 },
      { id: '3', description: 'Development (Backend)', hsnSac: '998313', quantity: 1, unit: 'Nos', unitPrice: 60000, discountPercent: 0, discountAmount: 0, taxCategory: 'GST', taxRate: 18, taxableAmount: 60000, taxAmount: 10800, totalAmount: 60000 },
      { id: '4', description: 'Maintenance (3 Months)', hsnSac: '998315', quantity: 1, unit: 'Nos', unitPrice: 20000, discountPercent: 0, discountAmount: 0, taxCategory: 'GST', taxRate: 18, taxableAmount: 20000, taxAmount: 3600, totalAmount: 20000 },
    ],
    totals: {
      subtotal: 150000,
      totalDiscount: 0,
      taxableValue: 150000,
      cgst: 13500,
      sgst: 13500,
      igst: 0,
      totalTax: 27000,
      roundOff: 0,
      grandTotal: 177000,
      amountPaid: 0,
      balanceDue: 177000
    },
    customization: {
      template: 'modern',
      accentColor: '#2563eb',
      fontFamily: 'Inter',
      logoPosition: 'left'
    },
    createdAt: '2026-10-29',
    updatedAt: '2026-10-29'
  };
}

test('E2E Step 1: Validate initial invoice matching reference', () => {
  const invoice = createTestInvoice();
  const validation = validateInvoice(invoice);
  assert.equal(validation.isValid, true, 'Invoice must be valid');
  assert.equal(validation.errors.length, 0);
});

test('E2E Step 2: Generate first PDF and verify bytes and filename', async () => {
  const invoice = createTestInvoice();
  const filename = sanitizeInvoiceFilename(invoice.metadata.invoiceNumber);
  assert.equal(filename, 'Invoice-INV-20261029-S93COW.pdf');

  const doc = await generatePDF(invoice);
  const pdfBytes = Buffer.from(doc.output('arraybuffer'));
  assert.ok(pdfBytes.length > 5000, 'PDF bytes should be substantial');

  const outputPath = path.resolve(process.cwd(), '../e2e_first_run.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  assert.ok(fs.existsSync(outputPath), 'PDF file must be written to disk');
});

test('E2E Step 3: Modify input, recalculate, and generate second PDF with latest values', async () => {
  const invoice = createTestInvoice();
  
  // Modify: Update quantity of first item from 1 to 2, add 10% discount to second item
  invoice.items[0].quantity = 2; // Was 25k, now 50k
  invoice.items[1].discountPercent = 10; // Was 45k, now 40.5k

  // Recalculate using domain calculation engine
  const { items, totals } = recalculateInvoice(invoice.items, invoice.seller, invoice.customer, invoice.metadata);
  invoice.items = items;
  invoice.totals = totals;

  // Expected calculations:
  // Item 0: 2 * 25000 = 50,000, tax (18%) = 9,000
  // Item 1: 45000 - 10% (4500) = 40,500, tax (18%) = 7,290
  // Item 2: 60,000, tax = 10,800
  // Item 3: 20,000, tax = 3,600
  // Subtotal = 50000 + 45000 + 60000 + 20000 = 175,000
  // Total Discount = 4,500
  // Taxable Value = 50000 + 40500 + 60000 + 20000 = 170,500
  // Tax = 9000 + 7290 + 10800 + 3600 = 30,690
  // IntraState: CGST = 15,345, SGST = 15,345
  // Grand Total = 170,500 + 30,690 = 201,190

  assert.equal(totals.subtotal, 175000);
  assert.equal(totals.totalDiscount, 4500);
  assert.equal(totals.taxableValue, 170500);
  assert.equal(totals.cgst, 15345);
  assert.equal(totals.sgst, 15345);
  assert.equal(totals.grandTotal, 201190);

  // Generate second PDF
  const doc2 = await generatePDF(invoice);
  const pdfBytes2 = Buffer.from(doc2.output('arraybuffer'));
  assert.ok(pdfBytes2.length > 5000);

  const outputPath2 = path.resolve(process.cwd(), '../e2e_second_run.pdf');
  fs.writeFileSync(outputPath2, pdfBytes2);
  assert.ok(fs.existsSync(outputPath2));
});

test('E2E Step 4: USD International invoice calculation and PDF export', async () => {
  const invoice = createTestInvoice();
  invoice.metadata.currency = 'USD';
  invoice.metadata.invoiceType = 'Export';
  invoice.seller.address.country = 'United States';
  invoice.seller.address.state = 'California';
  invoice.seller.address.stateCode = 'CA';
  invoice.seller.address.pincode = '94103';
  invoice.customer.address.country = 'United Kingdom';
  invoice.customer.address.state = 'London';
  invoice.customer.address.stateCode = 'LDN';
  invoice.customer.address.pincode = 'EC1A 1BB';

  invoice.items = [
    {
      id: 'item-usd-1',
      description: 'Cloud Architecture Consulting',
      quantity: 10,
      unit: 'Hours',
      unitPrice: 150.00,
      discountPercent: 0,
      discountAmount: 0,
      taxCategory: 'NonGST',
      taxRate: 0,
      taxableAmount: 1500,
      taxAmount: 0,
      totalAmount: 1500,
    }
  ];

  const { items, totals } = recalculateInvoice(invoice.items, invoice.seller, invoice.customer, invoice.metadata);
  invoice.items = items;
  invoice.totals = totals;

  assert.equal(totals.subtotal, 1500);
  assert.equal(totals.taxableValue, 1500);
  assert.equal(totals.totalTax, 0);
  assert.equal(totals.grandTotal, 1500);

  const doc = await generatePDF(invoice);
  const pdfBytes = Buffer.from(doc.output('arraybuffer'));
  assert.ok(pdfBytes.length > 5000);

  const outputPath = path.resolve(process.cwd(), '../e2e_usd_export.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  assert.ok(fs.existsSync(outputPath));
});
