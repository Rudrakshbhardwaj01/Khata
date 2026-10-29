import { useState, useRef } from 'react';
import { useInvoiceStore } from '../../store/invoiceStore';
import { formatCurrency } from '../../types/invoice';
import { ImageIcon, PaletteIcon, TypeIcon, LayoutIcon, Trash2Icon } from '../../components/icons';
import './FormComponents.css';

const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', family: "'Inter', system-ui, sans-serif" },
  { id: 'system', name: 'System UI', family: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { id: 'serif', name: 'Georgia', family: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', name: 'JetBrains Mono', family: "'JetBrains Mono', 'Fira Code', monospace" },
];

const TEMPLATE_OPTIONS = [
  { id: 'modern' as const, name: 'Modern Professional' },
  { id: 'classic' as const, name: 'Classic Business' },
  { id: 'creative' as const, name: 'Creative Portfolio' },
];

const ACCENT_COLORS = [
  { id: 'blue', name: 'Professional Blue', value: '#2563eb' },
  { id: 'emerald', name: 'Emerald Green', value: '#059669' },
  { id: 'violet', name: 'Royal Violet', value: '#7c3aed' },
  { id: 'rose', name: 'Rose Pink', value: '#e11d48' },
  { id: 'amber', name: 'Warm Amber', value: '#d97706' },
  { id: 'slate', name: 'Charcoal Slate', value: '#334155' },
];

const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIyOCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzExMTgyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+S0hBVEE8L3RleHQ+PC9zdmc+';

export function CustomizationForm() {
  const { invoice, updateCustomization } = useInvoiceStore();
  const currency = invoice.metadata.currency || 'INR';
  const [logoPreview, setLogoPreview] = useState<string>(invoice.customization.logo || DEFAULT_LOGO);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateCustomization({ logo: dataUrl });
        setLogoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    updateCustomization({ logo: undefined });
    setLogoPreview(DEFAULT_LOGO);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Customization</h3>

      <div className="form-grid">
        <div className="form-field form-field--full">
          <label htmlFor="logo-upload" className="form-label">
            <ImageIcon className="form-label-icon" aria-hidden="true" />
            Business Logo
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            className="file-input"
            aria-label="Upload business logo"
            style={{ display: 'none' }}
          />
          <div className="logo-upload-area">
            <div className="logo-preview-wrapper">
              <img
                src={logoPreview}
                alt="Business logo preview"
                className="logo-preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_LOGO;
                }}
              />
            </div>
            <div className="logo-actions">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={triggerFileInput}
                aria-label="Change logo"
              >
                <ImageIcon className="btn-icon" aria-hidden="true" />
                {invoice.customization.logo ? 'Change Logo' : 'Upload Logo'}
              </button>
              {invoice.customization.logo && (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm btn--danger"
                  onClick={removeLogo}
                  aria-label="Remove logo"
                >
                  <Trash2Icon className="btn-icon" aria-hidden="true" />
                  Remove
                </button>
              )}
            </div>
            <p className="control-hint">PNG, JPG, or WebP · Max 2MB · Recommended 300×100px</p>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">
            <PaletteIcon className="form-label-icon" aria-hidden="true" />
            Accent Color
          </label>
          <div className="color-palette" role="radiogroup" aria-label="Select accent color">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={`color-swatch ${invoice.customization.accentColor === color.value ? 'color-swatch--active' : ''}`}
                onClick={() => updateCustomization({ accentColor: color.value })}
                aria-label={color.name}
                aria-pressed={invoice.customization.accentColor === color.value}
                role="radio"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <input
              type="color"
              value={invoice.customization.accentColor}
              onChange={(e) => updateCustomization({ accentColor: e.target.value })}
              className="custom-color-input"
              aria-label="Custom accent color"
              title="Custom color"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="font-select" className="form-label">
            <TypeIcon className="form-label-icon" aria-hidden="true" />
            Font Family
          </label>
          <select
            id="font-select"
            value={invoice.customization.fontFamily}
            onChange={(e) => updateCustomization({ fontFamily: e.target.value })}
            className="form-input"
            aria-label="Select font family"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.family}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">
            <LayoutIcon className="form-label-icon" aria-hidden="true" />
            Template Style
          </label>
          <div className="template-selector" role="radiogroup" aria-label="Select template style">
            {TEMPLATE_OPTIONS.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`template-option ${invoice.customization.template === template.id ? 'template-option--active' : ''}`}
                onClick={() => updateCustomization({ template: template.id })}
                aria-pressed={invoice.customization.template === template.id}
                role="radio"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="logo-position" className="form-label">Logo Position</label>
          <select
            id="logo-position"
            value={invoice.customization.logoPosition}
            onChange={(e) => updateCustomization({ logoPosition: e.target.value as 'left' | 'center' | 'right' })}
            className="form-input"
            aria-label="Logo position"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="customization-preview" style={{ marginTop: '24px' }}>
        <h4 className="form-subsection-title">Live Preview</h4>
        <div
          className="invoice-preview-mini"
          style={{
            '--accent-color': invoice.customization.accentColor,
            '--font-family': invoice.customization.fontFamily,
            borderColor: invoice.customization.accentColor,
          } as React.CSSProperties}
        >
          <div className="preview-mini-header">
            <div className="preview-mini-brand">
              {invoice.customization.logo && (
                <img src={invoice.customization.logo} alt="Logo" className="preview-mini-logo" />
              )}
              <div className="preview-mini-brand-text">
                <span className="preview-mini-brand-name" style={{ fontFamily: 'var(--brand)' }}>खाता</span>
                <span className="preview-mini-title">INVOICE</span>
              </div>
            </div>
            <div className="preview-mini-meta">
              <div><span className="preview-mini-label">#</span><span>{invoice.metadata.invoiceNumber}</span></div>
              <div><span className="preview-mini-label">Date</span><span>{new Date(invoice.metadata.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            </div>
          </div>
          <table className="preview-mini-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.slice(0, 3).map((item, index) => (
                <tr key={item.id}>
                  <td>{item.description || `Item ${index + 1}`}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(item.totalAmount, currency)}</td>
                </tr>
              ))}
              {invoice.items.length > 3 && (
                <tr>
                  <td>... and {invoice.items.length - 3} more items</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="preview-mini-totals">
            <div className="preview-mini-total-row">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.totals.subtotal, currency)}</span>
            </div>
            <div className="preview-mini-total-row">
              <span>Tax</span>
              <span>{formatCurrency(invoice.totals.totalTax, currency)}</span>
            </div>
            <div className="preview-mini-total-row preview-mini-grand-total">
              <span>Total</span>
              <span>{formatCurrency(invoice.totals.grandTotal, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}