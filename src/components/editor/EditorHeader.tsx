import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../components/icons';
import './EditorHeader.css';

interface EditorHeaderProps {
  onNewInvoice: () => void;
  onDownloadPDF: () => void;
  invoiceNumber: string;
}

export function EditorHeader({ onNewInvoice, onDownloadPDF, invoiceNumber }: EditorHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="editor-header">
      <div className="editor-header-inner">
        <div className="editor-header-left">
          <button className="btn btn--ghost btn--icon" onClick={() => navigate('/')} aria-label="Back to home">
            <ChevronLeftIcon className="btn-icon" aria-hidden="true" />
          </button>
          <span className="editor-header-brand">खाता</span>
          <span className="editor-header-separator" aria-hidden="true">/</span>
          <span className="editor-header-title">{invoiceNumber}</span>
        </div>

        <div className="editor-header-actions">
          <button className="btn btn--secondary" onClick={onNewInvoice} aria-label="New invoice">
            <span className="btn-icon">+</span>
            New
          </button>
          
          <button className="btn btn--primary" onClick={onDownloadPDF} aria-label="Download PDF">
            <span className="btn-icon">⬇</span>
            Download PDF
          </button>
        </div>
      </div>
    </header>
  );
}
