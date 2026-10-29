import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ImageIcon, PaletteIcon, TypeIcon, LayoutIcon } from './icons';

const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', family: "'Inter', system-ui, sans-serif" },
  { id: 'system', name: 'System UI', family: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { id: 'serif', name: 'Georgia', family: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', name: 'JetBrains Mono', family: "'JetBrains Mono', 'Fira Code', monospace" },
];

const TEMPLATE_OPTIONS = [
  { id: 'modern', name: 'Modern Professional' },
  { id: 'classic', name: 'Classic Business' },
  { id: 'creative', name: 'Creative Portfolio' },
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

export function CustomizationSection() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<string>(DEFAULT_LOGO);
  const [accentColor, setAccentColor] = useState<string>('#2563eb');
  const [fontFamily, setFontFamily] = useState<string>(FONT_OPTIONS[0].family);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [logoPreview, setLogoPreview] = useState<string>(DEFAULT_LOGO);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLogo(dataUrl);
        setLogoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    setLogo(DEFAULT_LOGO);
    setLogoPreview(DEFAULT_LOGO);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const templateStyles: Record<string, React.CSSProperties> = {
    modern: {
      borderColor: accentColor,
      borderWidth: '2px',
      borderRadius: '12px',
    },
    classic: {
      borderColor: accentColor,
      borderWidth: '1px',
      borderRadius: '0',
      borderTopWidth: '4px',
    },
    creative: {
      borderColor: accentColor,
      borderWidth: '2px',
      borderRadius: '16px',
      boxShadow: `0 0 0 1px ${accentColor}40, 0 8px 24px ${accentColor}20`,
    },
  };

  const invoiceStyle: React.CSSProperties = {
    fontFamily,
    ...templateStyles[selectedTemplate],
  };

  return (
    <section id="customization" className="customization-section" aria-labelledby="customization-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="customization-heading" className="section-title">Make It Uniquely Yours</h2>
          <p className="section-subtitle">
            Personalize invoices with your brand. See changes instantly in the live preview.
          </p>
        </header>

        <div className="customization-grid">
          <div className="customization-controls animate-slide-up">
            <div className="control-group">
              <label htmlFor="logo-upload" className="control-label">
                <ImageIcon className="control-icon" aria-hidden="true" />
                Business Logo
              </label>
              <div className="logo-upload-area">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  className="file-input"
                  aria-label="Upload business logo"
                />
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
                    {logo !== DEFAULT_LOGO ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  {logo !== DEFAULT_LOGO && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={removeLogo}
                      aria-label="Remove logo"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="control-hint">PNG, JPG, or SVG · Max 2MB · Recommended 300×100px</p>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">
                <PaletteIcon className="control-icon" aria-hidden="true" />
                Accent Color
              </label>
              <div className="color-palette" role="radiogroup" aria-label="Select accent color">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    className={`color-swatch ${accentColor === color.value ? 'color-swatch--active' : ''}`}
                    onClick={() => setAccentColor(color.value)}
                    aria-label={color.name}
                    aria-pressed={accentColor === color.value}
                    role="radio"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="custom-color-input"
                  aria-label="Custom accent color"
                  title="Custom color"
                />
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="font-select" className="control-label">
                <TypeIcon className="control-icon" aria-hidden="true" />
                Font Family
              </label>
              <select
                id="font-select"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="font-select"
                aria-label="Select font family"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.family}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">
                <LayoutIcon className="control-icon" aria-hidden="true" />
                Template Style
              </label>
              <div className="template-selector" role="radiogroup" aria-label="Select template style">
                {TEMPLATE_OPTIONS.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    className={`template-option ${selectedTemplate === template.id ? 'template-option--active' : ''}`}
                    onClick={() => setSelectedTemplate(template.id)}
                    aria-pressed={selectedTemplate === template.id}
                    role="radio"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="customization-preview animate-slide-in-right">
            <div className="preview-frame">
              <div className="preview-header">
                <span className="preview-title">Live Preview</span>
                <span className="preview-badge">Updates in real-time</span>
              </div>
              <div className="invoice-preview" style={invoiceStyle} role="img" aria-label="Customized invoice preview">
                <div className="preview-invoice-header">
                  <div className="preview-brand-row">
                    <img src={logoPreview} alt="Business logo" className="preview-logo" />
                    <div className="preview-brand-text">
                      <span className="preview-brand-name">Your Business Name</span>
                      <span className="preview-invoice-label">INVOICE</span>
                    </div>
                  </div>
                  <div className="preview-meta">
                    <div><span className="preview-meta-label">Invoice #</span><span className="preview-meta-value">INV-2024-001</span></div>
                    <div><span className="preview-meta-label">Date</span><span className="preview-meta-value">15 Jan 2024</span></div>
                    <div><span className="preview-meta-label">Due</span><span className="preview-meta-value">14 Feb 2024</span></div>
                  </div>
                </div>

                <div className="preview-parties">
                  <div className="preview-party">
                    <span className="preview-party-label">From</span>
                    <address>
                      <strong>Your Business Name</strong><br />
                      123 Business Street<br />
                      City, State 12345<br />
                      GSTIN: 29ABCDE1234F1Z5
                    </address>
                  </div>
                  <div className="preview-party">
                    <span className="preview-party-label">Bill To</span>
                    <address>
                      <strong>Client Company Ltd</strong><br />
                      456 Client Avenue<br />
                      City, State 67890<br />
                      GSTIN: 07AAACI1234A1Z9
                    </address>
                  </div>
                </div>

                <table className="preview-table">
                  <thead>
                    <tr style={{ borderBottomColor: accentColor }}>
                      <th>#</th>
                      <th>Description</th>
                      <th style={{ textAlign: 'right' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Rate</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Design Services</td>
                      <td style={{ textAlign: 'right' }}>1</td>
                      <td style={{ textAlign: 'right' }}>₹50,000</td>
                      <td style={{ textAlign: 'right' }}>₹50,000</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Development</td>
                      <td style={{ textAlign: 'right' }}>1</td>
                      <td style={{ textAlign: 'right' }}>₹75,000</td>
                      <td style={{ textAlign: 'right' }}>₹75,000</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Consulting</td>
                      <td style={{ textAlign: 'right' }}>10</td>
                      <td style={{ textAlign: 'right' }}>₹5,000</td>
                      <td style={{ textAlign: 'right' }}>₹50,000</td>
                    </tr>
                  </tbody>
                </table>

                <div className="preview-totals">
                  <div className="preview-total-row">
                    <span>Subtotal</span>
                    <span>₹1,75,000</span>
                  </div>
                  <div className="preview-total-row" style={{ color: accentColor }}>
                    <span>GST (18%)</span>
                    <span>₹31,500</span>
                  </div>
                  <div className="preview-total-row preview-grand-total" style={{ borderTopColor: accentColor, color: accentColor }}>
                    <span>Total</span>
                    <span>₹2,06,500</span>
                  </div>
                </div>

                <div className="preview-footer">
                  <p>Thank you for your business! Payment due within 30 days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/editor')} aria-label="Open editor to customize your invoices">
            Open Editor to Customize
            <ArrowRightIcon className="btn-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}