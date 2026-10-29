import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateLineItem, 
  calculateSupplyType, 
  calculateTaxBreakdown, 
  calculateTotals 
} from '../src/domain/calculations/engine.ts';
import { 
  formatCurrency, 
  formatPDFCurrency, 
  roundToTwoDecimals 
} from '../src/types/invoice.ts';
import type { 
  LineItem, 
  Seller, 
  InvoiceMetadata 
} from '../src/types/invoice.ts';

const baseSeller: Seller = {
  name: 'Acme Design Studio',
  address: {
    line1: '123 MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    pincode: '560001',
    country: 'India',
  },
  gstin: '29ABCDE1234F1Z5',
};

const baseMetadata: InvoiceMetadata = {
  invoiceNumber: 'INV-001',
  invoiceDate: '2026-10-29',
  dueDate: '2026-11-28',
  placeOfSupply: '29',
  reverseCharge: false,
  invoiceType: 'B2B',
  currency: 'INR',
};

test('1. One-item invoice calculates accurately', () => {
  const item: Omit<LineItem, 'taxableAmount' | 'taxAmount' | 'totalAmount'> = {
    id: 'item-1',
    description: 'Logo Design',
    quantity: 1,
    unit: 'Nos',
    unitPrice: 5000,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  };
  const calculated = calculateLineItem(item, 'IntraState');
  assert.equal(calculated.taxableAmount, 5000);
  assert.equal(calculated.taxAmount, 900);
  assert.equal(calculated.totalAmount, 5900);

  const totals = calculateTotals([calculated], baseSeller, baseMetadata);
  assert.equal(totals.subtotal, 5000);
  assert.equal(totals.taxableValue, 5000);
  assert.equal(totals.cgst, 450);
  assert.equal(totals.sgst, 450);
  assert.equal(totals.igst, 0);
  assert.equal(totals.totalTax, 900);
  assert.equal(totals.grandTotal, 5900);
});

test('2. Multiple-item invoice aggregates correctly', () => {
  const items: LineItem[] = [
    {
      id: '1',
      description: 'Design',
      quantity: 1,
      unit: 'Nos',
      unitPrice: 25000,
      discountPercent: 0,
      discountAmount: 0,
      taxCategory: 'GST',
      taxRate: 18,
      taxableAmount: 25000,
      taxAmount: 4500,
      totalAmount: 25000,
    },
    {
      id: '2',
      description: 'Development',
      quantity: 1,
      unit: 'Nos',
      unitPrice: 45000,
      discountPercent: 0,
      discountAmount: 0,
      taxCategory: 'GST',
      taxRate: 18,
      taxableAmount: 45000,
      taxAmount: 8100,
      totalAmount: 45000,
    },
  ];

  const totals = calculateTotals(items, baseSeller, baseMetadata);
  assert.equal(totals.subtotal, 70000);
  assert.equal(totals.taxableValue, 70000);
  assert.equal(totals.cgst, 6300);
  assert.equal(totals.sgst, 6300);
  assert.equal(totals.totalTax, 12600);
  assert.equal(totals.grandTotal, 82600);
});

test('3. Different unit prices calculate correctly', () => {
  const item1 = calculateLineItem({
    id: '1',
    description: 'Low cost item',
    quantity: 10,
    unit: 'Pcs',
    unitPrice: 12.5,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 5,
  }, 'IntraState');
  assert.equal(item1.taxableAmount, 125);
  assert.equal(item1.taxAmount, 6.25);

  const item2 = calculateLineItem({
    id: '2',
    description: 'High cost item',
    quantity: 1,
    unit: 'Unit',
    unitPrice: 99999.99,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  }, 'IntraState');
  assert.equal(item2.taxableAmount, 99999.99);
  assert.equal(item2.taxAmount, 18000.00);
});

test('4. Quantity greater than one', () => {
  const item = calculateLineItem({
    id: '1',
    description: 'Hourly Consulting',
    quantity: 40,
    unit: 'Hours',
    unitPrice: 1500,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  }, 'IntraState');
  assert.equal(item.taxableAmount, 60000);
  assert.equal(item.taxAmount, 10800);
});

test('5. Decimal quantities (e.g. 2.5 hours, 0.75 kg)', () => {
  const item = calculateLineItem({
    id: '1',
    description: 'Fractional service',
    quantity: 2.5,
    unit: 'Hours',
    unitPrice: 1200,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  }, 'IntraState');
  assert.equal(item.taxableAmount, 3000);
  assert.equal(item.taxAmount, 540);
});

test('6. Discounts (percentage and flat amount)', () => {
  const itemWithPercent = calculateLineItem({
    id: '1',
    description: 'Percent Discounted',
    quantity: 2,
    unit: 'Nos',
    unitPrice: 1000,
    discountPercent: 10,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  }, 'IntraState');
  // Base 2000 - 10% (200) = 1800
  assert.equal(itemWithPercent.taxableAmount, 1800);
  assert.equal(itemWithPercent.taxAmount, 324);

  const itemWithAmount = calculateLineItem({
    id: '2',
    description: 'Amount Discounted',
    quantity: 1,
    unit: 'Nos',
    unitPrice: 5000,
    discountPercent: 0,
    discountAmount: 500,
    taxCategory: 'GST',
    taxRate: 18,
  }, 'IntraState');
  // Base 5000 - 500 = 4500
  assert.equal(itemWithAmount.taxableAmount, 4500);
  assert.equal(itemWithAmount.taxAmount, 810);
});

test('7. Item-level tax rates (0%, 5%, 12%, 18%, 28%)', () => {
  const rates = [0, 5, 12, 18, 28];
  for (const rate of rates) {
    const item = calculateLineItem({
      id: `item-${rate}`,
      description: `Rate ${rate}`,
      quantity: 1,
      unit: 'Nos',
      unitPrice: 1000,
      discountPercent: 0,
      discountAmount: 0,
      taxCategory: 'GST',
      taxRate: rate,
    }, 'IntraState');
    assert.equal(item.taxAmount, roundToTwoDecimals(1000 * (rate / 100)));
  }
});

test('8. Intra-state GST (CGST and SGST split evenly)', () => {
  assert.equal(calculateSupplyType('29', '29'), 'IntraState');
  const item: Omit<LineItem, 'taxableAmount' | 'taxAmount' | 'totalAmount' | 'cgst' | 'sgst' | 'igst'> = {
    id: '1',
    description: 'Item',
    quantity: 1,
    unit: 'Nos',
    unitPrice: 10000,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  };
  const calculated = calculateLineItem(item, 'IntraState');
  const breakdown = calculateTaxBreakdown([calculated], 'IntraState');
  assert.equal(breakdown.cgst, 900);
  assert.equal(breakdown.sgst, 900);
  assert.equal(breakdown.igst, 0);
  assert.equal(breakdown.totalTax, 1800);
});

test('9. Inter-state GST (IGST allocated completely)', () => {
  assert.equal(calculateSupplyType('29', '27'), 'InterState');
  const item: Omit<LineItem, 'taxableAmount' | 'taxAmount' | 'totalAmount' | 'cgst' | 'sgst' | 'igst'> = {
    id: '1',
    description: 'Item',
    quantity: 1,
    unit: 'Nos',
    unitPrice: 10000,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  };
  const calculated = calculateLineItem(item, 'InterState');
  const breakdown = calculateTaxBreakdown([calculated], 'InterState');
  assert.equal(breakdown.cgst, 0);
  assert.equal(breakdown.sgst, 0);
  assert.equal(breakdown.igst, 1800);
  assert.equal(breakdown.totalTax, 1800);
});

test('10. Zero-value line items', () => {
  const freeItem = calculateLineItem({
    id: 'free',
    description: 'Free sample',
    quantity: 1,
    unit: 'Nos',
    unitPrice: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  }, 'IntraState');
  assert.equal(freeItem.taxableAmount, 0);
  assert.equal(freeItem.taxAmount, 0);
  assert.equal(freeItem.totalAmount, 0);
});

test('11. Non-taxable / Exempt / NilRated cases', () => {
  const exempt = calculateLineItem({
    id: 'exempt',
    description: 'Exempt Goods',
    quantity: 1,
    unit: 'Nos',
    unitPrice: 5000,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'Exempt',
    taxRate: 18,
  }, 'IntraState');
  assert.equal(exempt.taxableAmount, 5000);
  assert.equal(exempt.taxAmount, 0);
});

test('12. Rounding behavior with floating point edges', () => {
  assert.equal(roundToTwoDecimals(1.005), 1.01);
  assert.equal(roundToTwoDecimals(1.004), 1.0);
  assert.equal(roundToTwoDecimals(19.999), 20.0);
  assert.equal(roundToTwoDecimals(0), 0);
});

test('13. Currency formatting for different currencies', () => {
  assert.ok(formatCurrency(150000, 'INR').includes('1,50,000'));
  assert.equal(formatPDFCurrency(150000, 'INR'), 'Rs. 1,50,000.00');
  assert.equal(formatPDFCurrency(2500, 'USD'), '$2,500.00');
  assert.ok(formatPDFCurrency(1200, 'EUR').includes('1.200,00'));
  assert.equal(formatPDFCurrency(850, 'GBP'), 'GBP 850.00');
});

test('14. Missing optional fields', () => {
  const minimalMetadata: InvoiceMetadata = {
    invoiceNumber: 'INV-002',
    invoiceDate: '2026-10-29',
    dueDate: '',
    placeOfSupply: '29',
    reverseCharge: false,
    invoiceType: 'B2C',
    currency: 'INR',
  };
  const minimalSeller: Seller = {
    name: 'Sole Freelancer',
    address: {
      line1: 'Home Office',
      city: 'Delhi',
      state: 'Delhi',
      stateCode: '07',
      pincode: '110001',
      country: 'India',
    },
  };
  const totals = calculateTotals([], minimalSeller, minimalMetadata);
  assert.equal(totals.grandTotal, 0);
  assert.equal(totals.totalTax, 0);
});

test('15. Invalid numerical input gracefully handled', () => {
  const safeItem = calculateLineItem({
    id: 'nan-test',
    description: 'Bad input',
    quantity: NaN,
    unit: 'Nos',
    unitPrice: -500,
    discountPercent: 150,
    discountAmount: -10,
    taxCategory: 'GST',
    taxRate: NaN,
  }, 'IntraState');
  assert.equal(safeItem.quantity, 0);
  assert.equal(safeItem.unitPrice, 0);
  assert.equal(safeItem.discountPercent, 100);
  assert.equal(safeItem.taxableAmount, 0);
  assert.equal(safeItem.taxAmount, 0);
});

test('16. Large amounts do not overflow or lose cents', () => {
  const largeItem = calculateLineItem({
    id: 'large',
    description: 'Enterprise contract',
    quantity: 1,
    unit: 'Contract',
    unitPrice: 10000000.55,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'GST',
    taxRate: 18,
  }, 'IntraState');
  assert.equal(largeItem.taxableAmount, 10000000.55);
  assert.equal(largeItem.taxAmount, 1800000.10);
});

test('17. Non-INR currency (USD with decimal sub-totals)', () => {
  const usdMeta: InvoiceMetadata = {
    ...baseMetadata,
    currency: 'USD',
    invoiceType: 'Export',
  };
  const item: LineItem = {
    id: '1',
    description: 'Web development',
    quantity: 35.5,
    unit: 'Hours',
    unitPrice: 75.25,
    discountPercent: 5,
    discountAmount: 0,
    taxCategory: 'NonGST',
    taxRate: 0,
    taxableAmount: 2537.81,
    taxAmount: 0,
    totalAmount: 2537.81,
  };
  const totals = calculateTotals([item], baseSeller, usdMeta);
  // Base: 35.5 * 75.25 = 2671.375 -> discount 5% = 133.56875 -> taxable: 2537.81
  assert.equal(totals.subtotal, 2671.38);
  assert.equal(totals.taxableValue, 2537.81);
  assert.equal(totals.totalTax, 0);
  assert.equal(totals.grandTotal, 2537.81);
});

test('18. Configuration where tax rows must be omitted', () => {
  const exportMeta: InvoiceMetadata = {
    ...baseMetadata,
    invoiceType: 'Export',
  };
  const item: LineItem = {
    id: '1',
    description: 'Exported Services',
    quantity: 1,
    unit: 'Service',
    unitPrice: 50000,
    discountPercent: 0,
    discountAmount: 0,
    taxCategory: 'ZeroRated' as any,
    taxRate: 0,
    taxableAmount: 50000,
    taxAmount: 0,
    totalAmount: 50000,
  };
  const totals = calculateTotals([item], baseSeller, exportMeta);
  assert.equal(totals.cgst, 0);
  assert.equal(totals.sgst, 0);
  assert.equal(totals.igst, 0);
  assert.equal(totals.totalTax, 0);
  assert.equal(totals.grandTotal, 50000);
});
