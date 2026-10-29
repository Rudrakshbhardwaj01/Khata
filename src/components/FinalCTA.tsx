import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './icons';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section id="cta" className="final-cta" aria-labelledby="cta-heading">
      <div className="section-container">
        <div className="cta-card animate-fade-in">
          <h2 id="cta-heading" className="cta-title">Ready to Create Your Invoice?</h2>
          <p className="cta-subtitle">
            No signups. No backend. Completely open source.
          </p>
          <div className="cta-actions">
            <button
              className="btn btn--primary btn--lg"
              onClick={() => navigate('/editor')}
              aria-label="Open Khata Invoice Editor"
            >
              Open Khata Now
              <ArrowRightIcon className="btn-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}