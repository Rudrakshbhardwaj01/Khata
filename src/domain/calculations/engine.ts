import type { LineItem, InvoiceTotals, Seller, InvoiceMetadata } from '../../types/invoice.ts';
import { roundToTwoDecimals } from '../../types/invoice.ts';

export interface CalculatedLineItem extends LineItem {
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface TaxBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

export function calculateLineItem(
  item: Omit<LineItem, 'taxableAmount' | 'taxAmount' | 'totalAmount' | 'cgst' | 'sgst' | 'igst'>,
  supplyType: 'IntraState' | 'InterState'
): CalculatedLineItem {
  const quantity = isNaN(item.quantity) ? 0 : Math.max(0, item.quantity);
  const unitPrice = isNaN(item.unitPrice) ? 0 : Math.max(0, item.unitPrice);
  const discountPercent = isNaN(item.discountPercent) ? 0 : Math.min(100, Math.max(0, item.discountPercent));
  const discountAmount = isNaN(item.discountAmount) ? 0 : Math.max(0, item.discountAmount);
  
  const baseAmount = quantity * unitPrice;
  const discountFromPercent = baseAmount * (discountPercent / 100);
  const totalDiscount = Math.min(baseAmount, discountFromPercent + discountAmount);
  const taxableAmount = Math.max(0, baseAmount - totalDiscount);
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  // Determine if tax applies based on tax category
  const isTaxable = item.taxCategory !== 'Exempt' && item.taxCategory !== 'NilRated' && item.taxCategory !== 'NonGST';
  
  if (isTaxable) {
    const taxRate = isNaN(item.taxRate) ? 0 : Math.max(0, item.taxRate);
    const taxAmount = taxableAmount * (taxRate / 100);
    
    // Determine tax allocation based on tax category and supply type
    const isIntraState = supplyType === 'IntraState';
    const isInterState = supplyType === 'InterState';
    
    // Determine tax allocation based on tax category and supply type
    const isCGST_SGST = item.taxCategory === 'GST' || item.taxCategory === 'CGST_SGST';
    const isIGST = item.taxCategory === 'IGST';
    
    if (isIntraState && (isCGST_SGST || (!isIGST && item.taxCategory === 'GST'))) {
      // Intra-state: CGST + SGST (split equally)
      cgst = taxAmount / 2;
      sgst = taxAmount / 2;
    } else if (isInterState || isIGST) {
      // Inter-state or explicit IGST: IGST
      igst = taxAmount;
    } else {
      // Default fallback based on supply type
      if (isIntraState) {
        cgst = taxAmount / 2;
        sgst = taxAmount / 2;
      } else {
        igst = taxAmount;
      }
    }
  }
  
  return {
    ...item,
    quantity,
    unitPrice,
    discountPercent,
    discountAmount,
    taxableAmount: roundToTwoDecimals(taxableAmount),
    taxAmount: roundToTwoDecimals(cgst + sgst + igst),
    totalAmount: roundToTwoDecimals(taxableAmount + cgst + sgst + igst),
    cgst: roundToTwoDecimals(cgst),
    sgst: roundToTwoDecimals(sgst),
    igst: roundToTwoDecimals(igst),
  };
}

export function calculateSupplyType(
  sellerStateCode?: string, 
  placeOfSupplyCode?: string
): 'IntraState' | 'InterState' {
  if (!sellerStateCode || !placeOfSupplyCode) {
    return 'InterState';
  }
  return sellerStateCode.trim() === placeOfSupplyCode.trim() ? 'IntraState' : 'InterState';
}

export function calculateTaxBreakdown(
  items: LineItem[],
  _supplyType: 'IntraState' | 'InterState',
  isExport = false
): TaxBreakdown {
  if (isExport) {
    return { cgst: 0, sgst: 0, igst: 0, totalTax: 0 };
  }

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  for (const item of items) {
    if (item.taxCategory === 'Exempt' || item.taxCategory === 'NilRated' || item.taxCategory === 'NonGST') {
      continue;
    }
    
    // Use the calculated cgst, sgst, igst from the line item
    cgst += item.cgst || 0;
    sgst += item.sgst || 0;
    igst += item.igst || 0;
  }
  
  const roundedCgst = roundToTwoDecimals(cgst);
  const roundedSgst = roundToTwoDecimals(sgst);
  const roundedIgst = roundToTwoDecimals(igst);
  
  return {
    cgst: roundedCgst,
    sgst: roundedSgst,
    igst: roundedIgst,
    totalTax: roundToTwoDecimals(roundedCgst + roundedSgst + roundedIgst),
  };
}

export function calculateTotals(
  items: LineItem[],
  seller: Seller,
  metadata: InvoiceMetadata
): InvoiceTotals {
  const isExport = metadata.invoiceType === 'Export';
  const supplyType = calculateSupplyType(
    seller?.address?.stateCode,
    metadata?.placeOfSupply
  );
  
  const calculatedItems = items.map(item => calculateLineItem(item, supplyType));
  
  const subtotal = roundToTwoDecimals(
    calculatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  );
  
  const totalDiscount = roundToTwoDecimals(
    calculatedItems.reduce((sum, item) => {
      const baseAmount = item.quantity * item.unitPrice;
      const discountFromPercent = baseAmount * (item.discountPercent / 100);
      return sum + discountFromPercent + item.discountAmount;
    }, 0)
  );
  
  const taxableValue = roundToTwoDecimals(
    calculatedItems.reduce((sum, item) => sum + item.taxableAmount, 0)
  );
  
  const taxBreakdown = calculateTaxBreakdown(calculatedItems, supplyType, isExport);
  
  const rawGrandTotal = roundToTwoDecimals(taxableValue + taxBreakdown.totalTax);
  
  // For INR, round-off can be 0 or small difference; for foreign currencies, keep exact decimals
  const roundOff = 0;
  const grandTotal = rawGrandTotal;
  
  return {
    subtotal,
    totalDiscount,
    taxableValue,
    cgst: taxBreakdown.cgst,
    sgst: taxBreakdown.sgst,
    igst: taxBreakdown.igst,
    totalTax: taxBreakdown.totalTax,
    roundOff,
    grandTotal,
    amountPaid: 0,
    balanceDue: grandTotal,
  };
}

export function recalculateInvoice(
  items: LineItem[],
  seller: Seller,
  _customer: unknown,
  metadata: InvoiceMetadata
): { items: LineItem[]; totals: InvoiceTotals } {
  const supplyType = calculateSupplyType(
    seller?.address?.stateCode,
    metadata?.placeOfSupply
  );
  
  const calculatedItems = items.map(item => calculateLineItem(item, supplyType));
  const totals = calculateTotals(calculatedItems, seller, metadata);
  
  return { items: calculatedItems, totals };
}