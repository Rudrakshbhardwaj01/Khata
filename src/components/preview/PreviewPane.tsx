import { useRef, useState, useEffect, useCallback } from 'react';
import { useInvoiceStore } from '../../store/invoiceStore';
import { templateRenderers } from '../templates/templateRenderers';
import { getCurrencyOption } from '../../types/invoice';
import './PreviewPane.css';

interface PreviewPaneProps {
  compact?: boolean;
}

/** Fixed design width of the A4 invoice sheet (px). */
const SHEET_WIDTH = 794;

export function PreviewPane({ compact = false }: PreviewPaneProps) {
  const { invoice } = useInvoiceStore();
  const renderer = templateRenderers[invoice.customization.template] || templateRenderers.modern;

  const supplyType = invoice.seller.address.stateCode === invoice.metadata.placeOfSupply
    ? 'IntraState'
    : 'InterState';

  const currencyOption = getCurrencyOption(invoice.metadata.currency);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currencyOption.locale, {
      style: 'currency',
      currency: invoice.metadata.currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(currencyOption.locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  /* ---- Dynamic scaling ---- */
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(() => {
    if (typeof window !== 'undefined') {
      const available = window.innerWidth - 120; // account for padding and margins
      return available >= SHEET_WIDTH ? 1 : available / SHEET_WIDTH;
    }
    return 1;
  });

  const recalcScale = useCallback(() => {
    if (!containerRef.current) return;
    // Available width minus padding (24px each side)
    const available = containerRef.current.clientWidth - 48;
    setScale(available >= SHEET_WIDTH ? 1 : available / SHEET_WIDTH);
  }, []);

  useEffect(() => {
    recalcScale();
    const ro = new ResizeObserver(recalcScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [recalcScale]);

  return (
    <div className={`preview-pane ${compact ? 'preview-pane--compact' : ''}`}>
      <div className="preview-header">
        <h3 className="preview-title">
          {compact ? 'Live Preview' : 'Invoice Preview'}
        </h3>
        <span className="preview-badge">
          Monochrome A4
        </span>
      </div>

      <div className="preview-container" ref={containerRef}>
        <div
          className="invoice-document-paper"
          style={{
            '--font-family': invoice.customization.fontFamily,
            width: `${SHEET_WIDTH}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          } as React.CSSProperties}
        >
          {renderer(invoice, {
            compact,
            formatCurrency,
            formatDate,
            formatNumber: (value: number) => new Intl.NumberFormat(currencyOption.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
            supplyType
          })}
        </div>
      </div>
    </div>
  );
}
