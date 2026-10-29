import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './icons';

export function FeaturesSection() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Professional Invoice Creation',
      description: 'Create invoices from scratch with a clear, intuitive editing workflow.',
    },
    {
      title: 'Live Editing & Preview',
      description: 'Edit invoice details and see the final document update instantly.',
    },
    {
      title: 'Indian GST Support',
      description: 'CGST, SGST, IGST breakdowns with HSN/SAC codes and GSTIN fields.',
    },
    {
      title: 'Customizable Templates',
      description: 'Professional layouts with your brand colors, typography, and logo.',
    },
    {
      title: 'Automatic Calculations',
      description: 'Line totals, subtotals, taxes, discounts, and grand totals computed instantly.',
    },
    {
      title: 'Browser-Based PDF Export',
      description: 'Generate high-quality PDFs locally — no server upload required.',
    },
  ];

  return (
    <section id="features-detail" className="features-section" aria-labelledby="features-detail-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="features-detail-heading" className="section-title">Core Capabilities</h2>
          <p className="section-subtitle">
            Everything you need to create, customize, and send professional invoices — without the complexity.
          </p>
        </header>

        <div className="features-grid">
          {features.map((feature, index) => (
            <article key={feature.title} className="feature-card animate-slide-up" style={{ animationDelay: `${index * 0.08}s` }}>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/editor')} aria-label="Start creating invoices with Khata">
            Create an Invoice
            <ArrowRightIcon className="btn-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}