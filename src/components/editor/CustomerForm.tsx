import { useInvoiceStore } from '../../store/invoiceStore';
import { INDIAN_STATES } from '../../types/invoice';
import './FormComponents.css';

export function CustomerForm() {
  const { invoice, updateCustomer } = useInvoiceStore();

  const handleChange = (field: keyof typeof invoice.customer, value: string | object) => {
    if (typeof value === 'string') {
      updateCustomer({ [field]: value });
    } else {
      updateCustomer({ [field]: value });
    }
  };

  const handleAddressChange = (field: keyof typeof invoice.customer.address, value: string) => {
    updateCustomer({
      address: { ...invoice.customer.address, [field]: value }
    });
  };

  const handleShippingAddressChange = (field: keyof typeof invoice.customer.address, value: string) => {
    if (!invoice.customer.shippingAddress) return;
    updateCustomer({
      shippingAddress: { ...invoice.customer.shippingAddress!, [field]: value }
    });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Customer Details (Bill To)</h3>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="customer-name" className="form-label">Customer Name *</label>
          <input
            id="customer-name"
            type="text"
            className="form-input"
            value={invoice.customer.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="TechCorp Solutions Pvt Ltd"
            aria-label="Customer name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="customer-gstin" className="form-label">GSTIN</label>
          <input
            id="customer-gstin"
            type="text"
            className="form-input"
            value={invoice.customer.gstin || ''}
            onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
            placeholder="07AAACI1234A1Z9"
            aria-label="Customer GSTIN"
            maxLength={15}
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="customer-email" className="form-label">Email</label>
          <input
            id="customer-email"
            type="email"
            className="form-input"
            value={invoice.customer.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="billing@techcorp.com"
            aria-label="Customer email"
          />
        </div>

        <div className="form-field">
          <label htmlFor="customer-phone" className="form-label">Phone</label>
          <input
            id="customer-phone"
            type="tel"
            className="form-input"
            value={invoice.customer.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+91 98765 43210"
            aria-label="Customer phone"
          />
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-subsection-title">Billing Address</h4>
        <div className="form-grid">
          <div className="form-field form-field--full">
            <label htmlFor="customer-line1" className="form-label">Address Line 1 *</label>
            <input
              id="customer-line1"
              type="text"
              className="form-input"
              value={invoice.customer.address.line1}
              onChange={(e) => handleAddressChange('line1', e.target.value)}
              placeholder="456 Commercial Street"
              aria-label="Address line 1"
              required
            />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="customer-line2" className="form-label">Address Line 2</label>
            <input
              id="customer-line2"
              type="text"
              className="form-input"
              value={invoice.customer.address.line2 || ''}
              onChange={(e) => handleAddressChange('line2', e.target.value)}
              placeholder="Building B, 2nd Floor"
              aria-label="Address line 2"
            />
          </div>

          <div className="form-field">
            <label htmlFor="customer-city" className="form-label">City *</label>
            <input
              id="customer-city"
              type="text"
              className="form-input"
              value={invoice.customer.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Mumbai"
              aria-label="City"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="customer-state" className="form-label">State *</label>
            <select
              id="customer-state"
              className="form-input"
              value={invoice.customer.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              aria-label="State"
              required
            >
              {INDIAN_STATES.map((state) => (
                <option key={state.code} value={state.name}>{state.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="customer-state-code" className="form-label">State Code *</label>
            <input
              id="customer-state-code"
              type="text"
              className="form-input"
              value={invoice.customer.address.stateCode}
              onChange={(e) => handleAddressChange('stateCode', e.target.value)}
              aria-label="State code"
              required
              maxLength={2}
            />
          </div>

          <div className="form-field">
            <label htmlFor="customer-pincode" className="form-label">PIN Code *</label>
            <input
              id="customer-pincode"
              type="text"
              className="form-input"
              value={invoice.customer.address.pincode}
              onChange={(e) => handleAddressChange('pincode', e.target.value)}
              placeholder="400001"
              aria-label="PIN code"
              required
              maxLength={6}
            />
          </div>

          <div className="form-field">
            <label htmlFor="customer-country" className="form-label">Country *</label>
            <input
              id="customer-country"
              type="text"
              className="form-input"
              value={invoice.customer.address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="India"
              aria-label="Country"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-subsection-title">Shipping Address (Optional)</h4>
        <label className="form-label form-checkbox-label">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={!!invoice.customer.shippingAddress}
            onChange={(e) => {
              if (e.target.checked) {
                handleChange('shippingAddress', { ...invoice.customer.address });
              } else {
                handleChange('shippingAddress', undefined as any);
              }
            }}
            aria-label="Use separate shipping address"
          />
          <span>Use a different shipping address</span>
        </label>

        {invoice.customer.shippingAddress && (
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-field form-field--full">
              <label htmlFor="shipping-line1" className="form-label">Address Line 1 *</label>
              <input
                id="shipping-line1"
                type="text"
                className="form-input"
                value={invoice.customer.shippingAddress?.line1 || ''}
                onChange={(e) => handleShippingAddressChange('line1', e.target.value)}
                placeholder="789 Delivery Road"
                aria-label="Shipping address line 1"
                required
              />
            </div>

            <div className="form-field form-field--full">
              <label htmlFor="shipping-line2" className="form-label">Address Line 2</label>
              <input
                id="shipping-line2"
                type="text"
                className="form-input"
                value={invoice.customer.shippingAddress?.line2 || ''}
                onChange={(e) => handleShippingAddressChange('line2', e.target.value)}
                placeholder="Warehouse 3"
                aria-label="Shipping address line 2"
              />
            </div>

            <div className="form-field">
              <label htmlFor="shipping-city" className="form-label">City *</label>
              <input
                id="shipping-city"
                type="text"
                className="form-input"
                value={invoice.customer.shippingAddress?.city || ''}
                onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                placeholder="Navi Mumbai"
                aria-label="Shipping city"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="shipping-state" className="form-label">State *</label>
              <select
                id="shipping-state"
                className="form-input"
                value={invoice.customer.shippingAddress?.state || ''}
                onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                aria-label="Shipping state"
                required
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state.code} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="shipping-state-code" className="form-label">State Code *</label>
              <input
                id="shipping-state-code"
                type="text"
                className="form-input"
                value={invoice.customer.shippingAddress?.stateCode || ''}
                onChange={(e) => handleShippingAddressChange('stateCode', e.target.value)}
                aria-label="Shipping state code"
                required
                maxLength={2}
              />
            </div>

            <div className="form-field">
              <label htmlFor="shipping-pincode" className="form-label">PIN Code *</label>
              <input
                id="shipping-pincode"
                type="text"
                className="form-input"
                value={invoice.customer.shippingAddress?.pincode || ''}
                onChange={(e) => handleShippingAddressChange('pincode', e.target.value)}
                placeholder="400705"
                aria-label="Shipping PIN code"
                required
                maxLength={6}
              />
            </div>

            <div className="form-field">
              <label htmlFor="shipping-country" className="form-label">Country *</label>
              <input
                id="shipping-country"
                type="text"
                className="form-input"
                value={invoice.customer.shippingAddress?.country || ''}
                onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                placeholder="India"
                aria-label="Shipping country"
                required
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}