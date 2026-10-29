import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './icons';

const gstFeatures = [
  {
    title: 'Automatic Tax Calculation',
    description: 'Khata calculates CGST, SGST, and IGST based on place of supply.',
  },
  {
    title: 'Intra-State & Inter-State',
    description: 'Automatically applies CGST+SGST or IGST based on locations.',
  },
  {
    title: 'HSN/SAC Codes',
    description: 'Add HSN codes for goods and SAC codes for services on each line item.',
  },
  {
    title: 'GSTIN Validation',
    description: 'Real-time format validation for business and customer GSTINs.',
  },
  {
    title: 'B2B & B2C Formats',
    description: 'Generate both detailed B2B invoices and simplified B2C invoices.',
  },
];

export function GSTSupportSection() {
  const navigate = useNavigate();

  return (
    <section id="gst-support" className="gst-section" aria-labelledby="gst-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="gst-heading" className="section-title">Built for Indian GST Invoicing</h2>
          <p className="section-subtitle">
            Create GST-compliant invoices with automatic tax calculations and required fields.
          </p>
        </header>

        <div className="gst-grid">
          {gstFeatures.map((feature, index) => (
            <article key={feature.title} className="gst-card animate-slide-up" style={{ animationDelay: `${index * 0.06}s` }}>
              <h3 className="gst-card-title">{feature.title}</h3>
              <p className="gst-card-description">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="gst-note animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>
            <strong>Disclaimer:</strong> Khata provides tools to help create GST-compliant invoices. 
            Tax laws are subject to change. Please consult a qualified tax professional for advice specific to your business.
          </p>
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/editor')} aria-label="Start creating GST invoices">
            Create GST Invoices
            <ArrowRightIcon className="btn-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}