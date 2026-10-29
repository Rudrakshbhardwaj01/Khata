import { TemplateIcon, GSTIcon, CustomizeIcon, PrivacyIcon } from './icons';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <TemplateIcon />,
    title: 'Professional Templates',
    description: 'Clean, modern designs for every business.',
  },
  {
    icon: <GSTIcon />,
    title: 'GST Ready',
    description: 'Create invoices with Indian GST support.',
  },
  {
    icon: <CustomizeIcon />,
    title: 'Fully Customizable',
    description: 'Your brand colors, fonts, and logo.',
  },
  {
    icon: <PrivacyIcon />,
    title: '100% Private',
    description: 'Runs in your browser. No account required.',
  },
];

export function FeatureStrip() {
  return (
    <section id="features" className="feature-strip" aria-labelledby="features-heading">
      <div className="feature-strip-container">
        <div className="feature-strip-card">
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article key={feature.title} className="feature-item animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}