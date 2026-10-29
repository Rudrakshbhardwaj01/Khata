import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon } from './icons';

const steps = [
  {
    number: '01',
    title: 'Enter Details',
    description: 'Add business and customer info, line items, and taxes.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    highlights: [
      'Business & customer details',
      'Line items with HSN/SAC',
      'Automatic tax calculations',
    ],
  },
  {
    number: '02',
    title: 'Customize',
    description: 'Choose a template, add your logo, and set brand colors.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    highlights: [
      'Professional templates',
      'Logo upload & colors',
      'Real-time preview',
    ],
  },
  {
    number: '03',
    title: 'Download',
    description: 'Generate a high-quality PDF and share with your client.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    highlights: [
      'High-quality PDF export',
      'Client-ready formatting',
      'Works in your browser',
    ],
  },
];

export function WorkflowSection() {
  const navigate = useNavigate();
  return (
    <section id="workflow" className="workflow-section" aria-labelledby="workflow-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="workflow-heading" className="section-title">Create Your Invoice in 3 Steps</h2>
          <p className="section-subtitle">
            From blank page to professional PDF in minutes.
          </p>
        </header>

        <div className="workflow-grid">
          {steps.map((step, index) => (
            <article key={step.number} className="workflow-step animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon" aria-hidden="true">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              
              <ul className="step-highlights" role="list">
                {step.highlights.map((highlight, hIndex) => (
                  <li key={hIndex} className="step-highlight">
                    <CheckIcon className="highlight-icon" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              
              {index < steps.length - 1 && (
                <div className="step-connector" aria-hidden="true">
                  <ArrowRightIcon />
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/editor')} aria-label="Start creating your first invoice">
            Create Your First Invoice
            <ArrowRightIcon className="btn-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}