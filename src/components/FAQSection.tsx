import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, ArrowRightIcon } from './icons';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'what-is-khata',
    question: 'What is Khata?',
    answer:
      'Khata is an open-source, browser-based tool for creating professional invoices. It runs entirely in your browser without requiring a server, account, or backend. You enter your invoice details, configure taxes and branding, and download a PDF — all locally.',
  },
  {
    id: 'is-free',
    question: 'Is Khata free to use?',
    answer:
      'Yes. Khata is free and open source, released under the MIT License. There are no subscriptions, pricing tiers, or paid features. The source code is available on GitHub for anyone to inspect, modify, or self-host.',
  },
  {
    id: 'data-privacy',
    question: 'Is my invoice data private and secure?',
    answer:
      'All invoice creation, calculations, preview rendering, and PDF generation happen locally in your browser. Khata does not send your invoice data to any server. Your data exists only in browser memory — refreshing or closing the page discards unsaved work. We recommend exporting important invoices as PDF before leaving.',
  },
  {
    id: 'gst-support',
    question: 'Can I create GST invoices?',
    answer:
      'Yes. Khata supports India-specific GST with intra-state (CGST + SGST) and inter-state (IGST) tax treatment, HSN/SAC codes, GSTIN fields, and place-of-supply selection. Calculations follow the configured rules. You are responsible for verifying that your invoices meet all applicable legal requirements.',
  },
  {
    id: 'customization-pdf',
    question: 'Can I customize my invoices and download them as PDFs?',
    answer:
      'Yes. You can choose between three layout templates (Modern, Classic, Creative), select an accent color, pick a font family, upload a logo, and adjust logo position. Click "Download PDF" in the editor to generate a professional A4 document with your invoice details, line items, tax breakdown, and branding — all generated locally in the browser.',
  },
  {
    id: 'no-account',
    question: 'Do I need to create an account or install anything?',
    answer:
      'No. Khata runs entirely in your browser — no registration, login, installation, or authentication required. Open the page and start creating invoices immediately. No account needed, nothing to install.',
  },
];

export function FAQSection() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="faq" className="faq-section" aria-labelledby="faq-heading">
      <div className="section-container">
        <header className="section-header animate-fade-in">
          <h2 id="faq-heading" className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know before creating your first invoice.
          </p>
        </header>

        <div className="faq-grid">
          <div className="faq-intro animate-slide-up">
            <p className="faq-intro-text">
              Khata is designed to be simple, private, and transparent. If your question isn't answered here,
              the source code and issue tracker are always open.
            </p>
          </div>

          <div className="faq-accordion" role="list" aria-label="Frequently asked questions">
            {faqItems.map((item, index) => (
              <article
                key={item.id}
                className="faq-item animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                role="listitem"
              >
                <button
                  type="button"
                  className={`faq-trigger ${openItems.has(item.id) ? 'faq-trigger--open' : ''}`}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={openItems.has(item.id)}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-trigger-${item.id}`}
                >
                  <span className="faq-question">{item.question}</span>
                  <ChevronRightIcon
                    className={`faq-chevron ${openItems.has(item.id) ? 'faq-chevron--open' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-answer-${item.id}`}
                  className="faq-answer"
                  role="region"
                  aria-labelledby={`faq-trigger-${item.id}`}
                  hidden={!openItems.has(item.id)}
                >
                  <div className="faq-answer-content">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="section-cta animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button
            className="btn btn--primary btn--lg"
            onClick={() => navigate('/editor')}
            aria-label="Open Khata Invoice Editor"
          >
            Ready to Create Your Invoice?
            <ArrowRightIcon className="btn-icon" aria-hidden="true" />
          </button>
          <p className="cta-note">Start with a blank invoice and make it your own.</p>
        </div>
      </div>
    </section>
  );
}