import type { Invoice } from '../../types/invoice.ts';
import type { CSSProperties } from 'react';

export interface TemplateRendererProps {
  invoice: Invoice;
  options: {
    compact?: boolean;
    formatCurrency: (value: number) => string;
    formatDate: (dateStr: string) => string;
    formatNumber: (value: number) => string;
    supplyType: 'IntraState' | 'InterState';
  };
}

/*
 * All sizes below target a 794 px-wide canvas (A4 at 96 dpi).
 * The preview container scales this canvas to fit any viewport.
 */

const STYLES: Record<string, CSSProperties> = {
  document: {
    fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    color: '#111827',
    background: '#ffffff',
    padding: '40px 44px',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '1120px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },

  /* ── Header ── */
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '18px',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '28px',
    gap: '24px',
    minWidth: 0,
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    flexShrink: 1,
    minWidth: 0,
  },
  brandLogoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  brandWordmark: {
    fontFamily: "'Gajraj One', cursive, sans-serif",
    fontSize: '36px',
    fontWeight: 400,
    color: '#111827',
    lineHeight: 1.15,
    letterSpacing: '-0.01em',
  },
  invoiceTitle: {
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.28em',
    color: '#1f2937',
    marginTop: '4px',
  },

  /* ── Meta table (right side of header) ── */
  metaTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'right',
    flexShrink: 1,
    minWidth: 0,
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    fontSize: '13px',
    alignItems: 'baseline',
  },
  metaLabel: {
    color: '#6b7280',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  metaValue: {
    color: '#111827',
    fontWeight: 600,
    minWidth: '100px',
    maxWidth: '180px',
    textAlign: 'right',
    wordBreak: 'break-all',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  /* ── Parties ── */
  partiesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '28px',
    fontSize: '13px',
    lineHeight: 1.6,
  },
  partyCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    overflow: 'hidden',
  },
  partyLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '4px',
  },
  partyName: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '4px',
    overflowWrap: 'break-word',
  },
  partyAddress: {
    color: '#4b5563',
    fontStyle: 'normal',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    overflowWrap: 'break-word',
  },
  partyMetaList: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  partyMetaRow: {
    display: 'flex',
    gap: '16px',
    fontSize: '12.5px',
  },
  partyMetaKey: {
    color: '#6b7280',
    width: '50px',
    flexShrink: 0,
  },
  partyMetaVal: {
    color: '#111827',
    fontWeight: 500,
    overflowWrap: 'break-word',
    minWidth: 0,
  },

  /* ── Items table ── */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '4px',
    fontSize: '12px',
    tableLayout: 'fixed',
  },
  th: {
    textAlign: 'center',
    padding: '10px 6px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#4b5563',
    background: '#f4f5f7',
    borderBottom: '1px solid #d1d5db',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  thLeft: {
    textAlign: 'left',
    paddingLeft: '10px',
  },
  thRight: {
    textAlign: 'right',
    paddingRight: '10px',
  },
  td: {
    padding: '10px 6px',
    borderBottom: '1px solid #e5e7eb',
    color: '#1f2937',
    verticalAlign: 'top',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tdLeft: {
    textAlign: 'left',
    paddingLeft: '10px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },
  tdRight: {
    textAlign: 'right',
    paddingRight: '10px',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },

  /* ── Financial summary ── */
  summaryWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
    marginTop: '4px',
  },
  summaryBox: {
    width: '300px',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '3px 0',
    color: '#4b5563',
  },
  summaryRowVal: {
    color: '#111827',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
  },
  totalCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #111827',
    borderRadius: '4px',
    padding: '10px 14px',
    marginTop: '6px',
    color: '#111827',
    background: '#ffffff',
  },
  totalLabel: {
    fontSize: '15px',
    fontWeight: 700,
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: 800,
    fontVariantNumeric: 'tabular-nums',
  },

  /* ── Divider ── */
  divider: {
    border: 'none',
    borderTop: '1px solid #e5e7eb',
    margin: '20px 0',
  },

  /* ── Lower sections (notes / payment) ── */
  lowerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    fontSize: '12.5px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 8px 0',
  },
  bodyText: {
    color: '#4b5563',
    lineHeight: 1.6,
    margin: 0,
    whiteSpace: 'pre-line',
    overflowWrap: 'break-word',
  },
  bankRow: {
    display: 'flex',
    gap: '12px',
    padding: '2px 0',
  },
  bankKey: {
    color: '#6b7280',
    width: '110px',
    flexShrink: 0,
  },
  bankVal: {
    color: '#111827',
    fontWeight: 500,
    overflowWrap: 'break-word',
    minWidth: 0,
  },

  /* ── Footer ── */
  footerGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    fontSize: '12px',
    marginTop: 'auto',
    paddingTop: '12px',
    gap: '24px',
  },
  closingWordmark: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    color: '#4b5563',
    flexShrink: 0,
  },
  closingWordmarkText: {
    fontFamily: "'Gajraj One', cursive, sans-serif",
    fontSize: '24px',
    color: '#111827',
    lineHeight: 1,
  },
};

/*
  * Column widths as percentages of the table.
  * Total = 100 %.
  * When HSN is hidden, its share is added to Description.
  */
const COL_WIDTHS = {
  num:    '5%',     // #
  desc:   '28%',    // Description (without HSN: 37%)
  hsn:    '9%',     // HSN/SAC
  qty:    '6%',     // Qty
  unit:   '7%',     // Unit
  price:  '14%',    // Unit Price
  disc:   '6%',     // Disc %
  tax:    '8%',     // Tax Rate
  amount: '12%',    // Amount
} as const;

const COL_WIDTHS_NO_HSN = {
  num:    '5%',
  desc:   '37%',
  qty:    '6%',
  unit:   '7%',
  price:  '14%',
  disc:   '6%',
  tax:    '8%',
  amount: '12%',
} as const;

export function modernTemplate(invoice: Invoice, options: TemplateRendererProps['options']) {
  const { formatCurrency, formatDate } = options;
  const totals = invoice.totals;

  const hasHsn = invoice.items.some(i => Boolean(i.hsnSac?.trim()));
  const nonZeroRateItem = invoice.items.find(i => (i.taxRate || 0) > 0);
  const taxRate = nonZeroRateItem?.taxRate || 18;
  const halfRate = taxRate / 2;

  const sellerAddr = invoice.seller.address;
  const customerAddr = invoice.customer.address;
  const bank = invoice.seller.bankDetails;

  const cw = hasHsn ? COL_WIDTHS : COL_WIDTHS_NO_HSN;

  return (
    <div className="invoice-document-sheet" style={STYLES.document}>
      {/* ─── 1. Header ─── */}
      <header style={STYLES.header}>
        <div style={STYLES.brandSection}>
          <div style={STYLES.brandLogoRow}>
            <span style={STYLES.brandWordmark}>खाता</span>
            {invoice.customization?.logo && (
              <img
                src={invoice.customization.logo}
                alt="Logo"
                style={{ height: '36px', maxWidth: '120px', objectFit: 'contain' }}
              />
            )}
          </div>
          <span style={STYLES.invoiceTitle}>INVOICE</span>
        </div>

        <div style={STYLES.metaTable}>
          <div style={STYLES.metaRow}>
            <span style={STYLES.metaLabel}>Invoice #</span>
            <span style={STYLES.metaValue}>{invoice.metadata.invoiceNumber || '-'}</span>
          </div>
          <div style={STYLES.metaRow}>
            <span style={STYLES.metaLabel}>Date</span>
            <span style={STYLES.metaValue}>{formatDate(invoice.metadata.invoiceDate) || '-'}</span>
          </div>
          {invoice.metadata.dueDate && (
            <div style={STYLES.metaRow}>
              <span style={STYLES.metaLabel}>Due Date</span>
              <span style={STYLES.metaValue}>{formatDate(invoice.metadata.dueDate)}</span>
            </div>
          )}
        </div>
      </header>

      {/* ─── 2. Parties ─── */}
      <section style={STYLES.partiesGrid}>
        {/* From */}
        <div style={STYLES.partyCol}>
          <span style={STYLES.partyLabel}>From</span>
          <strong style={STYLES.partyName}>{invoice.seller.name || 'Seller Business Name'}</strong>
          <address style={STYLES.partyAddress}>
            {sellerAddr?.line1 && <span>{sellerAddr.line1}</span>}
            {sellerAddr?.line2 && <span>{sellerAddr.line2}</span>}
            {(sellerAddr?.city || sellerAddr?.state) && (
              <span>
                {[sellerAddr.city, sellerAddr.state ? `${sellerAddr.state} ${sellerAddr.pincode || ''}`.trim() : sellerAddr.pincode].filter(Boolean).join(', ')}
              </span>
            )}
            {sellerAddr?.country && <span>{sellerAddr.country}</span>}
          </address>

          {(invoice.seller.gstin || invoice.seller.email || invoice.seller.phone) && (
            <div style={STYLES.partyMetaList}>
              {invoice.seller.gstin && (
                <div style={STYLES.partyMetaRow}>
                  <span style={STYLES.partyMetaKey}>GSTIN</span>
                  <span style={STYLES.partyMetaVal}>{invoice.seller.gstin}</span>
                </div>
              )}
              {invoice.seller.email && (
                <div style={STYLES.partyMetaRow}>
                  <span style={STYLES.partyMetaKey}>Email</span>
                  <span style={STYLES.partyMetaVal}>{invoice.seller.email}</span>
                </div>
              )}
              {invoice.seller.phone && (
                <div style={STYLES.partyMetaRow}>
                  <span style={STYLES.partyMetaKey}>Phone</span>
                  <span style={STYLES.partyMetaVal}>{invoice.seller.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bill To */}
        <div style={STYLES.partyCol}>
          <span style={STYLES.partyLabel}>Bill To</span>
          <strong style={STYLES.partyName}>{invoice.customer.name || 'Customer Name'}</strong>
          <address style={STYLES.partyAddress}>
            {customerAddr?.line1 && <span>{customerAddr.line1}</span>}
            {customerAddr?.line2 && <span>{customerAddr.line2}</span>}
            {(customerAddr?.city || customerAddr?.state) && (
              <span>
                {[customerAddr.city, customerAddr.state ? `${customerAddr.state} ${customerAddr.pincode || ''}`.trim() : customerAddr.pincode].filter(Boolean).join(', ')}
              </span>
            )}
            {customerAddr?.country && <span>{customerAddr.country}</span>}
          </address>

          {(invoice.customer.gstin || invoice.customer.email || invoice.customer.phone) && (
            <div style={STYLES.partyMetaList}>
              {invoice.customer.gstin && (
                <div style={STYLES.partyMetaRow}>
                  <span style={STYLES.partyMetaKey}>GSTIN</span>
                  <span style={STYLES.partyMetaVal}>{invoice.customer.gstin}</span>
                </div>
              )}
              {invoice.customer.email && (
                <div style={STYLES.partyMetaRow}>
                  <span style={STYLES.partyMetaKey}>Email</span>
                  <span style={STYLES.partyMetaVal}>{invoice.customer.email}</span>
                </div>
              )}
              {invoice.customer.phone && (
                <div style={STYLES.partyMetaRow}>
                  <span style={STYLES.partyMetaKey}>Phone</span>
                  <span style={STYLES.partyMetaVal}>{invoice.customer.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── 3. Items Table ─── */}
      <table style={STYLES.table}>
        <colgroup>
          <col style={{ width: cw.num }} />
          <col style={{ width: cw.desc }} />
          {hasHsn && <col style={{ width: (cw as typeof COL_WIDTHS).hsn }} />}
          <col style={{ width: cw.qty }} />
          <col style={{ width: cw.unit }} />
          <col style={{ width: cw.price }} />
          <col style={{ width: cw.disc }} />
          <col style={{ width: cw.tax }} />
          <col style={{ width: cw.amount }} />
        </colgroup>
        <thead>
          <tr>
            <th style={STYLES.th}>#</th>
            <th style={{ ...STYLES.th, ...STYLES.thLeft }}>Description</th>
            {hasHsn && <th style={STYLES.th}>HSN/SAC</th>}
            <th style={STYLES.th}>Qty</th>
            <th style={STYLES.th}>Unit</th>
            <th style={{ ...STYLES.th, ...STYLES.thRight }}>Unit Price</th>
            <th style={STYLES.th}>Disc %</th>
            <th style={STYLES.th}>Tax Rate</th>
            <th style={{ ...STYLES.th, ...STYLES.thRight }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.length === 0 ? (
            <tr>
              <td colSpan={hasHsn ? 9 : 8} style={{ ...STYLES.td, padding: '24px', color: '#9ca3af' }}>
                No line items added yet.
              </td>
            </tr>
          ) : (
            invoice.items.map((item, index) => (
              <tr key={item.id || index}>
                <td style={STYLES.td}>{index + 1}</td>
                <td style={{ ...STYLES.td, ...STYLES.tdLeft, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {item.description || '-'}
                </td>
                {hasHsn && <td style={STYLES.td}>{item.hsnSac || '-'}</td>}
                <td style={STYLES.td}>{item.quantity}</td>
                <td style={STYLES.td}>{item.unit || 'Nos'}</td>
                <td style={{ ...STYLES.td, ...STYLES.tdRight }}>{formatCurrency(item.unitPrice)}</td>
                <td style={STYLES.td}>{item.discountPercent || 0}%</td>
                <td style={STYLES.td}>{item.taxRate || 0}%</td>
                <td style={{ ...STYLES.td, ...STYLES.tdRight, fontWeight: 500 }}>{formatCurrency(item.totalAmount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ─── 4. Financial Summary ─── */}
      <div style={STYLES.summaryWrapper}>
        <div style={STYLES.summaryBox}>
          <div style={STYLES.summaryRow}>
            <span>Subtotal</span>
            <span style={STYLES.summaryRowVal}>{formatCurrency(totals.subtotal)}</span>
          </div>

          <div style={STYLES.summaryRow}>
            <span>Total Discount</span>
            <span style={STYLES.summaryRowVal}>- {formatCurrency(totals.totalDiscount || 0)}</span>
          </div>

          <div style={STYLES.summaryRow}>
            <span>Taxable Value</span>
            <span style={STYLES.summaryRowVal}>{formatCurrency(totals.taxableValue)}</span>
          </div>

          {totals.cgst > 0 && (
            <div style={STYLES.summaryRow}>
              <span>CGST ({halfRate}%)</span>
              <span style={STYLES.summaryRowVal}>{formatCurrency(totals.cgst)}</span>
            </div>
          )}

          {totals.sgst > 0 && (
            <div style={STYLES.summaryRow}>
              <span>SGST ({halfRate}%)</span>
              <span style={STYLES.summaryRowVal}>{formatCurrency(totals.sgst)}</span>
            </div>
          )}

          {totals.igst > 0 && (
            <div style={STYLES.summaryRow}>
              <span>IGST ({taxRate}%)</span>
              <span style={STYLES.summaryRowVal}>{formatCurrency(totals.igst)}</span>
            </div>
          )}

          <div style={STYLES.totalCard}>
            <span style={STYLES.totalLabel}>Total</span>
            <span style={STYLES.totalValue}>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      <hr style={STYLES.divider} />

      {/* ─── 5. Notes & Payment Details ─── */}
      <section style={STYLES.lowerGrid}>
        <div>
          <h4 style={STYLES.sectionTitle}>Notes</h4>
          <p style={STYLES.bodyText}>
            {invoice.metadata.notes || 'Thank you for your business.'}
          </p>
        </div>

        <div>
          <h4 style={STYLES.sectionTitle}>Payment Details</h4>
          {bank && (bank.accountNumber || bank.bankName) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {bank.bankName && (
                <div style={STYLES.bankRow}>
                  <span style={STYLES.bankKey}>Bank Name</span>
                  <span style={STYLES.bankVal}>{bank.bankName}</span>
                </div>
              )}
              {bank.accountName && (
                <div style={STYLES.bankRow}>
                  <span style={STYLES.bankKey}>Account Name</span>
                  <span style={STYLES.bankVal}>{bank.accountName}</span>
                </div>
              )}
              {bank.accountNumber && (
                <div style={STYLES.bankRow}>
                  <span style={STYLES.bankKey}>Account Number</span>
                  <span style={STYLES.bankVal}>{bank.accountNumber}</span>
                </div>
              )}
              {bank.ifsc && (
                <div style={STYLES.bankRow}>
                  <span style={STYLES.bankKey}>IFSC Code</span>
                  <span style={STYLES.bankVal}>{bank.ifsc}</span>
                </div>
              )}
              <div style={STYLES.bankRow}>
                <span style={STYLES.bankKey}>Account Type</span>
                <span style={STYLES.bankVal}>{bank.accountType || bank.branch || 'Current Account'}</span>
              </div>
            </div>
          ) : (
            <p style={{ ...STYLES.bodyText, color: '#9ca3af' }}>No bank details provided.</p>
          )}
        </div>
      </section>

      <hr style={STYLES.divider} />

      {/* ─── 6. Footer ─── */}
      <footer style={STYLES.footerGrid}>
        <div style={{ maxWidth: '60%', minWidth: 0 }}>
          <h4 style={STYLES.sectionTitle}>Terms & Conditions</h4>
          <p style={{ ...STYLES.bodyText, fontSize: '11.5px' }}>
            {invoice.metadata.paymentTerms || 'Payment is due within 30 days from the date of this invoice.'}
          </p>
        </div>

        <div style={STYLES.closingWordmark}>
          <span>Thank you for your business!</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#9ca3af' }}>—</span>
            <span style={STYLES.closingWordmarkText}>खाता</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function classicTemplate(invoice: Invoice, options: TemplateRendererProps['options']) {
  return modernTemplate(invoice, options);
}

export function creativeTemplate(invoice: Invoice, options: TemplateRendererProps['options']) {
  return modernTemplate(invoice, options);
}

export const templateRenderers: Record<string, (invoice: Invoice, options: TemplateRendererProps['options']) => React.ReactElement> = {
  modern: modernTemplate,
  classic: classicTemplate,
  creative: creativeTemplate,
};
