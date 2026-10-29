import { useInvoiceStore } from '../../store/invoiceStore';
import { CURRENCY_OPTIONS } from '../../types/invoice';
import './FormComponents.css';

export function InvoiceDetailsForm() {
  const { invoice, updateMetadata } = useInvoiceStore();

  const handleDateChange = (field: 'invoiceDate' | 'dueDate', value: string) => {
    updateMetadata({ [field]: value });
  };

  const handleChange = (field: keyof typeof invoice.metadata, value: string | boolean) => {
    updateMetadata({ [field]: value });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Invoice Details</h3>
      
      <div className="form-grid form-grid--two-col">
        <div className="form-field">
          <label htmlFor="invoice-number" className="form-label">Invoice Number</label>
          <input
            id="invoice-number"
            type="text"
            className="form-input"
            value={invoice.metadata.invoiceNumber}
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            aria-label="Invoice number"
          />
        </div>

        <div className="form-field">
          <label htmlFor="invoice-date" className="form-label">Invoice Date</label>
          <input
            id="invoice-date"
            type="date"
            className="form-input"
            value={invoice.metadata.invoiceDate}
            onChange={(e) => handleDateChange('invoiceDate', e.target.value)}
            aria-label="Invoice date"
          />
        </div>

        <div className="form-field">
          <label htmlFor="due-date" className="form-label">Due Date</label>
          <input
            id="due-date"
            type="date"
            className="form-input"
            value={invoice.metadata.dueDate}
            onChange={(e) => handleDateChange('dueDate', e.target.value)}
            aria-label="Due date"
          />
        </div>

        <div className="form-field">
          <label htmlFor="currency" className="form-label">Currency</label>
          <select
            id="currency"
            className="form-input form-select"
            value={invoice.metadata.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            aria-label="Currency"
          >
            {CURRENCY_OPTIONS.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name} ({curr.code} {curr.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="invoice-type" className="form-label">Invoice Type</label>
          <select
            id="invoice-type"
            className="form-input form-select"
            value={invoice.metadata.invoiceType}
            onChange={(e) => handleChange('invoiceType', e.target.value)}
            aria-label="Invoice type"
          >
            <option value="B2B">B2B (Business to Business)</option>
            <option value="B2C">B2C (Business to Consumer)</option>
            <option value="Export">Export</option>
            <option value="SEZ">SEZ Supply</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="place-of-supply" className="form-label">Place of Supply (State Code)</label>
          <select
            id="place-of-supply"
            className="form-input form-select"
            value={invoice.metadata.placeOfSupply}
            onChange={(e) => handleChange('placeOfSupply', e.target.value)}
            aria-label="Place of supply"
          >
            <option value="29">Karnataka (29)</option>
            <option value="27">Maharashtra (27)</option>
            <option value="07">Delhi (07)</option>
            <option value="24">Gujarat (24)</option>
            <option value="33">Tamil Nadu (33)</option>
            <option value="09">Uttar Pradesh (09)</option>
            <option value="06">Haryana (06)</option>
            <option value="03">Punjab (03)</option>
            <option value="08">Rajasthan (08)</option>
            <option value="21">Odisha (21)</option>
            <option value="18">Assam (18)</option>
          </select>
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="po-reference" className="form-label">PO Reference (Optional)</label>
          <input
            id="po-reference"
            type="text"
            className="form-input"
            value={invoice.metadata.poReference || ''}
            onChange={(e) => handleChange('poReference', e.target.value)}
            placeholder="PO-12345"
            aria-label="PO reference"
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="reference-number" className="form-label">Reference Number (Optional)</label>
          <input
            id="reference-number"
            type="text"
            className="form-input"
            value={invoice.metadata.referenceNumber || ''}
            onChange={(e) => handleChange('referenceNumber', e.target.value)}
            placeholder="REF-2024-001"
            aria-label="Reference number"
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            className="form-input form-textarea"
            value={invoice.metadata.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional notes for the invoice..."
            rows={3}
            aria-label="Notes"
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="payment-terms" className="form-label">Payment Terms</label>
          <textarea
            id="payment-terms"
            className="form-input form-textarea"
            value={invoice.metadata.paymentTerms || ''}
            onChange={(e) => handleChange('paymentTerms', e.target.value)}
            placeholder="Payment due within 30 days..."
            rows={2}
            aria-label="Payment terms"
          />
        </div>

        <div className="form-field">
          <label className="form-label form-checkbox-label">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={invoice.metadata.reverseCharge}
              onChange={(e) => handleChange('reverseCharge', e.target.checked)}
              aria-label="Reverse charge"
            />
            <span>Reverse Charge Mechanism (RCM)</span>
          </label>
        </div>
      </div>
    </div>
  );
}