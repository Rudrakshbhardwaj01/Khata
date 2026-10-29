import { useNavigate } from 'react-router-dom';
import { ShieldIcon, ServerIcon, LockIcon, GlobeIcon } from './icons';

const privacyFeatures = [
  {
    icon: <ShieldIcon />,
    title: 'No Account Required',
    description: 'Start invoicing immediately. No registration, no email verification, no password.',
  },
  {
    icon: <ServerIcon />,
    title: 'No Backend Required',
    description: 'Invoice creation, calculations, and PDF export run entirely in your browser.',
  },
  {
    icon: <LockIcon />,
    title: 'Your Data Stays Local',
    description: 'Invoice data is stored in your browser. Export anytime as PDF or JSON.',
  },
  {
    icon: <GlobeIcon />,
    title: 'Works Offline',
    description: 'After the initial load, create and export invoices without an internet connection.',
  },
];

export function PrivacySection() {
  const navigate = useNavigate();
  return (
    <section id="privacy" className="privacy-section" aria-labelledby="privacy-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="privacy-heading" className="section-title">Your Invoices Stay in Your Hands</h2>
          <p className="section-subtitle">
            Create and export invoices in your browser without uploading them to a server for core processing.
          </p>
        </header>

        <div className="privacy-grid">
          {privacyFeatures.map((feature, index) => (
            <article key={feature.title} className="privacy-card animate-slide-up" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="privacy-icon" aria-hidden="true">{feature.icon}</div>
              <h3 className="privacy-card-title">{feature.title}</h3>
              <p className="privacy-card-description">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="privacy-note animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>
            <strong>Note:</strong> Invoice data is stored in your browser and persists across sessions. 
            Clearing browser data will remove your invoices. We recommend exporting important invoices as PDF or JSON for backup.
          </p>
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/editor')} aria-label="Try Khata now - no account needed">
            Try Khata Now
            <span className="btn-icon" aria-hidden="true">→</span>
          </button>
          <p className="cta-note">No signup · No backend · Free · Open source</p>
        </div>
      </div>
    </section>
  );
}