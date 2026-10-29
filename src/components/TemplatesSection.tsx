import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './icons';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and minimal, built for everyday business.',
    tags: ['Services', 'Consulting', 'Agencies'],
    accentColor: '#2563eb',
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: '12px',
    borderWidth: '2px',
    headerStyle: 'colored-bar',
  },
  {
    id: 'classic',
    name: 'Classic Business',
    description: 'Structured and traditional, ideal for formal invoicing.',
    tags: ['Corporate', 'B2B', 'Traditional'],
    accentColor: '#1e293b',
    fontFamily: "Georgia, 'Times New Roman', serif",
    borderRadius: '0',
    borderWidth: '1px',
    headerStyle: 'top-border',
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Expressive layouts for creative professionals.',
    tags: ['Design', 'Creative', 'Freelance'],
    accentColor: '#7c3aed',
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: '16px',
    borderWidth: '2px',
    headerStyle: 'gradient',
    showShadow: true,
  },
];

export function TemplatesSection() {
  const navigate = useNavigate();

  return (
    <section id="templates" className="templates-section" aria-labelledby="templates-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="templates-heading" className="section-title">Professional Invoice Templates</h2>
          <p className="section-subtitle">
            Choose from beautifully designed templates tailored for different industries.
          </p>
        </header>

        <div className="templates-grid" role="list">
          {templates.map((template, index) => (
            <article
              key={template.id}
              className="template-card animate-slide-up"
              style={{ animationDelay: `${index * 0.08}s` }}
              role="listitem"
            >
              <div className="template-preview" aria-hidden="true">
                <div
                  className="template-preview-inner"
                  style={{
                    '--template-accent': template.accentColor,
                    '--template-font': template.fontFamily,
                    '--template-radius': template.borderRadius,
                    '--template-border-width': template.borderWidth,
                    boxShadow: template.showShadow ? `0 0 0 1px ${template.accentColor}40, 0 12px 32px ${template.accentColor}20` : 'none',
                  } as React.CSSProperties}
                >
                  <div className={`template-preview-header template-preview-header--${template.headerStyle}`}>
                    <div className="template-preview-brand-row">
                      <span className="template-preview-brand" style={{ fontFamily: template.fontFamily }}>खाता</span>
                      <span className="template-preview-title" style={{ fontFamily: template.fontFamily }}>INVOICE</span>
                    </div>
                    <div className="template-preview-meta">
                      <div><span className="template-meta-label">#</span><span className="template-meta-value">INV-001</span></div>
                      <div><span className="template-meta-label">Date</span><span className="template-meta-value">15 Jan 2024</span></div>
                    </div>
                  </div>
                  <div className="template-preview-body">
                    <div className="template-preview-parties">
                      <div className="template-party">
                        <span className="template-party-label">From</span>
                        <address>
                          <strong style={{ fontFamily: template.fontFamily }}>Acme Design Studio</strong><br />
                          123 MG Road, Bengaluru<br />
                          Karnataka 560001
                        </address>
                      </div>
                      <div className="template-party">
                        <span className="template-party-label">Bill To</span>
                        <address>
                          <strong style={{ fontFamily: template.fontFamily }}>TechCorp Solutions</strong><br />
                          456 Commercial St, Mumbai<br />
                          Maharashtra 400001
                        </address>
                      </div>
                    </div>
                    <table className="template-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th className="text-right" style={{ width: '60px' }}>Qty</th>
                          <th className="text-right" style={{ width: '90px' }}>Rate</th>
                          <th className="text-right" style={{ width: '90px' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Brand Identity</td><td className="text-right">1</td><td className="text-right">₹75,000</td><td className="text-right">₹75,000</td></tr>
                        <tr><td>Website Design</td><td className="text-right">1</td><td className="text-right">₹1,20,000</td><td className="text-right">₹1,20,000</td></tr>
                        <tr><td>Marketing</td><td className="text-right">1</td><td className="text-right">₹45,000</td><td className="text-right">₹45,000</td></tr>
                      </tbody>
                    </table>
                    <div className="template-totals">
                      <div className="template-total-row"><span>Subtotal</span><span>₹2,40,000</span></div>
                      <div className="template-total-row template-tax-row"><span>GST (18%)</span><span>₹43,200</span></div>
                      <div className="template-total-row template-grand-total"><span>Total</span><span>₹2,83,200</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-content">
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <div className="template-tags" aria-label="Template categories">
                  {template.tags.map((tag) => (
                    <span key={tag} className="template-tag" style={{ backgroundColor: `${template.accentColor}15`, color: template.accentColor, borderColor: `${template.accentColor}40` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/editor')} aria-label="Open editor to customize templates">
            Open Editor to Customize
            <ArrowRightIcon className="btn-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}