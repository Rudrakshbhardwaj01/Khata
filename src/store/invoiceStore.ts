import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Invoice, LineItem, Seller, Customer, InvoiceMetadata, Customization } from '../types/invoice';
import { generateInvoiceId, INDIAN_STATES } from '../types/invoice';
import { recalculateInvoice } from '../domain/calculations/engine';

interface InvoiceState {
  invoice: Invoice;
  isDirty: boolean;
  lastSaved?: string;
  
  setInvoice: (invoice: Invoice) => void;
  updateMetadata: (metadata: Partial<InvoiceMetadata>) => void;
  updateSeller: (seller: Partial<Seller>) => void;
  updateCustomer: (customer: Partial<Customer>) => void;
  updateCustomization: (customization: Partial<Customization>) => void;
  
  addLineItem: (item?: Partial<LineItem>) => void;
  updateLineItem: (id: string, updates: Partial<LineItem>) => void;
  removeLineItem: (id: string) => void;
  reorderLineItems: (fromIndex: number, toIndex: number) => void;
  
  recalculate: () => void;
  newInvoice: () => void;
  reset: () => void;
  markClean: () => void;
}

const createDefaultSeller = (): Seller => ({
  name: '',
  address: {
    line1: '',
    city: '',
    state: 'Karnataka',
    stateCode: '29',
    pincode: '',
    country: 'India',
  },
  gstin: '',
  email: '',
  phone: '',
});

const createDefaultCustomer = (): Customer => ({
  name: '',
  address: {
    line1: '',
    city: '',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '',
    country: 'India',
  },
  gstin: '',
  email: '',
  phone: '',
});

const createDefaultMetadata = (): InvoiceMetadata => {
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  
  return {
    invoiceNumber: generateInvoiceId(),
    invoiceDate: today.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    placeOfSupply: '29',
    reverseCharge: false,
    invoiceType: 'B2B',
    currency: 'INR',
    notes: '',
    paymentTerms: 'Payment due within 30 days',
  };
};

const createDefaultCustomization = (): Customization => ({
  template: 'modern',
  accentColor: '#2563eb',
  fontFamily: 'Inter',
  logoPosition: 'left',
});

const createDefaultInvoice = (): Invoice => {
  const metadata = createDefaultMetadata();
  const seller = createDefaultSeller();
  const customer = createDefaultCustomer();
  const customization = createDefaultCustomization();
  const items: LineItem[] = [];
  const totals = {
    subtotal: 0,
    totalDiscount: 0,
    taxableValue: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalTax: 0,
    roundOff: 0,
    grandTotal: 0,
    amountPaid: 0,
    balanceDue: 0,
  };
  
  const now = new Date().toISOString();
  
  return {
    id: generateInvoiceId(),
    metadata,
    seller,
    customer,
    items,
    totals,
    customization,
    createdAt: now,
    updatedAt: now,
  };
};

export const useInvoiceStore = create<InvoiceState>()(
  subscribeWithSelector((set) => ({
    invoice: createDefaultInvoice(),
    isDirty: false,
    
    setInvoice: (invoice: Invoice) => set({ invoice, isDirty: false }),
    
    updateMetadata: (metadata) => set((state) => {
      const updated = { ...state.invoice, metadata: { ...state.invoice.metadata, ...metadata }, updatedAt: new Date().toISOString() };
      const { items, totals } = recalculateInvoice(updated.items, updated.seller, updated.customer, updated.metadata);
      return { invoice: { ...updated, items, totals }, isDirty: true };
    }),
    
    updateSeller: (seller) => set((state) => {
      const updated = { ...state.invoice, seller: { ...state.invoice.seller, ...seller }, updatedAt: new Date().toISOString() };
      const { items, totals } = recalculateInvoice(updated.items, updated.seller, updated.customer, updated.metadata);
      return { invoice: { ...updated, items, totals }, isDirty: true };
    }),
    
    updateCustomer: (customer) => set((state) => {
      const updated = { ...state.invoice, customer: { ...state.invoice.customer, ...customer }, updatedAt: new Date().toISOString() };
      const { items, totals } = recalculateInvoice(updated.items, updated.seller, updated.customer, updated.metadata);
      return { invoice: { ...updated, items, totals }, isDirty: true };
    }),
    
    updateCustomization: (customization) => set((state) => ({
      invoice: { ...state.invoice, customization: { ...state.invoice.customization, ...customization }, updatedAt: new Date().toISOString() },
      isDirty: true,
    })),
    
    addLineItem: (item) => set((state) => {
      const newItem: LineItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        description: '',
        hsnSac: '',
        quantity: 1,
        unit: 'Nos',
        unitPrice: 0,
        discountPercent: 0,
        discountAmount: 0,
        taxCategory: 'GST',
        taxRate: 18,
        taxableAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
        ...item,
      };
      
      const updated = { ...state.invoice, items: [...state.invoice.items, newItem], updatedAt: new Date().toISOString() };
      const { items, totals } = recalculateInvoice(updated.items, updated.seller, updated.customer, updated.metadata);
      return { invoice: { ...updated, items, totals }, isDirty: true };
    }),
    
    updateLineItem: (id, updates) => set((state) => {
      const items = state.invoice.items.map(item => item.id === id ? { ...item, ...updates } : item);
      const updated = { ...state.invoice, items, updatedAt: new Date().toISOString() };
      const { items: calculatedItems, totals } = recalculateInvoice(items, updated.seller, updated.customer, updated.metadata);
      return { invoice: { ...updated, items: calculatedItems, totals }, isDirty: true };
    }),
    
    removeLineItem: (id) => set((state) => {
      const items = state.invoice.items.filter(item => item.id !== id);
      const updated = { ...state.invoice, items, updatedAt: new Date().toISOString() };
      const { items: calculatedItems, totals } = recalculateInvoice(items, updated.seller, updated.customer, updated.metadata);
      return { invoice: { ...updated, items: calculatedItems, totals }, isDirty: true };
    }),
    
    reorderLineItems: (fromIndex, toIndex) => set((state) => {
      const items = [...state.invoice.items];
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      const updated = { ...state.invoice, items, updatedAt: new Date().toISOString() };
      const { items: calculatedItems, totals } = recalculateInvoice(items, updated.seller, updated.customer, updated.metadata);
      return { invoice: { ...updated, items: calculatedItems, totals }, isDirty: true };
    }),
    
    recalculate: () => set((state) => {
      const { items, totals } = recalculateInvoice(state.invoice.items, state.invoice.seller, state.invoice.customer, state.invoice.metadata);
      return { invoice: { ...state.invoice, items, totals }, isDirty: true };
    }),
    
    newInvoice: () => set({ invoice: createDefaultInvoice(), isDirty: false }),
    
    reset: () => set({ invoice: createDefaultInvoice(), isDirty: false }),
    
    markClean: () => set({ isDirty: false }),
  }))
);

export const getStateCode = (stateName: string): string => {
  const state = INDIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return state?.gstCode || '29';
};

export const getStateName = (stateCode: string): string => {
  const state = INDIAN_STATES.find(s => s.gstCode === stateCode || s.code === stateCode);
  return state?.name || 'Karnataka';
};