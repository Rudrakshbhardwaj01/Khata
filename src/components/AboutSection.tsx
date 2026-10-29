import { ArrowRightIcon, CheckIcon } from './icons';

interface AboutSectionProps {
  onOpenApp?: () => void;
}

export function AboutSection({ onOpenApp }: AboutSectionProps) {
  const principles = [
    {
      title: 'Open Source First',
      description: 'Khata is built in the open. Every line of code is visible, auditable, and community-driven. No hidden agendas, no vendor lock-in.',
    },
    {
      title: 'Privacy by Design',
      description: 'Your invoices, your data, your device. No accounts, no cloud sync, no tracking. Everything runs locally in your browser using modern web APIs.',
    },
    {
      title: 'No Gatekeeping',
      description: 'Free to use, free to modify, free to distribute. No feature gates, no subscription tiers, no artificial limits. Professional invoicing for everyone.',
    },
    {
      title: 'Crafted with Care',
      description: 'Every interaction, animation, and pixel is deliberately designed. We believe invoicing software should be beautiful, not just functional.',
    },
  ];

  const techStack = [
    'React 18 + TypeScript',
    'Vite for blazing fast builds',
    'Client-side PDF generation',
    'IndexedDB for local storage',
    'Web Components for portability',
    'Zero runtime dependencies',
  ];

  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="about-heading" className="section-title">Why Khata Exists</h2>
          <p className="section-subtitle">
            Invoicing shouldn\'t require a degree in accounting or a monthly subscription. We built Khata to be the tool we wanted to use.
          </p>
        </header>

        <div className="about-grid">
          <div className="about-principles animate-slide-up">
            <h3 className="about-subtitle">Our Principles</h3>
            <ul className="principles-list" role="list">
              {principles.map((principle, index) => (
                <li key={principle.title} className="principle-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CheckIcon className="principle-icon" aria-hidden="true" />
                  <div className="principle-content">
                    <h4 className="principle-title">{principle.title}</h4>
                    <p className="principle-description">{principle.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-tech animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="about-subtitle">Built With Modern Technology</h3>
            <p className="about-tech-description">
              Khata leverages the latest web platform capabilities to deliver a native-app experience in your browser.
            </p>
            <ul className="tech-list" role="list">
              {techStack.map((tech, index) => (
                <li key={tech} className="tech-item" style={{ animationDelay: `${index * 0.04}s` }}>
                  <span className="tech-dot" aria-hidden="true" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="about-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button className="btn btn--primary btn--lg" onClick={onOpenApp} aria-label="Try Khata now">
            Try Khata Now
            <ArrowRightIcon className="btn-icon" aria-hidden="true" />
          </button>
          <p className="cta-note">No signup required · Works offline · 100% free</p>
        </div>
      </div>
    </section>
  );
}