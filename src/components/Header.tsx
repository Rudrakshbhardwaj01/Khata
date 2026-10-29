import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from './icons';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'GST Support', href: '#gst-support' },
  ];

  const handleNavClick = (href: string) => {
    if (location.pathname === '/') {
      setIsMobileMenuOpen(false);
      const element = document.getElementById(href.slice(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(href.slice(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <a href="/" className="brand" aria-label="Khata - Home" onClick={(e) => {
          if (location.pathname !== '/') {
            e.preventDefault();
            navigate('/');
          }
        }}>
          खाता
        </a>

        <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`} role="navigation" aria-label="Main navigation">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <a 
                  href={item.href} 
                  className="nav-link" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="btn btn--primary btn--nav-cta"
            onClick={() => {
              if (location.pathname === '/') {
                navigate('/editor');
              } else {
                navigate('/editor');
              }
            }}
            aria-label="Open Khata Invoice Editor"
          >
             Create an invoice 
            <ChevronRightIcon className="btn-icon" aria-hidden="true" />
          </button>
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="mobile-menu-bar" aria-hidden="true" />
          <span className="mobile-menu-bar" aria-hidden="true" />
          <span className="mobile-menu-bar" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}