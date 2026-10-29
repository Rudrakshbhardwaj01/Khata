import { useNavigate } from 'react-router-dom';
import { StarIcon, ZapIcon, HeartIcon, CodeIcon } from './icons';

const principles = [
  {
    icon: <StarIcon />,
    title: 'Professional Without Complexity',
    description: 'Invoicing software shouldn\'t require a degree in accounting. Khata focuses on the essentials so you can bill clients and get back to work.',
  },
  {
    icon: <ZapIcon />,
    title: 'Instant Setup, Zero Friction',
    description: 'No account creation, no onboarding. Open the app, enter details, and download a professional invoice in under a minute.',
  },
  {
    icon: <HeartIcon />,
    title: 'Privacy by Design',
    description: 'Your financial data never leaves your browser. No accounts means no database of your invoices. Your business stays your business.',
  },
  {
    icon: <CodeIcon />,
    title: 'Open Source, Always Free',
    description: 'MIT-licensed and built in public. No feature gates, no subscriptions. The core product will always be free.',
  },
];

export function SocialProofSection() {
  const navigate = useNavigate();
  return (
    <section id="principles" className="principles-section" aria-labelledby="principles-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="principles-heading" className="section-title">Built on Better Principles</h2>
          <p className="section-subtitle">
            Khata exists because invoicing software has become bloated, expensive, and invasive. We chose a different path.
          </p>
        </header>

        <div className="principles-grid">
          {principles.map((principle, index) => (
            <article key={principle.title} className="principle-card animate-slide-up" style={{ animationDelay: `${index * 0.06}s` }}>
              <div className="principle-icon" aria-hidden="true">{principle.icon}</div>
              <h3 className="principle-title">{principle.title}</h3>
              <p className="principle-description">{principle.description}</p>
            </article>
          ))}
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/editor')} aria-label="Experience Khata for yourself">
            Experience Khata
            <span className="btn-icon" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}