import { useNavigate, useLocation } from 'react-router-dom';
import { GitHubIcon } from './icons';

const CURRENT_YEAR = new Date().getFullYear();
const GITHUB_URL = 'https://github.com/Rudrakshbhardwaj01/Khata';
const PORTFOLIO_URL = 'https://rudrakshbhardwaj.vercel.app/';

const navLinks = [
  { label: 'Features', href: '#features-detail' },
  { label: 'Templates', href: '#templates' },
  { label: 'GST Support', href: '#gst-support' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-main">
        {/* Left: Branding */}
        <div className="footer-brand">
          <a href="/" className="footer-brand-link" aria-label="Khata - Home" onClick={handleBrandClick}>
            खाता
          </a>
          <p className="footer-tagline">Create professional invoices in minutes.</p>
        </div>

        {/* Center: Navigation */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <ul className="footer-nav-list" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="footer-nav-link"
                  onClick={(e) => handleNavClick(link.href, e as React.MouseEvent<HTMLAnchorElement>)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: GitHub */}
        <div className="footer-github">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github-link"
            aria-label="View Khata on GitHub"
          >
            <GitHubIcon className="footer-github-icon" aria-hidden="true" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {CURRENT_YEAR} Khata. Open Source. No Signups. Runs in Your Browser.
        </p>
        <p className="footer-creator">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-creator-link"
            aria-label="View Rudraksh Bharadwaj's portfolio"
          >
            Made by Rudraksh Bhardwaj
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </p>
      </div>
    </footer>
  );
}