import type { Invoice, LineItem, Address, Party, InvoiceMetadata } from '../../types/invoice';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

function createError(field: string, message: string, severity: 'error' | 'warning' = 'error'): ValidationError {
  return { field, message, severity };
}

export function validateAddress(address: Address, prefix: string = ''): ValidationError[] {
  const errors: ValidationError[] = [];
  const fieldPrefix = prefix ? `${prefix}.` : '';
  
  if (!address.line1?.trim()) {
    errors.push(createError(`${fieldPrefix}line1`, 'Address line 1 is required'));
  }
  if (!address.city?.trim()) {
    errors.push(createError(`${fieldPrefix}city`, 'City is required'));
  }
  if (!address.state?.trim()) {
    errors.push(createError(`${fieldPrefix}state`, 'State is required'));
  }
  
  const isIndia = !address.country || address.country.trim().toLowerCase() === 'india';
  
  if (!address.stateCode?.trim()) {
    if (isIndia) {
      errors.push(createError(`${fieldPrefix}stateCode`, 'State code is required'));
    }
  } else if (isIndia && !/^\d{2}$/.test(address.stateCode)) {
    errors.push(createError(`${fieldPrefix}stateCode`, 'Indian GST state code must be 2 digits'));
  }
  
  if (!address.pincode?.trim()) {
    errors.push(createError(`${fieldPrefix}pincode`, 'PIN / Postal code is required'));
  } else if (isIndia && !/^\d{6}$/.test(address.pincode)) {
    errors.push(createError(`${fieldPrefix}pincode`, 'Indian PIN code must be 6 digits'));
  }
  
  if (!address.country?.trim()) {
    errors.push(createError(`${fieldPrefix}country`, 'Country is required'));
  }
  
  return errors;
}

export function validateParty(party: Party, prefix: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!party.name?.trim()) {
    errors.push(createError(`${prefix}.name`, 'Name is required'));
  }
  
  if (party.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(party.email)) {
    errors.push(createError(`${prefix}.email`, 'Invalid email format'));
  }
  
  if (party.phone && !/^[\d\s\-+()]{7,}$/.test(party.phone)) {
    errors.push(createError(`${prefix}.phone`, 'Invalid phone number'));
  }
  
  if (party.gstin && !validateGSTIN(party.gstin)) {
    errors.push(createError(`${prefix}.gstin`, 'Invalid GSTIN format'));
  }
  
  if (party.address) {
    errors.push(...validateAddress(party.address, prefix));
  }
  
  return errors;
}

export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(gstin)) return false;
  
  const stateCode = parseInt(gstin.substring(0, 2), 10);
  return stateCode >= 1 && stateCode <= 38;
}

export function validateLineItem(item: LineItem, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `items[${index}]`;
  
  if (!item.description?.trim()) {
    errors.push(createError(`${prefix}.description`, 'Description is required'));
  }
  
  if (isNaN(item.quantity) || item.quantity < 0) {
    errors.push(createError(`${prefix}.quantity`, 'Quantity cannot be negative'));
  } else if (item.quantity === 0) {
    errors.push(createError(`${prefix}.quantity`, 'Quantity must be greater than 0', 'warning'));
  }
  
  if (!item.unit?.trim()) {
    errors.push(createError(`${prefix}.unit`, 'Unit is required'));
  }
  
  if (isNaN(item.unitPrice) || item.unitPrice < 0) {
    errors.push(createError(`${prefix}.unitPrice`, 'Unit price cannot be negative'));
  }
  
  if (item.discountPercent < 0 || item.discountPercent > 100) {
    errors.push(createError(`${prefix}.discountPercent`, 'Discount percent must be between 0 and 100'));
  }
  
  if (item.discountAmount < 0) {
    errors.push(createError(`${prefix}.discountAmount`, 'Discount amount cannot be negative'));
  }
  
  if (item.taxRate < 0) {
    errors.push(createError(`${prefix}.taxRate`, 'Tax rate cannot be negative'));
  }
  
  return errors;
}

export function validateInvoiceMetadata(metadata: InvoiceMetadata): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!metadata.invoiceNumber?.trim()) {
    errors.push(createError('metadata.invoiceNumber', 'Invoice number is required'));
  }
  
  if (!metadata.invoiceDate) {
    errors.push(createError('metadata.invoiceDate', 'Invoice date is required'));
  }
  
  if (metadata.invoiceDate && metadata.dueDate) {
    const invoiceDate = new Date(metadata.invoiceDate);
    const dueDate = new Date(metadata.dueDate);
    if (dueDate < invoiceDate) {
      errors.push(createError('metadata.dueDate', 'Due date cannot be before invoice date'));
    }
  }
  
  return errors;
}

export function validateInvoice(invoice: Invoice): ValidationResult {
  const errors: ValidationError[] = [];
  
  errors.push(...validateInvoiceMetadata(invoice.metadata));
  errors.push(...validateParty(invoice.seller, 'seller'));
  errors.push(...validateParty(invoice.customer, 'customer'));
  
  if (!invoice.items || invoice.items.length === 0) {
    errors.push(createError('items', 'At least one line item is required'));
  } else {
    invoice.items.forEach((item, index) => {
      errors.push(...validateLineItem(item, index));
    });
  }
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
  };
}

export function getFieldErrors(errors: ValidationError[], field: string): ValidationError[] {
  return errors.filter(e => e.field === field || e.field.startsWith(`${field}.`));
}

export function hasFieldError(errors: ValidationError[], field: string): boolean {
  return errors.some(e => e.field === field || e.field.startsWith(`${field}.`));
}
