import { useState } from 'react';
import { useInvoiceStore } from '../../store/invoiceStore';
import { validateInvoice } from '../../domain/validation/validator';
import { EditorSidebar } from './EditorSidebar';
import { EditorHeader } from './EditorHeader';
import { InvoiceDetailsForm } from './InvoiceDetailsForm';
import { SellerForm } from './SellerForm';
import { CustomerForm } from './CustomerForm';
import { LineItemsEditor } from './LineItemsEditor';
import { TaxSettingsForm } from './TaxSettingsForm';
import { CustomizationForm } from './CustomizationForm';
import { PreviewSection } from './PreviewSection';
import './EditorLayout.css';

export function EditorLayout() {
  const { invoice, isDirty, newInvoice, markClean } = useInvoiceStore();
  const [activeTab, setActiveTab] = useState<'details' | 'seller' | 'customer' | 'items' | 'tax' | 'customization' | 'preview'>('details');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'details' | 'seller' | 'customer' | 'items' | 'tax' | 'customization');
    setDownloadError(null);
  };

  const tabs = [
    { id: 'details', label: 'Invoice Details', icon: null },
    { id: 'seller', label: 'Seller', icon: null },
    { id: 'customer', label: 'Customer', icon: null },
    { id: 'items', label: 'Line Items', icon: null },
    { id: 'tax', label: 'Taxation', icon: null },
    { id: 'customization', label: 'Customization', icon: null },
    { id: 'preview', label: 'Preview', icon: null },
  ];

  const handleNewInvoice = () => {
    if (isDirty && !confirm('You have unsaved changes in memory. Start a new invoice?')) {
      return;
    }
    newInvoice();
    setActiveTab('details');
    setDownloadError(null);
  };

  const handleDownloadPDF = async () => {
    setDownloadError(null);
    const validation = validateInvoice(invoice);
    if (!validation.isValid) {
      const messages = validation.errors
        .filter(e => e.severity === 'error')
        .map(e => `• ${e.message}`)
        .join('\n');
      setDownloadError(`Please complete required invoice details before downloading:\n${messages}`);
      alert(`Please complete required invoice details before downloading:\n\n${messages}`);
      return;
    }

    try {
      const { generatePDF } = await import('../../services/pdf');
      await generatePDF(invoice);
      markClean();
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };

  return (
    <div className="editor-layout">
      <EditorHeader
        onNewInvoice={handleNewInvoice}
        onDownloadPDF={handleDownloadPDF}
        invoiceNumber={invoice.metadata.invoiceNumber}
      />

      {downloadError && (
        <div style={{
          background: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          padding: '10px 24px',
          color: '#991b1b',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ whiteSpace: 'pre-line' }}>{downloadError}</span>
          <button
            onClick={() => setDownloadError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#991b1b',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="editor-container">
        <EditorSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
          onClose={setSidebarOpen}
          open={sidebarOpen}
        />

        <main className="editor-main">
          <div className="editor-content">
            {activeTab === 'details' && <InvoiceDetailsForm />}
            {activeTab === 'seller' && <SellerForm />}
            {activeTab === 'customer' && <CustomerForm />}
            {activeTab === 'items' && <LineItemsEditor />}
            {activeTab === 'tax' && <TaxSettingsForm />}
            {activeTab === 'customization' && <CustomizationForm />}
            {activeTab === 'preview' && <PreviewSection />}
          </div>
        </main>
      </div>
    </div>
  );
}