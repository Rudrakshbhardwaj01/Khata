import { useInvoiceStore } from '../../store/invoiceStore';
import { INDIAN_STATES, formatCurrency } from '../../types/invoice';
import './FormComponents.css';

export function TaxSettingsForm() {
  const { invoice, updateMetadata, recalculate } = useInvoiceStore();
  const currency = invoice.metadata.currency || 'INR';

  const supplyType = invoice.seller.address.stateCode === invoice.metadata.placeOfSupply 
    ? 'IntraState' 
    : 'InterState';

  const handleChange = (field: keyof typeof invoice.metadata, value: string | boolean) => {
    updateMetadata({ [field]: value });
    recalculate();
  };

  const getRateDisplay = (taxAmount: number) => {
    if (!taxAmount || !invoice.totals.taxableValue) return '0%';
    const pct = (taxAmount / invoice.totals.taxableValue) * 100;
    return `${pct.toFixed(1)}%`;
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Tax Configuration</h3>
      
      <div className="tax-info-card">
        <h4 className="tax-info-title">Supply Type Detection</h4>
        <div className="tax-info-grid">
          <div className="tax-info-item">
            <span className="tax-info-label">Seller State</span>
            <span className="tax-info-value">
              {invoice.seller.address.state} ({invoice.seller.address.stateCode})
            </span>
          </div>
          <div className="tax-info-item">
            <span className="tax-info-label">Place of Supply</span>
            <span className="tax-info-value">
              {INDIAN_STATES.find(s => s.gstCode === invoice.metadata.placeOfSupply)?.name || invoice.metadata.placeOfSupply}
            </span>
          </div>
          <div className="tax-info-item highlight">
            <span className="tax-info-label">Supply Type</span>
            <span className="tax-info-value tax-type-badge">
              {supplyType === 'IntraState' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
            </span>
          </div>
        </div>
      </div>

      <div className="form-grid" style={{ marginTop: '24px' }}>
        <div className="form-field">
          <label htmlFor="place-of-supply" className="form-label">Place of Supply *</label>
          <select
            id="place-of-supply"
            className="form-input"
            value={invoice.metadata.placeOfSupply}
            onChange={(e) => handleChange('placeOfSupply', e.target.value)}
            aria-label="Place of supply"
          >
            {INDIAN_STATES.map((state) => (
              <option key={state.code} value={state.gstCode}>
                {state.name} ({state.gstCode})
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="invoice-type" className="form-label">Invoice Type</label>
          <select
            id="invoice-type"
            className="form-input"
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
          <label className="form-label form-checkbox-label">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={invoice.metadata.reverseCharge}
              onChange={(e) => handleChange('reverseCharge', e.target.checked)}
              aria-label="Reverse charge mechanism"
            />
            <span>Reverse Charge Mechanism (RCM)</span>
          </label>
        </div>
      </div>

      <div className="tax-breakdown" style={{ marginTop: '24px' }}>
        <h4 className="form-subsection-title">Tax Breakdown</h4>
        <table className="tax-breakdown-table">
          <thead>
            <tr>
              <th scope="col">Tax Component</th>
              <th scope="col" style={{ textAlign: 'right' }}>Rate</th>
              <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CGST</td>
              <td style={{ textAlign: 'right' }}>{getRateDisplay(invoice.totals.cgst)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(invoice.totals.cgst, currency)}</td>
            </tr>
            <tr>
              <td>SGST</td>
              <td style={{ textAlign: 'right' }}>{getRateDisplay(invoice.totals.sgst)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(invoice.totals.sgst, currency)}</td>
            </tr>
            <tr>
              <td>IGST</td>
              <td style={{ textAlign: 'right' }}>{getRateDisplay(invoice.totals.igst)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(invoice.totals.igst, currency)}</td>
            </tr>
            <tr className="tax-total-row">
              <td><strong>Total Tax</strong></td>
              <td></td>
              <td style={{ textAlign: 'right' }}><strong>{formatCurrency(invoice.totals.totalTax, currency)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tax-disclaimer" style={{ marginTop: '16px', padding: '12px', background: 'var(--accent-light)', borderRadius: 'var(--radius)', border: '1px solid var(--accent-border)' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--accent)' }}>
          <strong>Disclaimer:</strong> Khata provides tools to help create GST-compliant invoices. 
          Tax laws are subject to change. Please consult a qualified tax professional or CA 
          for advice specific to your business. Khata does not provide legal or tax advice.
        </p>
      </div>
    </div>
  );
}