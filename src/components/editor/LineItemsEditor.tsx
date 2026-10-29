import { useInvoiceStore } from '../../store/invoiceStore';
import { COMMON_HSN_SAC, GST_RATES, formatCurrency } from '../../types/invoice';
import { Trash2Icon, GripVerticalIcon, PlusIcon } from '../../components/icons';
import { useState } from 'react';
import './FormComponents.css';

export function LineItemsEditor() {
  const { invoice, addLineItem, updateLineItem, removeLineItem } = useInvoiceStore();
  const [taxRateInputs, setTaxRateInputs] = useState<Record<string, string>>({});

  const handleDescriptionChange = (id: string, value: string) => updateLineItem(id, { description: value });
  const handleQuantityChange = (id: string, value: string) => updateLineItem(id, { quantity: parseFloat(value) || 0 });
  const handleUnitChange = (id: string, value: string) => updateLineItem(id, { unit: value });
  const handleUnitPriceChange = (id: string, value: string) => updateLineItem(id, { unitPrice: parseFloat(value) || 0 });
  const handleDiscountPercentChange = (id: string, value: string) => updateLineItem(id, { discountPercent: parseFloat(value) || 0 });
  const handleTaxCategoryChange = (id: string, value: string) => updateLineItem(id, { taxCategory: value as any });
  const handleHSNChange = (id: string, value: string) => updateLineItem(id, { hsnSac: value });

  const handleTaxRateBlur = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateLineItem(id, { taxRate: numValue });
    }
  };

  const handleTaxRateSelect = (id: string, rate: number) => {
    updateLineItem(id, { taxRate: rate });
    setTaxRateInputs(prev => ({ ...prev, [id]: `${rate}` }));
  };

  const addNewItem = () => addLineItem({
    description: 'New Item',
    quantity: 1,
    unit: 'Nos',
    unitPrice: 0,
    taxRate: 18,
  });

  const currency = invoice.metadata.currency;

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Line Items</h3>
        <button className="btn btn--secondary btn--sm" onClick={addNewItem} aria-label="Add line item">
          <PlusIcon className="btn-icon" aria-hidden="true" />
          Add Item
        </button>
      </div>

      {invoice.items.length === 0 ? (
        <div className="empty-state">
          <p>No line items added yet. Click "Add Item" to start building your invoice.</p>
          <button className="btn btn--primary btn--sm" onClick={addNewItem}>
            <PlusIcon className="btn-icon" aria-hidden="true" />
            Add Your First Item
          </button>
        </div>
      ) : (
        <>
          <div className="line-items-table-container">
            <table className="line-items-table" role="grid">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '40px' }}>#</th>
                  <th scope="col">Drag</th>
                  <th scope="col" style={{ minWidth: '200px' }}>Description</th>
                  <th scope="col" style={{ width: '80px' }}>HSN/SAC</th>
                  <th scope="col" style={{ width: '70px' }}>Qty</th>
                  <th scope="col" style={{ width: '70px' }}>Unit</th>
                  <th scope="col" style={{ width: '100px' }}>Unit Price</th>
                  <th scope="col" style={{ width: '80px' }}>Disc %</th>
                  <th scope="col" style={{ width: '100px' }}>Tax Rate</th>
                  <th scope="col" style={{ width: '100px' }}>Tax Category</th>
                  <th scope="col" style={{ width: '120px' }}>Amount</th>
                  <th scope="col" style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="line-item-row">
                    <td className="line-item-number">{index + 1}</td>
                    <td className="drag-handle">
                      <GripVerticalIcon className="drag-icon" aria-hidden="true" />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input line-item-input"
                        value={item.description}
                        onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                        placeholder="Item description"
                        aria-label={`Description for item ${index + 1}`}
                      />
                    </td>
                    <td>
                      <select
                        className="form-input line-item-select"
                        value={item.hsnSac || ''}
                        onChange={(e) => handleHSNChange(item.id, e.target.value)}
                        aria-label={`HSN/SAC code for item ${index + 1}`}
                      >
                        <option value="">Select HSN/SAC</option>
                        {COMMON_HSN_SAC.map((code) => (
                          <option key={code.code} value={code.code}>
                            {code.code} - {code.description}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input line-item-input number-input"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        min="0"
                        step="0.01"
                        aria-label={`Quantity for item ${index + 1}`}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input line-item-input"
                        value={item.unit}
                        onChange={(e) => handleUnitChange(item.id, e.target.value)}
                        aria-label={`Unit for item ${index + 1}`}
                        maxLength={10}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input line-item-input number-input"
                        value={item.unitPrice}
                        onChange={(e) => handleUnitPriceChange(item.id, e.target.value)}
                        min="0"
                        step="0.01"
                        aria-label={`Unit price for item ${index + 1}`}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input line-item-input number-input"
                        value={item.discountPercent}
                        onChange={(e) => handleDiscountPercentChange(item.id, e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        aria-label={`Discount percent for item ${index + 1}`}
                      />
                    </td>
                    <td>
                      <div className="tax-rate-input-wrapper">
                        <select
                          className="form-input line-item-select tax-rate-select"
                          value={taxRateInputs[item.id] || `${item.taxRate}`}
                          onChange={(e) => handleTaxRateSelect(item.id, parseFloat(e.target.value) as number)}
                          onBlur={(e) => handleTaxRateBlur(item.id, e.target.value)}
                          aria-label={`Tax rate for item ${index + 1}`}
                        >
                          {GST_RATES.map((rate) => (
                            <option key={rate} value={rate}>{rate}%</option>
                          ))}
                          <option value="custom">Custom...</option>
                        </select>
                        <input
                          type="number"
                          className="form-input line-item-input number-input tax-rate-custom"
                          value={taxRateInputs[item.id] || ''}
                          onChange={(e) => setTaxRateInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                          onBlur={(e) => handleTaxRateBlur(item.id, e.target.value)}
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="Custom %"
                          aria-label={`Custom tax rate for item ${index + 1}`}
                          style={{ display: taxRateInputs[item.id] === 'custom' || (taxRateInputs[item.id] && !GST_RATES.includes(item.taxRate as 0 | 0.25 | 3 | 5 | 12 | 18 | 28)) ? 'block' : 'none' }}
                        />
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-input line-item-select"
                        value={item.taxCategory}
                        onChange={(e) => handleTaxCategoryChange(item.id, e.target.value)}
                        aria-label={`Tax category for item ${index + 1}`}
                      >
                        <option value="GST">GST</option>
                        <option value="IGST">IGST</option>
                        <option value="CGST_SGST">CGST + SGST</option>
                        <option value="Exempt">Exempt</option>
                        <option value="NilRated">Nil Rated</option>
                        <option value="NonGST">Non-GST</option>
                      </select>
                    </td>
                    <td className="line-item-amount">
                      <span className="amount-display">{formatCurrency(item.totalAmount, currency)}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn--ghost btn--icon btn--danger"
                        onClick={() => removeLineItem(item.id)}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Trash2Icon className="btn-icon" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="line-items-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.totals.subtotal, currency)}</span>
            </div>
            <div className="summary-row">
              <span>Total Discount</span>
              <span>- {formatCurrency(invoice.totals.totalDiscount, currency)}</span>
            </div>
            <div className="summary-row">
              <span>Taxable Value</span>
              <span>{formatCurrency(invoice.totals.taxableValue, currency)}</span>
            </div>
            {invoice.totals.cgst > 0 && (
              <div className="summary-row tax-row">
                <span>CGST</span>
                <span>{formatCurrency(invoice.totals.cgst, currency)}</span>
              </div>
            )}
            {invoice.totals.sgst > 0 && (
              <div className="summary-row tax-row">
                <span>SGST</span>
                <span>{formatCurrency(invoice.totals.sgst, currency)}</span>
              </div>
            )}
            {invoice.totals.igst > 0 && (
              <div className="summary-row tax-row">
                <span>IGST</span>
                <span>{formatCurrency(invoice.totals.igst, currency)}</span>
              </div>
            )}
            <div className="summary-row total-row">
              <span>Grand Total</span>
              <span>{formatCurrency(invoice.totals.grandTotal, currency)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}