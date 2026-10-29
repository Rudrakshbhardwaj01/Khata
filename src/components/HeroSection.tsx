import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './icons';

export function HeroSection() {
  const navigate = useNavigate();

  const handleStartCreating = () => {
    navigate('/editor');
  };

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-container">
        <div className="hero-content">

          <h1 id="hero-heading" className="hero-brand animate-slide-up stagger-1">
            खाता
          </h1>

          <h2 className="hero-headline animate-slide-up stagger-2">
            Create professional invoices in minutes.
          </h2>

          <p className="hero-subheadline animate-slide-up stagger-3">
            Create, customize, and export professional invoices — entirely in your browser.
          </p>

          <div className="hero-actions animate-slide-up stagger-4">
            <button
              className="btn btn--primary btn--lg"
              onClick={handleStartCreating}
              aria-label="Start creating invoices"
            >
              Create an Invoice
              <ArrowRightIcon className="btn-icon" aria-hidden="true" />
            </button>
          </div>

          <div className="hero-badge animate-fade-in">
            <span>Open Source</span>
            <span className="badge-separator" aria-hidden="true">·</span>
            <span>No Signups</span>
            <span className="badge-separator" aria-hidden="true">·</span>
            <span>Runs in Your Browser</span>
          </div>

        </div>
      </div>
    </section>
  );
}