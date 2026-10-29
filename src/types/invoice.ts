export type Currency = 
  | 'INR' 
  | 'USD' 
  | 'EUR' 
  | 'GBP' 
  | 'AED' 
  | 'SGD' 
  | 'AUD' 
  | 'CAD';

export const CURRENCY_OPTIONS: Array<{ code: Currency; name: string; symbol: string; locale: string }> = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'ar-AE' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
];

export function getCurrencyOption(code: Currency) {
  return CURRENCY_OPTIONS.find(c => c.code === code) || CURRENCY_OPTIONS[0];
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
}

export interface Party {
  name: string;
  address: Address;
  gstin?: string;
  email?: string;
  phone?: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  branch?: string;
  accountType?: string;
}

export interface Seller extends Party {
  logo?: string;
  bankDetails?: BankDetails;
  website?: string;
}

export interface Customer extends Party {
  shippingAddress?: Address;
}

export type InvoiceType = 'B2B' | 'B2C' | 'Export' | 'SEZ';
export type SupplyType = 'IntraState' | 'InterState';
export type TaxCategory = 'GST' | 'IGST' | 'CGST_SGST' | 'Exempt' | 'NilRated' | 'NonGST';

export interface HSNSACCode {
  code: string;
  description: string;
  isService: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxCategory: TaxCategory;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

export interface InvoiceTotals {
  subtotal: number;
  totalDiscount: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string;
  reverseCharge: boolean;
  invoiceType: InvoiceType;
  currency: Currency;
  poReference?: string;
  referenceNumber?: string;
  notes?: string;
  paymentTerms?: string;
}

export interface Customization {
  template: TemplateId;
  accentColor: string;
  fontFamily: string;
  logo?: string;
  logoPosition: 'left' | 'center' | 'right';
}

export type TemplateId = 'modern' | 'classic' | 'creative';

export interface Invoice {
  id: string;
  metadata: InvoiceMetadata;
  seller: Seller;
  customer: Customer;
  items: LineItem[];
  totals: InvoiceTotals;
  customization: Customization;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CURRENCY: Currency = 'INR';

export const INDIAN_STATES: Array<{ code: string; name: string; gstCode: string }> = [
  { code: 'AN', name: 'Andaman and Nicobar Islands', gstCode: '35' },
  { code: 'AP', name: 'Andhra Pradesh', gstCode: '37' },
  { code: 'AR', name: 'Arunachal Pradesh', gstCode: '12' },
  { code: 'AS', name: 'Assam', gstCode: '18' },
  { code: 'BR', name: 'Bihar', gstCode: '10' },
  { code: 'CH', name: 'Chandigarh', gstCode: '04' },
  { code: 'CG', name: 'Chhattisgarh', gstCode: '22' },
  { code: 'DD', name: 'Dadra and Nagar Haveli and Daman and Diu', gstCode: '26' },
  { code: 'DL', name: 'Delhi', gstCode: '07' },
  { code: 'GA', name: 'Goa', gstCode: '30' },
  { code: 'GJ', name: 'Gujarat', gstCode: '24' },
  { code: 'HR', name: 'Haryana', gstCode: '06' },
  { code: 'HP', name: 'Himachal Pradesh', gstCode: '02' },
  { code: 'JK', name: 'Jammu and Kashmir', gstCode: '01' },
  { code: 'JH', name: 'Jharkhand', gstCode: '20' },
  { code: 'KA', name: 'Karnataka', gstCode: '29' },
  { code: 'KL', name: 'Kerala', gstCode: '32' },
  { code: 'LD', name: 'Lakshadweep', gstCode: '31' },
  { code: 'MP', name: 'Madhya Pradesh', gstCode: '23' },
  { code: 'MH', name: 'Maharashtra', gstCode: '27' },
  { code: 'MN', name: 'Manipur', gstCode: '14' },
  { code: 'ML', name: 'Meghalaya', gstCode: '17' },
  { code: 'MZ', name: 'Mizoram', gstCode: '15' },
  { code: 'NL', name: 'Nagaland', gstCode: '13' },
  { code: 'OD', name: 'Odisha', gstCode: '21' },
  { code: 'PY', name: 'Puducherry', gstCode: '34' },
  { code: 'PB', name: 'Punjab', gstCode: '03' },
  { code: 'RJ', name: 'Rajasthan', gstCode: '08' },
  { code: 'SK', name: 'Sikkim', gstCode: '11' },
  { code: 'TN', name: 'Tamil Nadu', gstCode: '33' },
  { code: 'TG', name: 'Telangana', gstCode: '36' },
  { code: 'TR', name: 'Tripura', gstCode: '16' },
  { code: 'UP', name: 'Uttar Pradesh', gstCode: '09' },
  { code: 'UT', name: 'Uttarakhand', gstCode: '05' },
  { code: 'WB', name: 'West Bengal', gstCode: '19' },
];

export const COMMON_HSN_SAC: HSNSACCode[] = [
  { code: '998391', description: 'Software development services', isService: true },
  { code: '998313', description: 'IT consulting services', isService: true },
  { code: '998314', description: 'IT support services', isService: true },
  { code: '998315', description: 'Web hosting services', isService: true },
  { code: '998316', description: 'Software licensing services', isService: true },
  { code: '4901', description: 'Printed books', isService: false },
  { code: '4907', description: 'Unused postage stamps', isService: false },
  { code: '9963', description: 'Accommodation services', isService: true },
  { code: '9964', description: 'Food and beverage services', isService: true },
  { code: '9983', description: 'Professional services', isService: true },
];

export const GST_RATES = [0, 0.25, 3, 5, 12, 18, 28] as const;

export function generateInvoiceId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${year}${month}${day}-${random}`;
}

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const option = getCurrencyOption(currency);
  return new Intl.NumberFormat(option.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, currency: Currency = 'INR'): string {
  const option = getCurrencyOption(currency);
  return new Intl.NumberFormat(option.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseNumber(value: string): number {
  const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPDFCurrency(amount: number, currency: Currency = 'INR'): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  const numStr = formatNumber(safeAmount, currency);
  switch (currency) {
    case 'INR':
      return `Rs. ${numStr}`;
    case 'USD':
      return `$${numStr}`;
    case 'EUR':
      return `EUR ${numStr}`;
    case 'GBP':
      return `GBP ${numStr}`;
    case 'AED':
      return `AED ${numStr}`;
    case 'SGD':
      return `S$${numStr}`;
    case 'AUD':
      return `A$${numStr}`;
    case 'CAD':
      return `C$${numStr}`;
    default:
      return `${currency} ${numStr}`;
  }
}

export function roundToTwoDecimals(value: number): number {
  if (isNaN(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function generateLineItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getStateByCode(code: string) {
  return INDIAN_STATES.find(s => s.gstCode === code || s.code === code);
}

export function getStateByName(name: string) {
  return INDIAN_STATES.find(s => s.name.toLowerCase() === name.toLowerCase());
}