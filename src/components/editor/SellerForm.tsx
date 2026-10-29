import { useInvoiceStore } from '../../store/invoiceStore';
import { INDIAN_STATES } from '../../types/invoice';
import './FormComponents.css';

export function SellerForm() {
  const { invoice, updateSeller } = useInvoiceStore();

  const handleChange = (field: keyof typeof invoice.seller, value: string) => {
    updateSeller({ [field]: value });
  };

  const handleAddressChange = (field: keyof typeof invoice.seller.address, value: string) => {
    updateSeller({
      address: { ...invoice.seller.address, [field]: value }
    });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Seller Details (Your Business)</h3>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="seller-name" className="form-label">Business Name *</label>
          <input
            id="seller-name"
            type="text"
            className="form-input"
            value={invoice.seller.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Acme Design Studio"
            aria-label="Business name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="seller-gstin" className="form-label">GSTIN</label>
          <input
            id="seller-gstin"
            type="text"
            className="form-input"
            value={invoice.seller.gstin || ''}
            onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
            placeholder="29ABCDE1234F1Z5"
            aria-label="GSTIN"
            maxLength={15}
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="seller-email" className="form-label">Email</label>
          <input
            id="seller-email"
            type="email"
            className="form-input"
            value={invoice.seller.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="billing@acme.com"
            aria-label="Business email"
          />
        </div>

        <div className="form-field">
          <label htmlFor="seller-phone" className="form-label">Phone</label>
          <input
            id="seller-phone"
            type="tel"
            className="form-input"
            value={invoice.seller.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+91 98765 43210"
            aria-label="Business phone"
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="seller-website" className="form-label">Website (Optional)</label>
          <input
            id="seller-website"
            type="url"
            className="form-input"
            value={invoice.seller.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://acme.com"
            aria-label="Business website"
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="seller-logo" className="form-label">Logo URL (Optional)</label>
          <input
            id="seller-logo"
            type="url"
            className="form-input"
            value={invoice.seller.logo || ''}
            onChange={(e) => handleChange('logo', e.target.value)}
            placeholder="https://example.com/logo.png"
            aria-label="Business logo URL"
          />
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-subsection-title">Address</h4>
        <div className="form-grid">
          <div className="form-field form-field--full">
            <label htmlFor="seller-line1" className="form-label">Address Line 1 *</label>
            <input
              id="seller-line1"
              type="text"
              className="form-input"
              value={invoice.seller.address.line1}
              onChange={(e) => handleAddressChange('line1', e.target.value)}
              placeholder="123 MG Road"
              aria-label="Address line 1"
              required
            />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="seller-line2" className="form-label">Address Line 2</label>
            <input
              id="seller-line2"
              type="text"
              className="form-input"
              value={invoice.seller.address.line2 || ''}
              onChange={(e) => handleAddressChange('line2', e.target.value)}
              placeholder="Suite 400, Commercial Complex"
              aria-label="Address line 2"
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-city" className="form-label">City *</label>
            <input
              id="seller-city"
              type="text"
              className="form-input"
              value={invoice.seller.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Bengaluru"
              aria-label="City"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-state" className="form-label">State *</label>
            <select
              id="seller-state"
              className="form-input"
              value={invoice.seller.address.state}
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
            <label htmlFor="seller-state-code" className="form-label">State Code *</label>
            <input
              id="seller-state-code"
              type="text"
              className="form-input"
              value={invoice.seller.address.stateCode}
              onChange={(e) => handleAddressChange('stateCode', e.target.value)}
              aria-label="State code"
              required
              maxLength={2}
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-pincode" className="form-label">PIN Code *</label>
            <input
              id="seller-pincode"
              type="text"
              className="form-input"
              value={invoice.seller.address.pincode}
              onChange={(e) => handleAddressChange('pincode', e.target.value)}
              placeholder="560001"
              aria-label="PIN code"
              required
              maxLength={6}
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-country" className="form-label">Country *</label>
            <input
              id="seller-country"
              type="text"
              className="form-input"
              value={invoice.seller.address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="India"
              aria-label="Country"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-subsection-title">Bank Details (Optional)</h4>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="seller-bank-name" className="form-label">Bank Name</label>
            <input
              id="seller-bank-name"
              type="text"
              className="form-input"
              value={invoice.seller.bankDetails?.bankName || ''}
              onChange={(e) => updateSeller({
                bankDetails: { 
                  bankName: e.target.value,
                  accountName: invoice.seller.bankDetails?.accountName || '',
                  accountNumber: invoice.seller.bankDetails?.accountNumber || '',
                  ifsc: invoice.seller.bankDetails?.ifsc || '',
                  branch: invoice.seller.bankDetails?.branch || '',
                }
              })}
              placeholder="HDFC Bank"
              aria-label="Bank name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-account-name" className="form-label">Account Name</label>
            <input
              id="seller-account-name"
              type="text"
              className="form-input"
              value={invoice.seller.bankDetails?.accountName || ''}
              onChange={(e) => updateSeller({
                bankDetails: { 
                  bankName: invoice.seller.bankDetails?.bankName || '',
                  accountName: e.target.value,
                  accountNumber: invoice.seller.bankDetails?.accountNumber || '',
                  ifsc: invoice.seller.bankDetails?.ifsc || '',
                  branch: invoice.seller.bankDetails?.branch || '',
                }
              })}
              placeholder="Acme Design Studio"
              aria-label="Account name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-account-number" className="form-label">Account Number</label>
            <input
              id="seller-account-number"
              type="text"
              className="form-input"
              value={invoice.seller.bankDetails?.accountNumber || ''}
              onChange={(e) => updateSeller({
                bankDetails: { 
                  bankName: invoice.seller.bankDetails?.bankName || '',
                  accountName: invoice.seller.bankDetails?.accountName || '',
                  accountNumber: e.target.value,
                  ifsc: invoice.seller.bankDetails?.ifsc || '',
                  branch: invoice.seller.bankDetails?.branch || '',
                }
              })}
              placeholder="1234567890"
              aria-label="Account number"
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-ifsc" className="form-label">IFSC</label>
            <input
              id="seller-ifsc"
              type="text"
              className="form-input"
              value={invoice.seller.bankDetails?.ifsc || ''}
              onChange={(e) => updateSeller({
                bankDetails: { 
                  bankName: invoice.seller.bankDetails?.bankName || '',
                  accountName: invoice.seller.bankDetails?.accountName || '',
                  accountNumber: invoice.seller.bankDetails?.accountNumber || '',
                  ifsc: e.target.value.toUpperCase(),
                  branch: invoice.seller.bankDetails?.branch || '',
                }
              })}
              placeholder="HDFC0001234"
              aria-label="IFSC code"
              maxLength={11}
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-branch" className="form-label">Branch</label>
            <input
              id="seller-branch"
              type="text"
              className="form-input"
              value={invoice.seller.bankDetails?.branch || ''}
              onChange={(e) => updateSeller({
                bankDetails: { 
                  bankName: invoice.seller.bankDetails?.bankName || '',
                  accountName: invoice.seller.bankDetails?.accountName || '',
                  accountNumber: invoice.seller.bankDetails?.accountNumber || '',
                  ifsc: invoice.seller.bankDetails?.ifsc || '',
                  branch: e.target.value,
                  accountType: invoice.seller.bankDetails?.accountType || '',
                }
              })}
              placeholder="Bengaluru Main Branch"
              aria-label="Branch name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="seller-account-type" className="form-label">Account Type</label>
            <input
              id="seller-account-type"
              type="text"
              className="form-input"
              value={invoice.seller.bankDetails?.accountType || ''}
              onChange={(e) => updateSeller({
                bankDetails: { 
                  bankName: invoice.seller.bankDetails?.bankName || '',
                  accountName: invoice.seller.bankDetails?.accountName || '',
                  accountNumber: invoice.seller.bankDetails?.accountNumber || '',
                  ifsc: invoice.seller.bankDetails?.ifsc || '',
                  branch: invoice.seller.bankDetails?.branch || '',
                  accountType: e.target.value,
                }
              })}
              placeholder="Current Account"
              aria-label="Account type"
            />
          </div>
        </div>
      </div>
    </div>
  );
}