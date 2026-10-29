import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, FileTextIcon, UserIcon, PackageIcon, SettingsIcon, LayoutIcon } from '../../components/icons';
import './EditorSidebar.css';

interface EditorSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  onClose: (open: boolean) => void;
  open: boolean;
}

const tabIcons: Record<string, React.ReactNode> = {
  details: <FileTextIcon />,
  seller: <UserIcon />,
  customer: <UserIcon />,
  items: <PackageIcon />,
  tax: <SettingsIcon />,
  customization: <LayoutIcon />,
  preview: <EyeIcon />,
};

export function EditorSidebar({ activeTab, onTabChange, tabs, onClose, open }: EditorSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1200);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!open && isMobile) {
    return (
      <button
        className="sidebar-toggle"
        onClick={() => onClose(true)}
        aria-label="Open sidebar"
      >
        <ChevronRightIcon aria-hidden="true" />
      </button>
    );
  }

  return (
    <aside className="editor-sidebar" aria-label="Editor sections" style={{ width: open ? '280px' : '0', overflow: 'hidden' }}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-brand-wordmark" style={{ fontFamily: 'var(--brand)' }}>खाता</span>
          <span className="sidebar-section-label">EDITOR</span>
        </div>
        {isMobile && (
          <button className="sidebar-close" onClick={() => onClose(false)} aria-label="Close sidebar">
            <ChevronLeftIcon aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Editor sections">
        <ul role="list">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`sidebar-item ${activeTab === tab.id ? 'sidebar-item--active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="sidebar-item-icon" aria-hidden="true">
                  {tabIcons[tab.id] || tab.icon}
                </span>
                <span className="sidebar-item-label">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}